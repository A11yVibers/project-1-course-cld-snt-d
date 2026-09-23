import { useMemo, useState } from 'react'
import { courses, getAllInstructors } from '../data/dataset.js'
import CourseCard from './CourseCard.jsx'
import SearchFilterBar from './SearchFilterBar.jsx'

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const instructors = useMemo(() => getAllInstructors(), [])

  const filteredCourses = useMemo(() => {
    const needle = query.trim().toLowerCase()

    let result = courses.filter((course) => {
      const matchesQuery =
        !needle ||
        course.name.toLowerCase().includes(needle) ||
        course.shortDescription.toLowerCase().includes(needle) ||
        course.longDescription.toLowerCase().includes(needle)

      const matchesInstructor =
        instructorId === 'all' || course.instructor?.instructor_id === instructorId

      return matchesQuery && matchesInstructor
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'weeks-asc') return a.numberOfWeeks - b.numberOfWeeks
      if (sortBy === 'weeks-desc') return b.numberOfWeeks - a.numberOfWeeks
      return a.name.localeCompare(b.name)
    })

    return result
  }, [query, instructorId, sortBy])

  const handleClear = () => {
    setQuery('')
    setInstructorId('all')
    setSortBy('name')
  }

  return (
    <main className="catalog-page" id="main-content">
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">Chronicle History Courses</p>
        <h1 className="catalog-hero__title">Walk through the past, one course at a time</h1>
        <p className="catalog-hero__subtitle">
          Twelve self-paced courses spanning ancient civilizations to the modern era &mdash;
          taught by historians, built around primary sources, lectures, and readings.
        </p>
      </section>

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        instructorId={instructorId}
        onInstructorChange={setInstructorId}
        instructors={instructors}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filteredCourses.length}
        onClear={handleClear}
      />

      <h2 className="visually-hidden">Course catalog</h2>
      {filteredCourses.length > 0 ? (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="catalog-empty">
          No courses match your search. Try a different keyword or clear your filters.
        </p>
      )}
    </main>
  )
}
