import { ArrowRight, Flower2, Info, Quote, Sparkles } from 'lucide-react'
import impactImage from '@/assets/impact.jpg'
import { STATS } from '@/data/site'

type StatisticsProps = {
  onEnquire: (interest: string) => void
}

export default function Statistics({ onEnquire }: StatisticsProps) {
  return (
    <section id="impact" className="relative overflow-hidden bg-brand-50">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-aqua-200/35 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-200/40 blur-[100px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div data-reveal>
            <div className="section-badge">
              <Sparkles size={14} /> Our impact
            </div>
            <h2 className="section-title">
              Small studio.
              <br />
              <span className="italic text-gradient">Real momentum.</span>
            </h2>
            <p className="section-subtitle !mx-0">
              We are proud of the community growing inside these walls. These sample metrics give
              a feel for the studio — replace them with your verified numbers before launch.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-brand-100 bg-white/80 p-5 shadow-sm"
                >
                  <div className="font-display text-3xl text-slate-900 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{stat.detail}</div>
                </div>
              ))}
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <Info size={14} className="mt-0.5 shrink-0 text-brand-600" />
              Illustrative studio metrics for development. Replace with verified figures before
              launch.
            </p>
          </div>

          <div className="relative min-w-0" data-reveal data-reveal-delay="100">
            <div className="relative overflow-hidden rounded-[3rem] border-[6px] border-white shadow-premium">
              <img
                src={impactImage}
                alt="Member taking a moment between strength sets at Bloom Studio"
                loading="lazy"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/15 bg-white/95 p-5 shadow-xl backdrop-blur sm:inset-x-7 sm:bottom-7 sm:p-6">
                <Quote size={20} className="mb-2 text-brand-500" />
                <p className="font-display text-lg italic leading-relaxed text-slate-800">
                  “I stopped trying to shrink. I started training to feel strong.”
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                      Sample member story
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">Personal Coaching</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEnquire('Membership enquiry')}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                    aria-label="Start your journey"
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <Flower2 size={15} className="text-brand-600" />
                <span className="text-xs font-bold text-slate-900">Women-first, always</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
