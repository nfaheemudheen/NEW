import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import heroImage from '@/assets/hero-gym.webp'

type HeroProps = {
  onStart: () => void
}

export default function Hero({ onStart }: HeroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section id="home" className="relative isolate min-h-[600px] overflow-hidden bg-brand-950 text-white sm:min-h-[680px] lg:min-h-[740px]">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-[6px]"
      />
      <div className="absolute inset-0 bg-brand-950/65" />

      <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[680px] sm:px-10 sm:py-28 lg:min-h-[740px] lg:px-16">
        <motion.div
          className="relative z-10 mx-auto max-w-4xl"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="hero-title group font-display text-[clamp(2.25rem,9vw,3rem)] font-semibold leading-[1.14] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
            <span className="hero-title-line inline-block">
              Move with purpose.
            </span>
            <span className="hero-title-line mt-2 block italic text-[#6fd22e]">
              Feel more like you.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg sm:leading-8">
            Find strength training, yoga and energising group classes in a studio where good
            coaching and a welcoming atmosphere come together.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#programs"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3.5 text-sm font-bold text-brand-950 shadow-xl shadow-brand-950/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Find your class
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
            >
              Talk to our team
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
