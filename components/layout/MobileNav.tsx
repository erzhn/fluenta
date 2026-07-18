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
      className="mobile-nav pb-safe md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F1A]/95 backdrop-blur-xl border-t border-white/[0.08]"
    >
      <div className="flex h-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center justify-center gap-1 relative min-h-[56px]">
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-[#818CF8]" />
              )}
              <tab.icon
                className="w-6 h-6 transition-colors"
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ color: isActive ? "#818CF8" : "#64748B" }}
              />
              <span className="text-[10px] font-medium" style={{ color: isActive ? "#818CF8" : "#64748B" }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
