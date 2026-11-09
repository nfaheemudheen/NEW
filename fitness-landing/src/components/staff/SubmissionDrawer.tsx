import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  CloudOff,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Phone,
  Save,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react'
import { StatusBadge } from '@/components/staff/StatusBadge'
import { STATUS_META } from '@/components/staff/status-meta'
import {
  STATUS_ORDER,
  type Submission,
  type SubmissionStatus,
} from '@/lib/submissions'
import { cn } from '@/lib/utils'

type SubmissionDrawerProps = {
  submission: Submission
  sheetsConfigured: boolean
  syncing: boolean
  onClose: () => void
  onUpdate: (id: string, patch: Partial<Submission>) => void
  onDelete: (id: string) => void
  onSync: (id: string) => void
}

function formatReceived(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown'

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function SubmissionDrawer({
  submission,
  sheetsConfigured,
  syncing,
  onClose,
  onUpdate,
  onDelete,
  onSync,
}: SubmissionDrawerProps) {
  const [notes, setNotes] = useState(submission.notes)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), select:not([disabled])',
        ),
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [])

  const notesChanged = notes.trim() !== submission.notes.trim()

  function setStatus(status: SubmissionStatus) {
    if (status === submission.status) return
    onUpdate(submission.id, { status })
  }

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button
        type="button"
        aria-label="Close enquiry details"
        onClick={onClose}
        className="staff-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-950/40 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-drawer-title"
        className="staff-drawer-in absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-slate-50 shadow-2xl"
      >
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-aqua-950 px-5 pb-6 pt-5 text-white sm:px-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-aqua-400/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-brand-500/25 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">
              Enquiry details
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
              aria-label="Close enquiry details"
            >
              <X size={17} />
            </button>
          </div>

          <div className="relative mt-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="submission-drawer-title" className="font-display text-3xl leading-tight">
                {submission.fullName}
              </h2>
              <p className="mt-1.5 text-sm text-white/60">{submission.interest}</p>
            </div>
            <StatusBadge status={submission.status} className="shrink-0" />
          </div>

          <div className="relative mt-5 flex flex-wrap gap-2">
            <a
              href={`mailto:${submission.email}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/75 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <Mail size={13} className="shrink-0" />
              <span className="truncate">{submission.email || 'No email'}</span>
            </a>
            <a
              href={`tel:${submission.phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/75 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <Phone size={13} /> {submission.phone || 'No phone'}
            </a>
            {submission.isSample && (
              <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-200">
                Sample entry
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Follow-up status
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {STATUS_ORDER.map((status) => {
                const meta = STATUS_META[status]
                const active = submission.status === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(status)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
                      active
                        ? meta.solid
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        active ? 'bg-white/80' : meta.dot,
                      )}
                    />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Enquiry information
            </h3>
            <dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <Detail label="Email address" icon={Mail}>
                <a
                  href={`mailto:${submission.email}`}
                  className="break-words font-medium text-brand-700 hover:text-brand-900"
                >
                  {submission.email || '—'}
                </a>
              </Detail>
              <Detail label="Phone number" icon={Phone}>
                <a
                  href={`tel:${submission.phone.replace(/[^\d+]/g, '')}`}
                  className="font-medium text-brand-700 hover:text-brand-900"
                >
                  {submission.phone || '—'}
                </a>
              </Detail>
              <Detail label="Interested in" icon={MessageCircle}>
                <span className="font-medium text-slate-800">{submission.interest}</span>
              </Detail>
              <Detail label="Preferred contact" icon={MessageCircle}>
                <span className="font-medium text-slate-800">{submission.method}</span>
              </Detail>
              <Detail label="Received" icon={CheckCircle2}>
                <span className="font-medium text-slate-800">{formatReceived(submission.createdAt)}</span>
              </Detail>
              <Detail label="Source" icon={ArrowUpRight}>
                <span className="font-medium text-slate-800">{submission.source}</span>
              </Detail>
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                <StickyNote size={13} className="text-brand-500" /> Internal notes
              </h3>
              <span className="text-[10px] text-slate-300">Only staff can see this</span>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Add a follow-up note, batch preference or next step…"
              className="input-field mt-3 resize-none rounded-xl text-sm"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[10px] text-slate-400">
                {notesChanged ? 'Unsaved changes' : 'Saved with this enquiry'}
              </p>
              <button
                type="button"
                onClick={() => onUpdate(submission.id, { notes: notes.trim() })}
                disabled={!notesChanged}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-2 text-[11px] font-semibold text-brand-800 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={13} /> Save notes
              </button>
            </div>
          </section>

          {submission.isSample ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Sample enquiry</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800/80">
                    Sample entries stay in this browser for previewing the inbox. They are never
                    sent to your Google Sheet. Remove the samples before going live.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section
              className={cn(
                'rounded-2xl border p-4 sm:p-5',
                submission.syncedToSheet
                  ? 'border-aqua-200 bg-aqua-50/70'
                  : 'border-slate-200/80 bg-white shadow-sm',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      submission.syncedToSheet
                        ? 'bg-aqua-100 text-aqua-800'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {submission.syncedToSheet ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <FileSpreadsheet size={17} />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {submission.syncedToSheet
                        ? 'Saved to Google Sheets'
                        : sheetsConfigured
                          ? 'Not in the sheet yet'
                          : 'Spreadsheet sync is off'}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {submission.syncedToSheet
                        ? 'The spreadsheet row is up to date with this enquiry.'
                        : sheetsConfigured
                          ? 'Push this enquiry to your connected Google Sheet now.'
                          : 'Connect a Google Sheet to mirror this inbox. You can still export a CSV any time.'}
                    </p>
                  </div>
                </div>
                <CloudOff
                  size={15}
                  className={cn(
                    'mt-1 shrink-0',
                    submission.syncedToSheet ? 'hidden' : 'text-slate-300',
                  )}
                />
              </div>

              {sheetsConfigured && (
                <button
                  type="button"
                  onClick={() => onSync(submission.id)}
                  disabled={syncing}
                  className="btn-primary mt-4 w-full px-4 py-2.5 text-xs"
                >
                  {syncing ? (
                    <>Syncing…</>
                  ) : (
                    <>
                      <FileSpreadsheet size={14} />
                      {submission.syncedToSheet ? 'Update sheet row' : 'Save to Google Sheets'}
                    </>
                  )}
                </button>
              )}
            </section>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-600">Delete this enquiry?</span>
                <button
                  type="button"
                  onClick={() => onDelete(submission.id)}
                  className="rounded-full bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/25"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-50"
                >
                  Keep
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/15"
              >
                <Trash2 size={13} /> Delete enquiry
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/20"
            >
              Close <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: typeof Mail
  children: ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        <Icon size={12} className="text-brand-400" /> {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-600">{children}</dd>
    </div>
  )
}
