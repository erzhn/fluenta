'use client'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

const TOPICS_BY_LEVEL: Record<string, string[]> = {
  A1: ['daily life', 'food', 'colors', 'numbers', 'family', 'weather', 'animals', 'body'],
  A2: ['travel', 'shopping', 'work', 'hobbies', 'sports', 'health', 'city', 'school'],
  B1: ['environment', 'technology', 'culture', 'emotions', 'business', 'media', 'politics', 'science'],
  B2: ['economy', 'philosophy', 'literature', 'psychology', 'engineering', 'law', 'medicine', 'art'],
  C1: ['linguistics', 'geopolitics', 'epistemology', 'rhetoric', 'neuroscience', 'ethics', 'sociology'],
}

const DICTATION_WORDS: Record<string, { word: string; hint?: string }[]> = {
  A1: [
    { word: 'apple' }, { word: 'house' }, { word: 'water' }, { word: 'family' },
    { word: 'school' }, { word: 'book' }, { word: 'friend' }, { word: 'happy' },
    { word: 'morning' }, { word: 'telephone' }, { word: 'beautiful' }, { word: 'together' },
    { word: 'yesterday' }, { word: 'important' }, { word: 'because' },
  ],
  A2: [
    { word: 'comfortable' }, { word: 'interesting' }, { word: 'different' },
    { word: 'government' }, { word: 'environment' }, { word: 'experience' },
    { word: 'necessary' }, { word: 'opportunity' }, { word: 'definitely' },
    { word: 'restaurant' }, { word: 'information' }, { word: 'understand' },
    { word: 'communication' }, { word: 'entertainment' }, { word: 'relationship' },
  ],
  B1: [
    { word: 'achievement' }, { word: 'approximately' }, { word: 'circumstances' },
    { word: 'consequently' }, { word: 'contemporary' }, { word: 'controversy' },
    { word: 'enthusiasm' }, { word: 'exaggerate' }, { word: 'extraordinary' },
    { word: 'particularly' }, { word: 'phenomenon' }, { word: 'pronunciation' },
    { word: 'sophisticated' }, { word: 'simultaneously' }, { word: 'unconscious' },
  ],
  B2: [
    { word: 'accommodation' }, { word: 'acknowledgement' }, { word: 'conscientious' },
    { word: 'entrepreneurial' }, { word: 'miscellaneous' }, { word: 'perseverance' },
    { word: 'bureaucracy' }, { word: 'catastrophe' }, { word: 'surveillance' },
    { word: 'meteorological' }, { word: 'psychological' }, { word: 'unprecedented' },
    { word: 'pharmaceutical' }, { word: 'choreography' }, { word: 'reconnaissance' },
  ],
  C1: [
    { word: 'idiosyncratic' }, { word: 'onomatopoeia' }, { word: 'ephemeral' },
    { word: 'surreptitious' }, { word: 'perspicacious' }, { word: 'magnanimous' },
    { word: 'serendipitous' }, { word: 'mellifluous' }, { word: 'ubiquitous' },
    { word: 'labyrinthine' }, { word: 'quintessential' }, { word: 'loquacious' },
    { word: 'perfunctory' }, { word: 'obsequious' }, { word: 'recalcitrant' },
  ],
}

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
interface Result { word: string; userAnswer: string; correct: boolean }

