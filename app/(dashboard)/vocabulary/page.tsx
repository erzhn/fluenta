'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { RotateCcw, Volume2, Check, X, Layers, BookOpen, Sparkles, Loader2, PenLine } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'
import { VOCABULARY, getWordsForLesson, type VocabWord } from '@/lib/vocabulary-data'
import { speak, stopSpeaking } from '@/lib/speech'
import { addCardToSR } from '@/lib/spaced-repetition'
import { supabase } from '@/lib/supabase'
import { awardXP, XP_REWARDS } from '@/lib/xp'

const STORAGE_KEY = 'fluenta_vocab_srs'
const OWN_EXAMPLES_KEY = 'fluenta_vocab_own_examples'

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

// ── SwipeCard ──────────────────────────────────────────────────────────────────
function SwipeCard({ word, onKnow, onLearn }: {
  word: VocabWord
  onKnow: () => void
  onLearn: () => void
}) {
  const controls = useAnimation()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const bgRight = useTransform(x, [0, 200], [0, 1])
  const bgLeft = useTransform(x, [-200, 0], [1, 0])

  async function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 100) {
      await controls.start({ x: 300, opacity: 0 })
      onKnow()
    } else if (info.offset.x < -100) {
      await controls.start({ x: -300, opacity: 0 })
      onLearn()
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div className="relative h-64 flex items-center justify-center">
      <motion.div style={{ opacity: bgRight }}
        className="absolute left-4 top-4 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-xl text-green-400 text-sm font-bold z-10">
        ✓ Знаю
      </motion.div>
      <motion.div style={{ opacity: bgLeft }}
        className="absolute right-4 top-4 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-sm font-bold z-10">
        ✗ Учу
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity }}
        className="w-full max-w-sm bg-white/[0.06] border border-white/10 rounded-2xl p-8
          cursor-grab active:cursor-grabbing select-none text-center"
      >
        <p className="text-3xl font-bold text-white mb-3">{word.word}</p>
        <p className="text-primary text-lg">{word.translation}</p>
        {word.example && <p className="text-muted-foreground text-sm mt-4 italic">&quot;{word.example}&quot;</p>}
        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <span>← Учу</span>
          <span className="text-[#334155]">· свайп ·</span>
          <span>Знаю →</span>
        </div>
      </motion.div>
    </div>
  )
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
  // B1 Thematic Vocabulary (English Vocabulary in Use)
  'b1-vocab-learning': 'B1 · Учёба и словарь',
  'b1-vocab-appearance': 'B1 · Внешность',
  'b1-vocab-character': 'B1 · Характер',
  'b1-vocab-feelings': 'B1 · Чувства и эмоции',
  'b1-vocab-family': 'B1 · Семья и отношения',
  'b1-vocab-home': 'B1 · Дом и жильё',
  'b1-vocab-weather': 'B1 · Погода',
  'b1-vocab-world': 'B1 · Физический мир',
  'b1-vocab-animals': 'B1 · Животные',
  'b1-vocab-body': 'B1 · Тело и движение',
}

const LESSON_IDS = Object.keys(LESSON_NAMES)

