"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Layers,
  Mic,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Target,
  X,
  BarChart2,
  PenLine,
  Headphones,
  FileText,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLevelFromXP } from "@/lib/gamification";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Главная",      badge: null },
  { href: "/ai-tutor",     icon: Brain,           label: "AI Репетитор", badge: null },
  { href: "/lessons",      icon: BookOpen,        label: "Уроки",        badge: null },
  { href: "/vocabulary",   icon: Layers,          label: "Словарь",      badge: "vocab" },
  { href: "/pronunciation",icon: Mic,             label: "Произношение", badge: null },
  { href: "/listening",    icon: Headphones,      label: "Аудирование",  badge: null },
  { href: "/reading",      icon: FileText,        label: "Чтение",       badge: null },
  { href: "/writing",      icon: PenLine,         label: "Письмо",       badge: null },
  { href: "/grammar",      icon: GraduationCap,   label: "Грамматика",   badge: null },
  { href: "/level-test",   icon: BarChart2,       label: "Тест уровня",  badge: null },
  { href: "/progress",     icon: TrendingUp,      label: "Прогресс",     badge: null },
];

const CEFR_LABELS: Record<string, string> = {
  A1: "Начинающий", A2: "Элементарный",
  B1: "Средний", B2: "Выше среднего",
  C1: "Продвинутый", C2: "Владение",
};

const CEFR_COLORS: Record<string, string> = {
  A1: "#10B981", A2: "#34D399",
  B1: "#6366F1", B2: "#8B5CF6",
  C1: "#F59E0B", C2: "#EF4444",
};

