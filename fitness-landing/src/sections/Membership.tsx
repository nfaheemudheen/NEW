import { ArrowRight, Check, CreditCard, Sparkles } from 'lucide-react'
import { MEMBERSHIPS } from '@/data/memberships'
import { cn } from '@/lib/utils'

type MembershipProps = {
  onEnquire: (interest: string) => void
}

const formatINR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function Membership({ onEnquire }: MembershipProps) {
  return (
    <section id="membership" className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-slate-50">
      <div className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand-200/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-aqua-200/25 blur-[130px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <div className="section-badge">
            <CreditCard size={14} /> Studio memberships
          </div>
          <h2 className="section-title !mb-4">
            Choose your pace.
            <span className="block italic text-gradient">We will help you grow.</span>
          </h2>
          <p className="section-subtitle">
            Clear monthly plans, thoughtful coaching, and room to find the support that feels right
            for you.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {MEMBERSHIPS.map((plan, index) => (
            <article
              key={plan.id}
              className={cn(
                'group relative isolate flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 hover:-translate-y-2 sm:p-7',
                plan.popular
                  ? 'border-brand-800 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white shadow-[0_28px_70px_-34px_rgba(9,39,71,0.6)] hover:shadow-[0_34px_80px_-34px_rgba(4,123,233,0.5)]'
                  : 'border-slate-200/90 bg-white/95 text-slate-700 shadow-[0_24px_55px_-40px_rgba(9,39,71,0.3)] hover:border-brand-300 hover:shadow-[0_30px_65px_-36px_rgba(4,123,233,0.3)]',
              )}
              data-reveal
              data-reveal-delay={index * 90}
            >
              <div
                className={cn(
                  'pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100',
                  plan.popular ? 'bg-brand-400/20 opacity-60' : 'bg-brand-100/80 opacity-0',
                )}
              />

              <div className="relative flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]',
                    plan.popular ? 'bg-aqua-500 text-brand-950' : 'bg-brand-50 text-brand-800',
                  )}
                >
                  {plan.popular ? <Sparkles size={12} /> : <CreditCard size={12} />}
                  {plan.popular ? 'Most loved' : 'Monthly plan'}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    plan.popular ? 'text-brand-200' : 'text-slate-400',
                  )}
                >
                  0{index + 1}
                </span>
              </div>

              <div className="relative mt-6">
                <h3
                  className={cn(
                    'font-display text-2xl font-semibold sm:text-3xl',
                    plan.popular ? 'text-white' : 'text-slate-900',
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    'mt-2 min-h-12 text-sm leading-relaxed',
                    plan.popular ? 'text-brand-100/80' : 'text-slate-500',
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <div
                className={cn(
                  'relative mt-6 rounded-2xl border p-4 transition-colors duration-300',
                  plan.popular
                    ? 'border-white/10 bg-white/5 group-hover:bg-white/10'
                    : 'border-brand-100 bg-brand-50/60 group-hover:bg-brand-50',
                )}
              >
                <div className="flex items-end gap-2">
                  <span
                    className={cn(
                      'font-sans text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-5xl',
                      plan.popular ? 'text-white' : 'text-brand-950',
                    )}
                  >
                    {formatINR.format(plan.price)}
                  </span>
                  <span
                    className={cn(
                      'pb-1 text-sm',
                      plan.popular ? 'text-brand-100/70' : 'text-slate-500',
                    )}
                  >
                    {plan.cadence}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-2 text-[10px] font-bold uppercase tracking-[0.14em]',
                    plan.popular ? 'text-aqua-300' : 'text-brand-700',
                  )}
                >
                  {plan.duration}
                </p>
              </div>

              <ul className="relative my-6 flex-1 space-y-3.5 border-t border-current/10 pt-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      'flex items-start gap-3 text-sm leading-relaxed',
                      plan.popular ? 'text-white/85' : 'text-slate-600',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                        plan.popular
                          ? 'bg-aqua-500 text-brand-950'
                          : 'bg-brand-100 text-brand-700',
                      )}
                    >
                      <Check size={12} strokeWidth={2.7} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onEnquire(plan.interest)}
                className={cn(
                  'group/cta relative inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-4',
                  plan.popular
                    ? 'bg-aqua-500 text-brand-950 shadow-lg shadow-brand-950/20 hover:-translate-y-0.5 hover:bg-aqua-400 focus-visible:ring-aqua-300/40'
                    : 'border border-brand-200 bg-white text-brand-800 hover:-translate-y-0.5 hover:border-brand-800 hover:bg-brand-800 hover:text-white focus-visible:ring-brand-500/20',
                )}
              >
                Choose {plan.name}
                <ArrowRight size={17} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
              </button>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
