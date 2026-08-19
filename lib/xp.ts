import { supabase } from './supabase'
import { localDate, localDateOffset } from './date'

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  PERFECT_SCORE: 25,
  DAILY_STREAK: 10,
  AI_CONVERSATION: 20,
  FLASHCARD_SESSION: 15,
  PRONUNCIATION: 20,
  DAILY_GOAL: 30,
  WRITING_CHECK: 15,
  EXERCISE_CORRECT: 5,
} as const

/** Максимум «практического» XP за один день (бонус за стрик — сверх этого). */
export const DAILY_XP_CAP = 500

/**
 * Начисляет XP, обновляет стрик и логирует активность за день.
 * @param amount  сколько XP добавить
 * @param minutes сколько минут засчитать в daily_activity (по умолчанию 10 —
 *                для «крупных» действий: урок, сессия. Для мелких пунктов
 *                (одно упражнение, одна попытка) передавай 1–3, чтобы не
 *                раздувать статистику минут.)
 */
export async function awardXP(amount: number, minutes = 10): Promise<number> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return 0

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, last_active')
    .eq('id', session.user.id)
    .single()

  // Use defaults if profile row doesn't exist yet
  const currentXP: number = (profile?.xp as number) ?? 0
  const currentStreak: number = (profile?.streak as number) ?? 0
  const lastActive: string | null = (profile?.last_active as string) ?? null

  const today = localDate()
  const isNewDay = lastActive !== today
  const streakBonus = isNewDay ? XP_REWARDS.DAILY_STREAK : 0

  const yesterday = localDateOffset(-1)
  const newStreak = isNewDay
    ? (lastActive === yesterday ? currentStreak + 1 : 1)
    : currentStreak

  // Дневной кап на «практический» XP — защита от фарма на повторных действиях.
  // Бонус за стрик (раз в день) начисляется сверху и капом не режется.
  const { data: existing } = await supabase.from('daily_activity')
    .select('minutes,xp_earned')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .maybeSingle()
  const earnedToday: number = (existing?.xp_earned as number) ?? 0
  const room = Math.max(0, DAILY_XP_CAP - earnedToday)
  const cappedAmount = Math.min(amount, room)
  const gained = cappedAmount + streakBonus
  const totalXP = currentXP + gained

  // upsert so the row is created if it doesn't exist yet
  const { error } = await supabase.from('profiles').upsert({
    id: session.user.id,
    email: session.user.email,
    xp: totalXP,
    streak: newStreak,
    last_active: today,
  }, { onConflict: 'id' })

  if (error) {
    console.error('[awardXP] profiles upsert failed:', error.message)
    return 0
  }

  // Log to daily_activity for the weekly chart / dashboard.
  try {
    await supabase.from('daily_activity').upsert({
      user_id: session.user.id,
      date: today,
      xp_earned: earnedToday + gained,
      minutes: (existing?.minutes ?? 0) + minutes,
    }, { onConflict: 'user_id,date' })
  } catch { /* non-critical */ }

  return totalXP
}
