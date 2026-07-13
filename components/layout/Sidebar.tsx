"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Brain, BookOpen, Layers, Mic, TrendingUp, User,
  Settings, LogOut, Flame, Zap, BarChart2, PenLine, Headphones,
  FileText, GraduationCap, Trophy, Link2, Award, AlignLeft, Volume2,
  MessageSquare, BarChart, Calendar, StickyNote, X, ChevronRight, Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import type { Profile } from "@/types";

const CEFR_COLORS: Record<string, string> = {
  A1: "#34C759", A2: "#30D158",
  B1: "#6366F1", B2: "#8B5CF6",
  C1: "#FF9500", C2: "#FF3B30",
};

const NAV_GROUPS = [
  {
    label: "Обучение",
    items: [
      { href: "/dashboard",     icon: LayoutDashboard, label: "Главная",        color: "#6366F1" },
      { href: "/ai-tutor",      icon: Brain,           label: "AI Репетитор",   color: "#8B5CF6" },
      { href: "/lessons",       icon: BookOpen,        label: "Уроки",          color: "#007AFF" },
      { href: "/my-plan",       icon: Calendar,        label: "Мой план",       color: "#5856D6" },
    ],
  },
  {
    label: "Словарный запас",
    items: [
      { href: "/vocabulary",     icon: Layers,        label: "Словарь",          color: "#34C759", badge: "vocab" },
      { href: "/phrasal-verbs",  icon: Link2,         label: "Фразовые глаголы", color: "#30B0C7" },
      { href: "/idioms",         icon: MessageSquare, label: "Идиомы",           color: "#FF9F0A" },
      { href: "/collocations",   icon: Link2,         label: "Коллокации",       color: "#FF6B6B" },
      { href: "/word-formation", icon: Layers,        label: "Словообразование", color: "#BF5AF2" },
    ],
  },
  {
    label: "Грамматика и письмо",
    items: [
      { href: "/grammar",           icon: GraduationCap, label: "Грамматика",    color: "#FF9500" },
      { href: "/grammar-exercises", icon: BookOpen,      label: "Упражнения",    color: "#FF6B6B" },
      { href: "/writing",           icon: PenLine,       label: "Письмо",        color: "#007AFF" },
      { href: "/writing-templates", icon: FileText,      label: "Шаблоны",       color: "#32ADE6" },
    ],
  },
  {
    label: "Навыки",
    items: [
      { href: "/listening",             icon: Headphones, label: "Аудирование",     color: "#FF3B30" },
      { href: "/reading",               icon: FileText,   label: "Чтение",          color: "#5856D6" },
      { href: "/reading-speed",         icon: Zap,        label: "Скорость чтения", color: "#FF9500" },
      { href: "/pronunciation",         icon: Mic,        label: "Произношение",    color: "#34C759" },
      { href: "/pronunciation-practice",icon: Mic,        label: "Произношение+",   color: "#30D158" },
      { href: "/dictation",             icon: Volume2,    label: "Диктант",         color: "#007AFF" },
      { href: "/sentence-builder",      icon: AlignLeft,  label: "Конструктор",     color: "#FF9F0A" },
      { href: "/mini-stories",          icon: BookOpen,   label: "Мини-истории",    color: "#BF5AF2" },
    ],
  },
  {
    label: "Прогресс",
    items: [
      { href: "/progress",       icon: TrendingUp, label: "Прогресс",     color: "#34C759" },
      { href: "/achievements",   icon: Award,      label: "Достижения",   color: "#FF9500" },
      { href: "/weekly-summary", icon: BarChart,   label: "Итоги недели", color: "#007AFF" },
      { href: "/level-test",     icon: BarChart2,  label: "Тест уровня",  color: "#BF5AF2" },
      { href: "/modules",        icon: Trophy,     label: "Модули",       color: "#FF9F0A" },
      { href: "/notes",          icon: StickyNote, label: "Заметки",      color: "#8E8E93" },
    ],
  },
];

