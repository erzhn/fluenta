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
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background-secondary))] p-4">
      <div className="card w-full max-w-sm p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            F
          </div>
          <h1 className="text-xl font-semibold text-[hsl(var(--foreground))]">Войти в Fluenta</h1>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
            {step === 'email' ? 'Введи email — отправим код для входа' : `Код отправлен на ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="block text-sm text-[hsl(var(--foreground-muted))] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] rounded-lg px-3.5 py-2.5 text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--accent))] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправляем...' : 'Получить код →'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-sm text-[hsl(var(--foreground-muted))] mb-1.5">Код из письма</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="12345678"
                required
                maxLength={8}
                className="w-full bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] rounded-lg px-3.5 py-2.5 text-[hsl(var(--foreground))] text-2xl font-bold text-center tracking-[0.5rem] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--accent))] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Проверяем...' : 'Войти →'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError('') }}
              className="w-full text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors py-1"
            >
              ← Изменить email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
