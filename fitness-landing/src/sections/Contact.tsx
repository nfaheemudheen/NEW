import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Flower2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons'
import studioImage from '@/assets/studio.jpg'
import { BRANCHES, CONTACT_METHODS, ENQUIRY_INTERESTS, STUDIO } from '@/data/site'
import { addSubmission, markSubmissionSynced } from '@/lib/submissions'
import { createSubmissionOnBackend } from '@/lib/sheets'
import { cn } from '@/lib/utils'

type ContactForm = {
  fullName: string
  phone: string
  email: string
  interest: string
  method: string
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>
type FormStatus = 'idle' | 'checking' | 'success'

type ContactProps = {
  prefill: { interest: string; key: number }
}

const EMPTY_FORM: ContactForm = {
  fullName: '',
  phone: '',
  email: '',
  interest: 'General enquiry',
  method: 'Email',
}

const FIELD_ORDER: (keyof ContactForm)[] = [
  'fullName',
  'phone',
  'email',
  'interest',
  'method',
]

const FIELD_IDS: Record<keyof ContactForm, string> = {
  fullName: 'contact-name',
  phone: 'contact-phone',
  email: 'contact-email',
  interest: 'contact-interest',
  method: 'contact-method-email',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s().-]+$/

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
} as const

const CONTACT_METHOD_ICONS: Record<string, typeof Mail> = {
  Email: Mail,
  Phone: Phone,
  WhatsApp: MessageCircle,
}

const QUICK_CONTACTS = [
  {
    label: 'Call the studio',
    value: STUDIO.phone,
    hint: 'Mon – Sat · 6:00am – 7:30pm',
    href: STUDIO.phoneHref,
    icon: Phone,
  },
  {
    label: 'Email us',
    value: STUDIO.email,
    hint: 'We reply within one working day',
    href: `mailto:${STUDIO.email}`,
    icon: Mail,
  },
  {
    label: 'WhatsApp',
    value: 'Chat with our team',
    hint: 'Quick questions and class info',
    href: STUDIO.whatsapp,
    icon: MessageCircle,
  },
]

function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {}
  const phoneDigits = form.phone.replace(/\D/g, '')

  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!form.phone.trim()) {
    errors.phone = 'Please enter your phone number.'
  } else if (!PHONE_PATTERN.test(form.phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid phone number with 7–15 digits.'
  }

  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  if (!form.interest) {
    errors.interest = 'Please choose a program or enquiry type.'
  }

  if (!form.method) {
    errors.method = 'Please choose how you would like us to contact you.'
  }

  return errors
}

