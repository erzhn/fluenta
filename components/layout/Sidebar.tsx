"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Brain, BookOpen, Layers, Mic, TrendingUp, User,
  Settings, LogOut, Flame, Zap, Target, X, BarChart2, PenLine,
  Headphones, FileText, GraduationCap, Trophy, Link2, Award, AlignLeft,
  Volume2, MessageSquare, BarChart, Calendar, StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLevelFromXP } from "@/lib/gamification";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

const NAV_GROUPS = [
  {
    label: "Обучение",
    items: [
      { href: "/dashboard",    icon: LayoutDashboard, label: "Главная" },
      { href: "/ai-tutor",     icon: Brain,           label: "AI Репетитор" },
      { href: "/lessons",      icon: BookOpen,        label: "Уроки" },
      { href: "/my-plan",      icon: Calendar,        label: "Мой план" },
    ],
  },
  {
    label: "Практика",
    items: [
      { href: "/vocabulary",              icon: Layers,        label: "Словарь",           badge: "vocab" },
      { href: "/phrasal-verbs",           icon: Link2,         label: "Фразовые глаголы" },
      { href: "/idioms",                  icon: MessageSquare, label: "Идиомы" },
      { href: "/collocations",            icon: Link2,         label: "Коллокации" },
      { href: "/word-formation",          icon: Layers,        label: "Словообразование" },
      { href: "/grammar",                 icon: GraduationCap, label: "Грамматика" },
      { href: "/grammar-exercises",       icon: BookOpen,      label: "Упражнения" },
      { href: "/dictation",               icon: Volume2,       label: "Диктант" },
      { href: "/sentence-builder",        icon: AlignLeft,     label: "Конструктор" },
      { href: "/pronunciation",           icon: Mic,           label: "Произношение" },
      { href: "/pronunciation-practice",  icon: Mic,           label: "Произношение+" },
    ],
  },
  {
    label: "Навыки",
    items: [
      { href: "/listening",         icon: Headphones, label: "Аудирование" },
      { href: "/reading",           icon: FileText,   label: "Чтение" },
      { href: "/reading-speed",     icon: Zap,        label: "Скорость чтения" },
      { href: "/writing",           icon: PenLine,    label: "Письмо" },
      { href: "/writing-templates", icon: FileText,   label: "Шаблоны письма" },
      { href: "/mini-stories",      icon: BookOpen,   label: "Мини-истории" },
    ],
  },
  {
    label: "Прогресс",
    items: [
      { href: "/progress",       icon: TrendingUp, label: "Прогресс" },
      { href: "/achievements",   icon: Award,      label: "Достижения" },
      { href: "/weekly-summary", icon: BarChart,   label: "Итоги недели" },
      { href: "/level-test",     icon: BarChart2,  label: "Тест уровня" },
      { href: "/modules",        icon: Trophy,     label: "Модули" },
      { href: "/notes",          icon: StickyNote, label: "Заметки" },
    ],
  },
];

const CEFR_COLORS: Record<string, string> = {
  A1: "#10b981", A2: "#34d399",
  B1: "#6366f1", B2: "#8b5cf6",
  C1: "#f59e0b", C2: "#ef4444",
};

