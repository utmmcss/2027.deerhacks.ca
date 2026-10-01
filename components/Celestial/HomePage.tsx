import dynamic from 'next/dynamic'

import AboutSection from '@/components/Celestial/AboutSection'
import Footer from '@/components/Celestial/Footer'
import HeroSection from '@/components/Celestial/HeroSection'
import Starfield from '@/components/Celestial/Starfield'
import Navbar from '@/components/Shared/Navbar'

// Lazy load non-critical sections that are below the fold
const SponsorsSection = dynamic(() => import('@/components/Celestial/SponsorsSection'), {
  loading: () => <div className="min-h-[400px]" />,
})
const FAQSection = dynamic(() => import('@/components/Celestial/FAQSection'), {
  loading: () => <div className="min-h-[400px]" />,
})

const HomePage = () => {
  return (
    <main className="celestial-theme relative min-h-screen bg-background overflow-x-hidden">
      <Starfield />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SponsorsSection />
      <FAQSection />
      <Footer />
    </main>
  )
}

export default HomePage
