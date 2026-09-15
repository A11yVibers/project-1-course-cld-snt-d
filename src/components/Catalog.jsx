import { useMemo, useState } from 'react'
import CourseCard from './CourseCard.jsx'

const SORT_OPTIONS = [
  { value: 'default', label: 'Catalog order' },
  { value: 'name', label: 'Title (A–Z)' },
  { value: 'weeks-asc', label: 'Length (shortest first)' },
  { value: 'weeks-desc', label: 'Length (longest first)' },
]

export default function Catalog({ courses, instructors, onOpenCourse }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = courses.filter((course) => {
      const matchesQuery = !q || [course.name, course.shortDescription, course.longDescription]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
      const matchesInstructor = instructorId === 'all' || course.instructor?.id === instructorId
      return matchesQuery && matchesInstructor
    })

    list = [...list]
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'weeks-asc') list.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks)
    if (sortBy === 'weeks-desc') list.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks)
    return list
  }, [courses, query, instructorId, sortBy])

  return (
    <div className="catalog">
      <section className="catalog__hero">
        <p className="catalog__eyebrow">Epoch History Courses</p>
        <h1>Step into the centuries.</h1>
        <p className="catalog__lede">
          Twelve self-paced courses spanning ancient river valleys to twentieth-century
          battlefields, taught through weekly syllabi, primary sources, and guided
          assignments.
        </p>
      </section>

      <section className="catalog__controls" aria-label="Search and filter courses">
        <div className="catalog__search">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by title or topic…"
            aria-label="Search courses"
          />
        </div>
        <label className="catalog__field">
          <span>Instructor</span>
          <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
            ))}
          </select>
        </label>
        <label className="catalog__field">
          <span>Sort</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </section>

      <p className="catalog__count">
        {filtered.length} of {courses.length} courses
      </p>

      {filtered.length === 0 ? (
        <p className="catalog__empty">No courses match your search. Try a different term or filter.</p>
      ) : (
        <div className="catalog__grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={onOpenCourse} />
          ))}
        </div>
      )}
    </div>
  )
}
