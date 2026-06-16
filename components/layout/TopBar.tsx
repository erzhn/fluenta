"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":    "Главная",
  "/ai-tutor":     "AI Репетитор",
  "/lessons":      "Уроки",
  "/vocabulary":   "Словарь",
  "/pronunciation":"Произношение",
  "/progress":     "Прогресс",
  "/profile":      "Профиль",
  "/settings":     "Настройки",
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
  )?.[1] ?? "Fluenta";

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, xp, streak, cefr_level, avatar_url")
        .eq("user_id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="h-16 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white transition-colors"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>
        {/* Logo (mobile, when no sidebar visible) */}
        <div className="md:hidden flex items-center gap-2">
          <span className="font-bold text-white text-sm">Fluenta</span>
        </div>
        <h1 className="hidden md:block text-lg font-bold text-white">{title}</h1>
      </div>

      {/* Right: streak, XP, avatar */}
      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-1.5 bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5">
          <Flame className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-white text-sm font-semibold tabular-nums">
            {profile?.streak ?? 0}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5">
          <Zap className="w-4 h-4 text-[#6366F1]" />
          <span className="text-white text-sm font-semibold tabular-nums">
            {(profile?.xp ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-52 bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
              >
                {/* User info */}
                {profile && (
                  <div className="px-4 py-3 border-b border-[#334155]">
                    <p className="text-white text-sm font-semibold truncate">{profile.full_name || "Пользователь"}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{profile.cefr_level} · {(profile.xp ?? 0).toLocaleString()} XP</p>
                  </div>
                )}

                {/* Menu items */}
                <div className="py-1.5">
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-white hover:bg-[#334155]/60 transition-all text-sm cursor-pointer">
                      <User className="w-4 h-4" />
                      Профиль
                    </div>
                  </Link>
                  <Link href="/settings" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-white hover:bg-[#334155]/60 transition-all text-sm cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Настройки
                    </div>
                  </Link>
                  <div className="border-t border-[#334155] mt-1.5 pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
