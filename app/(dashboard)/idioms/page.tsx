'use client'
import { useState } from 'react'
import { IDIOMS, IDIOM_CATEGORIES } from '@/lib/idioms-data'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

export default function IdiomsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiTopic, setAiTopic] = useState('')
  const [aiIdioms, setAiIdioms] = useState<Array<{idiom:string,meaning:string,example:string,level:string}>>([])
  async function generateIdioms() {
    const data = await generate<{idioms: typeof aiIdioms}>('idioms', aiTopic || 'emotions and feelings')
    if (data?.idioms) setAiIdioms(data.idioms)
  }

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
          <p className="text-muted-foreground text-sm mt-1">{IDIOMS.length} идиом · {learned.size} изучено</p>
        </div>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Поиск идиомы..."
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white
          placeholder:text-[#334155] outline-none focus:border-primary/50 transition-colors mb-4" />

      <div className="flex gap-2 flex-wrap mb-6">
        {['Все', ...IDIOM_CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              category === cat ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-5 p-4 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-2xl">
        <p className="text-xs font-semibold text-[#818cf8] mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/>AI идиомы по теме</p>
        <div className="flex gap-2">
          <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="time, money, success..."
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#475569] outline-none min-h-[44px]"/>
          <button onClick={generateIdioms} disabled={aiLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white rounded-xl text-sm font-medium min-h-[44px]">
            {aiLoading?<Loader2 className="w-4 h-4 animate-spin"/>:<Sparkles className="w-4 h-4"/>}AI
          </button>
        </div>
        {aiIdioms.length>0&&<div className="mt-3 space-y-2">
          {aiIdioms.map((item,i)=>(
            <div key={i} className="p-3 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/5">
              <div className="flex justify-between items-center">
                <p className="text-white font-semibold text-sm">&quot;{item.idiom}&quot;</p>
                <span className="text-xs text-[#818cf8] bg-[#6366f1]/10 px-2 py-0.5 rounded-full">{item.level}</span>
              </div>
              <p className="text-[#818cf8] text-xs mt-0.5">{item.meaning}</p>
              <p className="text-[#64748b] text-xs italic mt-1">{item.example}</p>
            </div>
          ))}
        </div>}
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
                <span className="text-xs text-muted-foreground">{idiom.category} · {idiom.level}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleLearn(idiom.id) }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                  learned.has(idiom.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] text-muted-foreground hover:text-white'
                }`}>
                {learned.has(idiom.id) ? '✓' : '+'}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <p className="text-white font-bold text-base">{idiom.idiom}</p>
              <button onClick={e => { e.stopPropagation(); speak(idiom.idiom) }}
                className="text-muted-foreground hover:text-muted-foreground transition-colors text-sm">🔊</button>
            </div>

            {flipped.has(idiom.id) ? (
              <div>
                <p className="text-primary font-medium text-sm mb-2">{idiom.meaning}</p>
                <p className="text-muted-foreground text-sm italic">&ldquo;{idiom.example}&rdquo;</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">Нажми чтобы увидеть значение</p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Ничего не найдено
             </div>
        )}
      </div>
    </div>
  );
}
