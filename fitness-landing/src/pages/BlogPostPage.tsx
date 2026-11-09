import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Flower2,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { FacebookIcon } from '@/components/SocialIcons'
import { BLOG_POSTS, formatBlogDate, type BlogPost } from '@/data/blog'
import { BLOG_CONTENT } from '@/data/blogContent'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import heroImage from '@/assets/hero-gym.webp'

const SITE_TITLE = "Her Space Studio | Women's Fitness Studio in Kelambakkam, Chennai"

type Heading = {
  id: string
  text: string
  level: number
}

function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)

  return slug || 'section'
}

/**
 * Adds stable anchor ids to article headings and returns a small table of contents.
 * The content itself is trusted, first-party HTML from the Her Space blog feed.
 */
function prepareArticle(raw: string): { html: string; headings: Heading[] } {
  if (!raw) return { html: '', headings: [] }

  const documentNode = new DOMParser().parseFromString(raw, 'text/html')
  const used = new Map<string, number>()
  const headings: Heading[] = []

  documentNode.querySelectorAll('h2, h3').forEach((element) => {
    const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    if (!text) return

    const base = slugifyHeading(text)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`

    element.setAttribute('id', id)
    headings.push({ id, text, level: Number(element.tagName.slice(1)) })
  })

  documentNode.querySelectorAll('figure').forEach((figure) => {
    const hint = documentNode.createElement('p')
    hint.className = 'article-table-hint'
    hint.textContent = 'Swipe to see the full table →'
    figure.before(hint)
  })

  return { html: documentNode.body.innerHTML, headings }
}

function TableOfContents({ headings, compact = false }: { headings: Heading[]; compact?: boolean }) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page">
      <ol className={compact ? 'grid gap-1.5 sm:grid-cols-2' : 'space-y-1'}>
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="group flex items-start gap-2.5 rounded-xl px-2 py-1.5 text-sm leading-snug text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            >
              <span className="mt-0.5 text-[10px] font-bold tabular-nums text-brand-400 transition-colors group-hover:text-brand-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_-40px_rgba(9,39,71,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_28px_60px_-34px_rgba(4,123,233,0.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-50">
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{post.category}</span>
          <span>{formatBlogDate(post.date)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-display text-xl leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
          {post.title}
        </h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-brand-700">
          Read story
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export default function BlogPostPage() {
  useScrollReveal()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | null>(null)

  const post = useMemo(() => BLOG_POSTS.find((item) => item.slug === slug), [slug])
  const content = post ? BLOG_CONTENT[post.slug] : ''
  const article = useMemo(() => prepareArticle(content ?? ''), [content])

  const tocHeadings = useMemo(
    () => article.headings.filter((heading) => heading.level === 2),
    [article.headings],
  )

  const related = useMemo(() => {
    if (!post) return []

    const others = BLOG_POSTS.filter((item) => item.slug !== post.slug)
    const sameCategory = others.filter((item) => item.category === post.category)
    const rest = others.filter((item) => item.category !== post.category)

    return [...sameCategory, ...rest].slice(0, 3)
  }, [post])

  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | Her Space Journal`
    return () => {
      document.title = SITE_TITLE
    }
  }, [post])

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [slug])

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    },
    [],
  )

  const handleCopy = useCallback(async () => {
    const url = window.location.href

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      document.body.removeChild(field)
    }

    setCopied(true)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200)
  }, [])

  if (!post || !article.html) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header onJoin={() => navigate('/contact?interest=Membership%20enquiry')} />
        <main className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_100%)] px-5 py-20">
          <div className="w-full max-w-lg text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <BookOpen size={25} />
            </span>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700">
              The her space journal
            </p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">
              This story is not
              <span className="italic text-gradient"> on the shelf.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-600">
              The article you are looking for may have moved. Browse the journal for our latest
              reads instead.
            </p>
            <Link to="/blog" className="btn-primary mt-7">
              <ArrowLeft size={17} /> Back to the journal
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const articleUrl = typeof window === 'undefined' ? post.href : window.location.href
  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedShare = encodeURIComponent(`${post.title} — ${articleUrl}`)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
        <div
          className="h-full origin-left bg-gradient-to-r from-aqua-400 via-aqua-300 to-brand-400 transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>

      <Header onJoin={() => navigate('/contact?interest=Membership%20enquiry')} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <article>
          <section className="relative isolate overflow-hidden bg-brand-950 text-white">
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[86%_46%] opacity-35 saturate-[0.8] sm:object-[70%_center] sm:opacity-35 lg:object-[64%_center] lg:opacity-40"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(9,39,71,0.99)_0%,rgba(9,39,71,0.94)_48%,rgba(7,61,115,0.68)_100%)]" />
            <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-500/20 blur-[110px]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-aqua-500/20 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-transform duration-300 group-hover:-translate-x-0.5">
                  <ArrowLeft size={15} />
                </span>
                Back to the journal
              </Link>

              <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-white/60">
                    <span className="rounded-full border border-aqua-300/30 bg-aqua-400/10 px-3 py-1.5 text-aqua-200">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-aqua-300" />
                      {formatBlogDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} className="text-aqua-300" />
                      {post.readTime} min read
                    </span>
                  </div>

                  <h1 className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.2rem,4.6vw,3.7rem)] leading-[1.07] tracking-[-0.03em] text-white">
                    {post.title}
                  </h1>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                    {post.excerpt}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    <span className="inline-flex items-center gap-2">
                      <Flower2 size={14} className="text-aqua-300" /> By the Her Space team
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/25" />
                    <span>By women, for women</span>
                  </div>
                </div>

                <figure className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-3 rotate-[2deg] rounded-[2.1rem] border border-white/10 bg-white/[0.045]"
                  />
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-white/30 bg-white shadow-[0_35px_90px_-35px_rgba(0,0,0,0.75)]">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      fetchPriority="high"
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/20 via-transparent to-transparent" />
                  </div>
                  <span className="absolute -bottom-3 left-5 inline-flex items-center gap-2 rounded-full bg-aqua-400 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-brand-950 shadow-lg">
                    <Sparkles size={13} /> A Her Space read
                  </span>
                </figure>
              </div>
            </div>
          </section>

          <section className="relative overflow-x-clip bg-[linear-gradient(180deg,#f1f8ff_0%,#ffffff_22%,#ffffff_78%,#f5faff_100%)] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <div className="pointer-events-none absolute -left-28 top-40 h-80 w-80 rounded-full bg-brand-200/25 blur-[120px]" />
            <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-aqua-200/30 blur-[130px]" />

            <div className="relative mx-auto max-w-6xl">
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="mx-auto w-full min-w-0 max-w-3xl lg:mx-0 lg:max-w-none">
                  {tocHeadings.length > 0 && (
                    <details className="group mb-5 rounded-[1.4rem] border border-brand-100 bg-white/90 px-4 py-3 shadow-sm lg:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                        <span className="inline-flex items-center gap-2">
                          <BookOpen size={16} className="text-brand-600" /> In this story
                        </span>
                        <ChevronDown size={17} className="text-brand-600 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <TableOfContents headings={tocHeadings} compact />
                      </div>
                    </details>
                  )}

                  <div className="rounded-[2rem] border border-white bg-white/95 p-5 shadow-[0_28px_80px_-52px_rgba(9,39,71,0.35)] sm:p-8 lg:p-10">
                    <div
                      className="article-prose"
                      dangerouslySetInnerHTML={{ __html: article.html }}
                    />

                    <div className="mt-10 flex flex-col gap-5 border-t border-slate-200/80 pt-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Filed under
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-brand-700">
                          {post.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                        >
                          {copied ? <Check size={15} className="text-aqua-600" /> : <Copy size={15} />}
                          <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodedShare}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share this story on WhatsApp"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-aqua-300 hover:text-aqua-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                        >
                          <MessageCircle size={17} />
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share this story on Facebook"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                        >
                          <FacebookIcon size={17} />
                        </a>
                      </div>
                    </div>

                    <p className="mt-5 text-[11px] leading-5 text-slate-400">
                      Originally published in the{' '}
                      <a
                        href={post.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-brand-700"
                      >
                        Her Space journal
                      </a>
                      . Content has been formatted for this reader.
                    </p>
                  </div>
                </div>

                <aside className="hidden lg:block">
                  <div className="sticky top-24 space-y-5">
                    {tocHeadings.length > 0 && (
                      <div className="rounded-[1.6rem] border border-brand-100 bg-white/90 p-5 shadow-[0_18px_50px_-40px_rgba(9,39,71,0.3)]">
                        <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                          <BookOpen size={14} /> In this story
                        </p>
                        <div className="mt-3 max-h-[52vh] overflow-y-auto pr-1">
                          <TableOfContents headings={tocHeadings} />
                        </div>
                      </div>
                    )}

                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="related-title"
            className="relative overflow-hidden bg-white px-4 pb-14 pt-4 sm:px-8 sm:pb-18 lg:px-10"
          >
            <div className="relative mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    <BookOpen size={13} /> Keep reading
                  </span>
                  <h2
                    id="related-title"
                    className="mt-3 font-display text-3xl leading-tight text-slate-900 sm:text-4xl"
                  >
                    More from the <span className="italic text-gradient">journal.</span>
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                >
                  All stories
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
                {related.map((item) => (
                  <RelatedCard key={item.slug} post={item} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] bg-brand-950 px-6 py-10 text-center text-white shadow-[0_30px_80px_-50px_rgba(9,39,71,0.7)] sm:rounded-[2.75rem] sm:px-10 sm:py-14">
              <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-aqua-500/20 blur-3xl" />

              <div className="relative mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-aqua-300">
                  <Flower2 size={14} /> Your next chapter
                </span>
                <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  Reading is a start.
                  <span className="italic text-aqua-300"> Moving is the next step.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Come for a class, meet the team, or simply talk through what would feel good for
                  you. There is a place for you here.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/contact?interest=Membership%20enquiry"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-3.5 text-sm font-bold text-brand-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                  >
                    Start your journey
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                  >
                    <BookOpen size={17} /> Browse the journal
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
