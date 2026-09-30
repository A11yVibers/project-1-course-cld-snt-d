import { formatClassDate } from '../data/format.js'
import MaterialList from './MaterialList.jsx'

export default function SyllabusTable({ classes, activeMaterialId, onSelectMaterial }) {
  if (!classes || classes.length === 0) {
    return <p className="material-list-empty">The syllabus for this course is not available yet.</p>
  }

  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th scope="col">Week</th>
          <th scope="col">Date</th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((classInfo) => (
          <tr key={classInfo.class_id}>
            <td className="syllabus-week">{classInfo.week_number}</td>
            <td className="syllabus-date">{formatClassDate(classInfo.date)}</td>
            <td className="syllabus-content">
              <p className="syllabus-class-title">{classInfo.class_name}</p>
              <MaterialList
                classInfo={classInfo}
                activeMaterialId={activeMaterialId}
                onSelectMaterial={onSelectMaterial}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
