import { ArrowRight, Award, ClipboardList, Flower2, HeartHandshake, Leaf } from 'lucide-react'

const BENEFITS = [
  {
    icon: Award,
    label: 'Expert coaching',
    title: 'Certified fitness trainers',
    description:
      'Experienced coaches who know how to support women through every stage of life.',
  },
  {
    icon: ClipboardList,
    label: 'Made for you',
    title: 'A plan built around you',
    description:
      'Training that adapts to your body, goals, and schedule, with room to grow at your pace.',
  },
  {
    icon: HeartHandshake,
    label: 'Women-only space',
    title: 'A space where you belong',
    description:
      'A private, supportive studio where you can focus on feeling stronger and more confident.',
  },
  {
    icon: Leaf,
    label: 'Whole-body care',
    title: 'Support for the whole you',
    description:
      'Movement, recovery, nutrition, and mindset brought together in one caring approach.',
  },
]

const CARD_ACCENT = {
  label:
    'border border-brand-100 bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white',
  line: 'bg-brand-600',
}

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-brand-50/50">
      <div className="pointer-events-none absolute -right-40 -top-36 h-[28rem] w-[28rem] rounded-full bg-brand-200/35 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[26rem] w-[26rem] rounded-full bg-brand-200/30 blur-[120px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <div className="section-badge border-brand-200 bg-brand-50 text-brand-800">
            <Flower2 size={14} className="text-brand-600" /> Why Her Space
          </div>
          <h2 className="section-title !mb-4">
            Made for the way
            <span className="block italic text-brand-600">women actually move.</span>
          </h2>
          <p className="section-subtitle">
            No mirrors full of comparison. No one-size-fits-all programming. Just thoughtful
            coaching in a space that feels like yours.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {BENEFITS.map(({ icon: Icon, label, title, description }, index) => {
            const accent = CARD_ACCENT

            return (
              <article
                key={title}
                className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.75rem] border border-brand-100/80 bg-white/90 p-6 shadow-[0_20px_45px_-36px_rgba(9,39,71,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-300 hover:bg-white hover:shadow-[0_28px_60px_-28px_rgba(4,123,233,0.32)] sm:p-7"
                data-reveal
                data-reveal-delay={index * 80}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-600 to-brand-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800 text-white shadow-lg shadow-brand-800/20 ring-1 ring-brand-800/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-600 group-hover:shadow-brand-600/30">
                    <Icon size={22} strokeWidth={1.9} />
                  </div>
                  <span className={`mt-1 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${accent.label}`}>
                    {label}
                  </span>
                </div>
                <h3 className="relative mt-7 font-display text-xl font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-brand-800">
                  {title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
                <div className="mt-auto pt-6">
                  <div className={`h-1 w-10 rounded-full transition-all duration-300 group-hover:w-20 ${accent.line}`} />
                </div>
              </article>
            )
          })}
        </div>

        <div
          className="relative mt-6 flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-brand-800 bg-gradient-to-br from-brand-950 to-brand-800 p-5 text-white shadow-[0_24px_55px_-28px_rgba(9,39,71,0.55)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7"
          data-reveal
          data-reveal-delay="160"
        >
          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="flex items-start gap-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-950/25">
              <Flower2 size={21} />
            </div>
            <div className="relative">
              <p className="font-display text-lg italic leading-relaxed text-white sm:text-xl">
                A room full of women growing stronger together.
              </p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-200">
                The Her Space promise
              </p>
            </div>
          </div>
          <a
            href="/about#trainers"
            className="group relative inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
          >
            Meet your trainers <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
