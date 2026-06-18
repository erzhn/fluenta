'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, X, BookOpen, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

// ── Lesson data ────────────────────────────────────────────────────────────────
const LEVELS_META: Record<string, { color: string; bg: string; desc: string }> = {
  A1: { color: '#10b981', bg: '#10b98120', desc: 'Beginner' },
  A2: { color: '#3b82f6', bg: '#3b82f620', desc: 'Elementary' },
  B1: { color: '#8b5cf6', bg: '#8b5cf620', desc: 'Intermediate' },
  B2: { color: '#f59e0b', bg: '#f59e0b20', desc: 'Upper-Intermediate' },
  C1: { color: '#ef4444', bg: '#ef444420', desc: 'Advanced' },
  C2: { color: '#ec4899', bg: '#ec489920', desc: 'Mastery' },
}

interface LessonItem {
  id: number
  title: string
  description: string
  duration: string
  xp: number
  icon: string
}

interface LevelGroup {
  level: string
  color: string
  lessons: LessonItem[]
}

const lessonsData: LevelGroup[] = [
  {
    level: 'A1',
    color: '#10b981',
    lessons: [
      { id: 1,  title: 'Greetings & Introductions', description: 'Learn to say hello, introduce yourself, and basic phrases', duration: '10 min', xp: 50,  icon: '👋' },
      { id: 2,  title: 'Numbers & Colors',           description: 'Count from 1-100 and name common colors',                                duration: '15 min', xp: 50,  icon: '🔢' },
      { id: 3,  title: 'Family & Friends',            description: 'Talk about your family members and relationships',                        duration: '12 min', xp: 75,  icon: '👨‍👩‍👧' },
      { id: 4,  title: 'Daily Routine',               description: 'Describe your everyday activities and schedule',                          duration: '15 min', xp: 75,  icon: '⏰' },
    ],
  },
  {
    level: 'A2',
    color: '#3b82f6',
    lessons: [
      { id: 5,  title: 'Past Simple Tense',           description: 'Talk about things that happened in the past',                             duration: '20 min', xp: 100, icon: '📅' },
      { id: 6,  title: 'Shopping & Money',            description: 'How to shop, ask prices, and handle money',                              duration: '18 min', xp: 100, icon: '🛍️' },
      { id: 7,  title: 'Food & Restaurants',          description: 'Order food, describe tastes, restaurant phrases',                         duration: '20 min', xp: 100, icon: '🍽️' },
    ],
  },
  {
    level: 'B1',
    color: '#8b5cf6',
    lessons: [
      { id: 8,  title: 'Present Perfect',             description: 'Connect past experiences to the present moment',                          duration: '25 min', xp: 150, icon: '✅' },
      { id: 9,  title: 'Travel & Transport',          description: 'Navigate airports, hotels, and new cities',                               duration: '22 min', xp: 150, icon: '✈️' },
      { id: 10, title: 'Opinions & Discussions',      description: 'Express your views and discuss topics confidently',                        duration: '25 min', xp: 150, icon: '💬' },
    ],
  },
  {
    level: 'B2',
    color: '#f59e0b',
    lessons: [
      { id: 11, title: 'Conditional Sentences',       description: 'If clauses, hypothetical situations, wishes',                             duration: '30 min', xp: 200, icon: '🤔' },
      { id: 12, title: 'Work & Career',               description: 'Professional vocabulary, job interviews, emails',                         duration: '28 min', xp: 200, icon: '💼' },
    ],
  },
  {
    level: 'C1',
    color: '#ef4444',
    lessons: [
      { id: 13, title: 'Advanced Grammar',            description: 'Inversions, cleft sentences, complex structures',                         duration: '35 min', xp: 300, icon: '📚' },
      { id: 14, title: 'Idiomatic English',           description: 'Master common idioms and natural expressions',                            duration: '30 min', xp: 300, icon: '🎯' },
    ],
  },
]

// ── Glassmorphism helper ───────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

// ── Animation variants ─────────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const },
  }),
}

// ── Modal state ────────────────────────────────────────────────────────────────
interface ActiveLesson extends LessonItem { level: string; levelColor: string }

