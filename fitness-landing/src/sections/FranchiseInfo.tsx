import { ArrowRight, Building2, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const DISCUSSION_POINTS = [
  { icon: MapPin, label: 'Your city or neighbourhood' },
  { icon: Building2, label: 'Your studio or business plans' },
  { icon: MessageCircle, label: 'Your questions about franchising' },
]

export default function FranchiseInfo() {
  return (
    <section
      aria-labelledby="franchise-info-title"
      className="relative mx-3 mt-6 max-w-6xl overflow-hidden rounded-[2rem] bg-brand-950 px-5 py-7 text-white shadow-premium sm:mx-5 sm:mt-8 sm:rounded-[2.5rem] sm:px-8 sm:py-9 lg:mx-auto lg:px-10"
      data-reveal
    >
      <div className="relative grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-300">
            Franchise opportunities
          </p>
          <h2 id="franchise-info-title" className="mt-2 max-w-2xl font-display text-2xl leading-tight sm:text-3xl">
            Bring a women-first fitness space to your community.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Interested in opening a Her Space franchise? Tell us where you would like to build,
            share your plans, and we can start a conversation about the opportunity and next steps.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-700 bg-brand-900 p-4 sm:p-5">
          <p className="mb-3 text-xs font-semibold text-white/85">To help us guide you, include:</p>
          <ul className="space-y-2.5">
            {DISCUSSION_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-xs text-white/70 sm:text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-aqua-400/15 text-aqua-300">
                  <Icon size={14} />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <Link
            to="/contact?interest=Franchise%20enquiry"
            className="group mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-aqua-400 px-5 py-3 text-sm font-bold text-brand-950 transition hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40 sm:w-auto"
          >
            Enquire about a franchise
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
