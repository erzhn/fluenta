'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Target, Check } from 'lucide-react'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  todayMinutes: number
  dailyGoalMinutes: number
  history: Record<string, number>
}

const STORAGE_KEY = 'fluenta_streak'
const GOAL_OPTIONS = [5, 10, 15, 20, 30]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function defaultStreak(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    todayMinutes: 0,
    dailyGoalMinutes: 10,
    history: {},
  }
}

export function loadStreak(): StreakData {
  if (typeof window === 'undefined') return defaultStreak()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultStreak(), ...JSON.parse(raw) } : defaultStreak()
  } catch {
    return defaultStreak()
  }
}

export function saveStreak(data: StreakData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function trackActivity(minutes: number) {
  const data = loadStreak()
  const today = todayISO()
  const yesterday = yesterdayISO()

  if (data.lastActiveDate !== today) {
    if (data.lastActiveDate === yesterday) {
      data.currentStreak += 1
    } else if (data.lastActiveDate !== today) {
      data.currentStreak = 1
    }
    data.todayMinutes = 0
    data.lastActiveDate = today
  }

  data.todayMinutes += minutes
  data.history[today] = (data.history[today] ?? 0) + minutes
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
  saveStreak(data)
}

interface StreakWidgetProps {
  className?: string
}

export function StreakWidget({ className = '' }: StreakWidgetProps) {
  const [data, setData] = useState<StreakData>(defaultStreak())
  const [showGoalPicker, setShowGoalPicker] = useState(false)

  useEffect(() => {
    setData(loadStreak())
  }, [])

  const today = todayISO()
  const goalDone = data.todayMinutes >= data.dailyGoalMinutes
  const progress = Math.min(100, Math.round((data.todayMinutes / data.dailyGoalMinutes) * 100))

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const iso = d.toISOString().slice(0, 10)
    const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2)
    return { iso, dayName, active: (data.history[iso] ?? 0) > 0 }
  })

  function setGoal(mins: number) {
    const updated = { ...data, dailyGoalMinutes: mins }
    setData(updated)
    saveStreak(updated)
    setShowGoalPicker(false)
  }

  return (
    <div className={`bg-white/[0.04] border border-white/10 rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-white font-semibold">Стрик</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-orange-400">{data.currentStreak}</span>
          <span className="text-muted-foreground text-sm">дней</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted-foreground text-xs">Сегодня: {data.todayMinutes} мин</span>
          <button onClick={() => setShowGoalPicker(v => !v)}
            className="text-xs text-primary hover:text-[#818cf8] transition-colors font-medium">
            цель: {data.dailyGoalMinutes} мин
          </button>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ background: goalDone ? '#10b981' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
        </div>
        {/* Goal picker */}
        {showGoalPicker && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex gap-1.5 flex-wrap">
            {GOAL_OPTIONS.map(m => (
              <button key={m} onClick={() => setGoal(m)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${data.dailyGoalMinutes === m ? 'bg-primary text-white' : 'bg-white/[0.06] text-muted-foreground hover:text-white'}`}>
                {m} мин
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Goal done badge */}
      {goalDone && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-[#10b981] font-medium">
          <Check className="w-3.5 h-3.5" /> Цель выполнена!
        </div>
      )}

      {/* Last 7 days */}
      <div className="flex gap-1.5 justify-between">
        {last7.map(({ iso, dayName, active }) => (
          <div key={iso} className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${active ? 'bg-[#10b981]/20 border border-[#10b981]/40' : iso === today ? 'bg-primary/20 border border-primary/40' : 'bg-white/[0.04] border border-white/10'}`}>
              {active && <Check className="w-3 h-3 text-[#10b981]" />}
              {!active && iso === today && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
            <span className="text-muted-foreground text-[10px]">{dayName}</span>
          </div>
        ))}
      </div>

      {data.longestStreak > 0 && (
        <p className="text-muted-foreground text-xs mt-3 flex items-center gap-1">
          <Target className="w-3 h-3" /> Рекорд: {data.longestStreak} дней
        </p>
      )}
    </div>
  );
}
