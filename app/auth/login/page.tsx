'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Ошибка конфигурации'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://fluentacademy-englishapp.vercel.app/auth/confirm',
      },
    })
    if (error) {
      setError('Не удалось отправить код. Попробуй снова.')
    } else {
      setStep('code')
    }
    setLoading(false)
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Ошибка конфигурации'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })
    if (error) {
      setError('Неверный код. Попробуй снова.')
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "rgb(var(--ios-bg-secondary))" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-[22px] bg-accent flex items-center justify-center text-white font-black text-2xl mb-4"
            style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
          >
            F
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-text-primary">Fluenta</h1>
          <p className="text-[14px] text-text-muted mt-1 text-center">
            {step === 'email'
              ? 'Введи email — отправим код для входа'
              : `Код отправлен на ${email}`}
          </p>
        </div>

        {/* Card */}
        <div className="card p-6">
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-[14px]"
              style={{ background: "rgba(255,59,48,0.1)", color: "rgb(var(--ios-red))" }}
            >
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="section-header block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-[16px] text-text-primary outline-none transition-all"
                  style={{
                    background: "rgb(var(--ios-bg-secondary))",
                    border: "none",
                    boxShadow: "0 0 0 2px transparent",
                  }}
                  onFocus={e => (e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.3)")}
                  onBlur={e => (e.target.style.boxShadow = "0 0 0 2px transparent")}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Отправляем...' : 'Получить код'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <div>
                <label className="section-header block mb-2">Код из письма</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="12345678"
                  required
                  maxLength={8}
                  className="w-full px-4 py-3.5 rounded-xl text-center outline-none transition-all"
                  style={{
                    background: "rgb(var(--ios-bg-secondary))",
                    border: "none",
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "0.5rem",
                    color: "rgb(var(--ios-text-primary))",
                    boxShadow: "0 0 0 2px transparent",
                  }}
                  onFocus={e => (e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.3)")}
                  onBlur={e => (e.target.style.boxShadow = "0 0 0 2px transparent")}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Проверяем...' : 'Войти'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError('') }}
                className="w-full py-2 text-[14px] text-text-muted text-center bg-transparent border-none cursor-pointer"
              >
                ← Изменить email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[12px] text-text-subtle mt-6">
          Безопасный вход через одноразовый код
        </p>
      </div>
    </div>
  )
}
