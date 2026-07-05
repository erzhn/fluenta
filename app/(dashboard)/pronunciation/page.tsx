'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, ChevronRight, RefreshCw, Play } from 'lucide-react'

interface SpeechRecAlt     { transcript: string; confidence: number }
interface SpeechRecResult  { [i: number]: SpeechRecAlt; length: number; isFinal: boolean }
interface SpeechRecResults { [i: number]: SpeechRecResult; length: number }
interface SpeechRecEvent   { results: SpeechRecResults }
interface SpeechRecInst2 {
  continuous: boolean; interimResults: boolean; lang: string
  onresult: ((e: SpeechRecEvent) => void) | null
  onerror:  ((e: Event) => void) | null
  onend:    (() => void) | null
  start(): void; stop(): void; abort(): void
}

// ── Data ───────────────────────────────────────────────────────────────────────
type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']

interface Phrase { text: string; phonetics: string[] }

const SHADOW_PHRASES: Record<Level, Phrase[]> = {
  A1: [
    { text: 'Hello my name is Alex',    phonetics: ['həˈloʊ','maɪ','neɪm','ɪz','ˈælɪks'] },
    { text: 'I live in a big city',     phonetics: ['aɪ','lɪv','ɪn','ə','bɪɡ','ˈsɪti'] },
    { text: 'What time is it',          phonetics: ['wɒt','taɪm','ɪz','ɪt'] },
    { text: 'I like coffee and tea',    phonetics: ['aɪ','laɪk','ˈkɒfi','ænd','tiː'] },
    { text: 'She has a beautiful house',phonetics: ['ʃiː','hæz','ə','ˈbjuːtɪfʊl','haʊs'] },
  ],
  A2: [
    { text: 'Could you help me find the station',   phonetics: ['kʊd','juː','help','miː','faɪnd','ðə','ˈsteɪʃən'] },
    { text: 'I usually wake up at seven o clock',   phonetics: ['aɪ','ˈjuːʒuəli','weɪk','ʌp','æt','ˈsevən','əˈklɒk'] },
    { text: 'The weather is nice today isn it',     phonetics: ['ðə','ˈweðər','ɪz','naɪs','təˈdeɪ','ˈɪznt'] },
  ],
  B1: [
    { text: 'I ve been learning English for two years now',       phonetics: ['aɪv','bɪn','ˈlɜːnɪŋ','ˈɪŋɡlɪʃ','fɔː','tuː','jɪərz','naʊ'] },
    { text: 'If I had more time I would travel the world',        phonetics: ['ɪf','aɪ','hæd','mɔː','taɪm','aɪ','wʊd','ˈtræv(ə)l','ðə','wɜːld'] },
    { text: 'She said she was feeling much better',               phonetics: ['ʃiː','sed','ʃiː','wɒz','ˈfiːlɪŋ','mʌtʃ','ˈbetər'] },
  ],
  B2: [
    { text: 'The results of the study were quite surprising to the researchers',  phonetics: ['ðə','rɪˈzʌlts','əv','ðə','ˈstʌdi','wər','kwaɪt','səˈpraɪzɪŋ','tə','ðə','rɪˈsɜːtʃərz'] },
    { text: 'Despite the rain they decided to go ahead with the outdoor event',   phonetics: ['dɪˈspaɪt','ðə','reɪn','ðeɪ','dɪˈsaɪdɪd','tə','ɡəʊ','əˈhed','wɪð','ðə','ˈaʊtdɔː','ɪˈvent'] },
  ],
  C1: [
    { text: 'The extent to which technology has transformed our daily lives is truly remarkable',       phonetics: ['ðə','ɪkˈstent','tə','wɪtʃ','tekˈnɒlədʒi','hæz','trænsˈfɔːmd','ˈaʊər','ˈdeɪli','laɪvz','ɪz','ˈtruːli','rɪˈmɑːkəb(ə)l'] },
    { text: 'Notwithstanding the challenges the team persevered and ultimately succeeded', phonetics: ['ˌnɒtwɪθˈstændɪŋ','ðə','ˈtʃælɪndʒɪz','ðə','tiːm','ˌpɜːsɪˈvɪəd','ænd','ˈʌltɪmɪtli','səkˈsiːdɪd'] },
  ],
}

