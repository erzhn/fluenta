'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'
import * as progress from '@/lib/progress'

export function useProgress() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null
      setUserId(uid)
      if (uid) {
        progress.getUserProfile(uid).then(p => setProfile(p as Record<string, unknown> | null))
        progress.migrateLocalStorageToSupabase(uid)
      }
      setLoading(false)
    })
  }, [])

  const completeLesson = useCallback((lessonId: string, score: number) => {
    if (!userId) return Promise.resolve()
    return progress.completeLesson(userId, lessonId, score)
  }, [userId])

  const updateVocabWord = useCallback((wordId: string, box: number, days: number) => {
    if (!userId) return Promise.resolve()
    return progress.updateVocabWord(userId, wordId, box, days)
  }, [userId])

  const logActivity = useCallback((mins: number, xp: number) => {
    if (!userId) return Promise.resolve()
    return progress.logActivity(userId, mins, xp)
  }, [userId])

  const setLevel = useCallback((level: string, score: number) => {
    if (!userId) return Promise.resolve()
    return progress.setUserLevel(userId, level, score)
  }, [userId])

  const refetchProfile = useCallback(() => {
    if (!userId) return Promise.resolve()
    return progress.getUserProfile(userId).then(p => setProfile(p as Record<string, unknown> | null))
  }, [userId])

  return {
    userId,
    profile,
    loading,
    completeLesson,
    updateVocabWord,
    logActivity,
    setLevel,
    refetchProfile,
  }
}
