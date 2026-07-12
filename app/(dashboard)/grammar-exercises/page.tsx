'use client'
import { useState, useEffect, useCallback } from 'react'
import { GrammarExercise } from '@/components/GrammarExercise'

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
          <p className="text-[#64748b] text-sm mt-1">AI проверяет твои ответы</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{score.correct}/{score.total}</p>
          <p className="text-[#64748b] text-xs">правильно</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {GRAMMAR_TOPICS.map(topic => (
          <button key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              selectedTopic.id === topic.id
                ? 'bg-[#6366f1] border-[#6366f1] text-white'
                : 'bg-white/[0.04] border-white/10 text-[#94a3b8] hover:text-white'
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
                : 'bg-transparent border-white/[0.06] text-[#64748b] hover:text-[#94a3b8]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748b] text-sm">Генерирую упражнение...</p>
        </div>
      )}

      {!loading && exercise && (
        <GrammarExercise
          topic={selectedTopic.label}
          level={selectedTopic.level}
          exercise={exercise}
          onNext={loadExercise}
          onCorrect={() => setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }))}
        />
      )}
    </div>
  )
}
