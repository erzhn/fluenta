'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

interface Sentence {
  words: string[]
  translation: string
  level: string
}

const SENTENCES: Sentence[] = [
  { words: ['I', 'am', 'a', 'student'], translation: 'Я студент', level: 'A1' },
  { words: ['She', 'likes', 'coffee'], translation: 'Она любит кофе', level: 'A1' },
  { words: ['We', 'live', 'in', 'a', 'big', 'city'], translation: 'Мы живём в большом городе', level: 'A1' },
  { words: ['He', 'plays', 'football', 'every', 'day'], translation: 'Он играет в футбол каждый день', level: 'A1' },
  { words: ['The', 'cat', 'is', 'on', 'the', 'table'], translation: 'Кошка на столе', level: 'A1' },
  { words: ['I', 'do', 'not', 'speak', 'French'], translation: 'Я не говорю по-французски', level: 'A1' },
  { words: ['What', 'is', 'your', 'name'], translation: 'Как тебя зовут?', level: 'A1' },
  { words: ['They', 'are', 'very', 'happy', 'today'], translation: 'Они очень счастливы сегодня', level: 'A1' },
  { words: ['I', 'have', 'been', 'waiting', 'for', 'an', 'hour'], translation: 'Я жду уже час', level: 'A2' },
  { words: ['She', 'has', 'never', 'visited', 'London'], translation: 'Она никогда не бывала в Лондоне', level: 'A2' },
  { words: ['Could', 'you', 'help', 'me', 'please'], translation: 'Не могли бы вы мне помочь?', level: 'A2' },
  { words: ['He', 'was', 'reading', 'when', 'I', 'arrived'], translation: 'Он читал, когда я пришёл', level: 'A2' },
  { words: ['I', 'would', 'like', 'to', 'order', 'a', 'coffee'], translation: 'Я хотел бы заказать кофе', level: 'A2' },
  { words: ['If', 'I', 'had', 'more', 'time', 'I', 'would', 'travel'], translation: 'Если бы у меня было больше времени, я бы путешествовал', level: 'B1' },
  { words: ['The', 'report', 'was', 'written', 'by', 'the', 'manager'], translation: 'Отчёт был написан менеджером', level: 'B1' },
  { words: ['Despite', 'the', 'rain', 'we', 'enjoyed', 'the', 'trip'], translation: 'Несмотря на дождь, мы получили удовольствие от поездки', level: 'B1' },
  { words: ['She', 'suggested', 'that', 'we', 'leave', 'early'], translation: 'Она предложила уйти пораньше', level: 'B1' },
  { words: ['Had', 'I', 'known', 'I', 'would', 'have', 'acted', 'differently'], translation: 'Знай я это, поступил бы иначе', level: 'B2' },
  { words: ['The', 'more', 'you', 'practice', 'the', 'better', 'you', 'become'], translation: 'Чем больше практикуешься, тем лучше становишься', level: 'B2' },
  { words: ['Not', 'only', 'did', 'he', 'win', 'but', 'he', 'broke', 'the', 'record'], translation: 'Он не только победил, но и побил рекорд', level: 'B2' },
  { words: ['Seldom', 'have', 'I', 'encountered', 'such', 'remarkable', 'talent'], translation: 'Редко я встречал такой замечательный талант', level: 'C1' },
  { words: ['Were', 'it', 'not', 'for', 'your', 'help', 'I', 'would', 'have', 'failed'], translation: 'Если бы не твоя помощь, я бы провалился', level: 'C1' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export default function SentenceBuilderPage() {
  const [level, setLevel] = useState<Level>('A1')
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiTopic, setAiTopic] = useState('')
  const [aiQueue, setAiQueue] = useState<Sentence[]>([])
  const SENTENCE_TOPICS = ['daily life', 'travel', 'technology', 'nature', 'work', 'hobbies', 'food', 'family']
  async function generateSentences(topic?: string) {
    const t = topic || aiTopic || SENTENCE_TOPICS[Math.floor(Math.random() * SENTENCE_TOPICS.length)]
    const data = await generate<{sentences:Sentence[]}>('sentences', t, level)
    if (data?.sentences?.length) {
      setAiQueue(data.sentences.map(s=>({...s,level})))
    }
  }

  useEffect(() => {
    generateSentences()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])
  const [shuffledSentences] = useState(() => shuffle(SENTENCES))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [available, setAvailable] = useState<{word: string; id: number}[]>([])
  const [selected, setSelected] = useState<{word: string; id: number}[]>([])
  const [checked, setChecked] = useState<boolean | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const levelSentences = shuffledSentences.filter(s => s.level === level)
  const current = levelSentences[currentIdx % Math.max(levelSentences.length, 1)]

  useEffect(() => {
    if (current) resetSentence()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, level])

  function resetSentence() {
    if (!current) return
    const shuffled = shuffle(current.words).map((w, i) => ({ word: w, id: i }))
    setAvailable(shuffled)
    setSelected([])
    setChecked(null)
  }

  function selectWord(item: {word: string; id: number}) {
    if (checked !== null) return
    setAvailable(a => a.filter(w => w.id !== item.id))
    setSelected(s => [...s, item])
  }

  function deselectWord(item: {word: string; id: number}) {
    if (checked !== null) return
    setSelected(s => s.filter(w => w.id !== item.id))
    setAvailable(a => [...a, item])
  }

  function handleCheck() {
    if (!current) return
    const answer = selected.map(w => w.word).join(' ')
    const correct = answer === current.words.join(' ')
    setChecked(correct)
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  function handleNext() { setCurrentIdx(i => i + 1) }

  if (!current) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto text-center py-20">
        <p className="text-2xl mb-3">✅</p>
        <p className="text-white font-semibold mb-2">Все предложения для уровня {level} пройдены!</p>
        <button onClick={() => setCurrentIdx(0)}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium mt-4">
          Начать заново
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white"><span className="gradient-text">Собери предложение</span></h1>
          <p className="text-muted-foreground text-sm mt-1">Нажимай на слова в правильном порядке</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{score.correct}/{score.total}</p>
          <p className="text-muted-foreground text-xs">правильно</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['A1','A2','B1','B2','C1'] as Level[]).map(l => (
          <button key={l} onClick={() => { setLevel(l); setCurrentIdx(0) }}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              level === l ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Переведи на английский:</p>
        <p className="text-white text-xl font-semibold">{current.translation}</p>
      </div>

      <div className={`min-h-[72px] border-2 border-dashed rounded-2xl p-4 mb-4 flex flex-wrap gap-2 items-center transition-colors ${
        checked === null
          ? 'border-white/10 bg-white/[0.02]'
          : checked
          ? 'border-green-500/40 bg-green-500/5'
          : 'border-red-500/40 bg-red-500/5'
      }`}>
        {selected.length === 0 && (
          <p className="text-[#334155] text-sm">Нажимай на слова снизу...</p>
        )}
        {selected.map(item => (
          <button key={item.id}
            onClick={() => deselectWord(item)}
            className="px-4 py-2 bg-primary/20 border border-primary/40 text-white
              rounded-xl text-sm font-medium hover:bg-primary/30 transition-all active:scale-95">
            {item.word}
          </button>
        ))}
      </div>

      {checked !== null && (
        <div className={`rounded-xl p-3 mb-4 text-center ${
          checked ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {checked ? (
            <p className="text-green-400 font-semibold">✓ Правильно!</p>
          ) : (
            <>
              <p className="text-red-400 font-semibold mb-1">✗ Неправильно</p>
              <p className="text-muted-foreground text-sm">
                Правильно: <span className="text-white font-medium">{current.words.join(' ')}</span>
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
        {available.map(item => (
          <button key={item.id}
            onClick={() => selectWord(item)}
            className="px-4 py-2 bg-white/[0.06] border border-white/10 text-white
              rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
            {item.word}
          </button>
        ))}
      </div>

      <div className="mb-4 p-3 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-xl">
        <p className="text-xs text-[#818cf8] font-medium mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3"/>AI предложения</p>
        <div className="flex gap-2">
          <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="Тема..." className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#475569] outline-none min-h-[44px]"/>
          <button onClick={() => generateSentences()} disabled={aiLoading}
            className="px-3 py-2 bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white rounded-lg text-xs font-medium min-h-[44px]">
            {aiLoading?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Sparkles className="w-3.5 h-3.5"/>}
          </button>
          {aiQueue.length>0&&<button onClick={()=>{const s=aiQueue[0];setAiQueue(q=>q.slice(1));setAvailable(shuffle(s.words.map((w,id)=>({word:w,id}))));setSelected([]);setChecked(null)}}
            className="px-3 py-2 bg-white/[0.06] border border-white/10 text-white rounded-lg text-xs min-h-[44px]">
            ▶ AI ({aiQueue.length})
          </button>}
        </div>
      </div>

      <div className="flex gap-3">
        {checked === null ? (
          <>
            <button onClick={resetSentence}
              className="px-5 py-3 bg-white/[0.06] hover:bg-white/10 text-muted-foreground font-medium rounded-xl transition-colors border border-white/10">
              ↺ Сброс
            </button>
            <button onClick={handleCheck} disabled={selected.length === 0}
              className="flex-1 py-3 bg-primary hover:bg-[#5558e8] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors">
              Проверить
            </button>
          </>
        ) : (
          <button onClick={handleNext}
            className="flex-1 py-3 bg-primary hover:bg-[#5558e8] text-white font-semibold rounded-xl transition-colors">
            Следующее предложение →
          </button>
        )}
          </div>
    </div>
  );
}
