'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle, Lock, Zap, RotateCcw, BookOpen, FlipHorizontal, Volume2, VolumeX } from 'lucide-react'
import { LESSONS } from '@/lib/lessons-data'
import type { Lesson } from '@/lib/lessons-data'
import { MODULES } from '@/lib/modules-data'
import type { ModuleLesson, ModuleId } from '@/lib/modules-data'
import SpeakingExercise from '@/components/lessons/SpeakingExercise'
import { supabase } from '@/lib/supabase'
import { triggerConfetti } from '@/components/ui/Confetti'
import { speak, stopSpeaking } from '@/lib/speech'

// в"Ђв"Ђв"Ђ Progress в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
interface LessonResult { score: number; completedAt: string }
interface Progress {
  completedLessons: Record<string, LessonResult>
  totalXP: number
}
const STORAGE_KEY = 'fluenta_lesson_progress'
const PASS_THRESHOLD = 0.8

function loadProgress(): Progress {
  if (typeof window === 'undefined') return { completedLessons: {}, totalXP: 0 }
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') || { completedLessons: {}, totalXP: 0 } }
  catch { return { completedLessons: {}, totalXP: 0 } }
}
function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

// в"Ђв"Ђв"Ђ Helpers в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}
const LEVEL_DESC: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper-Int', C1: 'Advanced',
}
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const

function lessonsByBlock(level: string) {
  const map = new Map<number, { name: string; lessons: Lesson[] }>()
  for (const l of LESSONS.filter(l => l.level === level)) {
    if (!map.has(l.block)) map.set(l.block, { name: l.blockName, lessons: [] })
    map.get(l.block)!.lessons.push(l)
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

function isUnlocked(lesson: Lesson, progress: Progress): boolean {
  if (lesson.id === LESSONS[0]?.id) return true
  const idx = LESSONS.findIndex(l => l.id === lesson.id)
  if (idx <= 0) return true
  const prev = LESSONS[idx - 1]
  const r = progress.completedLessons[prev.id]
  if (!r) return false
  return r.score / LESSONS[idx - 1].quiz.length >= PASS_THRESHOLD
}

function xpForLesson(lesson: Lesson): number {
  return { A1: 50, A2: 75, B1: 100, B2: 150, C1: 200 }[lesson.level] ?? 50
}

// в"Ђв"Ђв"Ђ Step 1: Theory в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function TheoryStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const c = LEVEL_COLORS[lesson.level]
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-3">
          {lesson.theory.explanation.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-[#cbd5e1] text-sm leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
      <button
        onClick={onNext}
        className="btn-glow mt-4 w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}
      >
        Далее — Примеры →
      </button>
    </div>
  )
}

// в"Ђв"Ђв"Ђ Step 2: Examples (flip cards) в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function ExamplesStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [cur, setCur] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const shouldStopRef = useRef(false)
  const c = LEVEL_COLORS[lesson.level]
  const ex = lesson.theory.examples[cur]
  const allSeen = seen.size === lesson.theory.examples.length

  function speakExample(id: string, text: string) {
    if (speakingId === id) {
      stopSpeaking()
      setSpeakingId(null)
      return
    }
    speak(text, {
      rate: 0.9,
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
    })
  }

  async function playAll() {
    if (speakingId === 'all') {
      stopSpeaking()
      shouldStopRef.current = true
      setSpeakingId(null)
      return
    }
    shouldStopRef.current = false
    setSpeakingId('all')
    for (let i = 0; i < lesson.theory.examples.length; i++) {
      if (shouldStopRef.current) break
      await speak(lesson.theory.examples[i].english, { rate: 0.9 })
      if (shouldStopRef.current) break
      await new Promise(r => setTimeout(r, 500))
    }
    setSpeakingId(null)
  }

  function markSeen() {
    setSeen(s => new Set([...s, cur]))
    if (cur < lesson.theory.examples.length - 1) {
      setCur(n => n + 1)
      setFlipped(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots + Play all */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5 flex-1 mr-3">
          {lesson.theory.examples.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
              style={{ backgroundColor: seen.has(i) ? c : i === cur ? `${c}60` : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
        <button onClick={playAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
          {speakingId === 'all' ? <><VolumeX className="w-3.5 h-3.5" /> Стоп</> : <><Volume2 className="w-3.5 h-3.5" /> Озвучить всё</>}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Flip card */}
        <div className="w-full max-w-sm cursor-pointer select-none" style={{ perspective: 1000 }} onClick={() => setFlipped(f => !f)}>
          <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }}
            style={{ transformStyle: 'preserve-3d', position: 'relative', height: 160 }}>
            {/* Front — English */}
            <div className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative"
              style={{ backfaceVisibility: 'hidden' }}>
              <button
                onClick={(e) => { e.stopPropagation(); speakExample(`ex-${cur}`, ex.english) }}
                className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                {speakingId === `ex-${cur}` ? <VolumeX className="w-4 h-4 text-primary animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <FlipHorizontal className="w-3 h-3" />English
              </div>
              <div className="text-white font-bold text-lg leading-snug">{ex.english}</div>
              <div className="text-primary text-xs mt-4 opacity-60">нажми чтобы перевернуть</div>
            </div>
            {/* Back — Russian */}
            <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: `${c}12`, border: `1px solid ${c}30` }}>
              <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: c }}>Русский</div>
              <div className="text-white font-bold text-lg">{ex.russian}</div>
            </div>
          </motion.div>
        </div>

        <p className="text-muted-foreground text-xs">
          {cur + 1} / {lesson.theory.examples.length}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {!seen.has(cur) && (
          <button onClick={markSeen}
            className="w-full py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
            Понятно ✓
          </button>
        )}
        {allSeen && (
          <button onClick={onNext}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}>
            К упражнениям →
          </button>
        )}
      </div>
    </div>
  )
}

