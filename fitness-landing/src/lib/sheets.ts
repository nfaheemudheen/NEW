import { getStaffSession } from '@/lib/auth'
import { API_BASE_URL, apiUrl } from '@/lib/api'
import type { Submission } from '@/lib/submissions'

export const isSheetsConfigured = API_BASE_URL.length > 0
const SHEETS_WEBHOOK_URL = (import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '').trim()
const SHEETS_SHARED_SECRET = (import.meta.env.VITE_SHEETS_SHARED_SECRET ?? '').trim()
const SPREADSHEET_ID = (import.meta.env.VITE_SHEETS_SPREADSHEET_ID ?? '').trim()
export const sheetsSpreadsheetUrl = (
  import.meta.env.VITE_SHEETS_SPREADSHEET_URL ||
  (SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit` : '')
).trim()

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

/** Writes a public contact enquiry to Apps Script from the browser when configured. */
export async function createSubmissionOnBackend(submission: Submission): Promise<SheetSyncResult> {
  if (SHEETS_WEBHOOK_URL) {
    try {
      const response = await fetch(SHEETS_WEBHOOK_URL, {
        method: 'POST',
        // text/plain avoids a browser CORS preflight for the Apps Script web app.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          secret: SHEETS_SHARED_SECRET,
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
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.ok !== true) {
        throw new Error(payload?.error || `Google Sheets returned ${response.status}.`)
      }
      return { ok: true }
    } catch (error) {
      // Preserve the existing backend path as a fallback if the direct webhook is down.
      if (!isSheetsConfigured) {
        return { ok: false, error: error instanceof Error ? error.message : 'Could not save the enquiry to Google Sheets.' }
      }
    }
  }

  try {
    await request('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify({
        id: submission.id,
        fullName: submission.fullName,
        email: submission.email,
        phone: submission.phone,
        interest: submission.interest,
        method: submission.method,
      }),
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not save the enquiry.' }
  }
}

/** Updates a spreadsheet row; staff routes require a server-issued staff session. */
export async function syncSubmissionToSheet(submission: Submission): Promise<SheetSyncResult> {
  try {
    await request(`/api/staff/submissions/${encodeURIComponent(submission.id)}`, {
      method: 'PUT', body: JSON.stringify(submission),
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
