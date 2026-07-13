"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8 max-w-sm"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Что-то пошло не так</h1>
        <p className="text-[hsl(var(--foreground-muted))] leading-relaxed">
          Произошла непредвиденная ошибка. Попробуй обновить страницу.
        </p>
        {error.digest && (
          <p className="text-[#334155] text-xs mt-3 font-mono">ID: {error.digest}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:from-[#5558E3] hover:to-[#7C3AED] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Попробовать снова
        </button>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] hover:text-white hover:border-[#475569] text-sm font-medium transition-all"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
      </motion.div>
    </div>
  );
}
