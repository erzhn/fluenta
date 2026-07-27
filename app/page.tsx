'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Check, Menu, X, ChevronDown, Bot, BookOpen, TrendingUp,
  Mail, MessageCircle, Rocket, Lightbulb, Sparkles, Briefcase, Plane,
  type LucideIcon,
} from 'lucide-react'

// ── Animation helpers ──────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────
const FEATURES: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    icon: Bot,
    title: 'AI-репетитор Zhan',
    desc: 'Живой диалог голосом и текстом. Zhan подстраивается под твой уровень и мягко исправляет ошибки прямо по ходу разговора.',
    color: '#818cf8',
  },
  {
    icon: BookOpen,
    title: 'Умные уроки',
    desc: 'Структурированная программа от A1 до C2: грамматика, лексика, чтение и аудирование — в удобном темпе.',
    color: '#a78bfa',
  },
  {
    icon: TrendingUp,
    title: 'Твой прогресс',
    desc: 'Стрик, XP и ежедневные цели помогают заниматься регулярно и видеть, как растёт твой уровень.',
    color: '#22d3ee',
  },
]

const STEPS: { n: string; icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    n: '01',
    icon: Mail,
    title: 'Войди по email',
    desc: 'Без пароля — приходит короткий код на почту. Регистрация занимает минуту.',
    color: '#818cf8',
  },
  {
    n: '02',
    icon: MessageCircle,
    title: 'Начни диалог с Zhan',
    desc: 'Говори на темы, которые важны тебе: работа, путешествия или повседневное общение.',
    color: '#a78bfa',
  },
  {
    n: '03',
    icon: Rocket,
    title: 'Занимайся каждый день',
    desc: 'Персональная практика, исправления и стрик — и твой английский становится увереннее.',
    color: '#34d399',
  },
]

// ── Interactive Zhan demo — переключатели реально меняют диалог ──────────────────
type Scenario = 'work' | 'travel' | 'daily'

const SCENARIOS: Record<Scenario, {
  label: string
  icon: LucideIcon
  user: string
  correction: { before: string; after: string }
  tip: string
}> = {
  work: {
    label: 'Работа',
    icon: Briefcase,
    user: 'I responsible for the new project.',
    correction: { before: 'I responsible', after: "I'm responsible" },
    tip: 'Не теряй глагол «to be»: I’m responsible for the new project.',
  },
  travel: {
    label: 'Путешествия',
    icon: Plane,
    user: 'Where is the near station?',
    correction: { before: 'the near station', after: 'the nearest station' },
    tip: 'Нужна превосходная форма: Where is the nearest station?',
  },
  daily: {
    label: 'Общение',
    icon: MessageCircle,
    user: 'I very like this song.',
    correction: { before: 'I very like', after: 'I really like' },
    tip: '«Very» не ставят перед глаголом — скажи: I really like this song.',
  },
}

const SCENARIO_ORDER: Scenario[] = ['work', 'travel', 'daily']

const USE_CASES: { icon: LucideIcon; title: string; desc: string; example: string }[] = [
  {
    icon: Briefcase,
    title: 'Для работы',
    desc: 'Уверенно вести встречи, писать письма и презентовать идеи на английском.',
    example: '“Let’s move this deadline to next Friday.”',
  },
  {
    icon: Plane,
    title: 'Для путешествий',
    desc: 'Заказать кофе, спросить дорогу и общаться в отеле без языкового барьера.',
    example: '“Could you tell me how to get to the station?”',
  },
  {
    icon: MessageCircle,
    title: 'Для общения',
    desc: 'Свободно говорить в быту, знакомиться и обсуждать то, что тебе интересно.',
    example: '“I really enjoyed that movie — what did you think?”',
  },
]

