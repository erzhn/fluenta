'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, BookOpen, ChevronRight, CheckCircle, Lock } from 'lucide-react'
import { MODULES } from '@/lib/modules-data'
import type { ModuleMeta } from '@/lib/modules-data'

const STORAGE_KEY = 'fluenta_lesson_progress'
const PASS_THRESHOLD = 0.8

function loadCompletedLessons(): Record<string, { score: number }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return raw?.completedLessons ?? {}
  } catch { return {} }
}

function getModuleProgress(module: ModuleMeta, completed: Record<string, { score: number }>) {
  const total = module.lessons.length
  const done = module.lessons.filter(l => {
    const r = completed[l.id]
    if (!r) return false
    return r.score / l.quiz.length >= PASS_THRESHOLD
  }).length
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

export default function ModulesPage() {
  const [completed, setCompleted] = useState<Record<string, { score: number }>>({})

  useEffect(() => {
    setCompleted(loadCompletedLessons())
  }, [])

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Специальные модули</h1>
              <p className="text-muted-foreground text-sm">Business English, IELTS/TOEFL, Speaking Club, Grammar</p>
            </div>
          </div>
        </motion.div>

        {/* Module cards */}
        <div className="grid gap-4">
          {MODULES.map((module, idx) => {
            const prog = getModuleProgress(module, completed)
            const isStarted = prog.done > 0
            const isComplete = prog.done === prog.total

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link href={`/lessons?module=${module.id}`}>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all group cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="text-4xl shrink-0 mt-0.5">{module.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                              {module.title}
                            </h2>
                            <p className="text-muted-foreground text-sm mt-0.5">{module.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mt-2 mb-3">
                          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                            {module.levels}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {module.lessonCount} уроков
                          </span>
                          {isComplete && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Завершён
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prog.pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
                            {prog.done}/{prog.total} уроков
                          </span>
                        </div>

                        {/* Level pills */}
                        <div className="flex gap-1.5 mt-3 flex-wrap">
                          {module.lessons
                            .map(l => l.level)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .sort()
                            .map(level => (
                              <span
                                key={level}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${LEVEL_COLORS[level] ?? '#6366f1'}25`,
                                  color: LEVEL_COLORS[level] ?? '#6366f1',
                                }}
                              >
                                {level}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Main course link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Link href="/lessons">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.06] transition-all flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">
                  Основной курс
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">A1–C1 · Базовые навыки английского</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
