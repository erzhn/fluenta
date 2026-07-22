"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Briefcase, PenLine, Sparkles, Target, type LucideIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Goal = 'tourist' | 'business' | 'exam' | 'general'
type Level = 'A1-A2' | 'B1-B2' | 'C1'

const GOALS: { id: Goal; icon: LucideIcon; title: string; desc: string }[] = [
  { id: 'tourist', icon: Plane, title: 'Туристический', desc: 'Путешествия и общение за рубежом' },
  { id: 'business', icon: Briefcase, title: 'Бизнес', desc: 'Профессиональное общение и переговоры' },
  { id: 'exam', icon: PenLine, title: 'Экзамен', desc: 'Подготовка к IELTS, TOEFL, ЕГЭ' },
  { id: 'general', icon: Sparkles, title: 'Общее развитие', desc: 'Комплексное изучение языка' },
]

const LEVELS = [
  { id: 'A1-A2' as Level, label: 'A1–A2', title: 'Начинающий', desc: 'Знаю базовые слова и фразы' },
  { id: 'B1-B2' as Level, label: 'B1–B2', title: 'Средний', desc: 'Могу поддержать разговор' },
  { id: 'C1' as Level, label: 'C1', title: 'Продвинутый', desc: 'Уверенно говорю и пишу' },
]

const RECOMMENDATIONS: Record<Goal, { title: string; description: string; modules: string[]; dailyGoal: number }> = {
  tourist: {
    title: 'Туристический маршрут',
    description: 'Фокус на разговорных навыках, базовой лексике и ситуативных диалогах для путешествий.',
    modules: ['Vocabulary', 'Mini Stories', 'Listening', 'Speaking Practice', 'AI Tutor'],
    dailyGoal: 20,
  },
  business: {
    title: 'Бизнес трек',
    description: 'Деловая переписка, переговоры и профессиональная лексика для карьерного роста.',
    modules: ['Grammar', 'Writing', 'Vocabulary', 'Reading Speed', 'AI Tutor'],
    dailyGoal: 30,
  },
  exam: {
    title: 'Экзаменационный трек',
    description: 'Систематическая подготовка к международным экзаменам с упором на все четыре навыка.',
    modules: ['Grammar', 'Reading Speed', 'Listening', 'Writing', 'Word Formation', 'Pronunciation'],
    dailyGoal: 45,
  },
  general: {
    title: 'Универсальный трек',
    description: 'Гармоничное развитие всех языковых навыков в комфортном темпе.',
    modules: ['AI Tutor', 'Vocabulary', 'Grammar', 'Listening', 'Mini Stories'],
    dailyGoal: 25,
  },
}

const LEVEL_MAP: Record<Level, string> = {
  'A1-A2': 'A2',
  'B1-B2': 'B1',
  'C1': 'C1',
}

interface OnboardingWizardProps {
  userId: string
  onComplete: () => void
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
}

export function OnboardingWizard({ userId, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [saving, setSaving] = useState(false)
  const [dir, setDir] = useState(1)

  const goNext = () => { setDir(1); setStep(s => s + 1) }
  const goBack = () => { setDir(-1); setStep(s => s - 1) }

  const complete = async () => {
    if (!goal || !level) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: userId,
      learning_goal: goal,
      current_level: LEVEL_MAP[level],
      onboarding_completed: true,
    }, { onConflict: 'id' })
    setSaving(false)
    onComplete()
  }

  const rec = goal ? RECOMMENDATIONS[goal] : null

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Добро пожаловать в Fluenta!</h1>
                <p className="text-muted-foreground">Какова ваша главная цель изучения английского?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      goal === g.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-card/80'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-primary/15 border border-primary/20">
                      <g.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                    </div>
                    <div className="font-semibold text-foreground text-sm">{g.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={goNext}
                disabled={!goal}
                className="w-full py-3 rounded-2xl bg-primary text-white font-semibold disabled:opacity-40 transition-all hover:bg-primary/90"
              >
                Далее →
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Ваш уровень английского</h1>
                <p className="text-muted-foreground">Это поможет подобрать подходящие упражнения</p>
              </div>
              <div className="space-y-3">
                {LEVELS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${
                      level === l.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      level === l.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {l.label}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={goBack} className="flex-1 py-3 rounded-2xl border border-border text-foreground font-semibold hover:bg-card transition-all">
                  ← Назад
                </button>
                <button
                  onClick={goNext}
                  disabled={!level}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold disabled:opacity-40 transition-all hover:bg-primary/90"
                >
                  Далее →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && rec && (
            <motion.div
              key="step2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center bg-primary/15 border border-primary/20">
                  <Target className="w-7 h-7 text-primary" strokeWidth={1.75} />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{rec.title}</h1>
                <p className="text-muted-foreground text-sm">{rec.description}</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Рекомендуемые модули</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.modules.map(m => (
                      <span key={m} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm text-muted-foreground">Ежедневная цель</div>
                  <div className="font-bold text-foreground">{rec.dailyGoal} минут</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={goBack} className="flex-1 py-3 rounded-2xl border border-border text-foreground font-semibold hover:bg-card transition-all">
                  ← Назад
                </button>
                <button
                  onClick={complete}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold disabled:opacity-60 transition-all hover:bg-primary/90"
                >
                  {saving ? 'Сохраняем...' : 'Начать обучение'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
