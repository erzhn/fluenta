'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'

interface ReadingArticle {
  id: string
  level: string
  title: string
  paragraphs: string[]
  vocabulary: Array<{ word: string; translation: string; example: string }>
  questions: Array<{ q: string; options: string[]; answer: string }>
}

const ARTICLES: ReadingArticle[] = [
  {
    id: 'r1', level: 'A1', title: 'My Favourite Season',
    paragraphs: [
      'My favourite season is summer. The weather is warm and sunny. I love going to the beach with my family. We swim in the sea and eat ice cream.',
      'In summer, the days are long and the nights are short. I wake up early and go for a walk in the park. The flowers are beautiful.',
      'My birthday is in July. We always have a big party in the garden. All my friends come and we play games. It is the best time of the year!',
    ],
    vocabulary: [
      { word: 'season', translation: 'время года', example: 'Summer is my favourite season.' },
      { word: 'sunny', translation: 'солнечный', example: 'It is a sunny day today.' },
      { word: 'beach', translation: 'пляж', example: 'We go to the beach in summer.' },
      { word: 'garden', translation: 'сад', example: 'We have a party in the garden.' },
    ],
    questions: [
      { q: 'When is the author\'s birthday?', options: ['June', 'July', 'August', 'September'], answer: 'July' },
      { q: 'Where does the family go in summer?', options: ['Mountains', 'Forest', 'Beach', 'City'], answer: 'Beach' },
    ],
  },
  {
    id: 'r2', level: 'A2', title: 'Working from Home',
    paragraphs: [
      'More and more people are working from home these days. They use computers and the internet to do their jobs without going to an office. This is called remote work.',
      'There are many advantages to working from home. You can save time because you don\'t need to travel to work. You can also wear comfortable clothes and have your meals at home.',
      'However, some people find it difficult to concentrate at home. There are often distractions, like the television or family members. It can also be lonely because you don\'t see your colleagues every day.',
    ],
    vocabulary: [
      { word: 'remote', translation: 'удалённый', example: 'Remote work is popular now.' },
      { word: 'advantage', translation: 'преимущество', example: 'There are many advantages to this.' },
      { word: 'distraction', translation: 'отвлечение', example: 'TV is a big distraction.' },
      { word: 'colleague', translation: 'коллега', example: 'I miss seeing my colleagues.' },
    ],
    questions: [
      { q: 'What is one disadvantage of working from home?', options: ['No commute', 'Distractions', 'Comfortable clothes', 'Home meals'], answer: 'Distractions' },
      { q: 'What do remote workers use to do their jobs?', options: ['Mobile phones only', 'Computers and internet', 'Office equipment', 'Fax machines'], answer: 'Computers and internet' },
    ],
  },
  {
    id: 'r3', level: 'B1', title: 'The Psychology of Habits',
    paragraphs: [
      'Habits are powerful forces in our lives. Scientists estimate that about 40% of our daily actions are habits rather than conscious decisions. This means that we are often "on autopilot" without realising it.',
      'A habit is formed through a simple loop: a cue triggers a routine, which produces a reward. For example, feeling stressed (cue) leads to checking your phone (routine), which provides a temporary distraction (reward). Over time, the brain automates this sequence.',
      'The good news is that habits can be changed. Researchers suggest that to replace a bad habit, you should keep the same cue and reward but change the routine in between. This approach is more effective than simply trying to stop a behaviour entirely.',
    ],
    vocabulary: [
      { word: 'estimate', translation: 'оценивать / предполагать', example: 'Scientists estimate that 40% of our actions are habits.' },
      { word: 'conscious', translation: 'осознанный', example: 'Most of our decisions are not conscious.' },
      { word: 'trigger', translation: 'запускать / триггер', example: 'A cue triggers the routine.' },
      { word: 'automate', translation: 'автоматизировать', example: 'The brain automates repeated sequences.' },
    ],
    questions: [
      { q: 'According to scientists, what percentage of daily actions are habits?', options: ['20%', '30%', '40%', '50%'], answer: '40%' },
      { q: 'What should you change to break a bad habit?', options: ['The cue', 'The reward', 'The routine', 'All three'], answer: 'The routine' },
    ],
  },
  {
    id: 'r4', level: 'B2', title: 'Artificial Intelligence in Education',
    paragraphs: [
      'Artificial intelligence is rapidly transforming educational landscapes across the globe. Adaptive learning platforms can now personalise content delivery based on individual student performance, identifying gaps in knowledge and adjusting the pace and difficulty of lessons accordingly.',
      'Proponents argue that AI tutors offer several advantages over traditional methods. They provide instant feedback, are available around the clock, and eliminate the anxiety some learners experience when interacting with human instructors. Moreover, large-scale data analysis enables educators to identify broader trends in student performance.',
      'Critics, however, raise legitimate concerns. The over-reliance on algorithmic assessment may undermine the development of critical thinking skills that require human mentorship. There is also the matter of data privacy, as these systems collect vast amounts of sensitive information about minors.',
    ],
    vocabulary: [
      { word: 'adaptive', translation: 'адаптивный', example: 'Adaptive platforms adjust to each student.' },
      { word: 'proponent', translation: 'сторонник', example: 'Proponents of AI see many benefits.' },
      { word: 'undermine', translation: 'подрывать', example: 'This may undermine critical thinking.' },
      { word: 'legitimate', translation: 'законный / обоснованный', example: 'Critics raise legitimate concerns.' },
    ],
    questions: [
      { q: 'What is one advantage of AI tutors mentioned in the text?', options: ['They are cheaper', 'They give instant feedback', 'They replace teachers', 'They teach only maths'], answer: 'They give instant feedback' },
      { q: 'What concern do critics raise?', options: ['AI is too expensive', 'Data privacy', 'AI only works in English', 'Students prefer AI'], answer: 'Data privacy' },
    ],
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

function highlightVocab(text: string, vocab: Array<{ word: string; translation: string }>, onHover: (w: { word: string; translation: string } | null) => void) {
  const parts: Array<{ text: string; highlight?: { word: string; translation: string } }> = []
  let remaining = text
  const sorted = [...vocab].sort((a, b) => b.word.length - a.word.length)

  while (remaining.length > 0) {
    let found = false
    for (const v of sorted) {
      const idx = remaining.toLowerCase().indexOf(v.word.toLowerCase())
      if (idx === 0) {
        parts.push({ text: remaining.slice(0, v.word.length), highlight: v })
        remaining = remaining.slice(v.word.length)
        found = true
        break
      } else if (idx > 0) {
        parts.push({ text: remaining.slice(0, idx) })
        parts.push({ text: remaining.slice(idx, idx + v.word.length), highlight: v })
        remaining = remaining.slice(idx + v.word.length)
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
    p.highlight ? (
      <span key={i}
        className="border-b-2 border-dotted border-[#6366f1] cursor-pointer hover:bg-[#6366f1]/10 rounded transition-colors px-0.5"
        onMouseEnter={() => onHover(p.highlight!)}
        onMouseLeave={() => onHover(null)}>
        {p.text}
      </span>
    ) : (
      <span key={i}>{p.text}</span>
    )
  )
}

export default function ReadingPage() {
  const [idx, setIdx] = useState(0)
  const [hovered, setHovered] = useState<{ word: string; translation: string } | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [showVocabPanel, setShowVocabPanel] = useState(false)

  const article = ARTICLES[idx]

  const [speaking, setSpeaking] = useState(false)

  async function handleListen() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(true)
    await speak(article.paragraphs.join(' '), { rate: 0.95, onEnd: () => setSpeaking(false) })
  }

  function goTo(i: number) {
    setIdx(i)
    setAnswers({})
    setChecked(false)
    setShowVocabPanel(false)
    stopSpeaking()
    setSpeaking(false)
  }

  const allAnswered = article.questions.every(q => answers[q.q])
  const correctCount = article.questions.filter(q => answers[q.q] === q.answer).length

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Чтение</h1>
          <p className="text-[#64748b] text-sm">Читай, учи слова, отвечай на вопросы</p>
        </div>
        <button onClick={() => setShowVocabPanel(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 text-[#818cf8] text-sm font-medium hover:bg-[#6366f1]/25 transition-colors">
          📚 Словарь
        </button>
      </div>

      {/* Article tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ARTICLES.map((a, i) => (
          <button key={a.id} onClick={() => goTo(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${i === idx ? 'border-[#6366f1] text-white bg-[#6366f1]/15' : 'border-white/10 text-[#64748b] hover:text-white hover:border-white/20'}`}>
            {a.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={article.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {/* Article */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-xl">{article.title}</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg mt-1 inline-block"
                  style={{ backgroundColor: `${LEVEL_COLORS[article.level]}20`, color: LEVEL_COLORS[article.level] }}>
                  {article.level}
                </span>
              </div>
              <button onClick={handleListen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[#94a3b8] hover:text-white text-sm transition-colors">
                <Volume2 className="w-4 h-4" /> {speaking ? '⏹ Стоп' : 'Слушать'}
              </button>
            </div>

            {/* Vocabulary tooltip */}
            {hovered && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 right-6 bg-[#1e1b4b] border border-[#6366f1]/40 rounded-xl px-4 py-3 shadow-2xl z-10 max-w-xs">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-white font-semibold">{hovered.word}</span>
                  <button onClick={() => setHovered(null)}><X className="w-3 h-3 text-[#475569]" /></button>
                </div>
                <span className="text-[#94a3b8] text-sm">{hovered.translation}</span>
              </motion.div>
            )}

            {/* Text */}
            <div className="space-y-4 text-[#cbd5e1] leading-relaxed">
              {article.paragraphs.map((p, i) => (
                <p key={i} className="text-base">
                  {highlightVocab(p, article.vocabulary, setHovered)}
                </p>
              ))}
            </div>
            <p className="text-xs text-[#475569] mt-4">Наведи на подчёркнутые слова, чтобы увидеть перевод</p>
          </div>

          {/* Vocabulary panel */}
          {showVocabPanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Ключевые слова</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.vocabulary.map(v => (
                  <div key={v.word} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{v.word}</span>
                      <button onClick={() => speak(v.word, { rate: 0.9 })} className="text-[#6366f1] hover:text-[#818cf8]">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[#64748b] text-xs">{v.translation}</p>
                    <p className="text-[#475569] text-xs mt-1 italic">"{v.example}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Questions */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-semibold">Вопросы к тексту</h3>
            {article.questions.map((q, qi) => (
              <div key={qi}>
                <p className="text-[#94a3b8] text-sm mb-2">{qi + 1}. {q.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map(opt => {
                    let cls = 'border-white/10 bg-white/[0.04] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white'
                    if (checked) {
                      if (opt === q.answer) cls = 'border-[#10b981] bg-[#10b981]/15 text-[#10b981]'
                      else if (opt === answers[q.q] && opt !== q.answer) cls = 'border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444]'
                      else cls = 'border-white/5 bg-white/[0.02] text-[#475569]'
                    } else if (answers[q.q] === opt) {
                      cls = 'border-[#6366f1] bg-[#6366f1]/15 text-white'
                    }
                    return (
                      <button key={opt} disabled={checked}
                        onClick={() => setAnswers(a => ({ ...a, [q.q]: opt }))}
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
              <div className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${correctCount === article.questions.length ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'}`}>
                {correctCount === article.questions.length ? '🎉 Все ответы правильные!' : `${correctCount} из ${article.questions.length} правильно`}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => goTo(idx - 1)} disabled={idx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[#94a3b8] hover:text-white transition-colors disabled:opacity-30 text-sm">
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
            <span className="text-[#475569] text-sm">{idx + 1} / {ARTICLES.length}</span>
            <button onClick={() => goTo(idx + 1)} disabled={idx === ARTICLES.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[#94a3b8] hover:text-white transition-colors disabled:opacity-30 text-sm">
              Далее <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
