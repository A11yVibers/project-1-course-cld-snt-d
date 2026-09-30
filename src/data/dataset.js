// Loads and assembles the immutable project-assets/ CSVs into the shape the
// UI needs. Nothing here edits the source files - they are imported as raw
// text and parsed in memory every time the module is evaluated.
import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'
import { parseCsv } from './parseCsv.js'

const rawCourses = parseCsv(coursesCsv)
const rawClasses = parseCsv(classesCsv)
const rawInstructors = parseCsv(instructorsCsv)
const rawMaterials = parseCsv(materialsCsv)

const instructorsById = new Map(
  rawInstructors.map((instructor) => [instructor.instructor_id, instructor])
)

const materialsByClassId = new Map()
for (const material of rawMaterials) {
  const list = materialsByClassId.get(material.class_id) || []
  list.push({ ...material, display_order: Number(material.display_order) || 0 })
  materialsByClassId.set(material.class_id, list)
}
for (const list of materialsByClassId.values()) {
  list.sort((a, b) => a.display_order - b.display_order)
}

const classesByCourseId = new Map()
for (const cls of rawClasses) {
  const list = classesByCourseId.get(cls.course_id) || []
  list.push({
    ...cls,
    week_number: Number(cls.week_number) || 0,
    materials: materialsByClassId.get(cls.class_id) || [],
  })
  classesByCourseId.set(cls.course_id, list)
}
for (const list of classesByCourseId.values()) {
  list.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0))
}

export const instructors = rawInstructors

export const courses = rawCourses.map((course) => ({
  ...course,
  number_of_classes: Number(course.number_of_classes) || 0,
  number_of_weeks: Number(course.number_of_weeks) || 0,
  instructor: instructorsById.get(course.instructor_id) || null,
  classes: classesByCourseId.get(course.course_id) || [],
}))

export function getCourseById(courseId) {
  return courses.find((course) => course.course_id === courseId) || null
}

export function getInstructorById(instructorId) {
  return instructorsById.get(instructorId) || null
}
