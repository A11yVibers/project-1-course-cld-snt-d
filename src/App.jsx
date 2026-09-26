import { useEffect, useState } from 'react'
import CourseCatalog from './components/CourseCatalog.jsx'
import CoursePage from './components/CoursePage.jsx'
import { courses, getCourseById } from './data/loadData.js'

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const [section, courseId] = hash.split('/').filter(Boolean)
  if (section === 'course' && courseId) {
    return { view: 'course', courseId }
  }
  return { view: 'catalog' }
}

export default function App() {
  const [route, setRoute] = useState(parseRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function goToCatalog() {
    window.location.hash = '#/'
  }

  function goToCourse(courseId) {
    window.location.hash = `#/course/${courseId}`
  }

  const activeCourse = route.view === 'course' ? getCourseById(route.courseId) : null

  return (
    <div className="app-shell">
      <header className="site-header">
        <button type="button" className="site-header__brand" onClick={goToCatalog}>
          <span className="site-header__mark">Ⳙ</span>
          <span>Historia</span>
        </button>
        <p className="site-header__tagline">A digital home for history courses</p>
      </header>

      <main className="site-main">
        {route.view === 'course' && activeCourse ? (
          <CoursePage key={activeCourse.id} course={activeCourse} onBack={goToCatalog} />
        ) : route.view === 'course' ? (
          <div className="not-found">
            <p>We couldn&rsquo;t find that course.</p>
            <button type="button" onClick={goToCatalog}>
              Back to catalog
            </button>
          </div>
        ) : (
          <CourseCatalog courses={courses} onSelectCourse={goToCourse} />
        )}
      </main>
    </div>
  )
}
