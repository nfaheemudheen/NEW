/**
 * Her Space Studio — submission webhook
 *
 * 1. Create a Google Sheet.
 * 2. Extensions → Apps Script → paste this file into Code.gs.
 * 3. Change SHARED_SECRET below if you like, and set the same value as
 *    VITE_SHEETS_SHARED_SECRET in the website's .env file.
 * 4. Deploy → New deployment → Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the Web app URL into VITE_SHEETS_WEBHOOK_URL and redeploy the site.
 *
 * Supported actions:
 *   upsert — create or update a row by submission ID (default)
 *   list   — return every row so the staff portal can pull sheet edits
 *   delete — remove the row matching a submission ID
 */

const SHEET_NAME = 'Submissions'
const SHARED_SECRET = 'herspace-sheet-secret'

const HEADERS = [
  'Submission ID',
  'Received (ISO)',
  'Name',
  'Email',
  'Phone',
  'Interested in',
  'Preferred contact',
  'Source',
  'Status',
  'Notes',
  'Synced to Google Sheets',
]

const STATUSES = ['new', 'contacted', 'booked', 'archived']

function doPost(e) {
  try {
    const payload = parsePayload_(e)

    if (SHARED_SECRET && String(payload.secret || '') !== SHARED_SECRET) {
      return json_({ ok: false, error: 'Invalid shared secret.' })
    }

    const action = text_(payload.action || 'upsert').trim().toLowerCase()

    if (action === 'list') return listSubmissions_()
    if (action === 'delete') return deleteSubmission_(payload)

    return upsertSubmission_(payload)
  } catch (error) {
    return json_({
      ok: false,
      error: error && error.message ? error.message : String(error),
    })
  }
}

function doGet() {
  return json_({ ok: true, service: 'Her Space submissions webhook' })
}

function upsertSubmission_(payload) {
  const id = text_(payload.id).trim()
  const name = text_(payload.fullName).trim()

  if (!id || !name) {
    return json_({ ok: false, error: 'Missing submission id or name.' })
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(15000)

  try {
    const sheet = getSheet_()
    const row = [
      id,
      isoDate_(payload.createdAt),
      name,
      text_(payload.email),
      text_(payload.phone),
      text_(payload.interest),
      text_(payload.method),
      text_(payload.source),
      normalizeStatus_(payload.status),
      text_(payload.notes),
      'Yes',
    ]

    const matchedRow = findRowById_(sheet, id)

    if (matchedRow > 0) {
      sheet.getRange(matchedRow, 1, 1, row.length).setValues([row])
    } else {
      sheet.appendRow(row)
    }

    return json_({
      ok: true,
      action: matchedRow > 0 ? 'updated' : 'appended',
      row: matchedRow > 0 ? matchedRow : sheet.getLastRow(),
    })
  } finally {
    lock.releaseLock()
  }
}

function deleteSubmission_(payload) {
  const id = text_(payload.id).trim()

  if (!id) {
    return json_({ ok: false, error: 'Missing submission id.' })
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(15000)

  try {
    const sheet = getSheet_()
    const matchedRow = findRowById_(sheet, id)

    if (matchedRow > 0) {
      sheet.deleteRow(matchedRow)
    }

    return json_({ ok: true, deleted: matchedRow > 0 })
  } finally {
    lock.releaseLock()
  }
}

function listSubmissions_() {
  const sheet = getSheet_()
  const lastRow = sheet.getLastRow()

  if (lastRow < 2) {
    return json_({ ok: true, submissions: [] })
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues()
  const submissions = []

  for (let index = 0; index < values.length; index += 1) {
    const row = values[index]
    const id = text_(row[0]).trim()
    if (!id) continue

    submissions.push({
      id: id,
      createdAt: isoDate_(row[1]),
      fullName: text_(row[2]),
      email: text_(row[3]),
      phone: text_(row[4]),
      interest: text_(row[5]) || 'General enquiry',
      method: text_(row[6]) || 'Email',
      source: text_(row[7]) || 'Google Sheet',
      status: normalizeStatus_(row[8]),
      notes: text_(row[9]),
    })
  }

  return json_({ ok: true, submissions: submissions })
}

function findRowById_(sheet, id) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return 0

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
  for (let index = 0; index < ids.length; index += 1) {
    if (String(ids[index][0]).trim() === id) {
      return index + 2
    }
  }

  return 0
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No request body received.')
  }

  return JSON.parse(e.postData.contents)
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    const header = sheet.getRange(1, 1, 1, HEADERS.length)
    header.setFontWeight('bold')
    header.setBackground('#eef7ff')
    header.setFontColor('#073d73')
    sheet.setFrozenRows(1)
  }

  return sheet
}

function normalizeStatus_(value) {
  const status = text_(value).trim().toLowerCase()
  return STATUSES.indexOf(status) === -1 ? 'new' : status
}

function isoDate_(value) {
  if (!value) return new Date().toISOString()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function text_(value) {
  return value == null ? '' : String(value)
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
