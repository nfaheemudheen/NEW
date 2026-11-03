import {
  ArrowRight,
  Dumbbell,
  Flame,
  Flower2,
  MonitorPlay,
  Music,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { PROGRAMS, type ProgramIcon } from '@/data/programs'

const PROGRAM_ICONS: Record<ProgramIcon, LucideIcon> = {
  strength: Dumbbell,
  weight: Flame,
  yoga: Flower2,
  dance: Music,
  personal: UserRound,
  online: MonitorPlay,
}

type ProgramsProps = {
  onEnquire: (interest: string) => void
}

export default function Programs({ onEnquire }: ProgramsProps) {
  return (
    <section id="programs" className="section bg-soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Fitness programs"
          title={
            <>
              Find the way you
              <br />
              <span className="italic text-gradient">love to move.</span>
            </>
          }
          description="Six thoughtfully designed programs, one supportive studio. Mix and match to build a rhythm that fits your body, your goals and your week."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-delay="80">
          {PROGRAMS.map((program) => {
            const Icon = PROGRAM_ICONS[program.icon]
            return (
              <article
                key={program.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-premium"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={program.image}
                    alt={`${program.name} at Bloom Studio`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-brand-950/5 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-800 backdrop-blur">
                    {program.meta}
                  </span>
                  <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/90 text-brand-700 shadow-sm backdrop-blur">
                    <Icon size={20} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-display text-2xl text-slate-900">{program.name}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{program.description}</p>
                  <button
                    type="button"
                    onClick={() => onEnquire(program.name)}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                    aria-label={`Enquire about ${program.name}`}
                  >
                    Learn more <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row"
          data-reveal
          data-reveal-delay="120"
        >
          <p className="text-sm text-slate-500">Not sure where to start?</p>
          <button
            type="button"
            onClick={() => onEnquire('General enquiry')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          >
            <Sparkles size={15} /> Book a free consultation <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
