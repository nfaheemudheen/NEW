import { Apple, ArrowRight, Flower2, Heart, Leaf, Moon, Sparkles } from 'lucide-react'
import wellnessImage from '@/assets/wellness.jpg'

type WellnessProps = {
  onEnquire: (interest: string) => void
}

const WELLNESS_PILLARS = [
  {
    icon: Leaf,
    title: 'Balanced nutrition guidance',
    description: 'Practical, sustainable eating guidance that fits your routine, culture and preferences.',
  },
  {
    icon: Apple,
    title: 'Healthy eating habits',
    description: 'Small, realistic shifts that support energy, mood and long-term results — no crash diets.',
  },
  {
    icon: Moon,
    title: 'Fitness recovery',
    description: 'Mobility, rest and recovery strategies so your body can adapt, repair and grow stronger.',
  },
  {
    icon: Heart,
    title: 'Lifestyle & wellness support',
    description: 'Sleep, stress and everyday wellbeing woven into your training plan, not treated as an extra.',
  },
]

export default function Wellness({ onEnquire }: WellnessProps) {
  return (
    <section id="wellness" className="section relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="relative order-2 min-w-0 lg:order-1" data-reveal>
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-aqua-100 blur-2xl" />
            <div className="relative overflow-hidden rounded-[3rem] border-[6px] border-white shadow-premium">
              <img
                src={wellnessImage}
                alt="A colourful bowl of fresh, healthy food prepared at Bloom Studio"
                loading="lazy"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/35 via-transparent to-transparent" />
            </div>

            <div className="glass-card absolute -bottom-7 right-4 px-5 py-4 sm:-right-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Sparkles size={19} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                    Whole-body support
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-900">
                    Train · eat · rest · repeat
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <Leaf size={15} className="text-brand-600" />
                <span className="text-xs font-bold text-slate-900">Habits that last</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2" data-reveal data-reveal-delay="100">
            <div className="section-badge">
              <Flower2 size={14} /> Nutrition &amp; wellness
            </div>
            <h2 className="section-title">
              Fitness goes beyond
              <br />
              <span className="italic text-gradient">the workout.</span>
            </h2>
            <p className="section-subtitle !mx-0">
              Build sustainable habits with guidance that supports your training, nutrition,
              recovery and everyday well-being — so progress feels good, not punishing.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {WELLNESS_PILLARS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                    <Icon size={19} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{description}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onEnquire('Nutrition & wellness')}
              className="btn-outline mt-8"
            >
              Explore wellness <ArrowRight size={18} />
            </button>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              Wellness guidance is educational and does not replace personalised medical advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
