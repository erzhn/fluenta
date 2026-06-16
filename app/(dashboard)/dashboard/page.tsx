"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Chart as ChartJS,
  ArcElement, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Bell, ChevronRight, Flame, Zap, BookOpen, Target } from "lucide-react";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { getLevelFromXP, resolveAchievements } from "@/lib/gamification";
import { getLessonById, LESSONS, LEVEL_COLORS } from "@/lib/lessons-data";
import { supabase } from "@/lib/supabase";
import type { CEFRLevel } from "@/lib/lessons-data";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ─── Russian helpers ──────────────────────────────────────────────────────────
const RU_MONTHS_GEN = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const RU_DAYS = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
const RU_DAYS_SHORT = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

function getRuDate() {
  const d = new Date();
  return `${RU_DAYS[d.getDay()]}, ${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}

// ─── Topics for Alex ─────────────────────────────────────────────────────────
const ALEX_TOPICS = ["погоде","путешествиях","любимых фильмах","работе мечты","еде","технологиях","хобби","спорте"];

// ─── Leaderboard mock ─────────────────────────────────────────────────────────
const MOCK_BOARD = [
  { rank: 1, name: "Айгерим К.", xp: 4580, level: "B2", avatar: "🧑‍🎓" },
  { rank: 2, name: "Алексей П.", xp: 3920, level: "B1", avatar: "👨‍💼" },
  { rank: 3, name: "Мирас Б.",   xp: 2870, level: "B1", avatar: "👨‍🎓" },
  { rank: 4, name: "Зарина М.",  xp: 1890, level: "A2", avatar: "👩‍🎓" },
  { rank: 5, name: "Дима С.",    xp: 1240, level: "A2", avatar: "🧑"   },
];

// ─── Activity Calendar ────────────────────────────────────────────────────────
function ActivityCalendar({ activityMap }: { activityMap: Record<string, number> }) {
  const today = new Date();
  const days: { date: Date; dateStr: string }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d, dateStr: d.toISOString().split("T")[0] });
  }

  // Pad to start on Monday
  const firstDow = (days[0].date.getDay() + 6) % 7; // 0=Mon
  const padded = [...Array(firstDow).fill(null), ...days];

  const getColor = (count: number) => {
    if (!count) return "#0F172A";
    if (count === 1) return "#312e81";
    if (count <= 3) return "#4338ca";
    return "#6366f1";
  };

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  return (
    <div>
      {/* Day labels */}
      <div className="flex gap-1 mb-1 ml-0">
        {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
          <div key={d} className="w-3 text-[9px] text-[#334155] text-center">{d}</div>
        ))}
      </div>
      <div className="relative">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(7, minmax(0, 1fr))` }}>
          {padded.map((day, i) =>
            day === null ? (
              <div key={`pad-${i}`} className="w-3 h-3 rounded-sm" />
            ) : (
              <div
                key={day.dateStr}
                className="w-3 h-3 rounded-sm cursor-default transition-all hover:scale-125 hover:ring-1 hover:ring-white/20"
                style={{ backgroundColor: getColor(activityMap[day.dateStr] ?? 0) }}
                onMouseEnter={(e) => {
                  const count = activityMap[day.dateStr] ?? 0;
                  const d = day.date;
                  const text = `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]} — ${count} урок(ов)`;
                  setTooltip({ text, x: e.clientX, y: e.clientY - 36 });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            )
          )}
        </div>
        {tooltip && (
          <div
            className="fixed z-50 bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-white shadow-xl pointer-events-none"
            style={{ left: tooltip.x - 60, top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[#334155] text-[10px]">Меньше</span>
        {["#0F172A","#312e81","#4338ca","#6366f1"].map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[#334155] text-[10px]">Больше</span>
      </div>
    </div>
  );
}

// ─── Daily Goal Doughnut ──────────────────────────────────────────────────────
function DailyGoalChart({ minutesToday, goalMinutes }: { minutesToday: number; goalMinutes: number }) {
  const pct = Math.min(100, Math.round((minutesToday / Math.max(1, goalMinutes)) * 100));
  const color = pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";
  const done = pct >= 100;

  const data = {
    datasets: [{
      data: [pct, 100 - pct],
      backgroundColor: [color, "#1E293B"],
      borderWidth: 0,
      circumference: 270,
      rotation: 225,
    }],
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <Doughnut
          data={data}
          options={{
            cutout: "78%",
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { duration: 1000 },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">🎯</motion.div>
            ) : (
              <motion.div key="mins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="text-2xl font-extrabold" style={{ color }}>{minutesToday}</div>
                <div className="text-[#475569] text-xs">/ {goalMinutes} мин</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#10B981] text-sm font-bold"
        >
          🎉 Цель выполнена!
        </motion.div>
      ) : (
        <div className="text-[#475569] text-xs">{pct}% дневной цели</div>
      )}
    </div>
  );
}

// ─── Weekly XP Chart ──────────────────────────────────────────────────────────
function WeeklyXPChart({ data: weekData }: { data: number[] }) {
  const todayDow = (new Date().getDay() + 6) % 7; // 0=Mon
  const labels = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const colors = labels.map((_, i) =>
    i === todayDow ? "#6366F1" : "#334155"
  );

  return (
    <div className="h-40">
      <Bar
        data={{
          labels,
          datasets: [{ data: weekData, backgroundColor: colors, borderRadius: 5, borderSkipped: false }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: {
            backgroundColor: "#1E293B", borderColor: "#334155", borderWidth: 1,
            titleColor: "#F8FAFC", bodyColor: "#94A3B8",
            callbacks: { label: (ctx) => ` ${ctx.raw} XP` },
          }},
          scales: {
            x: { grid: { display: false }, ticks: { color: "#475569", font: { size: 11 } } },
            y: { grid: { color: "#1E293B" }, ticks: { color: "#475569", font: { size: 10 } }, border: { display: false } },
          },
        }}
      />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
interface DashData {
  name: string;
  xp: number;
  streak: number;
  cefrLevel: CEFRLevel;
  dailyGoalMinutes: number;
  minutesToday: number;
  xpToday: number;
  lessonsCompleted: number;
  weeklyXP: number[];
  activityMap: Record<string, number>;
  nextLessonId: string | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const topic = ALEX_TOPICS[new Date().getDay() % ALEX_TOPICS.length];

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const [profileRes, progressRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("lessons_progress").select("lesson_id, completed, completed_at, score").eq("user_id", user.id),
        ]);

        const profile = profileRes.data;
        const completed = (progressRes.data ?? []).filter((r) => r.completed);

        // Build 90-day activity map from completed lesson timestamps
        const activityMap: Record<string, number> = {};
        completed.forEach((r) => {
          if (r.completed_at) {
            const day = r.completed_at.split("T")[0];
            activityMap[day] = (activityMap[day] ?? 0) + 1;
          }
        });

        // Weekly XP (approximate: each completed lesson this week = 50 XP)
        const weeklyXP = Array(7).fill(0);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        weekStart.setHours(0, 0, 0, 0);
        completed.forEach((r) => {
          if (r.completed_at) {
            const d = new Date(r.completed_at);
            if (d >= weekStart) {
              const dow = (d.getDay() + 6) % 7;
              weeklyXP[dow] += 50 + (r.score === 5 ? 25 : 0);
            }
          }
        });

        // XP today
        const todayStr = new Date().toISOString().split("T")[0];
        const xpToday = (activityMap[todayStr] ?? 0) * 50;
        const minutesToday = (activityMap[todayStr] ?? 0) * 8; // approx 8 min/lesson

        // Next lesson: first incomplete in user's level
        const completedIds = new Set(completed.map((r) => r.lesson_id));
        const cefrLevel = (profile?.current_level ?? "A1") as CEFRLevel;
        const nextLesson = LESSONS.find((l) => l.level === cefrLevel && !completedIds.has(l.id));

        setData({
          name: profile?.full_name?.split(" ")[0] ?? "Ученик",
          xp: profile?.xp ?? 0,
          streak: profile?.streak ?? 0,
          cefrLevel,
          dailyGoalMinutes: profile?.daily_goal_minutes ?? 30,
          minutesToday,
          xpToday,
          lessonsCompleted: completed.length,
          weeklyXP,
          activityMap,
          nextLessonId: nextLesson?.id ?? null,
        });
      } catch {
        // Fall back to defaults silently
        setData({
          name: "Ученик", xp: 0, streak: 0, cefrLevel: "A1",
          dailyGoalMinutes: 30, minutesToday: 0, xpToday: 0,
          lessonsCompleted: 0, weeklyXP: Array(7).fill(0),
          activityMap: {}, nextLessonId: "a1-present-simple",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1E293B] rounded-2xl" />
        ))}
      </div>
    );
  }

  const d = data!;
  const levelInfo = getLevelFromXP(d.xp);
  const cefrColor = LEVEL_COLORS[d.cefrLevel];
  const nextLesson = d.nextLessonId ? getLessonById(d.nextLessonId) : null;
  const hasActivityToday = d.minutesToday > 0;

  const achievements = resolveAchievements({
    lessons_completed: d.lessonsCompleted,
    streak_days: d.streak,
    ai_messages: 0, perfect_scores: 0, goal_days: 0,
    cefr_b1: ["B1","B2","C1","C2"].includes(d.cefrLevel),
    pronunciation_exercises: 0, writing_sessions: 0,
    cefr_c1: ["C1","C2"].includes(d.cefrLevel),
    level_complete: false,
  });
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-6 pb-10"
    >
      {/* ── Greeting ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            {getGreeting()}, {d.name}! 🌟
          </h1>
          <p className="text-[#475569] text-sm mt-0.5">{getRuDate()}</p>
        </div>
        <button className="relative w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[#475569] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6366F1] rounded-full" />
        </button>
      </motion.div>

      {/* ── 4 Stat Cards ─────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Streak */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center gap-3">
          <motion.span
            animate={d.streak > 0 ? { scale: [1,1.2,1] } : {}}
            transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
            className="text-3xl"
          >🔥</motion.span>
          <div>
            <div className="text-2xl font-extrabold text-white">{d.streak}</div>
            <div className="text-[#475569] text-xs">дней подряд</div>
          </div>
        </div>

        {/* XP today */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/15 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{d.xpToday}</div>
            <div className="text-[#475569] text-xs">XP сегодня</div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{d.lessonsCompleted}</div>
            <div className="text-[#475569] text-xs">уроков завершено</div>
          </div>
        </div>

        {/* CEFR level */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-extrabold"
            style={{ backgroundColor: `${cefrColor}20`, color: cefrColor }}
          >
            {d.cefrLevel}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{levelInfo.name}</div>
            <div className="text-[#475569] text-xs">{d.xp.toLocaleString()} XP</div>
          </div>
        </div>
      </motion.div>

      {/* ── XP Progress ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">{levelInfo.name}</span>
          <span className="text-[#475569] text-xs">{levelInfo.progress}% до следующего уровня</span>
        </div>
        <XPBar xp={d.xp} />
      </motion.div>

      {/* ── Daily Goal + Continue Learning ───────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily goal doughnut */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-4 h-4 text-[#6366F1]" />
            <h3 className="text-white font-bold text-sm">Дневная цель</h3>
          </div>
          <div className="flex items-center gap-6">
            <DailyGoalChart minutesToday={d.minutesToday} goalMinutes={d.dailyGoalMinutes} />
            <div className="space-y-3 flex-1">
              <div>
                <div className="text-[#475569] text-xs mb-1">Уроки</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, d.lessonsCompleted * 50)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-[#6366F1] rounded-full"
                    />
                  </div>
                  <span className="text-white text-xs w-4">{Math.min(2, d.lessonsCompleted)}/2</span>
                </div>
              </div>
              <div>
                <div className="text-[#475569] text-xs mb-1">Серия</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: hasActivityToday ? "100%" : "0%" }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full bg-[#F59E0B] rounded-full"
                    />
                  </div>
                  <span className="text-white text-xs w-4">{hasActivityToday ? "✓" : "—"}</span>
                </div>
              </div>
              <div>
                <div className="text-[#475569] text-xs mb-1">Минуты</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.round((d.minutesToday / d.dailyGoalMinutes) * 100))}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-[#10B981] rounded-full"
                    />
                  </div>
                  <span className="text-white text-xs">{d.minutesToday}/{d.dailyGoalMinutes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue learning */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden flex flex-col">
          <div
            className="h-2 w-full"
            style={{ backgroundColor: nextLesson ? LEVEL_COLORS[nextLesson.level] : "#6366F1" }}
          />
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-white font-bold text-sm mb-1">Продолжить обучение</h3>
            {nextLesson ? (
              <>
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${LEVEL_COLORS[nextLesson.level]}20` }}
                  >📖</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm leading-snug">{nextLesson.titleRu}</div>
                    <div className="text-[#475569] text-xs mt-0.5">{nextLesson.title}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${LEVEL_COLORS[nextLesson.level]}20`, color: LEVEL_COLORS[nextLesson.level] }}
                      >{nextLesson.level}</span>
                      <span className="text-[#475569] text-xs">+{nextLesson.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/lessons/${nextLesson.id}`}
                  className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${LEVEL_COLORS[nextLesson.level]}cc, ${LEVEL_COLORS[nextLesson.level]}88)` }}
                >
                  Продолжить <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <div className="text-4xl mb-3">🎓</div>
                <div className="text-white font-semibold mb-1">Все уроки пройдены!</div>
                <div className="text-[#475569] text-sm mb-4">Ты прошёл все доступные уроки</div>
                <Link href="/lessons" className="px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5558E3] transition-all">
                  К урокам
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Today's Plan ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h2 className="text-white font-bold text-base mb-3">План на сегодня</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: "📖", label: "Урок дня",
              sub: nextLesson?.titleRu ?? "Выбери урок",
              href: nextLesson ? `/lessons/${nextLesson.id}` : "/lessons",
              color: "#6366F1",
            },
            {
              icon: "🃏", label: "Повторить слова",
              sub: "Карточки ждут тебя",
              href: "/vocabulary",
              color: "#10B981",
            },
            {
              icon: "💬", label: "5 мин с Alex",
              sub: `Поговори о ${topic}`,
              href: "/ai-tutor",
              color: "#8B5CF6",
            },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1E293B] border border-[#334155] hover:border-[#475569] rounded-2xl p-4 flex items-center gap-3 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >{item.icon}</div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm">{item.label}</div>
                  <div className="text-[#475569] text-xs truncate">{item.sub}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#334155] ml-auto shrink-0" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Activity Calendar ─────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">Твоя активность за 90 дней</h3>
        <ActivityCalendar activityMap={d.activityMap} />
      </motion.div>

      {/* ── Weekly Chart + Leaderboard ────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly XP */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">XP за эту неделю</h3>
          <WeeklyXPChart data={d.weeklyXP} />
        </div>

        {/* Leaderboard */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">🏅 Рейтинг</h3>
            <Link href="/progress" className="text-[#6366F1] text-xs flex items-center gap-1 hover:text-[#818CF8]">
              Все <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {MOCK_BOARD.map((u) => {
              const isMe = u.xp <= d.xp + 200 && u.xp >= d.xp - 200 && d.name !== "Ученик" ? false : u.rank === 3;
              return (
                <div
                  key={u.rank}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isMe ? "bg-[#6366F1]/10 border border-[#6366F1]/30" : "hover:bg-[#0F172A]"
                  }`}
                >
                  <div className={`text-sm font-bold w-5 text-center ${u.rank <= 3 ? "text-[#F59E0B]" : "text-[#334155]"}`}>
                    {u.rank <= 3 ? ["🥇","🥈","🥉"][u.rank-1] : u.rank}
                  </div>
                  <div className="text-xl">{u.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{isMe ? `Ты (${d.name})` : u.name}</div>
                    <div className="text-[#475569] text-xs">{u.level}</div>
                  </div>
                  <div className="text-[#F59E0B] text-xs font-bold">{u.xp.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Recent Achievements ───────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Достижения</h2>
          <Link href="/progress" className="text-[#6366F1] text-xs flex items-center gap-1 hover:text-[#818CF8]">
            Все достижения <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {achievements.slice(0, 6).map((a) => (
            <div key={a.id} className="w-36 shrink-0">
              <AchievementBadge achievement={a} size="sm" />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
