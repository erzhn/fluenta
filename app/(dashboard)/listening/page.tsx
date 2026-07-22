'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Eye, EyeOff, Volume2, RefreshCw, Sparkles } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'
import { getListeningTexts, type ListeningText } from '@/lib/listening-data'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { awardXP, XP_REWARDS } from '@/lib/xp'

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const SPEEDS = [0.8, 1.0, 1.2]
const SPEED_LABELS: Record<number, string> = { 0.8: '0.8×', 1.0: '1×', 1.2: '1.2×' }

export default function ListeningPage() {
  const [activeLevel, setActiveLevel] = useState('A1')
  const [entry, setEntry] = useState<ListeningText>(() => getListeningTexts('A1', 1)[0])
  const [speed, setSpeed] = useState(1.0)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)

  const color = LEVEL_COLORS[activeLevel]

  function selectLevel(level: string) {
    stopSpeaking()
    setActiveLevel(level)
    setEntry(getListeningTexts(level, 1)[0])
    setPlaying(false)
    setPlayed(false)
    setShowText(false)
    setShowQuestions(false)
    setAnswers({})
    setChecked(false)
  }

  function nextText() {
    stopSpeaking()
    setEntry(getListeningTexts(activeLevel, 1)[0])
    setPlaying(false)
    setPlayed(false)
    setShowText(false)
    setShowQuestions(false)
    setAnswers({})
    setChecked(false)
  }

  async function handlePlay() {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
      return
    }
    setPlaying(true)
    setPlayed(true)
    await speak(entry.text, {
      rate: speed,
      onEnd: () => setPlaying(false),
    })
  }

  async function generateAI() {
    setGeneratingAI(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/ai/generate-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ level: activeLevel }),
      })
      if (!res.ok) {
        if (res.status === 429) toast('Слишком много запросов. Подожди минуту.', 'error')
        else if (res.status === 401) toast('Необходимо войти в систему', 'error')
        else toast('Что-то пошло не так. Попробуй ещё раз.', 'error')
        return
      }
      const data = await res.json()
      if (data.title && data.text && data.questions) {
        stopSpeaking()
        setEntry({
          id: `ai-${Date.now()}`,
          level: activeLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1',
          title: data.title,
          text: data.text,
          questions: data.questions,
        })
        setPlaying(false)
        setPlayed(false)
        setShowText(false)
        setShowQuestions(false)
        setAnswers({})
        setChecked(false)
      }
    } catch {
      toast('Ошибка соединения', 'error')
    } finally {
      setGeneratingAI(false)
    }
  }

  useEffect(() => {
    generateAI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLevel])

  const allAnswered = entry.questions.every((_, i) => answers[i] !== undefined)
  const correctCount = entry.questions.filter((q, i) => answers[i] === q.answer).length

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Аудирование</span></h1>
        <p className="text-muted-foreground text-sm">Слушай тексты и отвечай на вопросы</p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map(l => (
          <button key={l} onClick={() => selectLevel(l)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={activeLevel === l
              ? { borderColor: LEVEL_COLORS[l], backgroundColor: `${LEVEL_COLORS[l]}20`, color: LEVEL_COLORS[l] }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
            {l}
          </button>
        ))}
      </div>

      {generatingAI && <SkeletonCard />}

      <AnimatePresence mode="wait">
        <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
          {/* Player card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">{entry.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${color}20`, color }}>
                  {entry.level}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={nextText}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-muted-foreground hover:text-white text-xs transition-colors flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Другой
                </button>
                <button onClick={generateAI} disabled={generatingAI}
                  className="px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-[#a5b4fc] hover:text-white text-xs transition-colors flex items-center gap-1 disabled:opacity-50">
                  <Sparkles className="w-3 h-3" /> {generatingAI ? 'AI...' : 'AI текст'}
                </button>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-1 h-10 mb-6">
              {Array.from({ length: 24 }, (_, i) => (
                <motion.div key={i} className="w-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={playing
                    ? { height: [4, 12 + Math.sin(i * 0.7) * 18, 4], opacity: [0.3, 0.9, 0.3] }
                    : { height: 4, opacity: 0.2 }}
                  transition={playing ? { duration: 0.7 + i * 0.04, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }} />
              ))}
            </div>

            {/* Speed */}
            <div className="flex gap-2 justify-center mb-5">
              {SPEEDS.map(s => (
                <button key={s} onClick={() => setSpeed(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${speed === s ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-muted-foreground hover:text-white'}`}>
                  {SPEED_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button onClick={handlePlay}
                className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${playing ? 'bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171]' : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/25'}`}>
                {playing ? <><Square className="w-4 h-4" /> Стоп</> : <><Volume2 className="w-4 h-4" /> {played ? 'Слушать снова' : 'Слушать'}</>}
              </button>
            </div>

            {/* Show text toggle */}
            <button onClick={() => setShowText(v => !v)}
              className="mt-3 w-full py-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
              {showText ? <><EyeOff className="w-4 h-4" /> Скрыть текст</> : <><Eye className="w-4 h-4" /> Показать текст</>}
            </button>

            <AnimatePresence>
              {showText && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden">
                  <p className="text-muted-foreground text-sm leading-relaxed p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] italic whitespace-pre-line">
                    {entry.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Questions trigger */}
          {!showQuestions && (
            <button onClick={() => setShowQuestions(true)}
              className="w-full py-3 rounded-2xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 text-sm font-medium transition-all">
              Ответить на вопросы →
            </button>
          )}

          {/* Questions */}
          <AnimatePresence>
            {showQuestions && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
                <h3 className="text-white font-semibold">Вопросы</h3>
                {entry.questions.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-muted-foreground text-sm mb-2">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        let cls = 'border-white/10 bg-white/[0.04] text-muted-foreground hover:border-primary/50 hover:text-white'
                        if (checked) {
                          if (opt === q.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                          else if (opt === answers[qi]) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                          else cls = 'border-white/5 bg-white/[0.02] text-muted-foreground'
                        } else if (answers[qi] === opt) {
                          cls = 'border-primary bg-primary/15 text-white'
                        }
                        return (
                          <button key={opt} disabled={checked}
                            onClick={() => setAnswers(a => ({ ...a, [qi]: opt }))}
                            className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {!checked ? (
                  <button disabled={!allAnswered} onClick={() => { setChecked(true); awardXP(XP_REWARDS.FLASHCARD_SESSION).catch(() => {}) }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
                    Проверить
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center ${correctCount === 3 ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : correctCount >= 2 ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' : 'bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20'}`}>
                      {correctCount === 3 ? `Отлично! ${correctCount}/3 правильно` : correctCount >= 2 ? `Молодец! ${correctCount}/3 правильно` : `${correctCount}/3 — Попробуй ещё раз`}
                    </div>
                    <button onClick={generateAI} disabled={generatingAI}
                      className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> Новый текст
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}