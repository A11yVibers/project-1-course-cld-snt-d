import { useMemo } from 'react'
import { marked } from 'marked'

const TYPE_LABELS = {
  pdf: 'PDF reading',
  video: 'Lecture video',
  youtube: 'Video',
  md: 'Assignment',
}

function MarkdownMaterial({ material }) {
  const html = useMemo(() => marked.parse(material.content ?? ''), [material.content])
  // eslint-disable-next-line react/no-danger -- trusted local course content from project-assets
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
}

function MaterialBody({ material }) {
  switch (material.type) {
    case 'pdf':
      return (
        <iframe
          key={material.id}
          title={material.title}
          src={material.url}
          className="viewer-frame viewer-frame--pdf"
        />
      )
    case 'video':
      return (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- source lecture recording has no caption track supplied */}
          <video key={material.id} className="viewer-frame viewer-frame--video" src={material.url} controls />
          <p className="viewer__media-note">
            Captions are not yet available for this recording. Check the other materials
            listed for this class in the syllabus for supporting text content.
          </p>
        </>
      )
    case 'youtube':
      return (
        <iframe
          key={material.id}
          title={material.title}
          src={material.embedUrl}
          className="viewer-frame viewer-frame--youtube"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    case 'md':
      return (
        <div className="viewer-frame viewer-frame--markdown">
          <MarkdownMaterial material={material} />
        </div>
      )
    default:
      return (
        <div className="viewer-frame viewer-frame--fallback">
          <p>This resource opens in a new tab.</p>
          <a className="btn btn--primary" href={material.url} target="_blank" rel="noreferrer">
            Open resource
          </a>
        </div>
      )
  }
}

export default function MaterialViewer({ course, material, onShowOverview }) {
  if (!material) {
    return (
      <div className="viewer viewer--overview">
        <img src={course.imageUrl} alt="" className="viewer__course-image" />
        <div className="viewer__overview-caption">
          <h2>{course.name}</h2>
          <p>Select a class material from the syllabus to preview it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="viewer">
      <div className="viewer__toolbar">
        <div>
          <span className="viewer__type-badge">{TYPE_LABELS[material.type] ?? 'Resource'}</span>
          <h2 className="viewer__title">{material.title}</h2>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onShowOverview}>
          Back to course overview
        </button>
      </div>
      <MaterialBody material={material} />
    </div>
  )
}
