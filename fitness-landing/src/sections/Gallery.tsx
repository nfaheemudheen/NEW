import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { GALLERY } from '@/data/gallery'

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const isOpen = activeIndex !== null
  const current = activeIndex === null ? null : GALLERY[activeIndex]
  const position = activeIndex === null ? 0 : activeIndex + 1

  const close = () => {
    setActiveIndex(null)
    lastFocused.current?.focus()
  }

  const showPrevious = () => {
    setActiveIndex((index) =>
      index === null ? index : (index - 1 + GALLERY.length) % GALLERY.length,
    )
  }

  const showNext = () => {
    setActiveIndex((index) => (index === null ? index : (index + 1) % GALLERY.length))
  }

  useEffect(() => {
    if (!isOpen) return

    lastFocused.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button'),
      ).filter((element) => !element.hasAttribute('disabled'))

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
    // The handlers only use functional state updates and refs, so opening once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <section id="gallery" className="section bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Inside the studio"
          title={
            <>
              A little look
              <br />
              <span className="italic text-gradient">around Her Space.</span>
            </>
          }
          description="Sunlit corners, shared sweat and the small moments between sets. This is what a women-only studio feels like."
        />

        <div
          className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-3 lg:auto-rows-[190px] lg:grid-cols-4"
          data-reveal
          data-reveal-delay="80"
        >
          {GALLERY.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open image: ${item.caption}`}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 ${item.className}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/5 to-transparent opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />
              <span className="absolute bottom-4 left-4 right-10 text-xs font-semibold text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                {item.caption}
              </span>
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/90 text-brand-800 shadow-sm opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                <Maximize2 size={15} />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Sample imagery for development.
        </p>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm sm:p-8"
          role="presentation"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${position} of ${GALLERY.length}: ${current.caption}`}
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[72vh] w-full object-contain"
              />

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-white transition-colors hover:bg-slate-950/85 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                <X size={18} />
              </button>

              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/60 text-white transition-colors hover:bg-slate-950/85 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:left-3 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/60 text-white transition-colors hover:bg-slate-950/85 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:right-3 sm:h-11 sm:w-11"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 px-1 text-white">
              <p className="text-sm font-medium">{current.caption}</p>
              <p className="shrink-0 text-xs text-white/60">
                {position} / {GALLERY.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
