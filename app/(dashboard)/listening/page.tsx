'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, RefreshCw, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'

interface ListeningExercise {
  id: string
  level: string
  title: string
  text: string
  speed: number
  question: string
  options: string[]
  answer: string
  hint: string
}

const EXERCISES: ListeningExercise[] = [
  {
    id: 'l1', level: 'A1', title: 'At the café',
    text: 'Hello. Can I have a coffee, please? Yes, of course. Would you like milk? Yes, please. And a piece of cake. That is four pounds fifty.',
    speed: 0.8, question: 'How much does the order cost?',
    options: ['Three pounds fifty', 'Four pounds', 'Four pounds fifty', 'Five pounds'],
    answer: 'Four pounds fifty',
    hint: 'Listen for the price at the end.',
  },
  {
    id: 'l2', level: 'A1', title: 'The weather',
    text: 'Today the weather is cold and cloudy. It is raining in the morning but sunny in the afternoon. The temperature is twelve degrees.',
    speed: 0.85, question: 'What is the temperature?',
    options: ['Ten degrees', 'Twelve degrees', 'Twenty degrees', 'Fifteen degrees'],
    answer: 'Twelve degrees',
    hint: 'Listen for the number of degrees.',
  },
  {
    id: 'l3', level: 'A2', title: 'Weekend plans',
    text: 'On Saturday morning I\'m going to visit my grandmother. In the afternoon my friends and I are playing football in the park. On Sunday I\'m staying at home and watching a film.',
    speed: 0.9, question: 'What is the speaker doing on Saturday morning?',
    options: ['Playing football', 'Watching a film', 'Visiting grandmother', 'Staying at home'],
    answer: 'Visiting grandmother',
    hint: 'The activities happen at different times of the weekend.',
  },
  {
    id: 'l4', level: 'A2', title: 'At the train station',
    text: 'The next train to Edinburgh leaves at two fifteen from platform three. The journey takes approximately four hours. Tickets are available from the machine on the left or from the ticket office.',
    speed: 0.9, question: 'Where can you buy tickets?',
    options: ['Only at the office', 'Only from the machine', 'From the machine or the office', 'On the train'],
    answer: 'From the machine or the office',
    hint: 'Listen for the word "or".',
  },
  {
    id: 'l5', level: 'B1', title: 'Job interview',
    text: 'Thank you for coming in today. I\'ve read your CV and I\'m impressed with your experience. Can you tell me why you want to work for our company? I\'ve always admired your products and I believe my background in marketing would be a great match for this role.',
    speed: 0.95, question: 'Why does the candidate want this job?',
    options: ['Higher salary', 'Admires the products and has relevant experience', 'Location is convenient', 'They know the manager'],
    answer: 'Admires the products and has relevant experience',
    hint: 'The candidate gives two reasons.',
  },
  {
    id: 'l6', level: 'B1', title: 'Radio news',
    text: 'Scientists have announced a new study suggesting that regular exercise can significantly improve mental health. Participants who exercised three times a week reported fifty percent fewer symptoms of anxiety compared to those who did not exercise.',
    speed: 1.0, question: 'How often did participants exercise in the study?',
    options: ['Once a week', 'Every day', 'Three times a week', 'Twice a week'],
    answer: 'Three times a week',
    hint: 'Pay attention to the frequency mentioned.',
  },
  {
    id: 'l7', level: 'B2', title: 'Lecture extract',
    text: 'The concept of cognitive bias refers to systematic patterns of deviation from rationality in judgement. These biases arise because the brain uses mental shortcuts to process information efficiently. While often useful, they can lead to errors in thinking, particularly in complex decision-making scenarios.',
    speed: 1.0, question: 'Why does the brain use mental shortcuts?',
    options: ['To avoid making decisions', 'To process information efficiently', 'To create biases intentionally', 'To improve memory'],
    answer: 'To process information efficiently',
    hint: 'The speaker explains the reason directly.',
  },
  {
    id: 'l8', level: 'B2', title: 'Debate extract',
    text: 'While proponents of universal basic income argue it would reduce poverty and provide financial security, critics contend that it would discourage work and place an unsustainable burden on government finances. The debate remains deeply polarised.',
    speed: 1.0, question: 'What is one argument AGAINST universal basic income?',
    options: ['It reduces poverty', 'It is too expensive to administer', 'It would discourage people from working', 'It requires international cooperation'],
    answer: 'It would discourage people from working',
    hint: 'Listen for the critics\' arguments, not the supporters\'.',
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b',
}

const SPEED_OPTIONS = [0.6, 0.8, 1.0, 1.2]
const SPEED_LABELS: Record<number, string> = { 0.6: 'Очень медленно', 0.8: 'Медленно', 1.0: 'Нормально', 1.2: 'Быстро' }

export default function ListeningPage() {
  const [idx, setIdx] = useState(0)
  const [speedMult, setSpeedMult] = useState(1.0)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showText, setShowText] = useState(false)
  const [plays, setPlays] = useState(0)
  const ex = EXERCISES[idx]

  async function handlePlay() {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
      return
    }
    setPlaying(true)
    setPlays(p => p + 1)
    await speak(ex.text, {
      rate: ex.speed * speedMult,
      onEnd: () => setPlaying(false),
    })
  }

  function goTo(i: number) {
    stopSpeaking()
    setIdx(i)
    setSelected(null)
    setChecked(false)
    setShowHint(false)
    setShowText(false)
    setPlaying(false)
    setPlays(0)
  }

  function handleCheck() {
    if (!selected) return
    setChecked(true)
    stopSpeaking()
    setPlaying(false)
  }

  const isCorrect = selected === ex.answer

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Аудирование</h1>
        <p className="text-[#64748b] text-sm">Слушай и отвечай на вопросы (Web Speech API)</p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 flex-wrap">
        {['A1', 'A2', 'B1', 'B2'].map(lvl => {
          const first = EXERCISES.findIndex(e => e.level === lvl)
          return (
            <button key={lvl} onClick={() => goTo(first)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all`}
              style={EXERCISES[idx].level === lvl
                ? { borderColor: LEVEL_COLORS[lvl], backgroundColor: `${LEVEL_COLORS[lvl]}20`, color: LEVEL_COLORS[lvl] }
                : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
              {lvl}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={ex.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
          {/* Player card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">{ex.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${LEVEL_COLORS[ex.level]}20`, color: LEVEL_COLORS[ex.level] }}>
                  {ex.level}
                </span>
              </div>
              {plays > 0 && <span className="text-[#475569] text-xs">{plays} прослушивание{plays > 1 ? 'й' : ''}</span>}
            </div>

            {/* Waveform bars animation */}
            <div className="flex items-center justify-center gap-1 h-12 mb-5">
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div key={i}
                  className="w-1.5 rounded-full"
                  style={{ backgroundColor: LEVEL_COLORS[ex.level] ?? '#6366f1' }}
                  animate={playing ? {
                    height: [8, 16 + Math.sin(i * 0.8) * 20, 8],
                    opacity: [0.4, 0.9, 0.4],
                  } : { height: 4, opacity: 0.2 }}
                  transition={playing ? { duration: 0.8 + i * 0.05, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }} />
              ))}
            </div>

            {/* Speed selector */}
            <div className="flex gap-2 justify-center mb-5">
              {SPEED_OPTIONS.map(s => (
                <button key={s} onClick={() => setSpeedMult(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${speedMult === s ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : 'border-white/10 text-[#64748b] hover:text-white'}`}>
                  ×{s}
                </button>
              ))}
            </div>
            <p className="text-center text-[#475569] text-xs mb-4">{SPEED_LABELS[speedMult]}</p>

            {/* Play / Stop button */}
            <button onClick={handlePlay}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${playing ? 'bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#f87171]' : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/30'}`}>
              {playing ? <><Square className="w-4 h-4" /> Остановить</> : <><Volume2 className="w-4 h-4" /> {plays > 0 ? 'Слушать снова' : 'Слушать'}</>}
            </button>

            {/* Hint / Script buttons */}
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowHint(v => !v)}
                className="flex-1 py-2 rounded-xl text-sm border border-white/10 text-[#64748b] hover:text-white transition-colors">
                💡 Подсказка
              </button>
              {checked && (
                <button onClick={() => setShowText(v => !v)}
                  className="flex-1 py-2 rounded-xl text-sm border border-white/10 text-[#64748b] hover:text-white transition-colors">
                  📄 Текст
                </button>
              )}
            </div>
            {showHint && <p className="text-[#94a3b8] text-sm mt-2 px-1">{ex.hint}</p>}
            {showText && checked && (
              <p className="text-[#64748b] text-sm mt-2 px-1 italic leading-relaxed">{ex.text}</p>
            )}
          </div>

          {/* Question */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-semibold mb-4">{ex.question}</p>
            <div className="space-y-2.5">
              {ex.options.map(opt => {
                let cls = 'border-white/10 bg-white/[0.04] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white'
                if (checked) {
                  if (opt === ex.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                  else if (opt === selected && opt !== ex.answer) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                  else cls = 'border-white/5 bg-white/[0.02] text-[#475569]'
                } else if (selected === opt) {
                  cls = 'border-[#6366f1] bg-[#6366f1]/15 text-white'
                }
                return (
                  <button key={opt} disabled={checked}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls}`}>
                    {opt}
                  </button>
                )
              })}
            </div>

            {!checked ? (
              <button disabled={!selected || plays === 0}
                onClick={handleCheck}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
                Проверить
              </button>
            ) : (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium text-center ${isCorrect ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20'}`}>
                {isCorrect ? '🎉 Правильно!' : `✗ Неверно. Правильный ответ: "${ex.answer}"`}
              </div>
            )}

            {plays === 0 && !checked && (
              <p className="text-[#475569] text-xs mt-2 text-center">Сначала прослушай текст</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => goTo(idx - 1)} disabled={idx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[#94a3b8] hover:text-white transition-colors disabled:opacity-30 text-sm">
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
            <span className="text-[#475569] text-sm">{idx + 1} / {EXERCISES.length}</span>
            <button onClick={() => goTo(idx + 1)} disabled={idx === EXERCISES.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[#94a3b8] hover:text-white transition-colors disabled:opacity-30 text-sm">
              Далее <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
