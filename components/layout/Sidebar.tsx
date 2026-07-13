"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Brain, BookOpen, Layers, Mic, TrendingUp, User,
  Settings, LogOut, Flame, Zap, X, BarChart2, PenLine, Headphones,
  FileText, GraduationCap, Trophy, Link2, Award, AlignLeft, Volume2,
  MessageSquare, BarChart, Calendar, StickyNote, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import type { Profile } from "@/types";

const NAV_GROUPS = [
  {
    label: "Обучение",
    items: [
      { href: "/dashboard",     icon: LayoutDashboard, label: "Главная"          },
      { href: "/ai-tutor",      icon: Brain,           label: "AI Репетитор"     },
      { href: "/lessons",       icon: BookOpen,        label: "Уроки"            },
      { href: "/my-plan",       icon: Calendar,        label: "Мой план"         },
    ],
  },
  {
    label: "Слова",
    items: [
      { href: "/vocabulary",     icon: Layers,        label: "Словарь"           },
      { href: "/phrasal-verbs",  icon: Link2,         label: "Фразовые глаголы"  },
      { href: "/idioms",         icon: MessageSquare, label: "Идиомы"            },
      { href: "/collocations",   icon: Link2,         label: "Коллокации"        },
      { href: "/word-formation", icon: Layers,        label: "Словообразование"  },
    ],
  },
  {
    label: "Навыки",
    items: [
      { href: "/grammar",               icon: GraduationCap, label: "Грамматика"        },
      { href: "/grammar-exercises",     icon: BookOpen,      label: "Упражнения"        },
      { href: "/writing",               icon: PenLine,       label: "Письмо"            },
      { href: "/writing-templates",     icon: FileText,      label: "Шаблоны"           },
      { href: "/listening",             icon: Headphones,    label: "Аудирование"       },
      { href: "/reading",               icon: FileText,      label: "Чтение"            },
      { href: "/reading-speed",         icon: Zap,           label: "Скорость чтения"   },
      { href: "/pronunciation",         icon: Mic,           label: "Произношение"      },
      { href: "/pronunciation-practice",icon: Mic,           label: "Произношение+"     },
      { href: "/dictation",             icon: Volume2,       label: "Диктант"           },
      { href: "/sentence-builder",      icon: AlignLeft,     label: "Конструктор"       },
      { href: "/mini-stories",          icon: BookOpen,      label: "Мини-истории"      },
    ],
  },
  {
    label: "Прогресс",
    items: [
      { href: "/progress",       icon: TrendingUp, label: "Прогресс"     },
      { href: "/achievements",   icon: Award,      label: "Достижения"   },
      { href: "/weekly-summary", icon: BarChart,   label: "Итоги недели" },
      { href: "/level-test",     icon: BarChart2,  label: "Тест уровня"  },
      { href: "/modules",        icon: Trophy,     label: "Модули"       },
      { href: "/notes",          icon: StickyNote, label: "Заметки"      },
    ],
  },
];

interface SidebarProps {
  vocabDueCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavContent({
  pathname, vocabDueCount, profile,
  onItemClick, onLogout,
}: {
  pathname: string;
  vocabDueCount: number;
  profile: Profile | null;
  onItemClick?: () => void;
  onLogout: () => void;
}) {
  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full bg-sidebar">

      {/* Logo */}
      <div className="px-5 py-5 shrink-0">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center text-white font-bold text-[15px]">
            F
          </div>
          <span className="text-[16px] font-bold tracking-tight text-foreground">Fluenta</span>
        </Link>
      </div>

      {/* User info */}
      {profile && (
        <div className="px-4 pb-4 shrink-0">
          <div className="rounded-xl p-3.5" style={{ background: "var(--lavender)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
                  {profile.full_name || "Пользователь"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-primary">{profile.cefr_level}</span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-[11px] text-muted-foreground">{profile.streak ?? 0} дней</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-[12px] font-bold text-primary">{(profile.xp ?? 0).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">XP</p>
              </div>
            </div>
            {levelInfo && (
              <div className="mt-3">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${levelInfo.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Уровень {levelInfo.level} · {(levelInfo.next - levelInfo.current).toLocaleString()} XP до следующего
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const isDue = item.href === "/vocabulary" && vocabDueCount > 0;
                return (
                  <Link key={item.href} href={item.href} onClick={onItemClick}>
                    <div className={`nav-item ${isActive ? "active" : ""}`}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-[13.5px]">{item.label}</span>
                      {isDue && (
                        <span className="badge-primary text-[10px] px-2 py-0.5">
                          {vocabDueCount > 99 ? "99+" : vocabDueCount}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-2 shrink-0 border-t border-border">
        <div className="space-y-0.5 mt-2">
          <Link href="/profile" onClick={onItemClick}>
            <div className="nav-item"><User className="w-4 h-4" /><span className="text-[13.5px]">Профиль</span></div>
          </Link>
          <Link href="/settings" onClick={onItemClick}>
            <div className="nav-item"><Settings className="w-4 h-4" /><span className="text-[13.5px]">Настройки</span></div>
          </Link>
          <button onClick={onLogout} className="nav-item w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <LogOut className="w-4 h-4" />
            <span className="text-[13.5px]">Выйти</span>
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

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) setProfile(data);
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
      <aside className="hidden md:block w-60 h-full shrink-0 border-r border-sidebar-border overflow-y-auto no-scrollbar">
        <NavContent
          pathname={pathname} vocabDueCount={vocabDueCount}
          profile={profile} onLogout={handleLogout}
        />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-xl overflow-y-auto no-scrollbar"
            >
              <button onClick={onMobileClose}
                className="absolute top-4 right-3 z-10 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <NavContent
                pathname={pathname} vocabDueCount={vocabDueCount}
                profile={profile} onItemClick={onMobileClose} onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
