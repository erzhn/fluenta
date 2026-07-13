'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Goal = 'travel' | 'business' | 'exam' | 'general' | 'work'
type DailyGoal = 10 | 20 | 30 | 60

interface UserSettings {
  goal: Goal
  dailyGoalMinutes: DailyGoal
  nativeLanguage: string
  displayName: string
  reminderEnabled: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
  goal: 'general',
  dailyGoalMinutes: 20,
  nativeLanguage: 'ru',
  displayName: '',
  reminderEnabled: false,
}

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email ?? '')

      const raw = localStorage.getItem('fluenta_settings')
      if (raw) {
        try { setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) }) } catch { /* ignore */ }
      }
      setLoading(false)
    }
    load()
  }, [])

  function saveSettings() {
    localStorage.setItem('fluenta_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const currentTheme = mounted ? theme : 'dark'

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Настройки</h1>

      {/* Профиль */}
      <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
        <h2 className="text-white font-semibold mb-4">Профиль</h2>
        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground text-sm block mb-1.5">Имя</label>
            <input
              type="text"
              value={settings.displayName}
              onChange={e => setSettings(s => ({ ...s, displayName: e.target.value }))}
              placeholder="Твоё имя"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5
                text-white placeholder:text-[#334155] outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-sm block mb-1.5">Email</label>
            <input type="text" value={email} disabled
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-muted-foreground cursor-not-allowed" />
          </div>
        </div>
      </section>

      {/* Цель обучения */}
      <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
        <h2 className="text-white font-semibold mb-4">Цель обучения</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {([
            { id: 'general', label: '🌍 Общий английский', desc: 'Для повседневного общения' },
            { id: 'travel', label: '✈️ Путешествия', desc: 'Аэропорты, отели, туризм' },
            { id: 'business', label: '💼 Бизнес', desc: 'Переговоры, переписка, встречи' },
            { id: 'exam', label: '📝 Экзамен IELTS/TOEFL', desc: 'Подготовка к тестированию' },
            { id: 'work', label: '💻 Работа в IT', desc: 'Технический английский' },
          ] as const).map(g => (
            <button key={g.id} onClick={() => setSettings(s => ({ ...s, goal: g.id }))}
              className={`text-left p-4 rounded-xl border transition-all ${
                settings.goal === g.id
                  ? 'bg-primary/15 border-primary/50 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-muted-foreground hover:border-white/20'
              }`}>
              <p className="font-medium text-sm">{g.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Ежедневная цель */}
      <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
        <h2 className="text-white font-semibold mb-4">Ежедневная цель</h2>
        <div className="grid grid-cols-4 gap-2">
          {([10, 20, 30, 60] as DailyGoal[]).map(min => (
            <button key={min} onClick={() => setSettings(s => ({ ...s, dailyGoalMinutes: min }))}
              className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                settings.dailyGoalMinutes === min
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
              }`}>
              {min} мин
            </button>
          ))}
        </div>
      </section>

      {/* Тема */}
      <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Тема оформления</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Сейчас: {currentTheme === 'dark' ? 'Тёмная' : 'Светлая'}
            </p>
          </div>
          <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 border ${
              currentTheme === 'light' ? 'bg-primary border-primary' : 'bg-white/[0.06] border-white/10'
            }`}>
            <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center text-xs
              ${currentTheme === 'light' ? 'left-7' : 'left-0.5'}`}>
              {currentTheme === 'dark' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </section>

      <div className="flex gap-3 mt-6">
        <button onClick={saveSettings}
          className="flex-1 py-3 bg-primary hover:bg-[#5558e8] text-white font-semibold rounded-xl transition-colors">
          {saved ? '✓ Сохранено!' : 'Сохранить'}
        </button>
        <button onClick={handleSignOut}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-colors border border-red-500/20">
          Выйти
        </button>
      </div>
    </div>
  )
}
