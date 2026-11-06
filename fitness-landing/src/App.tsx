import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
