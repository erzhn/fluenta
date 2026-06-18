'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Loader2, RotateCcw, Trash2, Calendar, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { VocabWord } from '@/types'

// ── Glassmorphism helper ───────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

// ── Simple SRS constants (days) ───────────────────────────────────────────────
const SRS = { hard: 1, good: 3, easy: 7 } as const
type Rating = keyof typeof SRS

// ── Helpers ────────────────────────────────────────────────────────────────────
function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
}

function nextReviewLabel(iso: string): string {
  const d = daysUntil(iso)
  if (d <= 0) return 'Due now'
  if (d === 1) return 'Tomorrow'
  if (d < 7) return `In ${d} days`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isDue(iso: string): boolean {
  return new Date(iso) <= new Date()
}

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

// ── Animation variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const } }),
}

// ──────────────────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [words, setWords] = useState<VocabWord[]>([])
  const [loading, setLoading] = useState(true)

  // Add-word form
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [saving, setSaving] = useState(false)
  const [addError, setAddError] = useState('')

  // Review mode
  const [reviewing, setReviewing] = useState(false)
  const [reviewQueue, setReviewQueue] = useState<VocabWord[]>([])
  const [reviewIdx, setReviewIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  // ── Load user + words ──────────────────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }
      setUserId(session.user.id)

      const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setWords(data ?? [])
      setLoading(false)
    })()
  }, [])

  const dueWords = words.filter((w) => isDue(w.next_review))
  const totalWords = words.length

  // ── Add word ───────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async () => {
    if (!word.trim() || !translation.trim()) {
      setAddError('Word and translation are required.')
      return
    }
    if (!userId) return
    setSaving(true)
    setAddError('')

    const payload = {
      user_id: userId,
      word: word.trim(),
      translation: translation.trim(),
      context: example.trim() || null,
      next_review: addDays(1),
      interval: 1,
      ease_factor: 2.5,
      repetitions: 0,
      difficulty: 3,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('vocabulary').insert(payload).select().single()
    if (error) {
      setAddError('Failed to save. Please try again.')
    } else if (data) {
      setWords((prev) => [data as VocabWord, ...prev])
      setWord('')
      setTranslation('')
      setExample('')
    }
    setSaving(false)
  }, [word, translation, example, userId])

  // ── Delete word ────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    await supabase.from('vocabulary').delete().eq('id', id)
    setWords((prev) => prev.filter((w) => w.id !== id))
  }, [])

  // ── Start review ───────────────────────────────────────────────────────────
  function startReview() {
    const queue = [...dueWords].sort(() => Math.random() - 0.5)
    setReviewQueue(queue)
    setReviewIdx(0)
    setFlipped(false)
    setReviewed(0)
    setReviewDone(false)
    setReviewing(true)
  }

  // ── Rate card ──────────────────────────────────────────────────────────────
  async function rateCard(rating: Rating) {
    const current = reviewQueue[reviewIdx]
    if (!current) return

    const days = SRS[rating]
    const updates = {
      next_review: addDays(days),
      interval: days,
      repetitions: (current.repetitions ?? 0) + 1,
    }

    await supabase.from('vocabulary').update(updates).eq('id', current.id)
    setWords((prev) => prev.map((w) => w.id === current.id ? { ...w, ...updates } : w))
    setReviewed((n) => n + 1)

    const next = reviewIdx + 1
    if (next >= reviewQueue.length) {
      setReviewDone(true)
    } else {
      setReviewIdx(next)
      setFlipped(false)
    }
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  // ── Review mode ────────────────────────────────────────────────────────────
  if (reviewing) {
    return (
      <ReviewView
        queue={reviewQueue}
        idx={reviewIdx}
        flipped={flipped}
        done={reviewDone}
        reviewed={reviewed}
        onFlip={() => setFlipped(true)}
        onRate={rateCard}
        onExit={() => setReviewing(false)}
      />
    )
  }

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Vocabulary 📝</h1>
            <p className="text-[#64748b] text-sm mt-1">Build your word bank and review with flashcards</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`${glass} rounded-xl px-4 py-2.5 text-center`}>
              <div className="text-xl font-black text-white">{totalWords}</div>
              <div className="text-[#64748b] text-[10px] uppercase tracking-wider">Words</div>
            </div>
            <div className={`${glass} rounded-xl px-4 py-2.5 text-center`}>
              <div className="text-xl font-black" style={{ color: dueWords.length > 0 ? '#f97316' : '#10b981' }}>
                {dueWords.length}
              </div>
              <div className="text-[#64748b] text-[10px] uppercase tracking-wider">Due today</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Review CTA ─────────────────────────────────────────────────────── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`relative rounded-2xl overflow-hidden ${dueWords.length > 0 ? '' : glass}`}>
          {dueWords.length > 0 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20" />
              <div className="absolute inset-0 border border-[#6366f1]/30 rounded-2xl pointer-events-none" />
            </>
          )}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
            <div>
              <h3 className="text-white font-bold text-sm">
                {dueWords.length > 0
                  ? `⏰ ${dueWords.length} card${dueWords.length !== 1 ? 's' : ''} ready for review`
                  : '✅ All caught up!'}
              </h3>
              <p className="text-[#64748b] text-xs mt-0.5">
                {dueWords.length > 0
                  ? 'Review now to keep your memory sharp'
                  : 'No cards due. Come back tomorrow!'}
              </p>
            </div>
            {dueWords.length > 0 && (
              <button
                onClick={startReview}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.03] shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                Review Cards ({dueWords.length})
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Add word form ───────────────────────────────────────────────────── */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <div className={`${glass} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#6366f120] flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#6366f1]" />
            </div>
            <h2 className="text-white font-bold text-sm">Add new word</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[#64748b] text-xs font-medium mb-1.5 block">English word *</label>
              <input
                value={word}
                onChange={(e) => { setWord(e.target.value); setAddError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. perseverance"
                className="w-full bg-white/[0.06] border border-white/10 hover:border-white/20 focus:border-[#6366f1] rounded-xl px-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[#64748b] text-xs font-medium mb-1.5 block">Translation *</label>
              <input
                value={translation}
                onChange={(e) => { setTranslation(e.target.value); setAddError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. настойчивость"
                className="w-full bg-white/[0.06] border border-white/10 hover:border-white/20 focus:border-[#6366f1] rounded-xl px-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[#64748b] text-xs font-medium mb-1.5 block">Example sentence <span className="text-[#334155]">(optional)</span></label>
            <input
              value={example}
              onChange={(e) => setExample(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Her perseverance paid off in the end."
              className="w-full bg-white/[0.06] border border-white/10 hover:border-white/20 focus:border-[#6366f1] rounded-xl px-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
            />
          </div>

          <AnimatePresence>
            {addError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[#ef4444] text-xs mb-3"
              >
                {addError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleAdd}
            disabled={!word.trim() || !translation.trim() || saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm disabled:opacity-50 hover:from-[#5558e3] hover:to-[#7c3aed] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Word
          </button>
        </div>
      </motion.div>

      {/* ── Word list ───────────────────────────────────────────────────────── */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
            Your words {totalWords > 0 && `· ${totalWords}`}
          </h2>
        </div>

        {words.length === 0 ? (
          <div className={`${glass} rounded-2xl py-14 flex flex-col items-center gap-4 text-center`}>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">📝</div>
            <div>
              <p className="text-white font-semibold text-sm mb-1">No words yet</p>
              <p className="text-[#475569] text-xs">Add your first word above to get started!</p>
            </div>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {words.map((w, i) => (
                <WordCard key={w.id} word={w} index={i} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// ── WordCard ───────────────────────────────────────────────────────────────────
function WordCard({ word, index, onDelete }: { word: VocabWord; index: number; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false)
  const due = isDue(word.next_review)
  const mastered = (word.interval ?? 1) >= 21

  const badge = mastered
    ? { label: 'Mastered', color: '#10b981', bg: '#10b98118' }
    : word.repetitions === 0
    ? { label: 'New', color: '#6366f1', bg: '#6366f118' }
    : { label: 'Learning', color: '#f59e0b', bg: '#f59e0b18' }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors relative"
    >
      {/* Due indicator */}
      {due && !mastered && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f97316] to-[#ef4444]" />
      )}
      {mastered && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#10b981]" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-bold text-base leading-snug">{word.word}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
            {confirming ? (
              <button
                onClick={() => onDelete(word.id)}
                className="w-6 h-6 rounded-md bg-[#ef444420] flex items-center justify-center text-[#ef4444] hover:bg-[#ef444430] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                onBlur={() => setConfirming(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#334155] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <p className="text-[#94a3b8] text-sm mb-3">{word.translation}</p>

        {word.context && (
          <p className="text-[#64748b] text-xs italic leading-relaxed mb-3 line-clamp-2">
            &ldquo;{word.context}&rdquo;
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-[#475569]">
          <Calendar className="w-3 h-3" />
          {due && !mastered ? (
            <span className="text-[#f97316] font-semibold">Due for review</span>
          ) : (
            <span>{nextReviewLabel(word.next_review)}</span>
          )}
          {word.repetitions > 0 && (
            <span className="text-[#334155] ml-auto">{word.repetitions}× reviewed</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── ReviewView ─────────────────────────────────────────────────────────────────
function ReviewView({
  queue, idx, flipped, done, reviewed,
  onFlip, onRate, onExit,
}: {
  queue: VocabWord[]
  idx: number
  flipped: boolean
  done: boolean
  reviewed: number
  onFlip: () => void
  onRate: (r: Rating) => void
  onExit: () => void
}) {
  const total = queue.length
  const current = queue[idx]
  const progress = total > 0 ? ((done ? total : idx) / total) * 100 : 0

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-black text-lg">Flashcard Review</h2>
          <p className="text-[#64748b] text-xs mt-0.5">
            {done ? `Reviewed ${reviewed} card${reviewed !== 1 ? 's' : ''}` : `${idx + 1} of ${total}`}
          </p>
        </div>
        <button
          onClick={onExit}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#64748b] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden mb-8">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
        />
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          /* Done state */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${glass} rounded-3xl p-10 text-center`}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-white font-black text-2xl mb-2">Session complete!</h3>
            <p className="text-[#64748b] text-sm mb-8">
              You reviewed <span className="text-white font-bold">{reviewed}</span> card{reviewed !== 1 ? 's' : ''}. Great work!
            </p>
            <button
              onClick={onExit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.03]"
            >
              Back to vocabulary
            </button>
          </motion.div>
        ) : (
          /* Card */
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {/* Flashcard */}
            <div
              onClick={() => !flipped && onFlip()}
              className={`${glass} rounded-3xl p-8 min-h-[240px] flex flex-col items-center justify-center text-center cursor-pointer select-none mb-6 relative overflow-hidden transition-all hover:border-white/20`}
              style={{ cursor: flipped ? 'default' : 'pointer' }}
            >
              {/* Front hint */}
              {!flipped && (
                <p className="absolute top-4 text-[#334155] text-xs uppercase tracking-wider">
                  Tap to reveal translation
                </p>
              )}
              {flipped && (
                <p className="absolute top-4 text-[#6366f1] text-xs uppercase tracking-wider font-semibold">
                  Translation
                </p>
              )}

              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="text-4xl font-black text-white mb-3">{current?.word}</p>
                    {current?.context && (
                      <p className="text-[#475569] text-sm italic max-w-xs">
                        &ldquo;{current.context}&rdquo;
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="back" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
                    <p className="text-3xl font-black text-white">{current?.word}</p>
                    <p className="text-xl text-[#818cf8] font-bold">{current?.translation}</p>
                    {current?.context && (
                      <p className="text-[#64748b] text-sm italic max-w-xs">
                        &ldquo;{current.context}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 text-[#334155] text-xs">
                      <BookOpen className="w-3 h-3" />
                      {current?.repetitions ?? 0}× reviewed
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rating buttons */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {([
                    { rating: 'hard', emoji: '😰', label: 'Hard', sub: '1 day', color: '#ef4444', bg: '#ef444415' },
                    { rating: 'good', emoji: '👍', label: 'Good', sub: '3 days', color: '#f59e0b', bg: '#f59e0b15' },
                    { rating: 'easy', emoji: '😊', label: 'Easy', sub: '7 days', color: '#10b981', bg: '#10b98115' },
                  ] as const).map(({ rating, emoji, label, sub, color, bg }) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onRate(rating)}
                      className="flex flex-col items-center gap-1 py-4 rounded-2xl border transition-all font-semibold"
                      style={{ backgroundColor: bg, borderColor: `${color}30`, color }}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-sm font-bold">{label}</span>
                      <span className="text-[10px] opacity-60">{sub}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!flipped && (
              <button
                onClick={onFlip}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02]"
              >
                Show Answer
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
