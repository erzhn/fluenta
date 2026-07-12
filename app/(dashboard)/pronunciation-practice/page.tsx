'use client'
import { useState, useRef } from 'react'

const PHRASES: Record<string, string[]> = {
  A1: [
    'Hello, my name is Anna.',
    'I am from Kazakhstan.',
    'How are you today?',
    'I like to eat apples.',
    'The weather is nice today.',
    'Can you help me please?',
    'I want a cup of tea.',
    'Where is the bathroom?',
  ],
  A2: [
    'I have been learning English for two years.',
    'Could you speak more slowly please?',
    'What time does the next bus arrive?',
    'I would like to book a table for two.',
    'The meeting starts at nine o\'clock.',
    'I really enjoy watching movies in English.',
  ],
  B1: [
    'I\'m particularly interested in environmental issues.',
    'Could you elaborate on that point a little more?',
    'The situation is considerably more complex than it appears.',
    'I\'d appreciate it if you could send me the report.',
    'We need to find a sustainable solution to this problem.',
  ],
  B2: [
    'The unprecedented growth has had far-reaching consequences.',
    'I\'d like to draw your attention to several key considerations.',
    'The data suggests a correlation between these two variables.',
    'We ought to thoroughly evaluate the potential risks involved.',
  ],
  C1: [
    'The multifaceted nature of this phenomenon warrants careful examination.',
    'One cannot underestimate the ramifications of such a paradigm shift.',
    'The juxtaposition of these perspectives yields fascinating insights.',
  ],
}

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

interface Attempt {
  phrase: string
  heard: string
  score: number
}

export default function PronunciationPracticePage() {
  const [level, setLevel] = useState<Level>('A1')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const phrases = PHRASES[level]
  const phrase = phrases[phraseIdx % phrases.length]

  function speak() {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(phrase)
    u.lang = 'en-US'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const v = voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) ?? voices.find(v => v.lang === 'en-US')
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }

  function calculateScore(original: string, heardText: string): number {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/)
    const origWords = normalize(original)
    const heardWords = normalize(heardText)
    let matches = 0
    origWords.forEach(w => { if (heardWords.includes(w)) matches++ })
    return Math.round((matches / origWords.length) * 100)
  }

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Ваш браузер не поддерживает распознавание речи. Используйте Chrome.')
      return
    }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setHeard(transcript)
      const s = calculateScore(phrase, transcript)
      setScore(s)
      setAttempts(a => [...a, { phrase, heard: transcript, score: s }])
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  function nextPhrase() {
    setPhraseIdx(i => i + 1)
    setHeard('')
    setScore(null)
  }

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length)
    : null

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Произношение</span></h1>
          <p className="text-[#64748b] text-sm mt-1">Послушай и повтори фразу</p>
        </div>
        {avgScore !== null && (
          <div className="text-right">
            <p className="text-white font-semibold text-lg">{avgScore}%</p>
            <p className="text-[#64748b] text-xs">средний балл</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['A1','A2','B1','B2','C1'] as Level[]).map(l => (
          <button key={l} onClick={() => { setLevel(l); setPhraseIdx(0); setHeard(''); setScore(null) }}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              level === l ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white/[0.04] border-white/10 text-[#94a3b8] hover:text-white'
            }`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 text-center">
        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-4">Повтори вслух:</p>
        <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed mb-6">
          &ldquo;{phrase}&rdquo;
        </p>
        <button onClick={speak}
          className="px-6 py-2.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-[#94a3b8]
            hover:text-white rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2">
          🔊 Послушать произношение
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${
            isListening
              ? 'bg-red-500 shadow-red-500/30 scale-110 animate-pulse'
              : 'bg-[#6366f1] shadow-[#6366f1]/30 hover:scale-105'
          }`}>
          {isListening ? '⏹' : '🎤'}
        </button>
      </div>
      <p className="text-center text-[#475569] text-sm mb-6">
        {isListening ? 'Слушаю... говори сейчас' : 'Нажми чтобы начать запись'}
      </p>

      {heard && score !== null && (
        <div className={`rounded-2xl p-5 mb-4 border ${
          score >= 80 ? 'bg-green-500/10 border-green-500/20' :
          score >= 50 ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold">Результат</p>
            <p className="text-2xl font-bold"
              style={{ color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
              {score}%
            </p>
          </div>
          <p className="text-[#64748b] text-sm mb-1">Я услышал:</p>
          <p className="text-[#94a3b8] italic mb-3">&ldquo;{heard}&rdquo;</p>
          <p className="text-[#64748b] text-sm">
            {score >= 90 ? '🎉 Превосходное произношение!' :
             score >= 70 ? '👍 Хорошо! Попробуй ещё раз для совершенства.' :
             score >= 50 ? '📢 Неплохо! Говори чётче и медленнее.' :
             '🔄 Попробуй ещё раз. Послушай образец и повтори.'}
          </p>
        </div>
      )}

      {score !== null && (
        <div className="flex gap-3">
          <button onClick={() => { setHeard(''); setScore(null) }}
            className="flex-1 py-3 bg-white/[0.06] hover:bg-white/10 text-[#94a3b8] font-medium rounded-xl transition-colors border border-white/10">
            ↺ Повторить
          </button>
          <button onClick={nextPhrase}
            className="flex-1 py-3 bg-[#6366f1] hover:bg-[#5558e8] text-white font-semibold rounded-xl transition-colors">
            Следующая фраза →
          </button>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-6">
          <p className="text-[#64748b] text-xs uppercase tracking-wider mb-3">История попыток</p>
          <div className="space-y-2">
            {attempts.slice(-5).reverse().map((a, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-2.5">
                <span className="text-[#64748b] text-sm truncate flex-1">{a.phrase.slice(0, 40)}...</span>
                <span className="font-bold ml-3 shrink-0"
                  style={{ color: a.score >= 80 ? '#10b981' : a.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {a.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
