'use client'
import { useState } from 'react'
import { COLLOCATIONS, COLLOCATION_CATEGORIES } from '@/lib/collocations-data'

export default function CollocationsPage() {
  const [category, setCategory] = useState('Все')
  const [search, setSearch] = useState('')
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [showWrong, setShowWrong] = useState<Set<string>>(new Set())

  const filtered = COLLOCATIONS.filter(c => {
    const matchSearch = c.collocation.toLowerCase().includes(search.toLowerCase()) ||
      c.translation.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Все' || c.category === category
    return matchSearch && matchCat
  })

  function toggleLearn(id: string) {
    setLearned(l => { const n = new Set(l); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function speak(text: string) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'; u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Коллокации</h1>
        <p className="text-[#64748b] text-sm mt-1">Слова которые «ходят вместе» · {COLLOCATIONS.length} коллокаций · {learned.size} изучено</p>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Поиск: make, decision, решение..."
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white
          placeholder:text-[#334155] outline-none focus:border-[#6366f1]/50 transition-colors mb-4" />

      <div className="flex gap-2 flex-wrap mb-6">
        {['Все', ...COLLOCATION_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              category === cat ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white/[0.04] border-white/10 text-[#94a3b8] hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(col => (
          <div key={col.id}
            className={`rounded-2xl border p-5 transition-all ${
              learned.has(col.id) ? 'bg-green-500/5 border-green-500/15' : 'bg-white/[0.04] border-white/10'
            }`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-mono font-bold">
                  {col.verb ?? col.adjective ?? '•'}
                </span>
                <span className="text-xs text-[#475569]">{col.level}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => speak(col.collocation)}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-xs">🔊</button>
                <button onClick={() => toggleLearn(col.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                    learned.has(col.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] text-[#64748b] hover:text-white'
                  }`}>
                  {learned.has(col.id) ? '✓' : '+'}
                </button>
              </div>
            </div>

            <p className="text-white text-lg font-bold mb-1">{col.collocation}</p>
            <p className="text-[#6366f1] text-sm font-medium mb-2">{col.translation}</p>
            <p className="text-[#64748b] text-sm italic mb-3">&quot;{col.example}&quot;</p>

            {col.wrongExample && (
              <button onClick={() => setShowWrong(s => { const n = new Set(s); n.has(col.id) ? n.delete(col.id) : n.add(col.id); return n })}
                className="text-xs text-[#475569] hover:text-[#64748b] transition-colors">
                {showWrong.has(col.id) ? (
                  <span className="text-red-400/80">{col.wrongExample}</span>
                ) : '⚠️ Показать частую ошибку'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
