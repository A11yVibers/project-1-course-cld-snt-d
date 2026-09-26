// Data layer: reads the immutable source files in project-assets/ and joins
// them into the shapes the UI needs. Nothing here duplicates course, class,
// instructor, or material information by hand -- it is all parsed from CSV.
import Papa from 'papaparse'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

// Any binary/text file referenced from course_materials.csv's file_path
// column lives under project-assets/materials/. Glob-import every file
// there (as a build-time URL for binary assets, and as raw text for
// markdown) so we can resolve a CSV-supplied relative path to something the
// browser can actually load, without hardcoding any filenames.
const materialFileUrls = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const materialFileText = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function resolveLocalPath(relativePath) {
  // relativePath looks like "materials/silk_roads_class_01_lecture.pdf"
  return `../../project-assets/${relativePath}`
}

function parseCsv(raw) {
  // Normalize line endings defensively: one of the source files mixes a
  // CRLF header with LF data rows, which otherwise confuses newline
  // auto-detection and merges every row into one.
  const normalized = raw.replace(/\r\n|\r/g, '\n').trim()
  const { data } = Papa.parse(normalized, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })
  return data
}

function toYoutubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    let videoId = ''
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.replace('/', '')
    } else if (u.searchParams.has('v')) {
      videoId = u.searchParams.get('v')
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch {
    return url
  }
}

const rawCourses = parseCsv(coursesCsv)
const rawClasses = parseCsv(classesCsv)
const rawInstructors = parseCsv(instructorsCsv)
const rawMaterials = parseCsv(materialsCsv)

const instructorsById = new Map(rawInstructors.map((row) => [row.instructor_id, row]))

function buildMaterial(row) {
  const isLocal = !/^https?:\/\//i.test(row.file_path)
  const base = {
    id: row.material_id,
    title: row.material_title,
    type: row.material_type,
    order: Number(row.display_order),
  }

  if (!isLocal) {
    if (row.material_type === 'youtube') {
      return { ...base, url: row.file_path, embedUrl: toYoutubeEmbedUrl(row.file_path) }
    }
    return { ...base, url: row.file_path }
  }

  const key = resolveLocalPath(row.file_path)
  const url = materialFileUrls[key]
  const text = materialFileText[key]
  return { ...base, url, text }
}

const materialsByClassId = new Map()
for (const row of rawMaterials) {
  const material = buildMaterial(row)
  const list = materialsByClassId.get(row.class_id) ?? []
  list.push(material)
  materialsByClassId.set(row.class_id, list)
}
for (const list of materialsByClassId.values()) {
  list.sort((a, b) => a.order - b.order)
}

const classesByCourseId = new Map()
for (const row of rawClasses) {
  const list = classesByCourseId.get(row.course_id) ?? []
  list.push({
    id: row.class_id,
    weekNumber: Number(row.week_number),
    date: row.date,
    name: row.class_name,
    materials: materialsByClassId.get(row.class_id) ?? [],
  })
  classesByCourseId.set(row.course_id, list)
}
for (const list of classesByCourseId.values()) {
  list.sort((a, b) => a.date.localeCompare(b.date))
}

export const instructors = rawInstructors

export const courses = rawCourses.map((row) => ({
  id: row.course_id,
  name: row.name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  numberOfClasses: Number(row.number_of_classes),
  numberOfWeeks: Number(row.number_of_weeks),
  imageUrl: row.image_url,
  instructor: instructorsById.get(row.instructor_id) ?? null,
  classes: classesByCourseId.get(row.course_id) ?? [],
}))

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) ?? null
}
