"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { LessonCard } from "@/components/lessons/LessonCard";
import { LESSONS, LEVEL_COLORS, isLevelLocked } from "@/lib/lessons-data";
import { supabase } from "@/lib/supabase";
import type { CEFRLevel, LessonCategory } from "@/lib/lessons-data";

const LEVELS: (CEFRLevel | "all")[] = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];
const CATEGORIES: (LessonCategory | "all")[] = [
  "all", "Grammar", "Vocabulary", "Reading", "Speaking", "Writing",
];
const CATEGORY_LABELS: Record<LessonCategory | "all", string> = {
  all: "Все", Grammar: "Грамматика", Vocabulary: "Словарь",
  Reading: "Чтение", Speaking: "Речь", Writing: "Письмо",
};

interface ProgressEntry { completed: boolean; score: number }

export default function LessonsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | "all">("all");
  const [catFilter, setCatFilter] = useState<LessonCategory | "all">("all");
  const [userLevel, setUserLevel] = useState<CEFRLevel>("B1");
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});

  // Load user level and lesson progress
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_level")
        .eq("id", user.id)
        .single();
      if (profile?.current_level) setUserLevel(profile.current_level as CEFRLevel);

      const { data: prog } = await supabase
        .from("lessons_progress")
        .select("lesson_id, completed, score")
        .eq("user_id", user.id);
      if (prog) {
        const map: Record<string, ProgressEntry> = {};
        prog.forEach((r) => { map[r.lesson_id] = { completed: r.completed, score: r.score ?? 0 }; });
        setProgress(map);
      }
    });
  }, []);

  const filtered = useMemo(() => {
    return LESSONS.filter((l) => {
      const matchLevel = levelFilter === "all" || l.level === levelFilter;
      const matchCat = catFilter === "all" || l.category === catFilter;
      const matchSearch =
        !search ||
        l.titleRu.toLowerCase().includes(search.toLowerCase()) ||
        l.title.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchCat && matchSearch;
    });
  }, [levelFilter, catFilter, search]);

  const recommended = useMemo(() =>
    LESSONS.filter((l) => l.level === userLevel && !progress[l.id]?.completed).slice(0, 3),
    [userLevel, progress]
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-white">Уроки</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {LESSONS.length} уроков · {Object.values(progress).filter((p) => p.completed).length} пройдено
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск урока..."
            className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#475569] text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Level filter pills */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((lv) => {
          const color = lv === "all" ? "#6366F1" : LEVEL_COLORS[lv];
          const active = levelFilter === lv;
          return (
            <button
              key={lv}
              onClick={() => setLevelFilter(lv)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                active ? "text-white" : "border-[#1E293B] text-[#475569] hover:text-white hover:border-[#334155]"
              }`}
              style={active ? { backgroundColor: `${color}25`, borderColor: color, color } : {}}
            >
              {lv === "all" ? "Все уровни" : lv}
            </button>
          );
        })}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap -mt-4">
        {CATEGORIES.map((cat) => {
          const active = catFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                active
                  ? "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#818CF8]"
                  : "bg-[#1E293B] border-[#334155] text-[#64748B] hover:text-white hover:border-[#475569]"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Recommended section */}
      {recommended.length > 0 && levelFilter === "all" && !search && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-white font-bold text-base">Рекомендовано для тебя</h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{
                backgroundColor: `${LEVEL_COLORS[userLevel]}20`,
                color: LEVEL_COLORS[userLevel],
              }}
            >
              {userLevel}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                locked={false}
                progress={progress[lesson.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* All lessons grid */}
      <section>
        {(levelFilter !== "all" || search || catFilter !== "all") && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-base">
              {search ? `Результаты: «${search}»` : "Уроки"}
            </h2>
            <span className="text-[#475569] text-sm">{filtered.length} урок(-ов)</span>
          </div>
        )}
        {!search && levelFilter === "all" && catFilter === "all" && (
          <h2 className="text-white font-bold text-base mb-4">Все уроки</h2>
        )}

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-[#475569]"
            >
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-medium text-white mb-1">Уроки не найдены</div>
              <div className="text-sm">Попробуй изменить фильтры или поисковый запрос</div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((lesson) => (
                <motion.div key={lesson.id} variants={item}>
                  <LessonCard
                    lesson={lesson}
                    locked={isLevelLocked(userLevel, lesson.level)}
                    progress={progress[lesson.id]}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
