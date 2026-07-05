'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, CheckCircle, XCircle, Trophy } from 'lucide-react'

const QUESTIONS = [
  { level: 'A1', q: 'She ___ a teacher.', options: ['is', 'are', 'am', 'be'], answer: 'is' },
  { level: 'A1', q: 'I ___ got a car.', options: ['have', 'has', 'am', 'do'], answer: 'have' },
  { level: 'A1', q: 'They ___ playing football now.', options: ['is', 'am', 'are', 'be'], answer: 'are' },
  { level: 'A1', q: 'Did you ___ the film?', options: ['see', 'saw', 'seen', 'seeing'], answer: 'see' },
  { level: 'A2', q: 'I ___ here since 2020.', options: ['live', 'lived', 'have lived', 'was living'], answer: 'have lived' },
  { level: 'A2', q: 'If it rains, I ___ stay home.', options: ['will', 'would', 'shall', 'should'], answer: 'will' },
  { level: 'A2', q: 'She used to ___ in Paris.', options: ['live', 'lived', 'living', 'lives'], answer: 'live' },
  { level: 'A2', q: 'The book was ___ by Tolstoy.', options: ['wrote', 'writing', 'written', 'write'], answer: 'written' },
  { level: 'B1', q: 'When I arrived, she ___ already left.', options: ['has', 'had', 'was', 'did'], answer: 'had' },
  { level: 'B1', q: 'He said he ___ tired.', options: ['is', 'was', 'has been', 'will be'], answer: 'was' },
  { level: 'B1', q: 'If I ___ rich, I would travel more.', options: ['am', 'was', 'were', 'be'], answer: 'were' },
  { level: 'B1', q: 'The package ___ delivered tomorrow.', options: ['will', 'will be', 'is', 'was'], answer: 'will be' },
  { level: 'B1', q: 'I wish I ___ speak Japanese.', options: ['can', 'could', 'would', 'will'], answer: 'could' },
  { level: 'B2', q: 'Not only ___ she arrive late, but she also forgot her bag.', options: ['did', 'was', 'has', 'had'], answer: 'did' },
  { level: 'B2', q: 'She should ___ told me earlier.', options: ['have', 'has', 'had', 'be'], answer: 'have' },
  { level: 'B2', q: 'It was John ___ called me, not Peter.', options: ['who', 'which', 'that', 'whom'], answer: 'who' },
  { level: 'B2', q: 'Having ___ the report, she sent it immediately.', options: ['finish', 'finishing', 'finished', 'finishes'], answer: 'finished' },
  { level: 'C1', q: 'Had I ___ about the problem, I would have helped.', options: ['know', 'knew', 'known', 'knowing'], answer: 'known' },
  { level: 'C1', q: 'It is essential that he ___ present at the meeting.', options: ['is', 'be', 'was', 'will be'], answer: 'be' },
  { level: 'C1', q: 'The rapid ___ of technology has changed communication.', options: ['develop', 'developed', 'developer', 'development'], answer: 'development' },
]

const LEVEL_DESCRIPTIONS: Record<string, { label: string; desc: string; color: string }> = {
  A1: { label: 'A1 Начинающий', desc: 'Ты знаешь базовые слова и фразы. Самое время начать систематическое обучение!', color: '#10b981' },
  A2: { label: 'A2 Элементарный', desc: 'Ты понимаешь простые предложения и умеешь общаться на знакомые темы.', color: '#3b82f6' },
  B1: { label: 'B1 Средний', desc: 'Ты можешь справляться с большинством ситуаций во время путешествий и понимать тексты на знакомые темы.', color: '#8b5cf6' },
  B2: { label: 'B2 Выше среднего', desc: 'Ты понимаешь сложные тексты и можешь бегло общаться с носителями языка.', color: '#f59e0b' },
  C1: { label: 'C1 Продвинутый', desc: 'Ты владеешь языком на высоком уровне и можешь использовать его эффективно в учёбе и работе.', color: '#ef4444' },
}

function calcLevel(score: number): string {
  if (score <= 5) return 'A1'
  if (score <= 9) return 'A2'
  if (score <= 13) return 'B1'
  if (score <= 17) return 'B2'
  return 'C1'
}

