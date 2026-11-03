import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import exerciseCutout from '@/assets/exercise-cutout.webp'

type ImageRect = {
  x: number
  y: number
  width: number
  height: number
}

type Targets = {
  hero: ImageRect
  about: ImageRect
}

const EMPTY_RECT: ImageRect = { x: 0, y: 0, width: 0, height: 0 }

function readTargets(): Targets | null {
  const hero = document.querySelector<HTMLElement>('[data-journey-image="hero"]')
  const about = document.querySelector<HTMLElement>('[data-journey-image="about"]')
  if (!hero || !about) return null

  const readRect = (element: HTMLElement): ImageRect => {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    }
  }

  return { hero: readRect(hero), about: readRect(about) }
}

export default function SharedJourneyImage() {
  const [targets, setTargets] = useState<Targets | null>(null)
  const scrollY = useMotionValue(0)
  const hero = targets?.hero ?? EMPTY_RECT
  const about = targets?.about ?? EMPTY_RECT
  const startScroll = hero.y - 112
  const endScroll = Math.max(startScroll + 1, about.y - 112)
  const progress = useTransform(scrollY, [startScroll, endScroll], [0, 1])

  const imageWidth = Math.min(hero.width, about.width)
  const imageHeight = Math.min(hero.height, about.height)
  const heroX = hero.x + (hero.width - imageWidth) / 2
  const aboutX = about.x + (about.width - imageWidth) / 2
  const x = useTransform(progress, (value) => heroX + (aboutX - heroX) * value)
  const y = useTransform(
    [progress, scrollY],
    ([value, currentScroll]) => {
      const p = value as number
      const scroll = currentScroll as number
      return hero.y + (about.y - hero.y) * p - scroll
    },
  )

  useEffect(() => {
    const updateScroll = () => scrollY.set(window.scrollY)
    const updateTargets = () => {
      const nextTargets = readTargets()
      if (!nextTargets) return
      setTargets((current) => {
        if (
          current &&
          (['hero', 'about'] as const).every((key) =>
            (['x', 'y', 'width', 'height'] as const).every(
              (field) => Math.abs(current[key][field] - nextTargets[key][field]) < 0.5,
            ),
          )
        ) {
          return current
        }
        return nextTargets
      })
    }
    const updateLayout = () => {
      updateScroll()
      updateTargets()
    }

    updateLayout()
    window.addEventListener('scroll', updateLayout, { passive: true })
    window.addEventListener('resize', updateLayout)
    const observer = new ResizeObserver(updateTargets)
    observer.observe(document.querySelector('main') ?? document.body)

    return () => {
      window.removeEventListener('scroll', updateLayout)
      window.removeEventListener('resize', updateLayout)
      observer.disconnect()
    }
  }, [scrollY])

  return (
    <motion.img
      src={exerciseCutout}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 block object-contain"
      style={{ x, y, width: imageWidth, height: imageHeight, opacity: targets ? 1 : 0 }}
    />
  )
}
