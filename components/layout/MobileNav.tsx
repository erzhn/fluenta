"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, BookOpen, Layers, TrendingUp } from "lucide-react";

const TABS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Главная" },
  { href: "/ai-tutor",   icon: Brain,            label: "AI" },
  { href: "/lessons",    icon: BookOpen,          label: "Уроки" },
  { href: "/vocabulary", icon: Layers,            label: "Словарь" },
  { href: "/progress",   icon: TrendingUp,        label: "Прогресс" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-[68px] flex items-center"
      style={{
        background: "rgba(var(--ios-bg-card), 0.85)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderTop: "0.5px solid rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex w-full justify-around items-center px-2">
        {TABS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2"
            >
              <Icon
                className="w-[26px] h-[26px]"
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ color: isActive ? "rgb(var(--ios-accent))" : "rgb(var(--ios-text-muted))" }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "rgb(var(--ios-accent))" : "rgb(var(--ios-text-muted))" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
