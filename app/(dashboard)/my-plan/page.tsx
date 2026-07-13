'use client'
import { useState } from 'react'

interface Plan {
  week: number
  focus: string
  lessons: string[]
  vocabulary: string
  practice: string
  goal: string
}

export default function MyPlanPage() {
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<Plan[] | null>(null)
  const [goal, setGoal] = useState('general')
  const [level, setLevel] = useState('A1')
  const [hoursPerWeek, setHoursPerWeek] = useState(3)

  async function generatePlan() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/grammar-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: 'study plan',
          type: 'plan',
          customPrompt: `Create a 4-week English study plan for a student at level ${level} with goal: ${goal}.
Available time: ${hoursPerWeek} hours per week.

Return JSON array of 4 weeks:
[{
  "week": 1,
  "focus": "Main grammar/topic focus for the week",
  "lessons": ["Lesson 1 title", "Lesson 2 title", "Lesson 3 title"],
  "vocabulary": "10-15 specific vocabulary words to learn this week (comma-separated)",
  "practice": "Specific practice activity for this week",
  "goal": "What student should achieve by end of week"
}]

Make it specific to the goal (${goal}) and level (${level}). All lesson titles and descriptions should be in Russian. Be very specific and practical.`
        }),
      })
      const data = await res.json()
      const parsed = JSON.parse(data.explanation ?? data.examples ?? '[]')
      setPlan(Array.isArray(parsed) ? parsed : null)
    } catch {
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Мой план обучения</h1>
      <p className="text-muted-foreground text-sm mb-6">AI создаст персональный план на месяц</p>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
        <div>
          <label className="text-muted-foreground text-sm block mb-2">Текущий уровень</label>
          <div className="flex gap-2">
            {['A1','A2','B1','B2','C1'].map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  level === l ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
                }`}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-muted-foreground text-sm block mb-2">Цель</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'general', label: '🌍 Общий' },
              { id: 'travel', label: '✈️ Путешествия' },
              { id: 'business', label: '💼 Бизнес' },
              { id: 'ielts', label: '📝 IELTS' },
              { id: 'it', label: '💻 IT / Tech' },
              { id: 'conversation', label: '💬 Разговорный' },
            ].map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                className={`py-2 px-3 rounded-xl text-sm transition-all border ${
                  goal === g.id ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/[0.03] border-white/[0.06] text-muted-foreground hover:text-white'
                }`}>{g.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-muted-foreground text-sm block mb-2">Часов в неделю: <span className="text-white font-bold">{hoursPerWeek}</span></label>
          <input type="range" min={1} max={10} value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))}
            className="w-full accent-[#6366f1]" />
        </div>
        <button onClick={generatePlan} disabled={loading}
          className="w-full py-3 bg-primary hover:bg-[#5558e8] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
          {loading ? '⏳ Создаю план...' : '✨ Создать план с AI'}
        </button>
      </div>

      {plan && (
        <div className="space-y-4">
          {plan.map((week) => (
            <div key={week.week} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                  {week.week}
                </span>
                <p className="text-white font-semibold">{week.focus}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Уроки</p>
                  {week.lessons?.map((l, i) => <p key={i} className="text-muted-foreground">· {l}</p>)}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Практика</p>
                  <p className="text-muted-foreground">{week.practice}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Цель недели</p>
                  <p className="text-primary">✓ {week.goal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
