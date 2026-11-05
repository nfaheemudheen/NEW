import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Flower2,
  HeartPulse,
  Laptop,
  Music2,
  Sparkles,
  Timer,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import danceImage from '@/assets/program-dance.jpg'
import onlineImage from '@/assets/program-online.jpg'
import strengthImage from '@/assets/program-strength.jpg'
import weightLossImage from '@/assets/program-weight-loss.jpg'
import yogaImage from '@/assets/program-yoga.jpg'
import equipmentImage from '@/assets/gallery-equipment.jpg'
import functionalImage from '@/assets/gallery-functional.jpg'
import groupImage from '@/assets/gallery-group.jpg'
import yogaDuoImage from '@/assets/gallery-yoga-duo.jpg'
import wellnessImage from '@/assets/wellness.jpg'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type ClassFeature = {
  title: string
  description: string
  icon: LucideIcon
  image: string
  weekend?: boolean
}

const offlineFeatures: ClassFeature[] = [
  { title: 'Yoga', description: 'Build flexibility, balance and calm through guided poses and breathwork.', icon: Flower2, image: yogaImage },
  { title: 'Workout with props', description: 'Use simple fitness props to add support, variety and challenge to your movement.', icon: Sparkles, image: equipmentImage },
  { title: 'Cardio', description: 'Enjoy upbeat, full-body movement designed to get you moving and build stamina.', icon: HeartPulse, image: groupImage },
  { title: 'HIIT workout', description: 'Alternate focused bursts of effort with recovery in an energizing coached session.', icon: Timer, image: functionalImage },
  { title: 'Fat burning drills', description: 'Move through dynamic circuits that blend conditioning and strength exercises.', icon: Waves, image: weightLossImage },
  { title: 'Dance class', description: 'Follow easy-to-learn routines, enjoy the music and make movement feel like a celebration.', icon: Music2, image: danceImage, weekend: true },
  { title: 'Kids yoga', description: 'A playful introduction to yoga with simple poses, mindful breathing and movement games.', icon: Flower2, image: yogaDuoImage, weekend: true },
  { title: 'Senior yoga meditation', description: 'Gentle movement, comfortable stretches and guided meditation in a welcoming group.', icon: Waves, image: wellnessImage, weekend: true },
]

const onlineFeatures: ClassFeature[] = [
  { title: 'Yoga', description: 'Follow guided poses and breathwork from home to support flexibility, balance and relaxation.', icon: Flower2, image: yogaImage },
  { title: 'Cardio', description: 'Join upbeat, equipment-light movement sessions designed to keep you active wherever you are.', icon: HeartPulse, image: weightLossImage },
  { title: 'HIIT workout', description: 'Fit an energizing interval session into your day with coached work and recovery periods.', icon: Timer, image: functionalImage },
  { title: 'Workout with props', description: 'Use everyday or recommended fitness props to add support and variety to your home workout.', icon: Sparkles, image: equipmentImage },
  { title: 'Fat burning drills', description: 'Follow dynamic conditioning circuits with clear coaching and options to suit your pace.', icon: Waves, image: groupImage },
  { title: 'Strength training', description: 'Build a steady strength routine with guided exercises and progressions you can follow at home.', icon: Dumbbell, image: strengthImage },
  { title: 'Senior Ladies Strength & Mobility Program', description: 'A supportive online program centered on practical strength, comfortable movement and mobility.', icon: HeartPulse, image: wellnessImage },
  { title: 'Diastasis Recti Recovery Program', description: 'A guided, gentle movement program focused on core awareness and rebuilding a comfortable exercise routine.', icon: Flower2, image: yogaDuoImage },
]

type ClassMode = 'offline' | 'online'

