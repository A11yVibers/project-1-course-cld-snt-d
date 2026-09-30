export default function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <button
        type="button"
        className="course-card-media"
        onClick={() => onSelect(course.course_id)}
        aria-label={`Open ${course.name}`}
      >
        <img src={course.image_url} alt="" loading="lazy" />
        <span className="course-card-code">{course.course_id}</span>
      </button>
      <div className="course-card-body">
        <h3>
          <button type="button" className="course-card-title" onClick={() => onSelect(course.course_id)}>
            {course.name}
          </button>
        </h3>
        <p className="course-card-desc">{course.short_description}</p>
        <div className="course-card-meta">
          {course.instructor && (
            <span className="course-card-instructor">
              <img src={course.instructor.photo_url} alt="" className="avatar avatar-sm" />
              {course.instructor.name}
            </span>
          )}
          <span className="course-card-stats">
            {course.number_of_weeks} weeks &middot; {course.number_of_classes} classes
          </span>
        </div>
      </div>
    </article>
  )
}
