'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Flame, Zap, BookOpen, Clock, MessageSquare,
  ArrowRight, BookMarked, BarChart3, Target,
  ChevronRight, Brain, Mic, PenLine,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StreakWidget, loadStreak, type StreakData } from '@/components/StreakWidget'
import { LESSONS, LEVEL_COLORS, type Lesson } from '@/lib/lessons-data'
import { getLessonCompletions } from '@/lib/progress'
import { DailyReview } from '@/components/DailyReview'
import { WordOfDay } from '@/components/WordOfDay'
import { LevelUpModal } from '@/components/LevelUpModal'
import { getLevelFromXP } from '@/lib/gamification'

interface Profile {
  name: string | null
  streak: number
  xp: number
  current_level: string
  daily_goal_minutes: number
}

interface RecentConv {
  id: string
  title: string
  updated_at: string
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

function displayName(profile: Profile | null, email: string | null, fullName?: string | null) {
  if (profile?.name) return profile.name
  if (fullName) return fullName.split(' ')[0]
  if (email) {
    const prefix = email.split('@')[0].split(/[._\-0-9]/)[0]
    const capped = prefix.slice(0, 12)
    return capped.charAt(0).toUpperCase() + capped.slice(1)
  }
  return 'друг'
}

const QUICK_ACTIONS = [
  { href: '/ai-tutor',   icon: Brain,    label: 'AI Репетитор', color: '#8B5CF6' },
  { href: '/lessons',    icon: BookOpen, label: 'Уроки',        color: '#007AFF' },
  { href: '/vocabulary', icon: BookMarked, label: 'Словарь',    color: '#34C759' },
  { href: '/writing',    icon: PenLine,  label: 'Письмо',       color: '#FF9500' },
  { href: '/pronunciation', icon: Mic,   label: 'Произношение', color: '#FF3B30' },
]

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [vocabCount, setVocabCount] = useState(0)
  const [recentConvs, setRecentConvs] = useState<RecentConv[]>([])
  const [loading, setLoading] = useState(true)
  const [localLevel, setLocalLevel] = useState<string | null>(null)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [vocabDue, setVocabDue] = useState(0)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [levelUp, setLevelUp] = useState<{from: string; to: string} | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalLevel(localStorage.getItem('fluenta_user_level'))
      setStreakData(loadStreak())
      try {
        const raw = localStorage.getItem('fluenta_vocab_srs')
        if (raw) {
          const srs = JSON.parse(raw)
          const today = new Date().toISOString().slice(0, 10)
          const due = Object.values(srs as Record<string, { box: number; nextReview: string }>)
            .filter(v => v.box < 5 && v.nextReview <= today).length
          setVocabDue(due)
        }
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      setEmail(user.email ?? null)
      setFullName((user.user_metadata?.full_name as string | null) ?? null)

      const [profileRes, vocabRes, convRes, completions] = await Promise.all([
        supabase.from('profiles').select('name,streak,xp,current_level,daily_goal_minutes').eq('id', user.id).single(),
        supabase.from('vocabulary').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('ai_conversations').select('id,title,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(3),
        getLessonCompletions(user.id),
      ])

      if (profileRes.data) {
        setProfile(profileRes.data as Profile)
        const currentLevel = (profileRes.data as Profile).current_level ?? 'A1'
        const prevLevel = localStorage.getItem('fluenta_last_level')
        if (prevLevel && prevLevel !== currentLevel) {
          setLevelUp({ from: prevLevel, to: currentLevel })
        }
        localStorage.setItem('fluenta_last_level', currentLevel)
      }
      setVocabCount(vocabRes.count ?? 0)
      if (convRes.data) setRecentConvs(convRes.data as RecentConv[])

      const completedIds = new Set(Object.keys(completions))
      setCompletedCount(completedIds.size)
      let found: Lesson | null = null
      for (const level of ['A1', 'A2', 'B1', 'B2', 'C1'] as const) {
        for (const lesson of LESSONS.filter(l => l.level === level).sort((a, b) => a.block - b.block || a.order - b.order)) {
          if (!completedIds.has(lesson.id)) { found = lesson; break }
        }
        if (found) break
      }
      setNextLesson(found)
      setLoading(false)
    }
    load()
  }, [])

  const name = displayName(profile, email, fullName)
  const streak = profile?.streak ?? 0
  const xp = profile?.xp ?? 0
  const level = profile?.current_level ?? localLevel ?? 'A1'
  const goalMins = profile?.daily_goal_minutes ?? 20
  const minutesToday = 0
  const goalPct = Math.min(100, Math.round((minutesToday / goalMins) * 100))
  const levelInfo = getLevelFromXP(xp)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-[14px] bg-accent flex items-center justify-center text-white font-black text-xl animate-pulse">F</div>
          <p className="text-text-muted text-sm">Загружаем...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 md:pb-8 space-y-5 animate-slide-up">
      {levelUp && (
        <LevelUpModal
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          onClose={() => setLevelUp(null)}
        />
      )}

      {/* Greeting */}
      <div>
        <p className="text-text-muted text-[13px] font-medium">{greeting()}</p>
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary mt-0.5">
          {name}!
        </h1>
        {!localLevel && (
          <Link href="/level-test">
            <div className="mt-3 flex items-center gap-3 p-3.5 rounded-2xl border border-accent/20"
              style={{ background: "rgb(var(--ios-accent-light))" }}>
              <span className="text-xl">📊</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-text-primary">Определи свой уровень</p>
                <p className="text-[12px] text-text-muted">20 вопросов · ~5 минут</p>
              </div>
              <ChevronRight className="w-4 h-4 text-accent" />
            </div>
          </Link>
        )}
      </div>

      {/* XP / Level card */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="section-header mb-0.5">Уровень {levelInfo.level} — {levelInfo.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-[14px] font-bold text-text-primary">{xp.toLocaleString()} XP</span>
              </div>
              <span className="text-text-subtle text-[13px]">/ {levelInfo.next.toLocaleString()}</span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base"
            style={{ background: LEVEL_COLORS[level] ?? "rgb(var(--ios-accent))" }}
          >
            {level}
          </div>
        </div>
        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${levelInfo.progress}%`,
              background: LEVEL_COLORS[level] ?? "rgb(var(--ios-accent))",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-text-muted">{levelInfo.current.toLocaleString()} XP</span>
          <span className="text-[11px] text-text-muted">{(levelInfo.next - levelInfo.current).toLocaleString()} до следующего</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Flame,    label: 'Стрик',    value: streak,        unit: 'дней', color: '#FF9500', bg: '#FF950020' },
          { icon: BookOpen, label: 'Слова',    value: vocabCount,    unit: 'слов', color: '#34C759', bg: '#34C75920' },
          { icon: Target,   label: 'Цель',     value: goalPct,       unit: '%',    color: '#6366F1', bg: '#6366F120' },
          { icon: Clock,    label: 'Сегодня',  value: minutesToday,  unit: 'мин',  color: '#007AFF', bg: '#007AFF20' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="ios-icon" style={{ background: s.bg, color: s.color }}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{s.unit}</span>
            </div>
            <div className="text-[28px] font-black text-text-primary leading-none">{s.value.toLocaleString()}</div>
            <div className="text-[12px] text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="section-header mb-2">Быстрый доступ</p>
        <div className="grid grid-cols-5 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href}>
              <div className="card flex flex-col items-center gap-1.5 py-3 px-1">
                <div className="ios-icon w-9 h-9" style={{ background: a.color + "20", color: a.color }}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-text-muted font-medium text-center leading-tight">{a.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue learning */}
      <div>
        <p className="section-header mb-2">Продолжить обучение</p>
        {nextLesson ? (
          <Link href={`/lessons?open=${nextLesson.id}`}>
            <div className="card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-accent text-[11px]">{nextLesson.level}</span>
                <span className="text-[12px] text-text-muted">Блок {nextLesson.block} · {nextLesson.duration}</span>
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">{nextLesson.title}</p>
              <p className="text-[13px] text-text-muted mb-3">{nextLesson.blockName}</p>
              <div>
                <div className="flex justify-between text-[11px] text-text-muted mb-1">
                  <span>{completedCount} из {LESSONS.length} уроков</span>
                  <span>{Math.round(completedCount / LESSONS.length * 100)}%</span>
                </div>
                <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${Math.round(completedCount / LESSONS.length * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="card p-4 flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="text-[14px] font-semibold text-text-primary">Все уроки завершены!</p>
              <p className="text-[12px] text-text-muted">Уровень C1 достигнут</p>
            </div>
          </div>
        )}
      </div>

      {/* Word of day */}
      <WordOfDay />

      {/* Daily review */}
      <DailyReview />

      {/* Today recommendations */}
      <div>
        <p className="section-header mb-2">Сегодня</p>
        <div className="ios-list">
          {[
            { emoji: '📖', text: nextLesson ? nextLesson.title : 'Продолжи урок', sub: nextLesson ? `${nextLesson.level} · Блок ${nextLesson.block}` : 'Следующий урок', href: nextLesson ? `/lessons?open=${nextLesson.id}` : '/lessons', color: '#6366F1' },
            { emoji: '🔤', text: `Словарь${vocabDue > 0 ? ` · ${vocabDue} к повторению` : ''}`, sub: vocabDue > 0 ? 'Пора повторить!' : 'Все изучены', href: '/vocabulary', color: '#34C759' },
            { emoji: '✍️', text: 'Письмо', sub: 'Напиши текст — AI проверит', href: '/writing', color: '#FF9500' },
            { emoji: '🎧', text: 'Аудирование', sub: 'Слушай и отвечай на вопросы', href: '/listening', color: '#FF3B30' },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <div className="ios-list-item">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: item.color + "15" }}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-text-primary">{item.text}</p>
                  <p className="text-[12px] text-text-muted">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-subtle opacity-60 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Tutor CTA */}
      <Link href="/ai-tutor">
        <div className="rounded-2xl p-5 text-white overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, rgb(var(--ios-accent)), #8B5CF6)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
              👨‍🏫
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wider mb-0.5">AI Tutor</p>
              <p className="text-[17px] font-bold">Chat with Zhan</p>
              <p className="text-white/70 text-[13px]">Практикуй разговорный английский</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/70 shrink-0" />
          </div>
        </div>
      </Link>

      {/* Activity chart */}
      {streakData && (
        <div>
          <p className="section-header mb-2">Активность</p>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-text-primary">7 дней</span>
              <span className="text-[12px] text-text-muted">{streakData.currentStreak} 🔥 подряд</span>
            </div>
            {(() => {
              const days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const iso = d.toISOString().slice(0, 10)
                const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2)
                const mins = streakData.history[iso] ?? 0
                return { iso, dayName, mins }
              })
              const maxMins = Math.max(...days.map(d => d.mins), 1)
              return (
                <div className="flex items-end gap-2 h-20">
                  {days.map((d) => (
                    <div key={d.iso} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: 56 }}>
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: d.mins > 0 ? `${Math.max(8, Math.round((d.mins / maxMins) * 56))}px` : '4px',
                            background: d.mins > 0
                              ? 'rgb(var(--ios-accent))'
                              : 'rgb(var(--ios-bg-secondary))',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted">{d.dayName}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <StreakWidget />

      {/* Recent conversations */}
      {recentConvs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="section-header">Недавние чаты</p>
            <Link href="/ai-tutor" className="text-[13px] text-accent font-medium">Все →</Link>
          </div>
          <div className="ios-list">
            {recentConvs.map((conv) => (
              <Link key={conv.id} href="/ai-tutor">
                <div className="ios-list-item">
                  <div className="ios-icon" style={{ background: "rgb(var(--ios-accent-light))", color: "rgb(var(--ios-accent))" }}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary truncate">{conv.title || 'Разговор с Zhan'}</p>
                    <p className="text-[12px] text-text-muted">
                      {new Date(conv.updated_at).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-subtle opacity-60" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Progress link */}
      <Link href="/progress">
        <div className="ios-list">
          <div className="ios-list-item">
            <div className="ios-icon" style={{ background: "#34C75920", color: "#34C759" }}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-text-primary">Полный прогресс</p>
              <p className="text-[12px] text-text-muted">Уровень {level} · {xp.toLocaleString()} XP</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-subtle opacity-60" />
          </div>
        </div>
      </Link>
    </div>
  )
}
