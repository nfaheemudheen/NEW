import { Apple, ArrowRight, Leaf, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import wellnessImage from '@/assets/wellness.jpg'

export default function Wellness() {
  return (
    <section
      id="wellness"
      className="relative overflow-hidden bg-gradient-to-br from-brand-50/80 via-white to-aqua-50/70"
    >
      <div className="pointer-events-none absolute -left-40 top-8 h-[28rem] w-[28rem] rounded-full bg-brand-200/35 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-aqua-200/35 blur-[125px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div
          className="relative isolate overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white shadow-[0_35px_85px_-45px_rgba(9,39,71,0.65)] sm:rounded-[2.75rem]"
          data-reveal
        >
          <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-aqua-500/15 blur-3xl" />

          <div className="relative grid items-center lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-aqua-200 backdrop-blur">
                <Sparkles size={14} /> Nutrition &amp; wellness
              </div>
              <h2 className="font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
                Feel good.
                <span className="mt-1 block italic text-aqua-300">From within.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base sm:leading-7">
                Support your training with sustainable nutrition, better recovery and everyday
                habits that fit your life. No crash diets or all-or-nothing rules.
              </p>
              <Link
                to="/diet-plans"
                className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3.5 text-sm font-bold text-brand-950 shadow-lg shadow-brand-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                Explore diet plans
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Nutrition / movement / recovery
              </p>
            </div>

            <div className="relative min-h-[17rem] p-4 pt-0 sm:min-h-[22rem] sm:px-6 sm:pb-6 lg:min-h-[33rem] lg:p-6">
              <div className="group absolute inset-4 top-0 overflow-hidden rounded-[1.75rem] border border-white/15 sm:inset-x-6 sm:bottom-6 lg:inset-6">
                <img
                  src={wellnessImage}
                  alt="A colourful meal prepared with fresh ingredients"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-950/10" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-3.5 py-2 text-[10px] font-bold text-brand-900 shadow-lg sm:left-5 sm:top-5">
                  <Leaf size={14} className="text-brand-600" /> Good food, real life
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-aqua-200 sm:text-[10px]">
                      Made to fit you
                    </p>
                    <p className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl">
                      Nourish your goals.
                    </p>
                  </div>
                  <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aqua-400 text-brand-950 shadow-lg sm:flex">
                    <Apple size={21} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
