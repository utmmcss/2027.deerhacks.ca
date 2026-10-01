import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'

import { Github, HardHat, Instagram, Linkedin } from 'lucide-react'

import Starfield from './Starfield'

// Same deer constellation as the 2026 hero, nudged down to make room for the crane.
const DEER_OFFSET_Y = 40

const points = [
  // Left antler
  { x: 80, y: 25, size: 3.5 },
  { x: 95, y: 45, size: 3 },
  { x: 110, y: 65, size: 2.5 },
  { x: 70, y: 50, size: 2.5 },
  { x: 55, y: 38, size: 3 },
  // Right antler
  { x: 220, y: 25, size: 3.5 },
  { x: 205, y: 45, size: 3 },
  { x: 190, y: 65, size: 2.5 },
  { x: 230, y: 50, size: 2.5 },
  { x: 245, y: 38, size: 3 },
  // Head
  { x: 130, y: 82, size: 3 },
  { x: 150, y: 72, size: 4 },
  { x: 170, y: 82, size: 3 },
  // Eyes
  { x: 135, y: 95, size: 3.5 },
  { x: 165, y: 95, size: 3.5 },
  // Neck / body
  { x: 125, y: 115, size: 3 },
  { x: 175, y: 115, size: 3 },
  { x: 150, y: 145, size: 4.5 },
  { x: 115, y: 138, size: 2.5 },
  { x: 185, y: 138, size: 2.5 },
  { x: 130, y: 165, size: 3 },
  { x: 170, y: 165, size: 3 },
  { x: 150, y: 180, size: 3.5 },
].map((p) => ({ ...p, y: p.y + DEER_OFFSET_Y }))

const connections: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [5, 6],
  [6, 7],
  [6, 8],
  [8, 9],
  [2, 10],
  [7, 12],
  [10, 11],
  [11, 12],
  [10, 13],
  [12, 14],
  [10, 15],
  [12, 16],
  [13, 15],
  [14, 16],
  [15, 17],
  [16, 17],
  [15, 18],
  [16, 19],
  [18, 20],
  [19, 21],
  [20, 22],
  [21, 22],
  [17, 22],
]

