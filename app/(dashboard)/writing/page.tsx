'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface WritingTask {
  id: string
  level: string
  title: string
  prompt: string
  example: string
  minWords: number
}

const TASKS: WritingTask[] = [
  {
    id: 'w1', level: 'A1', title: 'Расскажи о себе',
    prompt: 'Write a short paragraph about yourself. Mention your name, age, where you are from, and what you like to do.',
    example: 'My name is Anna. I am twenty years old. I am from Moscow, Russia. I like reading books and listening to music.',
    minWords: 30,
  },
  {
    id: 'w2', level: 'A2', title: 'Мой обычный день',
    prompt: 'Describe your typical weekday. What do you usually do in the morning, afternoon, and evening?',
    example: 'I usually wake up at seven o\'clock. I have breakfast and go to work by bus. In the afternoon I have lunch in the office. In the evening I cook dinner and watch TV.',
    minWords: 50,
  },
  {
    id: 'w3', level: 'B1', title: 'Плюсы и минусы социальных сетей',
    prompt: 'Write about the advantages and disadvantages of social media. Give your opinion at the end.',
    example: 'Social media has changed the way we communicate. On the positive side, it helps us stay connected with friends and family around the world...',
    minWords: 80,
  },
  {
    id: 'w4', level: 'B2', title: 'Влияние технологий на работу',
    prompt: 'Discuss how technology has changed the modern workplace. Consider both positive developments and potential challenges.',
    example: 'Over the past two decades, technology has fundamentally transformed the way we work. Automation has taken over many repetitive tasks, freeing workers to focus on creative and analytical challenges...',
    minWords: 120,
  },
  {
    id: 'w5', level: 'C1', title: 'Образование vs. опыт',
    prompt: 'To what extent do you agree that practical experience is more valuable than formal education in today\'s job market? Support your argument with examples.',
    example: 'The debate over the relative merits of formal education and practical experience has intensified in an era when technological disruption regularly renders specific qualifications obsolete...',
    minWords: 150,
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

interface CheckResult {
  score: number
  level: string
  overall: string
  errors: Array<{ original: string; correction: string; explanation: string }>
  strengths: string[]
  suggestions: string[]
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export default function WritingPage() {
  const [taskIdx, setTaskIdx] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const task = TASKS[taskIdx]
  const words = wordCount(text)
  const enoughWords = words >= task.minWords

  async function handleCheck() {
    if (!enoughWords || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/ai/writing-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, prompt: task.prompt }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Не удалось получить ответ. Проверь соединение.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setText('')
    setResult(null)
    setError(null)
    setShowExample(false)
  }

  function selectTask(i: number) {
    setTaskIdx(i)
    reset()
  }

  const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Письмо</h1>
        <p className="text-[#64748b] text-sm">Пиши тексты — ИИ проверит грамматику и стиль</p>
      </div>

      {/* Task tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TASKS.map((t, i) => (
          <button key={t.id} onClick={() => selectTask(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${i === taskIdx ? 'border-[#6366f1] bg-[#6366f1]/15 text-white' : 'border-white/10 text-[#64748b] hover:text-white'}`}>
            <span className="mr-1.5" style={{ color: LEVEL_COLORS[t.level] }}>{t.level}</span>{t.title}
          </button>
        ))}
      </div>

      {/* Task card */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-white font-semibold">{task.title}</h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
            style={{ backgroundColor: `${LEVEL_COLORS[task.level]}20`, color: LEVEL_COLORS[task.level] }}>
            {task.level}
          </span>
        </div>
        <p className="text-[#94a3b8] text-sm leading-relaxed mb-3">{task.prompt}</p>
        <p className="text-[#475569] text-xs">Минимум {task.minWords} слов</p>

        <button onClick={() => setShowExample(v => !v)}
          className="flex items-center gap-1.5 text-xs text-[#6366f1] hover:text-[#818cf8] mt-2 transition-colors">
          {showExample ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showExample ? 'Скрыть пример' : 'Показать пример'}
        </button>
        {showExample && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[#64748b] text-sm italic leading-relaxed">{task.example}</p>
          </motion.div>
        )}
      </div>

      {/* Editor */}
      {!result && (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Начни писать здесь..."
            rows={10}
            className="w-full bg-transparent text-white placeholder-[#3f4a5a] p-5 resize-none outline-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${enoughWords ? 'text-[#10b981]' : 'text-[#64748b]'}`}>
                {words} слов{words !== 1 ? '' : ''}
              </span>
              {!enoughWords && (
                <span className="text-xs text-[#475569]">/ нужно {task.minWords}</span>
              )}
            </div>
            <button onClick={handleCheck} disabled={!enoughWords || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Проверяю...' : 'Проверить'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl px-5 py-4 text-[#f87171] text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Результат</h3>
                <button onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Попробовать снова
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-extrabold" style={{ color: scoreColor(result.score) }}>{result.score}</div>
                <div>
                  <div className="text-white font-semibold">из 100 баллов</div>
                  <div className="text-xs px-2 py-0.5 rounded-lg mt-1 inline-block"
                    style={{ backgroundColor: `${LEVEL_COLORS[result.level] ?? '#6366f1'}20`, color: LEVEL_COLORS[result.level] ?? '#6366f1' }}>
                    Уровень: {result.level}
                  </div>
                </div>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }} transition={{ duration: 0.8 }}
                  style={{ backgroundColor: scoreColor(result.score) }} />
              </div>
              <p className="text-[#94a3b8] text-sm mt-3 leading-relaxed">{result.overall}</p>
            </div>

            {/* Original text */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <h4 className="text-white font-semibold mb-2 text-sm">Твой текст</h4>
              <p className="text-[#64748b] text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ef4444]/20 text-[#f87171] text-xs flex items-center justify-center">{result.errors.length}</span>
                  Ошибки
                </h4>
                <div className="space-y-3">
                  {result.errors.map((e, i) => (
                    <div key={i} className="bg-[#ef4444]/5 border border-[#ef4444]/15 rounded-xl p-3">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 mb-1.5">
                        <span className="line-through text-[#f87171] text-sm">{e.original}</span>
                        <span className="text-[#475569]">→</span>
                        <span className="text-[#10b981] text-sm font-medium">{e.correction}</span>
                      </div>
                      <p className="text-[#64748b] text-xs">{e.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths + suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.strengths.length > 0 && (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                  <h4 className="text-[#10b981] font-semibold mb-2 text-sm">Сильные стороны</h4>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-[#94a3b8] text-xs flex gap-1.5"><span>✓</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.suggestions.length > 0 && (
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                  <h4 className="text-[#f59e0b] font-semibold mb-2 text-sm">Рекомендации</h4>
                  <ul className="space-y-1">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-[#94a3b8] text-xs flex gap-1.5"><span>→</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
