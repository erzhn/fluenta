"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, CheckCircle2 } from "lucide-react";

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
          className="inline-flex"
        >
          <Flame className="w-5 h-5 text-[#F59E0B]" fill="#F59E0B" strokeWidth={1.5} />
        </motion.span>
        <span className="font-bold text-white text-sm">{streak}</span>
        <span className="text-muted-foreground text-xs">дн.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        className="mb-2"
      >
        <Flame className="w-12 h-12 text-[#F59E0B]" fill="#F59E0B" strokeWidth={1.25} />
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

      <div className="text-muted-foreground text-sm mt-0.5">дней подряд</div>

      <AnimatePresence>
        {!hasActivityToday && streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 flex items-center gap-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-3 py-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={2} />
            <span className="text-[#F59E0B] text-xs font-medium">Не забудь позаниматься сегодня!</span>
          </motion.div>
        )}
        {streak === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-muted-foreground text-xs"
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
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={2} />
            <span className="text-[#10B981] text-xs font-medium">Цель сегодня выполнена!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
