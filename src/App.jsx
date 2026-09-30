import { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import CourseCatalog from './pages/CourseCatalog.jsx'
import CoursePage from './pages/CoursePage.jsx'
import { courses, instructors, getCourseById } from './data/dataset.js'

export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)

  const selectedCourse = useMemo(
    () => (selectedCourseId ? getCourseById(selectedCourseId) : null),
    [selectedCourseId]
  )

  const goHome = () => setSelectedCourseId(null)

  return (
    <div className="app-shell">
      <Header onNavigateHome={goHome} crumb={selectedCourse?.name} />
      {selectedCourse ? (
        <CoursePage key={selectedCourse.course_id} course={selectedCourse} />
      ) : (
        <CourseCatalog
          courses={courses}
          instructors={instructors}
          onSelectCourse={setSelectedCourseId}
        />
      )}
    </div>
  )
}
