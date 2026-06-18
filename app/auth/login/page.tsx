'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: 'https://fluentacademy-englishapp.vercel.app/auth/confirm',
        shouldCreateUser: true,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  if (sent) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center', padding:'32px' }}>
        <div style={{ fontSize:'64px', marginBottom:'24px' }}>✉️</div>
        <h2 style={{ fontSize:'24px', marginBottom:'12px' }}>Проверь почту!</h2>
        <p style={{ color:'#9ca3af' }}>Отправили ссылку на <strong style={{ color:'white' }}>{email}</strong>.<br/>Нажми на неё чтобы войти. Проверь Спам.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif' }}>
      <div style={{ width:'100%', maxWidth:'400px', padding:'32px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>✨</div>
          <h1 style={{ fontSize:'28px', fontWeight:'bold', marginBottom:'8px' }}>Войти в Fluenta</h1>
          <p style={{ color:'#9ca3af' }}>Введи email — мы отправим ссылку для входа</p>
        </div>
        {error && <div style={{ background:'#7f1d1d', border:'1px solid #dc2626', borderRadius:'8px', padding:'12px', marginBottom:'16px', color:'#fca5a5' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width:'100%', padding:'12px 16px', borderRadius:'8px', border:'1px solid #374151', background:'#1f2937', color:'white', fontSize:'16px', boxSizing:'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'14px', borderRadius:'8px', border:'none', background:loading?'#4b5563':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:'16px', fontWeight:'bold', cursor:loading?'not-allowed':'pointer' }}>
            {loading ? 'Отправляем...' : 'Отправить ссылку →'}
          </button>
        </form>
      </div>
    </div>
  )
}
