import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAIGenerate() {
  const [loading, setLoading] = useState(false)

  async function generate<T = Record<string, unknown>>(
    type: string,
    context: string,
    level = 'B1'
  ): Promise<T | null> {
    setLoading(true)
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
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading }
}
