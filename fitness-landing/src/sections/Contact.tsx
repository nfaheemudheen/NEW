import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Send,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons'
import SectionHeading from '@/components/SectionHeading'
import { BRANCHES, CONTACT_METHODS, ENQUIRY_INTERESTS, STUDIO } from '@/data/site'
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
    setStatus('checking')

    timerRef.current = window.setTimeout(() => {
      setSubmittedName(name)
      setStatus('success')
      timerRef.current = null
    }, 900)
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, interest: prefilledInterest })
    setErrors({})
    setStatus('idle')
    setSubmittedName('')
    window.setTimeout(() => nameRef.current?.focus(), 60)
  }

  return (
    <section id="contact" className="section bg-bloom">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          as="h1"
          eyebrow="Get in touch"
          title={
            <>
              Your next chapter
              <br />
              <span className="italic text-gradient">starts with hello.</span>
            </>
          }
          description="Tell us what you are looking for and how you would like to be contacted. We will help you find the program, plan and pace that feels right."
        />

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-10">
          <div className="space-y-4" data-reveal>
            <div className="space-y-4">
              {BRANCHES.map((branch) => (
                <article
                  key={branch.name}
                  className="rounded-[2rem] border border-brand-100 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <MapPin size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                          {branch.name}
                        </p>
                        {branch.status && (
                          <span className="rounded-full bg-aqua-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-aqua-700">
                            {branch.status}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 font-display text-xl text-slate-900">
                        {branch.location}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{branch.address}</p>
                      <a
                        href={
                          'https://www.google.com/maps/search/?api=1&query=' +
                          encodeURIComponent(branch.address)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Get directions <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold text-slate-500">Follow along</span>
              {STUDIO.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${STUDIO.name} on ${social.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          <div
            id="enquiry-form"
            className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-premium sm:p-7 lg:p-8"
            data-reveal
            data-reveal-delay="100"
          >
            {status === 'success' ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="rounded-[1.5rem] border border-brand-200 bg-brand-50/60 p-6 focus:outline-none sm:p-8"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <CheckCircle2 size={28} />
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Demo success
                </p>
                <h3 className="font-display text-2xl text-slate-900 sm:text-3xl">
                  Thanks, {submittedName}.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Your details passed validation. This is a frontend demo, so{' '}
                  <strong className="font-semibold text-slate-800">
                    nothing has been sent or stored
                  </strong>
                  . A backend service still needs to be connected before enquiries can reach the
                  studio.
                </p>
                <p className="mt-4 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500">
                  No payment or booking has been made.
                </p>
                <button type="button" onClick={resetForm} className="btn-primary mt-6">
                  Send another <ArrowUpRight size={17} />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="font-display text-2xl text-slate-900">Send an enquiry</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    A few details help us point you in the right direction.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {Object.keys(errors).length > 0 && (
                    <div
                      role="alert"
                      className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
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

                  <fieldset className="mt-4">
                    <legend className="mb-2 block text-sm font-semibold text-slate-700">
                      Preferred contact method <span className="text-rose-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {CONTACT_METHODS.map((method) => {
                        const id = `contact-method-${method.toLowerCase()}`
                        const checked = form.method === method
                        return (
                          <label
                            key={method}
                            htmlFor={id}
                            className={cn(
                              'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all focus-within:ring-4 focus-within:ring-brand-500/20',
                              checked
                                ? 'border-brand-500 bg-brand-50 text-brand-800'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700',
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
                              aria-describedby={errors.method ? 'contact-method-error' : undefined}
                              className="sr-only"
                            />
                            {method}
                          </label>
                        )
                      })}
                    </div>
                    <FieldError id="contact-method-error" message={errors.method} />
                  </fieldset>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                   
                    <button
                      type="submit"
                      disabled={status === 'checking'}
                      className="btn-primary shrink-0"
                    >
                      {status === 'checking' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Checking details…
                        </>
                      ) : (
                        <>
                          Send enquiry <Send size={17} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
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

