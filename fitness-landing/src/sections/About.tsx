import { ArrowRight, Award, Heart, Users } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: Heart,
    title: 'Women-centered training',
    description: "Training shaped around women's goals and changing needs.",
  },
  {
    icon: Award,
    title: 'Expert guidance',
    description: 'Certified coaches support your form and progress.',
  },
  {
    icon: Users,
    title: 'Supportive community',
    description: 'A welcoming community that grows stronger together.',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="section bg-white !pt-16 !pb-12 sm:!pt-20 sm:!pb-14 lg:!pt-24 lg:!pb-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div
            className="min-h-[400px] sm:min-h-[500px] lg:min-h-[560px]"
            data-journey-image="about"
            aria-hidden="true"
          />
          <div className="relative z-30 text-center lg:text-left" data-reveal data-reveal-delay="100">
            <h2 className="section-title !mb-3 !text-3xl sm:!text-4xl lg:!text-5xl">
              A space where women
              <br />
              <span className="italic text-gradient">grow stronger.</span>
            </h2>
            <p className="section-subtitle !mx-auto !text-base sm:!text-lg lg:!mx-0">
              Bloom is a women-only studio for strength, personal coaching and whole-body wellness.
            </p>

            <div className="mt-8 space-y-4 text-left">
              {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="/about" className="btn-outline mt-7">
              Discover our story <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
