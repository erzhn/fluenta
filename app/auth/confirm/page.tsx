'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Входим...')

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'fluenta-auth',
        }
      }
    )

    // Let Supabase automatically process the URL hash
    // onAuthStateChange fires when session is detected from hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        router.push('/dashboard')
        return
      }
      if (event === 'SIGNED_OUT') {
        setStatus('Сессия истекла. Попробуй снова.')
      }
    })

    // Also try immediately after short delay
    setTimeout(async () => {
      // Try hash tokens manually
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { data } = await supabase.auth.setSession({ access_token, refresh_token })
          if (data.session) {
            router.push('/dashboard')
            return
          }
        }
      }

      // Try PKCE code
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      if (code) {
        const { data } = await supabase.auth.exchangeCodeForSession(code)
        if (data.session) {
          router.push('/dashboard')
          return
        }
      }

      // Check existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
        return
      }
    }, 500)

    // Error timeout
    const timer = setTimeout(() => {
      setStatus('Не удалось войти. Запроси новую ссылку.')
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif', flexDirection:'column', gap:'16px' }}>
      <div style={{ fontSize:'48px' }}>✨</div>
      <p style={{ fontSize:'18px' }}>{status}</p>
      {(status.includes('истекла') || status.includes('Не удалось')) && (
        <a href="/auth/login" style={{ color:'#6366f1', textDecoration:'underline' }}>← Попробовать снова</a>
      )}
    </div>
  )
}
