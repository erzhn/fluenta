'use client'
interface ActivityDay { date: string; minutes: number; xp: number }

export function StreakCalendar({ activity }: { activity: Record<string, ActivityDay> }) {
  const days: { date: string; level: number }[] = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const minutes = activity[iso]?.minutes ?? 0
    const level = minutes === 0 ? 0 : minutes < 10 ? 1 : minutes < 20 ? 2 : minutes < 40 ? 3 : 4
    days.push({ date: iso, level })
  }

  const colors = ['rgba(255,255,255,0.06)', '#312e81', '#4338ca', '#6366f1', '#a5b4fc']
  const labels = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс']

  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-semibold text-sm">Активность</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>меньше</span>
          {colors.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span>больше</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <div className="flex flex-col gap-1 mr-1">
            {labels.map((l, i) => (
              <div key={i} className="h-3 text-[10px] text-muted-foreground flex items-center w-4">{l}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div key={di}
                  title={`${day.date}: ${activity[day.date]?.minutes ?? 0} мин`}
                  className="w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer"
                  style={{ background: colors[day.level] }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
