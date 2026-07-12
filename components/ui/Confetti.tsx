'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function triggerConfetti() {
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  })
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  })
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star'],
      colors: ['#f59e0b', '#fbbf24', '#fde68a'],
      scalar: 1.5,
    })
  }, 250)
}

export function useConfettiOnMount() {
  useEffect(() => {
    triggerConfetti()
  }, [])
}
