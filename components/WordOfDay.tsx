'use client'
import { useState } from 'react'
import { getWordOfDay } from '@/lib/word-of-day'

export function WordOfDay() {
  const word = getWordOfDay()
  const [added, setAdded] = useState(false)

  function speak() {
    if (typeof window === 'undefined') return
    const u = new SpeechSynthesisUtterance(word.word)
    u.lang = 'en-US'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const v = voices.find(v => v.lang === 'en-US')
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }

  function addToSR() {
    const cards = JSON.parse(localStorage.getItem('fluenta_sr_cards') ?? '[]')
    const exists = cards.some((c: { wordId: string }) => c.wordId === `wod_${word.word}`)
    if (!exists) {
      cards.push({
        wordId: `wod_${word.word}`,
        word: word.word,
        translation: word.translation,
        example: word.example,
        easeFactor: 2.5, interval: 1, repetitions: 0,
        dueDate: new Date().toISOString().slice(0, 10),
      })
      localStorage.setItem('fluenta_sr_cards', JSON.stringify(cards))
    }
    setAdded(true)
  }

  return (
    <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#6366f1] uppercase tracking-wider">Слово дня</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc]">{word.level}</span>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-white text-2xl font-bold">{word.word}</h3>
        <button onClick={speak}
          className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-sm transition-colors"
          title="Произношение">
          🔊
        </button>
      </div>
      <p className="text-[#94a3b8] text-sm mb-1">{word.transcription}</p>
      <p className="text-[#6366f1] font-medium mb-3">{word.translation}</p>
      <p className="text-[#64748b] text-sm italic mb-4">&ldquo;{word.example}&rdquo;</p>
      <button onClick={addToSR} disabled={added}
        className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
          added
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-white/[0.06] hover:bg-white/10 border border-white/10 text-[#94a3b8] hover:text-white'
        }`}>
        {added ? '✓ Добавлено в повторение' : '+ Добавить в словарь'}
      </button>
    </div>
  )
}
