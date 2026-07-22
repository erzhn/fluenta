'use client'
import { useEffect, useState } from 'react'
import { Sparkles, Loader2, Clock, Star, Flame, Target, BookOpen, Lightbulb, type LucideIcon } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'
import { supabase } from '@/lib/supabase'

interface DayData {
  date: string
  label: string
  minutes: number
  xp: number
}

interface WeekData {
  days: DayData[]
  totalMinutes: number
  totalXP: number
  activeDays: number
  bestDay: string
}

export default function WeeklySummaryPage() {
  const [data, setData] = useState<WeekData | null>(null)
  const [loading, setLoading] = useState(true)
  const { generate, loading: aiLoading } = useAIGenerate()
  const [aiInsight, setAiInsight] = useState<{analysis:string,tip:string,emoji:string}|null>(null)

  async function getInsight() {
    if (!data) return
    const ctx = `minutes:${data.totalMinutes},xp:${data.totalXP},activeDays:${data.activeDays},bestDay:${data.bestDay}`
    const result = await generate<typeof aiInsight>('weekly_analysis', ctx)
    setAiInsight(result)
  }

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const dayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

      // Build the 7-day date array
      const dateMap: Record<string, DayData> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const iso = d.toISOString().slice(0, 10)
        dateMap[iso] = { date: iso, label: dayLabels[d.getDay()], minutes: 0, xp: 0 }
      }

      if (session?.user) {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 6)
        const { data: rows } = await supabase
          .from('daily_activity')
          .select('date,minutes,xp_earned')
          .eq('user_id', session.user.id)
          .gte('date', weekAgo.toISOString().slice(0, 10))

        rows?.forEach(row => {
          if (dateMap[row.date]) {
            dateMap[row.date].minutes = row.minutes ?? 0
            dateMap[row.date].xp = row.xp_earned ?? 0
          }
        })
      }

      const days = Object.values(dateMap)
      let totalMinutes = 0, totalXP = 0, activeDays = 0, bestDay = '', maxMinutes = 0
      days.forEach(d => {
        totalMinutes += d.minutes
        totalXP += d.xp
        if (d.minutes > 0) activeDays++
        if (d.minutes > maxMinutes) { maxMinutes = d.minutes; bestDay = d.label }
      })

      setData({ days, totalMinutes, totalXP, activeDays, bestDay: bestDay || 'Нет данных' })
      setLoading(false)
    })()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-[#818cf8]" />
    </div>
  )
  if (!data) return null

  const maxMin = Math.max(...data.days.map(d => d.minutes), 1)

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2"><span className="gradient-text">Итоги недели</span></h1>
      <p className="text-muted-foreground mb-8">
        {new Date(data.days[0].date).toLocaleDateString('ru', { day: 'numeric', month: 'long' })} —{' '}
        {new Date(data.days[6].date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {([
          { label: 'Минут', value: data.totalMinutes, icon: Clock, color: '#818cf8' },
          { label: 'XP заработано', value: data.totalXP, icon: Star, color: '#f59e0b' },
          { label: 'Активных дней', value: data.activeDays, icon: Flame, color: '#ef4444' },
        ] as { label: string; value: number; icon: LucideIcon; color: string }[]).map(s => (
          <div key={s.label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
            <s.icon className="w-6 h-6 mx-auto mb-1.5" strokeWidth={1.75} style={{ color: s.color }} />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-white font-semibold mb-5">Активность по дням</p>
        <div className="flex items-end gap-3 h-32">
          {data.days.map(day => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '96px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${Math.max(4, (day.minutes / maxMin) * 96)}px`,
                    background: day.minutes > 0 ? '#6366f1' : 'rgba(255,255,255,0.06)',
                  }}
                  title={`${day.minutes} мин · ${day.xp} XP`}
                />
              </div>
              <span className="text-muted-foreground text-xs">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-primary/20 rounded-2xl p-5">
        <p className="text-white font-semibold mb-2 flex items-center gap-1.5">
          {data.totalMinutes > 0
            ? <><Target className="w-4 h-4 text-primary" strokeWidth={2} /> Лучший день недели: {data.bestDay}</>
            : <><BookOpen className="w-4 h-4 text-primary" strokeWidth={1.75} /> Начни заниматься!</>}
        </p>
        <p className="text-muted-foreground text-sm">
          {data.totalMinutes >= 140
            ? 'Отличная неделя! Ты превысил цель в 20 мин/день.'
            : data.totalMinutes >= 60
            ? `Хорошее начало! Ещё ${140 - data.totalMinutes} мин для выполнения цели недели.`
            : 'Попробуй заниматься хотя бы 20 минут каждый день.'}
        </p>
      </div>

      <div className="mt-4 bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#818cf8]"/>AI анализ недели</p>
          {!aiInsight&&<button onClick={getInsight} disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#818cf8] rounded-xl text-xs font-medium min-h-[36px] disabled:opacity-50">
            {aiLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<Sparkles className="w-3 h-3"/>}{aiLoading?'Анализирую...':'Получить анализ'}
          </button>}
        </div>
        {aiInsight?(
          <div className="space-y-2">
            <p className="text-sm text-white/80">{aiInsight.analysis}</p>
            <div className="p-3 bg-[#6366f1]/5 rounded-xl border border-[#6366f1]/10">
              <p className="text-xs text-white/70 flex items-start gap-1.5"><Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} /> {aiInsight.tip}</p>
            </div>
            <button onClick={()=>setAiInsight(null)} className="text-xs text-[#64748b] hover:text-white">Обновить</button>
          </div>
        ):<p className="text-sm text-[#64748b]">Получи персональный анализ своей недели от AI</p>}
      </div>
    </div>
  );
}
