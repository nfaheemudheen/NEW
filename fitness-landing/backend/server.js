import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import express from 'express'
import { google } from 'googleapis'

const required = ['GOOGLE_SHEET_ID', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'ADMIN_USERNAME', 'ADMIN_PASSWORD']
const missing = required.filter((key) => !process.env[key])
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`)

const app = express()
const port = Number(process.env.PORT || 10000)
const sheetId = process.env.GOOGLE_SHEET_ID.trim()
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGIN || 'https://new-kappa-sand-18.vercel.app')
    .split(',').map((origin) => origin.trim()).filter(Boolean),
)
const adminUsername = process.env.ADMIN_USERNAME.trim()
const adminPassword = process.env.ADMIN_PASSWORD
const tokenSecret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD
const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Submissions'
const headers = ['Submission ID', 'Received (ISO)', 'Name', 'Email', 'Phone', 'Interested in', 'Preferred contact', 'Source', 'Status', 'Notes', 'Synced to Google Sheets']
const statuses = new Set(['new', 'contacted', 'booked', 'archived'])
const loginAttempts = new Map()
const enquiryAttempts = new Map()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use((req, res, next) => {
  const origin = req.get('origin')
  if (!origin || allowedOrigins.has(origin) || (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin))) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    return next()
  }
  return res.status(403).json({ error: 'Origin is not allowed.' })
})
app.use(express.json({ limit: '32kb' }))

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  return left.length === right.length && timingSafeEqual(left, right)
}

function issueToken(username) {
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ sub: username, exp: expiresAt })).toString('base64url')
  const signature = createHmac('sha256', tokenSecret).update(payload).digest('base64url')
  return { token: `${payload}.${signature}`, expiresAt: new Date(expiresAt).toISOString() }
}

function requireStaff(req, res, next) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return res.status(401).json({ error: 'Please sign in again.' })
  const expected = createHmac('sha256', tokenSecret).update(payload).digest('base64url')
  if (!safeEqual(signature, expected)) return res.status(401).json({ error: 'Invalid staff session.' })
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (session.sub !== adminUsername || session.exp <= Date.now()) throw new Error('expired')
    req.staff = session
    return next()
  } catch {
    return res.status(401).json({ error: 'Staff session expired. Please sign in again.' })
  }
}

function clean(value, max = 1000) {
  return String(value ?? '').trim().slice(0, max)
}

function normalizeStatus(value) {
  const status = clean(value, 20).toLowerCase()
  return statuses.has(status) ? status : 'new'
}

function rowToSubmission(row = []) {
  return {
    id: clean(row[0], 120),
    createdAt: row[1] ? new Date(row[1]).toISOString() : new Date().toISOString(),
    fullName: clean(row[2]), email: clean(row[3]), phone: clean(row[4]),
    interest: clean(row[5]) || 'General enquiry', method: clean(row[6]) || 'Email',
    source: clean(row[7]) || 'Google Sheet', status: normalizeStatus(row[8]),
    notes: clean(row[9]), syncedToSheet: true,
  }
}

async function ensureSheet() {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  const exists = (meta.data.sheets || []).some((item) => item.properties?.title === sheetTab)
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: sheetTab } } }] },
    })
  }
  const header = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${sheetTab}!A1:K1` })
  if (!header.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetTab}!A1:K1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    })
  }
}