export default function DictationPage() {
  const [level, setLevel] = useState<Level>('A1')
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiTopic, setAiTopic] = useState('')
  const [currentTopic, setCurrentTopic] = useState('')
  const [aiWordList, setAiWordList] = useState<string[]>([])
  const [usingAI, setUsingAI] = useState(false)
  async function generateWords(topic?: string) {
    const t = topic || aiTopic || 'common vocabulary'
    const data = await generate<{words:string[]}>('dictation_words', t, level)
    if (data?.words?.length) { setAiWordList(data.words); setUsingAI(true); setCurrentIndex(0); setStarted(false); setUserInput('') }
  }

  useEffect(() => {
    const topics = TOPICS_BY_LEVEL[level] || TOPICS_BY_LEVEL['B1']
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    setCurrentTopic(randomTopic)
    generateWords(randomTopic)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])
  const [results, setResults] = useState<Result[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentWordList = usingAI && aiWordList.length > 0
    ? aiWordList.map(w=>({word:w}))
    : (DICTATION_WORDS[level] ?? [])
  const ROUND_SIZE = 10
  const sessionWords = currentWordList.slice(0, ROUND_SIZE)
  const current = sessionWords[currentIndex]

  function speak(text: string, slow = false) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = slow ? 0.6 : 0.9
    utter.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Female'))
      ?? voices.find(v => v.lang === 'en-US')
    if (preferred) utter.voice = preferred
    setIsPlaying(true)
    utter.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utter)
  }

  function handlePlay() {
    setPlayCount(c => c + 1)
    speak(current.word)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handlePlaySlow() { speak(current.word, true) }

  function handleCheck() {
    const correct = userInput.trim().toLowerCase() === current.word.toLowerCase()
    setResults(r => [...r, { word: current.word, userAnswer: userInput.trim(), correct }])
    setShowAnswer(true)
  }

  function handleNext() {
    if (currentIndex + 1 >= sessionWords.length) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setUserInput('')
      setShowAnswer(false)
      setPlayCount(0)
      setTimeout(() => {
        speak(sessionWords[currentIndex + 1].word)
        inputRef.current?.focus()
      }, 500)
    }
  }

  function handleStart() {
    setStarted(true)
    setCurrentIndex(0)
    setResults([])
    setUserInput('')
    setShowAnswer(false)
    setFinished(false)
    setPlayCount(0)
    setTimeout(() => {
      speak(sessionWords[0].word)
      inputRef.current?.focus()
    }, 300)
  }

  function handleRestart() {
    setStarted(false)
    setFinished(false)
    setResults([])
    setCurrentIndex(0)
    setUserInput('')
    setShowAnswer(false)
  }

  const score = results.filter(r => r.correct).length

  if (finished) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8"><span className="gradient-text">Диктант</span> завершён</h1>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6 text-center">
          <div className="text-5xl font-bold mb-2"
            style={{ color: score >= 8 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444' }}>
            {score}/{sessionWords.length}
          </div>
          <p className="text-muted-foreground">
            {score >= 8 ? '🎉 Отлично! Ты великолепно справился!' :
             score >= 5 ? '👍 Хороший результат, продолжай практиковаться!' :
             '💪 Не сдавайся, повтори эти слова ещё раз!'}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
              r.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
            }`}>
              <span className="text-white font-medium">{r.word}</span>
              <div className="flex items-center gap-3">
                {!r.correct && (
                  <span className="text-red-400 text-sm line-through">{r.userAnswer || '(пусто)'}</span>
                )}
                <span className={r.correct ? 'text-green-400' : 'text-muted-foreground'}>
                  {r.correct ? '✓' : r.word}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={handleRestart}
            className="flex-1 py-3 bg-primary hover:bg-[#5558e8] text-white font-medium rounded-xl transition-colors">
            Попробовать снова
          </button>
          <button onClick={() => {
            const levels: Level[] = ['A1','A2','B1','B2','C1']
            const idx = levels.indexOf(level)
            setLevel(levels[Math.min(idx + 1, 4)])
            handleRestart()
          }}
            className="flex-1 py-3 bg-white/[0.06] hover:bg-white/10 text-white font-medium rounded-xl transition-colors">
            Следующий уровень →
          </button>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2"><span className="gradient-text">Диктант</span></h1>
        <p className="text-muted-foreground mb-8">Прослушай слово и напиши его правильно</p>

        <div className="grid grid-cols-5 gap-2 mb-8">
          {(['A1','A2','B1','B2','C1'] as Level[]).map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`py-3 rounded-xl font-semibold transition-all border ${
                level === l
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
              }`}>
              {l}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-3">Как это работает</h3>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>🔊 Нажми &quot;Воспроизвести&quot; — AI произнесёт слово</p>
            <p>✍️ Напиши что услышал в поле ввода</p>
            <p>✓ Нажми &quot;Проверить&quot; для проверки</p>
            <p>🐢 Можно прослушать медленно если не расслышал</p>
          </div>
        </div>

        {currentTopic && (
          <p className="text-muted-foreground text-xs mb-3">
            Тема: <span className="text-primary">{currentTopic}</span>
          </p>
        )}

        <div className="mb-4 p-3 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-xl">
          <p className="text-xs text-[#818cf8] font-medium mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3"/>AI слова {usingAI && `· ${aiWordList.length} слов ✓`}
            {aiLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
          </p>
          {aiLoading && (
            <div className="space-y-2 mb-2">
              {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />)}
            </div>
          )}
          <div className="flex gap-2">
            <input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="science, business..." className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#475569] outline-none min-h-[44px]"/>
            <button onClick={() => { setCurrentTopic(aiTopic || currentTopic); generateWords() }} disabled={aiLoading} className="px-3 py-2 bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white rounded-lg text-xs min-h-[44px]">
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5"/>}
            </button>
            {usingAI && <button onClick={() => {setUsingAI(false); setAiWordList([])}} className="px-2 py-2 text-[#64748b] text-xs min-h-[44px]">✕</button>}
          </div>
        </div>

        <button onClick={handleStart}
          className="btn-glow w-full py-4 bg-primary hover:bg-[#5558e8] text-white font-semibold rounded-2xl text-lg transition-colors">
          Начать диктант ({ROUND_SIZE} слов)
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Диктант · {level}</h1>
        <span className="text-muted-foreground text-sm">{currentIndex + 1} / {sessionWords.length}</span>
      </div>

      <div className="h-1.5 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / sessionWords.length) * 100}%` }} />
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 mb-6 text-center">
        <div className="flex gap-3 justify-center mb-8">
          <button onClick={handlePlay} disabled={isPlaying}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-[#5558e8] disabled:opacity-50 text-white font-medium rounded-xl transition-all">
            {isPlaying ? (
              <span className="flex gap-1">
                <span className="w-1 h-4 bg-white rounded animate-bounce" style={{animationDelay:'0ms'}}/>
                <span className="w-1 h-4 bg-white rounded animate-bounce" style={{animationDelay:'150ms'}}/>
                <span className="w-1 h-4 bg-white rounded animate-bounce" style={{animationDelay:'300ms'}}/>
              </span>
            ) : '🔊'}
            Воспроизвести
            {playCount > 0 && <span className="text-white/60 text-xs">×{playCount}</span>}
          </button>
          <button onClick={handlePlaySlow} disabled={isPlaying}
            className="flex items-center gap-2 px-4 py-3 bg-white/[0.06] hover:bg-white/10 text-muted-foreground font-medium rounded-xl transition-all border border-white/10">
            🐢 Медленно
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={e => !showAnswer && setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !showAnswer && userInput && handleCheck()}
          disabled={showAnswer}
          placeholder="Напиши слово здесь..."
          className={`w-full text-center text-xl font-medium bg-white/[0.06] border rounded-xl px-4 py-4
            outline-none transition-all placeholder:text-[#334155] text-white
            ${showAnswer
              ? results[results.length-1]?.correct
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-red-500/50 bg-red-500/10'
              : 'border-white/10 focus:border-primary/50'
            }`}
        />

        {showAnswer && (
          <div className="mt-4">
            {results[results.length-1]?.correct ? (
              <p className="text-green-400 font-semibold text-lg">✓ Правильно!</p>
            ) : (
              <div>
                <p className="text-red-400 font-semibold text-lg mb-1">✗ Неправильно</p>
                <p className="text-white text-lg">Правильно: <span className="text-primary font-bold">{current.word}</span></p>
              </div>
            )}
          </div>
        )}
      </div>

      {!showAnswer ? (
        <button onClick={handleCheck} disabled={!userInput.trim()}
          className="w-full py-4 bg-primary hover:bg-[#5558e8] disabled:opacity-40 text-white font-semibold rounded-2xl transition-colors">
          Проверить
        </button>
      ) : (
        <button onClick={handleNext}
          className="w-full py-4 bg-white/[0.06] hover:bg-white/10 text-white font-semibold rounded-2xl transition-colors">
          {currentIndex + 1 >= sessionWords.length ? 'Посмотреть результаты' : 'Следующее слово →'}
        </button>
      )}

      {results.length > 0 && (
        <div className="flex gap-1.5 mt-4 justify-center flex-wrap">
          {results.map((r, i) => (
            <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
              ${r.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {r.correct ? '✓' : '✗'}
            </div>
          ))}
          {Array.from({ length: sessionWords.length - results.length }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-white/[0.06]" />
          ))}
        </div>
      )}
    </div>
  );
}