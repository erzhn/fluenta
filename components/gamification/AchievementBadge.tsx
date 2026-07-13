"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { AchievementWithStatus } from "@/lib/gamification";

// Mini confetti for the celebration overlay
function MiniConfetti() {
  const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: 20 + Math.random() * 60,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    size: 5 + Math.random() * 7,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -10, x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: "105%", opacity: 0, rotate: 540 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, top: 0 }}
        />
      ))}
    </div>
  );
}

// Full-screen celebration when newly unlocked
function UnlockCelebration({ achievement, onClose }: { achievement: AchievementWithStatus; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <MiniConfetti />

      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[hsl(var(--background))] border border-[hsl(var(--accent))]/40 rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl"
        style={{ boxShadow: "0 0 60px #6366F140" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--foreground-subtle))] hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-xs font-bold tracking-widest text-[hsl(var(--accent))] uppercase mb-4">
          Достижение разблокировано!
        </div>

        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-7xl mb-5"
        >
          {achievement.icon}
        </motion.div>

        <h3 className="text-white font-extrabold text-xl mb-2">{achievement.title}</h3>
        <p className="text-[hsl(var(--foreground-muted))] text-sm mb-6">{achievement.desc}</p>

        <div className="flex items-center justify-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-4 py-2 mb-6">
          <span className="text-[#F59E0B] font-bold">+{achievement.xp_reward} XP</span>
          <span className="text-[hsl(var(--foreground-muted))] text-sm">заработано</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-sm"
        >
          Отлично! 🎉
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface AchievementBadgeProps {
  achievement: AchievementWithStatus;
  showCelebration?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AchievementBadge({ achievement, showCelebration = false, size = "md" }: AchievementBadgeProps) {
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (showCelebration && achievement.unlocked) {
      const t = setTimeout(() => setCelebrating(true), 600);
      return () => clearTimeout(t);
    }
  }, [showCelebration, achievement.unlocked]);

  const pad = size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";
  const iconSize = size === "sm" ? "w-10 h-10 text-xl" : size === "lg" ? "w-16 h-16 text-3xl" : "w-12 h-12 text-2xl";
  const titleSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`relative flex flex-col items-center ${pad} rounded-2xl border text-center transition-all cursor-default overflow-hidden ${
          achievement.unlocked
            ? "bg-[hsl(var(--background-secondary))] border-[hsl(var(--accent))]/30 hover:border-[hsl(var(--accent))]/60"
            : "bg-[#0D1628] border-[#1E293B] opacity-70"
        }`}
        style={achievement.unlocked ? { boxShadow: "0 0 20px #6366F108" } : {}}
      >
        {/* Glow for unlocked */}
        {achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/5 to-transparent pointer-events-none rounded-2xl" />
        )}

        {/* Icon */}
        <div
          className={`${iconSize} rounded-2xl flex items-center justify-center mb-2.5 relative`}
          style={{ backgroundColor: achievement.unlocked ? "#6366F120" : "#1E293B" }}
        >
          {achievement.unlocked ? (
            <span>{achievement.icon}</span>
          ) : (
            <span className="opacity-30 grayscale">{achievement.icon}</span>
          )}
        </div>

        <div className={`${titleSize} font-bold text-white leading-snug mb-1`}>{achievement.title}</div>
        <div className="text-[hsl(var(--foreground-subtle))] text-xs leading-snug">{achievement.desc}</div>

        {achievement.unlocked ? (
          <div className="mt-2 text-xs text-[#F59E0B] font-semibold">+{achievement.xp_reward} XP</div>
        ) : (
          achievement.progress !== undefined && achievement.progress > 0 && (
            <div className="mt-2.5 w-full">
              <div className="h-1 bg-[hsl(var(--background-secondary))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-[#334155] rounded-full"
                />
              </div>
              <div className="text-[10px] text-[#334155] mt-1">{achievement.progress}%</div>
            </div>
          )
        )}
      </motion.div>

      <AnimatePresence>
        {celebrating && (
          <UnlockCelebration
            key="celebration"
            achievement={achievement}
            onClose={() => setCelebrating(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
