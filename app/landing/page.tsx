"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, ArrowRight, Bot, Mic, BookOpen, Layers,
  BarChart3, Trophy, ChevronDown, Check, Star,
  Send, Zap, Users, Play,
  MessageCircle, Camera, PlaySquare,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Возможности", href: "#features" },
  { label: "Уровни", href: "#levels" },
  { label: "Цены", href: "#pricing" },
  { label: "О нас", href: "#about" },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI-репетитор 24/7",
    description: "Общайся как с носителем языка в любое время. AI понимает контекст, исправляет ошибки и адаптируется к твоему уровню.",
    color: "#6366F1",
    emoji: "🤖",
  },
  {
    icon: Mic,
    title: "Произношение",
    description: "AI оценивает твой акцент в реальном времени и показывает как правильно произносить каждый звук и слово.",
    color: "#8B5CF6",
    emoji: "🎤",
  },
  {
    icon: BookOpen,
    title: "500+ уроков",
    description: "Структурированная программа от A1 до C1. Каждый урок закрепляется интерактивными упражнениями и тестами.",
    color: "#3B82F6",
    emoji: "📚",
  },
  {
    icon: Layers,
    title: "Умные флэшкарты",
    description: "Алгоритм SRS знает когда ты начинаешь забывать слово и повторяет его в идеальный момент для закрепления.",
    color: "#10B981",
    emoji: "🃏",
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    description: "Видишь прогресс по каждому навыку: грамматика, лексика, произношение и письмо — всё в одном дашборде.",
    color: "#F59E0B",
    emoji: "📊",
  },
  {
    icon: Trophy,
    title: "Геймификация",
    description: "XP, стрики, достижения и лидерборд делают обучение увлекательным и мотивируют заниматься каждый день.",
    color: "#EF4444",
    emoji: "🏆",
  },
];

const STEPS = [
  {
    num: "01",
    emoji: "🎯",
    title: "Пройди тест",
    description: "Определим твой точный уровень за 10 минут с помощью адаптивного AI-теста",
    color: "#6366F1",
  },
  {
    num: "02",
    emoji: "🤖",
    title: "Получи план",
    description: "AI строит персональную программу на основе твоих целей, уровня и расписания",
    color: "#8B5CF6",
  },
  {
    num: "03",
    emoji: "📈",
    title: "Учись каждый день",
    description: "30 минут в день — и через 6 месяцев ты говоришь свободно по-английски",
    color: "#10B981",
  },
];

const LEVELS = [
  { level: "A1", label: "Beginner", color: "#6B7280", description: "Приветствия, числа, базовые фразы", time: "Старт", border: "#6B728040" },
  { level: "A2", label: "Elementary", color: "#3B82F6", description: "Простые разговоры, покупки, описания", time: "2 месяца", border: "#3B82F640" },
  { level: "B1", label: "Intermediate", color: "#8B5CF6", description: "Путешествия, работа, выражение мнений", time: "4 месяца", border: "#8B5CF640" },
  { level: "B2", label: "Upper-Intermediate", color: "#10B981", description: "Сложные темы, споры, тонкие нюансы языка", time: "8 месяцев", border: "#10B98140" },
  { level: "C1", label: "Advanced", color: "#F59E0B", description: "Бизнес, академический English, идиомы", time: "12 месяцев", border: "#F59E0B40" },
  { level: "C2", label: "Mastery", color: "#EF4444", description: "Говоришь и думаешь как носитель языка", time: "18 месяцев", border: "#EF444440" },
];

const TESTIMONIALS = [
  {
    name: "Айгерим К.",
    flag: "🇰🇿",
    city: "Алматы",
    avatar: "А",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
    text: "За 4 месяца поднялась с A2 до B2! AI-репетитор даёт мгновенный фидбек. Теперь спокойно провожу митинги на английском с зарубежными партнёрами.",
    rating: 5,
    badge: "A2 → B2",
  },
  {
    name: "Дмитрий С.",
    flag: "🇷🇺",
    city: "Москва",
    avatar: "Д",
    gradient: "from-[#8B5CF6] to-[#3B82F6]",
    text: "Сдал IELTS на 7.0 после 6 месяцев на Fluenta. Пробовал другие приложения — ни одно не давало такого реального прогресса в разговорной речи.",
    rating: 5,
    badge: "IELTS 7.0",
  },
  {
    name: "Мадина Т.",
    flag: "🇰🇿",
    city: "Нур-Султан",
    avatar: "М",
    gradient: "from-[#10B981] to-[#3B82F6]",
    text: "Наконец-то не боюсь говорить по-английски на работе. Произношение стало намного чище — коллеги из США не верят, что я училась онлайн.",
    rating: 5,
    badge: "A1 → B1",
  },
];

