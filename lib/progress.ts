import { supabase } from '@/lib/supabase-client'

// ── Local storage fallback keys ───────────────────────────────────────────────
const LS_LESSON      = 'fluenta_lesson_progress'
const LS_VOCAB       = 'fluenta_vocab_srs'
const LS_STREAK      = 'fluenta_streak'
const LS_LEVEL       = 'fluenta_user_level'
const LS_LEVEL_SCORE = 'fluenta_level_test_score'
const LS_ACTIVITY    = 'fluenta_activity_log'
const LS_WRITING     = 'fluenta_writing_submissions'

function ls<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
}
function lsSet(key: string, value: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value))
}
function todayISO() { return new Date().toISOString().slice(0, 10) }

// ── Profile ───────────────────────────────────────────────────────────────────
// Table: user_profiles — PK is "id" (= auth.users.id), NOT "user_id"
export async function getUserProfile(userId: string) {
  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  } catch {
    return null
  }
}

export async function updateUserXP(userId: string, xp: number) {
  try {
    await supabase
      .from('user_profiles')
      .update({ total_xp: xp })
      .eq('id', userId)
  } catch {
    const prev = ls<{ totalXP: number }>(LS_LESSON, { totalXP: 0 })
    lsSet(LS_LESSON, { ...prev, totalXP: xp })
  }
}

// ── Lessons ───────────────────────────────────────────────────────────────────
// Table: lesson_completions — has user_id column
export async function completeLesson(userId: string, lessonId: string, score: number) {
  const payload = { user_id: userId, lesson_id: lessonId, score, completed_at: new Date().toISOString() }
  try {
    await supabase.from('lesson_completions').upsert(payload, { onConflict: 'user_id,lesson_id' })
  } catch {
    const prev = ls<{ completedLessons: Record<string, { score: number; completedAt: string }>; totalXP: number }>(
      LS_LESSON, { completedLessons: {}, totalXP: 0 }
    )
    prev.completedLessons[lessonId] = { score, completedAt: payload.completed_at }
    lsSet(LS_LESSON, prev)
  }
}

export async function getLessonCompletions(userId: string): Promise<Record<string, { score: number; completedAt: string }>> {
  try {
    const { data } = await supabase
      .from('lesson_completions')
      .select('lesson_id,score,completed_at')
      .eq('user_id', userId)
    if (data) {
      return Object.fromEntries(data.map(r => [r.lesson_id, { score: r.score, completedAt: r.completed_at }]))
    }
  } catch { /* fall through */ }
  const prog = ls<{ completedLessons: Record<string, { score: number; completedAt: string }> }>(
    LS_LESSON, { completedLessons: {} }
  )
  return prog.completedLessons ?? {}
}

// ── Vocabulary SRS ────────────────────────────────────────────────────────────
// Table: vocabulary_srs — has user_id, word_id, box, interval_days, due_date
export async function updateVocabWord(userId: string, wordId: string, box: number, intervalDays: number) {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + intervalDays)
  const payload = {
    user_id: userId,
    word_id: wordId,
    box,
    interval_days: intervalDays,
    due_date: dueDate.toISOString().slice(0, 10),
    seen: true,
    updated_at: new Date().toISOString(),
  }
  try {
    await supabase.from('vocabulary_srs').upsert(payload, { onConflict: 'user_id,word_id' })
  } catch {
    const prev = ls<Record<string, { box: number; intervalDays: number; dueDate: string; seen: boolean }>>(LS_VOCAB, {})
    prev[wordId] = { box, intervalDays, dueDate: payload.due_date, seen: true }
    lsSet(LS_VOCAB, prev)
  }
}

export async function getVocabularyProgress(userId: string): Promise<Record<string, { box: number; intervalDays: number; dueDate: string; seen: boolean }>> {
  try {
    const { data } = await supabase
      .from('vocabulary_srs')
      .select('word_id,box,interval_days,due_date,seen')
      .eq('user_id', userId)
    if (data) {
      return Object.fromEntries(data.map(r => [r.word_id, {
        box: r.box,
        intervalDays: r.interval_days,
        dueDate: r.due_date,
        seen: r.seen ?? true,
      }]))
    }
  } catch { /* fall through */ }
  const raw = ls<Record<string, { box: number; intervalDays: number; dueDate: string; seen: boolean }>>(LS_VOCAB, {})
  return Object.fromEntries(
    Object.entries(raw).map(([id, v]) => [id, { box: v.box, intervalDays: v.intervalDays ?? 0, dueDate: v.dueDate ?? todayISO(), seen: true }])
  )
}

