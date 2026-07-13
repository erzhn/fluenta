"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Zap, Lock, BookOpen } from "lucide-react";
import type { Lesson } from "@/lib/lessons-data";
import { LEVEL_COLORS } from "@/lib/lessons-data";

interface LessonCardProps {
  lesson: Lesson;
  locked?: boolean;
  progress?: { completed: boolean; score: number };
}

const XP: Record<string, number> = { A1: 50, A2: 75, B1: 100, B2: 150, C1: 200 };

export function LessonCard({ lesson, locked, progress }: LessonCardProps) {
  const color = LEVEL_COLORS[lesson.level] ?? "#6366F1";
  const completed = progress?.completed;

  const card = (
    <motion.div
      whileHover={locked ? {} : { y: -2, scale: 1.01 }}
      whileTap={locked ? {} : { scale: 0.99 }}
      className={`relative flex flex-col h-full rounded-xl border transition-all overflow-hidden ${
        locked
          ? "border-[hsl(var(--card-border))] bg-[hsl(var(--background-secondary))] opacity-70 cursor-not-allowed"
          : completed
          ? "border-green-200 dark:border-green-900/30 bg-[hsl(var(--card))] hover:border-green-400 dark:hover:border-green-700"
          : "border-[hsl(var(--card-border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))/50] hover:shadow-md"
      }`}
    >
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-extrabold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: `${color}18`, color }}>
            {lesson.level}
          </div>
          <div className="flex items-center gap-2">
            {completed && <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Пройдено</span>}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              {locked ? <Lock className="w-3.5 h-3.5" style={{ color }} /> : <BookOpen className="w-3.5 h-3.5" style={{ color }} />}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-[hsl(var(--foreground))] text-sm leading-snug mb-1">{lesson.title}</h3>
        <p className="text-[hsl(var(--foreground-subtle))] text-xs mb-4">Блок {lesson.block} · {lesson.blockName}</p>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-[hsl(var(--foreground-muted))] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{lesson.duration}
            </span>
            <span className="flex items-center gap-1" style={{ color }}>
              <Zap className="w-3.5 h-3.5" />+{XP[lesson.level] ?? 50} XP
            </span>
          </div>

          <div
            className={`w-full py-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
              locked
                ? "bg-[hsl(var(--background-secondary))] text-[hsl(var(--foreground-muted))]"
                : completed
                ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                : "text-white"
            }`}
            style={locked || completed ? {} : { background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}
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