const PLANS = [
  {
    name: "Бесплатно",
    price: "$0",
    period: "",
    desc: "Попробуй без риска",
    popular: false,
    cta: "Начать бесплатно",
    href: "/auth/register",
    features: [
      "10 уроков в день",
      "Базовый AI-чат",
      "Отслеживание прогресса",
      "Мобильное приложение",
      "50 слов в словарь",
    ],
  },
  {
    name: "Про",
    price: "$9",
    period: "/мес",
    desc: "Для серьёзного прогресса",
    popular: true,
    cta: "Начать с Про",
    href: "/auth/register",
    features: [
      "Безлимит уроков",
      "Полный AI-репетитор",
      "Оценка произношения",
      "Сертификат по уровням",
      "Безлимит словарного запаса",
      "Приоритетная поддержка",
    ],
  },
  {
    name: "Команда",
    price: "$29",
    period: "/мес",
    desc: "Для компаний и групп",
    popular: false,
    cta: "Связаться с нами",
    href: "/auth/register",
    features: [
      "До 10 человек",
      "Корпоративная аналитика",
      "Общий лидерборд",
      "Кастомные уроки",
      "Выделенный менеджер",
      "API интеграция",
    ],
  },
];

const FAQS = [
  {
    q: "Нужно ли знать английский чтобы начать?",
    a: "Нет! Fluenta подходит для полных новичков. Интерфейс на русском, а первые уроки начинаются с нуля — приветствия, числа, алфавит. AI-репетитор адаптируется под любой уровень.",
  },
  {
    q: "Чем Fluenta отличается от Duolingo?",
    a: "Duolingo — это игра с элементами учёбы. Fluenta — это полноценный AI-репетитор, который исправляет ошибки в реальном времени, объясняет грамматику и строит персональную программу. Прогресс в 3–4 раза быстрее.",
  },
  {
    q: "Как работает AI-репетитор?",
    a: "Наш AI работает на базе Google Gemini — одной из самых мощных языковых моделей в мире. Ты пишешь или говоришь по-английски, AI анализирует ошибки, объясняет правила и предлагает правильные варианты в режиме живого диалога.",
  },
  {
    q: "Можно ли получить сертификат?",
    a: "Да! После прохождения каждого уровня (A1→C1) ты получаешь сертификат Fluenta с QR-кодом для проверки. Его можно добавить в LinkedIn и резюме. Доступно в плане Про.",
  },
  {
    q: "Работает ли на телефоне?",
    a: "Да, Fluenta полностью адаптирован для мобильных устройств. Веб-версия работает в браузере, а PWA-версию можно установить на экран как приложение — работает даже в офлайн-режиме.",
  },
];

