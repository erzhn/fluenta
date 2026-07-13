"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Layers,
  TrendingUp,
  Award,
  Volume2,
  AlignLeft,
  MessageSquare,
  Link2,
  FileText,
  Calendar,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/dashboard",        icon: LayoutDashboard, label: "Главная",  badge: null },
  { href: "/ai-tutor",         icon: Brain,           label: "AI",       badge: null },
  { href: "/lessons",          icon: BookOpen,        label: "Уроки",    badge: null },
  { href: "/vocabulary",       icon: Layers,          label: "Словарь",  badge: "vocab" },
  { href: "/dictation",        icon: Volume2,         label: "Диктант",  badge: null },
  { href: "/sentence-builder", icon: AlignLeft,       label: "Слова",    badge: null },
  { href: "/idioms",           icon: MessageSquare,   label: "Идиомы",   badge: null },
  { href: "/achievements",     icon: Award,           label: "Награды",  badge: null },
  { href: "/progress",         icon: TrendingUp,      label: "Прогресс", badge: null },
  { href: "/collocations",     icon: Link2,           label: "Колл.",    badge: null },
  { href: "/mini-stories",     icon: BookOpen,        label: "Истории",  badge: null },
  { href: "/writing-templates",icon: FileText,        label: "Шаблоны",  badge: null },
  { href: "/my-plan",          icon: Calendar,        label: "Мой план", badge: null },
  { href: "/notes",            icon: StickyNote,      label: "Заметки",  badge: null },
];

export function MobileNav() {
  const pathname = usePathname();
  const [vocabDue, setVocabDue] = useState(0);

  useEffect(() => {
    async function loadDue() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const now = new Date().toISOString();
      const { count } = await supabase
        .from("vocabulary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .lte("next_review", now);
      setVocabDue(count ?? 0);
    }
    loadDue();
  }, []);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E293B] border-t border-[#334155]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const dueCount = item.badge === "vocab" ? vocabDue : 0;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-colors relative"
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#6366F1]" : "text-[#64748B]"
                    )}
                  />
                  {dueCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 leading-none">
                      {dueCount > 9 ? "9+" : dueCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-[#6366F1]" : "text-[#64748B]"
                )}>
                  {item.label}
                </span>
                {/* Active dot */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6366F1]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