export default function VocabularyPage() {
  const [srs, setSRS] = useState<SRSState>({})
  const [queue, setQueue] = useState<VocabWord[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<'study' | 'stats' | 'lessons' | 'swipe' | 'mywords'>('study')
  const [swipeIdx, setSwipeIdx] = useState(0)
  const [swipeQueue, setSwipeQueue] = useState<VocabWord[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [lessonWords, setLessonWords] = useState<VocabWord[]>([])
  const [lessonIdx, setLessonIdx] = useState(0)
  const [lessonFlipped, setLessonFlipped] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [newTranslation, setNewTranslation] = useState('')
  const [newContext, setNewContext] = useState('')
  const [addingWord, setAddingWord] = useState(false)
  const [userWords, setUserWords] = useState<Array<{id:string,word:string,translation:string,context?:string}>>([])
  const [collocMap, setCollocMap] = useState<Map<string, string[]>>(new Map())
  const [loadingColloc, setLoadingColloc] = useState<string | null>(null)
  const xpAwardedRef = useRef(false)

  const [speaking, setSpeaking] = useState(false)
  const [ownExamples, setOwnExamples] = useState<Record<string, string>>({})
  const [showFiveMinHint, setShowFiveMinHint] = useState(false)
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiExamples, setAiExamples] = useState<string[]>([])
  async function getExamples(word: string) {
    setAiExamples([])
    const data = await generate<{sentences:string[]}>('vocabulary_example', word, 'B1')
    if (data?.sentences) setAiExamples(data.sentences)
  }

  async function loadUserWords() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data } = await supabase.from('vocabulary').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (data) setUserWords(data as Array<{id:string,word:string,translation:string,context?:string}>)
  }

  async function handleAddWord() {
    if (!newWord.trim() || !newTranslation.trim()) return
    setAddingWord(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { setAddingWord(false); return }
    await supabase.from('vocabulary').insert({
      user_id: session.user.id,
      word: newWord.trim(),
      translation: newTranslation.trim(),
      context: newContext.trim() || null,
      next_review: new Date().toISOString(),
      interval: 1,
      ease_factor: 2.5,
      repetitions: 0,
    })
    setNewWord(''); setNewTranslation(''); setNewContext('')
    setShowAddModal(false); setAddingWord(false)
    loadUserWords()
  }

  async function fetchCollocations(word: string) {
    if (collocMap.has(word)) return
    setLoadingColloc(word)
    const data = await generate<{collocations?: string[]}>('collocations', word, 'B1')
    if (data?.collocations) {
      setCollocMap(prev => new Map(prev).set(word, data.collocations!))
    }
    setLoadingColloc(null)
  }

  useEffect(() => {
    // Load SRS from Supabase (with localStorage fallback) for cross-device sync
    loadSRSFromSupabase().then(loaded => {
      setSRS(loaded)
      saveSRS(loaded) // keep local cache in sync
      const due = shuffle(getDueCards(VOCABULARY, loaded))
      setQueue(due.slice(0, 20))
      setSwipeQueue(shuffle(VOCABULARY).slice(0, 20))
      setHydrated(true)
    })
    loadUserWords()
    // Load own examples (principle 5: contextual anchoring)
    try {
      const raw = localStorage.getItem(OWN_EXAMPLES_KEY)
      if (raw) setOwnExamples(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  const card = queue[qIdx]
  const done = qIdx >= queue.length
  const totalDue = queue.length

  useEffect(() => {
    if (done && totalDue > 0 && !xpAwardedRef.current) {
      xpAwardedRef.current = true
      awardXP(XP_REWARDS.FLASHCARD_SESSION).catch(() => {})
    }
    if (!done) xpAwardedRef.current = false
  }, [done, totalDue])

  async function handleListen(word: string) {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(true)
    await speak(word, { rate: 0.9, onEnd: () => setSpeaking(false) })
  }

  // Sync a built-in word's SRS state to Supabase for cross-device persistence
  async function syncCardToSupabase(word: VocabWord, box: number, reviewDate: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const intervals = [0, 1, 3, 7, 14, 30]
    const interval = intervals[Math.min(box, intervals.length - 1)]
    // Upsert: if word exists update SRS fields, else insert new row
    const { data: existing } = await supabase.from('vocabulary')
      .select('id').eq('user_id', session.user.id).eq('word', word.word).single()
    if (existing) {
      await supabase.from('vocabulary').update({
        interval, ease_factor: box >= 3 ? 2.5 : 2.0, repetitions: box,
        next_review: new Date(reviewDate).toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('vocabulary').insert({
        user_id: session.user.id, word: word.word, translation: word.translation,
        context: word.example || null, interval,
        ease_factor: box >= 3 ? 2.5 : 2.0, repetitions: box,
        next_review: new Date(reviewDate).toISOString(),
      })
    }
  }

  // Load SRS from Supabase and merge with localStorage (Supabase wins)
  async function loadSRSFromSupabase(): Promise<SRSState> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return loadSRS()
    const { data } = await supabase.from('vocabulary')
      .select('word, repetitions, interval, next_review').eq('user_id', session.user.id)
    if (!data?.length) return loadSRS()
    const local = loadSRS()
    const merged: SRSState = { ...local }
    const intervals = [0, 1, 3, 7, 14, 30]
    data.forEach(row => {
      // Find matching word in VOCABULARY by text
      const vocabWord = VOCABULARY.find(v => v.word === row.word)
      if (vocabWord) {
        const box = intervals.indexOf(row.interval)
        merged[vocabWord.id] = {
          id: vocabWord.id,
          box: box >= 0 ? box : row.repetitions ?? 0,
          nextReview: row.next_review ? new Date(row.next_review).toISOString().slice(0, 10) : todayISO(),
        }
      }
    })
    return merged
  }

  function handleAnswer(correct: boolean) {
    if (!card) return
    const existing = srs[card.id]
    const currentBox = existing?.box ?? 0
    const newBox = correct ? Math.min(currentBox + 1, 5) : 0
    const reviewDate = nextReviewDate(newBox)
    const updated = {
      ...srs,
      [card.id]: {
        id: card.id,
        box: newBox,
        nextReview: reviewDate,
        lastResult: correct ? 'correct' : 'incorrect',
      } as CardState,
    }
    setSRS(updated)
    saveSRS(updated)
    // Async sync to Supabase (fire-and-forget, no await to keep UI fast)
    syncCardToSupabase(card, newBox, reviewDate).catch(() => {})
    setFlipped(false)
    setTimeout(() => setQIdx(i => i + 1), 150)
  }

  async function restart() {
    const loaded = await loadSRSFromSupabase()
    setSRS(loaded)
    saveSRS(loaded)
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
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Словарь</span></h1>
          <p className="text-muted-foreground text-sm">{VOCABULARY.length} слов • Метод Leitner</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button onClick={() => setMode('study')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'study' ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground'}`}>
            Учить
          </button>
          <button onClick={() => setMode('lessons')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'lessons' ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground'}`}>
            По урокам
          </button>
          <button onClick={() => setMode('swipe')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'swipe' ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground'}`}>
            Карточки
          </button>
          <button onClick={() => setMode('stats')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'stats' ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground'}`}>
            Прогресс
          </button>
          <button onClick={() => setMode('mywords')}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${mode === 'mywords' ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground'}`}>
            Мои слова{userWords.length > 0 && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/30">{userWords.length}</span>}
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl text-sm border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
            + Слово
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      {mode === 'stats' && (
        <div className="space-y-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Всего выучено</span>
              <span className="text-2xl font-bold text-[#10b981]">{totalLearned} <span className="text-muted-foreground text-base font-normal">/ {VOCABULARY.length}</span></span>
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
                  <span className="text-muted-foreground text-xs w-8 text-right">{boxCounts[b]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SWIPE ── */}
      {mode === 'swipe' && (
        <div className="space-y-4">
          {swipeIdx < swipeQueue.length ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Карточка {swipeIdx + 1} из {swipeQueue.length}</span>
                <button onClick={() => { setSwipeIdx(0); setSwipeQueue(shuffle(VOCABULARY).slice(0, 20)) }}
                  className="text-primary hover:text-[#818cf8] transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <SwipeCard
                key={swipeIdx}
                word={swipeQueue[swipeIdx]}
                onKnow={() => {
                  addCardToSR({ wordId: swipeQueue[swipeIdx].id, word: swipeQueue[swipeIdx].word, translation: swipeQueue[swipeIdx].translation, example: swipeQueue[swipeIdx].example })
                  setSwipeIdx(i => i + 1)
                }}
                onLearn={() => setSwipeIdx(i => i + 1)}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🎉</p>
              <p className="text-white font-semibold mb-1">Все карточки пройдены!</p>
              <p className="text-muted-foreground text-sm mb-4">Слова добавлены в интервальное повторение</p>
              <button onClick={() => { setSwipeIdx(0); setSwipeQueue(shuffle(VOCABULARY).slice(0, 20)) }}
                className="px-5 py-2.5 bg-primary hover:bg-[#5558e8] text-white rounded-xl text-sm font-medium transition-colors">
                Ещё раз
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MY WORDS ── */}
      {mode === 'mywords' && (
        <div className="space-y-3">
          {userWords.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.04] border border-white/10 rounded-2xl">
              <Layers className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-white font-bold mb-2">Нет сохранённых слов</h2>
              <p className="text-muted-foreground text-sm mb-4">Нажми «+ Слово», чтобы добавить своё слово</p>
              <button onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-[#5558e8] transition-colors">
                + Добавить слово
              </button>
            </div>
          ) : (
            userWords.map(w => (
              <div key={w.id} className="flex items-start justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div>
                  <p className="text-white font-medium">{w.word}</p>
                  <p className="text-muted-foreground text-sm">{w.translation}</p>
                  {w.context && <p className="text-muted-foreground text-xs italic mt-0.5">&quot;{w.context}&quot;</p>}
                </div>
              </div>
            ))
          )}
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
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/40 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-[#818cf8] text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{LESSON_NAMES[id]}</p>
                    <p className="text-muted-foreground text-xs">{count} слов</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[#10b981] text-xs font-medium">{learned}/{count}</p>
                    <p className="text-muted-foreground text-[10px]">выучено</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
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
              <button onClick={() => setSelectedLesson(null)} className="text-muted-foreground hover:text-white text-sm transition-colors mb-1 flex items-center gap-1">
                ← Все уроки
              </button>
              <h2 className="text-white font-bold">{LESSON_NAMES[selectedLesson]}</h2>
              <p className="text-muted-foreground text-xs">{lessonWords.length} из {VOCABULARY.filter(w => w.lessonId === selectedLesson).length} слов</p>
            </div>
            <button onClick={reshuffleLesson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-muted-foreground hover:text-white text-xs transition-colors">
              <RotateCcw className="w-3 h-3" /> Показать другие слова
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-muted-foreground text-sm">{Math.min(lessonIdx, lessonWords.length)} / {lessonWords.length}</span>
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
                <p className="text-muted-foreground mb-6">Ты прошёл {lessonWords.length} слов</p>
                <button onClick={reshuffleLesson}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition-opacity">
                  Ещё раз
                </button>
              </motion.div>
            )}

            {!lessonDone && lessonCard && (
              <motion.div key={`lesson-${lessonCard.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div className="relative h-64 cursor-pointer" onClick={() => setLessonFlipped(v => !v)}
                  style={{ perspective: '1000px' }}>
                  <motion.div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: lessonFlipped ? 180 : 0 }} transition={{ duration: 0.4 }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-primary/30 rounded-2xl flex flex-col items-center justify-center px-4"
                      style={{ backfaceVisibility: 'hidden' }}>
                      {lessonCard.partOfSpeech && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#818cf8]/80 bg-[#818cf8]/10 px-2.5 py-0.5 rounded-full mb-3">{lessonCard.partOfSpeech}</span>
                      )}
                      <p className="text-white text-3xl font-bold mb-2">{lessonCard.word}</p>
                      <p className="text-muted-foreground text-xs mb-4">Нажми, чтобы узнать значение</p>
                      <button onClick={e => { e.stopPropagation(); handleListen(lessonCard.word) }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1]/30 border border-[#6366f1]/50 text-[#a5b4fc] hover:bg-[#6366f1]/50 font-semibold text-sm transition-all">
                        <Volume2 className="w-4 h-4" /> {speaking ? '⏹ Стоп' : '🔊 Скажи вслух!'}
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col items-center justify-start overflow-y-auto p-5"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-muted-foreground text-xs mb-0.5">Перевод</p>
                      <p className="text-white text-2xl font-bold mb-1">{lessonCard.translation}</p>
                      {lessonCard.definition && (
                        <p className="text-[#a5b4fc]/80 text-xs text-center italic mb-2 px-2">{lessonCard.definition}</p>
                      )}
                      <p className="text-muted-foreground text-sm text-center italic mb-1">"{lessonCard.example}"</p>
                      {(lessonCard.synonyms?.length || lessonCard.antonym) && (
                        <div className="flex flex-wrap gap-1.5 justify-center mb-1">
                          {lessonCard.synonyms?.map((s, si) => (
                            <span key={si} className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5 text-emerald-300/80">= {s}</span>
                          ))}
                          {lessonCard.antonym && (
                            <span className="text-[11px] bg-rose-500/10 border border-rose-500/20 rounded-lg px-2 py-0.5 text-rose-300/80">↔ {lessonCard.antonym}</span>
                          )}
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-white/10 w-full text-center">
                        {collocMap.has(lessonCard.word) ? (
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Коллокации</p>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {collocMap.get(lessonCard.word)!.map((c, ci) => (
                                <span key={ci} className="text-[11px] bg-white/10 rounded-lg px-2 py-0.5 text-white/70">{c}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); fetchCollocations(lessonCard.word) }}
                            className="text-[11px] text-primary/70 hover:text-primary flex items-center gap-1 mx-auto">
                            {loadingColloc === lessonCard.word ? <span className="animate-spin inline-block">⟳</span> : '🔗'} Коллокации
                          </button>
                        )}
                      </div>
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
                <span className="text-muted-foreground text-sm">{Math.min(qIdx, totalDue)} / {totalDue} карточек</span>
                <button onClick={restart}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-muted-foreground transition-colors">
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
                <p className="text-muted-foreground mb-6">{totalDue > 0 ? `Ты прошёл ${totalDue} карточек` : 'Нет карточек для повторения'}</p>
                <button onClick={restart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition-opacity">
                  {totalDue > 0 ? 'Ещё раз' : 'Обновить'}
                </button>
              </motion.div>
            )}

            {!done && totalDue === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/[0.04] border border-white/10 rounded-2xl">
                <Layers className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <h2 className="text-white font-bold mb-2">Всё повторено!</h2>
                <p className="text-muted-foreground text-sm">Возвращайся позже или пройди уроки, чтобы добавить слова.</p>
              </motion.div>
            )}

            {!done && card && (
              <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div className="relative h-64 cursor-pointer" onClick={() => setFlipped(v => !v)}
                  style={{ perspective: '1000px' }}>
                  <motion.div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-primary/30 rounded-2xl flex flex-col items-center justify-center px-4"
                      style={{ backfaceVisibility: 'hidden' }}>
                      {card.partOfSpeech && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#818cf8]/80 bg-[#818cf8]/10 px-2.5 py-0.5 rounded-full mb-3">{card.partOfSpeech}</span>
                      )}
                      <p className="text-white text-3xl font-bold mb-2">{card.word}</p>
                      <p className="text-muted-foreground text-xs mb-4">Нажми, чтобы узнать значение</p>
                      <button onClick={e => { e.stopPropagation(); handleListen(card.word) }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1]/30 border border-[#6366f1]/50 text-[#a5b4fc] hover:bg-[#6366f1]/50 font-semibold text-sm transition-all">
                        <Volume2 className="w-4 h-4" /> {speaking ? '⏹ Стоп' : '🔊 Скажи вслух!'}
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col items-center justify-start overflow-y-auto p-5"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-muted-foreground text-xs mb-0.5">Перевод</p>
                      <p className="text-white text-2xl font-bold mb-1">{card.translation}</p>
                      {card.definition && (
                        <p className="text-[#a5b4fc]/80 text-xs text-center italic mb-2 px-2">{card.definition}</p>
                      )}
                      <p className="text-muted-foreground text-sm text-center italic mb-1">"{card.example}"</p>
                      {(card.synonyms?.length || card.antonym) && (
                        <div className="flex flex-wrap gap-1.5 justify-center mb-1">
                          {card.synonyms?.map((s, si) => (
                            <span key={si} className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5 text-emerald-300/80">= {s}</span>
                          ))}
                          {card.antonym && (
                            <span className="text-[11px] bg-rose-500/10 border border-rose-500/20 rounded-lg px-2 py-0.5 text-rose-300/80">↔ {card.antonym}</span>
                          )}
                        </div>
                      )}
                      <button onClick={e=>{e.stopPropagation();getExamples(card.word)}} disabled={aiLoading}
                        className="flex items-center gap-1 text-xs text-[#818cf8] hover:text-white disabled:opacity-50 mt-1">
                        {aiLoading?<><Loader2 className="w-3 h-3 animate-spin"/>AI примеры...</>:<><Sparkles className="w-3 h-3"/>AI примеры</>}
                      </button>
                      {aiExamples.length>0&&(
                        <div className="mt-1 space-y-1 text-left w-full">
                          {aiExamples.map((ex,i)=><p key={i} className="text-xs text-[#64748b] italic">&quot;{ex}&quot;</p>)}
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-white/10 w-full text-left">
                        {collocMap.has(card.word) ? (
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Коллокации</p>
                            <div className="flex flex-wrap gap-1.5">
                              {collocMap.get(card.word)!.map((c, ci) => (
                                <span key={ci} className="text-[11px] bg-white/10 rounded-lg px-2 py-0.5 text-white/70">{c}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); fetchCollocations(card.word) }}
                            className="text-[11px] text-primary/70 hover:text-primary flex items-center gap-1">
                            {loadingColloc === card.word ? <span className="animate-spin inline-block">⟳</span> : '🔗'} Коллокации
                          </button>
                        )}
                      </div>
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
                  <span className="text-muted-foreground text-xs ml-1">{BOX_LABELS[srs[card.id]?.box ?? 0]}</span>
                </div>

                <AnimatePresence>
                  {flipped && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 mt-4">
                      {/* Principle 5: Own example — contextual anchoring */}
                      <div className="relative">
                        <PenLine className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                        <textarea
                          value={ownExamples[card.id] ?? ''}
                          onChange={e => {
                            const val = e.target.value
                            setOwnExamples(prev => {
                              const next = { ...prev, [card.id]: val }
                              try { localStorage.setItem(OWN_EXAMPLES_KEY, JSON.stringify(next)) } catch { /* ignore */ }
                              return next
                            })
                          }}
                          onClick={e => e.stopPropagation()}
                          placeholder="Составь своё предложение с этим словом…"
                          rows={2}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 pt-2 pb-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/40 resize-none"
                        />
                      </div>
                      {/* Principle 6: 5-minute rule — shown after "Не знаю" */}
                      {showFiveMinHint ? (
                        <div className="space-y-2">
                          <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200/80">
                            <span className="text-sm leading-none mt-0.5">⏱</span>
                            <div>
                              <p className="font-semibold mb-0.5">5-минутное правило</p>
                              <p>Произнеси слово вслух, перечитай определение и составь своё предложение — только потом иди дальше.</p>
                            </div>
                          </div>
                          <button onClick={() => { setShowFiveMinHint(false); handleAnswer(false) }}
                            className="w-full py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-muted-foreground hover:text-white font-medium text-sm transition-colors">
                            Понял, запомню → идём дальше
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <button onClick={() => setShowFiveMinHint(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171] font-semibold hover:bg-[#ef4444]/25 transition-colors">
                            <X className="w-5 h-5" /> Не знаю
                          </button>
                          <button onClick={() => handleAnswer(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-semibold hover:bg-[#10b981]/25 transition-colors">
                            <Check className="w-5 h-5" /> Знаю
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      {/* ── ADD WORD MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">Добавить слово</h3>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Слово (English)</label>
              <input value={newWord} onChange={e => setNewWord(e.target.value)}
                placeholder="e.g. perseverance"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-base focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Перевод</label>
              <input value={newTranslation} onChange={e => setNewTranslation(e.target.value)}
                placeholder="настойчивость"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-base focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Пример (необязательно)</label>
              <input value={newContext} onChange={e => setNewContext(e.target.value)}
                placeholder="Her perseverance paid off."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-base focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
                Отмена
              </button>
              <button onClick={handleAddWord} disabled={addingWord || !newWord || !newTranslation}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">
                {addingWord ? 'Сохраняем...' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
