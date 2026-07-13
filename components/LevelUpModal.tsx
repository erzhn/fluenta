'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface LevelUpModalProps {
  fromLevel: string
  toLevel: string
  onClose: () => void
}

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A2: 'Ты можешь общаться на простые темы и понимать основные фразы',
  B1: 'Ты можешь справляться с большинством ситуаций в путешествии',
  B2: 'Ты можешь свободно общаться с носителями языка',
  C1: 'Ты владеешь языком на продвинутом уровне!',
}

const LEVEL_EMOJI: Record<string, string> = {
  A2: '⭐', B1: '🌟', B2: '💫', C1: '👑'
}

export function LevelUpModal({ fromLevel, toLevel, onClose }: LevelUpModalProps) {
  useEffect(() => {
    const fire = (opts: confetti.Options) => confetti({ ...opts, disableForReducedMotion: true })

    fire({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1','#8b5cf6','#f59e0b','#10b981'] })
    setTimeout(() => fire({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 400)
    setTimeout(() => fire({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 800)
    setTimeout(() => fire({ particleCount: 30, spread: 100, origin: { y: 0.5 }, shapes: ['star'], colors: ['#f59e0b','#fbbf24'] }), 1200)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--accent))]/30 rounded-3xl p-8 sm:p-12 max-w-md w-full mx-4 text-center
        shadow-2xl shadow-[#6366f1]/20 animate-[scaleIn_0.5s_cubic-bezier(0.22,1,0.36,1)]">

        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl
          bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[hsl(var(--accent))]/30">
          {LEVEL_EMOJI[toLevel] ?? '🎉'}
        </div>

        <p className="text-[hsl(var(--accent))] text-sm font-semibold uppercase tracking-widest mb-2">Поздравляем!</p>
        <h2 className="text-white text-3xl font-bold mb-1">
          Уровень <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{toLevel}</span>
        </h2>
        <p className="text-[hsl(var(--foreground-muted))] mb-2">{fromLevel} → {toLevel}</p>

        <div className="my-6 h-px bg-white/[0.06]" />

        <p className="text-[hsl(var(--foreground-muted))] text-base leading-relaxed mb-8">
          {LEVEL_DESCRIPTIONS[toLevel] ?? 'Отличная работа!'}
        </p>

        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-8">
          <div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]
            animate-[fillBar_1.5s_cubic-bezier(0.22,1,0.36,1)_0.5s_forwards] w-0" />
        </div>

        <button onClick={onClose}
          className="w-full py-4 bg-[hsl(var(--accent))] hover:bg-[#5558e8] text-white font-bold rounded-2xl text-lg
            transition-all hover:scale-[1.02] active:scale-[0.98]">
          Продолжить обучение 🚀
        </button>
      </div>
    </div>
  )
}
