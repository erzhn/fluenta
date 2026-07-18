'use client'
import { useState, useEffect, useCallback } from 'react'
import { GrammarExercise } from '@/components/GrammarExercise'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

const GRAMMAR_TOPICS = [
  { id: 'present-simple',     label: 'Present Simple',     level: 'A1' },
  { id: 'present-continuous', label: 'Present Continuous', level: 'A1' },
  { id: 'past-simple',        label: 'Past Simple',        level: 'A2' },
  { id: 'present-perfect',    label: 'Present Perfect',    level: 'A2' },
  { id: 'conditionals-1',     label: 'First Conditional',  level: 'B1' },
  { id: 'conditionals-2',     label: 'Second Conditional', level: 'B1' },
  { id: 'passive-voice',      label: 'Passive Voice',      level: 'B1' },
  { id: 'reported-speech',    label: 'Reported Speech',    level: 'B2' },
  { id: 'conditionals-3',     label: 'Third Conditional',  level: 'B2' },
  { id: 'subjunctive',        label: 'Subjunctive Mood',   level: 'C1' },
  { id: 'inversion',          label: 'Inversion',          level: 'C1' },
]

const EXERCISE_TYPES = [
  { id: 'fill-in',          label: 'Вставь слово' },
  { id: 'transform',        label: 'Трансформация' },
  { id: 'error-correction', label: 'Найди ошибку' },
]

interface ExerciseData {
  exercise: string
  instruction: string
  correctAnswer: string
  hint?: string
  explanation?: string
}

export default function GrammarExercisesPage() {
  const [selectedTopic, setSelectedTopic] = useState(GRAMMAR_TOPICS[0])
  const [exerciseType, setExerciseType] = useState('fill-in')
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiEx, setAiEx] = useState<{question:string,answer:string,options:string[],explanation:string}|null>(null)
  const [aiAnswer, setAiAnswer] = useState<string|null>(null)
  async function generateExercise() {
    const data = await generate<typeof aiEx>('grammar_exercise', selectedTopic?.label||'mixed grammar', selectedTopic?.level||'B1')
    setAiEx(data); setAiAnswer(null)
  }

  useEffect(() => { generateExercise() }, [selectedTopic])

  function pickRandomTopic() {
    const t = GRAMMAR_TOPICS[Math.floor(Math.random() * GRAMMAR_TOPICS.length)]
    setSelectedTopic(t)
  }

  const loadExercise = useCallback(async () => {
    setLoading(true)
    setExercise(null)
    try {
      const res = await fetch('/api/ai/generate-grammar-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.label,
          level: selectedTopic.level,
          exerciseType,
        }),
      })
      const data = await res.json()
      setExercise(data)
    } finally {
      setLoading(false)
    }
  }, [selectedTopic, exerciseType])

  useEffect(() => {
    loadExercise()
  }, [loadExercise])

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <span className="gradient-text">Упражнения</span> по грамматике
          </h1>
          <p className="text-muted-foreground text-sm mt-1">AI проверяет твои ответы</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{score.correct}/{score.total}</p>
          <p className="text-muted-foreground text-xs">правильно</p>
        </div>
      </div>

      <div className="mb-5 p-4 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#818cf8]"/>AI упражнение
            {streak > 1 && <span className="text-xs text-orange-400 font-bold">🔥 {streak} подряд</span>}
          </p>
          <div className="flex gap-2">
            <button onClick={pickRandomTopic} className="px-3 py-2 bg-white/[0.06] hover:bg-white/10 text-muted-foreground rounded-xl text-xs font-medium min-h-[36px] border border-white/10">
              🎲 Случайная
            </button>
            <button onClick={generateExercise} disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white rounded-xl text-xs font-medium min-h-[36px]">
              {aiLoading?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Sparkles className="w-3.5 h-3.5"/>}
              {aiLoading?'Генерирую...':'Создать'}
            </button>
          </div>
        </div>
        {aiEx&&(
          <div>
            <p className="text-white text-sm font-medium mb-3">{aiEx.question}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {aiEx.options?.map((opt,i)=>(
                <button key={i} onClick={()=>{
                  if (aiAnswer !== null) return
                  setAiAnswer(opt)
                  const correct = opt === aiEx.answer
                  if (correct) {
                    setStreak(s => s + 1)
                    setTimeout(() => generateExercise(), 1500)
                  } else {
                    setStreak(0)
                  }
                }}
                  className={`px-3 py-2.5 rounded-xl border text-sm text-left transition-all min-h-[44px] ${
                    aiAnswer===null?'border-white/10 text-white hover:border-[#6366f1]/50':
                    opt===aiEx.answer?'border-green-500 bg-green-500/10 text-green-400':
                    aiAnswer===opt?'border-red-500 bg-red-500/10 text-red-400':'border-white/10 text-[#64748b]'
                  }`}>{opt}
                </button>
              ))}
            </div>
            {aiAnswer&&<p className="text-xs text-[#64748b] italic mb-2">{aiEx.explanation}</p>}
            {aiAnswer && aiAnswer !== aiEx.answer && (
              <button onClick={generateExercise} className="text-xs text-primary hover:text-primary/80 transition-colors">
                Попробовать ещё раз →
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {GRAMMAR_TOPICS.map(topic => (
          <button key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              selectedTopic.id === topic.id
                ? 'bg-primary border-primary text-white'
                : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>
            {topic.label}
            <span className="ml-1.5 text-[10px] opacity-60">{topic.level}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {EXERCISE_TYPES.map(t => (
          <button key={t.id}
            onClick={() => setExerciseType(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              exerciseType === t.id
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/[0.06] text-muted-foreground hover:text-muted-foreground'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Генерирую упражнение...</p>
        </div>
      )}

      {!loading && exercise ? (
        <GrammarExercise
          topic={selectedTopic.label}
          level={selectedTopic.level}
          exercise={exercise}
          onNext={loadExercise}
          onCorrect={() => setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }))}
           onWrong={() => setScore(s => ({ correct: s.correct, total: s.total + 1 }))}
        />
      ) : (
        <div className="text-center py-20 text-muted-foreground">Загрузка...</div>
      )}
    </div>
  );
}
