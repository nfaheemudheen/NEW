/**
 * Her Space contact enquiry webhook.
 *
 * Frontend request: POST JSON with action "upsert", secret, and the enquiry
 * fields listed in HEADERS. The response always includes `ok`; the frontend
 * considers the write successful only when it receives `{ ok: true }`.
 *
 * Before deploying, replace SHARED_SECRET with a long random value and use
 * the same value for VITE_SHEETS_SHARED_SECRET in the frontend deployment.
 */

const SPREADSHEET_ID = '15rz8F3nbGLdp4Hkesgfu4RtYJkPtqUyEVLsFbur2gek'
const SHEET_NAME = 'Her Space'
const SHARED_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_SECRET'

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

const VALID_STATUSES = ['new', 'contacted', 'booked', 'archived']

/** Apps Script web app POST handler. */
function doPost(e) {
  try {
    const payload = parsePayload_(e)

    if (!SHARED_SECRET || SHARED_SECRET === 'REPLACE_WITH_A_LONG_RANDOM_SECRET') {
      throw new Error('Webhook setup is incomplete: replace the SHARED_SECRET placeholder.')
    }

    if (String(payload.secret || '') !== SHARED_SECRET) {
      throw new Error('Invalid shared secret.')
    }

    const action = String(payload.action || 'upsert').trim().toLowerCase()
    if (action !== 'upsert') {
      throw new Error('Unsupported action. Expected "upsert".')
    }

    return upsertEnquiry_(payload)
  } catch (error) {
    return json_({
      ok: false,
      error: error && error.message ? error.message : String(error),
    })
  }
}

/** Simple deployment check. */
function doGet() {
  return json_({ ok: true, service: 'Her Space contact enquiries' })
}

/** Insert a new enquiry, or update the existing row if the same ID is retried. */
function upsertEnquiry_(payload) {
  const id = text_(payload.id).trim()
  const name = text_(payload.fullName).trim()
  if (!id || !name) throw new Error('Missing submission id or name.')

  const lock = LockService.getScriptLock()
  lock.waitLock(15000)

  try {
    const sheet = getSheet_()
    const row = [
      safeCell_(id),
      isoDate_(payload.createdAt),
      safeCell_(name),
      safeCell_(payload.email),
      safeCell_(payload.phone),
      safeCell_(payload.interest),
      safeCell_(payload.method),
      safeCell_(payload.source),
      normalizeStatus_(payload.status),
      safeCell_(payload.notes),
      'Yes',
    ]

    const existingRow = findRowById_(sheet, id)
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, HEADERS.length).setValues([row])
    } else {
      sheet.appendRow(row)
    }

    return json_({
      ok: true,
      action: existingRow > 0 ? 'updated' : 'appended',
      row: existingRow > 0 ? existingRow : sheet.getLastRow(),
    })
  } finally {
    lock.releaseLock()
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME)

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#eef7ff')
      .setFontColor('#073d73')
    sheet.setFrozenRows(1)
  }

  return sheet
}

function findRowById_(sheet, id) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return 0

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues()
  for (let index = 0; index < ids.length; index += 1) {
    if (ids[index][0].trim() === id) return index + 2
  }
  return 0
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No request body received.')
  }

  try {
    return JSON.parse(e.postData.contents)
  } catch (_error) {
    throw new Error('Request body must be valid JSON.')
  }
}

function normalizeStatus_(value) {
  const status = text_(value).trim().toLowerCase()
  return VALID_STATUSES.indexOf(status) >= 0 ? status : 'new'
}

function isoDate_(value) {
  if (!value) return new Date().toISOString()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

// Prevent form values beginning with spreadsheet formula characters being run.
function safeCell_(value) {
  const text = text_(value)
  return /^[=+@\-]/.test(text) ? "'" + text : text
}

function text_(value) {
  return value == null ? '' : String(value)
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
