'use client'
import { useState, useRef } from 'react'
import { Check, Rocket, ThumbsUp, BookOpen, Turtle } from 'lucide-react'

const TEXTS = [
  {
    title: "The Power of Habits",
    level: 'B1',
    wordCount: 120,
    text: "Habits are powerful forces in our lives. They shape our daily routines, influence our decisions, and ultimately define who we are. Scientists have discovered that habits work through a neurological loop consisting of three parts: a cue, a routine, and a reward. The cue triggers the brain to go into automatic mode. The routine is the behavior itself. The reward helps the brain decide if this loop is worth remembering for the future. Understanding this loop is the key to changing bad habits and building good ones. When you want to change a habit, you don't actually eliminate it — you replace the routine while keeping the same cue and reward. This insight has helped millions of people transform their lives, from overcoming addiction to becoming more productive at work.",
  },
  {
    title: "Artificial Intelligence Today",
    level: 'B2',
    wordCount: 130,
    text: "Artificial intelligence is no longer a concept confined to science fiction. Today, AI systems make recommendations on what movies to watch, detect fraudulent bank transactions, assist doctors in diagnosing diseases, and even write software code. The technology has advanced at an extraordinary pace over the past decade, largely due to improvements in machine learning algorithms and the availability of massive datasets. However, this rapid progress raises important questions about the future of work, privacy, and human autonomy. While AI can outperform humans in specific narrow tasks, it still lacks the general intelligence, emotional understanding, and common sense that humans possess. The challenge for society is to harness the benefits of AI while carefully managing its risks and ensuring that its rewards are distributed fairly across all segments of the population.",
  },
  {
    title: "Ocean Exploration",
    level: 'A2',
    wordCount: 100,
    text: "The ocean covers more than seventy percent of our planet, yet we have explored less than twenty percent of it. The deep sea remains one of the greatest mysteries on Earth. Scientists believe that millions of species live in the ocean that we have not yet discovered. The pressure at the bottom of the ocean is enormous — about one thousand times greater than at the surface. Special submarines called submersibles allow researchers to explore these dark depths. In recent years, scientists have found fascinating creatures living near hydrothermal vents, where extremely hot water comes out of the ocean floor. These discoveries suggest that life can exist in conditions we once thought were impossible.",
  },
  {
    title: "The Science of Sleep",
    level: 'B1',
    wordCount: 115,
    text: "Sleep is not merely a period of rest but an active process essential for physical and mental health. During sleep, the brain consolidates memories, processes emotions, and clears out toxic waste products that accumulate during waking hours. Adults typically need between seven and nine hours of sleep per night, yet modern lifestyles often make this difficult to achieve. Chronic sleep deprivation has been linked to serious health conditions including obesity, diabetes, cardiovascular disease, and depression. The blue light emitted by smartphones and computers suppresses melatonin production, making it harder to fall asleep. Sleep researchers recommend establishing a consistent sleep schedule, creating a dark and cool sleeping environment, and avoiding screens for at least one hour before bedtime to improve sleep quality significantly.",
  },
  {
    title: "Urban Farming",
    level: 'B1',
    wordCount: 108,
    text: "As cities continue to grow and food security becomes an increasing concern, urban farming is emerging as a creative solution to multiple challenges simultaneously. Rooftop gardens, vertical farms, and community plots are transforming unused urban spaces into productive growing areas. These initiatives not only produce fresh vegetables and fruits but also reduce the carbon footprint associated with transporting food from rural areas. Urban farms can also help manage stormwater runoff, reduce the urban heat island effect, and create green spaces that improve residents' mental health. Some cities are actively encouraging urban agriculture through zoning changes and subsidies. Innovative technologies such as hydroponics and LED lighting allow crops to grow in spaces that receive little natural sunlight, making urban farming viable even in dense city centers.",
  },
]

const WPM_NORMS: Record<string, number> = {
  A1: 80, A2: 120, B1: 180, B2: 230, C1: 280,
}

type Phase = 'intro' | 'reading' | 'result'