// ── Glassmorphism helper ───────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#0f0f23' }}>
      <style>{`
        .lp-glow { filter: blur(80px); will-change: transform; }
        @keyframes lpDrift {
          0%,100%{transform:translate(0,0) scale(1);}
          50%{transform:translate(30px,-40px) scale(1.06);}
        }
        .lp-drift{animation:lpDrift var(--dur,20s) ease-in-out infinite;animation-delay:var(--delay,0s);}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .cursor{animation:blink 1s step-end infinite;}

        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 45%, #c084fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        section[id]{ scroll-margin-top: 88px; }

        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0f0f23}
        ::-webkit-scrollbar-thumb{background:#2d2d4e;border-radius:4px}

        .lp-root a:focus-visible,
        .lp-root button:focus-visible {
          outline: 2px solid #a5b4fc;
          outline-offset: 3px;
          border-radius: 12px;
        }

        @media (prefers-reduced-motion: reduce) {
          .lp-drift, .cursor { animation: none !important; }
          html { scroll-behavior: auto !important; }
        }
      `}</style>

      <div className="lp-root">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ScenariosSection />
        <FreeBanner />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links: [string, string][] = [
    ['Возможности', '#features'],
    ['Как это работает', '#how'],
    ['Сценарии', '#scenarios'],
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f0f23]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Fluenta — на главную">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/30">
            F
          </div>
          <span className="font-black text-xl gradient-text">Fluenta</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-slate-300 font-medium">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="hover:text-white transition-colors py-2">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="flex items-center text-sm text-slate-300 hover:text-white transition-colors font-medium px-4">
            Войти
          </Link>
          <Link href="/auth/login">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-105">
              Начать бесплатно
            </button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0f0f23]/98 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-5 py-4 space-y-1">
              {links.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  {label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:text-white hover:bg-white/5 transition-all">Войти</button>
                </Link>
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">Начать бесплатно</button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection() {
  const reduce = useReducedMotion()
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Soft glows (мягкие свечения — сильная сторона) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="lp-glow lp-drift absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', '--dur': '22s' } as React.CSSProperties} />
        <div className="lp-glow lp-drift absolute top-16 -right-40 w-[480px] h-[480px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', '--dur': '26s', '--delay': '-8s' } as React.CSSProperties} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div className={`inline-flex items-center gap-2 ${glass} rounded-full px-4 py-2 text-sm text-[#a5b4fc] mb-7`}>
              <span className="w-2 h-2 rounded-full bg-[#34d399]" />
              <span className="font-medium">AI-репетитор · полностью бесплатно</span>
            </div>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[42px] sm:text-6xl lg:text-[62px] font-black leading-[1.05] tracking-tight mb-6"
          >
            Говори по-английски
            <br />
            <span className="gradient-text">уверенно</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-9 max-w-lg"
          >
            Познакомься с <strong className="text-white">Zhan</strong> — личным AI-репетитором.
            Живые диалоги, мгновенные исправления и практика в удобном темпе.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-9"
          >
            <Link href="/auth/login">
              <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-2xl shadow-indigo-500/30 hover:scale-[1.03]">
                Начать бесплатно
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a href="#scenarios" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all">
                Попробовать Zhan
                <ChevronDown className="w-4 h-4" />
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {['Полностью бесплатно', 'Уровни A1–C2', 'Zhan на связи в любое время'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-slate-400">
                <Check className="w-3.5 h-3.5 text-[#34d399]" />
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: interactive Zhan demo */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/15 rounded-3xl blur-3xl scale-95 translate-y-6" />
          <ZhanDemo />
        </motion.div>
      </div>
    </section>
  )
}

// ── Interactive demo card ───────────────────────────────────────────────────────
function ZhanDemo() {
  const [scenario, setScenario] = useState<Scenario>('work')
  const reduce = useReducedMotion()
  const data = SCENARIOS[scenario]

  return (
    <div className={`relative ${glass} rounded-3xl overflow-hidden shadow-2xl shadow-black/50`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/30">
            Z
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#34d399] rounded-full border-2 border-[#141428]" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Zhan</div>
          <div className="text-[#34d399] text-xs font-medium">На связи · твой AI-репетитор</div>
        </div>
      </div>

      {/* Scenario switch — реально меняет содержимое */}
      <div className="px-4 pt-4">
        <p className="text-xs text-slate-400 mb-2">Выбери тему — Zhan покажет пример исправления:</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Тема диалога">
          {SCENARIO_ORDER.map((key) => {
            const s = SCENARIOS[key]
            const active = key === scenario
            return (
              <button
                key={key}
                onClick={() => setScenario(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" strokeWidth={2} />
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 sm:p-5 space-y-3.5 min-h-[248px]">
          <motion.div
            key={scenario}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="space-y-3.5"
          >
            {/* User */}
            <div className="flex justify-end">
              <div className="max-w-[82%]">
                <div className="bg-gradient-to-r from-[#6366f1] to-[#7c6df2] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                  {data.user}
                </div>
                <div className="text-[10px] text-slate-500 text-right mt-1">Ты · только что</div>
              </div>
            </div>

            {/* Zhan correction */}
            <div className="flex items-end gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-[10px] shrink-0">Z</div>
              <div className={`${glass} rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#e2e8f0] max-w-[86%]`}>
                <span className="inline-flex items-center gap-1 bg-[#f59e0b]/15 border border-[#f59e0b]/25 text-[#fbbf24] rounded px-1.5 py-0.5 text-xs font-semibold mb-2">
                  <Lightbulb className="w-3 h-3" strokeWidth={2} /> Исправление
                </span>
                <p className="leading-relaxed">
                  <span className="line-through text-slate-500">{data.correction.before}</span>{' '}
                  <ArrowRight className="inline w-3 h-3 text-slate-400 mx-0.5" />{' '}
                  <span className="font-semibold text-[#34d399] bg-[#10b981]/15 px-1 rounded">{data.correction.after}</span>
                </p>
                <p className="text-slate-300 mt-2 text-[13px]">{data.tip}</p>
              </div>
            </div>
          </motion.div>

        {/* Input mock */}
        <div className={`${glass} rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-slate-400`}>
          <span>Напиши сообщение…</span>
          <span className="cursor text-[#818cf8] font-bold">|</span>
        </div>
      </div>
    </div>
  )
}

// ── Features ───────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-[#a5b4fc] font-semibold text-xs uppercase tracking-widest mb-3">Возможности</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              Всё, что нужно, чтобы{' '}
              <span className="gradient-text">заговорить</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Одна платформа и живой AI-репетитор — без лишних инструментов и сложных настроек.
            </p>
          </FadeUp>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <div className={`group relative ${glass} rounded-2xl p-7 h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1.5`}>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}18 0%, transparent 65%)` }}
                />
                <div className="rounded-xl flex items-center justify-center mb-5 w-12 h-12" style={{ backgroundColor: `${f.color}20` }}>
                  <f.icon className="w-6 h-6" strokeWidth={1.75} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how" className="relative py-24 px-5 sm:px-8">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-[#a5b4fc] font-semibold text-xs uppercase tracking-widest mb-3">Как это работает</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              Три простых{' '}
              <span className="gradient-text">шага</span>
            </h2>
          </FadeUp>
        </div>

        <div className="relative">
          <div className="hidden sm:block absolute top-[52px] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-[2px] overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)' }}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div
                      className="w-[104px] h-[104px] rounded-3xl flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <step.icon className="w-11 h-11" strokeWidth={1.5} style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.n}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.3} className="text-center mt-12">
          <Link href="/auth/login">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-xl shadow-indigo-500/25 hover:scale-[1.03]">
              Начать бесплатно
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Scenarios (вместо отзывов) ──────────────────────────────────────────────────
function ScenariosSection() {
  return (
    <section id="scenarios" className="relative py-24 px-5 sm:px-8">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-[#a5b4fc] font-semibold text-xs uppercase tracking-widest mb-3">Сценарии</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              Английский для{' '}
              <span className="gradient-text">твоих задач</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Практикуй именно то, что пригодится в жизни. Zhan подстроит диалог под любую ситуацию.
            </p>
          </FadeUp>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {USE_CASES.map((c, i) => (
            <FadeUp key={c.title} delay={i * 0.12}>
              <div className={`${glass} rounded-3xl p-7 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1.5`}>
                <div className="rounded-xl flex items-center justify-center mb-5 w-12 h-12 bg-white/[0.06]">
                  <c.icon className="w-6 h-6 text-[#a5b4fc]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{c.desc}</p>
                <p className="text-sm text-[#c4b5fd] italic border-l-2 border-[#8b5cf6]/40 pl-3">{c.example}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Honest free-access message ──────────────────────────────────────────────────
function FreeBanner() {
  return (
    <section className="px-5 sm:px-8 pb-4">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className={`${glass} rounded-3xl px-7 py-8 sm:px-10 sm:py-9 text-center`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#34d399]/15 mb-4">
              <Sparkles className="w-6 h-6 text-[#34d399]" strokeWidth={1.75} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Fluenta полностью бесплатна</h3>
            <p className="text-slate-300 max-w-xl mx-auto leading-relaxed">
              Без платных тарифов, подписок и скрытых условий. Просто открытый доступ к обучению
              и AI-репетитору — заходи и занимайся столько, сколько нужно.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#4338ca]" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

            <div className="relative z-10 text-center py-16 px-6">
              <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-black text-white leading-tight mb-5">
                Готов заговорить
                <br />по-английски?
              </h2>
              <p className="text-indigo-100 text-lg mb-9 max-w-md mx-auto">
                Начни заниматься с Zhan сегодня — спокойно, в своём темпе и бесплатно.
              </p>

              <div className="flex justify-center">
                <Link href="/auth/login">
                  <button className="group inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-[#4338ca] bg-white hover:bg-white/95 transition-all hover:scale-[1.04] shadow-2xl shadow-black/20">
                    Начать бесплатно
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7 text-sm text-indigo-100">
                {['Полностью бесплатно', 'Уровни A1–C2', 'Вход по коду на email'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-200" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-10 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-xs">
            F
          </div>
          <span className="font-black gradient-text">Fluenta</span>
        </div>
        <p className="text-slate-500 text-sm text-center">Fluenta © 2026 — бесплатная AI-платформа для английского</p>
        <div className="flex items-center gap-5 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors py-2">Возможности</a>
          <Link href="/auth/login" className="hover:text-white transition-colors py-2">Войти</Link>
        </div>
      </div>
    </footer>
  );
}
