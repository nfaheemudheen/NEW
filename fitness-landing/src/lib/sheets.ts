import type { Submission } from '@/lib/submissions'

const WEBHOOK_URL = (import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '').trim()
const SHARED_SECRET = (
  import.meta.env.VITE_SHEETS_SHARED_SECRET || 'herspace-sheet-secret'
).trim()

export const isSheetsConfigured = WEBHOOK_URL.length > 0
const SPREADSHEET_ID = (import.meta.env.VITE_SHEETS_SPREADSHEET_ID ?? '').trim()
export const sheetsSpreadsheetUrl = (
  import.meta.env.VITE_SHEETS_SPREADSHEET_URL ||
  (SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit` : '')
).trim()

export type SheetSyncResult = { ok: true } | { ok: false; error: string }

export type SheetFetchResult =
  | { ok: true; submissions: unknown[] }
  | { ok: false; error: string }

type SheetResponse = {
  ok?: boolean
  error?: string
  submissions?: unknown
}

/**
 * Posts a JSON payload to the Apps Script web app and normalises the response.
 * `text/plain` avoids a CORS preflight, which Apps Script web apps do not handle.
 */
async function postToSheet(body: Record<string, unknown>): Promise<
  { ok: true; payload: SheetResponse } | { ok: false; error: string }
> {
  if (!isSheetsConfigured) {
    return {
      ok: false,
      error: 'Google Sheets sync is not configured yet.',
    }
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 12_000)

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: SHARED_SECRET, ...body }),
      signal: controller.signal,
    })

    if (!response.ok) {
      return {
        ok: false,
        error: `Google Sheets responded with status ${response.status}.`,
      }
    }

    const payload = (await response.json().catch(() => null)) as SheetResponse | null

    if (!payload || payload.ok !== true) {
      return {
        ok: false,
        error: payload?.error || 'Google Sheets returned an unexpected response.',
      }
    }

    return { ok: true, payload }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, error: 'Google Sheets did not respond in time.' }
    }

    return {
      ok: false,
      error: 'Could not reach Google Sheets. Check the webhook URL and deployment access.',
    }
  } finally {
    window.clearTimeout(timeout)
  }
}

/**
 * Sends a full submission record to a Google Apps Script web app.
 * The script upserts by submission id, so status and note edits update the
 * matching spreadsheet row instead of adding a duplicate.
 */
export async function syncSubmissionToSheet(submission: Submission): Promise<SheetSyncResult> {
  const result = await postToSheet({
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
  })

  return result.ok ? { ok: true } : result
}

/** Deletes the row matching a submission id from the connected sheet. */
export async function deleteSubmissionFromSheet(id: string): Promise<SheetSyncResult> {
  const result = await postToSheet({ action: 'delete', id })
  return result.ok ? { ok: true } : result
}

/**
 * Pulls every row from the connected sheet so the inbox can mirror edits and
 * additions made directly in the spreadsheet.
 */
export async function fetchSubmissionsFromSheet(): Promise<SheetFetchResult> {
  const result = await postToSheet({ action: 'list' })

  if (!result.ok) return result

  const rows = result.payload.submissions
  if (!Array.isArray(rows)) {
    return { ok: false, error: 'Google Sheets returned an unexpected row list.' }
  }

  return { ok: true, submissions: rows }
}
