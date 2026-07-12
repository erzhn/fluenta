'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Plus, X, Check } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'

interface VocabItem {
  word: string
  translation: string
}

interface ReadingText {
  level: string
  title: string
  text: string
  highlights: Record<string, string>
  questions: { q: string; options: string[]; answer: string }[]
}

const TEXTS: ReadingText[] = [
  {
    level: 'A1',
    title: 'My Family',
    text: "My name is Tom. I am from London. I have a small family. My mother is a nurse. She works at a hospital. My father is a teacher. He works at a school. I have one sister. Her name is Lucy. She is ten years old. We have a dog. His name is Max. Max is big and black. I love my family very much.",
    highlights: { nurse: 'медсестра', hospital: 'больница', teacher: 'учитель', school: 'школа', sister: 'сестра' },
    questions: [
      { q: "What is Tom's mother's job?", options: ['Teacher', 'Nurse', 'Doctor', 'Engineer'], answer: 'Nurse' },
      { q: 'How old is Lucy?', options: ['8', '9', '10', '11'], answer: '10' },
      { q: 'What colour is Max?', options: ['White', 'Brown', 'Black', 'Grey'], answer: 'Black' },
    ],
  },
  {
    level: 'A2',
    title: 'A Trip to Edinburgh',
    text: "Last summer, I visited Edinburgh with my friend Anna. Edinburgh is the capital of Scotland and it's a beautiful city. We stayed in a small hotel near the old town. On the first day, we visited Edinburgh Castle, which sits on top of a volcanic rock. The views from the castle were amazing. We could see the whole city. In the evening, we walked along the Royal Mile and tried traditional Scottish food. The next day, we climbed Arthur's Seat, which is an old volcano in the middle of the city. It was hard work but the views were worth it!",
    highlights: { capital: 'столица', castle: 'замок', volcanic: 'вулканический', traditional: 'традиционный', volcano: 'вулкан' },
    questions: [
      { q: 'What is Edinburgh the capital of?', options: ['England', 'Wales', 'Scotland', 'Ireland'], answer: 'Scotland' },
      { q: 'What is Edinburgh Castle built on?', options: ['A hill', 'A volcanic rock', 'An island', 'A cliff'], answer: 'A volcanic rock' },
      { q: 'What did they do on the second day?', options: ["Visited the castle", 'Went shopping', "Climbed Arthur's Seat", 'Took a boat trip'], answer: "Climbed Arthur's Seat" },
    ],
  },
  {
    level: 'B1',
    title: 'Remote Work Revolution',
    text: "The COVID-19 pandemic forced millions of workers around the world to work from home almost overnight. What began as an emergency measure has, for many, become a permanent way of working. Companies that were initially reluctant to allow remote work discovered that productivity often remained the same or even improved. Employees, meanwhile, enjoyed saving time on commuting and having more flexibility in their schedules. However, remote work is not without its challenges. Many people struggle with feelings of isolation and find it difficult to separate work life from home life. Young employees in particular may miss out on the informal learning that happens naturally in an office environment. As we move forward, many organisations are adopting a hybrid model, combining the best of both worlds.",
    highlights: { pandemic: 'пандемия', reluctant: 'неохотный', productivity: 'производительность', commuting: 'ежедневные поездки', isolation: 'изоляция', hybrid: 'гибридный' },
    questions: [
      { q: 'Why did remote work initially expand so rapidly?', options: ['Companies planned it', 'The pandemic forced it', 'Workers demanded it', 'Technology improved'], answer: 'The pandemic forced it' },
      { q: 'What is one disadvantage of remote work mentioned in the text?', options: ['Lower productivity', 'Higher costs', 'Feelings of isolation', 'Longer hours'], answer: 'Feelings of isolation' },
      { q: 'What solution are many companies now adopting?', options: ['Full remote work', 'Returning to offices completely', 'A hybrid model', 'Four-day work weeks'], answer: 'A hybrid model' },
    ],
  },
  {
    level: 'B2',
    title: 'The Paradox of Choice',
    text: "In his influential book, psychologist Barry Schwartz argues that having too many choices can be paralysing rather than liberating. While classical economic theory suggests that more options always lead to greater satisfaction, Schwartz contends that beyond a certain point, additional choices generate anxiety and regret. When faced with hundreds of options, consumers often experience what he calls 'the paradox of choice' — the more alternatives available, the harder it becomes to make a decision, and the less satisfied we feel with whatever we choose. This is because an abundance of options raises our expectations and makes us more likely to imagine the superior qualities of the options we rejected. Schwartz distinguishes between 'maximisers', who always seek the best possible option, and 'satisficers', who are content with something that is good enough. Research suggests that satisficers tend to be happier.",
    highlights: { paralysing: 'парализующий', liberating: 'освобождающий', contends: 'утверждает', abundance: 'изобилие', maximisers: 'максимизаторы', satisficers: 'удовлетворенцы' },
    questions: [
      { q: 'What does Schwartz argue about having many choices?', options: ['It always improves satisfaction', 'It can be paralysing', 'It is economically beneficial', 'It simplifies decisions'], answer: 'It can be paralysing' },
      { q: 'Why does an abundance of choice reduce satisfaction?', options: ['It takes too much time', 'It raises our expectations', 'It confuses our preferences', 'It costs more money'], answer: 'It raises our expectations' },
      { q: 'Who does research suggest tends to be happier?', options: ['Maximisers', 'Satisficers', 'Both equally', 'Neither'], answer: 'Satisficers' },
    ],
  },
  {
    level: 'C1',
    title: 'Neuroplasticity and Learning',
    text: "For much of the twentieth century, neuroscientists believed that the adult brain was essentially fixed — that its structure and function were largely determined by early childhood development and remained relatively immutable thereafter. This view has been dramatically overturned by the discovery of neuroplasticity: the brain's remarkable capacity to reorganise itself by forming new neural connections throughout life. When we learn a new skill, whether it is playing a musical instrument, mastering a foreign language, or navigating an unfamiliar city, we are literally reshaping our neural architecture. The London taxi driver study, which found that the hippocampi of experienced cab drivers were significantly enlarged compared to those of control subjects, provided compelling evidence for experience-dependent structural change in the adult brain. The implications for education are profound. Rather than viewing intelligence as a fixed attribute — a notion popularised by early IQ testing — we must recognise it as a dynamic quality that can be cultivated through deliberate practice and enriched environments.",
    highlights: { neuroplasticity: 'нейропластичность', immutable: 'неизменный', neural: 'нейронный', hippocampi: 'гиппокамп (мн.ч.)', compelling: 'убедительный', deliberate: 'намеренный' },
    questions: [
      { q: 'What was the traditional view of the adult brain?', options: ['Highly adaptable', 'Continuously growing', 'Essentially fixed', 'Dependent on sleep'], answer: 'Essentially fixed' },
      { q: 'What did the London taxi driver study show?', options: ['Taxi drivers have higher IQ', 'Experience can change brain structure', 'Navigation is innate', 'The brain shrinks with age'], answer: 'Experience can change brain structure' },
      { q: 'What implication does neuroplasticity have for education?', options: ['IQ tests are more important', 'Intelligence is fixed at birth', 'Intelligence can be developed', 'Early education is the only factor'], answer: 'Intelligence can be developed' },
    ],
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const SRS_KEY = 'fluenta_vocab_srs'

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

function renderText(text: string, highlights: Record<string, string>, onWordClick: (w: VocabItem) => void) {
  const words = Object.keys(highlights).sort((a, b) => b.length - a.length)
  const parts: Array<{ text: string; vocab?: VocabItem }> = []
  let remaining = text

  while (remaining.length > 0) {
    let found = false
    for (const w of words) {
      const idx = remaining.toLowerCase().indexOf(w.toLowerCase())
      if (idx === 0) {
        parts.push({ text: remaining.slice(0, w.length), vocab: { word: remaining.slice(0, w.length), translation: highlights[w] } })
        remaining = remaining.slice(w.length)
        found = true
        break
      } else if (idx > 0) {
        parts.push({ text: remaining.slice(0, idx) })
        parts.push({ text: remaining.slice(idx, idx + w.length), vocab: { word: remaining.slice(idx, idx + w.length), translation: highlights[w] } })
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
        className="border-b-2 border-dotted border-[#6366f1] cursor-pointer hover:bg-[#6366f1]/10 rounded px-0.5 transition-colors text-[#a5b4fc]">
        {p.text}
      </span>
    ) : (
      <span key={i}>{p.text}</span>
    )
  )
}

export default function ReadingPage() {
  const [activeLevel, setActiveLevel] = useState('A1')
  const [popup, setPopup] = useState<VocabItem | null>(null)
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const entry = TEXTS.find(t => t.level === activeLevel)!
  const color = LEVEL_COLORS[activeLevel]

  function selectLevel(level: string) {
    stopSpeaking()
    setActiveLevel(level)
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

  const allAnswered = entry.questions.every((_, i) => answers[i] !== undefined)
  const correctCount = entry.questions.filter((q, i) => answers[i] === q.answer).length

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Чтение</h1>
        <p className="text-[#64748b] text-sm">Читай, учи слова, отвечай на вопросы</p>
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
          {/* Article */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-xl">{entry.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${color}20`, color }}>
                  {entry.level}
                </span>
              </div>
              <button onClick={handleListen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                <Volume2 className="w-4 h-4" />
                {speaking ? 'Стоп' : 'Слушать'}
              </button>
            </div>

            {/* Word popup */}
            <AnimatePresence>
              {popup && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-16 right-6 bg-[#1e1b4b] border border-[#6366f1]/40 rounded-xl px-4 py-3 shadow-2xl z-20 min-w-[200px]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-white font-semibold">{popup.word}</span>
                    <button onClick={() => setPopup(null)}><X className="w-3.5 h-3.5 text-[#475569] hover:text-white" /></button>
                  </div>
                  <p className="text-[#94a3b8] text-sm mb-3">{popup.translation}</p>
                  {savedWords.has(popup.word) ? (
                    <div className="flex items-center gap-1.5 text-[#10b981] text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> Добавлено в словарь
                    </div>
                  ) : (
                    <button onClick={() => handleAddToVocab(popup)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> В словарь
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text */}
            <p className="text-[#cbd5e1] leading-relaxed text-base">
              {renderText(entry.text, entry.highlights, handleWordClick)}
            </p>

            {/* Vocab legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(entry.highlights).map(([word, translation]) => (
                <span key={word}
                  onClick={() => handleWordClick({ word, translation })}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#a5b4fc] cursor-pointer hover:bg-[#6366f1]/20 transition-colors">
                  {word}
                  {savedWords.has(word) && <Check className="w-2.5 h-2.5 inline ml-1 text-[#10b981]" />}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#475569] mt-3">Кликни на подсвеченное слово → перевод + добавить в словарь</p>
          </div>

          {/* Questions */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-semibold">Вопросы к тексту</h3>
            {entry.questions.map((q, qi) => (
              <div key={qi}>
                <p className="text-[#94a3b8] text-sm mb-2">{qi + 1}. {q.q}</p>
                <div className="grid grid-cols-2 gap-2">
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
                        className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${cls}`}>
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
                Проверить ответы
              </button>
            ) : (
              <div className="space-y-3">
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center ${correctCount === 3 ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'}`}>
                  {correctCount === 3 ? '🎉 Все ответы правильные!' : `${correctCount} из 3 правильно`}
                </div>
                {savedWords.size > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 text-sm text-[#a5b4fc]">
                    <Check className="w-4 h-4 text-[#10b981]" />
                    Сохранено {savedWords.size} {savedWords.size === 1 ? 'слово' : 'слов'} в словарь
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
