import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Check,
  HeartHandshake,
  Laptop,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const DIET_PLAN_OPTIONS = [
  {
    icon: Laptop,
    number: '01',
    label: 'Choose your format',
    title: 'Online & Offline Plans',
    description:
      'Get nutrition support in the way that fits your day, whether you prefer guidance from home or in person.',
    detail:
      'Talk with our team about the online or in-studio format that feels easiest to keep up with.',
  },
  {
    icon: CalendarDays,
    number: '02',
    label: 'Notice your progress',
    title: '15 Days Progress Review',
    description:
      'Make space to check in, recognise what is working and decide on the next small step.',
    detail:
      'Every 15 days, review your routine with the team and adjust your approach around real life.',
  },
  {
    icon: HeartHandshake,
    number: '03',
    label: 'Get personal guidance',
    title: '1-1 Diet Consultation',
    description:
      'Have a one-to-one conversation about your goals, food preferences and everyday routine.',
    detail:
      'Bring your questions and get a chance to discuss a practical way forward with our nutrition team.',
  },
]

export default function DietPlansPage() {
  useScrollReveal()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const selected = selectedPlan === null ? null : DIET_PLAN_OPTIONS[selectedPlan]
  const goToNutritionEnquiry = () =>
    navigate('/contact?interest=Nutrition%20%26%20wellness')

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>
      <Header onJoin={goToNutritionEnquiry} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section
          id="plan-options"
          className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/50 to-aqua-50/70 py-12 sm:py-16 lg:py-20"
        >
          <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-100/60 blur-[100px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10" data-reveal>
              <h2 className="font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Choose your kind of support
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Select a card to see how each part of the experience can work for you.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-aqua-200 bg-aqua-50 px-4 py-2 text-xs font-bold text-brand-800">
                <span className="h-2 w-2 animate-pulse rounded-full bg-aqua-500" /> Personalised with care
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {DIET_PLAN_OPTIONS.map(({ icon: Icon, number, label, title, description }, index) => {
                const active = selectedPlan === index

                return (
                  <button
                    key={title}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedPlan(index)}
                    className={cn(
                      'group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 text-center shadow-[0_20px_55px_-42px_rgba(9,39,71,0.3)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_65px_-38px_rgba(9,39,71,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 sm:min-h-[300px] sm:rounded-[2rem] sm:p-7',
                      'from-white via-brand-50/70 to-aqua-50/70',
                      index === 2 &&
                        'md:col-span-2 md:mx-auto md:w-1/2 xl:col-span-1 xl:mx-0 xl:w-full',
                      active
                        ? 'border-2 border-brand-400 ring-2 ring-brand-200 shadow-[0_24px_60px_-36px_rgba(4,123,233,0.32)]'
                        : 'border-white/90 hover:border-brand-200',
                    )}
                    data-reveal
                    data-reveal-delay={index * 80}
                  >
                    <span className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-brand-200/40 blur-3xl transition-all duration-500 group-hover:scale-125" />
                    <span className="relative flex items-start justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-950/10 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110">
                        <Icon size={24} strokeWidth={1.8} />
                      </span>
                      <span className="absolute right-0 top-0 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-700 shadow-sm">
                        {number}
                      </span>
                    </span>
                    <span className="relative mt-7 block text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      {label}
                    </span>
                    <span className="relative mt-1.5 block font-display text-2xl leading-snug text-slate-900 sm:text-[1.7rem]">
                      {title}
                    </span>
                    <span className="relative mt-3 block text-sm leading-relaxed text-slate-600">
                      {description}
                    </span>
                    <span className="absolute bottom-0 left-6 right-6 h-1 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-600 to-aqua-500 transition-transform duration-300 group-hover:scale-x-100 sm:left-7 sm:right-7" />
                  </button>
                )
              })}
            </div>

            {selected && <div
              key={selected.title}
              className="mt-5 flex flex-col items-center gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-center text-white shadow-[0_24px_60px_-35px_rgba(9,39,71,0.55)] sm:rounded-[2rem] sm:p-8"
              data-reveal
            >
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aqua-400 text-brand-950 shadow-lg shadow-black/10">
                  <Check size={21} />
                </span>
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-aqua-300">
                    A closer look at your selection
                  </p>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl">{selected.title}</h3>
                  <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-white/75">
                    {selected.detail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={goToNutritionEnquiry}
                className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3 text-sm font-bold text-brand-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
              >
                Ask us about this plan
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>}

            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
              Nutrition guidance is educational and does not replace personalised medical advice.
              Speak with the Her Space team to discuss what suits you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
