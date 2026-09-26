import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card-image">
        <img src={course.imageUrl} alt="" loading="lazy" />
        <span className="course-card-code">{course.id}</span>
      </div>
      <div className="course-card-body">
        <h3>{course.name}</h3>
        <p>{course.shortDescription}</p>
      </div>
      <div className="course-card-footer">
        <span className="pill">{course.numberOfWeeks} weeks</span>
        <span className="pill">{course.numberOfClasses} classes</span>
        {course.instructor && (
          <span className="instructor-chip">
            <img src={course.instructor.photoUrl} alt="" />
            {course.instructor.name}
          </span>
        )}
      </div>
    </Link>
  )
}
