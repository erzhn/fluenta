'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Clear any error/hash params Supabase may have added to the URL on failed auth
    window.history.replaceState({}, '', '/auth/login')
  }, [])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
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

  const box: React.CSSProperties = { width:'100%', maxWidth:'400px', padding:'40px 32px', background:'rgba(255,255,255,0.05)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)' }
  const wrap: React.CSSProperties = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f23', color:'white', fontFamily:'sans-serif' }
  const inp: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:'8px', border:'1px solid #374151', background:'#1f2937', color:'white', fontSize:'16px', boxSizing:'border-box' }
  const btn: React.CSSProperties = { width:'100%', padding:'14px', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:'16px', fontWeight:'bold', cursor:'pointer' }

  return (
    <div style={wrap}>
      <div style={box}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>✨</div>
          <h1 style={{ fontSize:'26px', fontWeight:'bold', marginBottom:'8px' }}>Войти в Fluenta</h1>
          {step === 'email' && <p style={{ color:'#9ca3af' }}>Введи email — отправим код для входа</p>}
          {step === 'code' && <p style={{ color:'#9ca3af' }}>Введи 6-значный код из письма на<br/><strong style={{color:'white'}}>{email}</strong></p>}
        </div>

        {typeof error === 'string' && error.trim() !== '' && <div style={{ background:'#7f1d1d', border:'1px solid #dc2626', borderRadius:'8px', padding:'12px', marginBottom:'16px', color:'#fca5a5', fontSize:'14px' }}>{error}</div>}

        {step === 'email' && (
          <form onSubmit={sendCode}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com" style={inp} />
            </div>
            <button type="submit" disabled={loading} style={{...btn, background: loading?'#4b5563':'linear-gradient(135deg,#6366f1,#8b5cf6)', cursor: loading?'not-allowed':'pointer'}}>
              {loading ? 'Отправляем...' : 'Получить код →'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'8px', color:'#d1d5db' }}>Код из письма</label>
              <input type="text" value={code} onChange={e=>setCode(e.target.value)} required placeholder="123456" maxLength={6} style={{...inp, fontSize:'28px', textAlign:'center', letterSpacing:'10px'}} />
            </div>
            <button type="submit" disabled={loading} style={{...btn, cursor: loading?'not-allowed':'pointer', background: loading?'#4b5563':'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              {loading ? 'Проверяем...' : 'Войти →'}
            </button>
            <button type="button" onClick={()=>{setStep('email');setCode('');setError('')}} style={{...btn, background:'transparent', border:'1px solid #374151', color:'#9ca3af', marginTop:'8px'}}>
              ← Изменить email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
