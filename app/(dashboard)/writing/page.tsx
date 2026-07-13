'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw } from 'lucide-react'
import { WritingFeedback } from '@/components/WritingFeedback'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'

const TOPICS: Record<string, string[]> = {
  A1: ['My family', 'My home', 'My daily routine', 'My favourite food', 'My weekend'],
  A2: ['My last holiday', 'My job', 'My city', 'A film I liked', 'My best friend'],
  B1: ['Technology in my life', 'The environment', 'Health and lifestyle', 'Travel experiences', 'Social media'],
  B2: ['Work-life balance', 'Education systems', 'Cultural differences', 'The future of AI', 'Urban vs rural life'],
  C1: ['Globalisation impacts', 'Ethical dilemmas in technology', 'The role of arts in society', 'Economic inequality', 'Climate change solutions'],
}

const MIN_WORDS: Record<string, number> = {
  A1: 100, A2: 200, B1: 300, B2: 300, C1: 300,
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']


interface CheckResult {
  overallScore: number
  correctedText: string
  summary: string
  errors: { original: string; corrected: string; category: string; explanation: string; severity: 'minor' | 'major' }[]
  patterns: string[]
  positives: string[]
  recommendation: string
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}


export default function WritingPage() {
  const [level, setLevel] = useState('A1')
  const [topic, setTopic] = useState(TOPICS['A1'][0])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    setTopic(TOPICS[level][0])
  }, [level])

  const words = wordCount(text)
  const minWords = MIN_WORDS[level]
  const enoughWords = words >= minWords

  async function handleCheck() {
    if (!enoughWords || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/ai/writing-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ text, level, topic }),
      })
      if (!res.ok) {
        if (res.status === 429) toast('Слишком много запросов. Подожди минуту.', 'error')
        else if (res.status === 401) toast('Необходимо войти в систему', 'error')
        else toast('Что-то пошло не так. Попробуй ещё раз.', 'error')
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      toast('Текст проверен!', 'success')
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
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Практика письма</h1>
        <p className="text-[#64748b] text-sm">Выбери уровень и тему, напиши текст — ИИ проверит и даст рекомендации</p>
      </div>

      {!result && (
        <>
          {/* Level selector */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <label className="text-white text-sm font-semibold mb-3 block">Твой уровень</label>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={level === l
                    ? { borderColor: LEVEL_COLORS[l], backgroundColor: `${LEVEL_COLORS[l]}20`, color: LEVEL_COLORS[l] }
                    : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Topic selector */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <label className="text-white text-sm font-semibold mb-3 block">Тема</label>
            <div className="flex flex-col gap-2">
              {TOPICS[level].map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${topic === t ? 'border-[#6366f1] bg-[#6366f1]/15 text-white' : 'border-white/10 text-[#64748b] hover:text-white hover:border-white/20'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[#64748b] text-xs">
                Тема: <span className="text-[#818cf8] font-medium">{topic}</span>
                <span className="ml-3 text-[#475569]">· Минимум {minWords} слов</span>
              </p>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Начни писать здесь..."
              rows={10}
              className="w-full bg-transparent text-white placeholder-[#3f4a5a] px-5 py-3 resize-none outline-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${enoughWords ? 'text-[#10b981]' : 'text-[#64748b]'}`}>
                  {words} слов
                </span>
                {!enoughWords && (
                  <span className="text-xs text-[#475569]">/ нужно {minWords}</span>
                )}
              </div>
              <button onClick={handleCheck} disabled={!enoughWords || loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Проверяю...' : 'Проверить текст'}
              </button>
            </div>
          </div>
        </>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Результат · Тема: {topic} · {level}</h3>
              <button onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Написать снова
              </button>
            </div>
            <WritingFeedback data={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
