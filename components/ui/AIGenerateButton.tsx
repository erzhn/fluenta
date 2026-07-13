"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AIGenerateButtonProps {
  type: string
  context: string
  level?: string
  onResult: (data: Record<string, unknown>) => void
  label?: string
  className?: string
  variant?: 'button' | 'icon' | 'inline'
}

export function AIGenerateButton({
  type, context, level = 'B1', onResult, label = 'Сгенерировать AI',
  className = '', variant = 'button'
}: AIGenerateButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError(false)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ type, context, level }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      onResult(data)
    } catch {
      setError(true)
      setTimeout(() => setError(false), 2000)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={generate}
        disabled={loading}
        title={label}
        className={`p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className={`flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        {error ? 'Ошибка, попробуй ещё' : label}
      </button>
    )
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium text-sm transition-all disabled:opacity-50 border border-primary/20 ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      {error ? 'Ошибка, попробуй ещё' : (loading ? 'Генерирую...' : label)}
    </button>
  )
}
