// Loads and joins the immutable source data shipped in project-assets/.
// The CSV/markdown/pdf/video files there are treated as read-only inputs:
// this module only imports, parses, and links them into the shape the UI needs.
import Papa from 'papaparse'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

// Binary / large materials are resolved to build-safe URLs via Vite's glob
// import so the actual files are never duplicated or re-hosted by hand.
const materialFileUrls = import.meta.glob('../../project-assets/materials/*.{pdf,mp4,mp3,pptx,docx}', {
  query: '?url',
  import: 'default',
  eager: true,
})

// Small text-based materials (assignment instructions, notes) are pulled in
// as raw text so they can be rendered directly in the material viewer.
const materialFileText = import.meta.glob('../../project-assets/materials/*.{md,txt}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function basename(path) {
  return path.split('/').pop()
}

function findByBasename(map, filePath) {
  const target = basename(filePath)
  const key = Object.keys(map).find((k) => basename(k) === target)
  return key ? map[key] : undefined
}

function parseCsv(raw) {
  // Source files use inconsistent line endings (some rows CRLF, some LF-only);
  // normalize before parsing so every row is split correctly.
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  const { data } = Papa.parse(normalized, { header: true, skipEmptyLines: true })
  return data
}

function toYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else if (parsed.searchParams.has('v')) {
      videoId = parsed.searchParams.get('v')
    } else {
      const parts = parsed.pathname.split('/')
      videoId = parts[parts.length - 1]
    }
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return url
  }
}

function resolveMaterial(row) {
  const { material_id, display_order, material_title, material_type, file_path } = row
  const type = (material_type || '').toLowerCase().trim()
  const base = {
    id: material_id,
    order: Number(display_order) || 0,
    title: material_title,
    type,
  }

  if (/^https?:\/\//i.test(file_path)) {
    if (type === 'youtube') {
      return { ...base, href: file_path, embedUrl: toYouTubeEmbedUrl(file_path) }
    }
    return { ...base, href: file_path }
  }

  if (type === 'md' || type === 'markdown' || type === 'txt') {
    const content = findByBasename(materialFileText, file_path)
    return { ...base, content: content ?? '', href: findByBasename(materialFileUrls, file_path) }
  }

  const url = findByBasename(materialFileUrls, file_path)
  return { ...base, href: url }
}

function buildData() {
  const instructorRows = parseCsv(instructorsCsv)
  const courseRows = parseCsv(coursesCsv)
  const classRows = parseCsv(classesCsv)
  const materialRows = parseCsv(materialsCsv)

  const instructorsById = new Map(
    instructorRows.map((row) => [
      row.instructor_id,
      { id: row.instructor_id, name: row.name, email: row.email, photoUrl: row.photo_url },
    ])
  )

  const materialsByClassId = new Map()
  materialRows.forEach((row) => {
    if (!row.class_id) return
    const material = resolveMaterial(row)
    const list = materialsByClassId.get(row.class_id) || []
    list.push(material)
    materialsByClassId.set(row.class_id, list)
  })
  materialsByClassId.forEach((list) => list.sort((a, b) => a.order - b.order))

  const classesByCourseId = new Map()
  classRows.forEach((row) => {
    if (!row.course_id) return
    const classItem = {
      id: row.class_id,
      week: Number(row.week_number),
      date: row.date,
      name: row.class_name,
      materials: materialsByClassId.get(row.class_id) || [],
    }
    const list = classesByCourseId.get(row.course_id) || []
    list.push(classItem)
    classesByCourseId.set(row.course_id, list)
  })
  classesByCourseId.forEach((list) =>
    list.sort((a, b) => a.week - b.week || new Date(a.date) - new Date(b.date))
  )

  const courses = courseRows
    .filter((row) => row.course_id)
    .map((row) => ({
      id: row.course_id,
      name: row.name,
      shortDescription: row.short_description,
      longDescription: row.long_description,
      numberOfClasses: Number(row.number_of_classes),
      numberOfWeeks: Number(row.number_of_weeks),
      instructor: instructorsById.get(row.instructor_id),
      imageUrl: row.image_url,
      classes: classesByCourseId.get(row.course_id) || [],
    }))

  return { courses, instructorsById }
}

const { courses } = buildData()

export function getCourses() {
  return courses
}

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId)
}
