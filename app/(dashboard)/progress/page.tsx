'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Zap, BookOpen, MessageSquare,
  Lock, Trophy, Calendar, ArrowRight, TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { StreakCalendar } from '@/components/StreakCalendar'
import { SkillsRadar } from '@/components/SkillsRadar'

// ── Glassmorphism helper ───────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

// ── CEFR level config with XP thresholds ──────────────────────────────────────
const CEFR = [
  { level: 'A1', min: 0,    max: 500,      color: '#10b981', bg: '#10b98120' },
  { level: 'A2', min: 500,  max: 1500,     color: '#3b82f6', bg: '#3b82f620' },
  { level: 'B1', min: 1500, max: 3000,     color: '#8b5cf6', bg: '#8b5cf620' },
  { level: 'B2', min: 3000, max: 5000,     color: '#f59e0b', bg: '#f59e0b20' },
  { level: 'C1', min: 5000, max: 8000,     color: '#ef4444', bg: '#ef444420' },
  { level: 'C2', min: 8000, max: Infinity, color: '#ec4899', bg: '#ec489920' },
]

function cefrFromXP(xp: number) {
  return CEFR.find((l) => xp >= l.min && xp < l.max) ?? CEFR[CEFR.length - 1]
}

function cefrProgress(xp: number) {
  const lvl = cefrFromXP(xp)
  if (!isFinite(lvl.max)) return { pct: 100, earned: xp - lvl.min, needed: 0 }
  const earned = xp - lvl.min
  const needed = lvl.max - lvl.min
  return { pct: Math.min(100, Math.round((earned / needed) * 100)), earned, needed }
}

function cefrNext(level: string) {
  const idx = CEFR.findIndex((l) => l.level === level)
  return idx >= 0 && idx < CEFR.length - 1 ? CEFR[idx + 1] : null
}

// ── Date helpers ───────────────────────────────────────────────────────────────
function last7Days(): { date: string; label: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    }
  })
}

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Animation ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface DayActivity { date: string; minutes: number; xp_earned: number }
interface RecentConv   { id: string; title: string; updated_at: string }

