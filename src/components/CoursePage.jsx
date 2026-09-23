import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data/dataset.js'
import CourseInfoPanel from './CourseInfoPanel.jsx'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  if (!course) {
    return (
      <main className="course-page" id="main-content">
        <p>We couldn&rsquo;t find that course.</p>
        <Link to="/" className="btn btn--primary">
          Back to the catalog
        </Link>
      </main>
    )
  }

  return (
    <main className={`course-page${collapsed ? ' course-page--collapsed' : ''}`} id="main-content">
      <section className="course-panel course-panel--left" aria-label="Course information and syllabus">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-controls="course-left-panel-body"
        >
          <span aria-hidden="true">{collapsed ? '›' : '‹'}</span>
          <span className="collapse-toggle__label">{collapsed ? 'Show details' : 'Collapse'}</span>
        </button>
        <div id="course-left-panel-body" className="course-panel__body" hidden={collapsed}>
          <CourseInfoPanel course={course} />
          <Syllabus
            classes={course.classes}
            activeMaterialId={selectedMaterial?.id}
            onSelectMaterial={setSelectedMaterial}
          />
        </div>
      </section>

      <section className="course-panel course-panel--right" aria-label="Material viewer">
        <MaterialViewer
          course={course}
          material={selectedMaterial}
          onShowOverview={() => setSelectedMaterial(null)}
        />
      </section>
    </main>
  )
}
