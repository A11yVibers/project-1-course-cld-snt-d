// Loads and joins the immutable source data from project-assets/.
// Nothing in project-assets/ is modified here -- files are only read,
// parsed, and linked into the shape the UI needs.
import Papa from 'papaparse'

import coursesCsv from '../project-assets/history_courses.csv?raw'
import classesCsv from '../project-assets/history_classes.csv?raw'
import instructorsCsv from '../project-assets/history_instructors.csv?raw'
import materialsCsv from '../project-assets/course_materials.csv?raw'

// Every file that lives under project-assets/materials/ gets a build-time
// URL from Vite. This keeps the original files untouched while still
// letting the app link to (and, for markdown, read) their content.
const materialFileUrls = import.meta.glob('../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const materialFileText = import.meta.glob('../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseCsv(raw) {
  // Some of the source CSVs mix "\r\n" and bare "\n" line endings, which
  // trips up newline auto-detection and merges rows together. Normalizing
  // here only affects the in-memory string used for parsing -- the files
  // under project-assets/ themselves are never touched.
  const normalized = raw.replace(/\r\n?/g, '\n')
  const { data } = Papa.parse(normalized, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => (typeof v === 'string' ? v.trim() : v),
  })
  return data
}

function resolveLocalFile(filePath) {
  const key = `../project-assets/${filePath}`
  return materialFileUrls[key] || null
}

function resolveLocalText(filePath) {
  const key = `../project-assets/${filePath}`
  return materialFileText[key] || null
}

function toYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else if (parsed.searchParams.has('v')) {
      videoId = parsed.searchParams.get('v')
    } else {
      const parts = parsed.pathname.split('/').filter(Boolean)
      videoId = parts[parts.length - 1] || ''
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch {
    return url
  }
}

const MATERIAL_TYPE_META = {
  pdf: { label: 'PDF Reading', icon: '📄' },
  video: { label: 'Lecture Video', icon: '🎬' },
  youtube: { label: 'Video Link', icon: '▶️' },
  md: { label: 'Assignment', icon: '📝' },
}

function materialTypeMeta(type) {
  return MATERIAL_TYPE_META[type] || { label: 'Resource', icon: '🔗' }
}

function buildMaterial(row) {
  const isRemote = row.material_type === 'youtube'
  const meta = materialTypeMeta(row.material_type)
  return {
    id: row.material_id,
    classId: row.class_id,
    courseId: row.course_id,
    order: Number(row.display_order) || 0,
    title: row.material_title,
    type: row.material_type,
    typeLabel: meta.label,
    icon: meta.icon,
    url: isRemote ? row.file_path : resolveLocalFile(row.file_path),
    embedUrl: isRemote ? toYoutubeEmbedUrl(row.file_path) : null,
    textContent: row.material_type === 'md' ? resolveLocalText(row.file_path) : null,
  }
}

function buildData() {
  const instructorRows = parseCsv(instructorsCsv)
  const courseRows = parseCsv(coursesCsv)
  const classRows = parseCsv(classesCsv)
  const materialRows = parseCsv(materialsCsv)

  const instructorsById = new Map(instructorRows.map((row) => [row.instructor_id, {
    id: row.instructor_id,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url,
  }]))

  const materialsByClassId = new Map()
  materialRows.forEach((row) => {
    if (!row.class_id) return
    const material = buildMaterial(row)
    const list = materialsByClassId.get(row.class_id) || []
    list.push(material)
    materialsByClassId.set(row.class_id, list)
  })
  materialsByClassId.forEach((list) => list.sort((a, b) => a.order - b.order))

  const classesByCourseId = new Map()
  classRows.forEach((row) => {
    if (!row.course_id) return
    const list = classesByCourseId.get(row.course_id) || []
    list.push({
      id: row.class_id,
      courseId: row.course_id,
      weekNumber: Number(row.week_number) || 0,
      date: row.date,
      title: row.class_name,
      materials: materialsByClassId.get(row.class_id) || [],
    })
    classesByCourseId.set(row.course_id, list)
  })
  classesByCourseId.forEach((list) => {
    list.sort((a, b) => (a.weekNumber - b.weekNumber) || a.date.localeCompare(b.date))
  })

  const courses = courseRows
    .filter((row) => row.course_id)
    .map((row) => ({
      id: row.course_id,
      name: row.name,
      shortDescription: row.short_description,
      longDescription: row.long_description,
      numberOfClasses: Number(row.number_of_classes) || 0,
      numberOfWeeks: Number(row.number_of_weeks) || 0,
      instructor: instructorsById.get(row.instructor_id) || null,
      imageUrl: row.image_url,
      classes: classesByCourseId.get(row.course_id) || [],
    }))

  return { courses, instructors: Array.from(instructorsById.values()) }
}

const { courses, instructors } = buildData()

export { courses, instructors }

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) || null
}
