"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Zap, Lock, BookOpen, MessageCircle, Mic, PenLine, Layers, GraduationCap } from "lucide-react";
import type { Lesson, LessonCategory } from "@/lib/lessons-data";
import { LEVEL_COLORS } from "@/lib/lessons-data";

const CATEGORY_ICONS: Record<LessonCategory, React.ElementType> = {
  Grammar: BookOpen,
  Vocabulary: Layers,
  Reading: GraduationCap,
  Speaking: Mic,
  Writing: PenLine,
};

interface LessonCardProps {
  lesson: Lesson;
  locked?: boolean;
  progress?: { completed: boolean; score: number };
}

export function LessonCard({ lesson, locked, progress }: LessonCardProps) {
  const color = LEVEL_COLORS[lesson.level];
  const Icon = CATEGORY_ICONS[lesson.category];
  const doneCount = progress?.score ?? 0;
  const completed = progress?.completed;

  const card = (
    <motion.div
      whileHover={locked ? {} : { y: -2, scale: 1.01 }}
      whileTap={locked ? {} : { scale: 0.99 }}
      className={`relative flex flex-col h-full rounded-2xl border transition-all overflow-hidden ${
        locked
          ? "border-[#1E293B] bg-[#0D1628] opacity-70 cursor-not-allowed"
          : completed
          ? "border-[#10B981]/30 bg-[#1E293B] hover:border-[#10B981]/60"
          : "border-[#334155] bg-[#1E293B] hover:border-[#6366F1]/50 hover:shadow-lg hover:shadow-[#6366F1]/5"
      }`}
    >
      {/* Top color strip */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      <div className="flex flex-col flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="text-xs font-extrabold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {lesson.level}
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                ✓ Пройдено
              </span>
            )}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              {locked ? (
                <Lock className="w-3.5 h-3.5" style={{ color }} />
              ) : (
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-sm leading-snug mb-1 group-hover:text-[#6366F1] transition-colors">
          {lesson.titleRu}
        </h3>
        <p className="text-[#475569] text-xs mb-4">{lesson.category}</p>

        {/* Progress bar */}
        {(progress || completed) && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-[#475569] mb-1">
              <span>{completed ? "Завершено" : `${doneCount}/5 упражнений`}</span>
              <span>{completed ? "100%" : `${Math.round((doneCount / 5) * 100)}%`}</span>
            </div>
            <div className="h-1.5 bg-[#334155] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: completed ? "100%" : `${(doneCount / 5) * 100}%`,
                  backgroundColor: completed ? "#10B981" : color,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto">
          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-[#475569] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lesson.duration} мин
            </span>
            <span className="flex items-center gap-1" style={{ color }}>
              <Zap className="w-3.5 h-3.5" />+{lesson.xpReward} XP
            </span>
          </div>

          {/* CTA button */}
          <div
            className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
              locked
                ? "bg-[#0F172A] text-[#334155]"
                : completed
                ? "bg-[#10B981]/15 text-[#10B981]"
                : "text-white"
            }`}
            style={
              locked || completed
                ? {}
                : { background: `linear-gradient(135deg, ${color}dd, ${color}99)` }
            }
          >
            {locked ? "🔒 Недоступно" : completed ? "Повторить урок" : "Начать →"}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (locked) return <div className="h-full">{card}</div>;
  return <Link href={`/lessons/${lesson.id}`} className="h-full block">{card}</Link>;
}