export default function ServicesPage() {
  useScrollReveal()
  const navigate = useNavigate()
  const goToEnquiry = () => navigate('/contact')

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30">Skip to content</a>
      <Header onJoin={goToEnquiry} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section id="class-options" className="flex min-h-[calc(100svh-72px)] items-center bg-aqua-50 px-3 py-3 sm:px-8 sm:py-7 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-4 text-center sm:mb-7" data-reveal>
              <p className="mb-2 inline-flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                <span className="h-px w-6 bg-aqua-500" /> Classes for every season
              </p>
              <h1 className="mx-auto max-w-5xl font-display text-3xl leading-tight text-brand-950 sm:text-4xl lg:text-5xl">
                Find your rhythm. <span className="text-aqua-700">Feel the difference.</span>
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Choose a format and find a class that fits the way you want to move.
              </p>
            </div>
            <div className="grid gap-2 sm:gap-5 md:grid-cols-2" data-reveal>
              <ModeCard mode="offline" />
              <ModeCard mode="online" />
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export function ServicesClassPage({ mode }: { mode: ClassMode }) {
  useScrollReveal()
  const navigate = useNavigate()
  const features = mode === 'offline' ? offlineFeatures : onlineFeatures

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30">Skip to content</a>
      <Header onJoin={() => navigate('/contact')} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <ClassSection mode={mode} features={features} onEnquire={() => navigate('/contact')} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

function ModeCard({ mode }: { mode: ClassMode }) {
  const isOffline = mode === 'offline'
  const Icon = isOffline ? Flower2 : Laptop
  const image = isOffline ? groupImage : onlineImage
  const description = isOffline
    ? 'Enjoy in-person coaching and the energy of a welcoming studio community.'
    : 'Join guided workouts from home and make movement fit your day.'

  return (
    <Link to={`/services/${mode}`} aria-label={`View ${isOffline ? 'offline' : 'online'} class details`} className="group relative flex min-h-[12rem] w-full flex-col justify-end overflow-hidden rounded-[1.5rem] border border-white/60 text-left shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/50 sm:min-h-[19rem] sm:rounded-[2rem] lg:min-h-[21rem]">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-brand-950/5" />
      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-brand-950/35 text-white backdrop-blur sm:right-5 sm:top-5 sm:h-11 sm:w-11"><ArrowDownRight size={20} /></span>
      <span className="relative p-4 text-white sm:p-8">
        <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-aqua-200 backdrop-blur sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl"><Icon size={20} className="sm:hidden" /><Icon size={23} className="hidden sm:block" /></span>
        <span className="block font-display text-2xl sm:text-4xl">{isOffline ? 'Offline classes' : 'Online classes'}</span>
        <span className="mt-1.5 block max-w-lg text-xs leading-4 text-white/85 sm:mt-2 sm:text-sm sm:leading-6">{description}</span>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-aqua-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-950 sm:mt-5 sm:px-4 sm:py-2 sm:text-xs">Explore classes <ArrowRight size={14} /></span>
      </span>
    </Link>
  )
}

function ClassSection({ mode, features, onEnquire }: { mode: ClassMode; features: ClassFeature[]; onEnquire: () => void }) {
  const isOffline = mode === 'offline'
  const regularFeatures = features.filter((feature) => !feature.weekend)
  const weekendFeatures = features.filter((feature) => feature.weekend)

  return (
    <section className={`section ${isOffline ? 'bg-white' : 'bg-aqua-50'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">{isOffline ? 'In the studio' : 'Train from anywhere'}</p>
            <h2 className="font-display text-3xl text-brand-950 sm:text-4xl">{isOffline ? 'Offline classes' : 'Online classes'}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{isOffline ? 'Move, learn and build momentum with the energy of an in-person class.' : 'Join from home and enjoy guided sessions that fit around your day.'}</p>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-950"><ArrowLeft size={17} />Back to class options</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regularFeatures.map((feature, index) => {
            const centerLastAtTablet =
              regularFeatures.length % 2 === 1 && index === regularFeatures.length - 1
            return (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                className={
                  centerLastAtTablet
                    ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full'
                    : undefined
                }
              />
            )
          })}
        </div>
        {weekendFeatures.length > 0 && (
          <div className="mt-10">
            <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-aqua-200/50 text-aqua-900"><Music2 size={19} /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">Make the weekend yours</p><h3 className="font-display text-2xl text-brand-950">Weekend special programs</h3></div></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weekendFeatures.map((feature, index) => {
                const centerLastAtTablet =
                  weekendFeatures.length % 2 === 1 && index === weekendFeatures.length - 1
                return (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    index={index}
                    className={
                      centerLastAtTablet
                        ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full'
                        : undefined
                    }
                  />
                )
              })}
            </div>
          </div>
        )}
        <div className="mt-8 rounded-[1.75rem] bg-brand-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div><h3 className="font-display text-2xl">Not sure where to start?</h3><p className="mt-2 text-sm text-white/70">Tell us what you’re looking for and we’ll help you find a class that fits.</p></div>
          <button type="button" onClick={onEnquire} className="btn-light mt-5 sm:mt-0">Talk to our team <ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
  className,
}: {
  feature: ClassFeature
  index: number
  className?: string
}) {
  const Icon = feature.icon
  return (
    <article className={`group overflow-hidden rounded-[1.5rem] border border-brand-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-premium ${className ?? ''}`} data-reveal data-reveal-delay={index ? String(Math.min(index * 60, 180)) : undefined}>
      <div className="relative h-40 overflow-hidden sm:h-44"><img src={feature.image} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 to-transparent" /><span className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/90 text-brand-700 shadow-sm"><Icon size={19} /></span><span className="absolute right-4 top-3 text-[10px] font-bold tracking-[0.16em] text-white drop-shadow">{String(index + 1).padStart(2, '0')}</span></div>
      <div className="p-5 sm:p-6"><h4 className="font-display text-xl leading-snug text-brand-950">{feature.title}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p></div>
    </article>
  )
}