async function readRows() {
  await ensureSheet()
  const result = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${sheetTab}!A2:K` })
  return result.data.values || []
}

async function upsertSubmission(submission) {
  const rows = await readRows()
  const index = rows.findIndex((row) => clean(row[0], 120) === submission.id)
  const values = [[
    submission.id, submission.createdAt, submission.fullName, submission.email,
    submission.phone, submission.interest, submission.method, submission.source,
    submission.status, submission.notes, 'Yes',
  ]]
  if (index >= 0) {
    const rowNumber = index + 2
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId, range: `${sheetTab}!A${rowNumber}:K${rowNumber}`,
      valueInputOption: 'RAW', requestBody: { values },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId, range: `${sheetTab}!A:K`, valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS', requestBody: { values },
    })
  }
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'Her Space submissions API' }))

app.post('/api/staff/login', (req, res) => {
  const key = req.ip || 'unknown'
  const attempts = loginAttempts.get(key) || { count: 0, started: Date.now() }
  if (Date.now() - attempts.started > 15 * 60 * 1000) {
    attempts.count = 0
    attempts.started = Date.now()
  }
  if (attempts.count >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  if (!safeEqual(clean(req.body?.username, 120).toLowerCase(), adminUsername.toLowerCase()) || !safeEqual(req.body?.password || '', adminPassword)) {
    attempts.count += 1
    loginAttempts.set(key, attempts)
    return res.status(401).json({ error: 'Incorrect username or password.' })
  }
  loginAttempts.delete(key)
  res.json({ ...issueToken(adminUsername), username: adminUsername, name: 'Studio Staff', role: 'Front desk' })
})

// Public contact-form endpoint. It accepts only contact details and always sets a new enquiry status.
app.post('/api/enquiries', async (req, res) => {
  const clientKey = req.ip || 'unknown'
  const windowStart = Date.now() - 60 * 60 * 1000
  const recentAttempts = (enquiryAttempts.get(clientKey) || []).filter((time) => time > windowStart)
  if (recentAttempts.length >= 20) return res.status(429).json({ error: 'Too many enquiries. Please try again later.' })
  recentAttempts.push(Date.now())
  enquiryAttempts.set(clientKey, recentAttempts)

  const fullName = clean(req.body?.fullName, 120)
  const email = clean(req.body?.email, 254)
  const phone = clean(req.body?.phone, 40)
  if (!fullName || (!email && !phone)) return res.status(400).json({ error: 'Name and a phone number or email are required.' })
  const submission = {
    id: clean(req.body?.id, 120) || randomUUID(), createdAt: new Date().toISOString(),
    fullName, email, phone, interest: clean(req.body?.interest, 160) || 'General enquiry',
    method: clean(req.body?.method, 40) || 'Email', source: 'Website contact form',
    status: 'new', notes: '', syncedToSheet: true,
  }
  try {
    await upsertSubmission(submission)
    return res.status(201).json({ ok: true, submission })
  } catch (error) {
    console.error('Unable to save enquiry to Google Sheets:', error.message)
    return res.status(503).json({ error: 'We could not save your enquiry right now. Please try again shortly.' })
  }
})

app.get('/api/staff/submissions', requireStaff, async (_req, res) => {
  try {
    const rows = await readRows()
    res.json({ ok: true, submissions: rows.filter((row) => row[0]).map(rowToSubmission) })
  } catch (error) {
    console.error('Unable to read Google Sheets:', error.message)
    res.status(503).json({ error: 'Could not load enquiries from Google Sheets.' })
  }
})

app.put('/api/staff/submissions/:id', requireStaff, async (req, res) => {
  const id = clean(req.params.id, 120)
  const updated = {
    id,
    createdAt: clean(req.body?.createdAt, 60) || new Date().toISOString(),
    fullName: clean(req.body?.fullName, 120), email: clean(req.body?.email, 254),
    phone: clean(req.body?.phone, 40), interest: clean(req.body?.interest, 160),
    method: clean(req.body?.method, 40), source: clean(req.body?.source, 160) || 'Website contact form',
    status: normalizeStatus(req.body?.status),
    notes: clean(req.body?.notes, 4000),
    syncedToSheet: true,
  }
  if (!updated.fullName) return res.status(400).json({ error: 'Name is required.' })
  try {
    await upsertSubmission(updated)
    return res.json({ ok: true, submission: updated })
  } catch (error) {
    console.error('Unable to update Google Sheets:', error.message)
    return res.status(503).json({ error: 'Could not update this enquiry in Google Sheets.' })
  }
})

app.delete('/api/staff/submissions/:id', requireStaff, async (req, res) => {
  try {
    const rows = await readRows()
    const index = rows.findIndex((row) => clean(row[0], 120) === clean(req.params.id, 120))
    if (index >= 0) {
      const rowNumber = index + 2
      const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
      const tab = (meta.data.sheets || []).find((item) => item.properties?.title === sheetTab)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: [{ deleteDimension: { range: { sheetId: tab.properties.sheetId, dimension: 'ROWS', startIndex: rowNumber - 1, endIndex: rowNumber } } }] },
      })
    }
    res.json({ ok: true })
  } catch (error) {
    console.error('Unable to delete from Google Sheets:', error.message)
    res.status(503).json({ error: 'Could not delete this enquiry from Google Sheets.' })
  }
})

app.listen(port, () => console.log(`Her Space submissions API listening on ${port}`))