// ─── Glassmorphism class ──────────────────────────────────────────────────────
const g = "bg-white/5 backdrop-blur-xl border border-white/10";

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <style>{`
        @keyframes blobDrift {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          25%      { transform: translate(60px,-80px) scale(1.1) rotate(8deg); }
          50%      { transform: translate(-40px,50px) scale(0.93) rotate(-6deg); }
          75%      { transform: translate(50px,20px) scale(1.06) rotate(4deg); }
        }
        .blob { animation: blobDrift 14s ease-in-out infinite; will-change: transform; }
        .blob-b { animation-delay: -5s; animation-duration: 18s; }
        .blob-c { animation-delay: -10s; animation-duration: 22s; }
        @keyframes chatPop {
          from { opacity:0; transform: translateY(8px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .msg1 { animation: chatPop 0.4s ease 0.9s both; }
        .msg2 { animation: chatPop 0.4s ease 2.0s both; }
        .msg3 { animation: chatPop 0.4s ease 3.2s both; }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        .cursor { animation: blink 1s step-end infinite; }
        @keyframes shimmer {
          from { background-position: -400px 0; }
          to   { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
          background-size: 400px 100%;
          animation: shimmer 2s linear infinite;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CEFRSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30">
            F
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
            Fluenta
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-white transition-colors font-medium px-4 py-2"
          >
            Войти
          </Link>
          <Link href="/auth/register">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105">
              Начать бесплатно
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground border border-white/10 hover:text-white hover:bg-white/5 transition-all">
                    Войти
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                    Начать бесплатно
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated blob background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366F1 0%, #4338CA 50%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="blob blob-b absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, #6D28D9 50%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="blob blob-c absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, #1D4ED8 50%, transparent 70%)", filter: "blur(80px)" }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <div className={`inline-flex items-center gap-2.5 ${g} rounded-full px-4 py-2 text-sm text-muted-foreground mb-8`}>
              <span className="text-base">✨</span>
              <span className="font-medium">AI-репетитор нового поколения</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.07] tracking-tight mb-6"
          >
            Выучи английский{" "}
            <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
              с AI-репетитором
            </span>{" "}
            24/7
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
          >
            Замени дорогих репетиторов умным ИИ. Персональный подход,
            произношение, грамматика — всё в одном месте.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/auth/register">
              <button className="group flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] transition-all duration-200 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105">
                Начать бесплатно
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold text-white border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all duration-200">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              Посмотреть демо
            </button>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-5">
            {[
              { icon: "✓", text: "Без кредитной карты" },
              { icon: "✓", text: "10 уроков бесплатно" },
              { icon: "✓", text: "Отмена в любой момент" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="text-[#10B981] font-bold">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>

          {/* Stat pills */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-3 mt-8">
            {[
              { val: "50 000+", label: "учеников", icon: Users },
              { val: "4.9★", label: "рейтинг", icon: Star },
              { val: "A1→C1", label: "за 6 месяцев", icon: Zap },
            ].map(({ val, label, icon: Icon }) => (
              <div key={val} className={`flex items-center gap-2.5 ${g} rounded-xl px-4 py-2.5`}>
                <Icon className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-white text-sm">{val}</span>
                  <span className="text-muted-foreground text-xs ml-1.5">{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Animated chat mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-3xl blur-2xl scale-95 translate-y-4" />

          <div className={`relative ${g} rounded-3xl overflow-hidden shadow-2xl shadow-black/50`}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30">
                F
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Fluenta AI</div>
                <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                  Online · всегда на связи
                </div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]/80" />
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-5 space-y-4 min-h-[280px]">
              {/* User message */}
              <div className="msg1 flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                    Yesterday I go to the shop
                  </div>
                  <div className="text-[10px] text-muted-foreground text-right mt-1">Ты · сейчас</div>
                </div>
              </div>

              {/* AI thinking */}
              <div className="msg2 flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-[10px] font-extrabold shrink-0">
                  F
                </div>
                <div className={`${g} rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%]`}>
                  <p className="text-muted-foreground mb-1">Почти правильно! Небольшая ошибка 👀</p>
                  <p className="text-white">
                    Нужно:{" "}
                    <span className="text-[#A78BFA]">&ldquo;Yesterday I </span>
                    <span className="bg-[#10B981]/20 text-[#10B981] font-bold px-1 py-0.5 rounded">WENT</span>
                    <span className="text-[#A78BFA]"> to the shop&rdquo;</span>
                  </p>
                </div>
              </div>

              {/* AI grammar explanation */}
              <div className="msg3 flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 opacity-0">
                  F
                </div>
                <div className={`${g} rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%]`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-[#818CF8] text-xs px-2 py-0.5 rounded-full font-medium">Past Simple</span>
                    <span className="text-xs text-muted-foreground">используем с yesterday</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    go → <strong className="text-white">went</strong> (неправильный глагол, нужно запомнить ✓)
                  </p>
                </div>
              </div>

              {/* Typing input */}
              <div className={`${g} rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground`}>
                <span>Напиши ответ на английском...</span>
                <span className="cursor text-primary font-bold ml-1">|</span>
              </div>
            </div>

            {/* Shimmer overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-12 shimmer pointer-events-none" />
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className={`absolute -right-4 -bottom-4 ${g} rounded-2xl px-4 py-3 shadow-xl shadow-black/30`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-white font-bold text-sm">7-дневный стрик</div>
                <div className="text-muted-foreground text-xs">Так держать!</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.1, duration: 0.5 }}
            className={`absolute -left-4 top-6 ${g} rounded-2xl px-4 py-3 shadow-xl shadow-black/30`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-white font-bold text-sm">+120 XP</div>
                <div className="text-muted-foreground text-xs">за урок</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Возможности
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold mb-5">
            Всё что нужно для{" "}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
              свободного английского
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Полноценная AI-платформа для изучения английского в одном месте
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={scaleIn}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group relative ${g} rounded-2xl p-6 cursor-default overflow-hidden`}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}15 0%, transparent 60%)` }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)` }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl"
                style={{ backgroundColor: `${f.color}20` }}
              >
                {f.emoji}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              <div
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: f.color }}
              >
                Узнать больше <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Как это работает</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold">
            Три шага до{" "}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">свободного английского</span>
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-14 left-[16.67%] right-[16.67%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full origin-left"
              style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6, #10B981)" }}
            />
            {/* Dots on the line */}
            {[0, 50, 100].map((p) => (
              <motion.div
                key={p}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + p * 0.005 }}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#0F172A]"
                style={{ left: `${p}%`, backgroundColor: p === 0 ? "#6366F1" : p === 50 ? "#8B5CF6" : "#10B981" }}
              />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-2xl"
                    style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                  >
                    {step.emoji}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/auth/register">
            <button className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] transition-all shadow-xl shadow-indigo-500/25 hover:scale-105">
              Пройти тест сейчас →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CEFR LEVELS ──────────────────────────────────────────────────────────────
function CEFRSection() {
  return (
    <section id="levels" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Программа CEFR
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold mb-5">
            От нуля до{" "}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">C1</span>
            {" "}за 12 месяцев
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Международная система уровней — мировой стандарт в обучении языкам
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {LEVELS.map((lvl, i) => (
            <motion.div
              key={lvl.level}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group ${g} rounded-2xl p-6 overflow-hidden relative cursor-default`}
              style={{ borderColor: lvl.border }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 0% 100%, ${lvl.color}12 0%, transparent 60%)` }}
              />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="text-3xl font-extrabold leading-none mb-1"
                    style={{ color: lvl.color }}
                  >
                    {lvl.level}
                  </div>
                  <div className="text-white text-sm font-semibold">{lvl.label}</div>
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: `${lvl.color}20`, color: lvl.color }}
                >
                  {lvl.time}
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{lvl.description}</p>
              <div
                className="mt-4 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: lvl.color }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Отзывы
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold mb-5">
            Что говорят{" "}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
              наши ученики
            </span>
          </motion.h2>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-1.5 text-[#F59E0B]">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            <span className="text-white font-bold ml-2">4.9</span>
            <span className="text-muted-foreground ml-1">из 50,000+ отзывов</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`${g} rounded-3xl p-7 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${t.gradient} pointer-events-none`} />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-current" />
                ))}
              </div>

              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-extrabold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                    {t.name} <span>{t.flag}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">{t.city}</div>
                </div>
                <div className={`ml-auto px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${t.gradient} text-white`}>
                  {t.badge}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Цены</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold mb-5">
            Простые и{" "}
            <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">честные</span>{" "}
            цены
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg">
            Начни бесплатно. Перейди на Про когда будешь готов.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`relative rounded-3xl p-7 flex flex-col ${
                plan.popular
                  ? "bg-gradient-to-b from-[#6366F1] to-[#4338CA] shadow-2xl shadow-indigo-500/30 scale-105"
                  : `${g}`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ Популярный
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-white font-bold text-lg mb-1">{plan.name}</div>
                <div className="text-muted-foreground text-sm">{plan.desc}</div>
              </div>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground mb-1.5">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? "bg-white/20" : "bg-primary/20"}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className={plan.popular ? "text-white/90" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? "bg-white text-primary hover:bg-white/95 hover:scale-105 shadow-xl"
                      : "bg-primary text-white hover:bg-[#5558E3] hover:scale-105"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          Все планы включают 30-дневную гарантию возврата денег. Без вопросов.
        </motion.p>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">FAQ</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold">Частые вопросы</motion.h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full text-left ${g} rounded-2xl px-6 py-5 transition-all duration-200 group ${
                  open === i ? "border-primary/40" : "hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`font-semibold text-sm sm:text-base transition-colors ${open === i ? "text-[#818CF8]" : "text-white"}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${open === i ? "text-primary" : "text-muted-foreground"}`} />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground text-sm leading-relaxed mt-3 pr-8">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#4338CA]" />
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)" }} />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)" }} />

          <div className="relative z-10 text-center py-20 px-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 mb-8"
            >
              <span>🚀</span> Начни прямо сейчас — это бесплатно
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Начни говорить<br />по-английски уже сегодня
            </h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-lg mx-auto">
              Первые 10 уроков бесплатно — без кредитной карты, без обязательств
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <button className="group flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-primary bg-white hover:bg-white/95 transition-all hover:scale-105 shadow-2xl shadow-black/20">
                  Начать бесплатно
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all hover:scale-105">
                  Уже есть аккаунт
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-indigo-200">
              {["50,000+ учеников", "4.9★ рейтинг", "Бесплатно навсегда"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-indigo-300" /> {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function FooterSection() {
  const FOOTER_LINKS = [
    { label: "Возможности", href: "#features" },
    { label: "Уровни", href: "#levels" },
    { label: "Цены", href: "#pricing" },
    { label: "Блог", href: "#" },
    { label: "О нас", href: "#about" },
    { label: "Контакты", href: "#" },
  ];

  const SOCIAL = [
    { icon: MessageCircle, label: "Twitter", href: "#" },
    { icon: Camera, label: "Instagram", href: "#" },
    { icon: Send, label: "Telegram", href: "#" },
    { icon: PlaySquare, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="border-t border-white/5 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-sm">
                F
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
                Fluenta
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              AI-репетитор английского языка нового поколения. Учись быстрее с персональным подходом.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-white text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`w-9 h-9 ${g} rounded-xl flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/20 transition-all hover:scale-110`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#334155] text-sm">
          <p>© {new Date().getFullYear()} Fluenta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
