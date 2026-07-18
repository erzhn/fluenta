import { supabase } from './supabase'

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  PERFECT_SCORE: 25,
  DAILY_STREAK: 10,
  AI_CONVERSATION: 20,
  FLASHCARD_SESSION: 15,
  PRONUNCIATION: 20,
  DAILY_GOAL: 30,
  WRITING_CHECK: 15,
} as const

export async function awardXP(amount: number): Promise<number> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return 0

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, last_active')
    .eq('id', session.user.id)
    .single()

  if (!profile) return 0

  const today = new Date().toISOString().slice(0, 10)
  const lastActive = profile.last_active as string | null
  const isNewDay = lastActive !== today
  const streakBonus = isNewDay ? XP_REWARDS.DAILY_STREAK : 0
  const totalXP = ((profile.xp as number) ?? 0) + amount + streakBonus

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = isNewDay
    ? (lastActive === yesterday ? ((profile.streak as number) ?? 0) + 1 : 1)
    : ((profile.streak as number) ?? 0)

  await supabase.from('profiles').update({
    xp: totalXP,
    streak: newStreak,
    last_active: today,
  }).eq('id', session.user.id)

  return totalXP
}