export default function Contact({ prefill }: ContactProps) {
  const { interest: prefilledInterest, key: prefillKey } = prefill
  const [form, setForm] = useState<ContactForm>({
    ...EMPTY_FORM,
    interest: prefilledInterest,
  })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submittedName, setSubmittedName] = useState('')
  const [submissionWarning, setSubmissionWarning] = useState('')
  const timerRef = useRef<number | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Enquiry buttons across the page update the selected program.
    // oxlint-disable-next-line react/set-state-in-effect
    setForm((current) => ({ ...current, interest: prefilledInterest }))
    setErrors({})
    setStatus('idle')
    setSubmittedName('')
  }, [prefilledInterest, prefillKey])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'checking') return

    const nextErrors = validate(form)
    setErrors(nextErrors)

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus()
      return
    }

    const name = form.fullName.trim()
    const details = { ...form }
    setStatus('checking')

    timerRef.current = window.setTimeout(() => {
      void (async () => {
        const submission = addSubmission({
          fullName: name,
          email: details.email.trim(),
          phone: details.phone.trim(),
          interest: details.interest,
          method: details.method,
          source: 'Website contact form',
        })

        timerRef.current = null

        const result = await createSubmissionOnBackend(submission)
        if (result.ok) {
          markSubmissionSynced(submission.id)
          setSubmissionWarning('')
        } else {
          setSubmissionWarning(
            'Your enquiry is saved in this browser, but could not reach the studio spreadsheet. Please contact the studio directly or try again later.',
          )
        }
        setSubmittedName(name)
        setStatus('success')
      })()
    }, 900)
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, interest: prefilledInterest })
    setErrors({})
    setStatus('idle')
    setSubmittedName('')
    setSubmissionWarning('')
    window.setTimeout(() => nameRef.current?.focus(), 60)
  }

  const mainBranch = BRANCHES[0]
  const nextBranch = BRANCHES[1]
  const mainBranchMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mainBranch.address)}`
  const nextBranchMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextBranch.address)}`

  return (
    <section id="contact" className="section relative overflow-hidden bg-bloom">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-200/35 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-aqua-200/40 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl rounded-[2.5rem] border border-white/90 bg-white/45 p-4 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur-sm sm:rounded-[3rem] sm:p-6 lg:p-8">
        <div className="mb-7 rounded-[2rem] border border-brand-100/80 bg-gradient-to-br from-white/90 via-brand-50/70 to-aqua-50/80 px-5 py-7 text-center sm:mb-9 sm:px-8 sm:py-9" data-reveal>
          <div>
            <div className="section-badge mx-auto w-fit">
              <Flower2 size={14} /> Get in touch
            </div>
            <h1 className="section-title !mb-4 mt-1">
              Your next chapter
              <br />
              <span className="italic text-gradient">starts with hello.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Tell us what you are looking for and how you would like to be contacted. We will help
              you find the program, plan and pace that feels right.
            </p>
          </div>

          <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                No pressure
              </p>
              <p className="text-sm font-medium text-slate-600">Just a friendly reply.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6 xl:gap-8">
          <div className="flex flex-col space-y-4 rounded-[2rem] border border-slate-200/80 bg-white/55 p-3 sm:p-4" data-reveal data-reveal-delay="80">
            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-brand-100 shadow-premium">
              <img
                src={studioImage}
                alt="Women practising yoga in a calm, light-filled studio at Bloom Studio"
                loading="lazy"
                className="h-60 w-full object-cover sm:h-64"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent"
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-800 shadow-sm backdrop-blur">
                <Flower2 size={12} /> Women-only studio
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                    Bloom Studio · OMR
                  </p>
                  <p className="mt-1 font-display text-xl text-white">A calm space to begin.</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRANCHES[0].address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the main studio in Google Maps"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-2.5">
              {QUICK_CONTACTS.map(({ label, value, hint, href, icon: Icon }) => {
                const external = href.startsWith('http')
                return (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-premium focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        {label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">
                        {value}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-400">
                        {hint}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-slate-300 transition-colors group-hover:text-brand-700"
                    />
                  </a>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3">
              <span className="text-[11px] font-semibold text-brand-800">
                Follow along for class updates
              </span>
              <div className="flex gap-2">
                {STUDIO.socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${STUDIO.name} on ${social.label}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-700 transition-colors hover:bg-brand-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                    >
                      <Icon size={15} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            id="enquiry-form"
            className="scroll-mt-28 h-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-premium"
            data-reveal
            data-reveal-delay="160"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-950 to-aqua-950 px-5 py-6 text-white sm:px-7 sm:py-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-aqua-400/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-brand-500/25 blur-3xl"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">
                    Enquiry form
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-[1.7rem]">
                    Send an enquiry
                  </h2>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-white/60">
                    A few details help us point you in the right direction. No pressure, no
                    commitment.
                  </p>
                </div>
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-200 sm:flex">
                  <Sparkles size={20} />
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {status === 'success' ? (
                <div
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center py-4 text-center focus:outline-none"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-8 ring-brand-50/60">
                    <CheckCircle2 size={30} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    Enquiry received
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-slate-900">
                    Thanks, {submittedName}.
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                    Your enquiry has been saved for the studio team. We'll be in touch by{' '}
                    <strong className="font-semibold text-slate-800">
                      {form.method.toLowerCase()}
                    </strong>{' '}
                    within one working day.
                  </p>
                  <p className={cn('mt-4 w-full rounded-2xl border px-4 py-3 text-xs leading-relaxed', submissionWarning ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-aqua-200 bg-aqua-50/60 text-slate-600')}>
                    <strong className="font-semibold text-slate-800">{submissionWarning ? 'Spreadsheet sync needs attention.' : 'Saved to the staff inbox and spreadsheet.'}</strong>{' '}
                    {submissionWarning || 'No payment or booking has been made.'}
                  </p>
                  <button type="button" onClick={resetForm} className="btn-primary mt-6">
                    Send another <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {Object.keys(errors).length > 0 && (
                      <div
                        role="alert"
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
                      >
                        Please check the highlighted fields and try again.
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Full name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          ref={nameRef}
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={(event) => updateField('fullName', event.target.value)}
                          aria-invalid={Boolean(errors.fullName)}
                          aria-describedby={errors.fullName ? 'contact-name-error' : undefined}
                          className={cn(
                            'input-field',
                            errors.fullName &&
                              'border-rose-300 focus:border-rose-400 focus:ring-rose-500/15',
                          )}
                        />
                        <FieldError id="contact-name-error" message={errors.fullName} />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Phone number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(event) => updateField('phone', event.target.value)}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                          className={cn(
                            'input-field',
                            errors.phone &&
                              'border-rose-300 focus:border-rose-400 focus:ring-rose-500/15',
                          )}
                        />
                        <FieldError id="contact-phone-error" message={errors.phone} />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Email address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="name@example.com"
                          value={form.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                          className={cn(
                            'input-field',
                            errors.email &&
                              'border-rose-300 focus:border-rose-400 focus:ring-rose-500/15',
                          )}
                        />
                        <FieldError id="contact-email-error" message={errors.email} />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-interest"
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Interested program <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="contact-interest"
                          name="interest"
                          required
                          value={form.interest}
                          onChange={(event) => updateField('interest', event.target.value)}
                          aria-invalid={Boolean(errors.interest)}
                          aria-describedby={errors.interest ? 'contact-interest-error' : undefined}
                          className={cn(
                            'input-field',
                            errors.interest &&
                              'border-rose-300 focus:border-rose-400 focus:ring-rose-500/15',
                          )}
                        >
                          {ENQUIRY_INTERESTS.map((interest) => (
                            <option key={interest} value={interest}>
                              {interest}
                            </option>
                          ))}
                        </select>
                        <FieldError id="contact-interest-error" message={errors.interest} />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="mb-2.5 block text-sm font-semibold text-slate-700">
                        Preferred contact method <span className="text-rose-500">*</span>
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                        {CONTACT_METHODS.map((method) => {
                          const id = `contact-method-${method.toLowerCase()}`
                          const checked = form.method === method
                          const Icon = CONTACT_METHOD_ICONS[method]

                          return (
                            <label
                              key={method}
                              htmlFor={id}
                              className={cn(
                                'flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-sm font-medium transition-all focus-within:ring-4 focus-within:ring-brand-500/20',
                                checked
                                  ? 'border-brand-400 bg-brand-50 text-brand-900 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50/40',
                              )}
                            >
                              <input
                                id={id}
                                name="contact-method"
                                type="radio"
                                value={method}
                                checked={checked}
                                onChange={() => updateField('method', method)}
                                aria-invalid={Boolean(errors.method)}
                                aria-describedby={
                                  errors.method ? 'contact-method-error' : undefined
                                }
                                className="sr-only"
                              />
                              <span
                                className={cn(
                                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                  checked
                                    ? 'bg-brand-700 text-white'
                                    : 'bg-slate-100 text-slate-500',
                                )}
                              >
                                <Icon size={15} />
                              </span>
                              {method}
                              <span
                                className={cn(
                                  'ml-auto flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                                  checked
                                    ? 'border-brand-600 bg-brand-600'
                                    : 'border-slate-300',
                                )}
                              >
                                {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                      <FieldError id="contact-method-error" message={errors.method} />
                    </fieldset>

                    <div className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-[11px] leading-relaxed text-slate-500">
                      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-600" />
                      Your details are saved for the studio team to reply to your enquiry. No
                      payment is taken online.
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'checking'}
                      className="btn-primary w-full"
                    >
                      {status === 'checking' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Sending enquiry…
                        </>
                      ) : (
                        <>
                          Send enquiry <Send size={17} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] leading-relaxed text-slate-400">
                      Prefer to talk?{' '}
                      <a
                        href={STUDIO.phoneHref}
                        className="font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Call {STUDIO.phone}
                      </a>{' '}
                      or{' '}
                      <a
                        href={STUDIO.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-700 hover:text-brand-900"
                      >
                        message us on WhatsApp
                      </a>
                      .
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        <section
          aria-labelledby="contact-studios-title"
          className="relative mt-6 overflow-hidden rounded-[2.25rem] border border-brand-100 bg-gradient-to-br from-white via-brand-50/80 to-aqua-50/80 p-5 shadow-[0_24px_65px_-45px_rgba(9,39,71,0.3)] sm:mt-8 sm:rounded-[2.75rem] sm:p-7 lg:p-9"
          data-reveal
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-aqua-200/40 blur-[90px]" />
          <div className="relative mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-brand-700">
                Our studios
              </p>
              <h2 id="contact-studios-title" className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
                Two locations. One warm welcome.
              </h2>
            </div>
            <span className="rounded-full border border-brand-100 bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 shadow-sm">
              {BRANCHES.length} locations
            </span>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-2 lg:gap-5">
            <a
              href={mainBranchMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${mainBranch.location}`}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 p-5 text-white shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 sm:min-h-[240px] sm:p-7"
            >
              <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-aqua-400/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-aqua-300">
                    <MapPin size={21} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-aqua-200">
                      {mainBranch.name}
                    </span>
                    <span className="mt-0.5 block font-display text-xl sm:text-2xl">
                      {mainBranch.location}
                    </span>
                  </span>
                </div>
                <ArrowUpRight size={20} className="relative shrink-0 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <div className="relative mt-5">
                <p className="max-w-xl text-sm leading-relaxed text-white/75">
                  {mainBranch.address}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-aqua-400 px-4 py-2.5 text-sm font-bold text-brand-950 shadow-lg shadow-brand-950/20 transition-colors group-hover:bg-aqua-300">
                  Main branch directions <ArrowRight size={16} />
                </span>
              </div>
            </a>

            <article className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_22px_50px_-30px_rgba(0,91,173,0.3)] sm:min-h-[240px] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <MapPin size={21} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      Next branch
                    </p>
                    <h3 className="mt-0.5 font-display text-xl text-slate-900 sm:text-2xl">
                      {nextBranch.location}
                    </h3>
                  </div>
                </div>
                {nextBranch.status && (
                  <span className="shrink-0 rounded-full bg-aqua-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-aqua-800">
                    {nextBranch.status}
                  </span>
                )}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Branch address
                </p>
                <p className="mt-1.5 flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" />
                  <span>{nextBranch.address}</span>
                </p>
                <a
                  href={nextBranchMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${nextBranch.location}`}
                  className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800 transition-all duration-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                >
                  Get directions <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  )
}
