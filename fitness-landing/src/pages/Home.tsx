import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Programs from '@/sections/Programs'
import WhyChooseUs from '@/sections/WhyChooseUs'
import Statistics from '@/sections/Statistics'
import Membership from '@/sections/Membership'
import Wellness from '@/sections/Wellness'
import Testimonials from '@/sections/Testimonials'
import HomeContact from '@/sections/HomeContact'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Home() {
  useScrollReveal()
  const navigate = useNavigate()

  const handleEnquire = (interest: string) => {
    navigate(`/contact?interest=${encodeURIComponent(interest)}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        Skip to content
      </a>
      <Header onJoin={() => handleEnquire('Membership enquiry')} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero onStart={() => handleEnquire('Membership enquiry')} />
        <About />
        <Programs />
        <WhyChooseUs />
        <Statistics />
        <Membership onEnquire={handleEnquire} />
        <Wellness />
        <Testimonials />
        <HomeContact />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
