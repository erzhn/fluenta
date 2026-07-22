'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Plus, X, Check, RefreshCw, Sparkles } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'
import { getReadingTexts, type ReadingText } from '@/lib/reading-data'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { awardXP, XP_REWARDS } from '@/lib/xp'

interface VocabItem {
  word: string
  translation: string
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const SRS_KEY = 'fluenta_vocab_srs'
const READING_TOPICS = ['Технологии', 'Природа', 'Наука', 'История', 'Культура', 'Спорт', 'Путешествия', 'Здоровье', 'Бизнес', 'Искусство']

function addWordToSRS(word: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(SRS_KEY)
    const srs = raw ? JSON.parse(raw) : {}
    const id = `reading-${word.toLowerCase()}`
    if (!srs[id]) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      srs[id] = { box: 0, nextReview: tomorrow.toISOString().slice(0, 10), lastResult: null }
    }
    localStorage.setItem(SRS_KEY, JSON.stringify(srs))
  } catch { /* ignore */ }
}

function renderText(text: string, vocabulary: Record<string, string>, onWordClick: (v: VocabItem) => void) {
  const words = Object.keys(vocabulary).sort((a, b) => b.length - a.length)
  const parts: Array<{ text: string; vocab?: VocabItem }> = []
  let remaining = text

  while (remaining.length > 0) {
    let found = false
    for (const w of words) {
      const idx = remaining.toLowerCase().indexOf(w.toLowerCase())
      if (idx === 0) {
        parts.push({ text: remaining.slice(0, w.length), vocab: { word: remaining.slice(0, w.length), translation: vocabulary[w] } })
        remaining = remaining.slice(w.length)
        found = true
        break
      } else if (idx > 0) {
        parts.push({ text: remaining.slice(0, idx) })
        parts.push({ text: remaining.slice(idx, idx + w.length), vocab: { word: remaining.slice(idx, idx + w.length), translation: vocabulary[w] } })
        remaining = remaining.slice(idx + w.length)
        found = true
        break
      }
    }
    if (!found) {
      parts.push({ text: remaining })
      remaining = ''
    }
  }

  return parts.map((p, i) =>
    p.vocab ? (
      <span key={i}
        onClick={() => onWordClick(p.vocab!)}
        className="border-b-2 border-dotted border-primary cursor-pointer hover:bg-primary/10 rounded px-0.5 transition-colors text-[#a5b4fc]">
        {p.text}
      </span>
    ) : (
      <span key={i}>{p.text}</span>
    )
  )
}