const statusMessages = [
  'Polishing antlers...',
  'Aligning the stars...',
  'Teaching the deer to code...',
  'Refilling the coffee nebula...',
  'Untangling constellation wires...',
  'Debugging the night sky...',
  'Waiting on npm install...',
  'Recruiting more fawns...',
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/deerhacks', label: 'Instagram' },
  { icon: Github, href: 'https://github.com/utmmcss', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/deerhacks', label: 'LinkedIn' },
]

// Builds a zigzag truss path between two parallel rails
const truss = (
  from: number,
  to: number,
  railA: number,
  railB: number,
  step: number,
  horizontal: boolean,
) => {
  let d = ''
  let onA = true
  for (let t = from; t <= to; t += step) {
    const r = onA ? railA : railB
    const [x, y] = horizontal ? [t, r] : [r, t]
    d += `${d ? 'L' : 'M'}${x} ${y} `
    onA = !onA
  }
  return d
}

const GOLD = 'hsl(42 100% 65%)'
const GOLD_DIM = 'hsl(42 90% 55% / 0.55)'
const CONE = 'hsl(24 100% 55%)'

const ConstructionScene = () => {
  const hookX = points[0].x
  const hangingStarY = 50

  return (
    <svg viewBox="0 -20 420 260" className="w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="uc-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(42 100% 70%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(42 90% 55%)" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="uc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(42 100% 85%)" stopOpacity="0.8" />
          <stop offset="40%" stopColor="hsl(42 100% 65%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(42 100% 55%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="uc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45 100% 98%)" />
          <stop offset="70%" stopColor="hsl(42 100% 90%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(42 100% 75%)" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id="uc-hat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(48 100% 70%)" />
          <stop offset="100%" stopColor="hsl(38 100% 50%)" />
        </linearGradient>
      </defs>

      {/* ---------- Tower crane ---------- */}
      <g stroke={GOLD_DIM} strokeWidth="1.2" fill="none" strokeLinejoin="round">
        {/* Mast */}
        <path d="M330 14 V228 M346 14 V228" />
        <path d={truss(14, 228, 330, 346, 12, false)} />
        {/* Jib + counter-jib */}
        <path d="M50 6 H404 M50 14 H404" />
        <path d={truss(50, 404, 6, 14, 12, true)} />
        {/* Apex + pendant lines */}
        <path d="M330 6 L338 -14 L346 6" />
        <path d="M338 -14 L120 6 M338 -14 L404 6" strokeDasharray="2 3" />
      </g>
      {/* Cab + counterweight */}
      <rect
        x="318"
        y="16"
        width="22"
        height="14"
        rx="2"
        fill="hsl(222 40% 12%)"
        stroke={GOLD}
        strokeWidth="1"
      />
      <rect x="322" y="19" width="8" height="6" rx="1" fill="hsl(45 100% 85% / 0.6)" />
      <rect
        x="380"
        y="14"
        width="22"
        height="16"
        rx="1.5"
        fill="hsl(222 35% 15%)"
        stroke={GOLD_DIM}
      />
      <text
        x="391"
        y="25"
        textAnchor="middle"
        fontSize="6"
        fill={GOLD}
        fontFamily="Space Grotesk, sans-serif"
      >
        DH
      </text>
      {/* Trolley */}
      <rect
        x={hookX - 8}
        y="8"
        width="16"
        height="7"
        rx="1.5"
        fill="hsl(222 35% 15%)"
        stroke={GOLD}
        strokeWidth="1"
      />

      {/* Swinging cable + hook, carrying a decorative star */}
      <g className="uc-swing" style={{ transformOrigin: `${hookX}px 15px` }}>
        <line x1={hookX} y1="15" x2={hookX} y2="36" stroke={GOLD} strokeWidth="1" />
        <path
          d={`M${hookX} 36 v5 a3.5 3.5 0 1 1 -3.5 3.5`}
          stroke={GOLD}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <g>
          <line
            x1={hookX - 3.5}
            y1="44.5"
            x2={hookX}
            y2={hangingStarY}
            stroke={GOLD_DIM}
            strokeWidth="0.8"
          />
          <line
            x1={hookX + 3.5}
            y1="44.5"
            x2={hookX}
            y2={hangingStarY}
            stroke={GOLD_DIM}
            strokeWidth="0.8"
          />
          <circle cx={hookX} cy={hangingStarY} r={points[0].size * 5} fill="url(#uc-glow)" />
          <circle cx={hookX} cy={hangingStarY} r={points[0].size} fill="url(#uc-core)" />
        </g>
      </g>

      {/* ---------- Deer constellation: a steady figure outline ---------- */}
      <g className="uc-bob">
        {/* Connecting lines form the deer's outline */}
        <g>
          {connections.map(([from, to], i) => (
            <line
              key={`l-${i}`}
              x1={points[from].x}
              y1={points[from].y}
              x2={points[to].x}
              y2={points[to].y}
              stroke="url(#uc-line)"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Stars sit steadily on the outline (no twinkle / flicker) */}
        {points.map((p, i) => (
          <g key={`s-${i}`}>
            <circle cx={p.x} cy={p.y} r={p.size * 4} fill="url(#uc-glow)" opacity="0.9" />
            <circle cx={p.x} cy={p.y} r={p.size} fill="url(#uc-core)" />
          </g>
        ))}

        {/* Hard hat, sitting just above the top-of-head star */}
        <g transform={`translate(0 ${DEER_OFFSET_Y})`}>
          <path
            d="M128 66 A22 20 0 0 1 172 66 Z"
            fill="url(#uc-hat)"
            stroke="hsl(38 100% 40%)"
            strokeWidth="0.8"
          />
          <path d="M150 47 V66" stroke="hsl(38 100% 42%)" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M120 67.5 H180"
            stroke="hsl(40 100% 52%)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="139" cy="56" r="2" fill="hsl(45 100% 95% / 0.7)" />
        </g>
      </g>

      {/* ---------- Ground + cones ---------- */}
      <line
        x1="0"
        y1="228"
        x2="420"
        y2="228"
        stroke={GOLD_DIM}
        strokeDasharray="6 5"
        strokeWidth="1"
      />
      {[30, 268].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 9} 228 L${cx} 204 L${cx + 9} 228 Z`} fill={CONE} />
          <path d={`M${cx - 5.2} 218 H${cx + 5.2}`} stroke="hsl(45 100% 96%)" strokeWidth="3" />
          <rect x={cx - 12} y="226" width="24" height="3" rx="1" fill="hsl(24 90% 42%)" />
        </g>
      ))}
    </svg>
  )
}

const CautionTape = ({ tilt, reverse }: { tilt: string; reverse?: boolean }) => (
  <div
    className="relative z-20 w-[110%] -ml-[5%] py-2 shadow-lg"
    style={{
      transform: `rotate(${tilt})`,
      background:
        'repeating-linear-gradient(-45deg, hsl(42 100% 55%) 0 22px, hsl(222 47% 6%) 22px 44px)',
    }}
    aria-hidden="true"
  >
    <div className="bg-primary/95 py-1">
      <Marquee speed={40} direction={reverse ? 'right' : 'left'} autoFill>
        <span className="mx-6 font-display font-bold tracking-[0.2em] text-sm text-primary-foreground uppercase">
          Under construction ✦ DeerHacks 2027 ✦ Hard hats required ✦ Antlers at work ✦
        </span>
      </Marquee>
    </div>
  </div>
)

const UnderConstruction = () => {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setMessageIndex((i) => (i + 1) % statusMessages.length),
      2800,
    )
    return () => window.clearInterval(id)
  }, [])

  const statusText = statusMessages[messageIndex]

  return (
    <main className="celestial-theme relative min-h-screen bg-background overflow-hidden flex flex-col">
      <Starfield />

      {/* Background atmosphere (matches the 2026 hero) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.25]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--nebula-purple)) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[900px] h-[900px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
        />
      </div>

      <div className="pt-6">
        <CautionTape tilt="-1.5deg" />
      </div>

      <section className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          <HardHat className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-primary">Work in progress</span>
        </div>

        <h1
          className="m-0 text-5xl sm:text-6xl md:text-7xl font-display font-bold opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="text-gradient">DeerHacks 2027</span>
        </h1>
        <p
          className="mt-3 mb-2 text-lg sm:text-xl md:text-2xl font-display font-light text-foreground/90 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          More coming soon
        </p>

        {/* Decorative construction scene */}
        <div
          className="relative my-4 w-full max-w-[560px] aspect-[420/260] opacity-0 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="absolute inset-[15%] bg-primary/15 rounded-full blur-[60px] pointer-events-none" />
          <ConstructionScene />
        </div>

        {/* Rotating status message */}
        <div
          className="w-full max-w-md opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <p
            key={statusText}
            className="h-6 mb-3 font-display text-primary animate-fade-in"
            aria-live="polite"
          >
            {statusText}
          </p>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            We&apos;re putting together something new for UTM&apos;s premier hackathon. Follow us
            for dates, applications, and sneak peeks.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              aria-label={`DeerHacks on ${social.label}`}
            >
              <social.icon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <div className="pb-8">
        <CautionTape tilt="1.5deg" reverse />
      </div>

      <p className="relative z-10 text-center text-xs text-muted-foreground pb-6 m-0">
        (c) 2027 DeerHacks. Made with ♥️ at UTM.
      </p>
    </main>
  )
}

export default UnderConstruction
