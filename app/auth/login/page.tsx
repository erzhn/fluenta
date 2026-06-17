"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!signInError) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    // User may not exist yet — try to sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (!signUpError && data.user) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    // Both failed → wrong password for an existing account
    setError("Неверный пароль. Попробуй ещё раз.");
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-base shadow-xl shadow-indigo-500/30">
          F
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
          Fluenta
        </span>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-2">
        Добро пожаловать в Fluenta 👋
      </h1>
      <p className="text-[#64748B] mb-8 text-sm">
        Введи email чтобы войти или создать аккаунт
      </p>

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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
            Email
          </label>
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

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
            Пароль
          </label>
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Входим…" : "Войти / Зарегистрироваться"}
        </button>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
