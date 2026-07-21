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

  // Use defaults if profile row doesn't exist yet
  const currentXP: number = (profile?.xp as number) ?? 0
  const currentStreak: number = (profile?.streak as number) ?? 0
  const lastActive: string | null = (profile?.last_active as string) ?? null

  const today = new Date().toISOString().slice(0, 10)
  const isNewDay = lastActive !== today
  const streakBonus = isNewDay ? XP_REWARDS.DAILY_STREAK : 0
  const totalXP = currentXP + amount + streakBonus

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = isNewDay
    ? (lastActive === yesterday ? currentStreak + 1 : 1)
    : currentStreak

  // upsert so the row is created if it doesn't exist yet
  await supabase.from('profiles').upsert({
    id: session.user.id,
    email: session.user.email,
    xp: totalXP,
    streak: newStreak,
    last_active: today,
  }, { onConflict: 'id' })

  return totalXP
}
