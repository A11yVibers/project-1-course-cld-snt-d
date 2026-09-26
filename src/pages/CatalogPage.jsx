import { useMemo, useState } from 'react'
import { getCourses } from '../data/loadData.js'
import CourseCard from '../components/CourseCard.jsx'

const SORTS = {
  title: (a, b) => a.name.localeCompare(b.name),
  weeks: (a, b) => a.numberOfWeeks - b.numberOfWeeks,
  classes: (a, b) => a.numberOfClasses - b.numberOfClasses,
}

export default function CatalogPage() {
  const courses = getCourses()
  const instructors = useMemo(() => {
    const seen = new Map()
    courses.forEach((c) => c.instructor && seen.set(c.instructor.id, c.instructor))
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [courses])

  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [sortKey, setSortKey] = useState('title')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses
      .filter((course) => {
        const matchesQuery =
          !q ||
          course.name.toLowerCase().includes(q) ||
          course.shortDescription.toLowerCase().includes(q) ||
          course.id.toLowerCase().includes(q)
        const matchesInstructor = instructorId === 'all' || course.instructor?.id === instructorId
        return matchesQuery && matchesInstructor
      })
      .sort(SORTS[sortKey])
  }, [courses, query, instructorId, sortKey])

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <p className="eyebrow">History Courses</p>
        <h1>Walk the centuries, one course at a time</h1>
        <p className="hero-copy">
          Twelve self-paced courses spanning ancient civilizations to the modern age. Search the
          catalog, pick a course, and study each week&rsquo;s lectures, readings, and assignments
          in one place.
        </p>
      </section>

      <section className="catalog-controls">
        <div className="search-field">
          <span aria-hidden="true">&#128269;</span>
          <input
            type="search"
            placeholder="Search courses by title, topic, or code&hellip;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search courses"
          />
        </div>
        <label className="control">
          <span>Instructor</span>
          <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.name}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          <span>Sort by</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="title">Title (A&ndash;Z)</option>
            <option value="weeks">Duration (weeks)</option>
            <option value="classes">Number of classes</option>
          </select>
        </label>
      </section>

      <p className="results-count">
        {filtered.length} of {courses.length} courses
      </p>

      <section className="course-grid">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No courses match your search. Try a different term or filter.</p>
        )}
      </section>
    </div>
  )
}
