import { ArrowRight, Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import communityImage from '@/assets/gallery-community.jpg'
import groupImage from '@/assets/gallery-group.jpg'
import strengthImage from '@/assets/gallery-strength.jpg'
import yogaImage from '@/assets/gallery-yoga.jpg'
import equipmentImage from '@/assets/gallery-equipment.jpg'
import conditioningImage from '@/assets/gallery-functional.jpg'
import studioImage from '@/assets/studio.jpg'
import onlineImage from '@/assets/program-online.jpg'
import coachingImage from '@/assets/program-personal.jpg'

const ABOUT_FEATURES = [
  {
    category: 'COACHING',
    image: coachingImage,
    imageAlt: 'A trainer guiding a member through a workout',
    title: 'Coaching that listens',
    description: 'Clear cues and options shaped around how you feel today.',
  },
  {
    category: 'COMMUNITY',
    image: communityImage,
    imageAlt: 'A member smiling after a fitness class',
    title: 'Women-first community',
    description: 'A welcoming room where women encourage each other.',
  },
  {
    category: 'YOGA & MOBILITY',
    image: yogaImage,
    imageAlt: 'A woman flowing through a yoga sequence',
    title: 'Space to stretch and reset',
    description: 'Breathe, move and build flexibility at your own pace.',
  },
  {
    category: 'STRENGTH',
    image: strengthImage,
    imageAlt: 'A member training with weights in the studio',
    title: 'Strength that builds',
    description: 'Progressive sessions help you feel stronger week by week.',
  },
  {
    category: 'CARDIO',
    image: conditioningImage,
    imageAlt: 'A member doing a full-body conditioning exercise',
    title: 'Cardio with good energy',
    description: 'Upbeat circuits build stamina with options for every level.',
  },
  {
    category: 'TRAIN WITH PROPS',
    image: equipmentImage,
    imageAlt: 'Studio equipment ready for a guided workout',
    title: 'Make every move adaptable',
    description: 'Weights, bands and props bring variety to your practice.',
  },
  {
    category: 'GROUP CLASSES',
    image: groupImage,
    imageAlt: 'Women moving together in a group fitness class',
    title: 'Move better together',
    description: 'Find your rhythm with the motivation of a supportive group.',
  },
  {
    category: 'THE STUDIO',
    image: studioImage,
    imageAlt: 'Her Space Studio ready for a welcoming group class',
    title: 'A place that feels like yours',
    description: 'A bright, comfortable space to focus on your own progress.',
  },
  {
    category: 'ONLINE CLASSES',
    image: onlineImage,
    imageAlt: 'A woman following a fitness class at home',
    title: 'Keep moving from home',
    description: 'Join online sessions and make space for movement anywhere.',
  },
]

export default function About() {
  return (
    <section id="about" className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-brand-100 bg-white/80 py-7 shadow-[0_24px_80px_-52px_rgba(9,39,71,0.34)] sm:rounded-[2.5rem] sm:py-10 lg:py-12">
        <header className="mx-auto mb-8 max-w-3xl px-5 text-center sm:mb-10 sm:px-8" data-reveal>
          <div className="section-badge mx-auto mb-4 w-fit">
            <Flower2 size={14} /> ABOUT Her Space
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Find your rhythm. <span className="text-brand-700">Feel at home.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
            Discover the people, classes and thoughtful details that make Her Space a place to keep
            growing stronger.
          </p>
        </header>

        <div className="about-marquee-viewport" aria-label="Explore Her Space features">
          <div className="about-marquee-track">
            {[false, true].map((isDuplicate) => (
              <div
                key={isDuplicate ? 'duplicate' : 'features'}
                className="about-marquee-group"
                aria-hidden={isDuplicate || undefined}
              >
                {ABOUT_FEATURES.map((feature, index) => (
                  <article
                    key={feature.category}
                    className="group relative h-[330px] w-[238px] shrink-0 overflow-hidden rounded-[1.6rem] bg-brand-900 shadow-[0_16px_40px_-22px_rgba(9,39,71,0.45)] sm:h-[370px] sm:w-[270px] lg:h-[390px] lg:w-[286px]"
                  >
                    <img
                      src={feature.image}
                      alt={isDuplicate ? '' : feature.imageAlt}
                      aria-hidden={isDuplicate || undefined}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-transparent to-brand-950/95" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                      <span className="rounded-full border border-white/20 bg-brand-950/45 px-3 py-1.5 text-[9px] font-bold tracking-[0.14em] text-white backdrop-blur-sm sm:text-[10px]">
                        {feature.category}
                      </span>
                      <span className="font-display text-lg text-white/80">0{index + 1}</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className="font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-5 mt-8 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-aqua-50 p-5 text-center sm:mx-8 sm:mt-10 sm:flex-row sm:px-7 sm:py-5 sm:text-left lg:mx-12" data-reveal>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-md shadow-brand-900/15">
              <Flower2 size={20} />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-slate-900 sm:text-xl">Your place to grow stronger.</p>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">Good people, thoughtful coaching, and room to be yourself.</p>
            </div>
          </div>
          <Link
            to="/about"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 sm:w-auto"
          >
            Get to know Her Space
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
