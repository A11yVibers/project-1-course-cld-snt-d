import { materialTypeIcon, materialTypeLabel } from '../data/format.js'

export default function MaterialList({ classInfo, activeMaterialId, onSelectMaterial }) {
  if (!classInfo.materials || classInfo.materials.length === 0) {
    return <p className="material-list-empty">No materials posted yet.</p>
  }

  return (
    <ul className="material-list">
      {classInfo.materials.map((material) => {
        const isActive = material.material_id === activeMaterialId
        return (
          <li key={material.material_id}>
            <button
              type="button"
              className={`material-chip${isActive ? ' is-active' : ''}`}
              onClick={() => onSelectMaterial(material, classInfo)}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="material-chip-icon" aria-hidden="true">
                {materialTypeIcon(material.material_type)}
              </span>
              <span className="material-chip-text">
                <span className="material-chip-title">{material.material_title}</span>
                <span className="material-chip-type">{materialTypeLabel(material.material_type)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