// ──────────────────────────────────────────────────────────────────────────────
export default function LessonsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null)
  const [aiContent, setAiContent] = useState<string>('')
  const [aiLoading, setAiLoading] = useState(false)

  const filters = ['All', 'A1', 'A2', 'B1', 'B2', 'C1']
  const filtered = activeFilter === 'All'
    ? lessonsData
    : lessonsData.filter((g) => g.level === activeFilter)

  const totalLessons = lessonsData.reduce((s, g) => s + g.lessons.length, 0)

  async function openLesson(lesson: LessonItem, level: string, levelColor: string) {
    setActiveLesson({ ...lesson, level, levelColor })
    setAiContent('')
    setAiLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Please give me a concise English lesson on "${lesson.title}" for a ${level} level learner.

Structure your response as:
📖 **What you'll learn**
(2-3 sentences explaining the topic clearly)

🔑 **Key points**
• Point 1
• Point 2
• Point 3

💡 **Examples**
1. [Example sentence] — [brief explanation]
2. [Example sentence] — [brief explanation]
3. [Example sentence] — [brief explanation]

🚀 **Quick tip**
(One practical tip for remembering or using this)

Keep it encouraging and easy to understand!`,
          }],
        }),
      })
      const data = await res.json()
      setAiContent(data.reply || 'Could not generate content. Please try again.')
    } catch {
      setAiContent('Could not connect. Please check your internet and try again.')
    } finally {
      setAiLoading(false)
    }
  }

  function closeModal() {
    setActiveLesson(null)
    setAiContent('')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Lessons 📚</h1>
            <p className="text-[#64748b] text-sm mt-1">
              Choose your level and start learning · {totalLessons} lessons available
            </p>
          </div>
          <div className={`${glass} rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#a5b4fc] shrink-0`}>
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">AI-powered content</span>
          </div>
        </div>
      </motion.div>

      {/* ── Level filter tabs ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="flex gap-2 flex-wrap"
      >
        {filters.map((f) => {
          const active = activeFilter === f
          const meta = f !== 'All' ? LEVELS_META[f] : null
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                active
                  ? 'text-white border-transparent'
                  : 'border-white/10 text-[#64748b] hover:text-white hover:border-white/20'
              }`}
              style={active
                ? { backgroundColor: meta ? `${meta.color}25` : '#6366f125', borderColor: meta?.color ?? '#6366f1', color: meta?.color ?? '#818cf8' }
                : {}}
            >
              {f === 'All' ? 'All levels' : f}
              {meta && <span className="ml-1.5 text-[10px] font-normal opacity-70">{meta.desc}</span>}
            </button>
          )
        })}
      </motion.div>

      {/* ── Level groups ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-10"
        >
          {filtered.map((group) => {
            const meta = LEVELS_META[group.level]
            return (
              <section key={group.level}>
                {/* Level heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="px-3 py-1.5 rounded-lg text-sm font-black"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {group.level}
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm">{meta.desc}</span>
                    <span className="text-[#475569] text-xs ml-2">{group.lessons.length} lessons</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-white/[0.06] ml-2" />
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.lessons.map((lesson, i) => (
                    <motion.div
                      key={lesson.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <LessonCard
                        lesson={lesson}
                        color={group.color}
                        onStart={() => openLesson(lesson, group.level, group.color)}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Lesson modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeLesson && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50 bg-[#0f0f23] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* Modal header */}
              <div className="flex items-start gap-4 p-6 border-b border-white/[0.06] shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${activeLesson.levelColor}20` }}
                >
                  {activeLesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${activeLesson.levelColor}20`, color: activeLesson.levelColor }}
                    >
                      {activeLesson.level}
                    </span>
                    <span className="text-[#475569] text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{activeLesson.duration}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: activeLesson.levelColor }}>
                      <Zap className="w-3 h-3" />+{activeLesson.xp} XP
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white leading-snug">{activeLesson.title}</h2>
                  <p className="text-[#64748b] text-sm mt-0.5">{activeLesson.description}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#64748b] hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal content */}
              <div className="flex-1 overflow-y-auto p-6">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm">Zhan is preparing your lesson…</p>
                      <p className="text-[#475569] text-xs mt-1">Generating personalised content</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="prose prose-invert prose-sm max-w-none"
                  >
                    <LessonContent text={aiContent} />
                  </motion.div>
                )}
              </div>

              {/* Modal footer */}
              {!aiLoading && aiContent && (
                <div className="shrink-0 p-5 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
                  <Link href="/ai-tutor" className="flex-1" onClick={closeModal}>
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02]">
                      <span className="text-base">👨‍🏫</span>
                      Practice with Zhan
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl border border-white/10 text-[#64748b] hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── LessonCard component ───────────────────────────────────────────────────────
function LessonCard({ lesson, color, onStart }: { lesson: LessonItem; color: string; onStart: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      onClick={onStart}
      className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col hover:border-white/20 transition-colors"
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}12 0%, transparent 65%)` }}
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          {lesson.icon}
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-white transition-colors">
          {lesson.title}
        </h3>
        <p className="text-[#64748b] text-xs leading-relaxed mb-4 flex-1">{lesson.description}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="flex items-center gap-1 text-[#475569]">
            <Clock className="w-3 h-3" />{lesson.duration}
          </span>
          <span className="flex items-center gap-1 font-semibold" style={{ color }}>
            <Zap className="w-3 h-3" />+{lesson.xp} XP
          </span>
        </div>

        {/* Button */}
        <div
          className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all group-hover:shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)`, boxShadow: `0 0 0 0 ${color}40` }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Start Lesson
        </div>
      </div>
    </motion.div>
  )
}

// ── LessonContent: renders the AI markdown-ish text nicely ────────────────────
function LessonContent({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />

        // Bold section headers (e.g. 📖 **What you'll learn**)
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.+?)\*\*/g)
          return (
            <p key={i} className="text-sm leading-relaxed text-[#e2e8f0]">
              {parts.map((part, j) =>
                j % 2 === 1
                  ? <strong key={j} className="text-white font-bold">{part}</strong>
                  : <span key={j}>{part}</span>
              )}
            </p>
          )
        }

        // Bullet points
        if (line.startsWith('•') || line.startsWith('-')) {
          return (
            <div key={i} className="flex items-start gap-2.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-2 shrink-0" />
              <p className="text-sm text-[#cbd5e1] leading-relaxed">{line.replace(/^[•\-]\s*/, '')}</p>
            </div>
          )
        }

        // Numbered list
        if (/^\d+\./.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1]
          const rest = line.replace(/^\d+\.\s*/, '')
          return (
            <div key={i} className="flex items-start gap-3 pl-1">
              <span className="w-5 h-5 rounded-md bg-[#6366f120] text-[#818cf8] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{num}</span>
              <p className="text-sm text-[#cbd5e1] leading-relaxed">{rest}</p>
            </div>
          )
        }

        // Emoji headings (📖, 🔑, 💡, 🚀)
        if (/^[📖🔑💡🚀🎯✅⚡]/.test(line)) {
          return (
            <div key={i} className="flex items-center gap-2 pt-3 pb-1">
              <p className="text-base font-black text-white">{line}</p>
            </div>
          )
        }

        return (
          <p key={i} className="text-sm text-[#94a3b8] leading-relaxed">{line}</p>
        )
      })}
    </div>
  )
}
