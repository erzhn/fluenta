"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, X, Loader2, Volume2, ChevronDown,
  SortAsc, Sparkles, BookOpen, Target, Check, Clock,
} from "lucide-react";
import { ReviewSession } from "@/components/vocabulary/ReviewSession";
import { getDueWords, getRetentionRate } from "@/lib/srs";
import { supabase } from "@/lib/supabase";
import type { VocabWord } from "@/types";

type FilterType = "all" | "learning" | "mastered" | "new";
type SortType = "date" | "alpha" | "difficulty";

const FILTER_LABELS: Record<FilterType, string> = {
  all: "Все", learning: "Изучаю", mastered: "Выучено", new: "Новые",
};
const SORT_LABELS: Record<SortType, string> = {
  date: "По дате", alpha: "По алфавиту", difficulty: "По сложности",
};

function getStatus(w: VocabWord): FilterType {
  if (w.repetitions === 0) return "new";
  if (w.interval >= 21) return "mastered";
  return "learning";
}

const STATUS_COLORS: Record<FilterType, string> = {
  new: "#6366F1", learning: "#F59E0B", mastered: "#10B981", all: "#334155",
};
const STATUS_LABELS: Record<FilterType, string> = {
  new: "Новое", learning: "Изучаю", mastered: "Выучено", all: "Все",
};

