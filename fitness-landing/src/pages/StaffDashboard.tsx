import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  CloudOff,
  Download,
  FileSpreadsheet,
  Inbox,
  Info,
  MailOpen,
  MessagesSquare,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import StaffShell from '@/components/staff/StaffShell'
import SubmissionDrawer from '@/components/staff/SubmissionDrawer'
import SheetsHelpDialog from '@/components/staff/SheetsHelpDialog'
import { StatusBadge } from '@/components/staff/StatusBadge'
import { getStaffSession, logoutStaff, type StaffSession } from '@/lib/auth'
import {
  deleteSubmission,
  getSubmissions,
  markSubmissionSynced,
  mergeSheetSubmissions,
  seedSampleSubmissions,
  STATUS_LABELS,
  STATUS_ORDER,
  subscribeSubmissions,
  updateSubmission,
  type Submission,
  type SubmissionStatus,
} from '@/lib/submissions'
import {
  canPullFromSheet,
  deleteSubmissionFromSheet,
  fetchSubmissionsFromSheet,
  isSheetsConfigured,
  sheetsSpreadsheetUrl,
  syncSubmissionToSheet,
} from '@/lib/sheets'
import {
  copyToClipboard,
  downloadSubmissionsCsv,
  submissionsToTsv,
} from '@/lib/export'
import { cn } from '@/lib/utils'

type FilterValue = 'all' | SubmissionStatus

type Toast = { message: string; tone: 'success' | 'error' | 'info' }

const FILTER_OPTIONS: FilterValue[] = ['all', ...STATUS_ORDER]

