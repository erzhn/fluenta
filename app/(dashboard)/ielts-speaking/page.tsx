'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, ChevronRight, RotateCcw, Loader2, CheckCircle } from 'lucide-react'
import { speak, stopSpeaking, createRecognition, isSpeechRecognitionSupported } from '@/lib/speech'
import { supabase } from '@/lib/supabase'
import { awardXP, XP_REWARDS } from '@/lib/xp'

// ─── Data ──────────────────────────────────────────────────────────────
const TOPICS = {
  Home: [
    'Describe your home. What is it like?',
    'Do you live in a house or a flat?',
    'What do you like most about your home?',
  ],
  'Work/Study': [
    'Do you work or are you a student?',
    'What do you enjoy most about your job or studies?',
    'Do you think your work or studies will change in the future?',
  ],
  'Free Time': [
    'What do you like to do in your free time?',
    'Has your idea of free time changed since you were younger?',
    'Do you prefer spending your free time alone or with others?',
  ],
  Travel: [
    'Do you like travelling?',
    'What is your favourite place you have visited?',
    'Would you like to live in another country?',
  ],
}

const CUE_CARDS = [
  {
    title: 'Describe a skill you would like to learn',
    bullets: ['What it is', 'Why you want to learn it', 'How you would learn it', 'How it would benefit you'],
  },
  {
    title: 'Describe a memorable journey or trip',
    bullets: ['Where you went', 'Who you went with', 'What you did there', 'Why it was memorable'],
  },
  {
    title: 'Describe a person who has influenced you',
    bullets: ['Who this person is', 'How you know them', 'In what way they influenced you', 'Why they are important to you'],
  },
  {
    title: 'Describe a book, film or TV show you enjoyed',
    bullets: ['What it is called', 'What it is about', 'Why you chose it', 'What you learned or felt'],
  },
]

const PART3_QUESTIONS = [
  ['Do you think it is ever too late to learn a new skill?', 'How has technology changed the way people learn?', 'Which skills do you think will be most valuable in the future?'],
  ['Why do people enjoy travelling?', 'Do you think tourism has a negative impact on local cultures?', 'How might travel change in the next 20 years?'],
  ['What qualities make a good role model?', 'Do celebrities have a responsibility to be role models?', 'Who do you think influences young people the most today?'],
  ['Do you think reading is becoming less popular?', 'How has streaming changed the entertainment industry?', 'Should art and literature be taught in schools? Why?'],
]

function pickPart1Questions(): string[] {
  const topicKeys = Object.keys(TOPICS) as (keyof typeof TOPICS)[]
  const shuffled = [...topicKeys].sort(() => Math.random() - 0.5)
  const primary = shuffled[0]
  const secondary = shuffled[1]
  const qs = [...TOPICS[primary]]
  qs.push(TOPICS[secondary][Math.floor(Math.random() * TOPICS[secondary].length)])
  return qs
}

interface FeedbackResult {
  fluency: number
  lexical: number
  grammar: number
  pronunciation: number
  band: number
  tips: string[]
}

type Phase = 'intro' | 'speaking' | 'done' | 'feedback'

