'use client'
import { useState } from 'react'
import { MINI_STORIES, MiniStory } from '@/lib/mini-stories-data'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

function addWordsToSR(words: MiniStory['vocabWords']) {
  const cards = JSON.parse(localStorage.getItem('fluenta_sr_cards') ?? '[]')
  let added = 0
  words.forEach(w => {
    if (!cards.some((c: {wordId: string}) => c.wordId === `story_${w.word}`)) {
      cards.push({
        wordId: `story_${w.word}`,
        word: w.word, translation: w.translation,
        easeFactor: 2.5, interval: 1, repetitions: 0,
        dueDate: new Date().toISOString().slice(0, 10),
      })
      added++
    }
  })
  localStorage.setItem('fluenta_sr_cards', JSON.stringify(cards))
  return added
}

export default function MiniStoriesPage() {
  const [level, setLevel] = useState('A1')
  const [selected, setSelected] = useState<MiniStory | null>(null)
  const [showVocab, setShowVocab] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [addedCount, setAddedCount] = useState(0)
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiStory, setAiStory] = useState<{title:string,content:string,vocabulary:{word:string,meaning:string}[]}|null>(null)
  async function generateStory() {
    const data = await generate<typeof aiStory>('mini_story', `level ${level} general interest`, level)
    setAiStory(data)
  }

  const filtered = MINI_STORIES.filter(s => s.level === level)

  function renderText(text: string) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#a5b4fc] font-semibold">$1</strong>')
  }

  function handleAddWords() {
    if (!selected) return
    const count = addWordsToSR(selected.vocabWords)
    setAddedCount(count)
  }

  function speak(text: string) {
    window.speechSynthesis.cancel()
    const plain = text.replace(/\*\*/g, '')
    const u = new SpeechSynthesisUtterance(plain)
    u.lang = 'en-US'; u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  if (selected) return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button onClick={() => { setSelected(null); setShowVocab(false); setShowQuestions(false); setChecked(false); setAnswers([]) }}
        className="text-muted-foreground hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
        ← Все истории
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{selected.level}</span>
        <span className="text-muted-foreground text-xs">{selected.topic}</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-6">{selected.title}</h1>

      {/* Текст истории */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => speak(selected.text)}
            className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-muted-foreground text-sm rounded-xl border border-white/10 transition-colors">
            🔊 Прослушать
          </button>
        </div>
        <p className="text-[#e2e8f0] text-lg leading-8"
          dangerouslySetInnerHTML={{ __html: renderText(selected.text) }} />
      </div>

      {/* Словарь */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-4">
        <button onClick={() => setShowVocab(!showVocab)}
          className="w-full flex items-center justify-between text-white font-semibold">
          <span>📚 Словарь ({selected.vocabWords.length} слов)</span>
          <span className="text-muted-foreground">{showVocab ? '▲' : '▼'}</span>
        </button>
        {showVocab && (
          <>
            <div className="mt-4 space-y-2">
              {selected.vocabWords.map((w, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-[#a5b4fc] font-semibold">{w.word}</span>
                  <span className="text-muted-foreground text-sm">{w.translation}</span>
                </div>
              ))}
            </div>
            <button onClick={handleAddWords}
              className={`w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                addedCount > 0
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
              }`}>
              {addedCount > 0 ? `✓ ${addedCount} слов добавлено в повторение` : '+ Добавить все слова в повторение (SR)'}
            </button>
          </>
        )}
      </div>

      {/* Вопросы */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <button onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between text-white font-semibold">
          <span>❓ Вопросы к тексту</span>
          <span className="text-muted-foreground">{showQuestions ? '▲' : '▼'}</span>
        </button>
        {showQuestions && (
          <div className="mt-4 space-y-4">
            {selected.questions.map((q, i) => (
              <div key={i}>
                <p className="text-white text-sm font-medium mb-2">{i + 1}. {q.q}</p>
                {!checked ? (
                  <input type="text"
                    value={answers[i] ?? ''}
                    onChange={e => {
                      const n = [...answers]; n[i] = e.target.value; setAnswers(n)
                    }}
                    placeholder="Твой ответ..."
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2
                      text-white text-sm placeholder:text-[#334155] outline-none focus:border-primary/50" />
                ) : (
                  <p className="text-primary text-sm bg-primary/5 rounded-xl px-3 py-2 border border-primary/20">
                    {q.a}
                  </p>
                )}
              </div>
            ))}
            {!checked && (
              <button onClick={() => setChecked(true)}
                className="w-full py-3 bg-primary hover:bg-[#5558e8] text-white font-medium rounded-xl transition-colors">
                Показать ответы
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Мини-истории</h1>
      <p className="text-muted-foreground text-sm mb-6">Читай историю · учи слова · отвечай на вопросы</p>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['A1','A2','B1','B2','C1'].map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              level === l ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>{l}</button>
        ))}
        <button onClick={generateStory} disabled={aiLoading}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#6366f1]/10 hover:bg-[#6366f1]/20 border border-[#6366f1]/20 text-[#818cf8] rounded-xl text-sm font-medium min-h-[44px] disabled:opacity-50">
          {aiLoading?<Loader2 className="w-4 h-4 animate-spin"/>:<Sparkles className="w-4 h-4"/>}
          {aiLoading?'Генерирую...':'✨ AI история'}
        </button>
      </div>

      <div className="grid gap-4">
        {filtered.map(story => (
          <button key={story.id} onClick={() => setSelected(story)}
            className="w-full text-left bg-white/[0.04] border border-white/10 hover:border-white/20
              rounded-2xl p-5 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{story.level}</span>
              <span className="text-muted-foreground text-xs">{story.topic}</span>
              <span className="text-muted-foreground text-xs">· {story.vocabWords.length} слов</span>
            </div>
            <p className="text-white font-semibold group-hover:text-[#a5b4fc] transition-colors">{story.title}</p>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {story.text.replace(/\*\*/g, '').slice(0, 120)}...
            </p>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Историй для уровня {level} пока нет</p>
        )}
      </div>

      {aiStory&&(
        <div className="mt-4 p-5 rounded-2xl border border-[#6366f1]/20 bg-[#6366f1]/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#818cf8]"/>
            <h3 className="text-white font-semibold">{aiStory.title}</h3>
            <span className="ml-auto text-xs text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded-full">AI</span>
          </div>
          <p className="text-[#94a3b8] text-sm leading-relaxed mb-3">{aiStory.content}</p>
          {aiStory.vocabulary?.length>0&&(
            <div className="flex flex-wrap gap-2">
              {aiStory.vocabulary.map((v,i)=>(
                <span key={i} className="px-2 py-1 bg-[#6366f1]/10 text-[#818cf8] rounded-lg text-xs"><b>{v.word}</b> — {v.meaning}</span>
              ))}
            </div>
          )}
          <button onClick={()=>setAiStory(null)} className="mt-3 text-xs text-[#475569] hover:text-white">Закрыть</button>
        </div>
      )}
    </div>
  );
}
