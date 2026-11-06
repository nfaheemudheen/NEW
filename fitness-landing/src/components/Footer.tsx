import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons'
import { NAV_LINKS, STUDIO } from '@/data/site'
import { Link, useLocation } from 'react-router-dom'

type LegalDocument = 'privacy' | 'terms' | null

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
} as const

const QUICK_LINKS = NAV_LINKS.filter((link) =>
  ['home', 'about', 'programs', 'faqs'].includes(link.id),
)

const FITNESS_LINKS = [
  { label: 'Membership', href: '#membership' },
  { label: 'Wellness', href: '#wellness' },
]

export default function Footer() {
  const location = useLocation()
  const [legal, setLegal] = useState<LegalDocument>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)
  const sectionHref = (id: string) => {
    if (id === 'about') return '/about'
    if (id === 'contact') return '/contact'
    if (id === 'faqs') return '/faqs'
    if (id === 'home') return '/'
    return location.pathname === '/' ? `#${id}` : `/#${id}`
  }

  useEffect(() => {
    if (!legal) return

    lastFocused.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLegal(null)
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
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
      lastFocused.current?.focus()
    }
  }, [legal])

  return (
    <>
      <footer className="mt-auto bg-brand-950 text-brand-100">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-16 lg:px-10">
          <div className="mb-14 grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.1fr]">
            <div className="col-span-2 lg:col-span-1">
              <a
                href="#home"
                className="mb-5 inline-flex items-center rounded-2xl bg-white p-1.5 shadow-lg shadow-black/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                aria-label="Her Space Fitness Studio home"
              >
                <img
                  src="/logo2.png"
                  alt="Her Space Fitness Studio"
                  className="h-16 w-16 object-contain"
                />
              </a>
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-brand-200/80">
                A women-only studio for strength, flow and everything in between. Come as you are
                — leave feeling more like you.
              </p>
              <div className="flex gap-3">
                {STUDIO.socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${STUDIO.name} on ${social.label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-100 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            <FooterColumn title="Quick Links">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={sectionHref(link.id)}
                    className="transition-colors hover:text-white focus:outline-none focus-visible:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Fitness">
              {FITNESS_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={
                      location.pathname === '/' ? link.href : `/${link.href}`
                    }
                    className="transition-colors hover:text-white focus:outline-none focus-visible:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </FooterColumn>

            <div className="col-span-2 md:col-span-2 lg:col-span-1">
              <h3 className="mb-5 text-sm font-semibold text-white">Contact</h3>
              <ul className="space-y-4 text-sm text-brand-200/80">
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-brand-300" />
                  <a href={STUDIO.phoneHref} className="transition-colors hover:text-white">
                    {STUDIO.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail size={15} className="mt-0.5 shrink-0 text-brand-300" />
                  <a
                    href={`mailto:${STUDIO.email}`}
                    className="break-words transition-colors hover:text-white"
                  >
                    {STUDIO.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-300" />
                  <span>{STUDIO.address}</span>
                </li>
              </ul>
              <a
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200 transition-colors hover:text-white"
              >
                Send an enquiry <ArrowUpRight size={15} />
              </a>
              
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-brand-200/60 lg:flex-row">
            <p>© 2026 {STUDIO.name}. All rights reserved.</p>
            <p className="order-3 lg:order-2">Made for women</p>
            <div className="order-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:order-3">
              <button
                type="button"
                onClick={() => setLegal('privacy')}
                className="transition-colors hover:text-white focus:outline-none focus-visible:text-white"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegal('terms')}
                className="transition-colors hover:text-white focus:outline-none focus-visible:text-white"
              >
                Terms &amp; Conditions
              </button>
              <Link
                to="/staff"
                className="inline-flex items-center gap-1 font-semibold text-brand-200/80 transition-colors hover:text-white focus:outline-none focus-visible:text-white"
              >
                <LockKeyhole size={12} /> Staff login
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {legal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setLegal(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 text-slate-600 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Her Space Studio
                </p>
                <h2 id="legal-title" className="font-display text-2xl text-slate-900">
                  {legal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setLegal(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {legal === 'privacy' ? (
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  When you send an enquiry, the details you provide — your name, email address,
                  phone number, program interest and preferred contact method — are kept for the
                  studio team to review. If spreadsheet sync is enabled, the enquiry is also copied
                  to the studio's private Google Sheet.
                </p>
                <p>
                  Your details are used only to respond to your enquiry. They are not sold or shared
                  with third parties. You can ask the studio to access or delete your enquiry at any
                  time by emailing{' '}
                  <a href={`mailto:${STUDIO.email}`} className="font-semibold text-brand-700">
                    {STUDIO.email}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  This is a demo terms notice for development. Membership prices, class times,
                  trainer profiles and program descriptions on this site are sample content and
                  may change.
                </p>
                <p>
                  No payment is taken through this website. Final membership terms, cancellation
                  details and studio policies will be provided in a written agreement before
                  enrolment.
                </p>
                <p>
                  For questions about membership, contact{' '}
                  <a href={`mailto:${STUDIO.email}`} className="font-semibold text-brand-700">
                    {STUDIO.email}
                  </a>
                  .
                </p>
              </div>
            )}

            <button type="button" onClick={() => setLegal(null)} className="btn-primary mt-7">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-3 text-sm text-brand-200/80">{children}</ul>
    </div>
  )
}
