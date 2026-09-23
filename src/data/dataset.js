// Reads the immutable source data in project-assets/ (CSVs + supporting
// material files) and derives a normalized, cross-referenced dataset for the
// app to consume. Nothing in project-assets/ is written to or altered here.
import { parseCsv } from './parseCsv.js'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

// Binary/streamable supporting files (lecture videos, PDFs) are pulled in as
// resolved asset URLs; Markdown assignment files are pulled in as raw text
// so they can be rendered in the material viewer.
const binaryMaterialFiles = import.meta.glob(
  '../../project-assets/materials/*.{pdf,mp4,PDF,MP4}',
  { eager: true, query: '?url', import: 'default' }
)
const textMaterialFiles = import.meta.glob(
  '../../project-assets/materials/*.{md,MD}',
  { eager: true, query: '?raw', import: 'default' }
)

function basename(path) {
  return path.split('/').pop()
}

const binaryByFilename = Object.fromEntries(
  Object.entries(binaryMaterialFiles).map(([path, url]) => [basename(path), url])
)
const textByFilename = Object.fromEntries(
  Object.entries(textMaterialFiles).map(([path, content]) => [basename(path), content])
)

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else {
      videoId = parsed.searchParams.get('v') || ''
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  } catch {
    return url
  }
}

const instructors = parseCsv(instructorsCsv)
const instructorsById = Object.fromEntries(instructors.map((i) => [i.instructor_id, i]))

const rawMaterials = parseCsv(materialsCsv)
const materialsByClassId = {}
for (const row of rawMaterials) {
  const material = {
    id: row.material_id,
    courseId: row.course_id,
    classId: row.class_id,
    order: Number(row.display_order) || 0,
    title: row.material_title,
    type: row.material_type,
  }

  if (material.type === 'youtube') {
    material.url = row.file_path
    material.embedUrl = youtubeEmbedUrl(row.file_path)
  } else if (material.type === 'md') {
    material.content = textByFilename[basename(row.file_path)] ?? ''
  } else {
    // pdf, video, and any other file-based supporting material
    material.url = binaryByFilename[basename(row.file_path)] ?? row.file_path
  }

  if (!materialsByClassId[material.classId]) materialsByClassId[material.classId] = []
  materialsByClassId[material.classId].push(material)
}
for (const classId of Object.keys(materialsByClassId)) {
  materialsByClassId[classId].sort((a, b) => a.order - b.order)
}

const rawClasses = parseCsv(classesCsv)
const classesByCourseId = {}
for (const row of rawClasses) {
  const klass = {
    id: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number) || 0,
    date: row.date,
    name: row.class_name,
    materials: materialsByClassId[row.class_id] ?? [],
  }
  if (!classesByCourseId[klass.courseId]) classesByCourseId[klass.courseId] = []
  classesByCourseId[klass.courseId].push(klass)
}
for (const courseId of Object.keys(classesByCourseId)) {
  classesByCourseId[courseId].sort((a, b) => a.date.localeCompare(b.date))
}

const rawCourses = parseCsv(coursesCsv)
export const courses = rawCourses.map((row) => ({
  id: row.course_id,
  name: row.name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  numberOfClasses: Number(row.number_of_classes) || 0,
  numberOfWeeks: Number(row.number_of_weeks) || 0,
  instructor: instructorsById[row.instructor_id] ?? null,
  imageUrl: row.image_url,
  classes: classesByCourseId[row.course_id] ?? [],
}))

const coursesById = Object.fromEntries(courses.map((c) => [c.id, c]))

export function getCourseById(id) {
  return coursesById[id]
}

export function getAllInstructors() {
  return instructors
}
