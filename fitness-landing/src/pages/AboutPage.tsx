import { ArrowRight, Flower2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
import { MANAGEMENT_TEAM, TRAINERS } from '@/data/trainers'
import studioImage from '@/assets/studio.jpg'
import exerciseCutout from '@/assets/exercise-cutout.webp'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function AboutPage() {
  useScrollReveal()
  const navigate = useNavigate()
  const goToEnquiry = () => navigate('/contact')

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>
      <Header onJoin={goToEnquiry} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section id="our-story" className="relative isolate overflow-hidden bg-brand-950">
          <img
            src={studioImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/80 to-brand-900/55" />
          <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28 lg:py-32">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-100 backdrop-blur">
              <Flower2 size={14} /> Our story
            </div>
            <h1 className="font-display text-[clamp(1.75rem,9vw,2.25rem)] leading-tight text-white sm:text-5xl lg:text-6xl">
              A stronger kind of
              <span className="mt-2 block italic text-aqua-200">women’s wellness.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-100/85 sm:text-lg">
              Her Space is a women-only studio where expert coaching, thoughtful programs and a warm
              community help you feel stronger in every season of life.
            </p>
            <a href="#management" className="btn-ghost-light mt-8">
              Get to know Her Space <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section id="management" className="section bg-Her Space">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Management team"
              title={
                <>
                  Led with care,
                  <br />
                  <span className="italic text-gradient">built around you.</span>
                </>
              }
              description="Our leadership stays close to the studio floor, shaping coaching and programs around the women who come through our doors."
            />

            <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
              {MANAGEMENT_TEAM.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white shadow-premium"
                >
                  <div className="h-[260px] overflow-hidden bg-brand-50 sm:h-[300px]">
                    <img
                      src={member.image}
                      alt={`${member.name}, ${member.role} at Her Space Studio`}
                      loading="lazy"
                      className="h-full w-full scale-[0.94] object-cover object-top transition-transform duration-700 group-hover:scale-[0.98]"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                      {member.role}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-slate-900 sm:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-brand-700">
                      {member.experience} | {member.specialty}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trainers" className="section bg-white">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Our trainers" title="Meet your coaches." />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" data-reveal>
              {TRAINERS.map((trainer) => (
                <article
                  key={trainer.id}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm"
                >
                  <div className="aspect-square overflow-hidden bg-brand-50">
                    <img
                      src={trainer.image}
                      alt={`${trainer.name}, ${trainer.role}`}
                      loading="lazy"
                      className="h-full w-full scale-[0.94] object-cover transition-transform duration-700 group-hover:scale-[0.98]"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-xl text-slate-900">{trainer.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-700">{trainer.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {trainer.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-brand-950">
          <div className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-aqua-500/20 blur-[110px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_0.72fr] lg:px-10">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl text-balance text-white sm:text-4xl">
                Your next chapter starts here.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-100/80 lg:mx-0">
                Come meet the team, try a class and find the kind of movement that feels like
                yours.
              </p>
              <button type="button" onClick={goToEnquiry} className="btn-light mt-7">
                Start your journey <ArrowRight size={18} />
              </button>
            </div>
            <div className="relative mx-auto hidden w-full max-w-[320px] lg:block">
              <div className="absolute inset-x-6 bottom-0 h-3/4 rounded-full bg-aqua-400/20 blur-[70px]" />
              <img
                src={exerciseCutout}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
