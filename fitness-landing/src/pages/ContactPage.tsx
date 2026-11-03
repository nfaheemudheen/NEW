import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Contact from '@/sections/Contact'
import { ENQUIRY_INTERESTS } from '@/data/site'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ContactPage() {
  useScrollReveal()
  const [searchParams] = useSearchParams()
  const requestedInterest = searchParams.get('interest')
  const interest =
    requestedInterest && ENQUIRY_INTERESTS.includes(requestedInterest)
      ? requestedInterest
      : 'General enquiry'

  useEffect(() => {
    if (!requestedInterest || !ENQUIRY_INTERESTS.includes(requestedInterest)) return

    // Bring the form into view when someone arrives from a program or membership CTA.
    const timer = window.setTimeout(() => {
      const form = document.getElementById('enquiry-form')
      if (!form) return

      const top = form.getBoundingClientRect().top
      if (top >= 0 && top < window.innerHeight * 0.55) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }, 150)

    return () => window.clearTimeout(timer)
  }, [requestedInterest])

  const focusForm = () => {
    const form = document.getElementById('enquiry-form')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    form?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>
      <Header onJoin={focusForm} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Contact prefill={{ interest, key: 0 }} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
