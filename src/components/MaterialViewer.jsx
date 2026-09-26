import { useMemo } from 'react'
import { marked } from 'marked'

const TYPE_LABELS = {
  pdf: 'PDF Reading',
  video: 'Lecture Video',
  youtube: 'Video',
  md: 'Assignment',
  markdown: 'Assignment',
  txt: 'Document',
}

function MarkdownDocument({ material }) {
  const html = useMemo(() => marked.parse(material.content || ''), [material.content])
  return (
    <div className="viewer-frame viewer-document">
      <div className="document-sheet" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function PdfDocument({ material }) {
  if (!material.href) return <UnavailableMaterial material={material} />
  return (
    <div className="viewer-frame">
      <iframe title={material.title} src={material.href} className="viewer-iframe" />
    </div>
  )
}

function VideoDocument({ material }) {
  if (!material.href) return <UnavailableMaterial material={material} />
  return (
    <div className="viewer-frame viewer-video">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video src={material.href} controls preload="metadata" />
    </div>
  )
}

function YouTubeDocument({ material }) {
  return (
    <div className="viewer-frame viewer-video">
      <iframe
        title={material.title}
        src={material.embedUrl}
        className="viewer-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function UnavailableMaterial({ material }) {
  return (
    <div className="viewer-frame viewer-empty">
      <p>This material isn&rsquo;t available to preview yet.</p>
      {material.href && (
        <a href={material.href} target="_blank" rel="noreferrer">
          Open &ldquo;{material.title}&rdquo; in a new tab
        </a>
      )}
    </div>
  )
}

export default function MaterialViewer({ course, material, onClear }) {
  if (!material) {
    return (
      <div className="viewer-default">
        <img src={course.imageUrl} alt={course.name} />
        <div className="viewer-default-caption">
          <p className="eyebrow">Now viewing</p>
          <h2>{course.name}</h2>
          <p>Select a lecture, reading, or assignment from the syllabus to view it here.</p>
        </div>
      </div>
    )
  }

  const type = material.type
  let body
  if (type === 'pdf') body = <PdfDocument material={material} />
  else if (type === 'video') body = <VideoDocument material={material} />
  else if (type === 'youtube') body = <YouTubeDocument material={material} />
  else if (type === 'md' || type === 'markdown' || type === 'txt') body = <MarkdownDocument material={material} />
  else body = <UnavailableMaterial material={material} />

  return (
    <div className="material-panel">
      <div className="material-panel-bar">
        <div>
          <span className="material-type-tag">{TYPE_LABELS[type] || 'Resource'}</span>
          <h2>{material.title}</h2>
        </div>
        <div className="material-panel-actions">
          {material.href && (
            <a href={material.href} target="_blank" rel="noreferrer" className="ghost-button">
              Open in new tab
            </a>
          )}
          <button type="button" className="ghost-button" onClick={onClear}>
            &times; Close
          </button>
        </div>
      </div>
      {body}
    </div>
  )
}
