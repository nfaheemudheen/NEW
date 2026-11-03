import { ArrowRight, Award, ClipboardList, Flower2, HeartHandshake, Leaf } from 'lucide-react'

const BENEFITS = [
  {
    icon: Award,
    title: 'Certified fitness trainers',
    description:
      'Every coach is certified, experienced and trained to support women at every stage of life.',
  },
  {
    icon: ClipboardList,
    title: 'Personalised workout plans',
    description:
      'Your plan adapts to your body, goals and schedule — never a one-size-fits-all template.',
  },
  {
    icon: HeartHandshake,
    title: 'Comfortable women-only space',
    description:
      'A private, supportive studio where you can focus on yourself, not on who is watching.',
  },
  {
    icon: Leaf,
    title: 'Holistic wellness support',
    description:
      'Training, nutrition, recovery and mindset support in one joined-up approach.',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-brand-50/70">
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-aqua-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-brand-200/30 blur-[100px]" />

      <div className="section relative mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div data-reveal>
            <div className="section-badge">
              <Flower2 size={14} /> Why Bloom
            </div>
            <h2 className="section-title">
              Made for the way
              <br />
              <span className="italic text-gradient">women actually move.</span>
            </h2>
            <p className="section-subtitle !mx-0">
              No mirrors full of comparison. No one-size-fits-all programming. Just thoughtful
              coaching in a space that feels like yours.
            </p>

            <div className="mt-8 rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-sm">
              <Flower2 size={20} className="mb-3 text-brand-500" />
              <p className="font-display text-xl italic leading-relaxed text-slate-700">
                “No mirrors full of comparison. Just a room full of women getting stronger
                together.”
              </p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                The Bloom promise
              </p>
            </div>

            <a href="/about#trainers" className="btn-outline mt-8">
              Meet our trainers <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-reveal data-reveal-delay="100">
            {BENEFITS.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-[1.75rem] border border-white bg-white/85 p-6 shadow-[0_20px_45px_-35px_rgba(36,53,45,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.18em] text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-xl text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
