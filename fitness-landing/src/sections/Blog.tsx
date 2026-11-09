import { ArrowUpRight, BookOpen, Heart, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import groupYogaImage from '@/assets/gallery-yoga-duo.jpg'

const TOPICS = [
  {
    icon: Heart,
    label: 'Women’s fitness',
    description: 'Training ideas for every stage and starting point.',
  },
  {
    icon: Leaf,
    label: 'Nutrition & wellbeing',
    description: 'Small, sustainable choices for everyday energy.',
  },
  {
    icon: Heart,
    label: 'Everyday motivation',
    description: 'Encouragement to keep showing up for yourself.',
  },
]

export default function Blog() {
  return (
    <section id="blog" className="section relative overflow-hidden bg-bloom">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-200/35 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-aqua-200/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/90 bg-white/80 p-2.5 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur sm:rounded-[2.75rem] sm:p-4">
        <header className="mx-auto max-w-3xl px-4 pb-7 pt-7 text-center sm:px-8 sm:pb-9 sm:pt-10" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
            <BookOpen size={14} /> The Her Space journal
          </span>
          <h2 className="mt-5 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Stronger starts with <span className="italic text-brand-700">good ideas.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
            Practical reads on movement, wellbeing and habits that feel good in real life.
          </p>
        </header>

        <Link
          to="/blog"
          aria-label="Read the Her Space Fitness blog"
          className="group relative block min-h-[280px] overflow-hidden rounded-[1.5rem] bg-brand-950 sm:min-h-[360px] sm:rounded-[2rem] lg:min-h-[420px]"
        >
          <img
            src={groupYogaImage}
            alt="Women practicing yoga together in a bright studio"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-brand-950/10 transition-colors duration-500 group-hover:from-brand-950/95" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10">
            <div className="max-w-2xl text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-300 sm:text-xs">
                Read, learn, feel inspired
              </p>
              <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Your next good idea is here.
              </p>
              <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-white/80 sm:block sm:text-base">
                Honest guidance and fresh perspectives to support the way you move and live.
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aqua-400 text-brand-950 shadow-xl transition duration-300 group-hover:rotate-45 group-hover:scale-110 sm:h-14 sm:w-14">
              <ArrowUpRight size={22} />
            </span>
          </div>
        </Link>

        <div className="grid gap-3 px-1 pb-2 pt-4 sm:grid-cols-3 sm:gap-4 sm:px-2 sm:pt-5">
          {TOPICS.map(({ icon: Icon, label, description }) => (
            <article
              key={label}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_16px_36px_-26px_rgba(4,79,150,0.35)] sm:flex-col sm:gap-3 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {description}
                </span>
              </span>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 px-3 pb-5 pt-4 text-center sm:flex-row sm:gap-5 sm:pb-7">
          <p className="text-sm text-slate-600">A little inspiration for your next strong day.</p>
          <Link
            to="/blog"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,91,173,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-[0_18px_35px_-12px_rgba(0,91,173,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          >
            Explore the blog
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
