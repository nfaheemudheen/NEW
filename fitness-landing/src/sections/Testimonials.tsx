import { Star } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { TESTIMONIALS } from '@/data/testimonials'

function GoogleIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section relative overflow-hidden bg-soft">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-aqua-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-200/30 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl rounded-[2.5rem] border border-white/90 bg-white/55 p-5 shadow-[0_28px_80px_-48px_rgba(9,39,71,0.3)] backdrop-blur-sm sm:rounded-[3rem] sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="Member stories"
          title={
            <>
              She came for the workout.
              <br />
              <span className="italic text-gradient">She stayed for the women.</span>
            </>
          }
          description="Honest words from members who found their rhythm and a room that had their back."
          className="mb-9 sm:mb-11"
        />

        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="group relative isolate flex h-full min-h-[315px] flex-col overflow-hidden rounded-[1.8rem] border border-brand-100/80 bg-gradient-to-br from-white via-white to-brand-50/70 p-5 shadow-[0_18px_48px_-34px_rgba(9,39,71,0.32)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_28px_60px_-32px_rgba(4,123,233,0.28)] sm:p-6"
              data-reveal
              data-reveal-delay={String(index * 100)}
            >
              <div className="pointer-events-none absolute -right-10 -top-12 -z-10 h-36 w-36 rounded-full bg-aqua-100/70 blur-2xl transition-transform duration-500 group-hover:scale-150" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md ring-4 ring-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 ${testimonial.avatarColor}`}
                    aria-hidden="true"
                  >
                    {testimonial.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{testimonial.name}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 group-hover:-rotate-6">
                    <GoogleIcon size={21} />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Google</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <div
                  className="flex items-center gap-0.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-400"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      fill={index < testimonial.rating ? 'currentColor' : 'none'}
                      className={index < testimonial.rating ? '' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-400">{testimonial.timeAgo}</span>
              </div>

              <div className="relative mt-4 flex-1">
                <blockquote className="relative pr-5 font-display text-[1.05rem] leading-7 text-slate-700 sm:text-lg">
                  {testimonial.quote}
                </blockquote>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-brand-100/80 pt-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-700">Member story</span>
                <span className="text-[10px] font-medium text-slate-400">{testimonial.reviewCount} reviews</span>
              </div>
              <span className="absolute bottom-0 left-5 h-1 w-10 rounded-full bg-brand-500 transition-all duration-300 group-hover:w-20 group-hover:bg-aqua-500 sm:left-6" />
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
