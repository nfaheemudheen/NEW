import { useState } from 'react'
import { ArrowRight, BadgeHelp, Plus } from 'lucide-react'
import { FAQS } from '@/data/faqs'
import { cn } from '@/lib/utils'

type FaqProps = {
  onEnquire: (interest: string) => void
}

const SPLIT_INDEX = Math.ceil(FAQS.length / 2)
const FAQ_COLUMNS = [FAQS.slice(0, SPLIT_INDEX), FAQS.slice(SPLIT_INDEX)]

export default function Faq({ onEnquire }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faqs" aria-labelledby="faq-title" className="section relative overflow-hidden bg-soft">
      <div className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-brand-200/35 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-aqua-200/35 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl rounded-[2.5rem] border border-white/90 bg-white/55 p-4 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur-sm sm:rounded-[3rem] sm:p-6 lg:p-8">
        <header className="relative mb-5 overflow-hidden rounded-[2rem] border border-brand-100/80 bg-gradient-to-br from-white/90 via-brand-50/75 to-aqua-50/80 px-5 py-8 text-center sm:mb-7 sm:px-8 sm:py-10" data-reveal>
          <div className="relative mx-auto max-w-3xl">
            <div className="section-badge mx-auto w-fit">
              <BadgeHelp size={14} /> GOOD TO KNOW
            </div>
            <h1 id="faq-title" className="section-title !mb-3 mt-1">
              Questions, <span className="italic text-gradient">answered.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
              A clear start makes all the difference. Find the details you need before your first
              class, or ask our team for a little personal help.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3.5 py-2 text-xs font-semibold text-brand-800 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <BadgeHelp size={14} />
              </span>
              {FAQS.length} quick answers for your first visit
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {FAQ_COLUMNS.map((column, columnIndex) => (
            <div className="space-y-3" key={`faq-column-${columnIndex}`}>
              {column.map((faq, itemIndex) => {
                const index = columnIndex === 0 ? itemIndex : SPLIT_INDEX + itemIndex
                const isOpen = openIndex === index

                return (
                  <article
                    key={faq.question}
                    className={cn(
                      'group overflow-hidden rounded-[1.5rem] border transition-all duration-300',
                      isOpen
                        ? 'border-brand-200 bg-gradient-to-br from-white to-brand-50/70 shadow-[0_16px_42px_-30px_rgba(4,123,233,0.35)]'
                        : 'border-slate-200/80 bg-white/85 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm',
                    )}
                    data-reveal
                    data-reveal-delay={String(itemIndex * 70)}
                  >
                    <h2>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-500/20 sm:px-5 sm:py-[1.125rem]"
                      >
                        <span className="flex min-w-0 items-center gap-3.5">
                          <span className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold tracking-[0.08em] transition-colors duration-300',
                            isOpen ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700 group-hover:bg-aqua-100',
                          )}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-semibold leading-snug text-slate-900 sm:text-[15px]">
                            {faq.question}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                            isOpen
                              ? 'rotate-45 border-brand-700 bg-brand-700 text-white'
                              : 'border-slate-200 bg-white text-slate-500 group-hover:border-brand-200 group-hover:text-brand-700',
                          )}
                        >
                          <Plus size={16} />
                        </span>
                      </button>
                    </h2>

                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      aria-hidden={!isOpen}
                      className={cn(
                        'grid transition-[grid-template-rows] duration-300 ease-out',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-brand-100/80 px-4 pb-5 pt-4 pl-[4.15rem] text-sm leading-relaxed text-slate-600 sm:px-5 sm:pl-[4.5rem]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}

            </div>
          ))}
        </div>

        <div className="relative isolate mt-5 flex w-full flex-col items-start justify-between gap-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 p-5 text-white shadow-premium sm:flex-row sm:items-center sm:px-7 sm:py-6" data-reveal>
          <div className="pointer-events-none absolute -right-8 -top-12 -z-10 h-36 w-36 rounded-full bg-aqua-400/20 blur-3xl" />
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-aqua-300">
              <BadgeHelp size={20} />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-200">A LITTLE MORE HELP</p>
              <h2 className="mt-1 font-display text-xl leading-snug sm:text-2xl">Still have a question?</h2>
              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-sm">
                Tell us what you are looking for. We will help you find the right starting point.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEnquire('General enquiry')}
            className="group/cta inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:w-auto"
          >
            Ask us <ArrowRight size={16} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
