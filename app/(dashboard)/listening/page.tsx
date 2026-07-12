'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Eye, EyeOff, Volume2, RefreshCw } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'

interface ListeningText {
  level: string
  title: string
  text: string
  questions: { q: string; options: string[]; answer: string }[]
}

const TEXTS: ListeningText[] = [
  {
    level: 'A1',
    title: 'At the café',
    text: "Hello! Can I help you? Yes, please. I'd like a coffee and a sandwich. Of course. What kind of sandwich? Chicken, please. And a large coffee with milk. That's four pounds fifty, please. Here you are. Thank you. Enjoy your coffee!",
    questions: [
      { q: 'Where are they?', options: ['In a café', 'In a shop', 'At home', 'In a school'], answer: 'In a café' },
      { q: 'What does the customer order?', options: ['Tea and cake', 'Coffee and sandwich', 'Juice and burger', 'Water and salad'], answer: 'Coffee and sandwich' },
      { q: 'How much does it cost?', options: ['£3.50', '£4.00', '£4.50', '£5.00'], answer: '£4.50' },
    ],
  },
  {
    level: 'A2',
    title: 'A Weekend Plan',
    text: "Hey Sarah, what are you doing this weekend? I'm not sure yet. I was thinking about going to the cinema. Oh nice! What do you want to see? There's a new action film on. I've heard it's really good. Do you want to come? That sounds great! What time does it start? There's a showing at 7 PM. We could have dinner before. Perfect. Let's meet at the Italian restaurant at 5:30. Great, see you Saturday!",
    questions: [
      { q: 'What do they decide to do?', options: ['Go shopping', 'Watch a film', 'Stay home', 'Go to a concert'], answer: 'Watch a film' },
      { q: 'What time is the film?', options: ['5:30', '6:00', '7:00', '8:00'], answer: '7:00' },
      { q: 'Where will they meet first?', options: ['At the cinema', 'At home', 'At an Italian restaurant', 'At a café'], answer: 'At an Italian restaurant' },
    ],
  },
  {
    level: 'B1',
    title: 'The Benefits of Exercise',
    text: 'Regular exercise has many benefits for both physical and mental health. Studies show that people who exercise at least three times a week are less likely to suffer from depression and anxiety. Exercise releases endorphins, which are natural mood-boosters. It also improves sleep quality and increases energy levels during the day. For physical health, even moderate exercise like walking for thirty minutes can reduce the risk of heart disease and diabetes. The key is to find an activity you enjoy, whether it\'s swimming, cycling, or dancing, so that you stick to it long-term.',
    questions: [
      { q: 'How often should people exercise according to the text?', options: ['Every day', 'Once a week', 'At least three times a week', 'Twice a month'], answer: 'At least three times a week' },
      { q: 'What do endorphins do?', options: ['Help you sleep', 'Boost your mood', 'Build muscles', 'Reduce hunger'], answer: 'Boost your mood' },
      { q: 'What is the key to sticking with exercise?', options: ['Having a gym membership', 'Exercising with a friend', 'Choosing an activity you enjoy', 'Exercising in the morning'], answer: 'Choosing an activity you enjoy' },
    ],
  },
  {
    level: 'B2',
    title: 'The Gig Economy',
    text: 'The rise of the gig economy has fundamentally transformed the way people work. Rather than traditional nine-to-five employment, millions of workers now take on short-term contracts or freelance work through digital platforms. Proponents argue that this model offers unparalleled flexibility, allowing individuals to choose when and where they work. However, critics point out significant drawbacks. Gig workers typically lack employment benefits such as sick pay, holiday pay, and pension contributions. Furthermore, income can be highly unpredictable, making it difficult to plan for the future. Governments around the world are now grappling with how to regulate this sector to protect workers while preserving the innovation that makes it so appealing.',
    questions: [
      { q: 'What is the main advantage of the gig economy according to supporters?', options: ['Higher salaries', 'Better benefits', 'Flexibility', 'Job security'], answer: 'Flexibility' },
      { q: 'Which benefit do gig workers typically NOT receive?', options: ['Salary', 'Sick pay', 'Work experience', 'Digital tools'], answer: 'Sick pay' },
      { q: 'What challenge do governments face?', options: ['Creating more jobs', 'Taxing companies fairly', 'Regulating the sector while keeping innovation', 'Reducing working hours'], answer: 'Regulating the sector while keeping innovation' },
    ],
  },
  {
    level: 'C1',
    title: 'The Philosophy of Language',
    text: 'Language is not merely a tool for communication; it fundamentally shapes our perception of reality. The Sapir-Whorf hypothesis, also known as linguistic relativity, posits that the structure of a language influences the way its speakers conceptualise the world. For instance, research has demonstrated that speakers of languages with numerous colour terms can distinguish between shades more readily than those whose languages have fewer distinctions. Similarly, languages that lack a future tense may correlate with speakers who plan more effectively for the future, having no grammatical reason to separate tomorrow from today. While the strong version of this hypothesis — that language entirely determines thought — has largely been discredited, the weaker version, that language influences thought, continues to attract considerable empirical support.',
    questions: [
      { q: 'What does the Sapir-Whorf hypothesis propose?', options: ['Language determines intelligence', 'Language influences how we perceive the world', 'All languages are equally complex', 'Thought exists independently of language'], answer: 'Language influences how we perceive the world' },
      { q: 'What example is given about colour terms?', options: ['People with more colour terms see more colours', 'People with more colour terms distinguish shades more easily', 'Colour terms vary between cultures', 'Some languages have no colour terms'], answer: 'People with more colour terms distinguish shades more easily' },
      { q: 'What is the current academic view of the strong Sapir-Whorf hypothesis?', options: ['Widely accepted', 'Largely discredited', 'Under investigation', 'Proven correct'], answer: 'Largely discredited' },
    ],
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const SPEEDS = [0.8, 1.0, 1.2]
const SPEED_LABELS: Record<number, string> = { 0.8: '0.8×', 1.0: '1×', 1.2: '1.2×' }

export default function ListeningPage() {
  const [activeLevel, setActiveLevel] = useState('A1')
  const [speed, setSpeed] = useState(1.0)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)

  const entry = TEXTS.find(t => t.level === activeLevel)!
  const color = LEVEL_COLORS[activeLevel]

  function selectLevel(level: string) {
    stopSpeaking()
    setActiveLevel(level)
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

  function handleReplay() {
    stopSpeaking()
    setPlaying(false)
    setTimeout(() => {
      setPlaying(true)
      speak(entry.text, { rate: speed, onEnd: () => setPlaying(false) })
    }, 100)
  }

  const allAnswered = entry.questions.every((_, i) => answers[i] !== undefined)
  const correctCount = entry.questions.filter((q, i) => answers[i] === q.answer).length

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Аудирование</h1>
        <p className="text-[#64748b] text-sm">Слушай тексты и отвечай на вопросы</p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2">
        {TEXTS.map(t => (
          <button key={t.level} onClick={() => selectLevel(t.level)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={activeLevel === t.level
              ? { borderColor: LEVEL_COLORS[t.level], backgroundColor: `${LEVEL_COLORS[t.level]}20`, color: LEVEL_COLORS[t.level] }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
            {t.level}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeLevel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
          {/* Player card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">{entry.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${color}20`, color }}>
                  {entry.level}
                </span>
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
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${speed === s ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : 'border-white/10 text-[#64748b] hover:text-white'}`}>
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
              {played && !playing && (
                <button onClick={handleReplay}
                  className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Show text toggle */}
            <button onClick={() => setShowText(v => !v)}
              className="mt-3 w-full py-2.5 rounded-xl border border-white/10 text-[#64748b] hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
              {showText ? <><EyeOff className="w-4 h-4" /> Скрыть текст</> : <><Eye className="w-4 h-4" /> Показать текст</>}
            </button>

            <AnimatePresence>
              {showText && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden">
                  <p className="text-[#94a3b8] text-sm leading-relaxed p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] italic">
                    {entry.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Questions trigger */}
          {!showQuestions && (
            <button onClick={() => setShowQuestions(true)}
              className="w-full py-3 rounded-2xl border border-white/10 text-[#94a3b8] hover:text-white hover:border-white/20 text-sm font-medium transition-all">
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
                    <p className="text-[#94a3b8] text-sm mb-2">{qi + 1}. {q.q}</p>
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        let cls = 'border-white/10 bg-white/[0.04] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white'
                        if (checked) {
                          if (opt === q.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                          else if (opt === answers[qi]) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                          else cls = 'border-white/5 bg-white/[0.02] text-[#475569]'
                        } else if (answers[qi] === opt) {
                          cls = 'border-[#6366f1] bg-[#6366f1]/15 text-white'
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
                  <button disabled={!allAnswered} onClick={() => setChecked(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
                    Проверить
                  </button>
                ) : (
                  <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center ${correctCount === 3 ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : correctCount >= 2 ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' : 'bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20'}`}>
                    {correctCount === 3 ? `🎉 Отлично! ${correctCount}/3 правильно` : correctCount >= 2 ? `👍 Молодец! ${correctCount}/3 правильно` : `${correctCount}/3 — Попробуй ещё раз`}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
