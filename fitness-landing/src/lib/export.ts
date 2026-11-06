import { STATUS_LABELS, type Submission } from '@/lib/submissions'

const COLUMNS = [
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

function tableRows(submissions: Submission[]): string[][] {
  return submissions.map((submission) => [
    submission.id,
    submission.createdAt,
    submission.fullName,
    submission.email,
    submission.phone,
    submission.interest,
    submission.method,
    submission.source,
    STATUS_LABELS[submission.status],
    submission.notes,
    submission.syncedToSheet ? 'Yes' : 'No',
  ])
}

export function submissionsToCsv(submissions: Submission[]): string {
  const escapeCell = (value: string) => {
    const safe = value ?? ''
    return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
  }

  const rows = [COLUMNS, ...tableRows(submissions)]
  return `\uFEFF${rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')}`
}

export function submissionsToTsv(submissions: Submission[]): string {
  const clean = (value: string) => (value ?? '').replace(/[\t\r\n]+/g, ' ').trim()
  const rows = [COLUMNS, ...tableRows(submissions)]
  return rows.map((row) => row.map(clean).join('\t')).join('\n')
}

export function downloadSubmissionsCsv(submissions: Submission[]): string {
  const date = new Date().toISOString().slice(0, 10)
  const filename = `herspace-submissions-${date}.csv`
  const blob = new Blob([submissionsToCsv(submissions)], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)

  return filename
}

export async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      return copied
    } catch {
      return false
    }
  }
}
