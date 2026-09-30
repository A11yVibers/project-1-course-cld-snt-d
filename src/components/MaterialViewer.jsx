import { marked } from 'marked'
import { useMemo } from 'react'
import { materialTypeIcon, materialTypeLabel } from '../data/format.js'
import { resolveMaterial } from '../data/materialAssets.js'

function MaterialBody({ material }) {
  const resolved = useMemo(() => resolveMaterial(material), [material])

  switch (resolved.kind) {
    case 'pdf':
      return (
        <object data={resolved.url} type="application/pdf" className="viewer-pdf" aria-label={material.material_title}>
          <p>
            Your browser can&apos;t preview this PDF inline.{' '}
            <a href={resolved.url} target="_blank" rel="noreferrer">Open the PDF in a new tab</a>.
          </p>
        </object>
      )
    case 'video':
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className="viewer-video" controls src={resolved.url}>
          Your browser does not support embedded video.
        </video>
      )
    case 'youtube':
      return (
        <div className="viewer-youtube-frame">
          <iframe
            src={resolved.embedUrl}
            title={material.material_title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    case 'markdown':
      return (
        <div
          className="viewer-markdown"
          dangerouslySetInnerHTML={{ __html: marked.parse(resolved.text) }}
        />
      )
    case 'file':
      return (
        <p className="viewer-fallback">
          <a href={resolved.url} target="_blank" rel="noreferrer">Open &ldquo;{material.material_title}&rdquo;</a>
        </p>
      )
    case 'external-link':
      return (
        <p className="viewer-fallback">
          <a href={resolved.sourceUrl} target="_blank" rel="noreferrer">Open &ldquo;{material.material_title}&rdquo;</a>
        </p>
      )
    default:
      return <p className="viewer-fallback">This material isn&apos;t available to preview yet.</p>
  }
}

export default function MaterialViewer({ course, activeMaterial, onClear }) {
  if (!activeMaterial) {
    return (
      <div className="viewer">
        <div className="viewer-header">
          <span className="viewer-header-label">Course preview</span>
        </div>
        <div className="viewer-stage viewer-stage-image">
          <img src={course.image_url} alt={course.name} />
        </div>
      </div>
    )
  }

  const { material, classInfo } = activeMaterial

  return (
    <div className="viewer">
      <div className="viewer-header">
        <div>
          <span className="viewer-header-label">
            {materialTypeIcon(material.material_type)} {materialTypeLabel(material.material_type)}
            {' '}&middot;{' '}
            {classInfo.class_name}
          </span>
          <h2 className="viewer-title">{material.material_title}</h2>
        </div>
        <button type="button" className="viewer-close" onClick={onClear}>
          &larr; Back to course image
        </button>
      </div>
      <div className="viewer-stage">
        <MaterialBody material={material} />
      </div>
    </div>
  )
}