const READ_PARAGRAPHS: Record<Level, string> = {
  A1: 'My name is Anna. I am from Russia. I live in Moscow. I have a cat. Her name is Luna. I love my cat.',
  A2: 'Every morning I wake up at seven. I have breakfast and then I go to work. I take the bus. My office is in the city centre. I finish work at five o clock.',
  B1: "Last summer, I decided to travel to London for the first time. The city was amazing — full of history, culture, and incredible food. I visited the British Museum and took a boat trip on the Thames. It was an unforgettable experience.",
  B2: "Remote work has fundamentally changed how people think about productivity and work-life balance. While some employees thrive in home environments, others struggle with isolation and the blurring of professional boundaries.",
  C1: "The proliferation of digital technologies has engendered profound transformations in societal structures, challenging long-established norms and prompting a re-evaluation of what it means to be connected in the modern era.",
}

const FREE_TOPICS = [
  'Опиши свою комнату',
  'Расскажи о вчерашнем дне',
  'Что ты любишь есть?',
  'Опиши своего лучшего друга',
  'Какой твой любимый фильм и почему?',
  'Что ты делаешь в свободное время?',
  'Опиши идеальный отпуск',
  'Расскажи о своей работе или учёбе',
]

interface MinPair { word1: string; word2: string; sound: string }
const MINIMAL_PAIRS: MinPair[] = [
  { word1: 'SHIP',  word2: 'SHEEP', sound: 'i vs iː' },
  { word1: 'BAD',   word2: 'BED',   sound: 'æ vs e'  },
  { word1: 'THINK', word2: 'SINK',  sound: 'θ vs s'  },
  { word1: 'WINE',  word2: 'VINE',  sound: 'w vs v'  },
  { word1: 'RIGHT', word2: 'LIGHT', sound: 'r vs l'  },
  { word1: 'CAT',   word2: 'CUT',   sound: 'æ vs ʌ'  },
  { word1: 'THIS',  word2: 'THESE', sound: 'ɪ vs iː' },
]

const TONGUE_TWISTERS = [
  'She sells seashells by the seashore',
  'Peter Piper picked a peck of pickled peppers',
  'How much wood would a woodchuck chuck',
  'Red lorry yellow lorry',
  'Thirty three thousand people think that Thursday is better than Tuesday',
  'The sixth sick sheikh sixth sheep sick',
]

// ── Storage ────────────────────────────────────────────────────────────────────
interface SessionData {
  attempts: number
  totalScore: number
  bestScores: Record<string, number>
  weakSounds: Record<string, number[]>
  streak: number
  lastDate: string
}

function emptySession(): SessionData {
  return { attempts: 0, totalScore: 0, bestScores: {}, weakSounds: {}, streak: 0, lastDate: '' }
}

function loadSession(): SessionData {
  if (typeof window === 'undefined') return emptySession()
  try { return JSON.parse(localStorage.getItem('fluenta_pronunciation_scores') || '') as SessionData }
  catch { return emptySession() }
}

function saveScore(mode: string, score: number, sound?: string) {
  const d = loadSession()
  d.attempts++
  d.totalScore += score
  if (!d.bestScores[mode] || score > d.bestScores[mode]) d.bestScores[mode] = score
  if (sound) {
    if (!d.weakSounds[sound]) d.weakSounds[sound] = []
    d.weakSounds[sound].push(score)
  }
  const today = new Date().toDateString()
  if (d.lastDate !== today) {
    d.streak = d.lastDate === new Date(Date.now() - 86400000).toDateString() ? d.streak + 1 : 1
    d.lastDate = today
  }
  localStorage.setItem('fluenta_pronunciation_scores', JSON.stringify(d))
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

function norm(t: string) { return t.toLowerCase().replace(/[^a-z\s]/g, '').trim() }

function scoreWords(target: string, spoken: string) {
  const tw = norm(target).split(/\s+/)
  const sw = norm(spoken).split(/\s+/)
  let hits = 0
  tw.forEach((w) => { if (sw.includes(w)) hits++ })
  return Math.round((hits / tw.length) * 100)
}

function diffWords(target: string, spoken: string) {
  const tw = norm(target).split(/\s+/)
  const sw = norm(spoken).split(/\s+/)
  return tw.map((w) => ({ word: w, ok: sw.includes(w) }))
}

function getSR(): (new () => SpeechRecInst2) | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & { SpeechRecognition?: new () => SpeechRecInst2; webkitSpeechRecognition?: new () => SpeechRecInst2 }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

function speak(text: string, rate = 1) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = rate
  window.speechSynthesis.speak(u)
}

