'use client'
import { useState, useEffect } from 'react'
import { SRCard, sm2, getDueCards, loadSRCards, saveSRCards } from '@/lib/spaced-repetition'

export function DailyReview() {
  const [cards, setCards] = useState<SRCard[]>([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [done, setDone] = useState(false)
  const [todayCount, setTodayCount] = useState(0)

  useEffect(() => {
    const all = loadSRCards()
    const due = getDueCards(all)
    setCards(due)
    setTodayCount(due.length)
  }, [])

  if (cards.length === 0) return null

  const card = cards[current]

  function handleAnswer(quality: 0|1|2|3|4|5) {
    const all = loadSRCards()
    const idx = all.findIndex(c => c.wordId === card.wordId)
    const updated = sm2(card, quality)
    if (idx >= 0) all[idx] = updated
    else all.push(updated)
    saveSRCards(all)

    if (current + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
      setShowAnswer(false)
    }
  }

  if (done) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="text-white font-semibold">Повторение завершено!</p>
        <p className="text-muted-foreground text-sm">{todayCount} карточек повторено сегодня</p>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-semibold text-sm">Ежедневное повторение</p>
        <span className="text-muted-foreground text-xs">{current + 1} / {cards.length}</span>
      </div>

      <div className="h-1 bg-white/[0.06] rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${(current / cards.length) * 100}%` }} />
      </div>

      <div className="text-center py-6 px-4 bg-white/[0.03] rounded-xl mb-5 min-h-[120px] flex flex-col items-center justify-center">
        <p className="text-white text-2xl font-bold mb-1">{card.word}</p>
        {showAnswer ? (
          <>
            <p className="text-primary text-lg mt-2">{card.translation}</p>
            {card.example && <p className="text-muted-foreground text-sm mt-3 italic">&quot;{card.example}&quot;</p>}
          </>
        ) : (
          <button onClick={() => setShowAnswer(true)}
            className="mt-3 px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-muted-foreground text-sm rounded-xl transition-colors">
            Показать перевод
          </button>
        )}
      </div>

      {showAnswer && (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleAnswer(1)}
            className="py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
            ✗ Не знаю
          </button>
          <button onClick={() => handleAnswer(3)}
            className="py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors">
            ~ Сомневаюсь
          </button>
          <button onClick={() => handleAnswer(5)}
            className="py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors">
            ✓ Знаю
          </button>
        </div>
      )}
    </div>
  )
}
