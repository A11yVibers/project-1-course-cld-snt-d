export default function CourseCard({ course, onOpen }) {
  return (
    <article className="course-card" onClick={() => onOpen(course.id)} tabIndex={0}
      role="button" aria-label={`Open ${course.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(course.id) }}>
      <div className="course-card__media">
        <img src={course.imageUrl} alt={course.name} loading="lazy" />
        <span className="course-card__code">{course.id}</span>
      </div>
      <div className="course-card__body">
        <h3>{course.name}</h3>
        <p>{course.shortDescription}</p>
      </div>
      <div className="course-card__meta">
        <span>{course.numberOfWeeks} weeks</span>
        <span aria-hidden="true">·</span>
        <span>{course.numberOfClasses} classes</span>
        {course.instructor && (
          <span className="course-card__instructor">
            <img src={course.instructor.photoUrl} alt="" aria-hidden="true" />
            {course.instructor.name}
          </span>
        )}
      </div>
    </article>
  )
}
