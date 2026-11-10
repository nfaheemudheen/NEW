import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { addSubmission, markSubmissionSynced } from '@/lib/submissions'
import { createSubmissionOnBackend } from '@/lib/sheets'

const DISMISSED_KEY = 'herspace.thiruporur-launch-popup-seen'

export default function BranchLaunchPopup() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'announcement' | 'form' | 'success'>('announcement')
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [syncWarning, setSyncWarning] = useState('')

  useEffect(() => {
    if (pathname !== '/') {
      setOpen(false)
      return
    }

    try {
      if (window.sessionStorage.getItem(DISMISSED_KEY)) return
    } catch {
      // Keep the announcement usable when browser storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(DISMISSED_KEY, 'true')
      } catch {
        // The popup can still be dismissed for this render.
      }
      setOpen(true)
    }, 2100)

    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    const submission = addSubmission({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      interest: 'Membership enquiry',
      method: 'Phone',
      source: 'Thiruporur branch launch popup',
    })

    try {
      const result = await createSubmissionOnBackend(submission)
      if (result.ok) {
        markSubmissionSynced(submission.id)
        setSyncWarning('')
      } else {
        setSyncWarning('Your enquiry is saved in the staff inbox, but could not reach the spreadsheet. The studio can still follow up from the staff portal.')
      }
      setStep('success')
    } catch {
      setSyncWarning('Your enquiry is saved in the staff inbox, but the spreadsheet could not be reached. The studio can still follow up from the staff portal.')
      setStep('success')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-brand-950/55 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="branch-launch-title"
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 text-center shadow-[0_35px_100px_-35px_rgba(9,39,71,0.7)] sm:rounded-[2.5rem] sm:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-aqua-200/60 blur-3xl" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close branch announcement"
              autoFocus
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-brand-50 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
            >
              <X size={18} />
            </button>

            <div className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] bg-white shadow-sm ring-1 ring-brand-100 sm:h-20 sm:w-20">
              <img src="/logo2.png" alt="Her Space" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
            </div>
            <p className="relative mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700">Her Space · Thiruporur</p>
            <h2 id="branch-launch-title" className="relative mx-auto mt-2 max-w-md font-display text-3xl leading-tight text-brand-950 sm:text-4xl">
              {step === 'announcement' && <>Her Space is now <span className="text-brand-700">coming to Thiruporur</span></>}
              {step === 'form' && <>Join the <span className="text-brand-700">Thiruporur launch list</span></>}
              {step === 'success' && <>Thanks, <span className="text-brand-700">{form.fullName.trim()}</span></>}
            </h2>
            {step === 'announcement' && (
              <>
                <p className="relative mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
                  We look forward to welcoming you. Leave your details and our team will keep you updated about opening plans and membership.
                </p>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="relative mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3 text-sm font-bold text-brand-950 shadow-[0_16px_32px_-18px_rgba(56,183,7,0.7)] transition hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-500/30 sm:w-auto sm:min-w-48"
                >
                  Join us <ArrowRight size={17} />
                </button>
                <p className="relative mt-4 text-xs text-slate-400">Branch One · Thiruporur</p>
              </>
            )}

            {step === 'form' && (
              <form onSubmit={submitEnquiry} className="relative mt-5 space-y-3 text-left">
                <p className="mb-4 text-center text-sm leading-relaxed text-slate-600">
                  Share your details and the team will contact you with launch updates.
                </p>
                <label className="block text-xs font-semibold text-slate-700">
                  Full name
                  <input
                    autoFocus
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Your full name"
                    className="input-field mt-1.5"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Phone number
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="Your phone number"
                    className="input-field mt-1.5"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Email address
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="name@example.com"
                    className="input-field mt-1.5"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3 text-sm font-bold text-brand-950 shadow-[0_16px_32px_-18px_rgba(56,183,7,0.7)] transition hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-500/30 disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? <><Loader2 size={17} className="animate-spin" /> Sending…</> : <>Send my enquiry <ArrowRight size={17} /></>}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('announcement')}
                  className="mx-auto inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold text-slate-500 transition hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                >
                  <ArrowLeft size={14} /> Back to announcement
                </button>
              </form>
            )}

            {step === 'success' && (
              <div role="status" aria-live="polite" className="relative mt-5">
                <CheckCircle2 size={38} className="mx-auto text-aqua-500" />
                <p className="mt-3 text-sm leading-6 text-slate-600">Your launch update request has been saved. Our team will be in touch.</p>
                <p className={`mt-4 rounded-2xl border px-4 py-3 text-left text-xs leading-relaxed ${syncWarning ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-aqua-200 bg-aqua-50 text-aqua-900'}`}>
                  {syncWarning || 'Your details have been sent to the studio team.'}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="relative mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 sm:w-auto sm:min-w-48"
                >
                  Done <CheckCircle2 size={17} />
                </button>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
