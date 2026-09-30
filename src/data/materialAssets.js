// Links to the immutable supporting files in project-assets/materials/.
// Vite's explicit ?url / ?raw suffixes let us reference these files without
// copying, editing, or regenerating their contents - the originals in
// project-assets/ are never touched.
import silkRoadsClass01LecturePdf from '../../project-assets/materials/silk_roads_class_01_lecture.pdf?url'
import silkRoadsClass01LectureVideo from '../../project-assets/materials/silk_roads_class_01_lecture.mp4?url'
import silkRoadsClass02AssignmentMd from '../../project-assets/materials/silk_roads_class_02_assignment.md?raw'

// Maps the `file_path` column from course_materials.csv to the resolved
// asset URL Vite produces for that file.
const LOCAL_ASSET_URLS = {
  'materials/silk_roads_class_01_lecture.pdf': silkRoadsClass01LecturePdf,
  'materials/silk_roads_class_01_lecture.mp4': silkRoadsClass01LectureVideo,
}

// Maps the `file_path` column to the raw text content, for formats (like
// Markdown) that should be rendered inline rather than embedded as a file.
const LOCAL_RAW_TEXT = {
  'materials/silk_roads_class_02_assignment.md': silkRoadsClass02AssignmentMd,
}

const YOUTUBE_PATTERNS = [
  /youtu\.be\/([\w-]+)/i,
  /youtube\.com\/watch\?v=([\w-]+)/i,
  /youtube\.com\/embed\/([\w-]+)/i,
]

function toYoutubeEmbedUrl(url) {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

// Resolves a course_materials.csv row into something a viewer component can
// render, without ever mutating the source CSV or the files it points to.
export function resolveMaterial(material) {
  const filePath = material.file_path || ''
  const isExternal = /^https?:\/\//i.test(filePath)

  if (material.material_type === 'youtube' || isExternal) {
    const embedUrl = toYoutubeEmbedUrl(filePath)
    if (embedUrl) return { kind: 'youtube', embedUrl, sourceUrl: filePath }
    return { kind: 'external-link', sourceUrl: filePath }
  }

  if (LOCAL_RAW_TEXT[filePath] !== undefined) {
    return { kind: 'markdown', text: LOCAL_RAW_TEXT[filePath] }
  }

  if (LOCAL_ASSET_URLS[filePath]) {
    const url = LOCAL_ASSET_URLS[filePath]
    if (material.material_type === 'pdf') return { kind: 'pdf', url }
    if (material.material_type === 'video') return { kind: 'video', url }
    return { kind: 'file', url }
  }

  return { kind: 'unavailable' }
}