function speak(text: string) {
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ─── Word Card ────────────────────────────────────────────────────────────────
function WordCard({ word, onDelete }: { word: VocabWord; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(word);
  const color = STATUS_COLORS[status];

  const nextReviewStr = (() => {
    const d = new Date(word.next_review);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);
    if (diffDays <= 0) return "Сейчас";
    if (diffDays === 1) return "Завтра";
    if (diffDays < 7) return `Через ${diffDays} дн.`;
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-[#1E293B] border rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
        expanded ? "border-[#6366F1]/40" : "border-[#334155] hover:border-[#475569]"
      }`}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Color strip */}
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-base">{word.word}</span>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.word); }}
                className="text-[#475569] hover:text-[#6366F1] transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {word.phonetic && (
              <div className="text-[#64748B] font-mono text-xs mt-0.5">{word.phonetic}</div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {STATUS_LABELS[status]}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#334155] transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="text-[#94A3B8] text-sm mt-1">{word.translation}</div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-[#1E293B] space-y-2.5">
                {word.context && (
                  <div className="text-[#64748B] text-xs italic leading-relaxed">
                    "{word.context}"
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#475569]">
                    <Clock className="w-3 h-3" />
                    {nextReviewStr}
                    {word.interval > 1 && <span className="text-[#334155]">· {word.interval} дн.</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(word.id); }}
                    className="text-[#334155] hover:text-[#EF4444] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Add Word Modal ───────────────────────────────────────────────────────────
function AddWordModal({
  onClose,
  onSave,
  userId,
}: {
  onClose: () => void;
  onSave: (word: Omit<VocabWord, "id">) => Promise<void>;
  userId: string;
}) {
  const [wordInput, setWordInput] = useState("");
  const [translationInput, setTranslationInput] = useState("");
  const [enriched, setEnriched] = useState<{
    phonetic: string; context: string; partOfSpeech: string; synonyms: string[]; tip: string;
  } | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [saving, setSaving] = useState(false);

  const enrich = useCallback(async () => {
    if (!wordInput.trim()) return;
    setEnriching(true);
    try {
      const res = await fetch("/api/enrich-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: wordInput.trim(), translation: translationInput.trim() }),
      });
      const data = await res.json();
      setEnriched(data);
    } catch {
      setEnriched({ phonetic: "", context: "", partOfSpeech: "noun", synonyms: [], tip: "" });
    } finally {
      setEnriching(false);
    }
  }, [wordInput, translationInput]);

  const handleSave = useCallback(async () => {
    if (!wordInput.trim() || !translationInput.trim()) return;
    setSaving(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await onSave({
      user_id: userId,
      word: wordInput.trim(),
      translation: translationInput.trim(),
      phonetic: enriched?.phonetic ?? "",
      context: enriched?.context ?? "",
      part_of_speech: enriched?.partOfSpeech,
      difficulty: 3,
      interval: 1,
      ease_factor: 2.5,
      repetitions: 0,
      next_review: tomorrow.toISOString(),
      created_at: new Date().toISOString(),
    });
    setSaving(false);
    onClose();
  }, [wordInput, translationInput, enriched, userId, onSave, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-extrabold text-lg">Добавить слово</h3>
          <button onClick={onClose} className="text-[#475569] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-[#64748B] text-xs font-medium mb-1.5 block">Слово на английском</label>
            <input
              autoFocus
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") enrich(); }}
              placeholder="e.g. serendipity"
              className="w-full bg-[#1E293B] border border-[#334155] focus:border-[#6366F1] rounded-xl px-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[#64748B] text-xs font-medium mb-1.5 block">Перевод на русский</label>
            <input
              value={translationInput}
              onChange={(e) => setTranslationInput(e.target.value)}
              placeholder="e.g. счастливая случайность"
              className="w-full bg-[#1E293B] border border-[#334155] focus:border-[#6366F1] rounded-xl px-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* AI enrich */}
        <button
          onClick={enrich}
          disabled={!wordInput.trim() || enriching}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#6366F1]/40 bg-[#6366F1]/10 text-[#818CF8] text-sm font-semibold hover:bg-[#6366F1]/20 disabled:opacity-50 transition-all mb-4"
        >
          {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {enriching ? "AI обрабатывает..." : "Обогатить с AI ✨"}
        </button>

        {/* Enriched preview */}
        <AnimatePresence>
          {enriched && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 space-y-2 overflow-hidden"
            >
              {enriched.phonetic && (
                <div className="bg-[#1E293B] rounded-xl px-3 py-2 text-xs">
                  <span className="text-[#475569]">Транскрипция: </span>
                  <span className="text-white font-mono">{enriched.phonetic}</span>
                </div>
              )}
              {enriched.context && (
                <div className="bg-[#1E293B] rounded-xl px-3 py-2 text-xs">
                  <span className="text-[#475569]">Пример: </span>
                  <span className="text-[#94A3B8] italic">{enriched.context}</span>
                </div>
              )}
              {enriched.synonyms.length > 0 && (
                <div className="bg-[#1E293B] rounded-xl px-3 py-2 text-xs">
                  <span className="text-[#475569]">Синонимы: </span>
                  <span className="text-[#818CF8]">{enriched.synonyms.join(", ")}</span>
                </div>
              )}
              {enriched.tip && (
                <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl px-3 py-2 text-xs text-[#F59E0B]">
                  💡 {enriched.tip}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSave}
          disabled={!wordInput.trim() || !translationInput.trim() || saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.01]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Сохранить слово
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [view, setView] = useState<"list" | "review">("list");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("date");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sessionResult, setSessionResult] = useState<{ correct: number; xp: number } | null>(null);

  // Load words
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setWords(data ?? []);
      setLoading(false);
    })();
  }, []);

  const dueWords = useMemo(() => getDueWords(words), [words]);

  const filtered = useMemo(() => {
    let list = words;
    if (filter !== "all") list = list.filter((w) => getStatus(w) === filter);
    if (search) list = list.filter((w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase())
    );
    switch (sort) {
      case "alpha":      list = [...list].sort((a, b) => a.word.localeCompare(b.word)); break;
      case "difficulty": list = [...list].sort((a, b) => (a.ease_factor ?? 2.5) - (b.ease_factor ?? 2.5)); break;
      default:           break; // already sorted by date from query
    }
    return list;
  }, [words, filter, search, sort]);

  const stats = useMemo(() => ({
    total: words.length,
    learning: words.filter((w) => getStatus(w) === "learning").length,
    mastered: words.filter((w) => getStatus(w) === "mastered").length,
    due: dueWords.length,
  }), [words, dueWords]);

  const handleSaveWord = useCallback(async (word: Omit<VocabWord, "id">) => {
    const { data, error } = await supabase.from("vocabulary").insert(word).select().single();
    if (!error && data) setWords((prev) => [data, ...prev]);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await supabase.from("vocabulary").delete().eq("id", id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  if (view === "review") {
    return (
      <div className="max-w-lg mx-auto py-4 px-2 h-full">
        <ReviewSession
          words={dueWords}
          onComplete={(result) => { setSessionResult(result); setView("list"); }}
          onExit={() => setView("list")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Словарь</h1>
          <p className="text-[#475569] text-sm mt-0.5">Твоя личная коллекция слов</p>
        </div>
      </div>

      {/* Session result banner */}
      <AnimatePresence>
        {sessionResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl px-5 py-3 flex items-center justify-between"
          >
            <div className="text-sm text-[#10B981] font-medium">
              🎉 Сессия завершена! {sessionResult.correct} слов знаешь · +{sessionResult.xp} XP
            </div>
            <button onClick={() => setSessionResult(null)}><X className="w-4 h-4 text-[#10B981]" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "📚", label: "Всего", value: stats.total, color: "#6366F1" },
          { icon: "🎯", label: "Изучаю",   value: stats.learning, color: "#F59E0B" },
          { icon: "✅", label: "Выучено", value: stats.mastered, color: "#10B981" },
          { icon: "⏰", label: "Сегодня", value: stats.due, color: "#EF4444" },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-xl font-extrabold text-white">{s.value}</div>
              <div className="text-[#475569] text-xs">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review CTA */}
      <div className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        dueWords.length > 0
          ? "bg-gradient-to-r from-[#6366F1]/15 to-[#8B5CF6]/15 border-[#6366F1]/30"
          : "bg-[#1E293B] border-[#334155]"
      }`}>
        <div>
          {dueWords.length > 0 ? (
            <>
              <h3 className="text-white font-extrabold text-base">
                ⏰ {dueWords.length} карточек ждут тебя
              </h3>
              <p className="text-[#64748B] text-sm mt-0.5">Повтори сегодня, чтобы не забыть</p>
            </>
          ) : (
            <>
              <h3 className="text-white font-extrabold text-base">🎉 На сегодня всё!</h3>
              <p className="text-[#64748B] text-sm mt-0.5">Следующее повторение завтра</p>
            </>
          )}
        </div>
        {dueWords.length > 0 && (
          <button
            onClick={() => setView("review")}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            Начать повторение →
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск слова..."
            className="w-full bg-[#1E293B] border border-[#334155] focus:border-[#6366F1] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="appearance-none bg-[#1E293B] border border-[#334155] hover:border-[#475569] text-[#94A3B8] text-sm rounded-xl px-4 py-2.5 pr-8 outline-none cursor-pointer"
          >
            {(Object.entries(SORT_LABELS) as [SortType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <SortAsc className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569] pointer-events-none" />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(Object.entries(FILTER_LABELS) as [FilterType, string][]).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === k
                ? "border-[#6366F1]/60 bg-[#6366F1]/15 text-[#818CF8]"
                : "border-[#1E293B] text-[#475569] hover:border-[#334155] hover:text-white"
            }`}
          >
            {v}
            {k !== "all" && (
              <span className="ml-1.5 text-[9px] opacity-60">
                {k === "new" ? words.filter(w => getStatus(w) === "new").length
                  : k === "learning" ? stats.learning
                  : stats.mastered}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Word grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-[#1E293B] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#475569]">
          <div className="text-4xl mb-3">{words.length === 0 ? "📝" : "🔍"}</div>
          <div className="font-medium text-white mb-1">
            {words.length === 0 ? "Словарь пуст" : "Слова не найдены"}
          </div>
          <div className="text-sm mb-4">
            {words.length === 0 ? "Добавь первое слово!" : "Попробуй изменить фильтр"}
          </div>
          {words.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5558E3] transition-all"
            >
              + Добавить слово
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <AnimatePresence>
            {filtered.map((word) => (
              <WordCard key={word.id} word={word} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Floating add button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl z-30"
        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 8px 30px #6366F140" }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Add word modal */}
      <AnimatePresence>
        {showAddModal && userId && (
          <AddWordModal
            userId={userId}
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveWord}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
