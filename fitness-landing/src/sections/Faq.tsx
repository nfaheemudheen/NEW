import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { FAQS } from '@/data/faqs'
import { cn } from '@/lib/utils'

type FaqProps = {
  onEnquire: (interest: string) => void
}

export default function Faq({ onEnquire }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faqs" className="section bg-soft">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          as="h1"
          eyebrow="Good to know"
          title={
            <>
              Questions,
              <br />
              <span className="italic text-gradient">answered.</span>
            </>
          }
          description="Everything you might want to know before your first class. If your question is not here, send us a note and we will help."
        />

        <div className="mx-auto max-w-3xl" data-reveal data-reveal-delay="80">
          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.question}
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-white transition-colors duration-300',
                    isOpen ? 'border-brand-200 shadow-sm' : 'border-slate-200/80',
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-button-${index}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-500/20"
                    >
                      <span className="text-sm font-semibold text-slate-900 sm:text-base">
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                          isOpen
                            ? 'rotate-45 border-brand-700 bg-brand-700 text-white'
                            : 'border-slate-200 bg-white text-slate-500',
                        )}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                  </h3>

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
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white/70 px-5 py-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-semibold text-slate-900">Still have a question?</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Send us a note and we will help you find the right starting point.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEnquire('General enquiry')}
              className="btn-outline shrink-0 !px-5 !py-2.5 text-sm"
            >
              Ask us <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
