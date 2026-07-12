'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
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

const ERROR_TYPES: Record<string, { label: string; color: string }> = {
  grammar: { label: 'Грамматика', color: '#ef4444' },
  vocabulary: { label: 'Словарь', color: '#f59e0b' },
  style: { label: 'Стиль', color: '#8b5cf6' },
  spelling: { label: 'Орфография', color: '#3b82f6' },
}

interface Correction {
  original: string
  corrected: string
  explanation: string
  type: 'grammar' | 'vocabulary' | 'style' | 'spelling'
}

interface CheckResult {
  overallScore: number
  corrections: Correction[]
  positives: string[]
  suggestion: string
  rewrittenVersion: string
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function scoreColor(s: number) {
  if (s >= 80) return '#10b981'
  if (s >= 60) return '#f59e0b'
  return '#ef4444'
}

export default function WritingPage() {
  const [level, setLevel] = useState('A1')
  const [topic, setTopic] = useState(TOPICS['A1'][0])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRewrite, setShowRewrite] = useState(false)

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
    setShowRewrite(false)
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
            {/* Score */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Результат</h3>
                <button onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Написать снова
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-extrabold" style={{ color: scoreColor(result.overallScore) }}>
                  {result.overallScore}
                </div>
                <div>
                  <div className="text-white font-semibold">из 100 баллов</div>
                  <div className="text-xs text-[#64748b] mt-0.5">Тема: {topic} · {level}</div>
                </div>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                  animate={{ width: `${result.overallScore}%` }} transition={{ duration: 0.8 }}
                  style={{ backgroundColor: scoreColor(result.overallScore) }} />
              </div>
            </div>

            {/* Positives */}
            {result.positives.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h4 className="text-[#10b981] font-semibold mb-3 flex items-center gap-2">
                  ✅ Что хорошо
                </h4>
                <ul className="space-y-1.5">
                  {result.positives.map((p, i) => (
                    <li key={i} className="text-[#94a3b8] text-sm flex gap-2">
                      <span className="text-[#10b981] shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Corrections */}
            {result.corrections.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ef4444]/20 text-[#f87171] text-xs flex items-center justify-center">
                    {result.corrections.length}
                  </span>
                  Исправления
                </h4>
                <div className="space-y-3">
                  {result.corrections.map((c, i) => {
                    const typeInfo = ERROR_TYPES[c.type] ?? ERROR_TYPES.grammar
                    return (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
                        <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                          <span className="line-through text-[#f87171] text-sm">{c.original}</span>
                          <span className="text-[#475569] text-sm">→</span>
                          <span className="text-[#10b981] text-sm font-medium">{c.corrected}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto"
                            style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color }}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <p className="text-[#64748b] text-xs">{c.explanation}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Rewritten version */}
            {result.rewrittenVersion && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setShowRewrite(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-white font-semibold text-sm">Улучшенная версия</span>
                  {showRewrite ? <ChevronUp className="w-4 h-4 text-[#475569]" /> : <ChevronDown className="w-4 h-4 text-[#475569]" />}
                </button>
                <AnimatePresence>
                  {showRewrite && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/[0.06]">
                      <p className="text-[#94a3b8] text-sm leading-relaxed p-5 italic">{result.rewrittenVersion}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Main tip */}
            {result.suggestion && (
              <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl px-5 py-4">
                <p className="text-[#fbbf24] text-sm">💡 {result.suggestion}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
