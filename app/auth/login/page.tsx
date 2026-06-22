'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

// SINGLETON - created once at module level, not on every render
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Clear any error params from URL left by failed auth redirects
    window.history.replaceState({}, '', '/auth/login')
  }, [])

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      })
      if (error) {
        setError('Не удалось отправить код. Проверь email и попробуй снова.')
      } else {
        setStep('code')
      }
    } catch {
      setError('Ошибка соединения. Попробуй позже.')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'email',
      })
      if (error) {
        setError('Неверный код. Попробуй снова.')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Ошибка соединения. Попробуй позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a2e] rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-white">Войти в Fluenta</h1>
          <p className="text-gray-400 mt-2">
            {step === 'email' ? 'Введи email — отправим код для входа' : `Введи код из письма на ${email}`}
          </p>
        </div>

        {error && error.trim() !== '' && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? 'Отправляем...' : 'Получить код →'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Код из письма</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? 'Проверяем...' : 'Войти →'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError('') }}
              className="w-full text-gray-400 text-sm hover:text-white"
            >
              ← Назад
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