// в"Ђв"Ђв"Ђ Step 3: Exercises в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function ExercisesStep({ lesson, onNext, module: mod }: { lesson: Lesson; onNext: () => void; module?: string }) {
  const [speakingDone, setSpeakingDone] = useState(false)
  const [cur, setCur] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [built, setBuilt] = useState<string[]>([])
  const [avail, setAvail] = useState<string[]>([])
  const c = LEVEL_COLORS[lesson.level]
  const ex = lesson.exercises[cur]

  useEffect(() => {
    setAnswered(false); setCorrect(false)
    setInput(''); setSelected(null); setBuilt([])
    if (ex.type === 'build_sentence' && ex.words)
      setAvail([...ex.words].sort(() => Math.random() - 0.5))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur])

  function check() {
    let ok = false
    if (ex.type === 'fill_blank') ok = input.trim().toLowerCase() === ex.answer.toLowerCase()
    else if (ex.type === 'multiple_choice') ok = selected === ex.answer
    else if (ex.type === 'build_sentence') ok = built.join(' ') === ex.answer
    setCorrect(ok); setAnswered(true)
  }

  const parts = ex.type === 'fill_blank' ? ex.question.split('___') : []
  const canCheck = ex.type === 'fill_blank' ? !!input.trim()
    : ex.type === 'multiple_choice' ? !!selected
    : ex.type === 'build_sentence' ? built.length > 0 : false

  if (mod === 'speaking' && !speakingDone) {
    const sampleAnswer = lesson.theory?.examples?.[0]?.english ?? undefined
    return (
      <div className="flex flex-col h-full gap-4">
        <SpeakingExercise
          prompt={lesson.title}
          sampleAnswer={sampleAnswer}
          onComplete={() => setSpeakingDone(true)}
        />
        <button onClick={() => setSpeakingDone(true)}
          className="text-muted-foreground hover:text-white text-sm text-center transition-colors">
          Пропустить → к упражнениям
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-xs">Упражнение {cur + 1} из {lesson.exercises.length}</span>
        <div className="flex gap-1">
          {lesson.exercises.map((_, i) => (
            <div key={i} className="w-5 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i < cur ? c : i === cur ? `${c}80` : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={cur} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {ex.type === 'fill_blank' && (
              <div className="space-y-4">
                <div className="text-white font-medium text-base leading-loose flex flex-wrap items-center gap-x-1">
                  {parts.map((part, i) => (
                    <span key={i} className="flex items-center gap-1 flex-wrap">
                      <span>{part}</span>
                      {i < parts.length - 1 && (
                        <input type="text" value={input} onChange={e => !answered && setInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !answered && canCheck && check()}
                          disabled={answered} placeholder="______"
                          className={`w-28 border-b-2 bg-transparent text-center font-bold outline-none px-1 transition-colors ${
                            answered ? (correct ? 'border-[#10b981] text-[#10b981]' : 'border-[#ef4444] text-[#ef4444]') : 'border-primary text-[#a5b4fc]'
                          }`} />
                      )}
                    </span>
                  ))}
                </div>
                {ex.hint && !answered && <p className="text-muted-foreground text-xs">💡 {ex.hint}</p>}
              </div>
            )}

            {ex.type === 'multiple_choice' && (
              <div className="space-y-2.5">
                <p className="text-white font-medium text-sm mb-4">{ex.question}</p>
                {ex.options?.map(opt => (
                  <button key={opt} onClick={() => !answered && setSelected(opt)} disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      answered
                        ? opt === ex.answer ? 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                          : opt === selected ? 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                          : 'border-white/[0.05] text-muted-foreground'
                        : opt === selected ? 'border-primary bg-primary/10 text-white'
                          : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-white'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {ex.type === 'build_sentence' && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">{ex.question || 'Собери предложение:'}</p>
                <div className="min-h-12 flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02]">
                  {built.length === 0 && <span className="text-[#334155] text-sm self-center">Нажми на слова снизу...</span>}
                  {built.map((w, i) => (
                    <button key={`b${i}`} onClick={() => { if (answered) return; setBuilt(b => b.filter((_, j) => j !== i)); setAvail(a => [...a, w]) }} disabled={answered}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        answered ? (correct ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]' : 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]')
                          : 'bg-primary/15 border-primary/40 text-[#a5b4fc] hover:bg-primary/25'
                      }`}>
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {avail.map((w, i) => (
                    <button key={`a${i}`} onClick={() => { if (answered) return; setBuilt(b => [...b, w]); setAvail(a => a.filter((_, j) => j !== i)) }} disabled={answered}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/10 text-white hover:bg-white/10 transition-all">
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {answered && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium ${
            correct ? 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]' : 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]'
          }`}>
          {correct ? '✅ Правильно!' : `❌ Правильный ответ: ${ex.answer}`}
        </motion.div>
      )}

      <div className="mt-3">
        {!answered ? (
          <button onClick={check} disabled={!canCheck}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-40 transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}>
            Проверить
          </button>
        ) : (
          <button onClick={() => { if (cur < lesson.exercises.length - 1) setCur(n => n + 1); else onNext() }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}>
            {cur < lesson.exercises.length - 1 ? 'Следующее упражнение →' : 'К тесту →'}
          </button>
        )}
      </div>
    </div>
  )
}

// в"Ђв"Ђв"Ђ Step 4: Quiz в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function QuizStep({ lesson, onFinish }: { lesson: Lesson; onFinish: (score: number) => void }) {
  const [cur, setCur] = useState(0)
  const [chosen, setChosen] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const c = LEVEL_COLORS[lesson.level]
  const q = lesson.quiz[cur]

  function next() {
    const newChosen = [...chosen, selected ?? '']
    setChosen(newChosen)
    setSelected(null)
    if (cur < lesson.quiz.length - 1) {
      setCur(n => n + 1)
    } else {
      const score = newChosen.filter((a, i) => a === lesson.quiz[i].answer).length
      setFinalScore(score)
      if (score / lesson.quiz.length >= PASS_THRESHOLD) {
        triggerConfetti()
        onFinish(score)
      }
    }
  }

  if (finalScore !== null) {
    const pass = finalScore / lesson.quiz.length >= PASS_THRESHOLD
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="text-6xl mb-4">{pass ? '🎉' : '💪'}</div>
        <h3 className="text-white font-black text-xl mb-2">{pass ? 'Урок завершён!' : 'Попробуй снова'}</h3>
        <p className="text-muted-foreground text-sm mb-2">{finalScore} из {lesson.quiz.length} правильно</p>
        {pass && (
          <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-sm mb-6">
            <Zap className="w-4 h-4" />+{xpForLesson(lesson)} XP
          </div>
        )}
        {!pass && (
          <button onClick={() => { setCur(0); setChosen([]); setSelected(null); setFinalScore(null) }}
            className="flex items-center gap-2 mt-4 px-6 py-3 rounded-2xl border border-white/10 text-white text-sm font-bold hover:border-white/20 transition-all">
            <RotateCcw className="w-4 h-4" />Пройти тест снова
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-xs">Вопрос {cur + 1} из {lesson.quiz.length}</span>
        <div className="flex gap-1">
          {lesson.quiz.map((_, i) => (
            <div key={i} className="w-4 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i < cur ? c : i === cur ? `${c}80` : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto">
        <p className="text-white font-medium text-sm mb-4">{q.question}</p>
        {q.options.map(opt => (
          <button key={opt} onClick={() => !selected && setSelected(opt)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              selected === opt ? 'border-primary bg-primary/10 text-white' : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-white'
            }`}>
            {opt}
          </button>
        ))}
      </div>

      <button onClick={next} disabled={!selected}
        className="mt-4 w-full py-3.5 rounded-2xl text-white font-bold text-sm disabled:opacity-40 transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}>
        {cur < lesson.quiz.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
      </button>
    </div>
  )
}

// в"Ђв"Ђв"Ђ Lesson Player (VIEW 2) в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
const STEPS = ['Теория', 'Примеры', 'Упражнения', 'Тест'] as const
type Step = typeof STEPS[number]

function LessonPlayer({ lesson, onBack, onComplete }: {
  lesson: Lesson
  onBack: () => void
  onComplete: (score: number) => void
}) {
  const [step, setStep] = useState<Step>('Теория')
  const stepIdx = STEPS.indexOf(step)
  const c = LEVEL_COLORS[lesson.level]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-white text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" />Назад
        </button>
        <div className="flex-1" />
        <span className="text-xs font-black px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${c}20`, color: c }}>
          {lesson.level}
        </span>
        <span className="text-muted-foreground text-xs">{lesson.duration}</span>
      </div>

      <h2 className="text-white font-black text-lg mb-4 shrink-0">{lesson.title}</h2>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6 shrink-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${
              i < stepIdx ? 'text-[#10b981]' : i === stepIdx ? 'text-white' : 'text-[#334155]'
            }`} style={i === stepIdx ? { backgroundColor: `${c}20`, color: c } : {}}>
              {i < stepIdx && <CheckCircle className="w-3 h-3 shrink-0" />}
              <span className="hidden sm:inline">{s}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < STEPS.length - 1 && <div className="w-3 h-px bg-white/10 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
            {step === 'Теория' && <TheoryStep lesson={lesson} onNext={() => setStep('Примеры')} />}
            {step === 'Примеры' && <ExamplesStep lesson={lesson} onNext={() => setStep('Упражнения')} />}
            {step === 'Упражнения' && <ExercisesStep lesson={lesson} onNext={() => setStep('Тест')} module={(lesson as any).module} />}
            {step === 'Тест' && <QuizStep lesson={lesson} onFinish={onComplete} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// в"Ђв"Ђв"Ђ Curriculum Card в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function LessonCard({ lesson, unlocked, completed, current, onClick }: {
  lesson: Lesson
  unlocked: boolean
  completed: boolean
  current: boolean
  onClick: () => void
}) {
  const c = LEVEL_COLORS[lesson.level]
  return (
    <motion.button
      whileHover={unlocked ? { y: -2 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={unlocked ? onClick : undefined}
      className={`card-lift w-full text-left bg-white/[0.04] border rounded-2xl p-4 transition-all ${
        !unlocked ? 'opacity-40 grayscale cursor-not-allowed border-white/[0.06]'
          : completed ? 'border-[#10b981]/40 hover:border-[#10b981]/60'
          : current ? 'border-primary shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-primary'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-snug truncate">{lesson.title}</p>
          <p className="text-muted-foreground text-xs mt-1">{lesson.duration}</p>
        </div>
        <div className="shrink-0 mt-0.5">
          {!unlocked ? <Lock className="w-4 h-4 text-[#334155]" />
            : completed ? <CheckCircle className="w-4 h-4 text-[#10b981]" />
            : current ? <div className="w-4 h-4 rounded-full border-2 animate-pulse" style={{ borderColor: c }} />
            : <div className="w-4 h-4 rounded-full border-2 border-white/20" />}
        </div>
      </div>
      {current && (
        <div className="mt-2 text-xs font-semibold flex items-center gap-1" style={{ color: c }}>
          <BookOpen className="w-3 h-3" />Текущий урок
        </div>
      )}
    </motion.button>
  )
}

// в"Ђв"Ђв"Ђ Module helpers в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
function moduleLessonsByBlock(lessons: ModuleLesson[]) {
  const map = new Map<number, { name: string; lessons: ModuleLesson[] }>()
  for (const l of lessons) {
    if (!map.has(l.block)) map.set(l.block, { name: l.blockName, lessons: [] })
    map.get(l.block)!.lessons.push(l)
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

function isModuleLessonUnlocked(lesson: ModuleLesson, allModuleLessons: ModuleLesson[], progress: Progress): boolean {
  const sorted = [...allModuleLessons].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex(l => l.id === lesson.id)
  if (idx <= 0) return true
  const prev = sorted[idx - 1]
  const r = progress.completedLessons[prev.id]
  if (!r) return false
  return r.score / prev.quiz.length >= PASS_THRESHOLD
}

const MODULE_TABS = [
  { id: null,         label: '📚 Основной курс' },
  { id: 'business',  label: '💼 Деловой' },
  { id: 'academic',  label: '🎓 Академическое' },
  { id: 'speaking',  label: '🗣️ Разговорный' },
  { id: 'grammar',   label: '📖 Грамматика' },
] as const

// в"Ђв"Ђв"Ђ Main Page в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ
export default function LessonsPage() {
  const searchParams = useSearchParams()
  const initModule = (searchParams.get('module') as ModuleId | null) ?? null
  const openLessonId = searchParams.get('open')

  const [activeLevel, setActiveLevel] = useState<string>('A1')
  const [activeModule, setActiveModule] = useState<ModuleId | null>(initModule)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Progress>({ completedLessons: {}, totalXP: 0 })
  const [isGuest, setIsGuest] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  useEffect(() => { setProgress(loadProgress()) }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const guest = !user
      setIsGuest(guest)
      // Auto-open lesson from ?open= query param (e.g. from dashboard "continue" card)
      if (openLessonId && !guest) {
        const lesson = LESSONS.find(l => l.id === openLessonId)
        if (lesson) setActiveLesson(lesson)
      }
    })
  }, [openLessonId])

  const DEMO_LESSON_ID = LESSONS[0]?.id

  function handleLessonClick(lesson: Lesson) {
    if (isGuest && lesson.id !== DEMO_LESSON_ID) {
      setShowDemoModal(true)
      return
    }
    localStorage.setItem('fluenta_last_lesson_id', lesson.id)
    setActiveLesson(lesson)
  }

  const handleComplete = useCallback((lesson: Lesson, score: number) => {
    setProgress(prev => {
      const next: Progress = {
        completedLessons: { ...prev.completedLessons, [lesson.id]: { score, completedAt: new Date().toISOString() } },
        totalXP: prev.totalXP + xpForLesson(lesson),
      }
      saveProgress(next)
      return next
    })
  }, [])

  const currentModuleMeta = activeModule ? MODULES.find(m => m.id === activeModule) ?? null : null
  const moduleLessons = currentModuleMeta?.lessons ?? []

  // Main course state
  const currentLesson = LESSONS.find(l => isUnlocked(l, progress) && !progress.completedLessons[l.id])
  const blocks = lessonsByBlock(activeLevel)
  const totalCompleted = LESSONS.filter(l => l.level === activeLevel && progress.completedLessons[l.id]).length
  const totalInLevel = LESSONS.filter(l => l.level === activeLevel).length

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <AnimatePresence mode="wait">
        {activeLesson ? (
          /* в"Ђв"Ђ VIEW 2: LESSON PLAYER в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ */
          <motion.div key="player"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <LessonPlayer
              lesson={activeLesson}
              onBack={() => setActiveLesson(null)}
              onComplete={(score) => handleComplete(activeLesson, score)}
            />
          </motion.div>
        ) : (
          /* в"Ђв"Ђ VIEW 1: CURRICULUM в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ */
          <motion.div key="curriculum"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-white"><span className="gradient-text">Уроки</span> 📚</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {activeModule
                    ? `${currentModuleMeta?.title ?? ''} · ${moduleLessons.filter(l => progress.completedLessons[l.id]).length}/${moduleLessons.length} уроков`
                    : `${totalCompleted}/${totalInLevel} на уровне ${activeLevel}`}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2">
                <Zap className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-white font-bold text-sm">{progress.totalXP} XP</span>
              </div>
            </div>

            {/* Module tabs */}
            <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto pb-1">
              {MODULE_TABS.map(tab => {
                const active = activeModule === tab.id
                return (
                  <button
                    key={String(tab.id)}
                    onClick={() => setActiveModule(tab.id as ModuleId | null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                        : 'border-white/10 text-muted-foreground hover:text-white hover:border-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {activeModule ? (
              /* в"Ђв"Ђ MODULE CURRICULUM в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ */
              <div className="space-y-8">
                {moduleLessonsByBlock(moduleLessons).map(([blockNum, { name, lessons }]) => {
                  const doneInBlock = lessons.filter(l => progress.completedLessons[l.id]).length
                  const c = '#6366f1'
                  return (
                    <section key={blockNum}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-white font-black text-sm">Блок {blockNum}</div>
                        <div className="text-muted-foreground text-sm">— {name}</div>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <div className="text-muted-foreground text-xs">{doneInBlock} из {lessons.length}</div>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full mb-4 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(doneInBlock / lessons.length) * 100}%`, backgroundColor: c }} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {lessons.map(lesson => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            unlocked={isModuleLessonUnlocked(lesson, moduleLessons, progress)}
                            completed={!!progress.completedLessons[lesson.id]}
                            current={false}
                            onClick={() => handleLessonClick(lesson)}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            ) : (
              /* в"Ђв"Ђ MAIN COURSE CURRICULUM в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ */
              <>
                {/* Level tabs */}
                <div className="flex gap-2 flex-wrap mb-8">
                  {LEVELS.map(lv => {
                    const active = activeLevel === lv
                    const lc = LEVEL_COLORS[lv]
                    return (
                      <button key={lv} onClick={() => setActiveLevel(lv)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          active ? 'text-white' : 'border-white/10 text-muted-foreground hover:text-white hover:border-white/20'
                        }`}
                        style={active ? { backgroundColor: `${lc}20`, borderColor: lc, color: lc } : {}}>
                        {lv}
                        <span className="ml-1.5 text-[10px] font-normal opacity-70 hidden sm:inline">{LEVEL_DESC[lv]}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Blocks */}
                <div className="space-y-8">
                  {blocks.map(([blockNum, { name, lessons }]) => {
                    const doneInBlock = lessons.filter(l => progress.completedLessons[l.id]).length
                    const c = LEVEL_COLORS[activeLevel]
                    return (
                      <section key={blockNum}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-white font-black text-sm">Блок {blockNum}</div>
                          <div className="text-muted-foreground text-sm">— {name}</div>
                          <div className="flex-1 h-px bg-white/[0.06]" />
                          <div className="text-muted-foreground text-xs">{doneInBlock} из {lessons.length}</div>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full mb-4 overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(doneInBlock / lessons.length) * 100}%`, backgroundColor: c }} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {lessons.map(lesson => (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              unlocked={isGuest ? lesson.id === DEMO_LESSON_ID : isUnlocked(lesson, progress)}
                              completed={!!progress.completedLessons[lesson.id]}
                              current={lesson.id === currentLesson?.id}
                              onClick={() => handleLessonClick(lesson)}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo mode modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowDemoModal(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-white font-bold text-xl mb-2">Зарегистрируйся бесплатно</h2>
              <p className="text-muted-foreground text-sm mb-6">Чтобы продолжить обучение, создай бесплатный аккаунт и получи доступ ко всем 95 урокам</p>
              <div className="flex flex-col gap-3">
                <a href="/auth/login"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition-opacity">
                  Войти / Зарегистрироваться
                </a>
                <button onClick={() => setShowDemoModal(false)}
                  className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Продолжить демо
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
