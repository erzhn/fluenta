'use client'
import { useMemo } from 'react'

interface ProgressPredictionProps {
  completedLessons: number
  totalLessons: number
  currentLevel: string
  dailyAvgMinutes: number
  streakDays: number
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const LESSONS_PER_LEVEL = 19

export function ProgressPrediction({ completedLessons, currentLevel, dailyAvgMinutes }: ProgressPredictionProps) {
  const prediction = useMemo(() => {
    const currentLevelIdx = LEVELS.indexOf(currentLevel)
    const nextLevel = LEVELS[currentLevelIdx + 1]
    if (!nextLevel) return null

    const lessonsInCurrentLevel = completedLessons % LESSONS_PER_LEVEL
    const lessonsLeft = LESSONS_PER_LEVEL - lessonsInCurrentLevel
    const dailyLessons = dailyAvgMinutes >= 20 ? 1 : dailyAvgMinutes >= 10 ? 0.5 : 0.25
    const daysToNextLevel = Math.ceil(lessonsLeft / dailyLessons)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + daysToNextLevel)
    const months = Math.floor(daysToNextLevel / 30)
    const days = daysToNextLevel % 30

    return { nextLevel, daysToNextLevel, targetDate, months, days, lessonsLeft }
  }, [completedLessons, currentLevel, dailyAvgMinutes])

  if (!prediction) return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-center">
      <p className="text-2xl mb-2">👑</p>
      <p className="text-white font-semibold">Уровень C1 достигнут!</p>
    </div>
  )

  const motivationColor = dailyAvgMinutes >= 20 ? '#10b981' : dailyAvgMinutes >= 10 ? '#f59e0b' : '#ef4444'

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      <p className="text-white font-semibold text-sm mb-4">Предсказание прогресса</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-[hsl(var(--foreground-muted))] text-xs mb-1">Текущий уровень</p>
          <p className="text-white font-bold text-xl">{currentLevel}</p>
        </div>
        <div className="text-[#334155] text-2xl">→</div>
        <div className="flex-1">
          <p className="text-[hsl(var(--foreground-muted))] text-xs mb-1">Следующий</p>
          <p className="font-bold text-xl" style={{ color: motivationColor }}>{prediction.nextLevel}</p>
        </div>
        <div className="text-right">
          <p className="text-[hsl(var(--foreground-muted))] text-xs mb-1">Осталось уроков</p>
          <p className="text-white font-bold text-xl">{prediction.lessonsLeft}</p>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl p-3 mb-3">
        <p className="text-white text-sm">
          При темпе <span style={{ color: motivationColor }} className="font-bold">{dailyAvgMinutes} мин/день</span>
          {' '}ты достигнешь <span className="text-white font-bold">{prediction.nextLevel}</span> через{' '}
          <span className="text-white font-bold">
            {prediction.months > 0 ? `${prediction.months} мес. ` : ''}{prediction.days > 0 ? `${prediction.days} дн.` : ''}
          </span>
        </p>
        <p className="text-[hsl(var(--foreground-subtle))] text-xs mt-1">
          Примерно {prediction.targetDate.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {dailyAvgMinutes < 20 && (
        <p className="text-[#f59e0b] text-xs">
          💡 Занимайся 20 мин/день — и достигнешь цели на {Math.ceil((1 - dailyAvgMinutes/20) * prediction.daysToNextLevel)} дней раньше
        </p>
      )}
    </div>
  )
}
