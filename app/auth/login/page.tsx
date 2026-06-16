"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, BookOpen, Brain, Mic, Trophy, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

// ─── Left decorative panel ────────────────────────────────────────────────────
function LeftPanel() {
  const CHIPS = [
    { icon: Brain, text: "AI-репетитор 24/7", color: "#6366F1", delay: 0.6 },
    { icon: Mic, text: "Оценка произношения", color: "#8B5CF6", delay: 0.75 },
    { icon: BookOpen, text: "500+ уроков", color: "#3B82F6", delay: 0.9 },
    { icon: Trophy, text: "Геймификация", color: "#10B981", delay: 1.05 },
    { icon: Zap, text: "SRS флэшкарты", color: "#F59E0B", delay: 1.2 },
  ];

  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center h-full overflow-hidden bg-gradient-to-br from-[#0D1428] via-[#0F172A] to-[#0D1428]">
      {/* Background glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)", filter: "blur(70px)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)", filter: "blur(70px)" }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-indigo-500/30">
            F
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            Fluenta
          </span>
        </motion.div>

        {/* Main quote */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl font-extrabold text-white leading-tight mb-4"
        >
          Каждый день —<br />
          <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
            шаг к свободному
          </span>
          <br />английскому
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#64748B] text-sm mb-10"
        >
          Уже 50,000+ учеников учатся с Fluenta
        </motion.p>

        {/* Feature chips */}
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex gap-6 mt-10"
        >
          {[{ val: "4.9★", label: "Рейтинг" }, { val: "6 мес", label: "До C1" }, { val: "30 мин", label: "В день" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-white font-bold text-lg leading-none">{s.val}</div>
              <div className="text-[#475569] text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Login Form (inner, uses searchParams) ────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError || null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(
        authError.message.includes("Invalid login credentials")
          ? "Неверный email или пароль"
          : authError.message.includes("Email not confirmed")
          ? "Подтверди email перед входом. Проверь почту."
          : authError.message.includes("Too many requests")
          ? "Слишком много попыток. Подожди минуту."
          : "Ошибка входа. Попробуй ещё раз."
      );
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (oauthError) {
      setError("Ошибка входа через Google. Попробуй ещё раз.");
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-sm">F</div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">Fluenta</span>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-1.5">С возвращением!</h1>
      <p className="text-[#64748B] mb-8">Войди в свой аккаунт, чтобы продолжить</p>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 mb-6 text-sm text-[#EF4444]"
        >
          <span className="text-base mt-0.5">⚠️</span>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ты@example.com"
            autoComplete="email"
            required
            className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3.5 text-white placeholder-[#475569] text-sm transition-colors outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-[#94A3B8]">Пароль</label>
            <Link href="/auth/forgot-password" className="text-xs text-[#6366F1] hover:text-[#A78BFA] transition-colors">
              Забыл пароль?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              autoComplete="current-password"
              required
              className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3.5 pr-12 text-white placeholder-[#475569] text-sm transition-colors outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={remember}
            onClick={() => setRemember(!remember)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              remember ? "bg-[#6366F1] border-[#6366F1]" : "border-[#334155] hover:border-[#475569]"
            }`}
          >
            {remember && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span
            className="text-sm text-[#64748B] cursor-pointer select-none"
            onClick={() => setRemember(!remember)}
          >
            Запомнить меня
          </span>
        </div>

        {/* Sign in button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#1E293B]" />
        <span className="text-[#334155] text-xs font-medium">или</span>
        <div className="flex-1 h-px bg-[#1E293B]" />
      </div>

      {/* Google button */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        {googleLoading ? "Подождите…" : "Войти через Google"}
      </button>

      {/* Footer link */}
      <p className="text-center text-[#475569] text-sm mt-8">
        Нет аккаунта?{" "}
        <Link href="/auth/register" className="text-[#6366F1] hover:text-[#A78BFA] font-semibold transition-colors">
          Зарегистрируйся
        </Link>
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] grid lg:grid-cols-[45%_55%]">
      <LeftPanel />
      <div className="flex items-center justify-center px-6 py-12 lg:py-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
