"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Chart as ChartJS,
  RadialLinearScale, PointElement, LineElement, Filler,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Radar, Line, Bar, Doughnut } from "react-chartjs-2";
import { Trophy, BookOpen, Layers, Award, TrendingUp, ChevronRight, Lock } from "lucide-react";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { XPBar } from "@/components/gamification/XPBar";
import { getLevelFromXP, resolveAchievements, ACHIEVEMENTS } from "@/lib/gamification";
import { LESSONS, LEVEL_COLORS } from "@/lib/lessons-data";
import { supabase } from "@/lib/supabase";
import type { CEFRLevel } from "@/lib/lessons-data";

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
);

type TabId = "overview" | "lessons" | "vocabulary" | "achievements";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview",      label: "Обзор",         icon: TrendingUp },
  { id: "lessons",       label: "Уроки",          icon: BookOpen   },
  { id: "vocabulary",    label: "Словарь",        icon: Layers     },
  { id: "achievements",  label: "Достижения",     icon: Trophy     },
];

const CHART_COMMON = {
  responsive: true,
  maintainAspectRatio: false as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1E293B",
      borderColor: "#334155",
      borderWidth: 1,
      titleColor: "#F8FAFC",
      bodyColor: "#94A3B8",
    },
  },
};

const CEFR_LEVELS: CEFRLevel[] = ["A1","A2","B1","B2","C1","C2"];
const LESSONS_PER_LEVEL = 5;

const RU_MONTHS = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];

