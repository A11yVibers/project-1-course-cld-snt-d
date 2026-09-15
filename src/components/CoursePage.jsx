import { useState } from 'react'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage({ course, onBack }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)

  const handleSelectMaterial = (material) => {
    setActiveMaterial((current) => (current?.id === material.id ? null : material))
  }

  return (
    <div className="course-page">
      <div className="course-page__nav">
        <button type="button" className="course-page__back" onClick={onBack}>
          ← All courses
        </button>
        <p className="course-page__crumb">{course.id}</p>
      </div>

      <div className={'course-page__panels' + (collapsed ? ' course-page__panels--collapsed' : '')}>
        <section
          className={'course-panel' + (collapsed ? ' course-panel--collapsed' : '')}
          aria-label="Course information and syllabus"
        >
          <button
            type="button"
            className="course-panel__toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand course details' : 'Collapse course details'}
          >
            {collapsed ? '»' : '«'}
          </button>

          {!collapsed && (
            <div className="course-panel__content">
              <header className="course-panel__header">
                <h1>{course.name}</h1>
                <p className="course-panel__summary">{course.shortDescription}</p>
                <div className="course-panel__stats">
                  <span>{course.numberOfWeeks} weeks</span>
                  <span aria-hidden="true">·</span>
                  <span>{course.numberOfClasses} classes</span>
                </div>
                {course.instructor && (
                  <div className="course-panel__instructor">
                    <img src={course.instructor.photoUrl} alt={course.instructor.name} />
                    <div>
                      <p className="course-panel__instructor-name">{course.instructor.name}</p>
                      <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
                    </div>
                  </div>
                )}
                <p className="course-panel__description">{course.longDescription}</p>
              </header>

              <div className="course-panel__syllabus">
                <h2>Syllabus</h2>
                {course.classes.length > 0 ? (
                  <Syllabus
                    classes={course.classes}
                    activeMaterialId={activeMaterial?.id}
                    onSelectMaterial={handleSelectMaterial}
                  />
                ) : (
                  <p className="course-panel__no-classes">The syllabus for this course is coming soon.</p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="material-panel" aria-label="Course image and material viewer">
          <MaterialViewer
            course={course}
            material={activeMaterial}
            onClear={() => setActiveMaterial(null)}
          />
        </section>
      </div>
    </div>
  )
}
