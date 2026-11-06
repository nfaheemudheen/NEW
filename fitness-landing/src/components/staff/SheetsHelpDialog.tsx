import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCopy,
  CloudOff,
  FileSpreadsheet,
  X,
} from 'lucide-react'
import { copyToClipboard } from '@/lib/export'
import { isSheetsConfigured, sheetsSpreadsheetUrl } from '@/lib/sheets'
import { cn } from '@/lib/utils'

const ENV_TEMPLATE = `VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_SHEETS_SHARED_SECRET=herspace-sheet-secret
VITE_SHEETS_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

const STEPS = [
  {
    title: 'Create the spreadsheet',
    body: 'Make a new Google Sheet named Her Space Submissions. The Apps Script creates the Submissions tab and header row automatically.',
  },
  {
    title: 'Add the Apps Script',
    body: 'In the sheet, open Extensions → Apps Script. Replace Code.gs with the file from this project at google-apps-script/Code.gs, then save.',
  },
  {
    title: 'Deploy as a web app',
    body: 'Click Deploy → New deployment → Web app. Execute as Me, set access to Anyone, then deploy and copy the web app URL. Redeploy a new version whenever you change Code.gs.',
  },
  {
    title: 'Connect the portal',
    body: 'Add the web app URL, shared secret and spreadsheet URL to your .env file, then restart the dev server or redeploy the site.',
  },
]

export default function SheetsHelpDialog({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
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

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
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

  async function copyTemplate() {
    const success = await copyToClipboard(ENV_TEMPLATE)
    if (!success) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1_800)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close Google Sheets setup"
        onClick={onClose}
        className="staff-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-950/45 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheets-dialog-title"
        className="staff-dialog-in relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-2xl"
      >
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-aqua-950 px-5 py-5 text-white sm:px-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-aqua-400/20 blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-aqua-200">
                <FileSpreadsheet size={19} />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-200">
                  Spreadsheet sync
                </p>
                <h2 id="sheets-dialog-title" className="mt-0.5 font-display text-2xl">
                  Connect a Google Sheet
                </h2>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
              aria-label="Close Google Sheets setup"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div
            className={cn(
              'flex items-start gap-3 rounded-2xl border px-4 py-3',
              isSheetsConfigured
                ? 'border-aqua-200 bg-aqua-50'
                : 'border-amber-200 bg-amber-50',
            )}
          >
            {isSheetsConfigured ? (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-aqua-700" />
            ) : (
              <CloudOff size={17} className="mt-0.5 shrink-0 text-amber-600" />
            )}
            <div className="text-xs leading-relaxed">
              <p className={cn('font-semibold', isSheetsConfigured ? 'text-aqua-900' : 'text-amber-900')}>
                {isSheetsConfigured ? 'Google Sheets is connected.' : 'Sync is not connected yet.'}
              </p>
              <p className="mt-0.5 text-slate-600">
                {isSheetsConfigured
                  ? 'New enquiries sync automatically. Use Sync now to push status and note changes, or pull edits made directly in the sheet.'
                  : 'Every submission is safely kept in this browser. Finish the four steps below to mirror them into a spreadsheet.'}
              </p>
              {isSheetsConfigured && sheetsSpreadsheetUrl && (
                <a
                  href={sheetsSpreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 font-semibold text-aqua-800 hover:text-aqua-950"
                >
                  Open the spreadsheet <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>

          <ol className="mt-5 space-y-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700 ring-1 ring-brand-100">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                .env
              </p>
              <button
                type="button"
                onClick={copyTemplate}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={12} className="text-aqua-400" /> Copied
                  </>
                ) : (
                  <>
                    <ClipboardCopy size={12} /> Copy template
                  </>
                )}
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[10.5px] leading-relaxed text-slate-300">
              {ENV_TEMPLATE}
            </pre>
          </div>

          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-[10px] leading-relaxed text-slate-400">
            Sync works both ways: pressing Sync now pushes local status and note changes, then pulls
            any edits or new rows from the sheet. Deleting an enquiry in the portal also removes its
            sheet row. Sample enquiries are never synced.
          </p>

          <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-[10px] leading-relaxed text-slate-400">
            Keep the shared secret in both the Apps Script and your environment. For a live site,
            add the same variables in your hosting dashboard (Vercel, Netlify, etc.) and redeploy.
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <p className="text-[10px] text-slate-400">
            Script included at <span className="font-mono">google-apps-script/Code.gs</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
