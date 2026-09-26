import { useMemo, useState } from 'react'
import { DURATION_LABELS, durationBucket } from '../utils.js'

export default function CourseCatalog({ courses, onSelectCourse }) {
  const [search, setSearch] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [duration, setDuration] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const instructorOptions = useMemo(() => {
    const seen = new Map()
    for (const course of courses) {
      if (course.instructor) seen.set(course.instructor.instructor_id, course.instructor.name)
    }
    return Array.from(seen.entries())
  }, [courses])

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = courses.filter((course) => {
      const matchesSearch =
        !query ||
        [course.name, course.shortDescription, course.instructor?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      const matchesInstructor = instructorId === 'all' || course.instructor?.instructor_id === instructorId
      const matchesDuration = duration === 'all' || durationBucket(course.numberOfWeeks) === duration
      return matchesSearch && matchesInstructor && matchesDuration
    })

    if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'weeks') {
      list = [...list].sort((a, b) => a.numberOfWeeks - b.numberOfWeeks)
    }
    return list
  }, [courses, search, instructorId, duration, sortBy])

  return (
    <div className="catalog">
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">Online History Courses</p>
        <h1 className="catalog-hero__title">Walk through the past, one course at a time</h1>
        <p className="catalog-hero__subtitle">
          Twelve courses spanning ancient civilizations to the twentieth century. Search the catalog,
          filter by instructor or course length, and step into a course to explore its syllabus and
          class materials.
        </p>
      </section>

      <section className="catalog-controls" aria-label="Search and filter courses">
        <input
          type="search"
          className="catalog-controls__search"
          placeholder="Search courses, topics, or instructors…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search courses"
        />

        <label className="catalog-controls__field">
          <span>Instructor</span>
          <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
            <option value="all">All instructors</option>
            {instructorOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-controls__field">
          <span>Length</span>
          <select value={duration} onChange={(event) => setDuration(event.target.value)}>
            <option value="all">Any length</option>
            {Object.entries(DURATION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-controls__field">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Featured order</option>
            <option value="name">Course name</option>
            <option value="weeks">Duration</option>
          </select>
        </label>
      </section>

      <p className="catalog-results-count">
        {visibleCourses.length} of {courses.length} courses
      </p>

      <div className="course-grid">
        {visibleCourses.map((course) => (
          <button
            key={course.id}
            type="button"
            className="course-card"
            onClick={() => onSelectCourse(course.id)}
          >
            <div className="course-card__image-wrap">
              <img src={course.imageUrl} alt="" loading="lazy" />
            </div>
            <div className="course-card__body">
              <h2 className="course-card__title">{course.name}</h2>
              <p className="course-card__description">{course.shortDescription}</p>
              <div className="course-card__meta">
                <span>{course.numberOfWeeks} weeks</span>
                <span aria-hidden="true">·</span>
                <span>{course.numberOfClasses} classes</span>
              </div>
              {course.instructor && (
                <div className="course-card__instructor">
                  <img src={course.instructor.photo_url} alt="" />
                  <span>{course.instructor.name}</span>
                </div>
              )}
            </div>
          </button>
        ))}
        {visibleCourses.length === 0 && (
          <p className="course-grid__empty">No courses match your search and filters.</p>
        )}
      </div>
    </div>
  )
}
