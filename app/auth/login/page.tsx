'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export default function LoginPage() {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-clean w-full max-w-sm p-8">

        {/* Logo */}
        <div className="w-11 h-11 rounded-[12px] bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
          F
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-center mb-1">
          Войти в Fluenta
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {step === 'email' ? 'Учи английский с AI-репетитором' : `Код отправлен на ${email}`}
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-[15px] outline-none focus:ring-2 focus:ring-primary/25 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-violet w-full mt-2 py-3 text-[15px]"
              style={{ opacity: loading ? 0.65 : 1 }}
            >
              {loading ? 'Отправляем...' : 'Получить код'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Код из письма
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="12345678"
                required
                maxLength={8}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-[15px] outline-none focus:ring-2 focus:ring-primary/25 transition-all text-center tracking-[0.5rem] text-2xl font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-violet w-full mt-2 py-3 text-[15px]"
              style={{ opacity: loading ? 0.65 : 1 }}
            >
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError('') }}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
            >
              ← Изменить email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
