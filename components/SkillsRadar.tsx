'use client'
interface Skill { name: string; value: number; max: number; color: string }

export function SkillsRadar({ skills }: { skills: Skill[] }) {
  const cx = 120, cy = 120, r = 90
  const n = skills.length

  function point(i: number, val: number) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    const ratio = val / 100
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    }
  }
  function axisPoint(i: number, ratio = 1) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) }
  }

  const dataPoints = skills.map((s, i) => point(i, s.value))
  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      <p className="text-white font-semibold text-sm mb-4">Навыки</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width="240" height="240" viewBox="0 0 240 240" className="shrink-0">
          {[0.25, 0.5, 0.75, 1].map(ratio => (
            <polygon key={ratio}
              points={skills.map((_, i) => { const p = axisPoint(i, ratio); return `${p.x},${p.y}` }).join(' ')}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}
          {skills.map((_, i) => {
            const p = axisPoint(i)
            return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          })}
          <polygon points={polygon} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" />
          {dataPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366f1" stroke="#0F172A" strokeWidth="2" />
          ))}
          {skills.map((s, i) => {
            const p = axisPoint(i, 1.18)
            return (
              <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fill="#94a3b8" fontFamily="Inter, sans-serif">
                {s.name}
              </text>
            )
          })}
        </svg>
        <div className="flex flex-col gap-3">
          {skills.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />
              <div>
                <p className="text-white text-xs font-medium">{s.name}</p>
                <p className="text-[hsl(var(--foreground-muted))] text-xs">{s.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
