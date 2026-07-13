'use client'
import { useState } from 'react'
import { IDIOMS, IDIOM_CATEGORIES } from '@/lib/idioms-data'

export default function IdiomsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [learned, setLearned] = useState<Set<string>>(new Set())

  const filtered = IDIOMS.filter(i => {
    const matchSearch = i.idiom.toLowerCase().includes(search.toLowerCase()) ||
      i.meaning.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Все' || i.category === category
    return matchSearch && matchCat
  })

  function toggleFlip(id: string) {
    setFlipped(f => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function toggleLearn(id: string) {
    setLearned(l => {
      const n = new Set(l)
      const wasLearned = n.has(id)
      wasLearned ? n.delete(id) : n.add(id)
      if (!wasLearned) {
        const idiom = IDIOMS.find(i => i.id === id)
        if (idiom) {
          const cards = JSON.parse(localStorage.getItem('fluenta_sr_cards') ?? '[]')
          if (!cards.some((c: { wordId: string }) => c.wordId === `idiom_${id}`)) {
            cards.push({
              wordId: `idiom_${id}`,
              word: idiom.idiom,
              translation: idiom.meaning,
              example: idiom.example,
              easeFactor: 2.5, interval: 1, repetitions: 0,
              dueDate: new Date().toISOString().slice(0, 10),
            })
            localStorage.setItem('fluenta_sr_cards', JSON.stringify(cards))
          }
        }
      }
      return n
    })
  }

  function speak(text: string) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Идиомы</span></h1>
          <p className="text-[#64748b] text-sm mt-1">{IDIOMS.length} идиом · {learned.size} изучено</p>
        </div>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Поиск идиомы..."
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white
          placeholder:text-[#334155] outline-none focus:border-[#6366f1]/50 transition-colors mb-4" />

      <div className="flex gap-2 flex-wrap mb-6">
        {['Все', ...IDIOM_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              category === cat ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white/[0.04] border-white/10 text-[#94a3b8] hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(idiom => (
          <div key={idiom.id}
            className={`rounded-2xl border p-5 transition-all cursor-pointer ${
              learned.has(idiom.id)
                ? 'bg-green-500/5 border-green-500/15'
                : 'bg-white/[0.04] border-white/10 hover:border-white/20'
            }`}
            onClick={() => toggleFlip(idiom.id)}>

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <span className="text-xs text-[#475569]">{idiom.category} · {idiom.level}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleLearn(idiom.id) }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                  learned.has(idiom.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] text-[#64748b] hover:text-white'
                }`}>
                {learned.has(idiom.id) ? '✓' : '+'}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <p className="text-white font-bold text-base">{idiom.idiom}</p>
              <button onClick={e => { e.stopPropagation(); speak(idiom.idiom) }}
                className="text-[#475569] hover:text-[#94a3b8] transition-colors text-sm">🔊</button>
            </div>

            {flipped.has(idiom.id) ? (
              <div>
                <p className="text-[#6366f1] font-medium text-sm mb-2">{idiom.meaning}</p>
                <p className="text-[#64748b] text-sm italic">&ldquo;{idiom.example}&rdquo;</p>
              </div>
            ) : (
              <p className="text-[#475569] text-xs">Нажми чтобы увидеть значение</p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#475569]">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  )
}
