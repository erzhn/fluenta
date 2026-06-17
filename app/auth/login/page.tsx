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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    alert("Button clicked!");
    console.log("[Auth] form submitted", { email: email.trim(), passwordLength: password.length });

    if (!email || !password) {
      console.log("[Auth] missing email or password");
      return;
    }

    setLoading(true);
    setError(null);
    setDebugInfo(null);

    // Check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log("[Auth] env check", {
      hasUrl: !!supabaseUrl && !supabaseUrl.includes("placeholder"),
      hasKey: !!supabaseKey && !supabaseKey.includes("placeholder"),
      url: supabaseUrl?.slice(0, 30),
    });

    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      setError("Ошибка конфигурации: NEXT_PUBLIC_SUPABASE_URL не задан.");
      setDebugInfo(`URL: ${supabaseUrl}`);
      setLoading(false);
      return;
    }

    try {
      // Step 1: try sign in
      console.log("[Auth] trying signInWithPassword…");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      console.log("[Auth] signIn result", { user: signInData?.user?.id, error: signInError?.message });

      if (!signInError && signInData?.session) {
        console.log("[Auth] sign in success, redirecting to", redirectTo);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Step 2: user may not exist yet — try sign up
      console.log("[Auth] sign in failed, trying signUp…", signInError?.message);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      console.log("[Auth] signUp result", {
        user: signUpData?.user?.id,
        session: !!signUpData?.session,
        error: signUpError?.message,
      });

      if (!signUpError && signUpData?.user) {
        if (signUpData.session) {
          // Auto-confirmed — already have a session
          console.log("[Auth] signUp with auto-confirm, redirecting…");
          router.push("/dashboard");
          router.refresh();
          return;
        }

        // No session yet (email confirmation required in Supabase dashboard).
        // Try signing in immediately in case it was just created.
        console.log("[Auth] signUp succeeded but no session, retrying signIn…");
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        console.log("[Auth] retry signIn result", { session: !!retryData?.session, error: retryError?.message });

        if (!retryError && retryData?.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        // Account created but email confirmation is required
        setError("Аккаунт создан! Проверь почту и подтверди email, затем войди снова.");
        setLoading(false);
        return;
      }

      // Both failed — wrong password for existing account
      const msg = signUpError?.message || signInError?.message || "unknown";
      console.log("[Auth] both failed", { signInError: signInError?.message, signUpError: signUpError?.message });
      setError("Неверный пароль. Попробуй ещё раз.");
      setDebugInfo(`Debug: signIn="${signInError?.message}" signUp="${msg}"`);
    } catch (err) {
      console.error("[Auth] unexpected error", err);
      setError(`Неожиданная ошибка: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
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
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Входим…" : "Войти / Зарегистрироваться"}
        </button>

        {error && (
          <div className="flex flex-col gap-1 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 text-sm text-[#EF4444]">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
            {debugInfo && (
              <p className="text-[#EF4444]/60 text-xs font-mono mt-1 break-all">{debugInfo}</p>
            )}
          </div>
        )}
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
