import { ArrowUpRight, BookOpen, Heart, Leaf, Sparkles } from 'lucide-react'
import wellnessImage from '@/assets/wellness.jpg'

const BLOG_URL = 'https://herspacefitness.com/blog/'

const TOPICS = [
  { icon: Heart, label: 'Women’s fitness' },
  { icon: Leaf, label: 'Nutrition & wellbeing' },
  { icon: Sparkles, label: 'Everyday motivation' },
]

export default function Blog() {
  return (
    <section id="blog" className="section relative overflow-hidden bg-bloom">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-200/35 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-aqua-200/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur sm:rounded-[2.5rem] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
              <BookOpen size={14} /> The Her Space journal
            </span>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.08] text-slate-900 sm:text-5xl lg:text-[3.5rem]">
              A little more insight for your <span className="text-brand-700">stronger days.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
              Explore thoughtful reads on women’s fitness, feel-good nutrition and building habits
              that work in real life.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {TOPICS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600"
                >
                  <Icon size={14} className="text-brand-700" /> {label}
                </span>
              ))}
            </div>

            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,91,173,0.65)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-800 hover:shadow-[0_18px_35px_-12px_rgba(0,91,173,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
            >
              Explore the blog
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit the Her Space Fitness blog"
            className="group relative m-3 min-h-[19rem] overflow-hidden rounded-[1.5rem] bg-brand-950 sm:m-5 sm:min-h-[25rem] sm:rounded-[2rem] lg:m-6 lg:min-h-[34rem]"
          >
            <img
              src={wellnessImage}
              alt="Fresh, colourful food on a table"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/10 to-brand-950/10 transition-colors duration-500 group-hover:from-brand-950/95" />
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/95 px-4 py-2.5 text-xs font-bold text-brand-900 shadow-lg sm:left-7 sm:top-7">
              <Sparkles size={15} className="text-brand-600" /> Ideas for feeling good
            </span>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
              <div className="max-w-sm text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-300">
                  Read, learn, feel inspired
                </p>
                <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                  Your next good idea is here.
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aqua-400 text-brand-950 shadow-xl transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 sm:h-14 sm:w-14">
                <ArrowUpRight size={23} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
