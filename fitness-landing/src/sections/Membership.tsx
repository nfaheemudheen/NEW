import { ArrowRight, Check, Info, Sparkles } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { MEMBERSHIPS } from '@/data/memberships'
import { cn } from '@/lib/utils'

type MembershipProps = {
  onEnquire: (interest: string) => void
}

export default function Membership({ onEnquire }: MembershipProps) {
  return (
    <section id="membership" className="section bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Membership"
          title={
            <>
              A plan that fits
              <br />
              <span className="italic text-gradient">the life you live.</span>
            </>
          }
          description="Simple monthly memberships with no hidden joining fee. Choose the level of support that feels right — you can always change it as your goals grow."
        />

        <div className="grid items-stretch gap-5 lg:grid-cols-3" data-reveal data-reveal-delay="80">
          {MEMBERSHIPS.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-[2rem] border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 sm:p-7',
                plan.popular
                  ? 'border-brand-300 bg-gradient-to-b from-brand-50 via-white to-white shadow-premium lg:-my-3'
                  : 'border-slate-200/80 bg-white hover:border-brand-200',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-700 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand-700/20">
                  <Sparkles size={12} /> Most loved
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl text-slate-900">{plan.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-1.5 flex items-end gap-2">
                <span className="font-display text-4xl leading-none text-slate-900">
                  {plan.price}
                </span>
                <span className="pb-0.5 text-sm text-slate-500">{plan.cadence}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                {plan.duration}
              </p>

              <ul className="my-6 flex-1 space-y-3 border-t border-slate-100 pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onEnquire(plan.interest)}
                className={cn(plan.popular ? 'btn-primary' : 'btn-outline', 'mt-auto')}
              >
                Choose {plan.name} <ArrowRight size={17} />
              </button>
            </article>
          ))}
        </div>

        <div
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-4 text-center sm:flex-row sm:text-left"
          data-reveal
        >
          <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <Info size={15} className="mt-0.5 shrink-0 text-brand-600" />
            Sample pricing for development. No payment is taken online — membership enquiries are
            handled directly by the studio.
          </p>
          <button
            type="button"
            onClick={() => onEnquire('Membership enquiry')}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          >
            Talk to us <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
