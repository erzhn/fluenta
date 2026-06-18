'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://fluentacademy-englishapp.vercel.app/auth/confirm',
      },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  const containerStyle: React.CSSProperties = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif' }
  const boxStyle: React.CSSProperties = { width:'100%', maxWidth:'400px', padding:'40px 32px', background:'rgba(255,255,255,0.05)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)' }

  if (sent) return (
    <div style={containerStyle}>
      <div style={{ ...boxStyle, textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'16px' }}>✉️</div>
        <h2 style={{ fontSize:'22px', fontWeight:'bold', marginBottom:'12px' }}>Проверь почту!</h2>
        <p style={{ color:'#9ca3af', lineHeight:'1.6' }}>
          Нажми на ссылку в письме.<br/>
          <strong style={{ color:'white' }}>{email}</strong>
        </p>
        <p style={{ color:'#6b7280', fontSize:'13px', marginTop:'16px' }}>Не нашёл? Проверь папку «Спам».</p>
        <button
          onClick={() => { setSent(false); setError('') }}
          style={{ marginTop:'20px', background:'transparent', border:'1px solid #374151', color:'#9ca3af', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontSize:'14px' }}
        >
          ← Изменить email
        </button>
      </div>
    </div>
  )

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>✨</div>
          <h1 style={{ fontSize:'26px', fontWeight:'bold', marginBottom:'8px' }}>Войти в Fluenta</h1>
          <p style={{ color:'#9ca3af' }}>Введи email — отправим ссылку для входа</p>
        </div>

        {error && (
          <div style={{ background:'#7f1d1d', border:'1px solid #dc2626', borderRadius:'8px', padding:'12px', marginBottom:'16px', color:'#fca5a5', fontSize:'14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={sendLink}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ width:'100%', padding:'12px 16px', borderRadius:'8px', border:'1px solid #374151', background:'#1f2937', color:'white', fontSize:'16px', boxSizing:'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'14px', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:'16px', fontWeight:'bold', cursor:'pointer', marginTop:'8px' }}
          >
            {loading ? 'Отправляем...' : 'Отправить ссылку →'}
          </button>
        </form>
      </div>
    </div>
  )
}
