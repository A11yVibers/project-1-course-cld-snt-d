const TYPE_LABELS = {
  pdf: 'PDF reading',
  video: 'Lecture video',
  youtube: 'Video',
  md: 'Assignment',
}

const TYPE_ICONS = {
  pdf: '\u{1F4C4}',
  video: '\u{1F3A5}',
  youtube: '\u{25B6}',
  md: '\u{1F4DD}',
}

function formatDate(isoDate) {
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Syllabus({ classes, activeMaterialId, onSelectMaterial }) {
  return (
    <div className="syllabus">
      <h2 className="syllabus__heading">Syllabus</h2>
      <table className="syllabus__table">
        <caption className="visually-hidden">
          Weekly class schedule with dates and available class materials
        </caption>
        <thead>
          <tr>
            <th scope="col">Week</th>
            <th scope="col">Date</th>
            <th scope="col">Class content</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((klass) => (
            <tr key={klass.id}>
              <th scope="row" className="syllabus__week">
                {klass.weekNumber}
              </th>
              <td className="syllabus__date">{formatDate(klass.date)}</td>
              <td className="syllabus__content">
                <p className="syllabus__class-title">{klass.name}</p>
                {klass.materials.length > 0 ? (
                  <ul className="syllabus__materials">
                    {klass.materials.map((material) => {
                      const isActive = material.id === activeMaterialId
                      return (
                        <li key={material.id}>
                          <button
                            type="button"
                            className={`material-link${isActive ? ' is-active' : ''}`}
                            onClick={() => onSelectMaterial(material)}
                            aria-current={isActive ? 'true' : undefined}
                          >
                            <span className="material-link__icon" aria-hidden="true">
                              {TYPE_ICONS[material.type] ?? '\u{1F517}'}
                            </span>
                            <span className="material-link__title">{material.title}</span>
                            <span className="material-link__type">
                              {TYPE_LABELS[material.type] ?? 'Resource'}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="syllabus__no-materials">Materials coming soon</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
