'use client'
import { useState } from 'react'

interface Exercise {
  exercise: string
  instruction: string
  correctAnswer: string
  hint?: string
  explanation?: string
}

interface CheckResult {
  isCorrect: boolean
  feedback: string
  explanation?: string
  betterAnswer?: string
}

interface GrammarExerciseProps {
  topic: string
  level: string
  exercise: Exercise
  onNext?: () => void
  onCorrect?: () => void
}

export function GrammarExercise({ topic, level, exercise, onNext, onCorrect }: GrammarExerciseProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [showHint, setShowHint] = useState(false)

  async function handleCheck() {
    if (!userAnswer.trim()) return
    setChecking(true)
    try {
      const res = await fetch('/api/ai/check-grammar-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          userAnswer: userAnswer.trim(),
          exercise: exercise.exercise,
          correctAnswer: exercise.correctAnswer,
        }),
      })
      const data = await res.json()
      setResult(data)
      if (data.isCorrect) onCorrect?.()
    } catch {
      setResult({ isCorrect: false, feedback: 'Ошибка проверки. Попробуй снова.' })
    } finally {
      setChecking(false)
    }
  }

  function handleNext() {
    setUserAnswer('')
    setResult(null)
    setShowHint(false)
    onNext?.()
  }

  const exerciseDisplay = exercise.exercise.replace(
    /___+/g,
    `<span class="inline-block min-w-[80px] border-b-2 border-[hsl(var(--accent))] text-center px-2 text-[hsl(var(--accent))]">${
      result ? exercise.correctAnswer : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    }</span>`
  )

  // level is used in the UI for context
  void level

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
      <p className="text-[hsl(var(--foreground-muted))] text-sm mb-4">{exercise.instruction}</p>

      <div className="bg-white/[0.03] rounded-xl p-4 mb-5">
        <p className="text-white text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: exerciseDisplay }} />
      </div>

      {exercise.explanation && !result && (
        <p className="text-[hsl(var(--foreground-subtle))] text-sm italic mb-4">📚 {exercise.explanation}</p>
      )}

      {!result && (
        <>
          <input
            type="text"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="Твой ответ..."
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3
              text-white placeholder:text-[#334155] outline-none focus:border-[hsl(var(--accent))]/50 transition-colors mb-3"
          />

          {exercise.hint && (
            <button onClick={() => setShowHint(!showHint)}
              className="text-[hsl(var(--foreground-subtle))] text-xs hover:text-[hsl(var(--foreground-muted))] transition-colors mb-3 block">
              {showHint ? '▼ Скрыть подсказку' : '▶ Показать подсказку'}
            </button>
          )}
          {showHint && exercise.hint && (
            <p className="text-[hsl(var(--foreground-muted))] text-sm bg-white/[0.03] rounded-lg px-3 py-2 mb-3">
              💡 {exercise.hint}
            </p>
          )}

          <button onClick={handleCheck} disabled={!userAnswer.trim() || checking}
            className="btn-glow w-full py-3 bg-[hsl(var(--accent))] hover:bg-[#5558e8] disabled:opacity-40
              text-white font-semibold rounded-xl transition-colors">
            {checking ? 'Проверяю...' : 'Проверить'}
          </button>
        </>
      )}

      {result && (
        <div className={`rounded-xl p-4 mb-4 border ${
          result.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
        }`}>
          <p className={`font-semibold mb-1 ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {result.isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
          </p>
          <p className="text-[hsl(var(--foreground-muted))] text-sm">{result.feedback}</p>
          {result.explanation && (
            <p className="text-[hsl(var(--foreground-muted))] text-sm mt-2">📖 {result.explanation}</p>
          )}
          {result.betterAnswer && !result.isCorrect && (
            <p className="text-[hsl(var(--foreground-muted))] text-sm mt-2">
              Правильно: <span className="text-white font-medium">{result.betterAnswer}</span>
            </p>
          )}
        </div>
      )}

      {result && (
        <button onClick={handleNext}
          className="w-full py-3 bg-white/[0.06] hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10">
          Следующее упражнение →
        </button>
      )}
    </div>
  )
}
