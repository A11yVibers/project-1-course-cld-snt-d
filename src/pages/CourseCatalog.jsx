import { useMemo, useState } from 'react'
import CourseCard from '../components/CourseCard.jsx'

const LENGTH_FILTERS = {
  all: () => true,
  short: (course) => course.number_of_weeks <= 5,
  standard: (course) => course.number_of_weeks >= 6 && course.number_of_weeks <= 7,
  extended: (course) => course.number_of_weeks >= 8,
}

const SORTERS = {
  title: (a, b) => a.name.localeCompare(b.name),
  weeks: (a, b) => a.number_of_weeks - b.number_of_weeks,
  classes: (a, b) => a.number_of_classes - b.number_of_classes,
}

export default function CourseCatalog({ courses, instructors, onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [length, setLength] = useState('all')
  const [sortBy, setSortBy] = useState('title')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return courses
      .filter((course) => {
        if (!needle) return true
        const haystack = [
          course.name,
          course.short_description,
          course.long_description,
          course.instructor?.name,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(needle)
      })
      .filter((course) => instructorId === 'all' || course.instructor_id === instructorId)
      .filter(LENGTH_FILTERS[length])
      .sort(SORTERS[sortBy])
  }, [courses, query, instructorId, length, sortBy])

  const resultLabel =
    filtered.length === courses.length
      ? `${courses.length} courses`
      : `${filtered.length} of ${courses.length} courses`

  return (
    <main className="catalog">
      <section className="catalog-hero">
        <h1>Explore history, one course at a time</h1>
        <p>
          Twelve courses spanning pharaohs to world wars &mdash; taught by a small faculty of
          specialists and organized into week-by-week syllabi with readings, lectures, and
          assignments you can open right on the page.
        </p>
      </section>

      <section className="catalog-controls" aria-label="Search and filter courses">
        <label className="catalog-search">
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            placeholder="Search by title, topic, or instructor&hellip;"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="catalog-filter">
          <span>Instructor</span>
          <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.instructor_id} value={instructor.instructor_id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-filter">
          <span>Length</span>
          <select value={length} onChange={(event) => setLength(event.target.value)}>
            <option value="all">Any length</option>
            <option value="short">Short (&le;5 weeks)</option>
            <option value="standard">Standard (6&ndash;7 weeks)</option>
            <option value="extended">Extended (8+ weeks)</option>
          </select>
        </label>

        <label className="catalog-filter">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="title">Title (A&ndash;Z)</option>
            <option value="weeks">Weeks (fewest first)</option>
            <option value="classes">Classes (fewest first)</option>
          </select>
        </label>
      </section>

      <p className="catalog-result-count">{resultLabel}</p>

      {filtered.length === 0 ? (
        <p className="catalog-empty">No courses match your search. Try a different term or filter.</p>
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard key={course.course_id} course={course} onSelect={onSelectCourse} />
          ))}
        </div>
      )}
    </main>
  )
}
