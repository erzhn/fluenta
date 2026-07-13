'use client'
import { useEffect, useState } from 'react'

interface DayData {
  date: string
  label: string
  minutes: number
  lessons: number
  words: number
}

interface WeekData {
  days: DayData[]
  totalMinutes: number
  totalLessons: number
  totalWords: number
  streakDays: number
  bestDay: string
}

function getWeekData(): WeekData {
  const days: DayData[] = []
  const dayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  let totalMinutes = 0, totalLessons = 0, totalWords = 0, streakDays = 0, bestDay = ''
  let maxMinutes = 0

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const activity = JSON.parse(localStorage.getItem(`fluenta_activity_${iso}`) ?? '{}')
    const minutes = activity.minutes ?? 0
    const lessons = activity.lessons ?? 0
    const words = activity.words ?? 0

    totalMinutes += minutes
    totalLessons += lessons
    totalWords += words
    if (minutes > 0) streakDays++
    if (minutes > maxMinutes) { maxMinutes = minutes; bestDay = dayLabels[d.getDay()] }

    days.push({ date: iso, label: dayLabels[d.getDay()], minutes, lessons, words })
  }

  return { days, totalMinutes, totalLessons, totalWords, streakDays, bestDay: bestDay || 'Нет данных' }
}

export default function WeeklySummaryPage() {
  const [data, setData] = useState<WeekData | null>(null)

  useEffect(() => { setData(getWeekData()) }, [])

  if (!data) return null

  const maxMin = Math.max(...data.days.map(d => d.minutes), 1)

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2"><span className="gradient-text">Итоги недели</span></h1>
      <p className="text-muted-foreground mb-8">
        {new Date(data.days[0].date).toLocaleDateString('ru', { day: 'numeric', month: 'long' })} —{' '}
        {new Date(data.days[6].date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Минут', value: data.totalMinutes, icon: '⏱️' },
          { label: 'Уроков', value: data.totalLessons, icon: '📚' },
          { label: 'Слов', value: data.totalWords, icon: '💬' },
          { label: 'Дней подряд', value: data.streakDays, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-white font-semibold mb-5">Активность по дням</p>
        <div className="flex items-end gap-3 h-32">
          {data.days.map(day => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '96px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${Math.max(4, (day.minutes / maxMin) * 96)}px`,
                    background: day.minutes > 0 ? '#6366f1' : 'rgba(255,255,255,0.06)',
                  }}
                  title={`${day.minutes} мин`}
                />
              </div>
              <span className="text-muted-foreground text-xs">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-primary/20 rounded-2xl p-5">
        <p className="text-white font-semibold mb-2">
          {data.totalMinutes > 0
            ? `🎯 Лучший день недели: ${data.bestDay}`
            : '📚 Начни заниматься!'}
        </p>
        <p className="text-muted-foreground text-sm">
          {data.totalMinutes >= 140
            ? 'Отличная неделя! Ты превысил цель в 20 мин/день.'
            : data.totalMinutes >= 60
            ? `Хорошее начало! Ещё ${140 - data.totalMinutes} мин для выполнения цели недели.`
            : 'Попробуй заниматься хотя бы 20 минут каждый день.'}
        </p>
      </div>
    </div>
  )
}
