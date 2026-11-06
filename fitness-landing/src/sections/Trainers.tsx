import { ArrowRight, Award } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { TRAINERS } from '@/data/trainers'

type TrainersProps = {
  onEnquire: (interest: string) => void
}

export default function Trainers({ onEnquire }: TrainersProps) {
  return (
    <section id="trainers" className="section bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Meet your coaches"
          title={
            <>
              Expert guidance,
              <br />
              <span className="italic text-gradient">without the ego.</span>
            </>
          }
          description="Meet the women leading your classes, from yoga expertise to encouraging, all-level fitness coaching."
        />

        <div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          data-reveal
          data-reveal-delay="80"
        >
          {TRAINERS.map((trainer) => (
            <article
              key={trainer.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-premium"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={`${trainer.name}, ${trainer.role} at Her Space Fitness Studio`}
                  loading="lazy"
                  className="h-full w-full scale-[0.96] object-cover transition-transform duration-700 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/65 via-brand-950/5 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-800 backdrop-blur">
                  <Award size={12} /> Trainer
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-2xl leading-tight text-white">{trainer.name}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="flex-1 text-sm font-semibold leading-relaxed text-brand-700">
                  {trainer.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {trainer.description}
                </p>
                <button
                  type="button"
                  onClick={() => onEnquire('Personal Training')}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                  aria-label={`Book a session with ${trainer.name}`}
                >
                  Ask about classes <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