type Screen = 'intro' | 'test' | 'result'

export default function LevelTestPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])

  const question = QUESTIONS[current]
  const level = calcLevel(score)
  const levelInfo = LEVEL_DESCRIPTIONS[level]

  function handleSelect(opt: string) {
    if (selected !== null) return
    setSelected(opt)
    const correct = opt === question.answer
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, correct])
    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        const finalScore = score + (correct ? 1 : 0)
        const finalLevel = calcLevel(finalScore)
        if (typeof window !== 'undefined') {
          localStorage.setItem('fluenta_user_level', finalLevel)
          localStorage.setItem('fluenta_level_test_score', JSON.stringify({
            level: finalLevel,
            score: finalScore,
            date: new Date().toISOString(),
          }))
        }
        setScreen('result')
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
      }
    }, 700)
  }

  const finalScore = answers.filter(Boolean).length

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {screen === 'intro' && (
          <motion.div key="intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-6 text-3xl shadow-2xl shadow-[#6366f1]/30">
              📊
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Определи свой уровень</h1>
            <p className="text-[#94a3b8] mb-2">20 вопросов • ~5 минут</p>
            <p className="text-[#64748b] text-sm mb-8">Тест охватывает грамматику от A1 до C1. Не угадывай — выбирай то, что знаешь.</p>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((l, i) => (
                <div key={l} className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-white">{l}</div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">{['0–5', '6–9', '10–13', '14–17', '18–20'][i]}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setScreen('test')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6366f1]/30">
              Начать тест →
            </button>
          </motion.div>
        )}

        {/* ── TEST ── */}
        {screen === 'test' && (
          <motion.div key={`q-${current}`}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="max-w-lg w-full">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#64748b] text-sm">Вопрос {current + 1} из {QUESTIONS.length}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: `${LEVEL_DESCRIPTIONS[question.level]?.color}20`, color: LEVEL_DESCRIPTIONS[question.level]?.color }}>
                  {question.level}
                </span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
                  initial={{ width: `${(current / QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4 }} />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
              <p className="text-white text-xl font-semibold leading-relaxed">{question.q}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt) => {
                let cls = 'border-white/10 bg-white/[0.04] text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5'
                if (selected !== null) {
                  if (opt === question.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                  else if (opt === selected) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                  else cls = 'border-white/5 bg-white/[0.02] text-[#475569]'
                }
                return (
                  <motion.button key={opt} whileTap={selected === null ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium transition-all flex items-center justify-between ${cls}`}>
                    <span>{opt}</span>
                    {selected !== null && opt === question.answer && <CheckCircle className="w-4 h-4" />}
                    {selected !== null && opt === selected && opt !== question.answer && <XCircle className="w-4 h-4" />}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {screen === 'result' && (
          <motion.div key="result"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="max-w-md w-full text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: levelInfo.color }} />
            <h2 className="text-2xl font-bold text-white mb-2">Твой уровень</h2>
            <div className="inline-block px-8 py-4 rounded-2xl text-3xl font-extrabold mb-4 shadow-2xl"
              style={{ backgroundColor: `${levelInfo.color}20`, color: levelInfo.color, border: `2px solid ${levelInfo.color}40` }}>
              {level}
            </div>
            <p className="text-white font-semibold text-lg mb-1">{levelInfo.label}</p>
            <p className="text-[#94a3b8] text-sm mb-4">{levelInfo.desc}</p>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 mb-6">
              <p className="text-[#64748b] text-sm mb-1">Правильных ответов</p>
              <p className="text-white text-2xl font-bold">{finalScore} <span className="text-[#64748b] text-lg font-normal">из 20</span></p>
              <div className="h-2 bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(finalScore / 20) * 100}%`, backgroundColor: levelInfo.color }} />
              </div>
            </div>
            {/* Answer breakdown */}
            <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
              {answers.map((correct, i) => (
                <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${correct ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                  {correct ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <Link href="/dashboard">
              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6366f1]/30 flex items-center justify-center gap-2">
                Начать обучение <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
