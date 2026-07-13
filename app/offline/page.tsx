"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WifiOff, RefreshCw, BookOpen, Brain } from "lucide-react";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-[#6366F1]/30">
          F
        </div>
      </motion.div>

      {/* Offline icon */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center">
          <WifiOff className="w-9 h-9 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-8 max-w-sm"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Нет подключения</h1>
        <p className="text-muted-foreground leading-relaxed">
          Не удалось подключиться к интернету. Проверь соединение и попробуй снова.
        </p>
      </motion.div>

      {/* What you can do */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 mb-6"
      >
        <p className="text-muted-foreground text-sm font-medium mb-3 text-center">В офлайн-режиме доступно</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span>Ранее загруженные уроки</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <span>Слова в словаре</span>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:from-[#5558E3] hover:to-[#7C3AED] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Попробовать снова
        </button>
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-full py-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-white hover:border-[#475569] text-sm font-medium transition-all"
        >
          На главную
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-[#334155] text-xs"
      >
        Fluenta работает офлайн в ограниченном режиме
      </motion.p>
    </div>
  );
}
