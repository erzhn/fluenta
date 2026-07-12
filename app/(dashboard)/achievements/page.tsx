'use client'
import { useState } from 'react'

interface Badge {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  progress?: number
  total?: number
}

const BADGES: Badge[] = [
  { id: 'first-lesson',   title: 'Первый шаг',        description: 'Заверши свой первый урок',         icon: '🎯', color: '#6366f1', unlocked: true },
  { id: 'week-streak',    title: 'Неделя подряд',      description: '7 дней стрика',                    icon: '🔥', color: '#f59e0b', unlocked: false, progress: 3, total: 7 },
  { id: 'vocab-50',       title: 'Словарный запас',    description: 'Изучи 50 слов',                    icon: '📚', color: '#8b5cf6', unlocked: false, progress: 23, total: 50 },
  { id: 'level-a2',       title: 'Elementary',         description: 'Достигни уровня A2',               icon: '⭐', color: '#3b82f6', unlocked: true },
  { id: 'writing-5',      title: 'Писатель',           description: 'Отправь 5 текстов на проверку',    icon: '✍️', color: '#10b981', unlocked: false, progress: 2, total: 5 },
  { id: 'perfect-quiz',   title: 'Перфекционист',      description: 'Пройди тест на 100%',              icon: '💎', color: '#06b6d4', unlocked: false },
  { id: 'month-streak',   title: 'Месяц подряд',       description: '30 дней стрика',                   icon: '🏆', color: '#f59e0b', unlocked: false, progress: 3, total: 30 },
  { id: 'level-b1',       title: 'Intermediate',       description: 'Достигни уровня B1',               icon: '🌟', color: '#8b5cf6', unlocked: false },
  { id: 'all-a1',         title: 'Мастер A1',          description: 'Заверши все уроки A1',             icon: '🎓', color: '#10b981', unlocked: false, progress: 3, total: 30 },
  { id: 'speed-learner',  title: 'Быстрый старт',      description: '3 урока за один день',             icon: '⚡', color: '#f59e0b', unlocked: true },
  { id: 'pronunciation',  title: 'Оратор',             description: 'Попрактикуй произношение 10 раз',  icon: '🎤', color: '#6366f1', unlocked: false, progress: 4, total: 10 },
  { id: 'level-b2',       title: 'Upper Intermediate', description: 'Достигни уровня B2',               icon: '👑', color: '#ef4444', unlocked: false },
]

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const unlocked = BADGES.filter(b => b.unlocked).length
  const displayed = BADGES.filter(b =>
    filter === 'all' ? true : filter === 'unlocked' ? b.unlocked : !b.unlocked
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          <span className="gradient-text">Достижения</span>
        </h1>
        <p className="text-[#64748b]">{unlocked} из {BADGES.length} получено</p>

        <div className="mt-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(unlocked / BADGES.length) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === f
                ? 'bg-[#6366f1] border-[#6366f1] text-white'
                : 'bg-white/[0.04] border-white/10 text-[#94a3b8] hover:text-white'
            }`}>
            {f === 'all' ? 'Все' : f === 'unlocked' ? '✓ Получены' : '🔒 Заблокированы'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayed.map(badge => (
          <div key={badge.id}
            className={`relative p-5 rounded-2xl border text-center transition-all ${
              badge.unlocked
                ? 'bg-white/[0.06] border-white/15 hover:border-white/25'
                : 'bg-white/[0.02] border-white/[0.06] opacity-60'
            }`}>

            <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl
              ${badge.unlocked ? '' : 'grayscale'}`}
              style={{
                background: badge.unlocked ? `${badge.color}20` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${badge.unlocked ? badge.color + '40' : 'rgba(255,255,255,0.08)'}`
              }}>
              {badge.unlocked ? badge.icon : '🔒'}
            </div>

            <p className="text-white text-sm font-semibold mb-1">{badge.title}</p>
            <p className="text-[#64748b] text-xs leading-relaxed">{badge.description}</p>

            {!badge.unlocked && badge.progress !== undefined && badge.total && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#475569] mb-1">
                  <span>{badge.progress}</span><span>{badge.total}</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(badge.progress / badge.total) * 100}%`, background: badge.color }} />
                </div>
              </div>
            )}

            {badge.unlocked && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-500
                flex items-center justify-center text-xs text-white shadow-lg shadow-green-500/30">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
