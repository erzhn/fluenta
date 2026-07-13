"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, BookOpen, Layers, ArrowRight, Flame, Zap, Trophy, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import { WordOfDay } from "@/components/WordOfDay";
import { DailyReview } from "@/components/DailyReview";
import { LevelUpModal } from "@/components/LevelUpModal";
import type { Profile } from "@/types";

const QUICK_ACTIONS = [
  { href: "/ai-tutor",   icon: Brain,    label: "AI Репетитор", desc: "Разговорная практика с AI",  color: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400" },
  { href: "/lessons",    icon: BookOpen, label: "Уроки",        desc: "Продолжить обучение",         color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" },
  { href: "/vocabulary", icon: Layers,   label: "Словарь",      desc: "Повторить слова",             color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400" },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [vocabDue, setVocabDue] = useState(0);
  const [levelUp, setLevelUp] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { count: today }, { count: due }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("lessons_progress").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).gte("completed_at", new Date().toISOString().slice(0, 10)),
        supabase.from("vocabulary").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).lte("next_review", new Date().toISOString()),
      ]);
      if (p) {
        setProfile(p);
        const currentLevel = p.cefr_level ?? "A1";
        const prevLevel = localStorage.getItem("fluenta_last_level");
        if (prevLevel && prevLevel !== currentLevel) {
          setLevelUp({ from: prevLevel, to: currentLevel });
        }
        localStorage.setItem("fluenta_last_level", currentLevel);
      }
      setCompletedToday(today ?? 0);
      setVocabDue(due ?? 0);
    }
    load();
  }, []);

  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const firstName = profile?.full_name?.split(" ")[0] ?? "Привет";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 17 ? "Добрый день" : "Добрый вечер";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {levelUp && (
        <LevelUpModal
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          onClose={() => setLevelUp(null)}
        />
      )}

      {/* Greeting */}
      <div>
        <p className="text-[hsl(var(--foreground-muted))] text-sm mb-1">{greeting} 👋</p>
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{firstName}</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Дней подряд",  value: profile?.streak ?? 0,               unit: "🔥", color: "text-orange-500" },
          { label: "Опыт",         value: (profile?.xp ?? 0).toLocaleString(), unit: "XP", color: "text-[hsl(var(--accent))]" },
          { label: "Уровень",      value: levelInfo?.level ?? 1,               unit: "",   color: "text-amber-500" },
          { label: "Сегодня",      value: completedToday,                       unit: "ур.", color: "text-green-500" },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-[hsl(var(--foreground-muted))] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>
              {s.value}
              <span className="text-base font-normal ml-1 text-[hsl(var(--foreground-muted))]">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* XP progress */}
      {levelInfo && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">Уровень {levelInfo.level} — {levelInfo.name}</p>
              <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">
                {profile?.cefr_level} · {(profile?.xp ?? 0).toLocaleString()} XP
              </p>
            </div>
            <div className="flex items-center gap-1 text-[hsl(var(--accent))]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{levelInfo.progress}%</span>
            </div>
          </div>
          <div className="h-2 bg-[hsl(var(--background-secondary))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--accent))] rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <p className="text-xs text-[hsl(var(--foreground-muted))] mt-2">
            {(levelInfo.next - levelInfo.current).toLocaleString()} XP до следующего уровня
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground-muted))] uppercase tracking-wider mb-3">Быстрый старт</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href}>
              <div className="card p-4 hover:border-[hsl(var(--accent))] transition-colors group cursor-pointer">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${a.color}`}>
                  <a.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--accent))] transition-colors">
                  {a.label}
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">{a.desc}</p>
                {a.href === "/vocabulary" && vocabDue > 0 && (
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[hsl(var(--accent))]">
                    {vocabDue} слов к повторению
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Word of day */}
      <WordOfDay />

      {/* Daily review */}
      <DailyReview />
    </div>
  );
}
