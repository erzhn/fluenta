"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Home, Plus } from "lucide-react";
import Link from "next/link";
import { FlashCard } from "./FlashCard";
import { ratingToWordUpdate } from "@/lib/srs";
import { supabase } from "@/lib/supabase";
import type { VocabWord } from "@/types";
import type { Rating } from "@/lib/srs";

interface ReviewSessionProps {
  words: VocabWord[];
  onComplete: (results: { correct: number; xp: number }) => void;
  onExit: () => void;
}

const RATINGS: { rating: Rating; emoji: string; label: string; color: string; bg: string; key: string }[] = [
  { rating: 1, emoji: "😵", label: "Забыл",  color: "#EF4444", bg: "#EF444415", key: "1" },
  { rating: 2, emoji: "😰", label: "Сложно", color: "#F97316", bg: "#F9731615", key: "2" },
  { rating: 3, emoji: "😊", label: "Хорошо", color: "#6366F1", bg: "#6366F115", key: "3" },
  { rating: 4, emoji: "🚀", label: "Легко",  color: "#10B981", bg: "#10B98115", key: "4" },
];

// ─── Session Complete ─────────────────────────────────────────────────────────
function SessionComplete({
  total, correct, xp, ratingCounts, onRetry, onExit,
}: {
  total: number; correct: number; xp: number;
  ratingCounts: Record<Rating, number>;
  onRetry: () => void; onExit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>

      <h2 className="text-2xl font-extrabold text-white mb-1">Отличная работа!</h2>
      <p className="text-[hsl(var(--foreground-muted))] text-sm mb-6">Сессия повторения завершена</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6">
        {[
          { label: "Всего", value: total, color: "#6366F1" },
          { label: "Хорошо знал", value: correct, color: "#10B981" },
          { label: "XP заработано", value: `+${xp}`, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] rounded-xl p-3">
            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[hsl(var(--foreground-subtle))] text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rating breakdown */}
      <div className="flex gap-2 justify-center mb-6 w-full max-w-xs">
        {RATINGS.map((r) => (
          <div key={r.rating} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full py-1.5 rounded-lg text-xs font-bold text-center"
              style={{ backgroundColor: r.bg, color: r.color }}
            >
              {ratingCounts[r.rating] || 0}
            </div>
            <span className="text-[10px] text-[#334155]">{r.emoji}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] text-white text-sm font-semibold hover:border-[#475569] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Ещё раз
        </button>
        <Link
          href="/vocabulary"
          onClick={onExit}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-bold"
        >
          Добавить слова
          <Plus className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 py-2 text-[hsl(var(--foreground-subtle))] text-sm hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Review Session ───────────────────────────────────────────────────────────
export function ReviewSession({ words, onComplete, onExit }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratingCounts, setRatingCounts] = useState<Record<Rating, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [saving, setSaving] = useState(false);

  const currentWord = words[currentIndex];
  const isLast = currentIndex === words.length - 1;

  const handleRating = useCallback(async (rating: Rating) => {
    if (!flipped || saving) return;
    setSaving(true);

    const update = ratingToWordUpdate(currentWord, rating);
    // Save to Supabase (non-fatal)
    try {
      await supabase.from("vocabulary").update(update).eq("id", currentWord.id);
    } catch { /* ignore */ }

    const gained = rating >= 3 ? (rating === 4 ? 10 : 5) : 0;
    const isCorrect = rating >= 3;

    setRatingCounts((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    if (isCorrect) setCorrect((c) => c + 1);
    setXp((x) => x + gained);

    if (isLast) {
      setDone(true);
      onComplete({ correct: correct + (isCorrect ? 1 : 0), xp: xp + gained });
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
    setSaving(false);
  }, [flipped, saving, currentWord, isLast, correct, xp, onComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (flipped && ["1","2","3","4"].includes(e.key)) {
        handleRating(parseInt(e.key) as Rating);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, handleRating]);

  if (done) {
    return (
      <SessionComplete
        total={words.length}
        correct={correct}
        xp={xp}
        ratingCounts={ratingCounts}
        onRetry={() => { setCurrentIndex(0); setFlipped(false); setRatingCounts({ 1:0,2:0,3:0,4:0 }); setDone(false); setCorrect(0); setXp(0); }}
        onExit={onExit}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-[hsl(var(--foreground-muted))] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Выйти
        </button>
        <div className="flex-1 h-1.5 bg-[hsl(var(--background-secondary))] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(currentIndex / words.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-[hsl(var(--accent))] rounded-full"
          />
        </div>
        <span className="text-[hsl(var(--foreground-subtle))] text-sm tabular-nums shrink-0">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <FlashCard word={currentWord} forceFlipped={flipped} onFlip={setFlipped} />
        </motion.div>
      </AnimatePresence>

      {/* Rating buttons — appear after flip */}
      <div className="mt-5">
        <AnimatePresence>
          {flipped ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <p className="text-center text-[hsl(var(--foreground-subtle))] text-xs mb-3">
                Как хорошо ты знал это слово? <span className="text-[#334155]">(клавиши 1–4)</span>
              </p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map((r) => (
                  <motion.button
                    key={r.rating}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRating(r.rating)}
                    disabled={saving}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border font-semibold text-sm transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: r.bg,
                      borderColor: `${r.color}30`,
                      color: r.color,
                    }}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-xs">{r.label}</span>
                    <span className="text-[10px] opacity-50">[{r.key}]</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <button
                onClick={() => setFlipped(true)}
                className="px-8 py-3 rounded-xl bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/50 text-white text-sm font-semibold transition-all hover:scale-[1.02]"
              >
                Показать перевод ↓
              </button>
              <p className="text-[#334155] text-xs mt-2">или нажми Пробел</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
