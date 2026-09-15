import { marked } from 'marked'
import { useMemo } from 'react'

function PdfViewer({ material }) {
  if (!material.url) return <UnavailableNotice material={material} />
  return (
    <iframe
      className="viewer__frame"
      src={material.url}
      title={material.title}
    />
  )
}

function VideoViewer({ material }) {
  if (!material.url) return <UnavailableNotice material={material} />
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video className="viewer__video" src={material.url} controls preload="metadata" />
  )
}

function YoutubeViewer({ material }) {
  return (
    <iframe
      className="viewer__frame"
      src={material.embedUrl}
      title={material.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

function MarkdownViewer({ material }) {
  const html = useMemo(() => (material.textContent ? marked.parse(material.textContent) : ''), [material.textContent])
  if (!material.textContent) return <UnavailableNotice material={material} />
  return (
    <div className="viewer__doc">
      {/* eslint-disable-next-line react/no-danger */}
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function UnavailableNotice({ material }) {
  return (
    <div className="viewer__empty">
      <p>“{material.title}” isn’t available to preview yet.</p>
    </div>
  )
}

const VIEWERS = {
  pdf: PdfViewer,
  video: VideoViewer,
  youtube: YoutubeViewer,
  md: MarkdownViewer,
}

export default function MaterialViewer({ course, material, onClear }) {
  if (!material) {
    return (
      <div className="viewer viewer--default">
        <img className="viewer__course-image" src={course.imageUrl} alt={course.name} />
        <div className="viewer__caption">
          <p className="viewer__caption-eyebrow">Now showing</p>
          <h2>{course.name}</h2>
          <p>Select a reading, lecture, or assignment from the syllabus to view it here.</p>
        </div>
      </div>
    )
  }

  const Viewer = VIEWERS[material.type] || (() => <UnavailableNotice material={material} />)

  return (
    <div className="viewer">
      <div className="viewer__bar">
        <div className="viewer__bar-info">
          <span className="viewer__bar-icon" aria-hidden="true">{material.icon}</span>
          <div>
            <p className="viewer__bar-label">{material.typeLabel}</p>
            <h2>{material.title}</h2>
          </div>
        </div>
        <div className="viewer__bar-actions">
          {material.url && (
            <a className="viewer__open-link" href={material.url} target="_blank" rel="noreferrer">
              Open in new tab ↗
            </a>
          )}
          <button type="button" className="viewer__clear" onClick={onClear}>
            ✕ Close
          </button>
        </div>
      </div>
      <div className="viewer__stage">
        <Viewer material={material} />
      </div>
    </div>
  )
}
