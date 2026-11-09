import {
  Activity,
  BadgeCheck,
  CalendarDays,
  Dumbbell,
  UsersRound,
} from 'lucide-react'
import communityImage from '@/assets/gallery-group.jpg'
import { STATS } from '@/data/site'
import { cn } from '@/lib/utils'

const STAT_ICONS = [UsersRound, Activity, BadgeCheck, CalendarDays]

export default function Statistics() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-aqua-50/50"
    >
      <div className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-200/35 blur-[120px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div className="mb-10 grid items-center gap-8 md:mb-12 md:grid-cols-[1.05fr_0.95fr] lg:gap-12" data-reveal>
          <div className="max-w-2xl">
            <div className="section-badge">
              Our impact
            </div>
            <h2 className="section-title !mb-0 text-balance">
              Train Hard.
              <span className="block italic text-gradient">Live Better.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Stronger together, one class at a time. Here is a snapshot of the Her Space community and
              the women who make it what it is.
            </p>
          </div>

          <div className="relative mx-auto h-[250px] w-full max-w-[34rem] sm:h-[280px] md:mx-0">
            <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[2rem] bg-gradient-to-br from-brand-600 to-aqua-400" />
            <div className="group relative h-full overflow-hidden rounded-[2rem] border-[5px] border-white shadow-[0_28px_70px_-40px_rgba(9,39,71,0.5)]">
              <img
                src={communityImage}
                alt="Women sharing an energising group workout"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-brand-950/10" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-900 shadow-lg sm:left-5 sm:top-5">
                <UsersRound size={14} className="text-brand-600" /> Stronger together
              </div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-300">
                    Find your people
                  </p>
                  <p className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl">
                    Move. Grow. Belong.
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right text-white backdrop-blur-md sm:block">
                  <Dumbbell size={17} className="ml-auto text-aqua-300" />
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.14em]">
                    Every body
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-5 text-white shadow-[0_32px_80px_-40px_rgba(9,39,71,0.65)] sm:rounded-[2.5rem] sm:p-8 lg:p-10"
          data-reveal
        >
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-aqua-500/15 blur-3xl" />

          <div className="relative mb-5 flex items-center justify-between gap-4 sm:mb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-aqua-300 sm:text-xs">
              Her Space by the numbers
            </p>
            <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/70 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" /> Community in motion
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/15 lg:grid-cols-4">
            {STATS.map((stat, index) => {
              const Icon = STAT_ICONS[index % STAT_ICONS.length]

              return (
                <article
                  key={stat.label}
                  className={cn(
                    'group relative min-h-40 bg-brand-950/80 p-5 transition-colors duration-300 hover:bg-brand-800/90 sm:min-h-48 sm:p-7 lg:p-8',
                    index === 0 || index === 2 ? 'border-r border-white/10' : '',
                    index < 2 ? 'border-b border-white/10 lg:border-b-0' : '',
                    index < STATS.length - 1 ? 'lg:border-r lg:border-white/10' : '',
                  )}
                  data-reveal
                  data-reveal-delay={index * 75}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-aqua-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                    />
                    <span className="text-[10px] font-bold tracking-[0.16em] text-white/35">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-5 font-sans text-4xl font-bold leading-none tracking-tight tabular-nums sm:mt-7 sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-bold text-white sm:text-base">{stat.label}</div>
                  <div className="mt-1 text-xs text-white/60 sm:text-sm">{stat.detail}</div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
