'use client'
import { useState } from 'react'
import { AFFIXES } from '@/lib/word-formation-data'
import { AIGenerateButton } from '@/components/ui/AIGenerateButton'

export default function WordFormationPage() {
  const [selected, setSelected] = useState(AFFIXES[0])
  const [quizMode, setQuizMode] = useState(false)
  const [quizIdx, setQuizIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [aiForms, setAiForms] = useState<Array<{ type: string; word: string; example: string }> | null>(null)

  const prefixes = AFFIXES.filter(a => a.type === 'prefix')
  const suffixes = AFFIXES.filter(a => a.type === 'suffix')

  const quizItems = selected.examples
  const quizItem = quizItems[quizIdx % quizItems.length]

  function checkAnswer() {
    const correct = answer.trim().toLowerCase() === quizItem.formed.toLowerCase()
    setResult(correct)
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  function nextQuiz() {
    setQuizIdx(i => i + 1)
    setAnswer('')
    setResult(null)
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Словообразование</h1>
      <p className="text-muted-foreground text-sm mb-6">Префиксы и суффиксы английского языка</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая панель — список аффиксов */}
        <div className="lg:col-span-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Префиксы</p>
          <div className="space-y-1 mb-4">
            {prefixes.map(a => (
              <button key={a.id} onClick={() => { setSelected(a); setQuizMode(false); setQuizIdx(0) }}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  selected.id === a.id ? 'bg-primary/20 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/[0.04]'
                }`}>
                <span className="font-mono font-bold">{a.affix}</span>
                <span className="text-xs opacity-60">{a.level}</span>
              </button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Суффиксы</p>
          <div className="space-y-1">
            {suffixes.map(a => (
              <button key={a.id} onClick={() => { setSelected(a); setQuizMode(false); setQuizIdx(0) }}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  selected.id === a.id ? 'bg-primary/20 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/[0.04]'
                }`}>
                <span className="font-mono font-bold">{a.affix}</span>
                <span className="text-xs opacity-60">{a.level}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Правая панель — детали */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-bold font-mono text-primary">{selected.affix}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted-foreground">
                {selected.type === 'prefix' ? 'Префикс' : 'Суффикс'} · {selected.level}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-5">Значение: {selected.meaning}</p>

            <div className="space-y-2">
              {selected.examples.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl">
                  <span className="text-muted-foreground text-sm w-24">{ex.base}</span>
                  <span className="text-[#334155]">→</span>
                  <span className="text-white font-semibold flex-1">{ex.formed}</span>
                  <span className="text-muted-foreground text-sm">{ex.translation}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">AI словообразование</span>
                <AIGenerateButton
                  type="word_formation"
                  context={selected.examples[0]?.base ?? selected.affix}
                  onResult={(data) => setAiForms((data as { forms?: Array<{ type: string; word: string; example: string }> }).forms ?? null)}
                  label="Сгенерировать"
                  variant="inline"
                />
              </div>
              {aiForms && (
                <div className="space-y-1.5">
                  {aiForms.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-1">
                      <span className="text-primary w-16">{f.type}</span>
                      <span className="text-white font-semibold">{f.word}</span>
                      <span className="text-muted-foreground italic truncate">— {f.example}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Упражнение */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold text-sm">Упражнение</p>
              <span className="text-muted-foreground text-xs">{score.correct}/{score.total}</span>
            </div>

            {!quizMode ? (
              <button onClick={() => setQuizMode(true)}
                className="w-full py-3 bg-primary hover:bg-[#5558e8] text-white font-medium rounded-xl transition-colors">
                Начать упражнение
              </button>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-3">
                  Добавь <span className="text-primary font-bold">{selected.affix}</span> к слову:
                </p>
                <p className="text-white text-2xl font-bold text-center py-4 bg-white/[0.03] rounded-xl mb-4">
                  {quizItem.base}
                </p>
                {result === null ? (
                  <>
                    <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && answer && checkAnswer()}
                      placeholder={`Введи ${selected.type === 'prefix' ? selected.affix + quizItem.base : quizItem.base + selected.affix}...`}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3
                        text-white placeholder:text-[#334155] outline-none focus:border-primary/50 mb-3" />
                    <button onClick={checkAnswer} disabled={!answer}
                      className="w-full py-3 bg-primary hover:bg-[#5558e8] disabled:opacity-40 text-white font-medium rounded-xl transition-colors">
                      Проверить
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`p-3 rounded-xl mb-3 text-center border ${result ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <p className={`font-semibold ${result ? 'text-green-400' : 'text-red-400'}`}>
                        {result ? '✓ Правильно!' : `✗ Правильно: ${quizItem.formed}`}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">{quizItem.translation}</p>
                    </div>
                    <button onClick={nextQuiz}
                      className="w-full py-3 bg-white/[0.06] hover:bg-white/10 text-white font-medium rounded-xl transition-colors">
                      Следующее →
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
