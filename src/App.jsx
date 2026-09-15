import { courses, instructors, getCourseById } from './data.js'
import { useHashRoute } from './useHashRoute.js'
import Catalog from './components/Catalog.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  const { route, goToCatalog, goToCourse } = useHashRoute()
  const activeCourse = route.name === 'course' ? getCourseById(route.courseId) : null

  return (
    <div className="app">
      <header className="app-header">
        <button type="button" className="app-header__brand" onClick={goToCatalog}>
          <span className="app-header__mark" aria-hidden="true">Ω</span>
          <span>
            Epoch <em>History</em>
          </span>
        </button>
        <p className="app-header__tagline">A digital home for the study of history</p>
      </header>

      <main>
        {activeCourse ? (
          <CoursePage course={activeCourse} onBack={goToCatalog} />
        ) : (
          <Catalog courses={courses} instructors={instructors} onOpenCourse={goToCourse} />
        )}
      </main>

      <footer className="app-footer">
        <p>Epoch History Platform · Course content curated for self-paced study</p>
      </footer>
    </div>
  )
}
