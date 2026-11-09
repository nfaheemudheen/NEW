import { getStaffSession } from '@/lib/auth'
import { API_BASE_URL, apiUrl } from '@/lib/api'
import type { Submission } from '@/lib/submissions'

/**
 * Keep this in sync with SHARED_SECRET in google-apps-script/Code.gs.
 * It is a light spam check, not a real secret: Vite embeds it in the public bundle.
 */
const DEFAULT_SHEETS_SECRET = 'hs_sync_2f8c1d6a4b9e7f3c5a0d8e6b2c4f7a9d'
const DIRECT_WEBHOOK_URL = (import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '').trim()
const SHEETS_SHARED_SECRET = (
  import.meta.env.VITE_SHEETS_SHARED_SECRET ?? DEFAULT_SHEETS_SECRET
).trim()
/**
 * Vercel deployments also include api/enquiries.js, a same-origin proxy that
 * forwards to Apps Script with server-side SHEETS_* environment variables.
 */
const PROXY_WEBHOOK_URL = import.meta.env.PROD ? '/api/enquiries' : ''
const SHEETS_WEBHOOK_URL = DIRECT_WEBHOOK_URL || PROXY_WEBHOOK_URL

const SPREADSHEET_ID = (import.meta.env.VITE_SHEETS_SPREADSHEET_ID ?? '').trim()
export const sheetsSpreadsheetUrl = (
  import.meta.env.VITE_SHEETS_SPREADSHEET_URL ||
  (SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit` : '')
).trim()

/** Outbound writes work with an Apps Script webhook, the Vercel proxy, or the Node backend. */
export const isSheetsConfigured = SHEETS_WEBHOOK_URL.length > 0 || API_BASE_URL.length > 0
/** Pulling rows and deleting them from the sheet still requires the staff backend. */
export const canPullFromSheet = API_BASE_URL.length > 0

export type SheetSyncResult = { ok: true } | { ok: false; error: string }
export type SheetFetchResult = { ok: true; submissions: unknown[] } | { ok: false; error: string }

async function request(path: string, init: RequestInit = {}) {
  if (!isSheetsConfigured) throw new Error('The submissions API is not configured yet.')
  const token = getStaffSession()?.token
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(apiUrl(path), { ...init, headers })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || `The submissions API returned ${response.status}.`)
  return payload
}

function submissionPayload(submission: Submission) {
  return {
    action: 'upsert',
    id: submission.id,
    createdAt: submission.createdAt,
    fullName: submission.fullName,
    email: submission.email,
    phone: submission.phone,
    interest: submission.interest,
    method: submission.method,
    source: submission.source,
    status: submission.status,
    notes: submission.notes,
  }
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

/**
 * Sends a write to Apps Script (directly or through the Vercel proxy).
 * Apps Script replies with JSON but may return an HTML login page when the
 * deployment is not public, so parse defensively.
 */
async function postToSheetsWebhook(
  url: string,
  body: Record<string, unknown>,
  withSecret: boolean,
): Promise<SheetSyncResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      // text/plain avoids a browser CORS preflight for the Apps Script web app.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(withSecret ? { secret: SHEETS_SHARED_SECRET, ...body } : body),
    })

    const text = await response.text()
    let payload: { ok?: boolean; error?: string } | null = null
    try {
      payload = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null
    } catch {
      payload = null
    }

    if (!response.ok) {
      throw new Error(payload?.error || `Google Sheets returned ${response.status}.`)
    }
    if (!payload || payload.ok !== true) {
      throw new Error(
        payload?.error ||
          'The Google Sheets webhook did not confirm the write. Check that the Apps Script web app is deployed with access set to "Anyone".',
      )
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error, 'Could not save the enquiry to Google Sheets.'),
    }
  }
}

async function postToBackend(submission: Submission): Promise<SheetSyncResult> {
  try {
    const response = await fetch(apiUrl('/api/enquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionPayload(submission)),
    })
    const text = await response.text()
    let payload: { ok?: boolean; error?: string } | null = null
    try {
      payload = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null
    } catch {
      payload = null
    }
    if (!response.ok || payload?.ok !== true) {
      throw new Error(payload?.error || `The submissions API returned ${response.status}.`)
    }
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error, 'Could not reach the submissions API.'),
    }
  }
}

/**
 * Writes an enquiry to Apps Script when configured, then falls back to the
 * Node backend if one is configured as well.
 */
export async function createSubmissionOnBackend(
  submission: Submission
): Promise<SheetSyncResult> {
  if (DIRECT_WEBHOOK_URL) {
    const result = await postToSheetsWebhook(DIRECT_WEBHOOK_URL, submissionPayload(submission), true)
    if (result.ok || !API_BASE_URL) return result
  } else if (PROXY_WEBHOOK_URL) {
    const result = await postToSheetsWebhook(PROXY_WEBHOOK_URL, submissionPayload(submission), false)
    if (result.ok || !API_BASE_URL) return result
  }

  if (API_BASE_URL) return postToBackend(submission)

  return {
    ok: false,
    error: 'Google Sheets sync is not configured. Set VITE_SHEETS_WEBHOOK_URL or VITE_API_BASE_URL.',
  }
}

/** Updates (or inserts) a spreadsheet row; staff routes require a server-issued staff session. */
export async function syncSubmissionToSheet(submission: Submission): Promise<SheetSyncResult> {
  if (DIRECT_WEBHOOK_URL) {
    const result = await postToSheetsWebhook(DIRECT_WEBHOOK_URL, submissionPayload(submission), true)
    if (result.ok || !API_BASE_URL) return result
  } else if (PROXY_WEBHOOK_URL) {
    const result = await postToSheetsWebhook(PROXY_WEBHOOK_URL, submissionPayload(submission), false)
    if (result.ok || !API_BASE_URL) return result
  }

  try {
    await request(`/api/staff/submissions/${encodeURIComponent(submission.id)}`, {
      method: 'PUT',
      body: JSON.stringify(submission),
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: errorMessage(error, 'Could not sync the enquiry.') }
  }
}

export async function deleteSubmissionFromSheet(id: string): Promise<SheetSyncResult> {
  try {
    await request(`/api/staff/submissions/${encodeURIComponent(id)}`, { method: 'DELETE' })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: errorMessage(error, 'Could not delete the enquiry.') }
  }
}

export async function fetchSubmissionsFromSheet(): Promise<SheetFetchResult> {
  try {
    const payload = await request('/api/staff/submissions')
    if (!Array.isArray(payload.submissions)) return { ok: false, error: 'The API returned an invalid enquiry list.' }
    return { ok: true, submissions: payload.submissions }
  } catch (error) {
    return { ok: false, error: errorMessage(error, 'Could not load enquiries.') }
  }
}
