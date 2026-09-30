import { useState } from 'react'
import SyllabusTable from '../components/SyllabusTable.jsx'
import MaterialViewer from '../components/MaterialViewer.jsx'

export default function CoursePage({ course }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)

  const handleSelectMaterial = (material, classInfo) => {
    setActiveMaterial({ material, classInfo })
  }

  return (
    <main className={`course-page${leftCollapsed ? ' left-collapsed' : ''}`}>
      <section className="course-left" aria-hidden={leftCollapsed}>
        <div className="course-left-inner">
          <div className="course-info">
            <p className="course-code-badge">{course.course_id}</p>
            <h1>{course.name}</h1>
            {course.instructor && (
              <div className="instructor-badge">
                <img src={course.instructor.photo_url} alt="" className="avatar avatar-md" />
                <div>
                  <p className="instructor-name">{course.instructor.name}</p>
                  <a className="instructor-email" href={`mailto:${course.instructor.email}`}>
                    {course.instructor.email}
                  </a>
                </div>
              </div>
            )}
            <dl className="course-stats">
              <div>
                <dt>Weeks</dt>
                <dd>{course.number_of_weeks}</dd>
              </div>
              <div>
                <dt>Classes</dt>
                <dd>{course.number_of_classes}</dd>
              </div>
            </dl>
            <p className="course-long-description">{course.long_description}</p>
          </div>

          <div className="syllabus">
            <h2>Syllabus</h2>
            <div className="syllabus-scroll">
              <SyllabusTable
                classes={course.classes}
                activeMaterialId={activeMaterial?.material.material_id}
                onSelectMaterial={handleSelectMaterial}
              />
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="collapse-toggle"
        onClick={() => setLeftCollapsed((value) => !value)}
        aria-expanded={!leftCollapsed}
        aria-label={leftCollapsed ? 'Show course information and syllabus' : 'Hide course information and syllabus'}
        title={leftCollapsed ? 'Show course info' : 'Hide course info'}
      >
        <span aria-hidden="true">{leftCollapsed ? '›' : '‹'}</span>
      </button>

      <section className="course-right">
        <MaterialViewer
          course={course}
          activeMaterial={activeMaterial}
          onClear={() => setActiveMaterial(null)}
        />
      </section>
    </main>
  )
}
