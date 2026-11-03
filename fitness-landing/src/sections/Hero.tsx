import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type HeroProps = {
  onStart: () => void
}

export default function Hero({ onStart }: HeroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section id="home" className="relative overflow-hidden bg-bloom">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 scale-105 bg-cover bg-center blur-md"
        style={{ backgroundImage: 'url("/header%20(2).png")', opacity: 0.58 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/55 via-white/40 to-white/35" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-200/35 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[520px] rounded-full bg-aqua-200/45 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:pt-6 lg:px-10 lg:pb-24 lg:pt-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <motion.div
            className="relative z-30 text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="mb-6 text-4xl leading-[1.3] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Stronger every day.
              <span className="mt-2 block whitespace-nowrap text-[clamp(1.5rem,6vw,3rem)] italic text-gradient">
                Confident in every way.
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
              Find your rhythm in a women-only space built for every stage of your journey. With
              supportive coaches, small-group classes and flexible programs, build strength, boost
              your energy and feel at home in your body, one session at a time.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#programs" className="btn-primary">
                Explore Programs <ArrowRight size={18} />
              </a>
              <button type="button" onClick={onStart} className="btn-outline">
                Start Your Journey
              </button>
            </div>
          </motion.div>
          <motion.div
            className="relative z-30 min-w-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative" data-journey-image="hero">
              <div aria-hidden="true" className="h-[400px] w-full sm:h-[500px] lg:h-[560px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
