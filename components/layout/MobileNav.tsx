"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, BookOpen, Layers, TrendingUp } from "lucide-react";

const TABS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Главная"  },
  { href: "/ai-tutor",   icon: Brain,           label: "AI"       },
  { href: "/lessons",    icon: BookOpen,        label: "Уроки"    },
  { href: "/vocabulary", icon: Layers,          label: "Словарь"  },
  { href: "/progress",   icon: TrendingUp,      label: "Прогресс" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40
        bg-background/90 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <div className="flex flex-col items-center gap-0.5 pt-2.5 pb-2 relative">
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                )}
                <tab.icon
                  className="w-6 h-6 transition-colors"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
                />
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
                >
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
