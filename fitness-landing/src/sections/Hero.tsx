import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import heroImage from '@/assets/hero-gym-v2.webp'
import yogaImage from '@/assets/gallery-yoga.jpg'
import groupImage from '@/assets/gallery-group.jpg'
import strengthImage from '@/assets/gallery-strength.jpg'

const HERO_SLIDES = [
  {
    image: heroImage,
    firstLine: 'Move with purpose.',
    accentLine: 'Feel more like you.',
    description: 'Find strength training, yoga and energising group classes in a studio where good coaching and a welcoming atmosphere come together.',
  },
  {
    image: strengthImage,
    firstLine: 'Build your strength.',
    accentLine: 'Believe in you.',
    description: 'Grow stronger at your own pace with thoughtful coaching and a team cheering you on.',
  },
  {
    image: yogaImage,
    firstLine: 'Breathe in.',
    accentLine: 'Find your flow.',
    description: 'Make space for balance, flexibility and a little more calm in your day.',
  },
  {
    image: groupImage,
    firstLine: 'Move together.',
    accentLine: 'Feel the energy.',
    description: 'Find your rhythm in upbeat group classes led by coaches who make everyone feel welcome.',
  },
]

type HeroProps = {
  onStart: () => void
}

export default function Hero({ onStart }: HeroProps) {
  const reduceMotion = useReducedMotion()
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = HERO_SLIDES[activeSlide]

  useEffect(() => {
    if (reduceMotion) return

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const showSlide = (index: number) => {
    setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const renderTitle = (text: string) =>
    Array.from(text).map((character, index) => (
      <span className="hero-title-char" key={`${character}-${index}`} style={{ animationDelay: `${index * 22}ms` }}>
        {character === ' ' ? '\u00a0' : character}
      </span>
    ))

  return (
    <section id="home" className="relative isolate min-h-[600px] overflow-hidden bg-brand-950 text-white sm:min-h-[680px] lg:min-h-[740px]">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={slide.image}
          src={slide.image}
          alt=""
          aria-hidden="true"
          fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
          initial={reduceMotion ? false : { opacity: 0, x: 36, scale: 1.08 }}
          animate={{ opacity: 1, x: 0, scale: 1.05 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -36, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-950/45 to-brand-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,39,71,0.12)_0%,rgba(9,39,71,0.42)_100%)]" />

      <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[680px] sm:px-10 sm:py-28 lg:min-h-[740px] lg:px-16">
        <motion.div
          className="relative z-10 mx-auto max-w-4xl"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide}
              className="hero-title-slide-effect"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <h1 tabIndex={0} className="hero-title max-w-full font-display text-[clamp(1.8rem,9vw,3rem)] font-semibold leading-[1.14] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
                <span className="hero-title-line inline-block">{renderTitle(slide.firstLine)}</span>
                <span className="hero-title-line mt-2 block italic text-[#6fd22e]">{renderTitle(slide.accentLine)}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[23rem] px-2 text-center text-[0.95rem] leading-7 text-white/90 text-pretty sm:mt-6 sm:max-w-2xl sm:px-0 sm:text-lg sm:leading-8">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

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

          <div className="mt-7 flex items-center justify-center gap-3" aria-label="Hero slides">
            <button
              type="button"
              onClick={() => showSlide(activeSlide - 1)}
              aria-label="Previous hero slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
            >
              <ChevronLeft size={19} />
            </button>
            <div className="flex items-center gap-2" role="group" aria-label="Choose a hero slide">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.firstLine}
                  type="button"
                  onClick={() => showSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${item.firstLine} ${item.accentLine}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/35 ${index === activeSlide ? 'w-7 bg-aqua-400' : 'w-2.5 bg-white/55 hover:bg-white/85'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => showSlide(activeSlide + 1)}
              aria-label="Next hero slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
            >
              <ChevronRight size={19} />
            </button>
            <span className="sr-only" aria-live="polite">Slide {activeSlide + 1} of {HERO_SLIDES.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
