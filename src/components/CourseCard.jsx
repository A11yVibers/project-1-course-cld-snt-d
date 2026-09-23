import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card__image-wrap">
        <img src={course.imageUrl} alt="" className="course-card__image" loading="lazy" />
        <span className="course-card__badge">{course.numberOfWeeks}-week course</span>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.name}</h3>
        <p className="course-card__description">{course.shortDescription}</p>
      </div>
      <div className="course-card__footer">
        {course.instructor && (
          <span className="course-card__instructor">
            <img
              src={course.instructor.photo_url}
              alt=""
              className="avatar avatar--sm"
            />
            {course.instructor.name}
          </span>
        )}
        <span className="course-card__meta">{course.numberOfClasses} classes</span>
      </div>
    </Link>
  )
}
