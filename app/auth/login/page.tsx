'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendCode = async (e: React.FormEvent) => {
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
    else { setStep('code'); setLoading(false) }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })
    if (error) { setError('Неверный код. Попробуй снова.'); setLoading(false) }
    else { router.push('/dashboard') }
  }

  const containerStyle: React.CSSProperties = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif' }
  const boxStyle: React.CSSProperties = { width:'100%', maxWidth:'400px', padding:'40px 32px', background:'rgba(255,255,255,0.05)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)' }
  const inputStyle: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:'8px', border:'1px solid #374151', background:'#1f2937', color:'white', fontSize:'16px', boxSizing:'border-box' }
  const btnStyle: React.CSSProperties = { width:'100%', padding:'14px', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:'16px', fontWeight:'bold', cursor:'pointer', marginTop:'8px' }

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>✨</div>
          <h1 style={{ fontSize:'26px', fontWeight:'bold', marginBottom:'8px' }}>Войти в Fluenta</h1>
          {step === 'email' && <p style={{ color:'#9ca3af' }}>Введи email — отправим код для входа</p>}
          {step === 'code' && <p style={{ color:'#9ca3af' }}>Введи 6-значный код из письма на<br/><strong style={{color:'white'}}>{email}</strong></p>}
        </div>

        {error && <div style={{ background:'#7f1d1d', border:'1px solid #dc2626', borderRadius:'8px', padding:'12px', marginBottom:'16px', color:'#fca5a5', fontSize:'14px' }}>{error}</div>}

        {step === 'email' && (
          <form onSubmit={sendCode}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Отправляем...' : 'Получить код →'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Код из письма</label>
              <input type="text" value={code} onChange={e=>setCode(e.target.value)} required placeholder="123456" maxLength={6} style={{...inputStyle, fontSize:'24px', textAlign:'center', letterSpacing:'8px'}} />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Проверяем...' : 'Войти →'}
            </button>
            <button type="button" onClick={()=>{setStep('email');setCode('');setError('')}} style={{...btnStyle, background:'transparent', border:'1px solid #374151', marginTop:'8px'}}>
              ← Изменить email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
