import { useEffect, useState } from 'react'
import { ArrowRight, Laptop, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import groupImage from '@/assets/gallery-group.jpg'
import onlineImage from '@/assets/program-online.jpg'
import strengthImage from '@/assets/gallery-strength.jpg'
import yogaImage from '@/assets/gallery-yoga.jpg'

const FEATURED_IMAGES = [
  { src: groupImage, alt: 'Women moving together in a group fitness class' },
  { src: strengthImage, alt: 'A member building strength during a studio workout' },
  { src: yogaImage, alt: 'A woman flowing through a yoga sequence' },
  { src: onlineImage, alt: 'A woman following a fitness class at home' },
]

export default function Programs() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % FEATURED_IMAGES.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section id="programs" className="section bg-soft">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-brand-950 text-white shadow-premium sm:rounded-[2.5rem] lg:grid-cols-[1fr_0.95fr]">
          <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative z-10 flex flex-col items-start justify-center p-7 sm:p-10 lg:p-12">
            <h2 className="max-w-xl font-display text-4xl leading-[1.08] text-white sm:text-5xl">Your next class.<br /><span className="text-aqua-300">Your kind of strong.</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">Choose the energy of our studio or the flexibility of online training. Find supportive coaching and a class that fits your life.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white/85"><MapPin size={14} className="text-aqua-300" />Studio classes</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white/85"><Laptop size={14} className="text-aqua-300" />Online classes</span>
            </div>
            <Link to="/services" className="mt-7 inline-flex items-center gap-2 rounded-full bg-aqua-500 px-6 py-3 text-sm font-bold text-brand-950 shadow-lg shadow-aqua-500/20 transition hover:-translate-y-0.5 hover:bg-aqua-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40">Explore all classes <ArrowRight size={17} /></Link>
          </div>
          <div className="relative min-h-[250px] overflow-hidden sm:min-h-[330px] lg:min-h-[400px]">
            {FEATURED_IMAGES.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={index === activeImage ? image.alt : ''}
                aria-hidden={index !== activeImage}
                fetchPriority={index === 0 ? 'high' : undefined}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${index === activeImage ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/5 to-brand-950/10 lg:bg-gradient-to-r lg:from-brand-950/60 lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
