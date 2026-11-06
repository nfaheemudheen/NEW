export type SubmissionStatus = 'new' | 'contacted' | 'booked' | 'archived'

export type Submission = {
  id: string
  fullName: string
  email: string
  phone: string
  interest: string
  method: string
  source: string
  status: SubmissionStatus
  notes: string
  createdAt: string
  syncedToSheet: boolean
  isSample?: boolean
}

export type NewSubmission = {
  fullName: string
  email: string
  phone: string
  interest: string
  method: string
  source?: string
  notes?: string
  status?: SubmissionStatus
  createdAt?: string
  isSample?: boolean
}

export const SUBMISSIONS_KEY = 'herspace.staff.submissions.v1'
const REMOVED_KEY = 'herspace.staff.removed.v1'
const CHANGE_EVENT = 'herspace:submissions-changed'

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  archived: 'Archived',
}

export const STATUS_ORDER: SubmissionStatus[] = ['new', 'contacted', 'booked', 'archived']

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isStatus(value: unknown): value is SubmissionStatus {
  return value === 'new' || value === 'contacted' || value === 'booked' || value === 'archived'
}

function toSubmission(value: unknown): Submission | null {
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  if (typeof item.id !== 'string' || typeof item.fullName !== 'string') return null

  return {
    id: item.id,
    fullName: item.fullName,
    email: typeof item.email === 'string' ? item.email : '',
    phone: typeof item.phone === 'string' ? item.phone : '',
    interest: typeof item.interest === 'string' ? item.interest : 'General enquiry',
    method: typeof item.method === 'string' ? item.method : 'Email',
    source: typeof item.source === 'string' ? item.source : 'Website enquiry form',
    status: isStatus(item.status) ? item.status : 'new',
    notes: typeof item.notes === 'string' ? item.notes : '',
    createdAt:
      typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt))
        ? item.createdAt
        : new Date().toISOString(),
    syncedToSheet: item.syncedToSheet === true,
    isSample: item.isSample === true,
  }
}

function readSubmissions(): Submission[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(SUBMISSIONS_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(toSubmission)
      .filter((submission): submission is Submission => submission !== null)
  } catch {
    return []
  }
}

function readRemovedIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(REMOVED_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

function addRemovedIds(ids: string[]) {
  if (typeof window === 'undefined' || ids.length === 0) return

  try {
    const removed = new Set([...readRemovedIds(), ...ids])
    window.localStorage.setItem(REMOVED_KEY, JSON.stringify([...removed]))
  } catch {
    // Storage can be unavailable; the deleted rows are already hidden locally.
  }
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function writeSubmissions(submissions: Submission[]) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions))
    notifyChange()
  } catch {
    // Storage can be unavailable in private browsing or when it is full.
    // The dashboard still shows what is in memory for this session.
  }
}