interface SidebarProps {
  vocabDueCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavContent({
  pathname, vocabDueCount, profile, dailyMinutes, dailyGoal, onItemClick, handleLogout
}: {
  pathname: string;
  vocabDueCount: number;
  profile: Profile | null;
  dailyMinutes: number;
  dailyGoal: number;
  onItemClick?: () => void;
  handleLogout: () => void;
}) {
  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const dailyProgress = Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100));
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-[hsl(var(--sidebar-border))] shrink-0">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-semibold text-base text-[hsl(var(--foreground))]">Fluenta</span>
        </Link>
      </div>

      {/* User card */}
      {profile && (
        <div className="px-3 py-3 border-b border-[hsl(var(--sidebar-border))] shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[hsl(var(--sidebar-item-hover))] transition-colors cursor-pointer">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
              style={{ background: `linear-gradient(135deg, hsl(var(--accent)), ${CEFR_COLORS[profile.cefr_level] ?? "hsl(var(--accent))"})`}}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate leading-tight">
                {profile.full_name || "Пользователь"}
              </p>
              <p className="text-xs text-[hsl(var(--foreground-muted))] leading-tight">
                {profile.cefr_level} · {(profile.xp ?? 0).toLocaleString()} XP
              </p>
            </div>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0"
              style={{
                background: `${CEFR_COLORS[profile.cefr_level] ?? "hsl(var(--accent))"}18`,
                color: CEFR_COLORS[profile.cefr_level] ?? "hsl(var(--accent))",
              }}
            >
              {profile.cefr_level}
            </span>
          </div>

          {levelInfo && (
            <div className="mt-2 px-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[hsl(var(--foreground-muted))]">Ур. {levelInfo.level}</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-[11px] text-[hsl(var(--foreground-muted))]">{profile.streak ?? 0} дн.</span>
                </div>
              </div>
              <div className="h-1 bg-[hsl(var(--background-tertiary))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--accent))] rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] font-semibold text-[hsl(var(--foreground-subtle))] uppercase tracking-wider px-2 py-1 mb-0.5">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const dueCount = (item as { badge?: string }).badge === "vocab" ? vocabDueCount : 0;
              return (
                <Link key={item.href} href={item.href} onClick={onItemClick}>
                  <div className={cn(
                    "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-[hsl(var(--sidebar-item-active-bg))] text-[hsl(var(--sidebar-item-active-text))] font-medium"
                      : "text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-item-hover))]"
                  )}>
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {dueCount > 0 && (
                      <span className="bg-[hsl(var(--accent))] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                        {dueCount > 99 ? "99+" : dueCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Daily goal */}
      <div className="px-3 py-2 border-t border-[hsl(var(--sidebar-border))] shrink-0">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-[hsl(var(--foreground-muted))]">Цель на день</span>
            </div>
            <span className="text-xs text-[hsl(var(--foreground-subtle))]">{dailyMinutes}/{dailyGoal} мин</span>
          </div>
          <div className="h-1.5 bg-[hsl(var(--background-tertiary))] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                dailyProgress >= 100 ? "bg-green-500" : dailyProgress >= 50 ? "bg-amber-500" : "bg-[hsl(var(--accent))]"
              )}
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-2 py-2 border-t border-[hsl(var(--sidebar-border))] flex items-center gap-1 shrink-0">
        <Link href="/profile" className="flex-1" onClick={onItemClick}>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] transition-colors text-sm">
            <User className="w-4 h-4" />
            <span>Профиль</span>
          </div>
        </Link>
        <Link href="/settings" className="flex-1" onClick={onItemClick}>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] transition-colors text-sm">
            <Settings className="w-4 h-4" />
            <span>Настройки</span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Выйти"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ vocabDueCount = 0, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) { setProfile(data); setDailyGoal(data.daily_goal_minutes ?? 20); }
      const today = new Date().toISOString().slice(0, 10);
      const { count } = await supabase.from("lessons_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id).gte("completed_at", today);
      setDailyMinutes((count ?? 0) * 10);
    }
    load();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/auth/login"); };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-60 h-full bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] shrink-0">
        <NavContent
          pathname={pathname}
          vocabDueCount={vocabDueCount}
          profile={profile}
          dailyMinutes={dailyMinutes}
          dailyGoal={dailyGoal}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col shadow-xl"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={onMobileClose}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-item-hover))] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <NavContent
                pathname={pathname}
                vocabDueCount={vocabDueCount}
                profile={profile}
                dailyMinutes={dailyMinutes}
                dailyGoal={dailyGoal}
                onItemClick={onMobileClose}
                handleLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
