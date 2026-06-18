'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Volume2, ChevronRight, RefreshCw,
  CheckCircle, XCircle, MessageSquare,
} from 'lucide-react'

// ── Web Speech API type declarations ──────────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInst
    webkitSpeechRecognition: new () => SpeechRecognitionInst
  }
}

interface SpeechRecAlt     { transcript: string; confidence: number }
interface SpeechRecResult  { [index: number]: SpeechRecAlt; length: number; isFinal: boolean }
interface SpeechRecResults { [index: number]: SpeechRecResult; length: number }
interface SpeechRecEvent   { results: SpeechRecResults }

interface SpeechRecognitionInst {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: SpeechRecEvent) => void) | null
  onerror: ((e: Event) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

// ── Data ──────────────────────────────────────────────────────────────────────
const practiceWords = [
  { word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', example: 'Pronunciation is important.' },
  { word: 'Comfortable',   phonetic: '/ˈkʌmftəbl/',        example: 'This chair is comfortable.' },
  { word: 'Vocabulary',    phonetic: '/vəˈkæbjʊləri/',     example: 'Build your vocabulary every day.' },
  { word: 'Beautiful',     phonetic: '/ˈbjuːtɪfʊl/',       example: 'What a beautiful day!' },
  { word: 'Specifically',  phonetic: '/spəˈsɪfɪkli/',      example: 'I specifically asked for this.' },
  { word: 'Particularly',  phonetic: '/pəˈtɪkjʊləli/',     example: "I'm particularly interested in this." },
  { word: 'Necessary',     phonetic: '/ˈnesəseri/',         example: 'Is it necessary to do this?' },
  { word: 'Definitely',    phonetic: '/ˈdefɪnətli/',        example: 'I will definitely come.' },
]

const sentences = [
  'The weather is beautiful today.',
  'I would like to improve my English speaking skills.',
  'Can you please repeat that more slowly?',
  'I have been studying English for three years.',
  'Could you help me with my pronunciation?',
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z\s]/g, '').trim()
}

function scoreWords(target: string, spoken: string): number {
  const tw = normalize(target).split(/\s+/)
  const sw = normalize(spoken).split(/\s+/)
  let hits = 0
  tw.forEach((w, i) => { if (sw[i] === w) hits++ })
  return Math.round((hits / tw.length) * 100)
}

interface WordDiff { word: string; correct: boolean }

function diffWords(target: string, spoken: string): WordDiff[] {
  const tw = normalize(target).split(/\s+/)
  const sw = normalize(spoken).split(/\s+/)
  return tw.map((w, i) => ({ word: w, correct: sw[i] === w }))
}

function getSpeechRec(): (new () => SpeechRecognitionInst) | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

// ── Score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Excellent!' : score >= 50 ? 'Good job!' : 'Keep trying!'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4 shadow-lg"
        style={{ borderColor: color, color, backgroundColor: `${color}18` }}
      >
        {score}%
      </div>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{
            backgroundColor:
              i === current ? '#6366f1' : i < current ? '#6366f180' : 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  )
}

