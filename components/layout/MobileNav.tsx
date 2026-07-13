"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, BookOpen, Layers, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Главная" },
  { href: "/ai-tutor",  icon: Brain,           label: "AI" },
  { href: "/lessons",   icon: BookOpen,        label: "Уроки" },
  { href: "/vocabulary",icon: Layers,          label: "Словарь" },
  { href: "/progress",  icon: TrendingUp,      label: "Прогресс" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center gap-1 py-3 px-2 relative">
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[hsl(var(--accent))] rounded-full" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground-muted))]"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground-muted))]"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
