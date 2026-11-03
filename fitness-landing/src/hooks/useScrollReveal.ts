import { useEffect } from 'react'

/**
 * Adds a subtle fade-up reveal to any element marked with `data-reveal`.
 * Elements are observed once and revealed when they enter the viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    elements.forEach((element) => {
      element.classList.add('reveal')
      const delay = Number(element.dataset.revealDelay ?? 0)
      if (delay > 0) {
        element.style.setProperty('--reveal-delay', `${delay}ms`)
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
