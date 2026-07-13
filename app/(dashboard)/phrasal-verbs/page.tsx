'use client'
import { useState, useMemo } from 'react'
import { PHRASAL_VERBS_DATA, searchPhrasalVerbs, getAllPhrasalVerbs } from '@/lib/phrasal-verbs-data'
import { addCardToSR } from '@/lib/spaced-repetition'

const CATEGORY_ICONS: Record<string, string> = {
  daily: '🏠',
  social: '👥',
  work: '💼',
  travel: '✈️',
  emotions: '❤️',
}

export default function PhrasalVerbsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [expandedVerb, setExpandedVerb] = useState<string | null>(null)

  const displayedVerbs = useMemo(() => {
    if (search.trim()) return searchPhrasalVerbs(search)
    if (activeCategory === 'all') return getAllPhrasalVerbs()
    return PHRASAL_VERBS_DATA.find(c => c.id === activeCategory)?.verbs ?? []
  }, [search, activeCategory])

  function toggleFlip(id: string) {
    setFlipped(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleLearned(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setLearned(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        // Add to spaced repetition
        const verb = getAllPhrasalVerbs().find(v => v.id === id)
        if (verb) {
          addCardToSR({
            wordId: `pv_${verb.verb.replace(/\s+/g, '_')}`,
            word: verb.verb,
            translation: verb.translation,
            example: verb.examples[0],
          })
        }
      }
      return next
    })
  }

  const total = getAllPhrasalVerbs().length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1"><span className="gradient-text">Фразовые глаголы</span></h1>
        <p className="text-muted-foreground text-sm">{total} фразовых глаголов по 5 темам</p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-green-400 text-base">✓</span>
          <div>
            <p className="text-white font-semibold text-sm">{learned.size}</p>
            <p className="text-muted-foreground text-xs">Изучено</p>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-primary text-base">📚</span>
          <div>
            <p className="text-white font-semibold text-sm">{total - learned.size}</p>
            <p className="text-muted-foreground text-xs">Осталось</p>
          </div>
        </div>
        {learned.size > 0 && (
          <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-yellow-400 text-base">⚡</span>
            <div>
              <p className="text-white font-semibold text-sm">{Math.round(learned.size / total * 100)}%</p>
              <p className="text-muted-foreground text-xs">Прогресс</p>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск: turn on, включать, lights..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#475569] outline-none focus:border-primary/50 transition-colors text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
            ✕
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeCategory === 'all'
                ? 'bg-primary border-primary text-white'
                : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white'
            }`}
          >
            Все ({total})
          </button>
          {PHRASAL_VERBS_DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{CATEGORY_ICONS[cat.id]}</span>
              <span className="hidden sm:inline">{cat.title}</span>
              <span className="text-xs opacity-70">({cat.verbs.length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Category description */}
      {!search && activeCategory !== 'all' && (
        <div className="mb-5 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-[#a5b4fc] text-sm">
            {CATEGORY_ICONS[activeCategory]}{' '}
            {PHRASAL_VERBS_DATA.find(c => c.id === activeCategory)?.description}
          </p>
        </div>
      )}

      {/* Search results count */}
      {search && (
        <p className="text-muted-foreground text-sm mb-4">
          Найдено: {displayedVerbs.length}{' '}
          {displayedVerbs.length === 1 ? 'глагол' : displayedVerbs.length < 5 ? 'глагола' : 'глаголов'}
        </p>
      )}

      {/* Verb cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedVerbs.map(verb => {
          const isFlipped = flipped.has(verb.id)
          const isLearned = learned.has(verb.id)
          const isExpanded = expandedVerb === verb.id

          return (
            <div
              key={verb.id}
              onClick={() => setExpandedVerb(isExpanded ? null : verb.id)}
              className={`relative bg-white/[0.04] border rounded-2xl p-4 cursor-pointer transition-all hover:border-white/20 ${
                isLearned ? 'border-green-500/30 bg-green-500/[0.04]' : 'border-white/10'
              }`}
            >
              {/* Learned toggle */}
              <button
                onClick={e => toggleLearned(verb.id, e)}
                className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                  isLearned
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/[0.06] text-muted-foreground hover:text-white'
                }`}
              >
                {isLearned ? '✓' : '○'}
              </button>

              {/* Verb + translation */}
              <div className="pr-8">
                <p className="text-white font-semibold text-base mb-1">{verb.verb}</p>
                <p className="text-primary text-sm">{verb.translation}</p>
              </div>

              {/* Expanded: examples + flip */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                  {verb.examples.map((ex, i) => (
                    <p key={i} className="text-muted-foreground text-sm italic">"{ex}"</p>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={e => { e.stopPropagation(); toggleFlip(verb.id) }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-[#a5b4fc] hover:bg-primary/30 transition-all"
                    >
                      {isFlipped ? 'Скрыть перевод' : 'Показать перевод'}
                    </button>
                    {isFlipped && (
                      <span className="text-primary text-sm font-medium">{verb.translation}</span>
                    )}
                  </div>
                </div>
              )}

              {!isExpanded && (
                <p className="text-muted-foreground text-xs mt-3">
                  {verb.examples.length} {verb.examples.length === 1 ? 'пример' : 'примера'} · нажми чтобы открыть
                </p>
              )}
            </div>
          )
        })}
      </div>

      {displayedVerbs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-medium mb-2">Ничего не найдено</p>
          <p className="text-muted-foreground text-sm">Попробуй другой запрос</p>
        </div>
      )}
    </div>
  )
}
