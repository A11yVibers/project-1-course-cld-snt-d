function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Syllabus({ classes, activeMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus">
      <thead>
        <tr>
          <th scope="col" className="syllabus__week">Week</th>
          <th scope="col" className="syllabus__date">Date</th>
          <th scope="col" className="syllabus__content">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((klass) => (
          <tr key={klass.id}>
            <td className="syllabus__week">{klass.weekNumber}</td>
            <td className="syllabus__date">{formatDate(klass.date)}</td>
            <td className="syllabus__content">
              <p className="syllabus__class-title">{klass.title}</p>
              {klass.materials.length > 0 ? (
                <ul className="syllabus__materials">
                  {klass.materials.map((material) => (
                    <li key={material.id}>
                      <button
                        type="button"
                        className={
                          'syllabus__material' +
                          (activeMaterialId === material.id ? ' syllabus__material--active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                      >
                        <span className="syllabus__material-icon" aria-hidden="true">{material.icon}</span>
                        <span className="syllabus__material-title">{material.title}</span>
                        <span className="syllabus__material-type">{material.typeLabel}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="syllabus__no-materials">Materials posted closer to this class.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
