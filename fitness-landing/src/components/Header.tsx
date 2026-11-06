import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail, Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { NAV_LINKS, STUDIO } from '@/data/site'
import { cn } from '@/lib/utils'

const HEADER_LINKS = NAV_LINKS.filter(
  (link) => link.id !== 'membership' && link.id !== 'programs',
).flatMap((link) =>
  link.id === 'services'
    ? [link, { label: 'Diet Plans', id: 'diet-plans' }, { label: 'Blog', id: 'blog' }]
    : [link],
)

const BLOG_URL = 'https://herspacefitness.com/blog/'

type HeaderProps = {
  onJoin: () => void
}

export default function Header({ onJoin }: HeaderProps) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const reduceMotion = useReducedMotion()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      if (location.pathname !== '/') return

      const marker = window.scrollY + 120
      let current = 'home'

      for (const link of HEADER_LINKS) {
        if (link.id === 'about' || link.id === 'contact' || link.id === 'faqs' || link.id === 'blog') continue
        const section = document.getElementById(link.id)
        if (!section) continue
        const top = section.getBoundingClientRect().top + window.scrollY
        if (top <= marker) current = link.id
      }

      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstNavLink = menuRef.current?.querySelector<HTMLElement>('nav a[href]')
    const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    ;(firstNavLink ?? firstFocusable)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) return

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
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
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  const handleJoin = () => {
    setOpen(false)
    onJoin()
  }

  const navHref = (id: string) => {
    if (id === 'blog') return BLOG_URL
    if (id === 'about') return '/about'
    if (id === 'services') return '/services'
    if (id === 'diet-plans') return '/diet-plans'
    if (id === 'contact') return '/contact'
    if (id === 'faqs') return '/faqs'
    if (id === 'home') return '/'
    return location.pathname === '/' ? `#${id}` : `/#${id}`
  }
  const isNavActive = (id: string) => {
    if (id === 'blog') return false
    if (location.pathname === '/about') return id === 'about'
    if (location.pathname.startsWith('/services')) return id === 'services'
    if (location.pathname === '/diet-plans') return id === 'diet-plans'
    if (location.pathname === '/contact') return id === 'contact'
    if (location.pathname === '/faqs') return id === 'faqs'
    if (id === 'about' || id === 'contact' || id === 'faqs') return false
    return active === id
  }
  const navCurrent = (id: string) => {
    if (!isNavActive(id)) return undefined
    return (
      id === 'home' ||
      id === 'about' ||
      id === 'services' ||
      id === 'diet-plans' ||
      id === 'contact' ||
      id === 'faqs'
    )
      ? 'page'
      : 'location'
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-slate-200/80 bg-white/90 shadow-[0_8px_30px_-24px_rgba(36,53,45,0.35)] backdrop-blur-xl'
          : 'border-transparent bg-slate-50/80 backdrop-blur-md',
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <a
            href="/"
            onClick={() => setOpen(false)}
            className="group flex shrink-0 items-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
            aria-label="Her Space Fitness Studio home"
          >
            <img
              src="/logo2.png"
              alt="Her Space Fitness Studio"
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/55 p-1 shadow-sm backdrop-blur-sm lg:flex" aria-label="Main navigation">
            {HEADER_LINKS.map((link) => (
              <a
                key={link.id}
                href={navHref(link.id)}
                aria-current={navCurrent(link.id)}
                className={cn(
                  'group relative rounded-full px-3.5 py-2.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-brand-800 hover:shadow-[0_8px_18px_-12px_rgba(0,91,173,0.65)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-brand-600 after:to-aqua-500 after:transition-all after:duration-300 after:content-[\'\'] hover:after:w-1/2',
                  isNavActive(link.id) && 'bg-brand-50/90 text-brand-900 after:w-1/2',
                )}
                target={link.id === 'blog' ? '_blank' : undefined}
                rel={link.id === 'blog' ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={handleJoin}
              className="btn-primary group w-auto whitespace-nowrap px-5 py-2.5 text-base"
            >
              Join Now <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 top-[72px] z-30 cursor-default bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed right-0 top-[72px] z-40 flex h-[calc(100dvh-72px)] w-[86%] max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white px-6 pb-8 pt-6 shadow-2xl lg:hidden"
              initial={{ x: reduceMotion ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : '100%' }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700">
                  Explore Her Space
                </span>
              </div>

              <nav className="space-y-1" aria-label="Mobile navigation">
                {HEADER_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={navHref(link.id)}
                    onClick={() => setOpen(false)}
                    aria-current={navCurrent(link.id)}
                    className={cn(
                      'block rounded-2xl border border-transparent px-4 py-3.5 text-lg font-semibold text-slate-700 transition-all duration-200 hover:translate-x-1 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-800 hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15',
                      isNavActive(link.id) && 'border-brand-100 bg-brand-50 text-brand-900',
                    )}
                    target={link.id === 'blog' ? '_blank' : undefined}
                    rel={link.id === 'blog' ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <button type="button" onClick={handleJoin} className="btn-primary mt-6">
                Join Now <ArrowRight size={18} />
              </button>

              <div className="mt-8 space-y-3 border-t border-slate-100 pt-6 text-sm">
                <a
                  href={`mailto:${STUDIO.email}`}
                  className="flex items-center gap-3 rounded-xl px-1 py-1 text-slate-600 hover:text-brand-700"
                >
                  <Mail size={16} className="text-brand-600" /> {STUDIO.email}
                </a>
              </div>

              <p className="mt-auto pt-8 text-xs leading-relaxed text-slate-400">
                Women-only fitness studio · {STUDIO.address}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
