'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' | 'xp' }

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function toast(message: string, type: Toast['type'] = 'success') {
  addToastFn?.({ message, type })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    addToastFn = (t) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(p => [...p, { ...t, id }])
      setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000)
    }
    return () => { addToastFn = null }
  }, [])

  if (!mounted) return null

  const colors = {
    success: 'bg-green-500/20 border-green-500/40 text-green-400',
    error: 'bg-red-500/20 border-red-500/40 text-red-400',
    info: 'bg-[hsl(var(--accent))]/20 border-[hsl(var(--accent))]/40 text-[#a5b4fc]',
    xp: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', xp: '⚡' }

  return createPortal(
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium backdrop-blur-sm shadow-lg ${colors[t.type]}`}
          style={{ animation: 'slideUp 0.2s ease-out' }}>
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  )
}
