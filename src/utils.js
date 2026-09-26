const MATERIAL_TYPE_LABELS = {
  pdf: 'PDF',
  video: 'Video',
  youtube: 'YouTube',
  md: 'Assignment',
}

export function materialTypeLabel(type) {
  return MATERIAL_TYPE_LABELS[type] ?? (type ? type.toUpperCase() : 'Resource')
}

export function formatClassDate(dateStr) {
  if (!dateStr) return ''
  const parsed = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return dateStr
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function durationBucket(weeks) {
  if (weeks <= 5) return 'short'
  if (weeks <= 7) return 'medium'
  return 'long'
}

export const DURATION_LABELS = {
  short: 'Short (≤5 weeks)',
  medium: 'Medium (6–7 weeks)',
  long: 'Long (8+ weeks)',
}
