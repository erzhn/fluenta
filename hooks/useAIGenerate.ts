import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'

export function useAIGenerate() {
  const [loading, setLoading] = useState(false)

  async function generate<T = Record<string, unknown>>(
    type: string,
    context: string,
    level = 'B1',
    opts: { silent?: boolean } = {}
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
      if (!res.ok) {
        if (!opts.silent) toast('Не удалось сгенерировать. Попробуй ещё раз.', 'error')
        return null
      }
      return await res.json()
    } catch {
      if (!opts.silent) toast('Ошибка сети. Проверь соединение и попробуй снова.', 'error')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading }
}
