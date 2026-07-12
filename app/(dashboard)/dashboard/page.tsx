'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Flame, Zap, BookOpen, Clock, MessageSquare,
  ArrowRight, BookMarked, BarChart3, Target,
  Sparkles, ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StreakWidget, loadStreak, type StreakData } from '@/components/StreakWidget'

// ── Types ──────────────────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function displayName(profile: Profile | null, email: string | null, fullName?: string | null) {
  // 1. Profile name from DB
  if (profile?.name) return profile.name
  // 2. full_name from auth metadata
  if (fullName) return fullName.split(' ')[0]
  // 3. Email prefix — take first segment before dot/number, cap at 12 chars, capitalize
  if (email) {
    const prefix = email.split('@')[0].split(/[._\-0-9]/)[0]
    const capped = prefix.slice(0, 12)
    return capped.charAt(0).toUpperCase() + capped.slice(1)
  }
  return 'there'
}

// ── Animation helpers ──────────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

// ──────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [vocabCount, setVocabCount] = useState(0)
  const [recentConvs, setRecentConvs] = useState<RecentConv[]>([])
  const [loading, setLoading] = useState(true)
  const [localLevel, setLocalLevel] = useState<string | null>(null)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [vocabDue, setVocabDue] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalLevel(localStorage.getItem('fluenta_user_level'))
      setStreakData(loadStreak())
      // Count vocab due today
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
      setUserId(user.id)

      const [profileRes, vocabRes, convRes] = await Promise.all([
        supabase.from('profiles').select('name,streak,xp,current_level,daily_goal_minutes').eq('id', user.id).single(),
        supabase.from('vocabulary').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('ai_conversations').select('id,title,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(3),
      ])

      if (profileRes.data) setProfile(profileRes.data as Profile)
      setVocabCount(vocabRes.count ?? 0)
      if (convRes.data) setRecentConvs(convRes.data as RecentConv[])
      setLoading(false)
    }
    load()
  }, [])

  const name = displayName(profile, email, fullName)
  const streak = profile?.streak ?? 0
  const xp = profile?.xp ?? 0
  const level = profile?.current_level ?? 'A1'
  const goalMins = profile?.daily_goal_minutes ?? 20
  const minutesToday = 0 // no time-tracking table yet
  const goalPct = Math.min(100, Math.round((minutesToday / goalMins) * 100))

  const stats = [
    { icon: Flame,    label: 'Day Streak',    value: streak,      unit: streak === 1 ? 'day' : 'days', color: '#f97316', bg: '#f9731620' },
    { icon: Zap,      label: 'XP Total',      value: xp,          unit: 'xp',                          color: '#a855f7', bg: '#a855f720' },
    { icon: BookOpen, label: 'Words Learned', value: vocabCount,  unit: 'words',                       color: '#06b6d4', bg: '#06b6d420' },
    { icon: Clock,    label: 'Minutes Today', value: minutesToday, unit: 'min',                         color: '#10b981', bg: '#10b98120' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-xl animate-pulse">F</div>
          <p className="text-[#475569] text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">

      {/* ── 1. Welcome header ──────────────────────────────────────────────── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Привет, {name}! 👋
            </h1>
            <p className="text-[#64748b] text-sm mt-1">
              {localLevel
                ? `Твой уровень: ${localLevel} · ${streak > 0 ? `${streak}-дневный стрик 🔥` : 'Начни учиться!'}`
                : streak > 0 ? `${streak}-дневный стрик 🔥 Продолжай!` : 'Начни учиться сегодня!'}
            </p>
          </div>
          <div className={`${glass} rounded-xl px-4 py-2.5 text-sm text-[#64748b] shrink-0`}>
            📅 {todayLabel()}
          </div>
        </div>
        {!localLevel && (
          <Link href="/level-test">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/25 hover:bg-[#6366f1]/15 transition-colors cursor-pointer">
              <span className="text-lg">📊</span>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Определи свой уровень</p>
                <p className="text-[#64748b] text-xs">20 вопросов · ~5 минут · от A1 до C1</p>
              </div>
              <span className="text-[#818cf8] text-sm font-medium">Пройти тест →</span>
            </div>
          </Link>
        )}
      </motion.div>

      {/* ── 2. Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <div className={`${glass} rounded-2xl p-4 sm:p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <s.icon className="w-4.5 h-4.5" style={{ color: s.color, width: 18, height: 18 }} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">{s.unit}</span>
              </div>
              <div className="text-3xl font-black text-white leading-none mb-1">{s.value.toLocaleString()}</div>
              <div className="text-xs text-[#64748b]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 2b. XP Chart ───────────────────────────────────────────────────── */}
      {streakData && (
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <div className={`${glass} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Активность за 7 дней</h2>
              <span className="text-[#64748b] text-xs">{streakData.currentStreak} 🔥 день подряд</span>
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
                              ? 'linear-gradient(180deg, #8b5cf6, #6366f1)'
                              : 'rgba(255,255,255,0.06)',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#475569]">{d.dayName}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </motion.div>
      )}

      {/* ── 2c. Today's recommendations ────────────────────────────────────── */}
      <motion.div custom={5.5} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5`}>
          <h2 className="text-white font-bold text-sm mb-3">Сегодня</h2>
          <div className="space-y-2">
            {[
              { emoji: '📖', text: 'Продолжи урок', sub: 'Следующий незавершённый урок', href: '/lessons', color: '#6366f1' },
              { emoji: '🔤', text: `Словарный запас${vocabDue > 0 ? `: ${vocabDue} слов к повторению` : ''}`, sub: vocabDue > 0 ? 'Пора повторить!' : 'Все слова изучены', href: '/vocabulary', color: '#8b5cf6' },
              { emoji: '✍️', text: 'Практика письма', sub: 'Напиши текст — ИИ проверит', href: '/writing', color: '#10b981' },
              { emoji: '🎧', text: 'Аудирование', sub: 'Слушай и отвечай на вопросы', href: '/listening', color: '#3b82f6' },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{item.text}</p>
                    <p className="text-[#64748b] text-xs">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#334155] group-hover:text-white transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 3 + 5. Main two-column area ────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Chat with Zhan — spans 2 cols */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden h-full min-h-[180px]">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#4338ca]" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7">
              {/* Animated icon */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-xl">
                  👨‍🏫
                </div>
                {/* Pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-2xl border-2 border-white/40"
                />
                {/* Online dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] border-2 border-[#4338ca] rounded-full" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">AI Tutor</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-1.5">Chat with Zhan</h2>
                <p className="text-indigo-200 text-sm mb-5">Practice conversation with your personal AI English tutor — available 24/7.</p>
                <Link href="/ai-tutor">
                  <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#6366f1] font-bold text-sm hover:bg-white/95 transition-all hover:scale-[1.03] shadow-lg shadow-black/20">
                    Start chatting
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily goal */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <div className={`${glass} rounded-2xl p-5 h-full flex flex-col`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#10b98120] flex items-center justify-center">
                <Target className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-white font-bold text-sm">Daily Goal</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-5">
                <div className="text-4xl font-black text-white leading-none">{minutesToday}</div>
                <div className="text-[#64748b] text-sm mt-1">/ {goalMins} minutes today</div>
              </div>

              {/* Progress arc / bar */}
              <div className="relative">
                <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalPct}%` }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4]"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#475569] mt-1.5">
                  <span>0 min</span>
                  <span className="text-[#10b981] font-semibold">{goalPct}%</span>
                  <span>{goalMins} min</span>
                </div>
              </div>
            </div>

            <p className="text-[#475569] text-xs text-center mt-4 leading-relaxed">
              Complete {goalMins} minutes of English today to keep your streak alive.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── 4. Full nav grid (3×3) ─────────────────────────────────────────── */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Все разделы</h2>
          {localLevel && (
            <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
              style={{ backgroundColor: '#6366f120', color: '#818cf8' }}>
              Твой уровень: {localLevel}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { emoji: '📖', label: 'Уроки', href: '/lessons', color: '#6366f1' },
            { emoji: '🃏', label: 'Словарь', href: '/vocabulary', color: '#8b5cf6' },
            { emoji: '🎧', label: 'Аудирование', href: '/listening', color: '#3b82f6' },
            { emoji: '📄', label: 'Чтение', href: '/reading', color: '#06b6d4' },
            { emoji: '✍️', label: 'Письмо', href: '/writing', color: '#10b981' },
            { emoji: '🎤', label: 'Произношение', href: '/pronunciation', color: '#f59e0b' },
            { emoji: '📋', label: 'Грамматика', href: '/grammar', color: '#ef4444' },
            { emoji: '🤖', label: 'AI Репетитор', href: '/ai-tutor', color: '#a855f7' },
            { emoji: '📊', label: 'Тест уровня', href: '/level-test', color: '#f97316' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div whileHover={{ y: -3, scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={`group ${glass} rounded-2xl p-4 cursor-pointer flex flex-col items-center gap-2 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}18 0%, transparent 70%)` }} />
                <div className="text-2xl">{item.emoji}</div>
                <div className="text-white text-xs font-semibold leading-tight">{item.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── 5b. Streak Widget ──────────────────────────────────────────────── */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <StreakWidget />
      </motion.div>

      {/* ── 6. Recent Activity ─────────────────────────────────────────────── */}
      <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Recent Activity</h2>
          {recentConvs.length > 0 && (
            <Link href="/ai-tutor" className="text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors font-medium">
              View all →
            </Link>
          )}
        </div>

        <div className={`${glass} rounded-2xl overflow-hidden`}>
          {recentConvs.length === 0 ? (
            <div className="py-14 px-6 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">No activity yet</p>
                <p className="text-[#475569] text-xs">Start your first lesson or chat with Zhan to see your activity here.</p>
              </div>
              <Link href="/ai-tutor">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold hover:scale-[1.03] transition-transform shadow-lg shadow-indigo-500/25">
                  <MessageSquare className="w-4 h-4" />
                  Start first lesson
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {recentConvs.map((conv) => (
                <Link key={conv.id} href="/ai-tutor">
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-[#6366f120] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-[#6366f1]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{conv.title || 'Conversation with Zhan'}</p>
                      <p className="text-[#475569] text-xs mt-0.5">
                        {new Date(conv.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#334155] group-hover:text-white transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Level badge ────────────────────────────────────────────────────── */}
      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Current Level: <span className="text-[#818cf8]">{level}</span></p>
              <p className="text-[#475569] text-xs">Keep practicing to advance to the next level</p>
            </div>
          </div>
          <Link href="/progress">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#6366f1] hover:text-[#818cf8] transition-colors">
              <BarChart3 className="w-3.5 h-3.5" />
              View full progress
            </button>
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