// ── Activity / Streak ─────────────────────────────────────────────────────────
// Table: activity_log — has user_id, date, minutes, xp_earned
export async function logActivity(userId: string, minutes: number, xp: number) {
  const today = todayISO()
  try {
    const { data: existing } = await supabase
      .from('activity_log')
      .select('minutes,xp_earned')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    const updatedMins = (existing?.minutes ?? 0) + minutes
    const updatedXP   = (existing?.xp_earned ?? 0) + xp
    await supabase.from('activity_log').upsert(
      { user_id: userId, date: today, minutes: updatedMins, xp_earned: updatedXP },
      { onConflict: 'user_id,date' }
    )
  } catch {
    const prev = ls<Record<string, { minutes: number; xp: number }>>(LS_ACTIVITY, {})
    prev[today] = { minutes: (prev[today]?.minutes ?? 0) + minutes, xp: (prev[today]?.xp ?? 0) + xp }
    lsSet(LS_ACTIVITY, prev)
  }
}

export async function getActivityLog(userId: string, days: number): Promise<Record<string, { minutes: number; xp: number }>> {
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const { data } = await supabase
      .from('activity_log')
      .select('date,minutes,xp_earned')
      .eq('user_id', userId)
      .gte('date', since.toISOString().slice(0, 10))
    if (data) {
      return Object.fromEntries(data.map(r => [r.date, { minutes: r.minutes, xp: r.xp_earned }]))
    }
  } catch { /* fall through */ }
  return ls<Record<string, { minutes: number; xp: number }>>(LS_ACTIVITY, {})
}

// Table: user_profiles — columns: current_streak, last_active_date
export async function updateStreak(userId: string) {
  try {
    const today = todayISO()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yday = yesterday.toISOString().slice(0, 10)

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_streak,last_active_date')
      .eq('id', userId)
      .single()

    if (!profile) return
    const lastActive = profile.last_active_date
    let streak = profile.current_streak ?? 0
    if (lastActive === today) return
    if (lastActive === yday) streak += 1
    else streak = 1

    await supabase.from('user_profiles')
      .update({ current_streak: streak, last_active_date: today })
      .eq('id', userId)
  } catch {
    const data = ls<{ currentStreak: number; lastActiveDate: string }>(LS_STREAK, { currentStreak: 0, lastActiveDate: '' })
    const today = todayISO()
    const yday = new Date(); yday.setDate(yday.getDate() - 1)
    const ydayISO = yday.toISOString().slice(0, 10)
    if (data.lastActiveDate !== today) {
      if (data.lastActiveDate === ydayISO) data.currentStreak += 1
      else data.currentStreak = 1
      data.lastActiveDate = today
      lsSet(LS_STREAK, data)
    }
  }
}

// ── Level ─────────────────────────────────────────────────────────────────────
// Table: user_profiles — column: level
export async function setUserLevel(userId: string, level: string, score: number) {
  try {
    await supabase.from('user_profiles').update({ level }).eq('id', userId)
  } catch { /* fall through */ }
  lsSet(LS_LEVEL, level)
  lsSet(LS_LEVEL_SCORE, { level, score, date: new Date().toISOString() })
}

// ── Writing ───────────────────────────────────────────────────────────────────
// Table: writing_submissions — column: created_at (not submitted_at)
export async function saveWritingSubmission(userId: string, data: {
  level: string; topic: string; text: string; score: number; feedback: object
}) {
  try {
    await supabase.from('writing_submissions').insert({
      user_id: userId,
      level: data.level,
      topic: data.topic,
      text: data.text,
      score: data.score,
      feedback: data.feedback,
    })
  } catch {
    const prev = ls<Array<typeof data & { date: string }>>(LS_WRITING, [])
    prev.unshift({ ...data, date: new Date().toISOString() })
    lsSet(LS_WRITING, prev.slice(0, 50))
  }
}

export async function getWritingSubmissions(userId: string) {
  try {
    const { data } = await supabase
      .from('writing_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    return data ?? []
  } catch {
    return ls<unknown[]>(LS_WRITING, [])
  }
}

// ── Migration from localStorage → Supabase ────────────────────────────────────
export async function migrateLocalStorageToSupabase(userId: string) {
  if (typeof window === 'undefined') return
  const MIGRATED_KEY = 'fluenta_migrated'
  if (localStorage.getItem(MIGRATED_KEY) === 'true') return

  try {
    const lessonData = ls<{ completedLessons: Record<string, { score: number; completedAt: string }> }>(
      LS_LESSON, { completedLessons: {} }
    )
    const completions = lessonData.completedLessons ?? {}
    await Promise.all(
      Object.entries(completions).map(([lessonId, r]) =>
        completeLesson(userId, lessonId, r.score)
      )
    )

    const vocabData = ls<Record<string, { box: number; nextReview: string }>>(LS_VOCAB, {})
    const intervals = [0, 1, 3, 7, 14, 30]
    await Promise.all(
      Object.entries(vocabData).map(([wordId, v]