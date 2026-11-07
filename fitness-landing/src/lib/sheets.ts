import { getStaffSession } from '@/lib/auth'
import { API_BASE_URL, apiUrl } from '@/lib/api'
import type { Submission } from '@/lib/submissions'

/**
 * Keep this in sync with SHARED_SECRET in google-apps-script/Code.gs.
 * It is a light spam check, not a real secret: Vite embeds it in the public bundle.
 */
const DEFAULT_SHEETS_SECRET = 'hs_sync_2f8c1d6a4b9e7f3c5a0d8e6b2c4f7a9d'
const SHEETS_WEBHOOK_URL = (import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '').trim()
const SHEETS_SHARED_SECRET = (
  import.meta.env.VITE_SHEETS_SHARED_SECRET ?? DEFAULT_SHEETS_SECRET
).trim()
const SPREADSHEET_ID = (import.meta.env.VITE_SHEETS_SPREADSHEET_ID ?? '').trim()
export const sheetsSpreadsheetUrl = (
  import.meta.env.VITE_SHEETS_SPREADSHEET_URL ||
  (SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit` : '')
).trim()

/** Outbound writes work with either the Apps Script webhook or the Node backend. */
export const isSheetsConfigured = API_BASE_URL.length > 0 || SHEETS_WEBHOOK_URL.length > 0
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

async function postToSheetsWebhook(
  body: Record<string, unknown>,
): Promise<SheetSyncResult> {
  try {
    const response = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      // text/plain avoids a browser CORS preflight for the Apps Script web app.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: SHEETS_SHARED_SECRET, ...body }),
    })
    const text = await response.text()
    let payload: { ok?: boolean; error?: string } | null = null
    try {
      payload = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null
    } catch {
      // Apps Script returns an HTML login page when the web app is not public.
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
      error:
        error instanceof Error ? error.message : 'Could not save the enquiry to Google Sheets.',
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
  if (!SHEETS_WEBHOOK_URL) {
    return {
      ok: false,
      error: 'Google Sheets webhook URL is not configured.',
    }
  }

  return postToSheetsWebhook(submissionPayload(submission))
}



/** Updates (or inserts) a spreadsheet row; staff routes require a server-issued staff session. */
export async function syncSubmissionToSheet(submission: Submission): Promise<SheetSyncResult> {
  if (SHEETS_WEBHOOK_URL) {
    const result = await postToSheetsWebhook(submissionPayload(submission))
    if (result.ok || !API_BASE_URL) return result
  }

  try {
    await request(`/api/staff/submissions/${encodeURIComponent(submission.id)}`, {
      method: 'PUT',
      body: JSON.stringify(submission),
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not sync the enquiry.' }
  }
}

export async function deleteSubmissionFromSheet(id: string): Promise<SheetSyncResult> {
  try {
    await request(`/api/staff/submissions/${encodeURIComponent(id)}`, { method: 'DELETE' })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not delete the enquiry.' }
  }
}

export async function fetchSubmissionsFromSheet(): Promise<SheetFetchResult> {
  try {
    const payload = await request('/api/staff/submissions')
    if (!Array.isArray(payload.submissions)) return { ok: false, error: 'The API returned an invalid enquiry list.' }
    return { ok: true, submissions: payload.submissions }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not load enquiries.' }
  }
}