export default function ReadingPage() {
  const [activeLevel, setActiveLevel] = useState('A1')
  const [entry, setEntry] = useState<ReadingText>(() => getReadingTexts('A1', 1)[0])
  const [popup, setPopup] = useState<VocabItem | null>(null)
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(READING_TOPICS[0])
  const didAutoGenerate = useRef(false)

  const color = LEVEL_COLORS[activeLevel]

  function selectLevel(level: string) {
    stopSpeaking()
    setActiveLevel(level)
    setEntry(getReadingTexts(level, 1)[0])
    setPopup(null)
    setSavedWords(new Set())
    setAnswers({})
    setChecked(false)
    setSpeaking(false)
  }

  function nextText() {
    stopSpeaking()
    setEntry(getReadingTexts(activeLevel, 1)[0])
    setPopup(null)
    setSavedWords(new Set())
    setAnswers({})
    setChecked(false)
    setSpeaking(false)
  }

  function handleWordClick(vocab: VocabItem) {
    setPopup(vocab)
  }

  function handleAddToVocab(vocab: VocabItem) {
    addWordToSRS(vocab.word)
    setSavedWords(s => new Set([...s, vocab.word]))
    setPopup(null)
  }

  async function handleListen() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(true)
    await speak(entry.text, { rate: 0.95, onEnd: () => setSpeaking(false) })
  }

  async function generateAI() {
    setGeneratingAI(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/ai/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ level: activeLevel, topic: selectedTopic }),
      })
      if (!res.ok) {
        if (res.status === 429) toast('Слишком много запросов. Подожди минуту.', 'error')
        else if (res.status === 401) toast('Необходимо войти в систему', 'error')
        else toast('Что-то пошло не так. Попробуй ещё раз.', 'error')
        return
      }
      const data = await res.json()
      if (data.title && data.text) {
        stopSpeaking()
        const vocab: Record<string, string> = data.vocabulary ?? {}
        setEntry({
          id: `ai-${Date.now()}`,
          level: activeLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1',
          title: data.title,
          text: data.text,
          highlightWords: data.highlightWords ?? Object.keys(vocab),
          vocabulary: vocab,
          questions: data.questions ?? [],
        })
        setPopup(null)
        setSavedWords(new Set())
        setAnswers({})
        setChecked(false)
        setSpeaking(false)
      }
    } catch {
      toast('Ошибка соединения', 'error')
    } finally {
      setGeneratingAI(false)
    }
  }

  useEffect(() => {
    if (!didAutoGenerate.current) {
      didAutoGenerate.current = true
      generateAI()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (didAutoGenerate.current) generateAI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, activeLevel])

  const allAnswered = entry.questions.every((_, i) => answers[i] !== undefined)
  const correctCount = entry.questions.filter((q, i) => answers[i] === q.answer).length

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Чтение</span></h1>
        <p className="text-muted-foreground text-sm">Читай, учи слова, отвечай на вопросы</p>
      </div>

      {/* Topic chips */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {READING_TOPICS.map(t => (
          <button key={t} onClick={() => setSelectedTopic(t)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedTopic === t ? 'bg-primary text-white border-primary' : 'border-white/10 text-muted-foreground hover:border-white/20'
            }`}>{t}</button>
        ))}
      </div>

      {generatingAI && <SkeletonCard />}

      {/* Level tabs */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map(l => (
          <button key={l} onClick={() => selectLevel(l)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={activeLevel === l
              ? { borderColor: LEVEL_COLORS[l], backgroundColor: `${LEVEL_COLORS[l]}20`, color: LEVEL_COLORS[l] }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
          {/* Article */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h2 className="text-white font-bold text-xl">{entry.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${color}20`, color }}>
                  {entry.level}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={nextText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-muted-foreground hover:text-white text-sm transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Другой текст
                </button>
                <button onClick={handleListen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-muted-foreground hover:text-white text-sm transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                  {speaking ? 'Стоп' : 'Слушать'}
                </button>
                <button onClick={generateAI} disabled={generatingAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-[#a5b4fc] hover:text-white text-sm transition-colors disabled:opacity-50">
                  <Sparkles className="w-3.5 h-3.5" /> {generatingAI ? 'AI...' : 'AI текст'}
                </button>
              </div>
            </div>

            {/* Word popup */}
            <AnimatePresence>
              {popup && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-16 right-6 bg-[#1e1b4b] border border-primary/40 rounded-xl px-4 py-3 shadow-2xl z-20 min-w-[200px]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-white font-semibold">{popup.word}</span>
                    <button onClick={() => setPopup(null)}><X className="w-3.5 h-3.5 text-muted-foreground hover:text-white" /></button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{popup.translation}</p>
                  {savedWords.has(popup.word) ? (
                    <div className="flex items-center gap-1.5 text-[#10b981] text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> Добавлено в словарь
                    </div>
                  ) : (
                    <button onClick={() => handleAddToVocab(popup)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-[#818cf8] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> В словарь
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text */}
            <p className="text-[#cbd5e1] leading-relaxed text-base">
              {renderText(entry.text, entry.vocabulary, handleWordClick)}
            </p>

            {/* Vocab legend */}
            {Object.keys(entry.vocabulary).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(entry.vocabulary).map(([word, translation]) => (
                  <span key={word}
                    onClick={() => handleWordClick({ word, translation })}
                    className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[#a5b4fc] cursor-pointer hover:bg-primary/20 transition-colors">
                    {word}
                    {savedWords.has(word) && <Check className="w-2.5 h-2.5 inline ml-1 text-[#10b981]" />}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">Кликни на подсвеченное слово → перевод + добавить в словарь</p>
          </div>

          {/* Questions */}
          {entry.questions.length > 0 && (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
              <h3 className="text-white font-semibold">Вопросы к тексту</h3>
              {entry.questions.map((q, qi) => (
                <div key={qi}>
                  <p className="text-muted-foreground text-sm mb-2">{qi + 1}. {q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map(opt => {
                      let cls = 'border-white/10 bg-white/[0.04] text-muted-foreground hover:border-primary/50 hover:text-white'
                      if (checked) {
                        if (opt === q.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                        else if (opt === answers[qi]) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                        else cls = 'border-white/5 bg-white/[0.02] text-muted-foreground'
                      } else if (answers[qi] === opt) {
                        cls = 'border-primary bg-primary/15 text-white'
                      }
                      return (
                        <button key={opt} disabled={checked}
                          onClick={() => setAnswers(a => ({ ...a, [qi]: opt }))}
                          className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${cls}`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {!checked ? (
                <button disabled={!allAnswered} onClick={() => { setChecked(true); awardXP(XP_REWARDS.FLASHCARD_SESSION).catch(() => {}) }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
                  Проверить ответы
                </button>
              ) : (
                <div className="space-y-3">
                  <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center ${correctCount === entry.questions.length ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'}`}>
                    {correctCount === entry.questions.length ? '🎉 Все ответы правильные!' : `${correctCount} из ${entry.questions.length} правильно`}
                  </div>
                  {savedWords.size > 0 && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-[#a5b4fc]">
                      <Check className="w-4 h-4 text-[#10b981]" />
                      Сохранено {savedWords.size} {savedWords.size === 1 ? 'слово' : 'слов'} в словарь
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}