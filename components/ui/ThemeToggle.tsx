'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 transition-all"
      title="Сменить тему"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
