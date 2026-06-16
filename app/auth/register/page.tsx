"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, BookOpen, Brain, Mic, Trophy, Zap, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "form" | "level" | "time" | "goal";

interface Prefs {
  level: string;
  minutes: number;
  goal: string;
  name: string;
}

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel() {
  const CHIPS = [
    { icon: Brain, text: "AI-репетитор 24/7", color: "#6366F1", delay: 0.5 },
    { icon: Mic, text: "Оценка произношения", color: "#8B5CF6", delay: 0.65 },
    { icon: BookOpen, text: "500+ уроков", color: "#3B82F6", delay: 0.8 },
    { icon: Trophy, text: "Геймификация и XP", color: "#10B981", delay: 0.95 },
    { icon: Zap, text: "Умные флэшкарты", color: "#F59E0B", delay: 1.1 },
  ];

  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center h-full overflow-hidden bg-gradient-to-br from-[#0D1428] via-[#0F172A] to-[#0D1428]">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)", filter: "blur(70px)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)", filter: "blur(70px)" }} />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-indigo-500/30">F</div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">Fluenta</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl font-extrabold text-white leading-tight mb-4"
        >
          Начни говорить<br />
          <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
            по-английски
          </span>
          <br />уже сегодня
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#64748B] text-sm mb-10"
        >
          Присоединись к 50,000+ ученикам
        </motion.p>

        <div className="flex flex-col gap-2.5 w-full">
          {CHIPS.map(({ icon: Icon, text, color, delay }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}25` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-white/80 text-sm font-medium">{text}</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex gap-6 mt-10"
        >
          {[{ val: "Бесплатно", label: "Первые 10 уроков" }, { val: "6 мес", label: "До уровня C1" }, { val: "30 мин", label: "В день достаточно" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-white font-bold text-sm leading-none">{s.val}</div>
              <div className="text-[#475569] text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function OnboardingProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs text-[#475569] mb-2.5">
        <span>Шаг {current} из {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${((current - 1) / total) * 100}%` }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
        />
      </div>
    </div>
  );
}

// ─── Step 1: Level Selection ──────────────────────────────────────────────────
const LEVELS = [
  { level: "A1", label: "Начинающий", desc: "Знаю только базовые слова", color: "#6B7280", time: "Старт" },
  { level: "A2", label: "Ниже среднего", desc: "Понимаю простые предложения", color: "#3B82F6", time: "2 мес" },
  { level: "B1", label: "Средний", desc: "Могу объяснить основное", color: "#8B5CF6", time: "4 мес" },
  { level: "B2", label: "Выше среднего", desc: "Говорю на большинство тем", color: "#10B981", time: "8 мес" },
  { level: "C1", label: "Продвинутый", desc: "Могу работать на English", color: "#F59E0B", time: "12 мес" },
  { level: "C2", label: "Свободное", desc: "Как носитель языка", color: "#EF4444", time: "18 мес" },
];

function LevelStep({ prefs, onSelect }: { prefs: Prefs; onSelect: (val: string) => void }) {
  const [selected, setSelected] = useState(prefs.level);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1.5">Какой у тебя уровень?</h2>
      <p className="text-[#64748B] text-sm mb-6">Выбери честно — это поможет построить правильный план</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {LEVELS.map(({ level, label, desc, color, time }) => {
          const active = selected === level;
          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(level); onSelect(level); }}
              className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                active
                  ? "border-[#6366F1] bg-[#6366F1]/10"
                  : "border-[#1E293B] bg-[#1E293B] hover:border-[#334155]"
              }`}
            >
              {active && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#6366F1] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="font-extrabold text-2xl mb-0.5" style={{ color }}>{level}</div>
              <div className="text-white text-xs font-semibold leading-tight">{label}</div>
              <div className="text-[#475569] text-xs mt-1 leading-tight">{desc}</div>
              <div className="mt-2 text-xs font-medium" style={{ color }}>до C1: ~{time}</div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => { setSelected("unknown"); onSelect("unknown"); }}
        className={`w-full p-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
          selected === "unknown"
            ? "border-[#6366F1] bg-[#6366F1]/10 text-white"
            : "border-[#1E293B] bg-[#1E293B] text-[#64748B] hover:border-[#334155] hover:text-white"
        }`}
      >
        🤔 Не знаю свой уровень — определим вместе
      </button>
    </div>
  );
}

// ─── Step 2: Daily Time ───────────────────────────────────────────────────────
const TIME_OPTIONS = [
  { minutes: 15, label: "15 минут", emoji: "🌱", mood: "Лёгкий старт", perDay: "1–2 урока в день", streak: "Медленный, но стабильный" },
  { minutes: 30, label: "30 минут", emoji: "🔥", mood: "Оптимально", perDay: "3–4 урока в день", streak: "Идеальный прогресс", recommended: true },
  { minutes: 60, label: "60 минут", emoji: "⚡", mood: "Активный", perDay: "5–6 уроков в день", streak: "Быстрый результат" },
  { minutes: 90, label: "90 минут", emoji: "🚀", mood: "Интенсивный", perDay: "8–10 уроков в день", streak: "Максимальная скорость" },
];

function TimeStep({ prefs, onSelect }: { prefs: Prefs; onSelect: (val: number) => void }) {
  const [selected, setSelected] = useState(prefs.minutes);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1.5">Сколько времени в день?</h2>
      <p className="text-[#64748B] text-sm mb-6">Ежедневная практика — ключ к прогрессу</p>

      <div className="space-y-3">
        {TIME_OPTIONS.map(({ minutes, label, emoji, mood, perDay, streak, recommended }) => {
          const active = selected === minutes;
          return (
            <motion.button
              key={minutes}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { setSelected(minutes); onSelect(minutes); }}
              className={`relative w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                active
                  ? "border-[#6366F1] bg-[#6366F1]/10"
                  : "border-[#1E293B] bg-[#1E293B] hover:border-[#334155]"
              }`}
            >
              {recommended && (
                <div className="absolute -top-2 right-3 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Рекомендуем
                </div>
              )}
              <div className="text-3xl">{emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{label}</span>
                  <span className="text-[#475569] text-xs">{mood}</span>
                </div>
                <div className="text-[#64748B] text-xs mt-0.5">{perDay}</div>
                <div className="text-[#6366F1] text-xs mt-0.5">{streak}</div>
              </div>
              {active && (
                <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3: Goal Selection ───────────────────────────────────────────────────
const GOALS = [
  { id: "travel", emoji: "🌍", title: "Путешествия и общение", desc: "Туризм, знакомства, общение с иностранцами", color: "#3B82F6" },
  { id: "business", emoji: "💼", title: "Бизнес и карьера", desc: "Работа, переговоры, резюме и собеседования", color: "#10B981" },
  { id: "exams", emoji: "🎓", title: "Экзамены IELTS/TOEFL", desc: "Поступление в вуз, визы, сертификаты", color: "#F59E0B" },
  { id: "general", emoji: "📚", title: "Общее развитие", desc: "Книги, фильмы, сериалы, интерес к языку", color: "#8B5CF6" },
];

function GoalStep({ prefs, onSelect }: { prefs: Prefs; onSelect: (val: string) => void }) {
  const [selected, setSelected] = useState(prefs.goal);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1.5">Какая цель?</h2>
      <p className="text-[#64748B] text-sm mb-6">Подберём уроки и темы под твою цель</p>

      <div className="grid grid-cols-1 gap-3">
        {GOALS.map(({ id, emoji, title, desc, color }) => {
          const active = selected === id;
          return (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { setSelected(id); onSelect(id); }}
              className={`relative text-left p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                active
                  ? "border-[#6366F1] bg-[#6366F1]/10"
                  : "border-[#1E293B] bg-[#1E293B] hover:border-[#334155]"
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                {emoji}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{title}</div>
                <div className="text-[#64748B] text-xs mt-0.5">{desc}</div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                  active ? "bg-[#6366F1] border-[#6366F1]" : "border-[#334155]"
                }`}
              >
                {active && <Check className="w-3 h-3 text-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Registration Form ────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCo, setShowCo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!name.trim()) return "Введи своё имя";
    if (!email.trim()) return "Введи email";
    if (password.length < 8) return "Пароль должен быть не менее 8 символов";
    if (password !== confirm) return "Пароли не совпадают";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(
        authError.message.includes("already registered") || authError.message.includes("already been registered")
          ? "Этот email уже зарегистрирован. Войди или восстанови пароль."
          : authError.message.includes("weak password")
          ? "Пароль слишком простой. Используй буквы, цифры и символы."
          : "Ошибка регистрации. Попробуй ещё раз."
      );
      setLoading(false);
    } else if (data.user) {
      onSuccess(name.trim());
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-sm">F</div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">Fluenta</span>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-1.5">Создай аккаунт</h1>
      <p className="text-[#64748B] mb-8">Первые 10 уроков бесплатно — без карты</p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 mb-6 text-sm text-[#EF4444]"
        >
          <span className="mt-0.5">⚠️</span>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Имя</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как тебя зовут?"
            autoComplete="name"
            className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3.5 text-white placeholder-[#475569] text-sm transition-colors outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ты@example.com"
            autoComplete="email"
            className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3.5 text-white placeholder-[#475569] text-sm transition-colors outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Пароль</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              autoComplete="new-password"
              className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3.5 pr-12 text-white placeholder-[#475569] text-sm transition-colors outline-none"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {[4, 6, 8, 12].map((len, i) => (
                <div key={i} className="h-1 flex-1 rounded-full transition-colors"
                  style={{ backgroundColor: password.length >= len ? ["#EF4444", "#F59E0B", "#10B981", "#6366F1"][i] : "#1E293B" }} />
              ))}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Подтвердить пароль</label>
          <div className="relative">
            <input
              type={showCo ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Повтори пароль"
              autoComplete="new-password"
              className={`w-full bg-[#1E293B] border rounded-xl px-4 py-3.5 pr-12 text-white placeholder-[#475569] text-sm transition-colors outline-none ${
                confirm.length > 0 && confirm !== password
                  ? "border-[#EF4444]/60"
                  : confirm.length > 0 && confirm === password
                  ? "border-[#10B981]/60"
                  : "border-[#334155] hover:border-[#475569] focus:border-[#6366F1]"
              }`}
            />
            <button type="button" onClick={() => setShowCo(!showCo)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
              {showCo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {confirm.length > 0 && confirm === password && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Check className="w-4 h-4 text-[#10B981]" />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Создаём аккаунт…" : "Создать аккаунт"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#1E293B]" />
        <span className="text-[#334155] text-xs font-medium">или</span>
        <div className="flex-1 h-px bg-[#1E293B]" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 transition-all"
      >
        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        {googleLoading ? "Подождите…" : "Зарегистрироваться через Google"}
      </button>

      <p className="text-center text-[#475569] text-sm mt-8">
        Уже есть аккаунт?{" "}
        <Link href="/auth/login" className="text-[#6366F1] hover:text-[#A78BFA] font-semibold transition-colors">Войти</Link>
      </p>
    </motion.div>
  );
}

// ─── Slide variants ───────────────────────────────────────────────────────────
const slide = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: "easeIn" as const } },
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [prefs, setPrefs] = useState<Prefs>({ level: "", minutes: 30, goal: "", name: "" });
  const [saving, setSaving] = useState(false);

  const handleFormSuccess = (name: string) => {
    setPrefs((p) => ({ ...p, name }));
    setStep("level");
  };

  const saveAndFinish = async (finalPrefs: Prefs) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name: finalPrefs.name,
        current_level: finalPrefs.level === "unknown" ? "A1" : finalPrefs.level,
        daily_goal_minutes: finalPrefs.minutes,
        goal_type: finalPrefs.goal,
      });
    }
    router.push("/dashboard");
  };

  const stepNum = step === "level" ? 1 : step === "time" ? 2 : step === "goal" ? 3 : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] grid lg:grid-cols-[45%_55%]">
      <LeftPanel />

      <div className="flex items-center justify-center px-6 py-12 lg:py-8">
        <div className="w-full max-w-md">
          {/* Onboarding progress (steps 1-3) */}
          {step !== "form" && <OnboardingProgress current={stepNum} total={3} />}

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div key="form" variants={slide} initial="enter" animate="center" exit="exit">
                <RegisterForm onSuccess={handleFormSuccess} />
              </motion.div>
            )}

            {step === "level" && (
              <motion.div key="level" variants={slide} initial="enter" animate="center" exit="exit">
                <LevelStep
                  prefs={prefs}
                  onSelect={(val) => setPrefs((p) => ({ ...p, level: val }))}
                />
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep("form")}
                    className="text-sm text-[#475569] hover:text-white transition-colors px-4 py-2">
                    ← Назад
                  </button>
                  <button
                    onClick={() => setStep("time")}
                    disabled={!prefs.level}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#5558E3] hover:to-[#7C3AED] transition-all hover:scale-105"
                  >
                    Далее <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "time" && (
              <motion.div key="time" variants={slide} initial="enter" animate="center" exit="exit">
                <TimeStep
                  prefs={prefs}
                  onSelect={(val) => setPrefs((p) => ({ ...p, minutes: val }))}
                />
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep("level")}
                    className="text-sm text-[#475569] hover:text-white transition-colors px-4 py-2">
                    ← Назад
                  </button>
                  <button
                    onClick={() => setStep("goal")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] transition-all hover:scale-105"
                  >
                    Далее <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "goal" && (
              <motion.div key="goal" variants={slide} initial="enter" animate="center" exit="exit">
                <GoalStep
                  prefs={prefs}
                  onSelect={(val) => setPrefs((p) => ({ ...p, goal: val }))}
                />
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep("time")}
                    className="text-sm text-[#475569] hover:text-white transition-colors px-4 py-2">
                    ← Назад
                  </button>
                  <button
                    onClick={() => saveAndFinish(prefs)}
                    disabled={!prefs.goal || saving}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#5558E3] hover:to-[#7C3AED] transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {saving ? "Сохраняем…" : "Начать обучение"}
                    {!saving && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Summary preview */}
                {prefs.level && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-[#1E293B] border border-[#334155] rounded-xl p-4"
                  >
                    <div className="text-xs text-[#475569] mb-2 font-medium uppercase tracking-wide">Твой план</div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-[#94A3B8]">Уровень: </span>
                        <span className="text-white font-semibold">{prefs.level === "unknown" ? "Определим тестом" : prefs.level}</span>
                      </div>
                      <div className="w-px h-4 bg-[#334155]" />
                      <div>
                        <span className="text-[#94A3B8]">В день: </span>
                        <span className="text-white font-semibold">{prefs.minutes} мин</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
