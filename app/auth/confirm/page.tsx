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
      { auth: { detectSessionInUrl: true, persistSession: true } }
    )

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        router.push('/dashboard')
      }
    })

    // Also check immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })

    const timer = setTimeout(() => setStatus('Ошибка. Попробуй войти снова.'), 10000)
    return () => { clearTimeout(timer); subscription.unsubscribe() }
  }, [router])

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif', flexDirection:'column', gap:'16px' }}>
      <div style={{ fontSize:'48px' }}>✨</div>
      <p>{status}</p>
      {status.includes('Ошибка') && (
        <a href="/auth/login" style={{ color:'#6366f1', textDecoration:'underline' }}>← Вернуться</a>
      )}
    </div>
  )
}
