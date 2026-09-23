// Small RFC4180-style CSV parser. Handles quoted fields, embedded commas,
// escaped quotes ("") and CRLF/LF line endings. No external dependency needed
// for the well-formed CSV exports we read from project-assets/.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    const next = clean[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\n') {
      pushRow()
    } else {
      field += char
    }
  }

  // final field/row (guard against trailing newline producing an empty row)
  if (field.length > 0 || row.length > 0) {
    pushRow()
  }

  const nonEmptyRows = rows.filter((r) => !(r.length === 1 && r[0] === ''))
  const [header, ...body] = nonEmptyRows

  return body.map((cols) => {
    const record = {}
    header.forEach((key, index) => {
      record[key.trim()] = (cols[index] ?? '').trim()
    })
    return record
  })
}
