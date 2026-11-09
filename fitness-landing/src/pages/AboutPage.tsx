import { ArrowRight, Flower2, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
import { FOUNDER, TRAINERS } from '@/data/trainers'
import { BRANCHES } from '@/data/site'
import FranchiseInfo from '@/sections/FranchiseInfo'
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
            <a href="#leadership" className="btn-ghost-light mt-8">
              Get to know Her Space <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section id="leadership" className="section bg-Her Space">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Founder & branch leadership"
              title={
                <>
                  One vision,
                  <br />
                  <span className="italic text-gradient">rooted in community.</span>
                </>
              }
              description="Meet the founder and the people leading our two branches, with a shared focus on women-first fitness."
            />

            <article className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white shadow-premium md:grid-cols-[0.8fr_1.2fr]" data-reveal>
              <div className="relative min-h-[280px] overflow-hidden bg-brand-100 sm:min-h-[360px]">
                <img
                  src={FOUNDER.image}
                  alt={`${FOUNDER.name}, ${FOUNDER.role}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-950/40 to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                  {FOUNDER.role}
                </p>
                <h2 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">
                  {FOUNDER.name}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {FOUNDER.bio}
                </p>
              </div>
            </article>

            <div className="mx-auto mt-12 max-w-5xl" data-reveal>
              <div className="mb-6 flex flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 shadow-sm">
                  <MapPin size={13} /> Branches
                </span>
                <h3 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  Branch leadership
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                  A familiar face at every location, keeping the Her Space welcome personal.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                {BRANCHES.map((branch, index) => (
                  <article
                    key={branch.name}
                    className="group relative isolate overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white p-4 shadow-[0_18px_45px_-32px_rgba(9,39,71,0.35)] transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-premium sm:rounded-[2rem] sm:p-6"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-40 w-40 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-125" />
                    <div className="mb-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-700 sm:text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
                        {branch.name}
                      </span>
                      <span className="font-display text-2xl italic text-brand-100 sm:text-3xl">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-aqua-400 p-[3px] shadow-lg shadow-brand-900/10 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                        <img
                          src={branch.headImage}
                          alt={branch.headName}
                          loading="lazy"
                          className="h-[4.25rem] w-[4.25rem] rounded-full border-2 border-white object-cover object-top sm:h-20 sm:w-20"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="break-words font-display text-xl leading-tight text-slate-900 sm:text-2xl">
                          {branch.location}
                        </h4>
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.11em] text-brand-700 sm:text-[10px] sm:tracking-[0.14em]">
                          {branch.headRole}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {branch.headName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-start gap-2.5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500 sm:mt-6 sm:text-sm">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-brand-600" />
                      <span>{branch.address}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FranchiseInfo />

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
