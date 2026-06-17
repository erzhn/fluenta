'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Входим в систему...')

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleAuth = async () => {
      // Handle PKCE flow (code in URL params)
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          router.push('/dashboard')
          return
        }
      }

      // Handle implicit flow (tokens in hash fragment)
      const hash = window.location.hash
      if (hash) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
          return
        }
      }

      // Listen for auth state change (Supabase JS handles hash automatically)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()
          router.push('/dashboard')
        }
      })

      // Timeout fallback
      setTimeout(() => {
        setStatus('Что-то пошло не так. Попробуй снова.')
      }, 5000)
    }

    handleAuth()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f23',
      color: 'white',
      fontSize: '18px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
        <div>{status}</div>
      </div>
    </div>
  )
}