interface ProgressData {
  xp: number;
  streak: number;
  cefrLevel: CEFRLevel;
  lessonsCompleted: number;
  completedByLevel: Record<CEFRLevel, { count: number; dates: string[] }>;
  weeklyVocab: number[];
  totalVocab: number;
  masteredVocab: number;
  learningVocab: number;
  dueVocab: number;
  xpHistory: { date: string; xp: number }[];
  lessonsHistory: { lesson_id: string; completed_at: string; score: number }[];
  aiMessages: number;
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ data }: { data: ProgressData }) {
  const levelInfo = getLevelFromXP(data.xp);

  // Derive skill levels from available data
  const cefrIdx = CEFR_LEVELS.indexOf(data.cefrLevel);
  const baseSkill = Math.round(30 + cefrIdx * 12);
  const lessonBonus = Math.min(20, data.lessonsCompleted * 2);

  const radarValues = [
    Math.min(99, baseSkill + lessonBonus),     // Чтение
    Math.min(99, baseSkill + Math.min(15, data.aiMessages)),  // Письмо
    Math.min(99, baseSkill + 5),               // Аудирование
    Math.min(99, baseSkill - 5),               // Говорение
    Math.min(99, baseSkill + lessonBonus + 5), // Грамматика
    Math.min(99, baseSkill + Math.min(25, data.totalVocab / 8)), // Словарь
    Math.min(99, baseSkill - 10),              // Произношение
    Math.min(99, baseSkill - 8),               // Беглость
  ];

  // XP history: last 30 days from lessonsHistory
  const today = new Date();
  const xpByDay: number[] = Array(30).fill(0);
  data.lessonsHistory.forEach((r) => {
    if (r.completed_at) {
      const d = new Date(r.completed_at);
      const daysAgo = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (daysAgo >= 0 && daysAgo < 30) {
        xpByDay[29 - daysAgo] += 50 + (r.score === 5 ? 25 : 0);
      }
    }
  });
  // Accumulate XP
  const xpAccum: number[] = [];
  let running = Math.max(0, data.xp - xpByDay.reduce((a, b) => a + b, 0));
  xpByDay.forEach((v) => { running += v; xpAccum.push(running); });

  const dayLabels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 29 + i);
    return i % 5 === 0 ? `${d.getDate()} ${RU_MONTHS[d.getMonth()]}` : "";
  });

  // Time by type (approximate)
  const lessonMins = data.lessonsCompleted * 8;
  const aiMins = Math.floor(data.aiMessages * 0.5);
  const vocabMins = data.totalVocab * 0.3;
  const totalMins = lessonMins + aiMins + vocabMins + 5;

  // Prediction
  const weeklyXP = data.lessonsHistory.filter((r) => {
    const d = new Date(r.completed_at ?? "");
    return (today.getTime() - d.getTime()) < 7 * 86400000;
  }).length * 50;
  const xpPerDay = Math.max(1, weeklyXP / 7);
  const xpForC1 = 7000;
  const xpNeeded = Math.max(0, xpForC1 - data.xp);
  const monthsToC1 = xpNeeded > 0 ? Math.ceil(xpNeeded / (xpPerDay * 30)) : 0;

  return (
    <div className="space-y-5">
      {/* XP progress */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-bold">{levelInfo.name}</div>
            <div className="text-[#475569] text-sm">{data.xp.toLocaleString()} XP всего</div>
          </div>
          {monthsToC1 > 0 && (
            <div className="text-right">
              <div className="text-[#6366F1] text-xs font-medium">📈 Предсказание</div>
              <div className="text-white text-xs mt-0.5">C1 через ~{monthsToC1} мес.</div>
            </div>
          )}
        </div>
        <XPBar xp={data.xp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">Навыки</h3>
          <div className="h-64">
            <Radar
              data={{
                labels: ["Чтение","Письмо","Аудирование","Говорение","Грамматика","Словарь","Произношение","Беглость"],
                datasets: [{
                  data: radarValues,
                  backgroundColor: "#6366F120",
                  borderColor: "#6366F1",
                  borderWidth: 2,
                  pointBackgroundColor: "#6366F1",
                  pointBorderColor: "#0F172A",
                  pointBorderWidth: 2,
                  pointRadius: 4,
                }],
              }}
              options={{
                ...CHART_COMMON,
                scales: {
                  r: {
                    min: 0, max: 100,
                    grid: { color: "#1E293B" },
                    angleLines: { color: "#1E293B" },
                    pointLabels: { color: "#64748B", font: { size: 10 } },
                    ticks: { display: false, stepSize: 25 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* XP Line chart */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">XP за 30 дней</h3>
          <div className="h-64">
            <Line
              data={{
                labels: dayLabels,
                datasets: [{
                  data: xpAccum,
                  borderColor: "#6366F1",
                  backgroundColor: "rgba(99,102,241,0.08)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  borderWidth: 2,
                }],
              }}
              options={{
                ...CHART_COMMON,
                scales: {
                  x: { grid: { display: false }, ticks: { color: "#475569", font: { size: 10 }, maxRotation: 0 } },
                  y: { grid: { color: "#1E293B" }, ticks: { color: "#475569", font: { size: 10 } }, border: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Time pie */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-5">Время по активностям</h3>
        <div className="flex items-center gap-8">
          <div className="w-40 h-40 shrink-0">
            <Doughnut
              data={{
                labels: ["Уроки","AI чат","Словарь","Прочее"],
                datasets: [{
                  data: [lessonMins, aiMins, Math.round(vocabMins), 5],
                  backgroundColor: ["#6366F1","#8B5CF6","#10B981","#334155"],
                  borderWidth: 0,
                }],
              }}
              options={{
                cutout: "65%",
                plugins: {
                  legend: { display: false },
                  tooltip: { ...CHART_COMMON.plugins.tooltip },
                },
              }}
            />
          </div>
          <div className="space-y-3 flex-1">
            {[
              { label: "Уроки", mins: lessonMins, color: "#6366F1" },
              { label: "AI чат", mins: aiMins, color: "#8B5CF6" },
              { label: "Словарь", mins: Math.round(vocabMins), color: "#10B981" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 text-sm text-[#94A3B8]">{item.label}</div>
                <div className="text-white text-sm font-medium">{item.mins} мин</div>
                <div className="text-[#475569] text-xs w-8 text-right">
                  {Math.round((item.mins / Math.max(1, totalMins)) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lessons Tab ──────────────────────────────────────────────────────────────
function LessonsTab({ data }: { data: ProgressData }) {
  const CATEGORY_SCORES: Record<string, number[]> = {};
  data.lessonsHistory.forEach((r) => {
    const lesson = LESSONS.find((l) => l.id === r.lesson_id);
    if (lesson) {
      if (!CATEGORY_SCORES[lesson.category]) CATEGORY_SCORES[lesson.category] = [];
      CATEGORY_SCORES[lesson.category].push(r.score);
    }
  });

  const weakCategories = Object.entries(CATEGORY_SCORES)
    .map(([cat, scores]) => ({ cat, avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Progress by CEFR level */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-5">Прогресс по уровням</h3>
        <div className="space-y-4">
          {CEFR_LEVELS.map((lvl) => {
            const completed = data.completedByLevel[lvl]?.count ?? 0;
            const pct = Math.round((completed / LESSONS_PER_LEVEL) * 100);
            const color = LEVEL_COLORS[lvl];
            return (
              <div key={lvl} className="flex items-center gap-4">
                <div
                  className="w-10 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >{lvl}</div>
                <div className="flex-1 h-2 bg-[#0F172A] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * CEFR_LEVELS.indexOf(lvl) }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="text-white text-xs w-10 text-right">{completed}/{LESSONS_PER_LEVEL}</div>
                <div className="text-[#475569] text-xs w-8 text-right">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed lessons list */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">Пройденные уроки</h3>
        {data.lessonsHistory.length === 0 ? (
          <div className="text-center py-8 text-[#475569]">
            <div className="text-3xl mb-2">📖</div>
            <div className="text-sm">Уроки ещё не завершены</div>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {[...data.lessonsHistory].reverse().map((r, i) => {
              const lesson = LESSONS.find((l) => l.id === r.lesson_id);
              if (!lesson) return null;
              const color = LEVEL_COLORS[lesson.level];
              const date = r.completed_at ? new Date(r.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) : "";
              return (
                <Link key={i} href={`/lessons/${lesson.id}`}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0F172A] transition-all">
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{lesson.titleRu}</div>
                      <div className="text-[#475569] text-xs">{lesson.level} · {date}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <div
                          key={si}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: si < (r.score ?? 0) ? "#10B981" : "#1E293B" }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Weak topics */}
      {weakCategories.length > 0 && (
        <div className="bg-[#1E293B] border border-[#EF4444]/20 rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-3">⚠️ Слабые темы</h3>
          <div className="space-y-2">
            {weakCategories.map(({ cat, avg }) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="text-[#94A3B8] text-sm flex-1">{cat}</div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: i < Math.round(avg) ? "#F59E0B" : "#1E293B" }} />
                  ))}
                </div>
                <div className="text-[#F59E0B] text-xs w-16 text-right">{avg.toFixed(1)}/5.0</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Vocabulary Tab ───────────────────────────────────────────────────────────
function VocabularyTab({ data }: { data: ProgressData }) {
  const stats = [
    { label: "Всего слов",    value: data.totalVocab,    color: "#6366F1", icon: "📚" },
    { label: "Освоено",       value: data.masteredVocab, color: "#10B981", icon: "✅" },
    { label: "Изучаю",        value: data.learningVocab, color: "#F59E0B", icon: "🔄" },
    { label: "На повторение", value: data.dueVocab,      color: "#EF4444", icon: "⏰" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold text-white" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[#475569] text-xs mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Mastery distribution */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">Распределение слов</h3>
        {data.totalVocab === 0 ? (
          <div className="text-center py-8 text-[#475569]">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-sm">Слова ещё не добавлены</div>
            <Link href="/vocabulary" className="text-[#6366F1] text-xs mt-2 inline-block hover:underline">
              Начать изучение →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-3">
              {[
                { v: data.masteredVocab, c: "#10B981" },
                { v: data.learningVocab, c: "#F59E0B" },
                { v: data.dueVocab,      c: "#EF4444" },
              ].map((seg, i) => (
                <motion.div
                  key={i}
                  initial={{ flex: 0 }}
                  animate={{ flex: seg.v }}
                  transition={{ duration: 0.8 }}
                  style={{ backgroundColor: seg.c, minWidth: seg.v ? 4 : 0 }}
                />
              ))}
            </div>
            <div className="flex gap-4 flex-wrap text-xs text-[#475569]">
              {[["#10B981","Освоено"],["#F59E0B","Изучаю"],["#EF4444","К повторению"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                  {l}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Weekly words bar */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">Слова за неделю</h3>
        <div className="h-40">
          <Bar
            data={{
              labels: ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
              datasets: [{
                data: data.weeklyVocab,
                backgroundColor: "#10B981",
                borderRadius: 5,
                borderSkipped: false,
              }],
            }}
            options={{
              ...CHART_COMMON,
              scales: {
                x: { grid: { display: false }, ticks: { color: "#475569", font: { size: 11 } } },
                y: { grid: { color: "#1E293B" }, ticks: { color: "#475569", font: { size: 10 } }, border: { display: false } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Achievements Tab ─────────────────────────────────────────────────────────
function AchievementsTab({ data }: { data: ProgressData }) {
  const achievements = resolveAchievements({
    lessons_completed: data.lessonsCompleted,
    streak_days: data.streak,
    ai_messages: data.aiMessages,
    perfect_scores: data.lessonsHistory.filter((r) => r.score === 5).length,
    goal_days: 0,
    cefr_b1: ["B1","B2","C1","C2"].includes(data.cefrLevel),
    pronunciation_exercises: 0,
    writing_sessions: 0,
    cefr_c1: ["C1","C2"].includes(data.cefrLevel),
    level_complete: CEFR_LEVELS.some((lvl) => (data.completedByLevel[lvl]?.count ?? 0) >= LESSONS_PER_LEVEL),
  });

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked   = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-4 py-2">
          <span className="text-[#F59E0B] font-bold">{unlocked.length}</span>
          <span className="text-[#64748B] text-sm"> / {achievements.length} разблокировано</span>
        </div>
        <div className="flex-1 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.round((unlocked.length / achievements.length) * 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-[#F59E0B] rounded-full"
          />
        </div>
      </div>

      {unlocked.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Разблокировано</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                <AchievementBadge achievement={a} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="text-[#475569] font-bold text-sm mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Заблокировано
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {locked.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AchievementBadge achievement={a} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Progress Page ───────────────────────────────────────────────────────
export default function ProgressPage() {
  const [tab, setTab] = useState<TabId>("overview");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const [profileRes, progressRes, vocabRes, aiRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("lessons_progress").select("lesson_id, completed, completed_at, score").eq("user_id", user.id).eq("completed", true),
          supabase.from("vocabulary").select("interval, next_review, created_at").eq("user_id", user.id),
          supabase.from("ai_conversations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        ]);

        const profile = profileRes.data;
        const lessons = progressRes.data ?? [];
        const vocab = vocabRes.data ?? [];
        const aiCount = (aiRes as { count?: number | null }).count ?? 0;

        // Group lessons by CEFR
        const completedByLevel = {} as Record<CEFRLevel, { count: number; dates: string[] }>;
        CEFR_LEVELS.forEach((lvl) => { completedByLevel[lvl] = { count: 0, dates: [] }; });
        lessons.forEach((r) => {
          const lesson = LESSONS.find((l) => l.id === r.lesson_id);
          if (lesson) {
            completedByLevel[lesson.level].count++;
            if (r.completed_at) completedByLevel[lesson.level].dates.push(r.completed_at);
          }
        });

        // Vocab stats
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const mastered = vocab.filter((v) => (v.interval ?? 0) > 21).length;
        const due = vocab.filter((v) => v.next_review && v.next_review <= todayStr).length;

        // Weekly vocab (approximate from created_at)
        const weeklyVocab = Array(7).fill(0);
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        weekStart.setHours(0, 0, 0, 0);
        vocab.forEach((v) => {
          if (v.created_at) {
            const d = new Date(v.created_at);
            if (d >= weekStart) {
              const dow = (d.getDay() + 6) % 7;
              weeklyVocab[dow]++;
            }
          }
        });

        setData({
          xp: profile?.xp ?? 0,
          streak: profile?.streak ?? 0,
          cefrLevel: (profile?.current_level ?? "A1") as CEFRLevel,
          lessonsCompleted: lessons.length,
          completedByLevel,
          weeklyVocab,
          totalVocab: vocab.length,
          masteredVocab: mastered,
          learningVocab: vocab.length - mastered - due,
          dueVocab: due,
          xpHistory: [],
          lessonsHistory: lessons.map((r) => ({ lesson_id: r.lesson_id, completed_at: r.completed_at ?? "", score: r.score ?? 0 })),
          aiMessages: aiCount,
        });
      } catch {
        setData({
          xp: 0, streak: 0, cefrLevel: "A1", lessonsCompleted: 0,
          completedByLevel: Object.fromEntries(CEFR_LEVELS.map((l) => [l, { count: 0, dates: [] }])) as unknown as Record<CEFRLevel, { count: number; dates: string[] }>,
          weeklyVocab: Array(7).fill(0),
          totalVocab: 0, masteredVocab: 0, learningVocab: 0, dueVocab: 0,
          xpHistory: [], lessonsHistory: [], aiMessages: 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-12 bg-[#1E293B] rounded-2xl w-48" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-[#1E293B] rounded-2xl" />)}
      </div>
    );
  }

  const d = data!;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Прогресс</h1>
        <p className="text-[#475569] text-sm mt-0.5">Твой путь к мастерству английского</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1E293B] p-1 rounded-2xl border border-[#334155]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-[#6366F1] text-white shadow-lg"
                : "text-[#475569] hover:text-white"
            }`}
          >
            <t.icon className="w-3.5 h-3.5 hidden sm:block" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "overview"     && <OverviewTab     data={d} />}
          {tab === "lessons"      && <LessonsTab      data={d} />}
          {tab === "vocabulary"   && <VocabularyTab   data={d} />}
          {tab === "achievements" && <AchievementsTab data={d} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
