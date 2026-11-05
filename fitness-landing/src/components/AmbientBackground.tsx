import { useEffect, useRef } from 'react'

export default function AmbientBackground() {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const backdrop = backdropRef.current
    if (!backdrop) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const resetPosition = () => {
      backdrop.style.setProperty('--ambient-x', '0px')
      backdrop.style.setProperty('--ambient-y', '0px')
      backdrop.style.setProperty('--ambient-x-reverse', '0px')
      backdrop.style.setProperty('--ambient-y-reverse', '0px')
    }

    const followPointer = (event: PointerEvent) => {
      if (reduceMotion.matches || event.pointerType === 'touch') return

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = ((event.clientX / window.innerWidth) - 0.5) * 96
        const y = ((event.clientY / window.innerHeight) - 0.5) * 72
        backdrop.style.setProperty('--ambient-x', `${x}px`)
        backdrop.style.setProperty('--ambient-y', `${y}px`)
        backdrop.style.setProperty('--ambient-x-reverse', `${-x}px`)
        backdrop.style.setProperty('--ambient-y-reverse', `${-y}px`)
      })
    }

    window.addEventListener('pointermove', followPointer, { passive: true })
    window.addEventListener('blur', resetPosition)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', followPointer)
      window.removeEventListener('blur', resetPosition)
    }
  }, [])

  return (
    <div ref={backdropRef} className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-green" />
    </div>
  )
}
