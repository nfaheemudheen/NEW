import { Sparkles, Star } from 'lucide-react'
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
    <section id="testimonials" className="section relative overflow-hidden bg-brand-50/70">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-aqua-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-200/30 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Member stories"
          title={
            <>
              She came for the workout.
              <br />
              <span className="italic text-gradient">She stayed for the women.</span>
            </>
          }
          description="Honest words from members who found their rhythm — and a room that had their back. These stories are sample content for development."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-reveal data-reveal-delay="80">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-premium"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${testimonial.avatarColor}`}
                    aria-hidden="true"
                  >
                    {testimonial.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <GoogleIcon />
                  <span className="text-[11px] font-medium text-slate-500">Google Review</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex items-center gap-0.5 text-amber-400"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill={index < testimonial.rating ? 'currentColor' : 'none'}
                      className={index < testimonial.rating ? '' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">{testimonial.timeAgo}</span>
              </div>

              <blockquote className="flex-1 text-[15px] leading-relaxed text-slate-700">
                {testimonial.quote}
              </blockquote>
            </article>
          ))}
        </div>

        <p
          className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400"
          data-reveal
        >
          <Sparkles size={13} /> Reviews and names are placeholders for development.
        </p>
      </div>
    </section>
  )
}