/** Newest submissions first. */
export function getSubmissions(): Submission[] {
  return readSubmissions().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function addSubmission(input: NewSubmission): Submission {
  const submission: Submission = {
    id: createId(),
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    interest: input.interest,
    method: input.method,
    source: input.source ?? 'Website enquiry form',
    status: input.status ?? 'new',
    notes: input.notes ?? '',
    createdAt: input.createdAt ?? new Date().toISOString(),
    syncedToSheet: false,
    isSample: input.isSample,
  }

  writeSubmissions([submission, ...readSubmissions()])
  return submission
}

export function updateSubmission(
  id: string,
  patch: Partial<Omit<Submission, 'id'>>,
): Submission | null {
  const submissions = readSubmissions()
  const index = submissions.findIndex((submission) => submission.id === id)
  if (index === -1) return null

  const next: Submission = { ...submissions[index], ...patch, id }
  submissions[index] = next
  writeSubmissions(submissions)
  return next
}

export function markSubmissionSynced(id: string): void {
  updateSubmission(id, { syncedToSheet: true })
}

export function deleteSubmission(id: string): void {
  const submissions = readSubmissions()
  const remaining = submissions.filter((submission) => submission.id !== id)
  writeSubmissions(remaining)

  if (remaining.length !== submissions.length) {
    addRemovedIds([id])
  }
}

export function clearSubmissions(): void {
  addRemovedIds(readSubmissions().map((submission) => submission.id))
  writeSubmissions([])
}

function sameEnquiryDetails(a: Submission, b: Submission) {
  return (
    a.fullName === b.fullName &&
    a.email === b.email &&
    a.phone === b.phone &&
    a.interest === b.interest &&
    a.method === b.method &&
    a.source === b.source &&
    a.status === b.status &&
    a.notes === b.notes &&
    a.createdAt === b.createdAt
  )
}

/**
 * Merges rows pulled from the Google Sheet into the local inbox.
 * Local edits that have not reached the sheet are preserved; removed rows stay
 * hidden so a failed sheet delete cannot bring an enquiry back.
 */
export function mergeSheetSubmissions(rows: unknown[]): { added: number; updated: number } {
  if (typeof window === 'undefined') return { added: 0, updated: 0 }

  const removed = new Set(readRemovedIds())
  const map = new Map(readSubmissions().map((submission) => [submission.id, submission]))
  let added = 0
  let updated = 0

  for (const row of rows) {
    const normalized = toSubmission(row)
    if (!normalized || removed.has(normalized.id)) continue

    const remote: Submission = { ...normalized, syncedToSheet: true }
    const existing = map.get(remote.id)

    if (!existing) {
      map.set(remote.id, remote)
      added += 1
      continue
    }

    // Do not overwrite a local note or status change that has not synced yet.
    if (existing.syncedToSheet && !sameEnquiryDetails(existing, remote)) {
      map.set(remote.id, { ...remote, isSample: existing.isSample })
      updated += 1
    }
  }

  if (added > 0 || updated > 0) {
    writeSubmissions([...map.values()])
  }

  return { added, updated }
}

export function subscribeSubmissions(listener: () => void): () => void {
  const onLocalChange = () => listener()
  const onStorage = (event: StorageEvent) => {
    if (event.key === SUBMISSIONS_KEY) listener()
  }

  window.addEventListener(CHANGE_EVENT, onLocalChange)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocalChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function seedSampleSubmissions(): void {
  if (getSubmissions().length > 0) return

  const now = Date.now()
  const samples: Array<Omit<Submission, 'id' | 'syncedToSheet' | 'isSample'>> = [
    {
      fullName: 'Ananya Raman',
      email: 'ananya.raman@example.com',
      phone: '+91 90000 12345',
      interest: 'Weight Loss & Fitness',
      method: 'WhatsApp',
      source: 'Website enquiry form',
      status: 'new',
      notes: 'Wants a morning batch and a trial class this week.',
      createdAt: new Date(now - 42 * 60 * 1000).toISOString(),
    },
    {
      fullName: 'Divya Krishnan',
      email: 'divya.k@example.com',
      phone: '+91 98401 55621',
      interest: 'Yoga & Flexibility',
      method: 'Email',
      source: 'Website enquiry form',
      status: 'contacted',
      notes: 'Called on Monday. Interested in weekend yoga sessions.',
      createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      fullName: 'Meera Suresh',
      email: 'meera.suresh@example.com',
      phone: '+91 99620 44780',
      interest: 'Personal Training',
      method: 'Phone',
      source: 'Website enquiry form',
      status: 'booked',
      notes: 'Trial session booked for Saturday at 10:00am.',
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      fullName: 'Kavya Nair',
      email: 'kavya.nair@example.com',
      phone: '+91 94440 33218',
      interest: 'Membership enquiry',
      method: 'WhatsApp',
      source: 'Website enquiry form',
      status: 'archived',
      notes: 'Joined the starter membership. Enquiry closed.',
      createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const seeded: Submission[] = samples.map((sample) => ({
    ...sample,
    id: createId(),
    syncedToSheet: false,
    isSample: true,
  }))

  writeSubmissions(seeded)
}

export function countByStatus(submissions: Submission[], status: SubmissionStatus): number {
  return submissions.filter((submission) => submission.status === status).length
}
