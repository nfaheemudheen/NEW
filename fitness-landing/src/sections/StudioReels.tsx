import { useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Dumbbell, MoveUpRight } from 'lucide-react'

const reels = [
  {
    title: 'Find your strength',
    category: 'Strength & confidence',
    creator: 'Polina Tankilevitch',
    href: 'https://www.pexels.com/video/women-working-out-6525498/',
    src: 'https://videos.pexels.com/video-files/6525498/6525498-hd_1920_1080_25fps.mp4',
    poster: 'https://images.pexels.com/videos/6525498/exercises-girl-sport-sporty-6525498.jpeg?auto=compress&dpr=1&h=750&w=1260',
  },
  {
    title: 'Move in your own rhythm',
    category: 'Group energy',
    creator: 'Antoni Shkraba',
    href: 'https://www.pexels.com/video/women-working-out-4671955/',
    src: 'https://videos.pexels.com/video-files/4671955/4671955-hd_1066_1920_25fps.mp4',
    poster: 'https://images.pexels.com/videos/4671955/----4671955.jpeg?auto=compress&dpr=1&h=750&w=1260',
  },
  {
    title: 'Show up for yourself',
    category: 'Everyday progress',
    creator: 'Antoni Shkraba',
    href: 'https://www.pexels.com/video/women-working-out-4671960/',
    src: 'https://videos.pexels.com/video-files/4671960/4671960-hd_1066_1920_25fps.mp4',
    poster: 'https://images.pexels.com/videos/4671960/----4671960.jpeg?auto=compress&dpr=1&h=750&w=1260',
  },
]

export default function StudioReels() {
  const reelsTrack = useRef<HTMLDivElement>(null)

  const moveReels = (direction: -1 | 1) => {
    const track = reelsTrack.current
    if (!track) return

    track.scrollBy({
      left: direction * track.clientWidth * 0.9,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_0%,rgba(4,123,233,0.23),transparent_42%),radial-gradient(ellipse_at_92%_100%,rgba(111,210,46,0.16),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-7 sm:mb-12 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-aqua-300">
              <Dumbbell size={14} /> Her Space in motion
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Strong feels better
              <br className="hidden sm:block" />
              <span className="italic text-aqua-400"> together.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              A glimpse of the movement, coaching and community waiting for you at our women-only studio.
            </p>
          </div>

          <a
            href="#programs"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-aqua-400 py-2 pl-5 pr-2 text-sm font-bold text-brand-950 shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40"
          >
            Find your class
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-950 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </a>
        </div>

        <div
          ref={reelsTrack}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          data-reveal
          data-reveal-delay="100"
        >
          {reels.map((reel, index) => (
            <article
              key={reel.href}
              className="group relative isolate aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900 shadow-2xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:border-aqua-400/60 hover:shadow-aqua-400/10 sm:w-auto"
            >
              <video
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                src={reel.src}
                poster={reel.poster}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={`${reel.title} — women's fitness video`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/10 to-brand-950/25" />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                <span className="rounded-full border border-white/20 bg-brand-950/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {reel.category}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition duration-300 group-hover:rotate-45 group-hover:bg-aqua-400 group-hover:text-brand-950">
                  <MoveUpRight size={16} />
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pb-14 sm:p-6 sm:pb-14">
                <span className="mb-2 block text-xs font-semibold text-aqua-300">0{index + 1} / STUDIO MOMENTS</span>
                <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">{reel.title}</h3>
                <a
                  href={reel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto mt-2 inline-block text-[11px] text-white/65 underline decoration-white/30 underline-offset-2 hover:text-white"
                  aria-label={`View video by ${reel.creator} on Pexels`}
                >
                  Video by {reel.creator} / Pexels
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => moveReels(-1)}
            aria-label="Show previous video"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-aqua-400 hover:bg-aqua-400 hover:text-brand-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="px-2 text-xs font-semibold tracking-wide text-white/60">Swipe to explore</span>
          <button
            type="button"
            onClick={() => moveReels(1)}
            aria-label="Show next video"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-aqua-400 hover:bg-aqua-400 hover:text-brand-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
