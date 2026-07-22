'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  Target, BookOpen, GraduationCap, Flame, Trophy, PenLine, Library,
  Zap, Gem, Crown, Star, Sparkles, Rocket, Medal, Lock, Check,
  type LucideIcon,
} from 'lucide-react'

interface Badge {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  unlocked: boolean
  progress?: number
  total?: number
}

interface UserStats {
  xp: number
  streak: number
  current_level: string
  lessonsCompleted: number
  vocabCount: number
}

async function fetchStats(): Promise<UserStats> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return { xp: 0, streak: 0, current_level: 'A1', lessonsCompleted: 0, vocabCount: 0 }
  }

  const uid = session.user.id
  const [{ data: profile }, { count: lessons }, { count: vocab }] = await Promise.all([
    supabase.from('profiles').select('xp,streak,current_level').eq('id', uid).single(),
    supabase.from('lessons_progress').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('completed', true),
    supabase.from('vocabulary').select('*', { count: 'exact', head: true }).eq('user_id', uid),
  ])

  return {
    xp: profile?.xp ?? 0,
    streak: profile?.streak ?? 0,
    current_level: profile?.current_level ?? 'A1',
    lessonsCompleted: lessons ?? 0,
    vocabCount: vocab ?? 0,
  }
}

function buildBadges(s: UserStats): Badge[] {
  const lvlOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const lvlIdx = lvlOrder.indexOf(s.current_level)

  return [
    {
      id: 'first-lesson', title: 'Первый шаг', icon: Target, color: '#6366f1',
      description: 'Заверши свой первый урок',
      unlocked: s.lessonsCompleted >= 1,
      progress: Math.min(s.lessonsCompleted, 1), total: 1,
    },
    {
      id: 'lessons-10', title: '10 уроков', icon: BookOpen, color: '#8b5cf6',
      description: 'Заверши 10 уроков',
      unlocked: s.lessonsCompleted >= 10,
      progress: Math.min(s.lessonsCompleted, 10), total: 10,
    },
    {
      id: 'lessons-50', title: '50 уроков', icon: GraduationCap, color: '#6366f1',
      description: 'Заверши 50 уроков',
      unlocked: s.lessonsCompleted >= 50,
      progress: Math.min(s.lessonsCompleted, 50), total: 50,
    },
    {
      id: 'week-streak', title: 'Неделя подряд', icon: Flame, color: '#f59e0b',
      description: '7 дней стрика',
      unlocked: s.streak >= 7,
      progress: Math.min(s.streak, 7), total: 7,
    },
    {
      id: 'month-streak', title: 'Месяц подряд', icon: Trophy, color: '#f59e0b',
      description: '30 дней стрика',
      unlocked: s.streak >= 30,
      progress: Math.min(s.streak, 30), total: 30,
    },
    {
      id: 'vocab-10', title: 'Словарный старт', icon: PenLine, color: '#10b981',
      description: 'Добавь 10 слов в словарь',
      unlocked: s.vocabCount >= 10,
      progress: Math.min(s.vocabCount, 10), total: 10,
    },
    {
      id: 'vocab-50', title: 'Словарный запас', icon: Library, color: '#8b5cf6',
      description: 'Добавь 50 слов в словарь',
      unlocked: s.vocabCount >= 50,
      progress: Math.min(s.vocabCount, 50), total: 50,
    },
    {
      id: 'xp-500', title: 'Первые 500 XP', icon: Zap, color: '#6366f1',
      description: 'Набери 500 XP',
      unlocked: s.xp >= 500,
      progress: Math.min(s.xp, 500), total: 500,
    },
    {
      id: 'xp-2000', title: '2000 XP', icon: Gem, color: '#06b6d4',
      description: 'Набери 2000 XP',
      unlocked: s.xp >= 2000,
      progress: Math.min(s.xp, 2000), total: 2000,
    },
    {
      id: 'xp-5000', title: 'Мастер XP', icon: Crown, color: '#f59e0b',
      description: 'Набери 5000 XP',
      unlocked: s.xp >= 5000,
      progress: Math.min(s.xp, 5000), total: 5000,
    },
    {
      id: 'level-a2', title: 'Elementary', icon: Star, color: '#3b82f6',
      description: 'Достигни уровня A2',
      unlocked: lvlIdx >= 1,
      progress: Math.min(lvlIdx, 1), total: 1,
    },
    {
      id: 'level-b1', title: 'Intermediate', icon: Sparkles, color: '#8b5cf6',
      description: 'Достигни уровня B1',
      unlocked: lvlIdx >= 2,
      progress: Math.min(lvlIdx, 2), total: 2,
    },
    {
      id: 'level-b2', title: 'Upper-Int', icon: Rocket, color: '#6366f1',
      description: 'Достигни уровня B2',
      unlocked: lvlIdx >= 3,
      progress: Math.min(lvlIdx, 3), total: 3,
    },
    {
      id: 'level-c1', title: 'Advanced', icon: Medal, color: '#ef4444',
      description: 'Достигни уровня C1',
      unlocked: lvlIdx >= 4,
      progress: Math.min(lvlIdx, 4), total: 4,
    },
  ]
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(stats => {
      setBadges(buildBadges(stats))
      setLoading(false)
    })
  }, [])

  const unlocked = badges.filter(b => b.unlocked).length
  const displayed = badges.filter(b =>
    filter === 'all' ? true : filter === 'unlocked' ? b.unlocked : !b.unlocked
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Достижения</h1>
        <p className="text-muted-foreground">{unlocked} из {badges.length} получено</p>
        <div className="mt-3 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${badges.length ? (unlocked / badges.length) * 100 : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)' }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border min-h-[44px] ${
              filter === f
                ? 'bg-primary border-primary text-white'
                : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>
            {f === 'all' ? 'Все' : f === 'unlocked' ? 'Получены' : 'Заблокированы'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayed.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`relative p-5 rounded-2xl border text-center transition-all ${
              badge.unlocked
                ? 'bg-white/[0.06] border-white/15 hover:border-white/25'
                : 'bg-white/[0.02] border-white/[0.06] opacity-60'
            }`}>

            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{
                background: badge.unlocked ? `${badge.color}20` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${badge.unlocked ? badge.color + '40' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {badge.unlocked
                ? <badge.icon className="w-7 h-7" strokeWidth={1.75} style={{ color: badge.color }} />
                : <Lock className="w-6 h-6 text-[#334155]" strokeWidth={1.75} />}
            </div>

            <p className="text-white text-sm font-semibold mb-1">{badge.title}</p>
            <p className="text-muted-foreground text-xs leading-relaxed">{badge.description}</p>

            {badge.progress !== undefined && badge.total !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{badge.progress.toLocaleString()}</span>
                  <span>{badge.total.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(badge.progress / badge.total) * 100}%`, background: badge.color }} />
                </div>
              </div>
            )}

            {badge.unlocked && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-500
                flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