// ─── Component ─────────────────────────────────────────────────────────
export default function IELTSSpeakingPage() {
  const [part, setPart] = useState(0) // 0 = not started, 1, 2, 3, 4 = all done
  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIdx, setQuestionIdx] = useState(0)
  const [part1Questions] = useState<string[]>(pickPart1Questions)
  const [cardIdx] = useState(() => Math.floor(Math.random() * 4))
  const [prepTimer, setPrepTimer] = useState(60)
  const [speakTimer, setSpeakTimer] = useState(0)
  const [recording, setRecording] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [transcript, setTranscript] = useState('')
  const [partTranscript, setPartTranscript] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [ttsActive, setTtsActive] = useState(false)
  const [showDoneMsg, setShowDoneMsg] = useState(false)

  const recRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxSpeakTime = part === 2 ? 120 : 90

  // ─── TTS read question ──────────────────────────────────────────────
  const readQuestion = useCallback((text: string) => {
    setTtsActive(true)
    speak(text, { rate: 0.9, onEnd: () => setTtsActive(false) })
  }, [])

  // auto-read when question changes in part 1 or part 3
  useEffect(() => {
    if (part === 1 && phase === 'intro') {
      readQuestion(part1Questions[questionIdx])
    }
  }, [part, phase, questionIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (part === 3 && phase === 'intro') {
      readQuestion(PART3_QUESTIONS[cardIdx][questionIdx])
    }
  }, [part, phase, questionIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Prep timer (part 2) ────────────────────────────────────────────
  useEffect(() => {
    if (part === 2 && phase === 'intro') {
      setPrepTimer(60)
      timerRef.current = setInterval(() => {
        setPrepTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!)
            setPhase('speaking')
            setSpeakTimer(maxSpeakTime)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [part, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Speak timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'speaking') {
      setSpeakTimer(maxSpeakTime)
      timerRef.current = setInterval(() => {
        setSpeakTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!)
            stopRecording()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Recording ──────────────────────────────────────────────────────
  const startRecording = () => {
    if (!isSpeechRecognitionSupported()) return
    setPartTranscript('')
    setInterimText('')
    const rec = createRecognition(
      (text, isFinal) => {
        if (isFinal) {
          setPartTranscript(p => p + ' ' + text)
          setInterimText('')
        } else {
          setInterimText(text)
        }
      },
      () => {
        setRecording(false)
        setInterimText('')
      }
    )
    if (!rec) return
    recRef.current = rec
    rec.start()
    setRecording(true)
    if (part !== 2) {
      setPhase('speaking')
      setSpeakTimer(maxSpeakTime)
    }
  }

  const stopRecording = () => {
    if (recRef.current) {
      try { recRef.current.stop() } catch {}
      recRef.current = null
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
    setInterimText('')
    setPhase('done')
  }

  // ─── Answer submitted ────────────────────────────────────────────────
  const submitAnswer = () => {
    const answer = partTranscript.trim()
    const label = part === 1
      ? `Part 1 Q${questionIdx + 1}: ${answer}`
      : part === 2
        ? `Part 2 (Long Turn): ${answer}`
        : `Part 3 Q${questionIdx + 1}: ${answer}`
    setTranscript(t => t + '\n' + label)
    setPartTranscript('')
    setInterimText('')

    // Advance
    if (part === 1) {
      if (questionIdx < part1Questions.length - 1) {
        setQuestionIdx(q => q + 1)
        setPhase('intro')
      } else {
        setShowDoneMsg(true)
        setTimeout(() => { setShowDoneMsg(false); setPart(2); setPhase('intro') }, 1500)
      }
    } else if (part === 2) {
      setShowDoneMsg(true)
      setTimeout(() => { setShowDoneMsg(false); setPart(3); setQuestionIdx(0); setPhase('intro') }, 1500)
    } else if (part === 3) {
      if (questionIdx < PART3_QUESTIONS[cardIdx].length - 1) {
        setQuestionIdx(q => q + 1)
        setPhase('intro')
      } else {
        setPart(4)
        setPhase('feedback')
      }
    }
  }

  // ─── Get feedback ────────────────────────────────────────────────────
  const getFeedback = async () => {
    setFeedbackLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/ai/ielts-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ transcript }),
      })
      const data = await res.json()
      setFeedback(data)
      awardXP(XP_REWARDS.AI_CONVERSATION).catch(() => {})
    } catch {
      setFeedback(null)
    } finally {
      setFeedbackLoading(false)
    }
  }

  const reset = () => {
    stopSpeaking()
    if (recRef.current) { try { recRef.current.stop() } catch {} recRef.current = null }
    if (timerRef.current) clearInterval(timerRef.current)
    setPart(0); setPhase('intro'); setQuestionIdx(0)
    setTranscript(''); setPartTranscript(''); setInterimText('')
    setFeedback(null); setRecording(false)
  }

  const bandColor = !feedback ? '' : feedback.band >= 7 ? 'text-[#10b981]' : feedback.band >= 5 ? 'text-[#f59e0b]' : 'text-[#ef4444]'

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-2xl">IELTS Speaking</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Симуляция экзамена с ИИ-оценкой</p>
          </div>
          {part > 0 && part < 4 && (
            <div className="flex gap-1.5">
              {[1, 2, 3].map(p => (
                <div key={p} className="w-8 h-1.5 rounded-full transition-all"
                  style={{ backgroundColor: p < part ? '#10b981' : p === part ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Start Screen ── */}
          {part === 0 && (
            <motion.div key="start" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="text-center space-y-3">
                <div className="text-5xl">🎓</div>
                <h2 className="text-white font-bold text-xl">Готовы к экзамену?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Симуляция IELTS Speaking состоит из 3 частей. Говорите чётко по-английски — ИИ оценит вас по официальным критериям.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Часть 1', desc: 'Введение — 4 вопроса на общие темы', time: '~4 мин' },
                  { label: 'Часть 2', desc: 'Монолог по карточке (60 сек подготовка + 2 мин речь)', time: '~3 мин' },
                  { label: 'Часть 3', desc: 'Дискуссия — 3 развёрнутых вопроса', time: '~4 мин' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-16 text-xs font-bold text-primary shrink-0">{item.label}</div>
                    <div className="flex-1 text-sm text-white/80">{item.desc}</div>
                    <div className="text-xs text-muted-foreground shrink-0">{item.time}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setPart(1); setPhase('intro') }}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--primary), #6d28d9)' }}>
                Начать экзамен →
              </button>
            </motion.div>
          )}

          {/* ── Part 1 ── */}
          {part === 1 && (
            <motion.div key={`p1-${questionIdx}-${phase}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-semibold text-xs">Часть 1</span>
                <span>Вопрос {questionIdx + 1} из {part1Questions.length}</span>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-white font-bold text-lg leading-snug">{part1Questions[questionIdx]}</p>
                <button onClick={() => readQuestion(part1Questions[questionIdx])} disabled={ttsActive}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40">
                  <Volume2 className="w-4 h-4" />
                  {ttsActive ? 'Читает...' : 'Озвучить вопрос'}
                </button>
              </div>

              {phase === 'intro' && (
                <button onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]">
                  <Mic className="w-5 h-5 text-primary" />
                  Начать ответ
                </button>
              )}

              {(phase === 'speaking' || phase === 'done') && (
                <RecordingPanel
                  recording={recording}
                  partTranscript={partTranscript}
                  interimText={interimText}
                  speakTimer={speakTimer}
                  maxTime={maxSpeakTime}
                  onStop={stopRecording}
                  onSubmit={submitAnswer}
                  phase={phase}
                  showDoneMsg={showDoneMsg}
                />
              )}
            </motion.div>
          )}

          {/* ── Part 2 ── */}
          {part === 2 && (
            <motion.div key={`p2-${phase}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2.5 py-1 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] font-semibold text-xs">Часть 2</span>
                <span>Монолог по карточке</span>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-white font-bold text-lg">{CUE_CARDS[cardIdx].title}</p>
                <ul className="space-y-2">
                  {CUE_CARDS[cardIdx].bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-primary mt-0.5">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>

              {phase === 'intro' && (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-muted-foreground text-sm">Время на подготовку</p>
                  <div className="text-5xl font-black text-white tabular-nums">{prepTimer}</div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${(prepTimer / 60) * 100}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">Начнёте говорить автоматически</p>
                </div>
              )}

              {phase === 'speaking' && (
                <RecordingPanel
                  recording={recording}
                  partTranscript={partTranscript}
                  interimText={interimText}
                  speakTimer={speakTimer}
                  maxTime={maxSpeakTime}
                  onStop={stopRecording}
                  onSubmit={submitAnswer}
                  phase={phase}
                  showDoneMsg={false}
                  autoStart={() => startRecording()}
                />
              )}

              {phase === 'done' && (
                <RecordingPanel
                  recording={false}
                  partTranscript={partTranscript}
                  interimText={''}
                  speakTimer={0}
                  maxTime={maxSpeakTime}
                  onStop={stopRecording}
                  onSubmit={submitAnswer}
                  phase="done"
                  showDoneMsg={showDoneMsg}
                />
              )}
            </motion.div>
          )}

          {/* ── Part 3 ── */}
          {part === 3 && (
            <motion.div key={`p3-${questionIdx}-${phase}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2.5 py-1 rounded-lg bg-[#ef4444]/15 text-[#ef4444] font-semibold text-xs">Часть 3</span>
                <span>Дискуссия {questionIdx + 1} из {PART3_QUESTIONS[cardIdx].length}</span>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-white font-bold text-lg leading-snug">{PART3_QUESTIONS[cardIdx][questionIdx]}</p>
                <button onClick={() => readQuestion(PART3_QUESTIONS[cardIdx][questionIdx])} disabled={ttsActive}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40">
                  <Volume2 className="w-4 h-4" />
                  {ttsActive ? 'Читает...' : 'Озвучить вопрос'}
                </button>
              </div>

              {phase === 'intro' && (
                <button onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]">
                  <Mic className="w-5 h-5 text-primary" />
                  Начать ответ
                </button>
              )}

              {(phase === 'speaking' || phase === 'done') && (
                <RecordingPanel
                  recording={recording}
                  partTranscript={partTranscript}
                  interimText={interimText}
                  speakTimer={speakTimer}
                  maxTime={maxSpeakTime}
                  onStop={stopRecording}
                  onSubmit={submitAnswer}
                  phase={phase}
                  showDoneMsg={showDoneMsg}
                />
              )}
            </motion.div>
          )}

          {/* ── All Done / Feedback ── */}
          {part === 4 && (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">
              {!feedback && !feedbackLoading && (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h2 className="text-white font-bold text-xl">Экзамен завершён!</h2>
                  <p className="text-muted-foreground text-sm">Нажмите кнопку ниже, чтобы получить оценку IELTS от ИИ-экзаменатора.</p>
                  <button onClick={getFeedback}
                    className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, var(--primary), #6d28d9)' }}>
                    Получить оценку IELTS
                  </button>
                </div>
              )}

              {feedbackLoading && (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-muted-foreground text-sm">ИИ-экзаменатор анализирует ответы...</p>
                </div>
              )}

              {feedback && !feedbackLoading && (
                <div className="space-y-4">
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center space-y-2">
                    <p className="text-muted-foreground text-sm">Общий балл IELTS</p>
                    <div className={`text-7xl font-black tabular-nums ${bandColor}`}>{feedback.band}</div>
                    <p className="text-muted-foreground text-xs">из 9 возможных</p>
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4">
                    <h3 className="text-white font-bold text-sm">Критерии</h3>
                    {[
                      { label: 'Fluency & Coherence', score: feedback.fluency },
                      { label: 'Lexical Resource', score: feedback.lexical },
                      { label: 'Grammatical Range', score: feedback.grammar },
                      { label: 'Pronunciation', score: feedback.pronunciation },
                    ].map(({ label, score }) => (
                      <div key={label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">{label}</span>
                          <span className="text-white font-bold">{score}/9</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / 9) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-2 rounded-full"
                            style={{ background: 'linear-gradient(90deg, var(--primary), #6d28d9)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-3">
                    <h3 className="text-white font-bold text-sm">Советы по улучшению</h3>
                    <ul className="space-y-2.5">
                      {feedback.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button onClick={reset}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 text-white font-bold text-sm hover:border-white/20 hover:bg-white/[0.04] transition-all">
                    <RotateCcw className="w-4 h-4" />
                    Попробовать снова
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Recording Panel ────────────────────────────────────────────────────────
interface RecordingPanelProps {
  recording: boolean
  partTranscript: string
  interimText: string
  speakTimer: number
  maxTime: number
  phase: Phase
  showDoneMsg: boolean
  onStop: () => void
  onSubmit: () => void
  autoStart?: () => void
}

function RecordingPanel({ recording, partTranscript, interimText, speakTimer, maxTime, phase, showDoneMsg, onStop, onSubmit, autoStart }: RecordingPanelProps) {
  useEffect(() => {
    if (autoStart && phase === 'speaking') autoStart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (showDoneMsg) {
    return (
      <div className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/[0.04] border border-white/10">
        <CheckCircle className="w-5 h-5 text-[#10b981]" />
        <span className="text-white/70 text-sm">Хорошо, переходим к следующему вопросу...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {phase === 'speaking' && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[#ef4444] text-sm font-semibold">{recording ? 'Запись...' : 'Готов'}</span>
          </div>
          <span className="text-white font-bold tabular-nums text-sm">{speakTimer}s</span>
        </div>
      )}

      {(partTranscript || interimText) && (
        <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/70 min-h-[60px] leading-relaxed">
          {partTranscript}
          {interimText && <span className="text-muted-foreground italic">{interimText}</span>}
        </div>
      )}

      {speakTimer > 0 && (
        <div className="w-full bg-white/10 rounded-full h-1">
          <div className="bg-[#ef4444] h-1 rounded-full transition-all" style={{ width: `${(speakTimer / maxTime) * 100}%` }} />
        </div>
      )}

      <div className="flex gap-3">
        {recording && (
          <button onClick={onStop}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444] font-bold text-sm hover:bg-[#ef4444]/20 transition-all">
            <MicOff className="w-4 h-4" />
            Остановить
          </button>
        )}
        {phase === 'done' && (
          <button onClick={onSubmit}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--primary), #6d28d9)' }}>
            Следующий вопрос
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
