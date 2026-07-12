'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Volume2, Check, X, Layers, BookOpen } from 'lucide-react'
import { VOCABULARY, getWordsForLesson, type VocabWord } from '@/lib/vocabulary-data'
import { speak, stopSpeaking } from '@/lib/speech'

const STORAGE_KEY = 'fluenta_vocab_srs'

interface CardState {
  id: string
  box: number
  nextReview: string
  lastResult?: 'correct' | 'incorrect'
}

type SRSState = Record<string, CardState>

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nextReviewDate(box: number): string {
  const intervals = [0, 1, 3, 7, 14, 30]
  const days = intervals[Math.min(box, intervals.length - 1)]
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function loadSRS(): SRSState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveSRS(state: SRSState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function getDueCards(all: VocabWord[], srs: SRSState): VocabWord[] {
  const today = todayISO()
  return all.filter(w => {
    const cs = srs[w.id]
    if (!cs) return true
    if (cs.box >= 5) return false
    return cs.nextReview <= today
  })
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const BOX_LABELS = ['Новые', 'День 1', 'День 3', 'Нед. 1', 'Нед. 2', 'Выучены']
const BOX_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#10b981']

const LESSON_NAMES: Record<string, string> = {
  'a1-1-1': 'To Be',
  'a1-1-2': 'Знакомство',
  'a1-1-3': 'Числа',
  'a1-1-4': 'Дни недели',
  'a1-1-5': 'Цвета',
  'a1-2-6': 'Have got',
  'a1-2-7': 'Семья',
  'a1-2-8': 'Дом',
  'a1-2-9': 'Предлоги места',
  'a1-2-10': 'There is / There are',
  'a1-3-11': 'Present Simple',
  'a1-3-12': 'Наречия частоты',
  'a1-3-13': 'Время',
  'a1-3-14': 'Глаголы действия',
  'a1-3-15': 'Present Continuous',
}

const LESSON_IDS = Object.keys(LESSON_NAMES)

export default function VocabularyPage() {
  const [srs, setSRS] = useState<SRSState>({})
  const [queue, setQueue] = useState<VocabWord[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<'study' | 'stats' | 'lessons'>('study')
  const [hydrated, setHydrated] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [lessonWords, setLessonWords] = useState<VocabWord[]>([])
  const [lessonIdx, setLessonIdx] = useState(0)
  const [lessonFlipped, setLessonFlipped] = useState(false)

  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    const loaded = loadSRS()
    setSRS(loaded)
    const due = shuffle(getDueCards(VOCABULARY, loaded))
    setQueue(due.slice(0, 20))
    setHydrated(true)
  }, [])

  const card = queue[qIdx]
  const done = qIdx >= queue.length
  const totalDue = queue.length

  async function handleListen(word: string) {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(true)
    await speak(word, { rate: 0.9, onEnd: () => setSpeaking(false) })
  }

  function handleAnswer(correct: boolean) {
    if (!card) return
    const existing = srs[card.id]
    const currentBox = existing?.box ?? 0
    const newBox = correct ? Math.min(currentBox + 1, 5) : 0
    const updated = {
      ...srs,
      [card.id]: {
        id: card.id,
        box: newBox,
        nextReview: nextReviewDate(newBox),
        lastResult: correct ? 'correct' : 'incorrect',
      } as CardState,
    }
    setSRS(updated)
    saveSRS(updated)
    setFlipped(false)
    setTimeout(() => setQIdx(i => i + 1), 150)
  }

  function restart() {
    const loaded = loadSRS()
    const due = shuffle(getDueCards(VOCABULARY, loaded))
    setQueue(due.slice(0, 20))
    setQIdx(0)
    setFlipped(false)
  }

  function openLesson(id: string) {
    setSelectedLesson(id)
    setLessonWords(getWordsForLesson(id, 8))
    setLessonIdx(0)
    setLessonFlipped(false)
  }

  function reshuffleLesson() {
    if (!selectedLesson) return
    setLessonWords(getWordsForLesson(selectedLesson, 8))
    setLessonIdx(0)
    setLessonFlipped(false)
  }

  const boxCounts = [0, 1, 2, 3, 4, 5].map(b =>
    VOCABULARY.filter(w => (srs[w.id]?.box ?? 0) === b).length
  )
  const totalLearned = VOCABULARY.filter(w => (srs[w.id]?.box ?? 0) >= 5).length

  if (!hydrated) return null

  const lessonCard = lessonWords[lessonIdx]
  const lessonDone = lessonIdx >= lessonWords.length

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Словарь</span></h1>
          <p className="text-[#64748b] text-sm">{VOCABULARY.length} слов • Метод Leitner</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMode('study')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'study' ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : 'border-white/10 text-[#64748b]'}`}>
            Учить
          </button>
          <button onClick={() => setMode('lessons')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'lessons' ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : 'border-white/10 text-[#64748b]'}`}>
            По урокам
          </button>
          <button onClick={() => setMode('stats')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'stats' ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : 'border-white/10 text-[#64748b]'}`}>
            Прогресс
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      {mode === 'stats' && (
        <div className="space-y-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Всего выучено</span>
              <span className="text-2xl font-bold text-[#10b981]">{totalLearned} <span className="text-[#475569] text-base font-normal">/ {VOCABULARY.length}</span></span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#10b981] transition-all duration-1000"
                style={{ width: `${(totalLearned / VOCABULARY.length) * 100}%` }} />
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Ящики Leitner</h3>
            <div className="space-y-2">
              {BOX_LABELS.map((label, b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-medium" style={{ color: BOX_COLORS[b] }}>{label}</div>
                  <div className="flex-1 h-5 bg-white/[0.04] rounded-lg overflow-hidden">
                    <motion.div className="h-full rounded-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${(boxCounts[b] / Math.max(VOCABULARY.length, 1)) * 100}%` }}
                      transition={{ duration: 0.6, delay: b * 0.08 }}
                      style={{ backgroundColor: `${BOX_COLORS[b]}60` }} />
                  </div>
                  <span className="text-[#64748b] text-xs w-8 text-right">{boxCounts[b]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LESSONS ── */}
      {mode === 'lessons' && !selectedLesson && (
        <div className="space-y-2">
          {LESSON_IDS.map((id, i) => {
            const count = VOCABULARY.filter(w => w.lessonId === id).length
            const learned = VOCABULARY.filter(w => w.lessonId === id && (srs[w.id]?.box ?? 0) >= 5).length
            return (
              <button key={id} onClick={() => openLesson(id)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#6366f1]/40 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6366f1]/20 flex items-center justify-center text-[#818cf8] text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{LESSON_NAMES[id]}</p>
                    <p className="text-[#475569] text-xs">{count} слов</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[#10b981] text-xs font-medium">{learned}/{count}</p>
                    <p className="text-[#475569] text-[10px]">выучено</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-[#475569]" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {mode === 'lessons' && selectedLesson && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => setSelectedLesson(null)} className="text-[#64748b] hover:text-white text-sm transition-colors mb-1 flex items-center gap-1">
                ← Все уроки
              </button>
              <h2 className="text-white font-bold">{LESSON_NAMES[selectedLesson]}</h2>
              <p className="text-[#475569] text-xs">{lessonWords.length} из {VOCABULARY.filter(w => w.lessonId === selectedLesson).length} слов</p>
            </div>
            <button onClick={reshuffleLesson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-xs transition-colors">
              <RotateCcw className="w-3 h-3" /> Показать другие слова
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[#64748b] text-sm">{Math.min(lessonIdx, lessonWords.length)} / {lessonWords.length}</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all"
                style={{ width: `${Math.min(lessonIdx / lessonWords.length, 1) * 100}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {lessonDone && (
              <motion.div key="lesson-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white/[0.04] border border-white/10 rounded-2xl">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-white font-bold text-xl mb-2">Урок завершён!</h2>
                <p className="text-[#64748b] mb-6">Ты прошёл {lessonWords.length} слов</p>
                <button onClick={reshuffleLesson}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition-opacity">
                  Ещё раз
                </button>
              </motion.div>
            )}

            {!lessonDone && lessonCard && (
              <motion.div key={`lesson-${lessonCard.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div className="relative h-56 cursor-pointer" onClick={() => setLessonFlipped(v => !v)}
                  style={{ perspective: '1000px' }}>
                  <motion.div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: lessonFlipped ? 180 : 0 }} transition={{ duration: 0.4 }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 rounded-2xl flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}>
                      <p className="text-white text-3xl font-bold mb-3">{lessonCard.word}</p>
                      <p className="text-[#64748b] text-sm">Нажми, чтобы увидеть перевод</p>
                      <button onClick={e => { e.stopPropagation(); handleListen(lessonCard.word) }}
                        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                        <Volume2 className="w-4 h-4" /> Послушать
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-[#94a3b8] text-sm mb-1">Перевод</p>
                      <p className="text-white text-2xl font-bold mb-4">{lessonCard.translation}</p>
                      <p className="text-[#64748b] text-sm text-center italic">"{lessonCard.example}"</p>
                      <p className="text-[#475569] text-xs text-center mt-1">{lessonCard.exampleTranslation}</p>
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {lessonFlipped && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 mt-4">
                      <button onClick={() => { setLessonFlipped(false); setTimeout(() => setLessonIdx(i => i + 1), 150) }}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171] font-semibold hover:bg-[#ef4444]/25 transition-colors">
                        <X className="w-5 h-5" /> Не знаю
                      </button>
                      <button onClick={() => { setLessonFlipped(false); setTimeout(() => setLessonIdx(i => i + 1), 150) }}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-semibold hover:bg-[#10b981]/25 transition-colors">
                        <Check className="w-5 h-5" /> Знаю
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── SRS STUDY ── */}
      {mode === 'study' && (
        <>
          {totalDue > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#64748b] text-sm">{Math.min(qIdx, totalDue)} / {totalDue} карточек</span>
                <button onClick={restart}
                  className="flex items-center gap-1 text-xs text-[#475569] hover:text-[#94a3b8] transition-colors">
                  <RotateCcw className="w-3 h-3" /> Обновить
                </button>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all"
                  style={{ width: `${Math.min(qIdx / totalDue, 1) * 100}%` }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {done && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white/[0.04] border border-white/10 rounded-2xl">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-white font-bold text-xl mb-2">Сессия завершена!</h2>
                <p className="text-[#64748b] mb-6">{totalDue > 0 ? `Ты прошёл ${totalDue} карточек` : 'Нет карточек для повторения'}</p>
                <button onClick={restart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition-opacity">
                  {totalDue > 0 ? 'Ещё раз' : 'Обновить'}
                </button>
              </motion.div>
            )}

            {!done && totalDue === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/[0.04] border border-white/10 rounded-2xl">
                <Layers className="w-10 h-10 mx-auto mb-3 text-[#475569]" />
                <h2 className="text-white font-bold mb-2">Всё повторено!</h2>
                <p className="text-[#64748b] text-sm">Возвращайся позже или пройди уроки, чтобы добавить слова.</p>
              </motion.div>
            )}

            {!done && card && (
              <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div className="relative h-56 cursor-pointer" onClick={() => setFlipped(v => !v)}
                  style={{ perspective: '1000px' }}>
                  <motion.div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 rounded-2xl flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}>
                      <p className="text-white text-3xl font-bold mb-3">{card.word}</p>
                      <p className="text-[#64748b] text-sm">Нажми, чтобы увидеть перевод</p>
                      <button onClick={e => { e.stopPropagation(); handleListen(card.word) }}
                        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                        <Volume2 className="w-4 h-4" /> {speaking ? '⏹ Стоп' : 'Послушать'}
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-[#94a3b8] text-sm mb-1">Перевод</p>
                      <p className="text-white text-2xl font-bold mb-4">{card.translation}</p>
                      <p className="text-[#64748b] text-sm text-center italic">"{card.example}"</p>
                      <p className="text-[#475569] text-xs text-center mt-1">{card.exampleTranslation}</p>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 mt-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map(b => (
                    <div key={b} className="w-2 h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: (srs[card.id]?.box ?? 0) === b ? BOX_COLORS[b] : 'rgba(255,255,255,0.1)',
                        transform: (srs[card.id]?.box ?? 0) === b ? 'scale(1.3)' : 'scale(1)',
                      }} />
                  ))}
                  <span className="text-[#475569] text-xs ml-1">{BOX_LABELS[srs[card.id]?.box ?? 0]}</span>
                </div>

                <AnimatePresence>
                  {flipped && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 mt-4">
                      <button onClick={() => handleAnswer(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171] font-semibold hover:bg-[#ef4444]/25 transition-colors">
                        <X className="w-5 h-5" /> Не знаю
                      </button>
                      <button onClick={() => handleAnswer(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-semibold hover:bg-[#10b981]/25 transition-colors">
                        <Check className="w-5 h-5" /> Знаю
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
