import Head from 'next/head'
import { ReactNode } from 'react'

import Navbar from '@/components/Shared/Navbar'

import Footer from './Footer'
import Starfield from './Starfield'

type Props = {
  children: ReactNode
  title: string
  showFooter?: boolean
}

const CelestialLayout = ({ children, title, showFooter = true }: Props) => {
  return (
    <>
      <Head>
        <title>{title} | DeerHacks</title>
      </Head>
      <main className="celestial-theme relative min-h-screen bg-background overflow-x-hidden">
        <Starfield />

        {/* Hero gradient background - Optimized nebula effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div style={{ background: 'var(--gradient-hero)', height: '100%' }} />
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute top-1/4 left-[10%] w-[500px] h-[500px] rounded-full" 
              style={{ background: 'radial-gradient(circle, var(--nebula-purple) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute bottom-1/3 right-[15%] w-[400px] h-[400px] rounded-full" 
              style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />
          </div>
        </div>

        <Navbar />

        <div className="relative z-10 pb-16 min-h-screen">
          {children}
        </div>

        {showFooter && <Footer />}
      </main>
    </>
  )
}

export default CelestialLayout