interface SidebarProps {
  vocabDueCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ vocabDueCount = 0, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setDailyGoal(data.daily_goal_minutes ?? 20);
      }
      // Approximate daily minutes from today's lesson count
      const today = new Date().toISOString().slice(0, 10);
      const { count } = await supabase
        .from("lessons_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("completed_at", today);
      setDailyMinutes((count ?? 0) * 10);
    }
    load();
  }, []);

  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const dailyProgress = Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100));
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // ── Desktop Sidebar ──────────────────────────────────────────────────────────
  const desktopSidebar = (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-full bg-[#1E293B] border-r border-[#334155] overflow-hidden shrink-0"
    >
      {/* Logo + collapse button */}
      <div className={cn(
        "flex items-center border-b border-[#334155] shrink-0",
        collapsed ? "justify-center px-0 py-4 h-16" : "justify-between px-4 py-4 h-16"
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">
              F
            </div>
            <span className="font-bold text-lg text-white">Fluenta</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-7 h-7 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[#475569] transition-all",
            collapsed && "hidden md:flex absolute left-[52px] top-4.5 z-10"
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User card */}
      {profile && !collapsed && (
        <div className="px-4 py-4 border-b border-[#334155] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile.full_name || "Пользователь"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${CEFR_COLORS[profile.cefr_level] ?? "#6366F1"}25`,
                    color: CEFR_COLORS[profile.cefr_level] ?? "#6366F1",
                  }}
                >
                  {profile.cefr_level}
                </span>
                <span className="text-[#64748B] text-[10px] truncate">{CEFR_LABELS[profile.cefr_level] ?? ""}</span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          {levelInfo && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#64748B] text-[10px]">Ур. {levelInfo.level} · {levelInfo.name.replace(/[^\wА-яЁё ]/g, "").trim()}</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#6366F1]" />
                  <span className="text-[#6366F1] text-[10px] font-bold">{(profile.xp ?? 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapsed user avatar */}
      {profile && collapsed && (
        <div className="flex justify-center py-3 border-b border-[#334155] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">
            {initials}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const dueCount = item.badge === "vocab" ? vocabDueCount : 0;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition-all cursor-pointer relative",
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-[#6366F1]/15 text-[#818CF8]"
                    : "text-[#64748B] hover:text-white hover:bg-[#334155]/60"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4.5 h-4.5")} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {/* Due badge */}
                {dueCount > 0 && (
                  <span className={cn(
                    "bg-[#EF4444] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1",
                    collapsed ? "absolute top-1.5 right-1.5" : ""
                  )}>
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
                {!collapsed && isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Daily goal */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-[#334155] shrink-0">
          <div className="bg-[#0F172A] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-white text-xs font-semibold">Цель на день</span>
              </div>
              <span className="text-[#64748B] text-[10px]">{dailyMinutes}/{dailyGoal} мин</span>
            </div>
            <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  dailyProgress >= 100 ? "bg-[#10B981]" : dailyProgress >= 50 ? "bg-[#F59E0B]" : "bg-[#6366F1]"
                )}
              />
            </div>
            {profile && (
              <div className="flex items-center gap-1 mt-1.5">
                <Flame className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-[#64748B] text-[10px]">{profile.streak ?? 0} дней подряд</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className={cn(
        "border-t border-[#334155] py-2 px-2 flex shrink-0",
        collapsed ? "flex-col items-center gap-1" : "gap-1"
      )}>
        <Link href="/profile" className="flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              "flex items-center rounded-xl text-[#64748B] hover:text-white hover:bg-[#334155]/60 transition-all text-sm font-medium",
              collapsed ? "justify-center p-3 w-full" : "gap-2.5 px-3 py-2.5"
            )}
            title={collapsed ? "Профиль" : undefined}
          >
            <User className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && "Профиль"}
          </motion.div>
        </Link>
        <Link href="/settings" className={collapsed ? "" : "flex-1"}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              "flex items-center rounded-xl text-[#64748B] hover:text-white hover:bg-[#334155]/60 transition-all text-sm font-medium",
              collapsed ? "justify-center p-3 w-full" : "gap-2.5 px-3 py-2.5"
            )}
            title={collapsed ? "Настройки" : undefined}
          >
            <Settings className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && "Настройки"}
          </motion.div>
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-xl text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-sm font-medium",
            collapsed ? "justify-center p-3 w-full" : "px-3 py-2.5"
          )}
          title={collapsed ? "Выйти" : undefined}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
        </motion.button>
      </div>
    </motion.aside>
  );

  // ── Mobile Drawer ────────────────────────────────────────────────────────────
  const mobileDrawer = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] border-r border-[#334155] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-[#334155] shrink-0">
              <Link href="/dashboard" onClick={onMobileClose} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                  F
                </div>
                <span className="font-bold text-lg text-white">Fluenta</span>
              </Link>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User card */}
            {profile && (
              <div className="px-4 py-4 border-b border-[#334155] shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{profile.full_name || "Пользователь"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${CEFR_COLORS[profile.cefr_level] ?? "#6366F1"}25`,
                          color: CEFR_COLORS[profile.cefr_level] ?? "#6366F1",
                        }}
                      >
                        {profile.cefr_level}
                      </span>
                      <span className="text-[#64748B] text-[10px]">{CEFR_LABELS[profile.cefr_level] ?? ""}</span>
                    </div>
                  </div>
                </div>
                {levelInfo && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#64748B] text-[10px]">Уровень {levelInfo.level}</span>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#6366F1]" />
                        <span className="text-[#6366F1] text-[10px] font-bold">{(profile.xp ?? 0).toLocaleString()} XP</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-700"
                        style={{ width: `${levelInfo.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nav */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const dueCount = item.badge === "vocab" ? vocabDueCount : 0;
                return (
                  <Link key={item.href} href={item.href} onClick={onMobileClose}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#6366F1]/15 text-[#818CF8]"
                        : "text-[#64748B] hover:text-white hover:bg-[#334155]/60"
                    )}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {dueCount > 0 && (
                        <span className="bg-[#EF4444] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                          {dueCount > 99 ? "99+" : dueCount}
                        </span>
                      )}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="border-t border-[#334155] py-2 px-2 shrink-0">
              <Link href="/profile" onClick={onMobileClose}>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#64748B] hover:text-white hover:bg-[#334155]/60 transition-all text-sm font-medium">
                  <User className="w-4.5 h-4.5" />
                  Профиль
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-sm font-medium"
              >
                <LogOut className="w-4.5 h-4.5" />
                Выйти
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {desktopSidebar}
      {mobileDrawer}
    </>
  );
}
