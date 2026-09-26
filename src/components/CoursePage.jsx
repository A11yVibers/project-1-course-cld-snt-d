import { useState } from 'react'
import MaterialViewer from './MaterialViewer.jsx'
import { formatClassDate, materialTypeLabel } from '../utils.js'

export default function CoursePage({ course, onBack }) {
  const [leftOpen, setLeftOpen] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  function selectMaterial(material) {
    setSelectedMaterial(material)
  }

  function showCourseImage() {
    setSelectedMaterial(null)
  }

  return (
    <div className={`course-page ${leftOpen ? '' : 'course-page--collapsed'}`}>
      <button type="button" className="course-page__back" onClick={onBack}>
        ← Back to catalog
      </button>

      <div className="course-page__layout">
        <section
          className={`course-info-pane ${leftOpen ? '' : 'course-info-pane--collapsed'}`}
          aria-label="Course information and syllabus"
        >
          <button
            type="button"
            className="course-info-pane__toggle"
            onClick={() => setLeftOpen((open) => !open)}
            aria-expanded={leftOpen}
            title={leftOpen ? 'Collapse course details' : 'Expand course details'}
          >
            {leftOpen ? '⟨' : '⟩'}
          </button>

          {leftOpen && (
            <div className="course-info-pane__content">
              <header className="course-header">
                <h1>{course.name}</h1>
                <p className="course-header__short">{course.shortDescription}</p>

                <dl className="course-stats">
                  <div>
                    <dt>Weeks</dt>
                    <dd>{course.numberOfWeeks}</dd>
                  </div>
                  <div>
                    <dt>Classes</dt>
                    <dd>{course.numberOfClasses}</dd>
                  </div>
                </dl>

                {course.instructor && (
                  <div className="course-instructor">
                    <img src={course.instructor.photo_url} alt="" />
                    <div>
                      <p className="course-instructor__name">{course.instructor.name}</p>
                      <a className="course-instructor__email" href={`mailto:${course.instructor.email}`}>
                        {course.instructor.email}
                      </a>
                    </div>
                  </div>
                )}

                <p className="course-header__long">{course.longDescription}</p>
              </header>

              <section className="syllabus" aria-label="Course syllabus">
                <h2>Syllabus</h2>
                <table className="syllabus-table">
                  <thead>
                    <tr>
                      <th scope="col">Week</th>
                      <th scope="col">Date</th>
                      <th scope="col">Class Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.classes.map((cls) => (
                      <tr key={cls.id}>
                        <td className="syllabus-table__week">{cls.weekNumber}</td>
                        <td className="syllabus-table__date">{formatClassDate(cls.date)}</td>
                        <td className="syllabus-table__content">
                          <p className="class-title">{cls.name}</p>
                          {cls.materials.length > 0 ? (
                            <ul className="material-list">
                              {cls.materials.map((material) => (
                                <li key={material.id}>
                                  <button
                                    type="button"
                                    className={
                                      'material-chip' +
                                      (selectedMaterial?.id === material.id ? ' material-chip--active' : '')
                                    }
                                    onClick={() => selectMaterial(material)}
                                  >
                                    <span
                                      className={`material-chip__badge material-chip__badge--${material.type}`}
                                    >
                                      {materialTypeLabel(material.type)}
                                    </span>
                                    {material.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-materials">No materials posted yet</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          )}
        </section>

        <section className="course-viewer" aria-label="Course material viewer">
          <div className="course-viewer__header">
            {selectedMaterial ? (
              <>
                <div className="course-viewer__header-title">
                  <span className={`material-chip__badge material-chip__badge--${selectedMaterial.type}`}>
                    {materialTypeLabel(selectedMaterial.type)}
                  </span>
                  <h3>{selectedMaterial.title}</h3>
                </div>
                <button type="button" className="course-viewer__reset" onClick={showCourseImage}>
                  Show course image
                </button>
              </>
            ) : (
              <h3>{course.name}</h3>
            )}
          </div>
          <div className="course-viewer__body">
            {selectedMaterial ? (
              <MaterialViewer material={selectedMaterial} />
            ) : (
              <img className="course-viewer__image" src={course.imageUrl} alt={course.name} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
