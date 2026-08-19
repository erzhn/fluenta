/**
 * Дата в формате YYYY-MM-DD в ЛОКАЛЬНОМ времени пользователя.
 *
 * Раньше по всему приложению использовалось `new Date().toISOString().slice(0,10)`,
 * что даёт дату в UTC. Для пользователей восточнее UTC (например, Казахстан, UTC+5/+6)
 * занятия ранним утром попадали в «прошлый день» — ломался стрик, минуты за день и
 * недельные графики. Эти хелперы считают день по локальному времени, чтобы стрик,
 * daily_activity и дашборд были согласованы с реальным днём пользователя.
 */
export function localDate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Локальная дата со сдвигом на N дней (например, -1 — вчера). */
export function localDateOffset(days: number, from: Date = new Date()): string {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return localDate(d)
}
