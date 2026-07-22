'use client'
import { useState } from 'react'
import { COLLOCATIONS, COLLOCATION_CATEGORIES } from '@/lib/collocations-data'
import { Sparkles, Loader2, Volume2, Check, Plus, AlertTriangle } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

export default function CollocationsPage() {
  const [category, setCategory] = useState('Все')
  const [search, setSearch] = useState('')
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [showWrong, setShowWrong] = useState<Set<string>>(new Set())
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiTopic, setAiTopic] = useState('')
  const [aiResults, setAiResults] = useState<Array<{id:string,collocation:string,translation:string,example:string,category:string}>>([])

  async function generateCollocations() {
    const data = await generate<{collocations: typeof aiResults}>('collocations', aiTopic || (category !== 'Все' ? category : 'business'))
    if (data?.collocations) setAiResults(data.collocations.map((c,i) => ({...c, id:`ai-${i}`})))
  }

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
        <p className="text-muted-foreground text-sm mt-1">Слова которые «ходят вместе» · {COLLOCATIONS.length} коллокаций · {learned.size} изучено</p>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Поиск: make, decision, решение..."
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white
          placeholder:text-[#334155] outline-none focus:border-primary/50 transition-colors mb-4" />

      <div className="flex gap-2 flex-wrap mb-6">
        {['Все', ...COLLOCATION_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              category === cat ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* AI блок */}
      <div className="mb-5 p-4 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-2xl">
        <p className="text-xs font-semibold text-[#818cf8] mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/>AI коллокации по теме</p>
        <div className="flex gap-2">
          <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="business, travel, health..."
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#475569] outline-none min-h-[44px]"/>
          <button onClick={generateCollocations} disabled={aiLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white rounded-xl text-sm font-medium min-h-[44px]">
            {aiLoading?<Loader2 className="w-4 h-4 animate-spin"/>:<Sparkles className="w-4 h-4"/>}
            {aiLoading?'...':'AI'}
          </button>
        </div>
        {aiResults.length>0&&<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {aiResults.map(c=>(
            <div key={c.id} className="p-3 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/5">
              <p className="text-white font-semibold text-sm">{c.collocation}</p>
              <p className="text-[#818cf8] text-xs">{c.translation}</p>
              <p className="text-[#64748b] text-xs italic mt-1">&quot;{c.example}&quot;</p>
            </div>
          ))}
        </div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(col => (
          <div key={col.id}
            className={`rounded-2xl border p-5 transition-all ${
              learned.has(col.id) ? 'bg-green-500/5 border-green-500/15' : 'bg-white/[0.04] border-white/10'
            }`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
                  {col.verb ?? col.adjective ?? '•'}
                </span>
                <span className="text-xs text-muted-foreground">{col.level}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => speak(col.collocation)}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-muted-foreground"><Volume2 className="w-3.5 h-3.5" strokeWidth={1.75} /></button>
                <button onClick={() => toggleLearn(col.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    learned.has(col.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] text-muted-foreground hover:text-white'
                  }`}>
                  {learned.has(col.id) ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2} />}
                </button>
              </div>
            </div>

            <p className="text-white text-lg font-bold mb-1">{col.collocation}</p>
            <p className="text-primary text-sm font-medium mb-2">{col.translation}</p>
            <p className="text-muted-foreground text-sm italic mb-3">&quot;{col.example}&quot;</p>

            {col.wrongExample && (
              <button onClick={() => setShowWrong(s => { const n = new Set(s); n.has(col.id) ? n.delete(col.id) : n.add(col.id); return n })}
                className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors">
                {showWrong.has(col.id) ? (
                  <span className="text-red-400/80">{col.wrongExample}</span>
                ) : <span className="inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} /> Показать частую ошибку</span>}
              </button>
            )}
          </div>
             ))}
      </div>
    </div>
  );
}
