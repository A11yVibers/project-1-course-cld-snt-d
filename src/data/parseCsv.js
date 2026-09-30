// Minimal RFC4180-style CSV parser. Handles quoted fields, embedded commas,
// embedded newlines, and escaped double quotes ("").
// Returns an array of plain objects keyed by the header row.
export function parseCsv(raw) {
  const text = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  // Flush trailing field/row (file may or may not end with a newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
  if (nonEmptyRows.length === 0) return []

  const headers = nonEmptyRows[0].map((h) => h.trim())
  return nonEmptyRows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = (values[index] ?? '').trim()
    })
    return record
  })
}
