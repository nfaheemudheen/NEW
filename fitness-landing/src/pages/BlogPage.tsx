import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Flower2,
  Play,
  Sparkles,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { YouTubeIcon } from '@/components/SocialIcons'
import {
  BLOG_CATEGORIES,
  BLOG_HOME_URL,
  BLOG_POSTS,
  STUDIO_VIDEOS,
  YOUTUBE_CHANNEL_URL,
  formatBlogDate,
  type BlogPost,
  type StudioVideo,
} from '@/data/blog'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import heroImage from '@/assets/hero-gym.webp'

const FEATURED_POST = BLOG_POSTS[0]
const ARCHIVE_POSTS = BLOG_POSTS.slice(1)
const FILTERS = BLOG_CATEGORIES
type BlogFilter = (typeof FILTERS)[number]

export default function BlogPage() {
  useScrollReveal()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<BlogFilter>('All')
  const [activeVideo, setActiveVideo] = useState<StudioVideo | null>(null)

  const closeVideo = useCallback(() => setActiveVideo(null), [])

  const visiblePosts = useMemo(() => {
    if (activeFilter === 'All') return ARCHIVE_POSTS
    return ARCHIVE_POSTS.filter((post) => post.category === activeFilter)
  }, [activeFilter])

  const countFor = (filter: BlogFilter) =>
    filter === 'All'
      ? ARCHIVE_POSTS.length
      : ARCHIVE_POSTS.filter((post) => post.category === filter).length

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>

      <Header onJoin={() => navigate('/contact?interest=Membership%20enquiry')} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="relative isolate overflow-hidden bg-brand-950 text-white">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[86%_46%] opacity-70 saturate-[0.85] sm:object-[70%_center] sm:opacity-70 lg:object-[64%_center] lg:opacity-75"
          />

          {/* Navy wash keeps the headline crisp while letting the studio glow through. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,39,71,0.7)_0%,rgba(9,39,71,0.52)_38%,rgba(9,39,71,0.92)_100%)] sm:bg-[linear-gradient(105deg,rgba(9,39,71,0.98)_0%,rgba(9,39,71,0.92)_34%,rgba(9,39,71,0.64)_62%,rgba(7,61,115,0.3)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(110%_85%_at_92%_6%,rgba(111,210,46,0.16)_0%,transparent_52%),radial-gradient(90%_80%_at_2%_100%,rgba(4,123,233,0.3)_0%,transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(116deg,transparent_38%,rgba(255,255,255,0.07)_47%,transparent_58%)]" />

          {/* Editorial dot grid, softened into the navy at the edges. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(58%_58%_at_16%_18%,black_0%,transparent_76%)]"
          />

          {/* Orbiting rings that echo the journal's editorial mark. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80 lg:-right-24 lg:top-1/2 lg:h-[30rem] lg:w-[30rem] lg:-translate-y-1/2"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-16 h-40 w-40 rounded-full border border-aqua-300/20 sm:h-52 sm:w-52 lg:-right-10 lg:top-1/2 lg:h-72 lg:w-72 lg:-translate-y-1/2"
          />

          <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-aqua-500/20 blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-aqua-200 backdrop-blur">
                <BookOpen size={14} /> The Her Space journal
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.7rem,7vw,5rem)] leading-[1.02] tracking-[-0.035em] text-white">
                Good reading.
                <span className="mt-2 block italic text-aqua-300">Stronger living.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                Practical stories on movement, food and everyday wellbeing — written for the way
                women actually live, by the team at Her Space.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#latest"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3.5 text-sm font-bold text-brand-950 shadow-xl shadow-brand-950/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                >
                  Browse the journal
                  <BookOpen size={17} className="transition-transform duration-300 group-hover:-rotate-6" />
                </a>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <YouTubeIcon size={18} /> Watch on YouTube
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-aqua-300" /> New reads every week
                </span>
                <span className="inline-flex items-center gap-2">
                  <Flower2 size={14} className="text-aqua-300" /> By women, for women
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rotate-[2.5deg] rounded-[2.2rem] border border-white/10 bg-white/[0.045] sm:-inset-4"
              />
              <span className="absolute -right-2 -top-3 z-20 inline-flex rotate-2 items-center gap-2 rounded-full bg-aqua-400 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-950 shadow-lg sm:-right-4 sm:-top-4">
                <Sparkles size={13} /> Latest story
              </span>

              <article className="relative overflow-hidden rounded-[1.9rem] border border-white/40 bg-white shadow-[0_35px_90px_-35px_rgba(0,0,0,0.7)]">
                <Link
                  to={`/blog/${FEATURED_POST.slug}`}
                  aria-label={`Read ${FEATURED_POST.title}`}
                  className="group block overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-brand-100">
                    <img
                      src={FEATURED_POST.image}
                      alt={FEATURED_POST.imageAlt}
                      fetchPriority="high"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent" />
                  </div>
                </Link>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">
                      {FEATURED_POST.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-brand-600" />
                      {formatBlogDate(FEATURED_POST.date)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} className="text-brand-600" />
                      {FEATURED_POST.readTime} min read
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-[1.55rem] leading-[1.17] text-slate-900 sm:text-[1.8rem]">
                    <Link
                      to={`/blog/${FEATURED_POST.slug}`}
                      className="transition-colors hover:text-brand-700 focus:outline-none focus-visible:text-brand-700"
                    >
                      {FEATURED_POST.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {FEATURED_POST.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <Link
                      to={`/blog/${FEATURED_POST.slug}`}
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                    >
                      Read the story
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </Link>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      The Journal · Vol. 01
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="latest"
          aria-label="Latest blog posts"
          className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fafb_0%,#ffffff_48%,#f4f9ff_100%)] px-4 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        >
          <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-brand-200/30 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 bottom-16 h-96 w-96 rounded-full bg-aqua-200/35 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl">
            <div
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
              data-reveal
              data-reveal-delay="80"
            >
              <div
                className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="group"
                aria-label="Filter blog posts by topic"
              >
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter

                  return (
                    <button
                      key={filter}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
                        active
                          ? 'border-brand-700 bg-brand-700 text-white shadow-[0_10px_24px_-14px_rgba(4,123,233,0.8)]'
                          : 'border-slate-200 bg-white/80 text-slate-600 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-800',
                      )}
                    >
                      {filter}
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                          active ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700',
                        )}
                      >
                        {countFor(filter)}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p
                aria-live="polite"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                Showing {visiblePosts.length} {visiblePosts.length === 1 ? 'story' : 'stories'}
              </p>
            </div>

            {visiblePosts.length > 0 ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[2rem] border border-brand-100 bg-white/80 px-6 py-14 text-center">
                <BookOpen className="mx-auto text-brand-500" size={28} />
                <p className="mt-4 font-display text-2xl text-slate-900">More stories coming soon.</p>
                <p className="mt-2 text-sm text-slate-600">
                  Try another topic, or browse the complete journal archive.
                </p>
                <a
                  href={BLOG_HOME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700"
                >
                  Visit the full blog <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </div>
        </section>

        <section
          id="watch"
          aria-labelledby="watch-title"
          className="relative isolate overflow-hidden bg-brand-950 px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_0%,rgba(4,123,233,0.28),transparent_44%),radial-gradient(ellipse_at_94%_100%,rgba(111,210,46,0.16),transparent_40%)]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/[0.06]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-36 h-44 w-44 rounded-full border border-white/[0.08]"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10" data-reveal>
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-aqua-300">
                  <YouTubeIcon size={14} /> Watch &amp; move
                </div>
                <h2
                  id="watch-title"
                  className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl lg:text-[3.15rem]"
                >
                  Wellness worth
                  <span className="italic text-aqua-300"> pressing play for.</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  Quick, practical videos from our studio floor — movement tips, honest
                  myth-busting and real member stories.
                </p>
              </div>

              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-bold text-brand-950 shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Subscribe on YouTube
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-950 text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={17} />
                </span>
              </a>
            </div>

            <div
              className="-mx-4 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
              data-reveal
              data-reveal-delay="100"
            >
              {STUDIO_VIDEOS.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Play ${video.title}`}
                  className="group relative aspect-[9/13] w-[74%] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900 text-left shadow-2xl shadow-black/25 transition duration-500 hover:-translate-y-1 hover:border-aqua-400/60 hover:shadow-aqua-400/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-aqua-300/40 sm:w-auto"
                >
                  <img
                    src={video.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/15 to-brand-950/35" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    <span className="rounded-full border border-white/20 bg-brand-950/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-white backdrop-blur-md">
                      {video.tag}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md">
                      <YouTubeIcon size={14} />
                    </span>
                  </div>

                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/95 text-brand-800 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-aqua-400 group-hover:text-brand-950">
                    <Play size={21} fill="currentColor" className="ml-0.5" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-aqua-300">
                      Studio short · {video.views}
                    </p>
                    <h3 className="mt-1.5 font-display text-[1.25rem] leading-snug text-white">
                      {video.cardTitle}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:hidden">
              Swipe to explore
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/40 blur-[120px]" />

          <div
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-brand-100/80 bg-gradient-to-br from-brand-50/80 via-white to-aqua-50/80 px-6 py-10 text-center shadow-[0_28px_80px_-52px_rgba(9,39,71,0.3)] sm:rounded-[2.75rem] sm:px-10 sm:py-12 lg:px-14"
            data-reveal
          >
            <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-aqua-200/45 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-brand-700 shadow-sm">
                <Flower2 size={14} /> Your next chapter
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                The best story is the one you
                <span className="italic text-gradient"> live next.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Come for a class, meet the team, or start with a simple conversation. However you
                want to move, there is a place for you here.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact?interest=Membership%20enquiry"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_-16px_rgba(4,123,233,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                >
                  Start your journey
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3.5 text-sm font-bold text-brand-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                >
                  <YouTubeIcon size={18} /> More from the studio
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      <AnimatePresence>
        {activeVideo && <VideoDialog video={activeVideo} onClose={closeVideo} />}
      </AnimatePresence>
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_-38px_rgba(9,39,71,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_28px_62px_-34px_rgba(4,123,233,0.3)]">
      <Link
        to={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-500/25"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-50">
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent opacity-80" />
          <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-aqua-400 text-brand-950 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={12} className="text-brand-600" />
              {formatBlogDate(post.date)}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={12} className="text-brand-600" />
              {post.readTime} min read
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 font-display text-[1.35rem] leading-snug text-slate-900 transition-colors duration-300 group-hover:text-brand-700">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-brand-700">
              Read article
            </span>
            <ArrowRight
              size={16}
              className="text-brand-600 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </article>
  )
}

function VideoDialog({ video, onClose }: { video: StudioVideo; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lastFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe',
        ),
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      lastFocused?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-brand-950/85 backdrop-blur-md"
      />

      <div className="relative flex min-h-full items-center justify-center p-4">
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-dialog-title"
          className="relative z-10 flex w-full max-w-[25rem] flex-col items-center"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex w-full items-start justify-between gap-4 text-white">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-aqua-300">
                Now playing · {video.tag}
              </p>
              <h2 id="video-dialog-title" className="mt-1 font-display text-xl leading-snug">
                {video.title}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <X size={19} />
            </button>
          </div>

          <div className="aspect-[9/16] h-[min(68dvh,600px)] max-h-[68dvh] overflow-hidden rounded-[1.6rem] border border-white/15 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>

          <div className="mt-3 flex w-full items-center justify-between gap-3 text-[11px] text-white/60">
            <span>{video.views}</span>
            <a
              href={`https://www.youtube.com/shorts/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:text-white"
            >
              Open in YouTube <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
