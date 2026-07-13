"use client";

import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Layers, PenLine, GraduationCap, Briefcase } from "lucide-react";
import type { TutorMode } from "@/types";

interface ModeConfig {
  value: TutorMode;
  emoji: string;
  icon: React.ElementType;
  label: string;
  labelRu: string;
  desc: string;
  color: string;
}

export const MODES: ModeConfig[] = [
  {
    value: "conversation",
    emoji: "💬",
    icon: MessageCircle,
    label: "Разговор",
    labelRu: "Свободная беседа",
    desc: "Практикуй живой English",
    color: "#6366F1",
  },
  {
    value: "grammar",
    emoji: "📝",
    icon: BookOpen,
    label: "Грамматика",
    labelRu: "Разбор правил",
    desc: "Учись без ошибок",
    color: "#8B5CF6",
  },
  {
    value: "vocabulary",
    emoji: "📚",
    icon: Layers,
    label: "Словарь",
    labelRu: "Новые слова",
    desc: "Расширяй лексику",
    color: "#3B82F6",
  },
  {
    value: "writing",
    emoji: "✍️",
    icon: PenLine,
    label: "Письмо",
    labelRu: "Улучшение текстов",
    desc: "Пиши как носитель",
    color: "#10B981",
  },
  {
    value: "exams",
    emoji: "🎓",
    icon: GraduationCap,
    label: "Экзамены",
    labelRu: "IELTS / TOEFL",
    desc: "Подготовка к тестам",
    color: "#F59E0B",
  },
  {
    value: "business",
    emoji: "💼",
    icon: Briefcase,
    label: "Бизнес",
    labelRu: "Деловой английский",
    desc: "Карьера и переговоры",
    color: "#EF4444",
  },
];

interface ModeSelectorProps {
  mode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
  layout?: "sidebar" | "sheet";
}

export function ModeSelector({ mode, onModeChange, layout = "sidebar" }: ModeSelectorProps) {
  if (layout === "sheet") {
    return (
      <div className="grid grid-cols-2 gap-2.5 p-4">
        {MODES.map((m) => {
          const active = mode === m.value;
          return (
            <motion.button
              key={m.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => onModeChange(m.value)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-[#1E293B] bg-background hover:border-border"
              }`}
            >
              <div className="text-xl mb-1">{m.emoji}</div>
              <div className="font-semibold text-white text-sm">{m.label}</div>
              <div className="text-muted-foreground text-xs mt-0.5">{m.desc}</div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Sidebar layout — vertical list
  return (
    <div className="space-y-1 px-3">
      {MODES.map((m) => {
        const active = mode === m.value;
        const Icon = m.icon;
        return (
          <motion.button
            key={m.value}
            whileHover={{ x: active ? 0 : 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onModeChange(m.value)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
              active
                ? "bg-primary/15 border border-primary/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
              style={{
                backgroundColor: active ? `${m.color}25` : "#1E293B",
                color: active ? m.color : "#64748B",
              }}
            >
              {m.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-sm font-semibold leading-tight truncate"
                style={{ color: active ? m.color : "#CBD5E1" }}
              >
                {m.label}
              </div>
              <div className="text-muted-foreground text-xs truncate">{m.labelRu}</div>
            </div>
            {active && (
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: m.color }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
