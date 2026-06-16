"use client";

import { motion } from "framer-motion";
import { getLevelFromXP } from "@/lib/gamification";

interface XPBarProps {
  xp: number;
  showLabels?: boolean;
  compact?: boolean;
  // Legacy props kept for backward compat
  current?: number;
  needed?: number;
  percent?: number;
}

export function XPBar({ xp, showLabels = true, compact = false, current: legacyCurrent, needed: legacyNeeded, percent: legacyPercent }: XPBarProps) {
  const info = xp != null ? getLevelFromXP(xp) : null;
  const pct = info?.progress ?? legacyPercent ?? 0;
  const cur = info?.current ?? legacyCurrent ?? 0;
  const nxt = info?.next ?? legacyNeeded ?? 100;
  const levelName = info?.name ?? "";
  const nextName = info && info.level < 7 ? (() => {
    const { LEVEL_NAMES } = require("@/lib/gamification");
    return LEVEL_NAMES[info.level + 1];
  })() : "";

  const barH = compact ? "h-2" : "h-3";

  return (
    <div className="w-full">
      {showLabels && !compact && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#94A3B8] text-xs font-medium">{levelName}</span>
          <span className="text-[#94A3B8] text-xs">{nextName}</span>
        </div>
      )}
      <div className={`${barH} bg-[#1E293B] rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] relative"
        >
          <div className="absolute inset-0 bg-white/10 rounded-full" />
        </motion.div>
      </div>
      {showLabels && (
        <div className="flex justify-between text-[10px] text-[#475569] mt-1.5">
          <span>{cur.toLocaleString()} XP</span>
          <span>{nxt.toLocaleString()} XP</span>
        </div>
      )}
    </div>
  );
}
