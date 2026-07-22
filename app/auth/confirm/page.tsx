'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Входим...')

  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { data } = await supabase.auth.setSession({ access_token, refresh_token })
          if (data.session) { router.push('/dashboard'); return }
        }
      }

      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      if (code) {
        const { data } = await supabase.auth.exchangeCodeForSession(code)
        if (data.session) { router.push('/dashboard'); return }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) { router.push('/dashboard'); return }

      setStatus('Не удалось войти. Попробуй снова.')
    }

    setTimeout(handleAuth, 300)

    const timer = setTimeout(() => setStatus('Не удалось войти. Попробуй снова.'), 8000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif', flexDirection:'column', gap:'16px' }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/></svg>
      <p style={{ fontSize:'18px' }}>{status}</p>
      {status.includes('Не удалось') && (
        <a href="/auth/login" style={{ color:'#6366f1', textDecoration:'underline' }}>← Попробовать снова</a>
      )}
    </div>
  )
}
