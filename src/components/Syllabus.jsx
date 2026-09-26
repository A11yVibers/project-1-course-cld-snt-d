const TYPE_ICONS = {
  pdf: '\u{1F4C4}',
  video: '\u{1F3AC}',
  youtube: '▶️',
  md: '\u{1F4DD}',
  markdown: '\u{1F4DD}',
  txt: '\u{1F4C3}',
}

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Syllabus({ classes, selectedMaterialId, onSelectMaterial }) {
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
        {classes.map((classItem) => (
          <tr key={classItem.id}>
            <td className="syllabus-week">{classItem.week}</td>
            <td className="syllabus-date">{formatDate(classItem.date)}</td>
            <td className="syllabus-content">
              <p className="class-title">{classItem.name}</p>
              {classItem.materials.length > 0 ? (
                <ul className="material-list">
                  {classItem.materials.map((material) => (
                    <li key={material.id}>
                      <button
                        type="button"
                        className={
                          'material-link' + (selectedMaterialId === material.id ? ' is-active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                      >
                        <span className="material-icon" aria-hidden="true">
                          {TYPE_ICONS[material.type] || '\u{1F4CE}'}
                        </span>
                        {material.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-materials">Materials to be posted.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
