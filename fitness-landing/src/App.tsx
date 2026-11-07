import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Home from '@/pages/Home'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import FaqPage from '@/pages/FaqPage'
import DietPlansPage from '@/pages/DietPlansPage'
import ServicesPage, { ServicesClassPage } from '@/pages/ServicesPage'
import StaffLogin from '@/pages/StaffLogin'
import StaffDashboard from '@/pages/StaffDashboard'
import NotFound from '@/pages/NotFound'
import AmbientBackground from '@/components/AmbientBackground'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }
      })
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

function SiteIntro() {
  const [visible, setVisible] = useState(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), reduceMotion ? 450 : 1650)
    return () => window.clearTimeout(timeout)
  }, [reduceMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.025 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Her Space Fitness Studio loading"
          role="status"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(4,123,233,0.12),transparent_35%),radial-gradient(circle_at_75%_65%,rgba(56,183,7,0.13),transparent_35%)]" />
          <motion.div
            className="relative flex flex-col items-center px-6 text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="absolute top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-brand-200/80 sm:h-44 sm:w-44"
              animate={reduceMotion ? undefined : { scale: [0.92, 1.12, 0.92], opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <motion.img
              src="/logo2.png"
              alt="Her Space Fitness Studio"
              className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_15px_28px_rgba(4,79,150,0.18)] sm:h-40 sm:w-40"
              animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, -1.5, 1.5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl">
              Her Space
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-700 sm:text-xs">
              Move · Grow · Belong
            </p>
            <motion.span
              className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-aqua-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.25 }}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteIntro />
      <AmbientBackground />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/diet-plans" element={<DietPlansPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/offline" element={<ServicesClassPage mode="offline" />} />
          <Route path="/services/online" element={<ServicesClassPage mode="online" />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