export default function ReadingSpeedPage() {
  const [textIdx, setTextIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('intro')
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const text = TEXTS[textIdx]

  function startReading() {
    setPhase('reading')
    const t = Date.now()
    setStartTime(t)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - t) / 1000))
    }, 1000)
  }

  function finishReading() {
    if (timerRef.current) clearInterval(timerRef.current)
    const minutes = (Date.now() - startTime) / 60000
    setWpm(Math.round(text.wordCount / minutes))
    setPhase('result')
  }

  function nextText() {
    setTextIdx(i => (i + 1) % TEXTS.length)
    setPhase('intro')
    setElapsed(0)
    setWpm(0)
  }

  const norm = WPM_NORMS[text.level] ?? 180
  const percentage = Math.min(150, Math.round((wpm / norm) * 100))

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2"><span className="gradient-text">Скорость чтения</span></h1>
      <p className="text-muted-foreground mb-6">Читай текст и нажми &quot;Готово&quot; когда закончишь</p>

      {phase === 'intro' && (
        <>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold">{text.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{text.level}</span>
            </div>
            <p className="text-muted-foreground text-sm">{text.wordCount} слов · Норма для {text.level}: {norm} слов/мин</p>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {TEXTS.map((t, i) => (
              <button key={i} onClick={() => setTextIdx(i)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all border ${
                  i === textIdx ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground'
                }`}>
                {t.level} · {t.title.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          <button onClick={startReading}
            className="btn-glow w-full py-4 bg-primary hover:bg-[#5558e8] text-white font-semibold rounded-2xl text-lg transition-colors">
            Начать чтение
          </button>
        </>
      )}

      {phase === 'reading' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary font-mono text-lg font-bold">{elapsed}с</span>
            <span className="text-muted-foreground text-sm">{text.wordCount} слов</span>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 leading-relaxed">
            <h2 className="text-white font-bold text-xl mb-4">{text.title}</h2>
            <p className="text-[#e2e8f0] text-lg leading-8">{text.text}</p>
          </div>
          <button onClick={finishReading}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-2xl text-lg transition-colors inline-flex items-center justify-center gap-2">
            <Check className="w-5 h-5" strokeWidth={2.5} /> Прочитал
          </button>
        </>
      )}

      {phase === 'result' && (
        <>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 mb-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Твой результат</p>
            <p className="text-6xl font-bold mb-2"
              style={{ color: percentage >= 100 ? '#10b981' : percentage >= 70 ? '#f59e0b' : '#ef4444' }}>
              {wpm}
            </p>
            <p className="text-muted-foreground mb-6">слов в минуту</p>

            <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, percentage)}%`,
                  background: percentage >= 100 ? '#10b981' : percentage >= 70 ? '#f59e0b' : '#ef4444',
                }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>Норма {norm} сл/мин</span>
              <span>{norm * 1.5}+</span>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/[0.03] text-left">
              <p className="text-white font-semibold mb-1 inline-flex items-center gap-1.5">
                {percentage >= 120 ? <><Rocket className="w-4 h-4" strokeWidth={1.75} /> Отлично! Ты читаешь быстрее нормы!</> :
                 percentage >= 90 ? <><ThumbsUp className="w-4 h-4" strokeWidth={1.75} /> Хороший результат, близко к норме</> :
                 percentage >= 60 ? <><BookOpen className="w-4 h-4" strokeWidth={1.75} /> Продолжай практиковаться</> :
                 <><Turtle className="w-4 h-4" strokeWidth={1.75} /> Попробуй читать чуть быстрее</>}
              </p>
              <p className="text-muted-foreground text-sm">
                Норма для уровня {text.level}: {norm} слов/мин.
                {percentage < 100 ? ` Тебе нужно читать на ${norm - wpm} слов/мин быстрее.` : ' Ты достиг нормы!'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={nextText}
              className="flex-1 py-3 bg-primary hover:bg-[#5558e8] text-white font-semibold rounded-xl transition-colors">
              Следующий текст
            </button>
            <button onClick={() => setPhase('intro')}
              className="px-5 py-3 bg-white/[0.06] hover:bg-white/10 text-muted-foreground rounded-xl transition-colors border border-white/10">
              Повторить
            </button>
          </div>
        </>
      )}
    </div>
  );
}