const FILTER_LABELS: Record<FilterValue, string> = {
  all: 'All',
  ...STATUS_LABELS,
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function formatRelative(iso: string) {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  if (Number.isNaN(diff)) return 'Unknown'

  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return 'Just now'
  if (diff < hour) return `${Math.floor(diff / minute)} min ago`
  if (diff < day) return `${Math.floor(diff / hour)} hr ago`
  if (diff < 2 * day) return 'Yesterday'
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatFullDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function StaffDashboard() {
  const session = getStaffSession()
  if (!session) return <Navigate to="/staff/login" replace />
  return <StaffDashboardContent session={session} />
}

function StaffDashboardContent({ session }: { session: StaffSession }) {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Submission[]>(() => getSubmissions())
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheetHelpOpen, setSheetHelpOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [syncingIds, setSyncingIds] = useState<Set<string>>(() => new Set())
  const [syncingAll, setSyncingAll] = useState(false)
  const [now] = useState(() => Date.now())
  const searchRef = useRef<HTMLInputElement>(null)
  const autoPullRef = useRef(false)

  useEffect(() => subscribeSubmissions(() => setSubmissions(getSubmissions())), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3_600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selected = selectedId
    ? submissions.find((submission) => submission.id === selectedId) ?? null
    : null

  const counts = useMemo(() => {
    const result: Record<FilterValue, number> = {
      all: submissions.length,
      new: 0,
      contacted: 0,
      booked: 0,
      archived: 0,
    }

    for (const submission of submissions) {
      result[submission.status] += 1
    }

    return result
  }, [submissions])

  const lastSevenDays = useMemo(() => {
    const cutoff = now - 7 * 24 * 60 * 60 * 1000
    return submissions.filter((submission) => new Date(submission.createdAt).getTime() >= cutoff).length
  }, [submissions, now])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return submissions.filter((submission) => {
      if (statusFilter !== 'all' && submission.status !== statusFilter) return false
      if (!term) return true

      return [
        submission.fullName,
        submission.email,
        submission.phone,
        submission.interest,
        submission.method,
        submission.notes,
        submission.source,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [submissions, query, statusFilter])

  const sampleCount = useMemo(
    () => submissions.filter((submission) => submission.isSample).length,
    [submissions],
  )

  const unsyncedCount = useMemo(
    () => submissions.filter((submission) => !submission.syncedToSheet && !submission.isSample).length,
    [submissions],
  )

  const today = new Date(now).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  function showToast(message: string, tone: Toast['tone'] = 'success') {
    setToast({ message, tone })
  }

  function handleLogout() {
    logoutStaff()
    navigate('/staff/login', { replace: true })
  }

  async function pullFromSheet(quiet = true) {
    if (!canPullFromSheet) return { added: 0, updated: 0 }

    const result = await fetchSubmissionsFromSheet()

    if (!result.ok) {
      if (!quiet) showToast(result.error, 'error')
      return null
    }

    const merged = mergeSheetSubmissions(result.submissions)

    if (!quiet && merged.added === 0 && merged.updated === 0) {
      showToast('The spreadsheet has no new changes.', 'info')
    }

    return merged
  }

  useEffect(() => {
    if (!canPullFromSheet || autoPullRef.current) return
    autoPullRef.current = true

    void pullFromSheet(true).then((merged) => {
      if (!merged || (merged.added === 0 && merged.updated === 0)) return

      const changes: string[] = []
      if (merged.added > 0) changes.push(`${merged.added} new`)
      if (merged.updated > 0) changes.push(`${merged.updated} updated`)
      showToast(`Google Sheet checked: ${changes.join(', ')} from the spreadsheet.`, 'info')
    })
  }, [])

  async function syncOne(id: string, quiet = false) {
    const submission = getSubmissions().find((item) => item.id === id)
    if (!submission) {
      if (!quiet) showToast('That enquiry could not be found.', 'error')
      return false
    }

    if (submission.isSample) {
      if (!quiet) {
        showToast('Sample enquiries stay in this browser and are never synced.', 'info')
      }
      return false
    }

    setSyncingIds((current) => new Set(current).add(id))
    const result = await syncSubmissionToSheet(submission)
    setSyncingIds((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })

    if (result.ok) {
      markSubmissionSynced(id)
      if (!quiet) showToast('Saved to Google Sheets.', 'success')
      return true
    }

    if (!quiet) {
      showToast(result.error, 'error')
    }

    return false
  }

  async function syncAll() {
    const pending = getSubmissions().filter(
      (submission) => !submission.syncedToSheet && !submission.isSample,
    )

    setSyncingAll(true)
    let synced = 0
    let failed = 0

    try {
      for (const submission of pending) {
        const result = await syncSubmissionToSheet(submission)
        if (result.ok) {
          markSubmissionSynced(submission.id)
          synced += 1
        } else {
          failed += 1
        }
      }

      // Pull after pushing so edits made directly in the sheet also appear here.
      const pulled = await pullFromSheet(true)
      const changes: string[] = []

      if (synced > 0) changes.push(`${synced} pushed`)
      if (pulled?.added) changes.push(`${pulled.added} new from sheet`)
      if (pulled?.updated) changes.push(`${pulled.updated} updated from sheet`)

      if (failed > 0) {
        showToast(
          `${synced} synced, ${failed} could not reach the submissions service. Check the backend setup.`,
          'error',
        )
        return
      }

      if (changes.length > 0) {
        showToast(`Sheet sync complete: ${changes.join(', ')}.`)
        return
      }

      showToast('Everything is already up to date.', 'info')
    } finally {
      setSyncingAll(false)
    }
  }

  async function handleUpdate(id: string, patch: Partial<Submission>) {
    const existing = getSubmissions().find((submission) => submission.id === id)
    const updated = updateSubmission(id, existing?.isSample ? patch : { ...patch, syncedToSheet: false })
    if (!updated) return

    if (updated.isSample) {
      showToast('Sample enquiry updated in this browser.', 'info')
      return
    }

    if (!isSheetsConfigured) {
      showToast('Changes saved in this browser.', 'info')
      return
    }

    const synced = await syncOne(id, true)
    showToast(
      synced
        ? 'Changes saved and synced to Google Sheets.'
        : 'Changes saved here, but the Google Sheets sync failed. Retry from the enquiry.',
      synced ? 'success' : 'error',
    )
  }

  async function handleDelete(id: string) {
    const submission = getSubmissions().find((item) => item.id === id)
    deleteSubmission(id)
    setSelectedId(null)

    if (!submission || submission.isSample || !isSheetsConfigured) {
      showToast('Enquiry deleted.')
      return
    }

    const result = await deleteSubmissionFromSheet(id)
    showToast(
      result.ok
        ? 'Enquiry deleted from the inbox and Google Sheet.'
        : 'Enquiry deleted here, but its Google Sheet row could not be removed. Delete it in the spreadsheet.',
      result.ok ? 'success' : 'error',
    )
  }

  function handleExport() {
    if (filtered.length === 0) {
      showToast('There are no enquiries to export in this view.', 'info')
      return
    }

    const filename = downloadSubmissionsCsv(filtered)
    showToast(`${filtered.length} ${filtered.length === 1 ? 'enquiry' : 'enquiries'} exported to ${filename}.`)
  }

  async function handleCopyForSheets() {
    if (filtered.length === 0) {
      showToast('There are no enquiries to copy in this view.', 'info')
      return
    }

    const copied = await copyToClipboard(submissionsToTsv(filtered))
    showToast(
      copied
        ? 'Copied. Paste into a new Google Sheet or Excel tab.'
        : 'Could not copy automatically. Use Export CSV instead.',
      copied ? 'success' : 'error',
    )
  }

  function handleSeedSamples() {
    seedSampleSubmissions()
    setStatusFilter('all')
    showToast('Sample enquiries loaded. They are labelled and easy to remove.')
  }

  function handleRemoveSamples() {
    for (const submission of getSubmissions()) {
      if (submission.isSample) deleteSubmission(submission.id)
    }
    showToast('Sample enquiries removed.')
  }

  function handleClearFilters() {
    setStatusFilter('all')
    setQuery('')
    searchRef.current?.focus()
  }

  const statCards = [
    {
      key: 'all' as const,
      label: 'Total enquiries',
      value: counts.all,
      hint: `${lastSevenDays} in the last 7 days`,
      icon: Inbox,
      tone: 'dark' as const,
    },
    {
      key: 'new' as const,
      label: 'New',
      value: counts.new,
      hint: 'Waiting for a first reply',
      icon: BellRing,
      tone: 'brand' as const,
    },
    {
      key: 'contacted' as const,
      label: 'Contacted',
      value: counts.contacted,
      hint: 'In conversation',
      icon: MessagesSquare,
      tone: 'amber' as const,
    },
    {
      key: 'booked' as const,
      label: 'Booked',
      value: counts.booked,
      hint: 'Ready to welcome',
      icon: CalendarCheck2,
      tone: 'aqua' as const,
    },
  ]

  return (
    <StaffShell session={session} onLogout={handleLogout}>
      <div className="space-y-6">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-aqua-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-aqua-500" />
              </span>
              Staff workspace · {today}
            </p>
            <h1 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">
              Submission inbox
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              Every enquiry from the website, ready for a warm follow-up. Update the status, keep
              notes and move enquiries along at your own pace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyForSheets}
              className="btn-outline w-auto px-4 py-2.5 text-sm"
            >
              <ClipboardCopy size={16} /> Copy for Sheets
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="btn-primary group w-auto px-4 py-2.5 text-sm"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </section>

        <section aria-label="Inbox summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statCards.map(({ key, label, value, hint, icon: Icon, tone }) => {
            const active = statusFilter === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                aria-pressed={active}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
                  tone === 'dark'
                    ? 'border-brand-900 bg-gradient-to-br from-brand-950 via-brand-900 to-aqua-950 text-white shadow-lg shadow-brand-950/15'
                    : 'border-slate-200/80 bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-brand-200',
                  active && tone !== 'dark' && 'border-brand-300 ring-2 ring-brand-500/15',
                )}
              >
                {tone === 'dark' ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-aqua-400/20 blur-2xl"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-brand-500/25 blur-2xl"
                    />
                  </>
                ) : (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-slate-100/80 blur-2xl transition-colors group-hover:bg-brand-100/70"
                  />
                )}

                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl',
                      tone === 'dark' && 'border border-white/10 bg-white/10 text-aqua-200',
                      tone === 'brand' && 'bg-brand-50 text-brand-700',
                      tone === 'amber' && 'bg-amber-50 text-amber-600',
                      tone === 'aqua' && 'bg-aqua-50 text-aqua-700',
                    )}
                  >
                    <Icon size={17} />
                  </span>
                  <span
                    className={cn(
                      'font-display text-3xl leading-none',
                      tone === 'dark' ? 'text-white' : 'text-slate-900',
                    )}
                  >
                    {value}
                  </span>
                </div>
                <p
                  className={cn(
                    'relative mt-3 text-[11px] font-bold uppercase tracking-[0.13em]',
                    tone === 'dark' ? 'text-white/80' : 'text-slate-600',
                  )}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    'relative mt-0.5 text-[10px]',
                    tone === 'dark' ? 'text-white/45' : 'text-slate-400',
                  )}
                >
                  {hint}
                </p>
              </button>
            )
          })}
        </section>

        {isSheetsConfigured ? (
          <section
            aria-label="Google Sheets sync"
            className="flex flex-col gap-3 rounded-2xl border border-aqua-200 bg-aqua-50/80 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aqua-100 text-aqua-800">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <p className="text-xs font-bold text-aqua-900">Google Sheets connected</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {unsyncedCount > 0
                    ? `${unsyncedCount} ${unsyncedCount === 1 ? 'enquiry is' : 'enquiries are'} waiting to sync. Sync now also pulls edits made in the sheet.`
                    : 'Inbox and spreadsheet are in sync. Sync now also pulls edits made in the sheet.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sheetsSpreadsheetUrl && (
                <a
                  href={sheetsSpreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-aqua-800 transition-colors hover:bg-aqua-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-500/20"
                >
                  Open sheet <ArrowUpRight size={13} />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSheetHelpOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-aqua-800 transition-colors hover:bg-aqua-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-500/20"
              >
                <Settings2 size={13} /> Setup
              </button>
              <button
                type="button"
                onClick={syncAll}
                disabled={syncingAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-aqua-700 bg-aqua-700 px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-aqua-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={13} className={cn(syncingAll && 'animate-spin')} />
                {syncingAll ? 'Syncing…' : 'Sync now'}
              </button>
            </div>
          </section>
        ) : (
          <section
            aria-label="Spreadsheet sync status"
            className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <CloudOff size={17} />
              </span>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Local mode · Google Sheets isn't connected
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Submissions are saved in this browser. Export a spreadsheet-ready CSV, or connect
                  a Google Sheet for live syncing.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSheetHelpOpen(true)}
              className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3.5 py-2 text-[11px] font-semibold text-amber-800 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20 sm:ml-4"
            >
              <FileSpreadsheet size={13} /> Connect Google Sheet
            </button>
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_26px_60px_-46px_rgba(9,39,71,0.28)]">
          {sampleCount > 0 && (
            <div className="flex flex-col gap-2 border-b border-amber-100 bg-amber-50/60 px-4 py-2.5 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="flex items-center gap-2 font-medium text-amber-800">
                <Sparkles size={13} /> You're viewing {sampleCount} sample{' '}
                {sampleCount === 1 ? 'enquiry' : 'enquiries'}. Remove them before going live.
              </p>
              <button
                type="button"
                onClick={handleRemoveSamples}
                className="inline-flex w-fit items-center gap-1 font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
              >
                <Trash2 size={12} /> Remove samples
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MailOpen size={17} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {statusFilter === 'all' ? 'All enquiries' : `${FILTER_LABELS[statusFilter]} enquiries`}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {filtered.length} of {submissions.length} shown
                </p>
              </div>
            </div>

            {submissions.length > 0 && (
              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, email or phone…"
                  aria-label="Search submissions"
                  className="input-field rounded-full py-2.5 pl-10 pr-9 text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          {submissions.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 sm:px-5">
              {FILTER_OPTIONS.map((filter) => {
                const active = statusFilter === filter
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15',
                      active
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800',
                    )}
                  >
                    {filter !== 'all' && (
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          filter === 'new' && 'bg-brand-500',
                          filter === 'contacted' && 'bg-amber-500',
                          filter === 'booked' && 'bg-aqua-500',
                          filter === 'archived' && 'bg-slate-400',
                          active && 'bg-white/70',
                        )}
                      />
                    )}
                    {FILTER_LABELS[filter]}
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                        active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {counts[filter]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {submissions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-8 ring-brand-50/60">
                <Inbox size={28} />
              </div>
              <h3 className="mt-5 font-display text-2xl text-slate-900">Your inbox is ready.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                When a woman sends an enquiry through the website contact form, it will appear
                here — ready to review, note and follow up.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <button type="button" onClick={handleSeedSamples} className="btn-outline px-4 py-2.5 text-sm">
                  <Sparkles size={15} /> Load sample enquiries
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                >
                  Preview enquiry form <ArrowUpRight size={15} />
                </Link>
              </div>
              <p className="mt-4 text-[10px] text-slate-400">
                Sample entries are clearly labelled and can be removed in one click.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={24} />
              </div>
              <h3 className="mt-4 font-display text-xl text-slate-900">No matching enquiries</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                Try a different search term or clear the filters to see the whole inbox.
              </p>
              <button type="button" onClick={handleClearFilters} className="btn-outline mt-5 px-4 py-2.5 text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40 text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                      <th scope="col" className="px-5 py-3.5 font-bold">Enquirer</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">Interest</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">Phone</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">Received</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">Status</th>
                      <th scope="col" className="px-5 py-3.5 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedId(submission.id)}
                        className="group cursor-pointer transition-colors hover:bg-brand-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-aqua-100 text-[10px] font-bold text-brand-800">
                              {initials(submission.fullName) || 'HS'}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {submission.fullName}
                                </p>
                                {submission.isSample && (
                                  <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-amber-600">
                                    Sample
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                {submission.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-medium text-slate-700">{submission.interest}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">via {submission.method}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                          {submission.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="text-xs font-medium text-slate-600">
                            {formatRelative(submission.createdAt)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {formatFullDate(submission.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={submission.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedId(submission.id)
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-brand-200 group-hover:text-brand-700 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                            aria-label={`View enquiry from ${submission.fullName}`}
                          >
                            <ChevronRight size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {filtered.map((submission) => (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => setSelectedId(submission.id)}
                    className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-brand-50/40 focus:outline-none focus-visible:bg-brand-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-aqua-100 text-[10px] font-bold text-brand-800">
                          {initials(submission.fullName) || 'HS'}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {submission.fullName}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">{submission.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={submission.status} className="shrink-0" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                      <span className="font-medium text-slate-600">{submission.interest}</span>
                      <span aria-hidden="true">·</span>
                      <span>via {submission.method}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelative(submission.createdAt)}</span>
                      {submission.isSample && (
                        <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-amber-600">
                          Sample
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{submission.phone}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
                        Open <ChevronRight size={13} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {filtered.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/40 px-4 py-3 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p>
                Showing {filtered.length} of {submissions.length} enquiries
                {statusFilter !== 'all' && ` · ${FILTER_LABELS[statusFilter]} filter`}
                {query && ' · search applied'}
              </p>
              <p className="flex items-center gap-1.5">
                <Info size={11} /> Click an enquiry to manage follow-up and notes.
              </p>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <SubmissionDrawer
          key={selected.id}
          submission={selected}
          sheetsConfigured={isSheetsConfigured}
          syncing={syncingIds.has(selected.id)}
          onClose={() => setSelectedId(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onSync={(id) => void syncOne(id)}
        />
      )}

      {sheetHelpOpen && <SheetsHelpDialog onClose={() => setSheetHelpOpen(false)} />}

      {toast && (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-4 z-[90] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end',
            selected ? 'bottom-24' : 'bottom-4',
          )}
        >
          <div
            role="status"
            aria-live="polite"
            className={cn(
              'staff-toast-in pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs font-medium shadow-xl backdrop-blur',
              toast.tone === 'success' && 'border-aqua-200 bg-white/95 text-slate-700',
              toast.tone === 'error' && 'border-rose-200 bg-white/95 text-slate-700',
              toast.tone === 'info' && 'border-brand-200 bg-white/95 text-slate-700',
            )}
          >
            {toast.tone === 'success' && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-aqua-600" />}
            {toast.tone === 'error' && <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />}
            {toast.tone === 'info' && <Info size={16} className="mt-0.5 shrink-0 text-brand-600" />}
            <span className="leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </StaffShell>
  )
}
