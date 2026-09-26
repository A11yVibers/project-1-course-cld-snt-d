import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data/loadData.js'
import Syllabus from '../components/Syllabus.jsx'
import MaterialViewer from '../components/MaterialViewer.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  if (!course) {
    return (
      <div className="not-found">
        <h1>Course not found</h1>
        <p>We couldn&rsquo;t find a course with the code &ldquo;{courseId}&rdquo;.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    )
  }

  return (
    <div className="course-page">
      <div className="course-breadcrumb">
        <Link to="/">&larr; All courses</Link>
        <span className="course-code-tag">{course.id}</span>
      </div>

      <div className={'course-layout' + (collapsed ? ' is-collapsed' : '')}>
        <aside className="course-left" aria-hidden={collapsed}>
          <div className="course-info">
            <h1>{course.name}</h1>
            {course.instructor && (
              <div className="instructor-block">
                <img src={course.instructor.photoUrl} alt="" />
                <div>
                  <p className="instructor-name">{course.instructor.name}</p>
                  <p className="instructor-email">{course.instructor.email}</p>
                </div>
              </div>
            )}
            <div className="course-stats">
              <span className="pill">{course.numberOfWeeks} weeks</span>
              <span className="pill">{course.numberOfClasses} classes</span>
            </div>
            <p className="course-long-description">{course.longDescription}</p>
          </div>

          <div className="syllabus-block">
            <h2>Syllabus</h2>
            <div className="syllabus-scroll">
              <Syllabus
                classes={course.classes}
                selectedMaterialId={selectedMaterial?.id}
                onSelectMaterial={setSelectedMaterial}
              />
            </div>
          </div>
        </aside>

        <button
          type="button"
          className="panel-toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand course information' : 'Collapse course information'}
          title={collapsed ? 'Expand course information' : 'Collapse course information'}
        >
          {collapsed ? '›' : '‹'}
        </button>

        <section className="course-right">
          <MaterialViewer
            course={course}
            material={selectedMaterial}
            onClear={() => setSelectedMaterial(null)}
          />
        </section>
      </div>
    </div>
  )
}
