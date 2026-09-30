export function formatClassDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const MATERIAL_TYPE_LABELS = {
  pdf: 'PDF Reading',
  video: 'Lecture Video',
  youtube: 'Video',
  md: 'Assignment',
}

export function materialTypeLabel(type) {
  return MATERIAL_TYPE_LABELS[type] || 'Resource'
}

const MATERIAL_TYPE_ICONS = {
  pdf: '\u{1F4C4}',
  video: '\u{1F3AC}',
  youtube: '\u{25B6}',
  md: '\u{1F4DD}',
}

export function materialTypeIcon(type) {
  return MATERIAL_TYPE_ICONS[type] || '\u{1F4CE}'
}
