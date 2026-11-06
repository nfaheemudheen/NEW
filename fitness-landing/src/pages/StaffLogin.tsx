import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  Eye,
  EyeOff,
  Flower2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import studioImage from '@/assets/studio.jpg'
import { getStaffSession, loginStaff } from '@/lib/auth'
import { cn } from '@/lib/utils'

const PORTAL_FEATURES = [
  {
    icon: ClipboardList,
    title: 'Every enquiry in one place',
    text: 'See new website enquiries the moment they arrive.',
  },
  {
    icon: CalendarCheck2,
    title: 'Follow up with confidence',
    text: 'Track who is new, contacted, booked or archived.',
  },
  {
    icon: Sparkles,
    title: 'Ready for your spreadsheet',
    text: 'Export a CSV or sync live to Google Sheets.',
  },
]

export default function StaffLogin() {
  const navigate = useNavigate()
  const existingSession = getStaffSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const passwordRef = useRef<HTMLInputElement>(null)

  if (existingSession) {
    return <Navigate to="/staff" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError('')

    if (!username.trim() || !password) {
      setError('Enter both your username and password to continue.')
      return
    }

    setSubmitting(true)

    const result = await loginStaff(username, password, remember)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      setPassword('')
      passwordRef.current?.focus()
      return
    }

    navigate('/staff', { replace: true })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Story panel */}
        <section className="relative hidden overflow-hidden bg-brand-950 px-10 py-10 lg:flex lg:flex-col xl:px-14 xl:py-12">
          <img
            src={studioImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-950/80 to-aqua-950/85"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-aqua-500/20 blur-[130px]"
          />

          <div className="relative flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-2xl bg-white p-2 pr-5 shadow-xl shadow-brand-950/30 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              aria-label="Her Space Fitness Studio home"
            >
              <img src="/logo2.png" alt="" className="h-12 w-12 object-contain" />
              <span>
                <span className="block font-display text-base leading-tight text-slate-900">
                  Her Space
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Fitness Studio
                </span>
              </span>
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-aqua-300 opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-aqua-300" />
              </span>
              Staff access
            </span>
          </div>

          <div className="relative my-auto max-w-xl py-14">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-200 backdrop-blur">
              <Flower2 size={13} /> The studio, in your pocket
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.08] text-white xl:text-[3.4rem]">
              Every enquiry.
              <br />
              Every follow-up.
              <br />
              <span className="italic text-aqua-300">All in one place.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
              Welcome to the Her Space staff workspace — the calm, organised way to look after
              every woman who reaches out to the studio.
            </p>

            <div className="mt-9 space-y-4">
              {PORTAL_FEATURES.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-aqua-200 backdrop-blur',
                      index === 2 && 'text-brand-200',
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/50">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-[11px] text-white/40">
            <span>© 2026 Her Space Studio</span>
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole size={12} /> Private staff area
            </span>
          </div>
        </section>

        {/* Login panel */}
        <section className="relative flex min-h-screen flex-col bg-slate-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-200/30 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-aqua-200/30 blur-[110px]"
          />

          <header className="relative flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <Link
              to="/"
              className="flex items-center gap-2.5 lg:invisible"
              aria-label="Her Space Fitness Studio home"
            >
              <img src="/logo2.png" alt="" className="h-11 w-11 object-contain" />
              <span className="font-display text-lg text-slate-900">Her Space</span>
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Back to website
            </Link>
          </header>

          <div className="relative flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="w-full max-w-[27rem]">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  <ShieldCheck size={13} /> Staff portal
                </span>
                <h2 className="mt-4 font-display text-4xl leading-tight text-slate-900 sm:text-[2.6rem]">
                  Welcome back.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Sign in to review website enquiries, keep track of follow-ups and manage your
                  submission inbox.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium leading-relaxed text-rose-700"
                >
                  <LockKeyhole size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="staff-username"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="staff-username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="staff"
                      aria-invalid={Boolean(error)}
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <label htmlFor="staff-password" className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      Default details below
                    </span>
                  </div>
                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      ref={passwordRef}
                      id="staff-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      aria-invalid={Boolean(error)}
                      className="input-field pl-11 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-brand-600 focus:ring-brand-500"
                  />
                  Keep me signed in for 7 days
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary mt-1 w-full rounded-2xl py-3.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign in to portal <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-slate-400">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand-500" />
                Staff access only. Sessions end automatically for your privacy.
              </p>
            </div>
          </div>

          <footer className="relative px-5 pb-5 text-center text-[10px] text-slate-300 sm:px-8 lg:px-10">
            Her Space Studio · OMR, Kelambakkam · Staff workspace
          </footer>
        </section>
      </div>
    </main>
  )
}
