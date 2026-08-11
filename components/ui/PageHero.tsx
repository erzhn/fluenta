'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export type HeroMotif =
  | 'waveform' | 'letters' | 'orbit' | 'grid'
  | 'pulse' | 'lines' | 'bars' | 'sparkle'

function Motif({ motif }: { motif: HeroMotif }) {
  switch (motif) {
    case 'waveform':
      return (
        <div className="ph-waveform" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i % 9) * 0.09}s` }} />
          ))}
        </div>
      )
    case 'bars':
      return (
        <div className="ph-bars" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.14}s` }} />
          ))}
        </div>
      )
    case 'letters': {
      const chars = ['Aa', 'Th', 'ing', 'Wh', 'ed', 'Qu', 'es']
      return (
        <div className="ph-letters" aria-hidden>
          {chars.map((c, i) => (
            <span key={i} style={{
              right: `${6 + i * 12}%`,
              top: `${12 + (i % 3) * 26}%`,
              fontSize: `${16 + (i % 3) * 9}px`,
              animationDelay: `${i * 0.55}s`,
            }}>{c}</span>
          ))}
        </div>
      )
    }
    case 'orbit':
      return (
        <div className="ph-orbit" aria-hidden>
          <span className="ph-orbit-ring"><em /><em /></span>
          <span className="ph-orbit-core" />
        </div>
      )
    case 'grid':
      return <div className="ph-grid" aria-hidden />
    case 'pulse':
      return (
        <div className="ph-pulse" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i} style={{ animationDelay: `${i * 1}s` }} />)}
        </div>
      )
    case 'lines':
      return (
        <div className="ph-lines" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ top: `${18 + i * 14}px`, width: `${140 - i * 22}px`, animationDelay: `${i * 0.35}s` }} />
          ))}
        </div>
      )
    default: // sparkle
      return (
        <div className="ph-sparkle" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} style={{
              right: `${4 + i * 8}%`,
              top: `${15 + (i * 13) % 65}%`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>
      )
  }
}

export function PageHero({
  title, subtitle, icon: Icon, accent, motif = 'sparkle', action, className = '',
}: {
  title: ReactNode
  subtitle?: ReactNode
  icon: LucideIcon
  accent: string
  motif?: HeroMotif
  action?: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`ph-hero ${className}`}
      style={{ ['--accent' as string]: accent } as CSSProperties}
    >
      <Motif motif={motif} />
      <div className="ph-inner">
        <span className="ph-icon"><Icon className="w-6 h-6" strokeWidth={1.75} /></span>
        <div className="min-w-0 flex-1">
          <h1 className="ph-title">{title}</h1>
          {subtitle != null && <p className="ph-sub">{subtitle}</p>}
        </div>
        {action && <div className="ph-action">{action}</div>}
      </div>
    </motion.div>
  )
}
