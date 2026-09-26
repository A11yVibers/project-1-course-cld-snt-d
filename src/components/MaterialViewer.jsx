import { marked } from 'marked'

export default function MaterialViewer({ material }) {
  if (!material) return null

  switch (material.type) {
    case 'pdf':
      return (
        <div className="viewer-frame viewer-frame--pdf">
          <iframe src={material.url} title={material.title} />
          <a className="viewer-external-link" href={material.url} target="_blank" rel="noreferrer">
            Open PDF in a new tab ↗
          </a>
        </div>
      )

    case 'video':
      return (
        <div className="viewer-frame viewer-frame--video">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video controls src={material.url} />
        </div>
      )

    case 'youtube':
      return (
        <div className="viewer-frame viewer-frame--youtube">
          <iframe
            src={material.embedUrl}
            title={material.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <a className="viewer-external-link" href={material.url} target="_blank" rel="noreferrer">
            Watch on YouTube ↗
          </a>
        </div>
      )

    case 'md': {
      const html = marked.parse(material.text ?? '')
      return (
        <div className="viewer-frame viewer-frame--markdown">
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )
    }

    default:
      return (
        <div className="viewer-frame viewer-frame--generic">
          <p>{material.title}</p>
          {material.url && (
            <a className="viewer-external-link" href={material.url} target="_blank" rel="noreferrer">
              Open resource ↗
            </a>
          )}
        </div>
      )
  }
}