// ── Tab type ──────────────────────────────────────────────────────────────────
type Tab = 'listen' | 'read' | 'free'

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PronunciationPage() {
  const [tab, setTab] = useState<Tab>('listen')
  const supported     = getSpeechRec() !== null

  const TABS: { id: Tab; label: string }[] = [
    { id: 'listen', label: '🔊 Listen & Repeat' },
    { id: 'read',   label: '📖 Read Aloud' },
    { id: 'free',   label: '🗣️ Free Speaking' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Pronunciation 🎤</h1>
        <p className="text-[#64748b] text-sm mt-1">Practice speaking and get instant feedback</p>
      </motion.div>

      {/* Browser support warning */}
      {!supported && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm"
        >
          <span className="text-lg shrink-0">🌐</span>
          Please use Chrome or Edge for best experience
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${glass} rounded-2xl p-1.5 flex gap-1`}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all truncate ${
              tab === t.id
                ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/20'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'listen' && <ListenRepeatTab  supported={supported} />}
          {tab === 'read'   && <ReadAloudTab     supported={supported} />}
          {tab === 'free'   && <FreeSpeakingTab  supported={supported} />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}

// ── Listen & Repeat ───────────────────────────────────────────────────────────
function ListenRepeatTab({ supported }: { supported: boolean }) {
  const [idx, setIdx]           = useState(0)
  const [recording, setRec]     = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTrans]  = useState('')
  const [score, setScore]       = useState<number | null>(null)
  const recRef                  = useRef<SpeechRecognitionInst | null>(null)
  const current                 = practiceWords[idx]

  function playWord() {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(current.word)
    utt.rate  = 0.85
    utt.lang  = 'en-US'
    setSpeaking(true)
    utt.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  function startRec() {
    const Rec = getSpeechRec()
    if (!Rec) return
    recRef.current?.abort()
    const rec          = new Rec()
    rec.lang           = 'en-US'
    rec.continuous     = false
    rec.interimResults = false
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      setTrans(text)
      setScore(scoreWords(current.word, text))
    }
    rec.onerror = () => setRec(false)
    rec.onend   = () => setRec(false)
    recRef.current = rec
    rec.start()
    setRec(true)
    setTrans('')
    setScore(null)
  }

  function stopRec() {
    recRef.current?.stop()
    setRec(false)
  }

  function next() {
    setIdx((i) => (i + 1) % practiceWords.length)
    setTrans('')
    setScore(null)
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-6`}>
      <ProgressDots total={practiceWords.length} current={idx} />

      {/* Word */}
      <div className="text-center space-y-2 py-2">
        <div className="text-5xl font-black text-white tracking-tight">{current.word}</div>
        <div className="text-[#8b5cf6] font-mono text-lg">{current.phonetic}</div>
        <div className="text-[#475569] text-sm italic">&ldquo;{current.example}&rdquo;</div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={playWord}
          disabled={speaking}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#6366f1]/40 text-[#818cf8] hover:bg-[#6366f1]/10 transition-all font-semibold text-sm disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4" />
          {speaking ? 'Playing…' : '🔊 Play'}
        </button>

        <button
          onClick={recording ? stopRec : startRec}
          disabled={!supported}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 ${
            recording
              ? 'bg-red-500/20 border border-red-500/60 text-red-400 animate-pulse'
              : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.03]'
          }`}
        >
          {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {recording ? 'Stop' : '🎤 Record'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-[#475569] text-xs uppercase tracking-wider mb-1.5">You said:</p>
              <p className="text-white text-lg font-semibold">&ldquo;{transcript}&rdquo;</p>
            </div>
            {score !== null && (
              <div className="flex justify-center">
                <ScoreBadge score={score} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={next}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#64748b] hover:text-white hover:bg-white/[0.04] transition-all text-sm font-medium border border-white/[0.06]"
      >
        Next word <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Read Aloud ────────────────────────────────────────────────────────────────
function ReadAloudTab({ supported }: { supported: boolean }) {
  const [idx, setIdx]       = useState(0)
  const [recording, setRec] = useState(false)
  const [transcript, setTr] = useState('')
  const [score, setScore]   = useState<number | null>(null)
  const [diff, setDiff]     = useState<WordDiff[]>([])
  const recRef              = useRef<SpeechRecognitionInst | null>(null)
  const current             = sentences[idx]

  function startRec() {
    const Rec = getSpeechRec()
    if (!Rec) return
    recRef.current?.abort()
    const rec          = new Rec()
    rec.lang           = 'en-US'
    rec.continuous     = false
    rec.interimResults = false
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      setTr(text)
      setScore(scoreWords(current, text))
      setDiff(diffWords(current, text))
    }
    rec.onerror = () => setRec(false)
    rec.onend   = () => setRec(false)
    recRef.current = rec
    rec.start()
    setRec(true)
    setTr('')
    setScore(null)
    setDiff([])
  }

  function stopRec() {
    recRef.current?.stop()
    setRec(false)
  }

  function next() {
    setIdx((i) => (i + 1) % sentences.length)
    setTr('')
    setScore(null)
    setDiff([])
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-6`}>
      <ProgressDots total={sentences.length} current={idx} />

      {/* Sentence */}
      <div className="text-center space-y-3 py-2 min-h-[80px] flex flex-col justify-center">
        <p className="text-[#475569] text-xs uppercase tracking-wider">Read this sentence aloud:</p>
        {diff.length > 0 ? (
          <p className="text-xl sm:text-2xl font-bold leading-relaxed flex flex-wrap justify-center gap-x-2 gap-y-1.5">
            {diff.map((d, i) => (
              <span key={i} className="flex items-center gap-1">
                <span style={{ color: d.correct ? '#10b981' : '#ef4444' }}>{d.word}</span>
                {d.correct
                  ? <CheckCircle className="w-3 h-3 text-[#10b981]" />
                  : <XCircle    className="w-3 h-3 text-[#ef4444]" />
                }
              </span>
            ))}
          </p>
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">{current}</p>
        )}
      </div>

      {/* Record */}
      <div className="flex justify-center">
        <button
          onClick={recording ? stopRec : startRec}
          disabled={!supported}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-40 ${
            recording
              ? 'bg-red-500/20 border border-red-500/60 text-red-400 animate-pulse'
              : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.03]'
          }`}
        >
          {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {recording ? 'Stop Recording' : '🎤 Start'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {transcript && score !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-[#475569] text-xs uppercase tracking-wider mb-1.5">You said:</p>
              <p className="text-white leading-relaxed">&ldquo;{transcript}&rdquo;</p>
            </div>
            <div className="flex justify-center">
              <ScoreBadge score={score} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={next}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#64748b] hover:text-white hover:bg-white/[0.04] transition-all text-sm font-medium border border-white/[0.06]"
      >
        Next sentence <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Free Speaking ─────────────────────────────────────────────────────────────
function FreeSpeakingTab({ supported }: { supported: boolean }) {
  const [recording, setRec] = useState(false)
  const [transcript, setTr] = useState('')
  const [feedback, setFb]   = useState('')
  const [loading, setLoad]  = useState(false)
  const recRef              = useRef<SpeechRecognitionInst | null>(null)

  function startRec() {
    const Rec = getSpeechRec()
    if (!Rec) return
    recRef.current?.abort()
    const rec          = new Rec()
    rec.lang           = 'en-US'
    rec.continuous     = true
    rec.interimResults = false
    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript + ' '
      }
      setTr(text.trim())
    }
    rec.onerror = () => setRec(false)
    recRef.current = rec
    rec.start()
    setRec(true)
    setTr('')
    setFb('')
  }

  function stopRec() {
    recRef.current?.stop()
    setRec(false)
  }

  async function getFeedback() {
    if (!transcript.trim()) return
    setLoad(true)
    try {
      const res  = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `I just said this in English: "${transcript}"\n\nPlease give me brief, encouraging pronunciation and fluency feedback. Point out any awkward phrases and suggest one concrete improvement. Keep it under 80 words.`,
          }],
        }),
      })
      const data = await res.json()
      setFb(data.reply || 'No feedback received.')
    } catch {
      setFb('Could not connect. Please try again.')
    } finally {
      setLoad(false)
    }
  }

  function reset() {
    setTr('')
    setFb('')
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-6`}>
      <div className="text-center space-y-1">
        <p className="text-white font-semibold">Speak freely in English</p>
        <p className="text-[#64748b] text-sm">Zhan will give you instant feedback on your speaking</p>
      </div>

      {/* Big mic */}
      <div className="flex flex-col items-center gap-3 py-2">
        <button
          onMouseDown={startRec}
          onMouseUp={stopRec}
          onTouchStart={(e) => { e.preventDefault(); startRec() }}
          onTouchEnd={(e)   => { e.preventDefault(); stopRec()  }}
          disabled={!supported}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all select-none outline-none ${
            recording
              ? 'bg-red-500/20 border-2 border-red-500 scale-110'
              : 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95'
          } disabled:opacity-40`}
        >
          {recording && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-25" />
          )}
          <Mic className={`w-10 h-10 ${recording ? 'text-red-400' : 'text-white'}`} />
        </button>
        <p className="text-[#64748b] text-sm font-medium">
          {recording ? '🔴 Recording… Release to stop' : 'Hold to speak'}
        </p>
      </div>

      {/* Transcript */}
      <AnimatePresence>
        {transcript && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-[#475569] text-xs uppercase tracking-wider mb-1.5">What you said:</p>
              <p className="text-white leading-relaxed">&ldquo;{transcript}&rdquo;</p>
            </div>
            {!feedback && !loading && (
              <button
                onClick={getFeedback}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                Get Zhan&apos;s feedback
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {(feedback || loading) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-4 bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/30 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-xs font-black text-white shrink-0">
                  Z
                </div>
                <span className="text-[#818cf8] text-xs font-semibold">Zhan&apos;s Feedback</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[#64748b] text-sm">Thinking…</span>
                </div>
              ) : (
                <p className="text-white text-sm leading-relaxed">{feedback}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset */}
      {(transcript || feedback) && !loading && (
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#64748b] hover:text-white hover:bg-white/[0.04] transition-all text-sm border border-white/[0.06]"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  )
}