interface SidebarProps {
  vocabDueCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({
  pathname, vocabDueCount, profile, dailyMinutes, dailyGoal, onItemClick, onLogout,
}: {
  pathname: string;
  vocabDueCount: number;
  profile: Profile | null;
  dailyMinutes: number;
  dailyGoal: number;
  onItemClick?: () => void;
  onLogout: () => void;
}) {
  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const dailyProgress = Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100));
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 shrink-0">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center gap-2.5 mb-5">
          <div
            className="w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center text-white font-bold text-base"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            F
          </div>
          <span className="text-[17px] font-bold tracking-tight text-text-primary">Fluenta</span>
        </Link>

        {/* User card */}
        {profile && (
          <div className="card p-3.5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${CEFR_COLORS[profile.cefr_level] ?? "#6366F1"}, ${CEFR_COLORS[profile.cefr_level] ?? "#8B5CF6"}cc)`,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-text-primary truncate leading-tight">
                  {profile.full_name || "Пользователь"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge badge-accent text-[11px]">{profile.cefr_level}</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-ios-orange" />
                    <span className="text-[12px] text-text-muted">{profile.streak ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {levelInfo && (
              <>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-text-muted">Ур. {levelInfo.level}</span>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" />
                    <span className="text-[11px] font-semibold text-accent">
                      {(profile.xp ?? 0).toLocaleString()} XP
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${levelInfo.progress}%`,
                      background: CEFR_COLORS[profile.cefr_level] ?? "rgb(var(--ios-accent))",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="section-header mb-2">{group.label}</p>
            <div className="ios-list">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const dueCount = (item as { badge?: string }).badge === "vocab" ? vocabDueCount : 0;
                return (
                  <Link key={item.href} href={item.href} onClick={onItemClick}>
                    <div
                      className="ios-list-item"
                      style={isActive ? { background: `${item.color}12` } : {}}
                    >
                      <div className="ios-icon" style={{ background: item.color + "20", color: item.color }}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`flex-1 text-[14px] ${isActive ? "font-semibold" : "text-text-primary"}`}
                        style={isActive ? { color: item.color } : {}}
                      >
                        {item.label}
                      </span>
                      {dueCount > 0 && (
                        <span className="badge badge-accent text-[11px]">{dueCount > 99 ? "99+" : dueCount}</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-text-subtle opacity-50" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Daily goal */}
      <div className="px-3 pb-2 shrink-0">
        <div className="card p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-ios-green" />
              <span className="text-[12px] font-semibold text-text-primary">Цель на день</span>
            </div>
            <span className="text-[11px] text-text-muted">{dailyMinutes}/{dailyGoal} мин</span>
          </div>
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${dailyProgress}%`,
                background: dailyProgress >= 100
                  ? "rgb(var(--ios-green))"
                  : dailyProgress >= 50
                  ? "rgb(var(--ios-orange))"
                  : "rgb(var(--ios-accent))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-3 pb-5 shrink-0">
        <div className="ios-list">
          <Link href="/profile" onClick={onItemClick}>
            <div className="ios-list-item">
              <div className="ios-icon" style={{ background: "#007AFF20", color: "#007AFF" }}>
                <User className="w-4 h-4" />
              </div>
              <span className="flex-1 text-[14px] text-text-primary">Профиль</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-subtle opacity-50" />
            </div>
          </Link>
          <Link href="/settings" onClick={onItemClick}>
            <div className="ios-list-item">
              <div className="ios-icon" style={{ background: "#8E8E9320", color: "#8E8E93" }}>
                <Settings className="w-4 h-4" />
              </div>
              <span className="flex-1 text-[14px] text-text-primary">Настройки</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-subtle opacity-50" />
            </div>
          </Link>
          <button onClick={onLogout} className="ios-list-item w-full text-left">
            <div className="ios-icon" style={{ background: "#FF3B3020", color: "#FF3B30" }}>
              <LogOut className="w-4 h-4" />
            </div>
            <span className="flex-1 text-[14px]" style={{ color: "#FF3B30" }}>Выйти</span>
          </button>
        </div>
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

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }, [router]);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-64 h-full overflow-y-auto shrink-0 border-r border-black/[0.06] dark:border-white/[0.06]">
        <SidebarContent
          pathname={pathname} vocabDueCount={vocabDueCount}
          profile={profile} dailyMinutes={dailyMinutes} dailyGoal={dailyGoal}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="absolute top-4 right-3 z-10">
                <button
                  onClick={onMobileClose}
                  className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname} vocabDueCount={vocabDueCount}
                profile={profile} dailyMinutes={dailyMinutes} dailyGoal={dailyGoal}
                onItemClick={onMobileClose} onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
