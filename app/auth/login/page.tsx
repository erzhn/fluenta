"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// IMPORTANT: Go to Supabase → Authentication → URL Configuration
// Add to Redirect URLs: https://fluentacademy-englishapp.vercel.app/auth/callback

const REDIRECT_URL = "https://fluentacademy-englishapp.vercel.app/auth/callback";
const RESEND_COOLDOWN = 60;

function AuthForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(urlError || null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendLink = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: REDIRECT_URL,
        },
      });

      if (otpError) {
        setError(otpError.message);
      } else {
        setSent(true);
        setCountdown(RESEND_COOLDOWN);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (countdown > 0) return;
    await sendLink();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-base shadow-xl shadow-indigo-500/30">
          F
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
          Fluenta
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          /* ── Email form ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Войти в Fluenta ✨
            </h1>
            <p className="text-[#64748B] mb-8 text-sm">
              Введи email — мы отправим тебе ссылку для входа
            </p>

            {error && (
              <div className="flex items-start gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 mb-6 text-sm text-[#EF4444]">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={sendLink} noValidate>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ты@example.com"
                    autoComplete="email"
                    autoFocus
                    required
                    className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-[#475569] text-sm transition-colors outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={sendLink}
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {loading ? "Отправляем…" : "Отправить ссылку →"}
              </button>
            </form>
          </motion.div>
        ) : (
          /* ── Success screen ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-6xl mb-6"
            >
              ✅
            </motion.div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              Письмо отправлено!
            </h2>
            <p className="text-[#94A3B8] text-sm mb-1">
              Проверь почту{" "}
              <span className="text-white font-medium">{email}</span>{" "}
              и нажми на ссылку
            </p>
            <p className="text-[#475569] text-sm mb-8">
              Письмо придёт в течение 1 минуты
            </p>

            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl px-5 py-4 mb-6 text-sm text-[#64748B]">
              Не видишь? Проверь папку{" "}
              <span className="text-[#94A3B8] font-medium">Спам</span>
            </div>

            <button
              onClick={resend}
              disabled={countdown > 0}
              className="w-full py-3.5 rounded-xl font-semibold text-sm border transition-all disabled:opacity-50 disabled:cursor-not-allowed border-[#334155] text-[#94A3B8] hover:border-[#475569] hover:text-white"
            >
              {countdown > 0
                ? `Отправить снова (${countdown}с)`
                : "Отправить снова"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
