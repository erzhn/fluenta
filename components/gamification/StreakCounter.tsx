"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StreakCounterProps {
  streak: number;
  hasActivityToday?: boolean;
  compact?: boolean;
}

export function StreakCounter({ streak, hasActivityToday = true, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <motion.span
          animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3 }}
          className="text-lg"
        >
          🔥
        </motion.span>
        <span className="font-bold text-white text-sm">{streak}</span>
        <span className="text-[#475569] text-xs">дн.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        className="text-5xl mb-2"
      >
        🔥
      </motion.div>

      <motion.div
        key={streak}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-4xl font-extrabold text-white"
      >
        {streak}
      </motion.div>

      <div className="text-[#64748B] text-sm mt-0.5">дней подряд</div>

      <AnimatePresence>
        {!hasActivityToday && streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 flex items-center gap-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-3 py-1.5"
          >
            <span className="text-sm">⚠️</span>
            <span className="text-[#F59E0B] text-xs font-medium">Не забудь позаниматься сегодня!</span>
          </motion.div>
        )}
        {streak === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-[#475569] text-xs"
          >
            Начни серию сегодня!
          </motion.div>
        )}
        {streak > 0 && hasActivityToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl px-3 py-1.5"
          >
            <span className="text-sm">✅</span>
            <span className="text-[#10B981] text-xs font-medium">Цель сегодня выполнена!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
