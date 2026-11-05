import { useNavigate } from 'react-router-dom'
import { ArrowRight, Apple, Dumbbell, HeartHandshake, Leaf, Sparkles } from 'lucide-react'
import wellnessImage from '@/assets/wellness.jpg'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const DIET_PLAN_OPTIONS = [
  {
    icon: Leaf,
    label: 'Build steady habits',
    title: 'Everyday Balance',
    description:
      'Create a more consistent food routine shaped around your schedule, preferences and culture.',
    details: ['Online & Offline Plans', '15 Days Progress Review', '1-1 Diet Consultation'],
    accent: 'bg-brand-50 text-brand-700',
  },
  {
    icon: Dumbbell,
    label: 'Support your training',
    title: 'Active & Energised',
    description:
      'Explore nutrition habits that complement your training routine, recovery and everyday energy.',
    details: ['Online & Offline Plans', '15 Days Progress Review', '1-1 Diet Consultation'],
    accent: 'bg-aqua-100 text-brand-800',
  },
  {
    icon: HeartHandshake,
    label: 'Get personal support',
    title: 'One-to-One Guidance',
    description:
      'Work with the Bloom team to shape a personal approach and refine it as your needs change.',
    details: ['Online & Offline Plans', '15 Days Progress Review', '1-1 Diet Consultation'],
    accent: 'bg-brand-50 text-brand-700',
  },
]

export default function DietPlansPage() {
  useScrollReveal()
  const navigate = useNavigate()
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
        <section className="relative isolate overflow-hidden bg-brand-950 text-white">
          <img
            src={wellnessImage}
            alt="Fresh ingredients and a balanced meal"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-900/65" />
          <div className="section relative mx-auto max-w-7xl py-20 sm:py-24 lg:py-28">
            <div className="max-w-3xl" data-reveal>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-aqua-200 backdrop-blur">
                <Apple size={14} /> Nutrition plans
              </div>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                A plan that fits
                <span className="mt-1 block italic text-aqua-300">your real life.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                Find nutrition support built around your routine and goals, with practical coaching
                that leaves room for real life.
              </p>
              <a
                href="#plan-options"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-aqua-400 px-6 py-3.5 text-sm font-bold text-brand-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                See your options <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section id="plan-options" className="section bg-gradient-to-b from-brand-50/60 via-white to-aqua-50/50">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center" data-reveal>
              <div className="section-badge">
                <Sparkles size={14} /> Your nutrition journey
              </div>
              <h2 className="section-title">
                Choose the support
                <span className="block italic text-gradient">that feels right.</span>
              </h2>
              <p className="section-subtitle">
                Start with the kind of guidance you need. Our team can help you find a comfortable
                next step.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {DIET_PLAN_OPTIONS.map(({ icon: Icon, label, title, description, details, accent }, index) => (
                <article
                  key={title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_24px_60px_-42px_rgba(9,39,71,0.32)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_32px_65px_-40px_rgba(9,39,71,0.3)] sm:p-8"
                  data-reveal
                  data-reveal-delay={index * 80}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <span className="pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    {label}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-slate-900">{title}</h3>
                  <p className="mt-3 min-h-16 text-sm leading-relaxed text-slate-600">{description}</p>
                  <ul className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5">
                    {details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-aqua-100 text-brand-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-aqua-600" />
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={goToNutritionEnquiry}
                    className="group/cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-bold text-brand-800 transition-all duration-300 hover:border-brand-800 hover:bg-brand-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                  >
                    Ask about this plan
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </button>
                </article>
              ))}
            </div>

            <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
              Plans are discussed and tailored with the Bloom team. Nutrition guidance is educational
              and does not replace personalised medical advice.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
