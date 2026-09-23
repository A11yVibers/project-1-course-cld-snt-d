export default function CourseInfoPanel({ course }) {
  const { instructor } = course

  return (
    <div className="course-info">
      <p className="course-info__eyebrow">{course.id}</p>
      <h1 className="course-info__title">{course.name}</h1>

      <div className="course-info__stats">
        <span className="stat-chip">{course.numberOfWeeks} weeks</span>
        <span className="stat-chip">{course.numberOfClasses} classes</span>
      </div>

      {instructor && (
        <div className="instructor-card">
          <img src={instructor.photo_url} alt="" className="avatar avatar--md" />
          <div>
            <p className="instructor-card__name">{instructor.name}</p>
            <a className="instructor-card__email" href={`mailto:${instructor.email}`}>
              {instructor.email}
            </a>
          </div>
        </div>
      )}

      <p className="course-info__description">{course.longDescription}</p>
    </div>
  )
}