// ──────────────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [loading, setLoading] = useState(true)

  // profile
  const [xp, setXp]               = useState(0)
  const [streak, setStreak]        = useState(0)
  const [cefrLevel, setCefrLevel]  = useState('A1')

  // counts
  const [vocabCount, setVocabCount]       = useState(0)
  const [convCount, setConvCount]         = useState(0)
  const [lessonsCount, setLessonsCount]   = useState(0)

  // chart + activity
  const [weekData, setWeekData]       = useState<DayActivity[]>([])
  const [recentConvs, setRecentConvs] = useState<RecentConv[]>([])

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }
      const uid = session.user.id

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const [profRes, vocabRes, convRes, lessonsRes, activityRes] = await Promise.allSettled([
        supabase.from('profiles').select('xp,streak,current_level').eq('id', uid).single(),
        supabase.from('vocabulary').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('ai_conversations').select('id,title,updated_at').eq('user_id', uid).order('updated_at', { ascending: false }).limit(10),
        supabase.from('lessons_progress').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('completed', true),
        supabase.from('daily_activity').select('date,minutes,xp_earned').eq('user_id', uid).gte('date', weekAgo.toISOString().split('T')[0]).order('date'),
      ])

      if (profRes.status === 'fulfilled' && profRes.value.data) {
        const p = profRes.value.data
        setXp(p.xp ?? 0)
        setStreak(p.streak ?? 0)
        setCefrLevel(p.current_level ?? 'A1')
      }
      if (vocabRes.status === 'fulfilled')   setVocabCount(vocabRes.value.count ?? 0)
      if (convRes.status === 'fulfilled' && convRes.value.data) {
        setConvCount(convRes.value.data.length)
        setRecentConvs(convRes.value.data as RecentConv[])
      }
      if (lessonsRes.status === 'fulfilled') setLessonsCount(lessonsRes.value.count ?? 0)
      if (activityRes.status === 'fulfilled' && activityRes.value.data) {
        setWeekData(activityRes.value.data as DayActivity[])
      }

      setLoading(false)
    })()
  }, [])

  const lvlInfo   = cefrFromXP(xp)
  const lvlProg   = cefrProgress(xp)
  const nextLvl   = cefrNext(lvlInfo.level)
  const days      = last7Days()
  const maxMins   = Math.max(...weekData.map((d) => d.minutes), 1)

  const achievements = [
    {
      id: 'first_conv',
      emoji: '💬',
      title: 'First Conversation',
      desc: 'Chat with Zhan at least once',
      unlocked: convCount >= 1,
      progress: Math.min(100, convCount * 100),
    },
    {
      id: 'word_collector',
      emoji: '📚',
      title: 'Word Collector',
      desc: 'Add 10 words to vocabulary',
      unlocked: vocabCount >= 10,
      progress: Math.min(100, Math.round((vocabCount / 10) * 100)),
    },
    {
      id: 'week_warrior',
      emoji: '🔥',
      title: 'Week Warrior',
      desc: '7 day streak',
      unlocked: streak >= 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
    },
    {
      id: 'grammar_master',
      emoji: '✅',
      title: 'Grammar Master',
      desc: 'Complete 5 lessons',
      unlocked: lessonsCount >= 5,
      progress: Math.min(100, Math.round((lessonsCount / 5) * 100)),
    },
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-8">

      {/* ── 1. Header ──────────────────────────────────────────────────────── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My Progress 📈</h1>
            <p className="text-[#64748b] text-sm mt-1">Track your English learning journey</p>
          </div>
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-black shrink-0 self-start sm:self-auto"
            style={{ backgroundColor: lvlInfo.bg, color: lvlInfo.color, border: `1px solid ${lvlInfo.color}40` }}
          >
            <TrendingUp className="w-4 h-4" />
            Level {cefrLevel}
          </div>
        </div>
      </motion.div>

      {/* ── 2. Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Flame,          label: 'Current Streak', value: streak,     unit: streak === 1 ? 'day' : 'days', color: '#f97316', bg: '#f9731620' },
          { icon: Zap,            label: 'Total XP',       value: xp,         unit: 'xp',                          color: '#a855f7', bg: '#a855f720' },
          { icon: BookOpen,       label: 'Words Learned',  value: vocabCount, unit: 'words',                       color: '#06b6d4', bg: '#06b6d420' },
          { icon: MessageSquare,  label: 'Conversations',  value: convCount,  unit: 'chats',                       color: '#10b981', bg: '#10b98120' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <div className={`${glass} rounded-2xl p-4 sm:p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <s.icon style={{ color: s.color, width: 18, height: 18 }} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">{s.unit}</span>
              </div>
              <div className="text-3xl font-black text-white leading-none mb-1">{s.value.toLocaleString()}</div>
              <div className="text-xs text-[#64748b]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 3. CEFR Level progress bar ─────────────────────────────────────── */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-bold text-sm">Level Progress</h2>
              <p className="text-[#64748b] text-xs mt-0.5">
                {nextLvl
                  ? `${lvlProg.needed - lvlProg.earned} XP to reach ${nextLvl.level}`
                  : 'Maximum level reached!'}
              </p>
            </div>
            <div
              className="text-2xl font-black px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: lvlInfo.bg, color: lvlInfo.color }}
            >
              {lvlInfo.level}
            </div>
          </div>

          {/* Track with level markers */}
          <div className="relative mb-3">
            <div className="h-3 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lvlProg.pct}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${lvlInfo.color}cc, ${lvlInfo.color})` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#475569] mb-5">
            <span className="font-semibold" style={{ color: lvlInfo.color }}>{lvlInfo.level} · {lvlInfo.min.toLocaleString()} XP</span>
            <span className="font-semibold text-[#6366f1]">{xp.toLocaleString()} XP</span>
            {nextLvl && (
              <span>{nextLvl.level} · {lvlInfo.max.toLocaleString()} XP</span>
            )}
          </div>

          {/* All CEFR levels overview */}
          <div className="grid grid-cols-6 gap-1.5">
            {CEFR.map((l) => {
              const reached = xp >= l.min
              const current = lvlInfo.level === l.level
              return (
                <div
                  key={l.level}
                  className="rounded-lg py-2 text-center text-xs font-bold transition-all"
                  style={{
                    backgroundColor: reached ? l.bg : 'rgba(255,255,255,0.02)',
                    color: reached ? l.color : '#334155',
                    border: current ? `1px solid ${l.color}60` : '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {l.level}
                  {reached && !current && <div className="text-[8px] mt-0.5 opacity-60">✓</div>}
                  {current && <div className="text-[8px] mt-0.5">you</div>}
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ── 4. Weekly activity chart ────────────────────────────────────────── */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-bold text-sm">Weekly Activity</h2>
              <p className="text-[#64748b] text-xs mt-0.5">Minutes studied per day</p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs text-[#64748b] px-3 py-1.5 rounded-lg bg-white/[0.03]`}>
              <Calendar className="w-3.5 h-3.5" />
              Last 7 days
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-28">
            {days.map((day, i) => {
              const entry = weekData.find((d) => d.date === day.date)
              const mins = entry?.minutes ?? 0
              const barPct = maxMins > 0 ? (mins / maxMins) * 100 : 0
              const isToday = i === days.length - 1

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {/* Tooltip */}
                  {mins > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {mins} min
                    </div>
                  )}
                  {/* Bar */}
                  <div className="w-full rounded-t-md relative overflow-hidden" style={{ height: `${Math.max(barPct, 4)}%` }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-t-md origin-bottom"
                      style={{
                        background: mins > 0
                          ? (isToday ? 'linear-gradient(180deg, #818cf8, #6366f1)' : 'linear-gradient(180deg, #475569, #334155)')
                          : 'rgba(255,255,255,0.04)',
                      }}
                    />
                  </div>
                  {/* Day label */}
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isToday ? '#818cf8' : '#475569' }}
                  >
                    {day.label}
                  </span>
                </div>
              )
            })}
          </div>

          {weekData.length === 0 && (
            <p className="text-center text-[#334155] text-xs mt-3">
              No activity data yet · Start studying to see your chart!
            </p>
          )}
        </div>
      </motion.div>

      {/* ── 4b. Streak Calendar ────────────────────────────────────────────── */}
      <motion.div custom={6.5} variants={fadeUp} initial="hidden" animate="visible">
        <StreakCalendar activity={Object.fromEntries(
          weekData.map(d => [d.date, { date: d.date, minutes: d.minutes, xp: d.xp_earned }])
        )} />
      </motion.div>

      {/* ── 4c. Skills Radar ────────────────────────────────────────────────── */}
      <motion.div custom={6.7} variants={fadeUp} initial="hidden" animate="visible">
        <SkillsRadar skills={[
          { name: 'Грамматика',  value: Math.min(100, lessonsCount * 3),  max: 100, color: '#6366f1' },
          { name: 'Словарь',     value: Math.min(100, vocabCount * 2),    max: 100, color: '#8b5cf6' },
          { name: 'Чтение',      value: 40,                               max: 100, color: '#06b6d4' },
          { name: 'Аудирование', value: 30,                               max: 100, color: '#10b981' },
          { name: 'Письмо',      value: Math.min(100, convCount * 5),     max: 100, color: '#f59e0b' },
        ]} />
      </motion.div>

      {/* ── 5. Achievements ────────────────────────────────────────────────── */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-4 h-4 text-[#f59e0b]" />
            <h2 className="text-white font-bold text-sm">Achievements</h2>
            <span className="text-xs text-[#475569] ml-auto">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={`rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  ach.unlocked
                    ? 'bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border-[#6366f1]/30'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${ach.unlocked ? '' : 'grayscale opacity-40'}`}>
                    {ach.unlocked ? ach.emoji : <Lock className="w-5 h-5 text-[#334155]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-snug ${ach.unlocked ? 'text-white' : 'text-[#475569]'}`}>
                      {ach.title}
                    </p>
                    <p className="text-[#64748b] text-xs mt-0.5">{ach.desc}</p>
                  </div>
                  {ach.unlocked && (
                    <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#10b981] text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {!ach.unlocked && (
                  <div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ach.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                      />
                    </div>
                    <p className="text-[#334155] text-[10px] mt-1">{ach.progress}% complete</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 6. Recent activity ─────────────────────────────────────────────── */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl overflow-hidden`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-white font-bold text-sm">Recent Activity</h2>
            {recentConvs.length > 0 && (
              <Link href="/ai-tutor" className="text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {recentConvs.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">💬</div>
              <p className="text-white font-semibold text-sm">No activity yet</p>
              <p className="text-[#475569] text-xs">Start your first lesson or chat with Zhan!</p>
              <Link href="/ai-tutor">
                <button className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-bold hover:scale-[1.03] transition-transform shadow-lg shadow-indigo-500/20">
                  <MessageSquare className="w-4 h-4" />
                  Chat with Zhan
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentConvs.map((conv) => (
                <div key={conv.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-[#6366f120] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-[#6366f1]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{conv.title || 'Conversation with Zhan'}</p>
                    <p className="text-[#475569] text-xs mt-0.5">AI Conversation</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#475569] text-xs">{relativeDate(conv.updated_at)}</p>
                    <p className="text-[#6366f1] text-[10px] font-semibold mt-0.5">+20 XP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </div>
  )
}