function colorFor(score: number) {
  return score >= 90 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
}
function labelFor(score: number) {
  return score >= 90 ? 'Отлично!' : score >= 60 ? 'Хорошо!' : 'Попробуй снова'
}

// ── Shared sub-components ──────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const c = colorFor(score)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4 shadow-lg"
        style={{ borderColor: c, color: c, backgroundColor: `${c}18` }}>
        {score}%
      </div>
      <span className="text-sm font-bold" style={{ color: c }}>{labelFor(score)}</span>
    </div>
  )
}

// Pre-computed bar heights so they don't change on re-render
const BAR_HEIGHTS = [14, 22, 30, 18, 26, 34, 20, 28, 16, 24, 32, 18]

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {BAR_HEIGHTS.map((h, i) => (
        <motion.div key={i} className="w-1.5 rounded-full"
          style={{ backgroundColor: '#6366f1' }}
          animate={active
            ? { height: [4, h, 4], opacity: [0.4, 1, 0.4] }
            : { height: 4, opacity: 0.2 }}
          transition={{ duration: 0.6 + i * 0.04, repeat: Infinity, delay: i * 0.06 }}
        />
      ))}
    </div>
  )
}

function LevelTabs({ value, onChange }: { value: Level; onChange: (l: Level) => void }) {
  return (
    <div className="flex gap-1">
      {LEVELS.map((l) => (
        <button key={l} onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            value === l ? 'bg-[#6366f1] text-white' : 'text-[#64748b] hover:text-white bg-white/[0.03]'
          }`}>{l}
        </button>
      ))}
    </div>
  )
}

// ── Mode 1: Shadowing ──────────────────────────────────────────────────────────
function ShadowingTab({ supported }: { supported: boolean }) {
  const [level, setLevel]     = useState<Level>('A1')
  const [idx, setIdx]         = useState(0)
  const [recording, setRec]   = useState(false)
  const [score, setScore]     = useState<number | null>(null)
  const [diff, setDiff]       = useState<{ word: string; ok: boolean }[]>([])
  const [playbackUrl, setUrl] = useState<string | null>(null)
  const recRef  = useRef<SpeechRecInst2 | null>(null)
  const mrRef   = useRef<MediaRecorder | null>(null)
  const chunks  = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const phrases = SHADOW_PHRASES[level]
  const phrase  = phrases[idx % phrases.length]
  const words   = phrase.text.split(' ')

  function playPhrase(rate = 1) { speak(phrase.text, rate) }

  async function startRec() {
    const SR = getSR(); if (!SR) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = (e) => chunks.current.push(e.data)
      mr.onstop = () => {
        setUrl(URL.createObjectURL(new Blob(chunks.current, { type: 'audio/webm' })))
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      mrRef.current = mr
    } catch { /* mic denied */ }

    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      const s = scoreWords(phrase.text, text)
      setScore(s)
      setDiff(diffWords(phrase.text, text))
      saveScore('shadowing', s)
    }
    rec.onerror = () => setRec(false)
    rec.onend   = () => { setRec(false); mrRef.current?.stop() }
    recRef.current = rec; rec.start()
    setRec(true); setScore(null); setDiff([]); setUrl(null)
  }

  function stopRec() { recRef.current?.stop(); setRec(false) }

  function playMyRecording() {
    if (!playbackUrl) return
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = playbackUrl
    audioRef.current.play()
  }

  function next() {
    setIdx((i) => (i + 1) % phrases.length)
    setScore(null); setDiff([]); setUrl(null)
  }

  function changeLevel(l: Level) {
    setLevel(l); setIdx(0); setScore(null); setDiff([]); setUrl(null)
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-5`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[#64748b] text-xs uppercase tracking-wider">Уровень</span>
        <LevelTabs value={level} onChange={changeLevel} />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {phrases.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: i === idx % phrases.length ? '#6366f1' : i < idx % phrases.length ? '#6366f180' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {/* Phrase + phonetics */}
      <div className="text-center py-2">
        <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-3">{phrase.text}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
          {words.map((w, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              {score !== null && diff[i] && (
                <span className="text-sm font-bold" style={{ color: diff[i].ok ? '#10b981' : '#ef4444' }}>
                  {diff[i].ok ? '✅' : '❌'}
                </span>
              )}
              <span className="text-white/80 text-sm font-medium">{w}</span>
              <span className="text-[#8b5cf6] font-mono text-xs">{phrase.phonetics[i] ?? ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => playPhrase(1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6366f1]/40 text-[#818cf8] hover:bg-[#6366f1]/10 transition-all text-sm font-semibold">
          <Volume2 className="w-4 h-4" /> 🔊 Слушай
        </button>
        <button onClick={() => playPhrase(0.6)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6366f1]/30 text-[#818cf8] hover:bg-[#6366f1]/10 transition-all text-sm font-semibold">
          🐢 Медленно
        </button>
        <button onClick={recording ? stopRec : startRec} disabled={!supported}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 ${
            recording ? 'bg-red-500/20 border border-red-500/60 text-red-400' : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/20'
          }`}>
          {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {recording ? 'Стоп' : '🎤 Повторяй'}
        </button>
        {playbackUrl && (
          <button onClick={playMyRecording}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#64748b] hover:text-white text-sm font-semibold transition-all">
            <Play className="w-4 h-4" /> ▶️ Моя запись
          </button>
        )}
      </div>

      <Waveform active={recording} />

      <AnimatePresence>
        {score !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {diff.map((d, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                  d.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                       : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>{d.word}</span>
              ))}
            </div>
            <div className="flex justify-center"><ScoreBadge score={score} /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={next}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#64748b] hover:text-white hover:bg-white/[0.04] transition-all text-sm font-medium border border-white/[0.06]">
        Следующая фраза → <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Mode 2: Read Aloud ─────────────────────────────────────────────────────────
function ReadAloudTab({ supported }: { supported: boolean }) {
  const [level, setLevel]   = useState<Level>('A1')
  const [recording, setRec] = useState(false)
  const [score, setScore]   = useState<number | null>(null)
  const [diff, setDiff]     = useState<{ word: string; ok: boolean }[]>([])
  const recRef      = useRef<SpeechRecInst2 | null>(null)
  const transcriptRef = useRef('')

  const para = READ_PARAGRAPHS[level]

  function startRec() {
    const SR = getSR(); if (!SR) return
    transcriptRef.current = ''
    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = false
    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' '
      transcriptRef.current = text.trim()
    }
    rec.onerror = () => setRec(false)
    rec.onend   = () => setRec(false)
    recRef.current = rec; rec.start()
    setRec(true); setScore(null); setDiff([])
  }

  function stopRec() {
    recRef.current?.stop()
    setRec(false)
    const text = transcriptRef.current
    if (text) {
      const s = scoreWords(para, text)
      setScore(s)
      setDiff(diffWords(para, text))
      saveScore('read-aloud', s)
    }
  }

  function reset() { setScore(null); setDiff([]); transcriptRef.current = '' }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-5`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[#64748b] text-xs uppercase tracking-wider">Уровень</span>
        <LevelTabs value={level} onChange={(l) => { setLevel(l); reset() }} />
      </div>

      <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
        <p className="text-[#475569] text-xs uppercase tracking-wider mb-2">Читай вслух:</p>
        {diff.length > 0 ? (
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            {diff.map((d, i) => (
              <span key={i} className="mr-1" style={{ color: d.ok ? '#10b981' : '#ef4444' }}>{d.word}</span>
            ))}
          </p>
        ) : (
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed">{para}</p>
        )}
      </div>

      <Waveform active={recording} />

      <div className="flex justify-center">
        <button onClick={recording ? stopRec : startRec} disabled={!supported}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-40 ${
            recording ? 'bg-red-500/20 border border-red-500/60 text-red-400 animate-pulse'
                      : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.03]'
          }`}>
          {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {recording ? 'Остановить' : '🎤 Начать'}
        </button>
      </div>

      <AnimatePresence>
        {score !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex justify-center"><ScoreBadge score={score} /></div>
            <button onClick={reset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#64748b] hover:text-white hover:bg-white/[0.04] transition-all text-sm border border-white/[0.06]">
              <RefreshCw className="w-4 h-4" /> Попробовать снова
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Mode 3: 30 Seconds Free Speech ────────────────────────────────────────────
function FreeSpeechTab({ supported }: { supported: boolean }) {
  const [topicIdx, setTopicIdx] = useState(0)
  const [recording, setRec]     = useState(false)
  const [transcript, setTr]     = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [done, setDone]         = useState(false)
  const recRef   = useRef<SpeechRecInst2 | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const topic = FREE_TOPICS[topicIdx]

  function startRec() {
    const SR = getSR(); if (!SR) return
    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = false
    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' '
      setTr(text.trim())
    }
    rec.onerror = () => endRec()
    recRef.current = rec; rec.start()
    setRec(true); setTr(''); setDone(false); setTimeLeft(30)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { endRec(); return 0 } return t - 1 })
    }, 1000)
  }

  function endRec() {
    recRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRec(false); setDone(true)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0
  const fluency   = Math.min(100, Math.round((wordCount / 40) * 100))

  function newTopic() {
    setTopicIdx((i) => (i + 1) % FREE_TOPICS.length)
    setTr(''); setDone(false); setTimeLeft(30)
  }

  const circumference = 2 * Math.PI * 40

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-5`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-white font-bold">Тема:</h3>
        <button onClick={newTopic} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#64748b] hover:text-white bg-white/[0.03] border border-white/[0.06] text-xs transition-all">
          <RefreshCw className="w-3 h-3" /> Новая тема
        </button>
      </div>
      <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl p-4 text-center">
        <p className="text-[#818cf8] font-bold text-lg">{topic}</p>
        <p className="text-[#64748b] text-xs mt-1">Говори 30 секунд на английском</p>
      </div>
      {recording && (
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - timeLeft / 30)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-2xl">{timeLeft}</span>
            </div>
          </div>
        </div>
      )}
      <Waveform active={recording} />
      <div className="flex justify-center">
        <button onClick={recording ? endRec : startRec} disabled={!supported}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-40 ${
            recording ? 'bg-red-500/20 border border-red-500/60 text-red-400'
                      : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.03]'
          }`}>
          {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {recording ? 'Закончить' : '🎤 Начать говорить'}
        </button>
      </div>
      {done && transcript && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
            <p className="text-[#64748b] text-xs mb-1">Ты сказал:</p>
            <p className="text-white/80 text-sm">{transcript}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748b] text-sm">Слов произнесено: <span className="text-white font-bold">{wordCount}</span></span>
            <ScoreBadge score={fluency} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Mode 4: Minimal Pairs ──────────────────────────────────────────────────────
function MinimalPairsTab({ supported }: { supported: boolean }) {
  const [idx, setIdx]         = useState(0)
  const [phase, setPhase]     = useState<'listen'|'guess'|'speak'|'result'>('listen')
  const [playing, setPlaying] = useState<1|2|null>(null)
  const [guess, setGuess]     = useState<1|2|null>(null)
  const [correct, setCorrect] = useState<boolean|null>(null)
  const [spokenScore, setSpokenScore] = useState<number|null>(null)
  const [target, setTarget]   = useState(1)
  const recRef = useRef<SpeechRecInst2 | null>(null)

  const pair = MINIMAL_PAIRS[idx]

  function playWord(which: 1|2, rate=1) {
    setPlaying(which)
    const word = which === 1 ? pair.word1 : pair.word2
    const u = new SpeechSynthesisUtterance(word.toLowerCase())
    u.lang = 'en-US'; u.rate = rate
    u.onend = () => setPlaying(null)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  function startGuess() {
    const t = Math.random() < 0.5 ? 1 : 2
    setTarget(t); setPhase('guess'); setGuess(null); setCorrect(null)
    setTimeout(() => playWord(t as 1|2), 300)
  }

  function makeGuess(which: 1|2) {
    setGuess(which)
    const ok = which === target
    setCorrect(ok)
    saveScore('minimal-pairs', ok ? 100 : 0, pair.sound)
    setTimeout(() => setPhase('speak'), 1000)
  }

  function startSpeak() {
    const SR = getSR(); if (!SR) return
    const word = target === 1 ? pair.word1 : pair.word2
    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e) => {
      const spoken = e.results[0][0].transcript.toUpperCase()
      const s = spoken.includes(word) ? 100 : scoreWords(word, spoken)
      setSpokenScore(s)
      saveScore('minimal-pairs', s, pair.sound)
      setPhase('result')
    }
    rec.onerror = () => setPhase('result')
    recRef.current = rec; rec.start()
  }

  function next() {
    setIdx((i) => (i + 1) % MINIMAL_PAIRS.length)
    setPhase('listen'); setGuess(null); setCorrect(null); setSpokenScore(null)
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-5`}>
      <div className="text-center">
        <span className="text-[#64748b] text-xs bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
          Звук: {pair.sound}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {([1,2] as const).map((w) => {
          const word = w === 1 ? pair.word1 : pair.word2
          return (
            <button key={w} onClick={() => playWord(w)}
              className={`p-6 rounded-2xl border font-black text-2xl transition-all ${
                playing === w ? 'bg-[#6366f1]/20 border-[#6366f1] scale-[1.03] text-[#818cf8]' : 'bg-white/[0.03] border-white/10 text-white hover:border-[#6366f1]/50'
              }`}>
              {word}
            </button>
          )
        })}
      </div>
      {phase === 'listen' && (
        <div className="space-y-3">
          <p className="text-center text-[#64748b] text-sm">Нажми на слова чтобы услышать разницу, потом:</p>
          <button onClick={startGuess} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm">
            🎯 Угадай какое слово!
          </button>
        </div>
      )}
      {phase === 'guess' && (
        <div className="space-y-3">
          <p className="text-center text-white font-bold">Какое слово прозвучало?</p>
          <div className="grid grid-cols-2 gap-3">
            {([1,2] as const).map((w) => (
              <button key={w} onClick={() => makeGuess(w)}
                className={`py-4 rounded-xl font-bold border-2 transition-all text-lg ${
                  guess === w ? (correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400')
                             : 'bg-white/[0.04] border-white/10 text-white hover:border-[#6366f1]/60'
                }`}>
                {w === 1 ? pair.word1 : pair.word2}
              </button>
            ))}
          </div>
          {correct !== null && (
            <p className={`text-center font-bold ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {correct ? '✅ Правильно!' : `❌ Нет, прозвучало "${target === 1 ? pair.word1 : pair.word2}"`}
            </p>
          )}
        </div>
      )}
      {phase === 'speak' && (
        <div className="space-y-3">
          <p className="text-center text-white font-bold">Теперь произнеси: <span className="text-[#818cf8]">{target === 1 ? pair.word1 : pair.word2}</span></p>
          <button onClick={startSpeak} disabled={!supported} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm disabled:opacity-40">
            🎤 Произнести
          </button>
        </div>
      )}
      {phase === 'result' && (
        <div className="space-y-4">
          {spokenScore !== null && <div className="flex justify-center"><ScoreBadge score={spokenScore} /></div>}
          <button onClick={next} className="w-full py-3 rounded-xl text-[#64748b] hover:text-white bg-white/[0.03] border border-white/[0.06] text-sm font-medium transition-all">
            Следующая пара →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Mode 5: Tongue Twisters ────────────────────────────────────────────────────
function TongueTwistersTab({ supported }: { supported: boolean }) {
  const [idx, setIdx]       = useState(0)
  const [speed, setSpeed]   = useState<'slow'|'normal'|'fast'>('slow')
  const [recording, setRec] = useState(false)
  const [scores, setScores] = useState<Record<string,number>>({})
  const recRef = useRef<SpeechRecInst2 | null>(null)
  const tt = TONGUE_TWISTERS[idx]
  const rateMap = { slow: 0.6, normal: 1, fast: 1.4 }

  function startRec() {
    const SR = getSR(); if (!SR) return
    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e) => {
      const spoken = e.results[0][0].transcript
      const s = scoreWords(tt, spoken)
      setScores((prev) => ({ ...prev, [speed]: s }))
      saveScore('tongue-twister', s)
      setRec(false)
    }
    rec.onerror = () => setRec(false)
    rec.onend   = () => setRec(false)
    recRef.current = rec; rec.start()
    setRec(true)
  }

  return (
    <div className={`${glass} rounded-2xl p-5 sm:p-6 space-y-5`}>
      <div className="flex gap-2 justify-center">
        {TONGUE_TWISTERS.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setScores({}) }}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-[#6366f1] scale-125' : 'bg-white/20'}`}/>
        ))}
      </div>
      <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06] text-center">
        <p className="text-white font-bold text-lg leading-relaxed">{tt}</p>
      </div>
      <div className="flex gap-2 justify-center">
        {(['slow','normal','fast'] as const).map((s) => (
          <button key={s} onClick={() => setSpeed(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              speed === s ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white/[0.03] border-white/10 text-[#64748b] hover:text-white'
            }`}>
            {s === 'slow' ? '🐢 Медленно' : s === 'normal' ? '🚶 Нормально' : '🏃 Быстро'}
            {scores[s] !== undefined && <span className="ml-1 text-xs opacity-70">{scores[s]}%</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => speak(tt, rateMap[speed])}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#6366f1]/40 text-[#818cf8] hover:bg-[#6366f1]/10 text-sm font-semibold transition-all">
          <Volume2 className="w-4 h-4"/> 🔊 Послушай
        </button>
        <button onClick={recording ? () => recRef.current?.stop() : startRec} disabled={!supported}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 ${
            recording ? 'bg-red-500/20 border border-red-500/60 text-red-400 animate-pulse'
                      : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg'
          }`}>
          {recording ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
          {recording ? 'Слушаю...' : '🎤 Попробуй'}
        </button>
      </div>
      <Waveform active={recording} />
      {Object.keys(scores).length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {(['slow','normal','fast'] as const).map((s) => scores[s] !== undefined && (
            <div key={s} className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <p className="text-[#64748b] text-xs mb-1">{s === 'slow' ? '🐢' : s === 'normal' ? '🚶' : '🏃'}</p>
              <p className="font-black text-lg" style={{ color: colorFor(scores[s]) }}>{scores[s]}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Progress Panel ─────────────────────────────────────────────────────────────
function ProgressPanel() {
  const [data, setData] = useState<SessionData>(emptySession())
  useEffect(() => { setData(loadSession()) }, [])
  const avg = data.attempts > 0 ? Math.round(data.totalScore / data.attempts) : 0
  const weakSounds = Object.entries(data.weakSounds)
    .map(([sound, scores]) => ({ sound, avg: Math.round(scores.reduce((a,b) => a+b,0)/scores.length) }))
    .filter((x) => x.avg < 70)
    .sort((a,b) => a.avg - b.avg)
    .slice(0, 3)
  return (
    <div className={`${glass} rounded-2xl p-5 space-y-4`}>
      <h3 className="text-white font-bold">📊 Прогресс</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-2xl font-black text-[#818cf8]">{data.attempts}</p>
          <p className="text-[#64748b] text-xs">попыток</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-2xl font-black" style={{ color: colorFor(avg) }}>{avg}%</p>
          <p className="text-[#64748b] text-xs">средний балл</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-2xl font-black text-orange-400">{data.streak}🔥</p>
          <p className="text-[#64748b] text-xs">дней подряд</p>
        </div>
      </div>
      {weakSounds.length > 0 && (
        <div className="space-y-2">
          <p className="text-[#64748b] text-xs uppercase tracking-wider">Слабые звуки</p>
          {weakSounds.map((x) => (
            <div key={x.sound} className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
              <span className="text-white/70 text-sm font-mono">{x.sound}</span>
              <span className="text-red-400 font-bold text-sm">{x.avg}%</span>
            </div>
          ))}
          <p className="text-[#64748b] text-xs">💡 Тренируй эти звуки в «Минимальных парах»</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
type Mode = 'shadow'|'read'|'free'|'pairs'|'twister'
const MODES: { id: Mode; label: string }[] = [
  { id: 'shadow',  label: '🎭 Повторяй за мной' },
  { id: 'read',    label: '📖 Читай вслух'       },
  { id: 'free',    label: '⏱ 30 секунд'          },
  { id: 'pairs',   label: '👥 Минимальные пары'  },
  { id: 'twister', label: '🌀 Скороговорки'       },
]

export default function PronunciationPage() {
  const [mode, setMode]           = useState<Mode>('shadow')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(!!(
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
    ))
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">🎤 Тренажёр речи</h1>
          <p className="text-[#64748b] mt-1">Улучши произношение с помощью AI-анализа</p>
        </div>

        {!supported && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-400 text-sm">
            ⚠️ Тренажёр речи работает только в Chrome. Открой сайт в Google Chrome.
          </div>
        )}

        {/* Mode tabs */}
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                mode === m.id
                  ? 'bg-[#6366f1] border-[#6366f1] text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/[0.03] border-white/[0.06] text-[#64748b] hover:text-white hover:border-white/20'
              }`}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {mode === 'shadow'  && <ShadowingTab    supported={supported} />}
                {mode === 'read'    && <ReadAloudTab    supported={supported} />}
                {mode === 'free'    && <FreeSpeechTab   supported={supported} />}
                {mode === 'pairs'   && <MinimalPairsTab supported={supported} />}
                {mode === 'twister' && <TongueTwistersTab supported={supported} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <ProgressPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
