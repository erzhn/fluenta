"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopBar({ title = "Fluenta", onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3"
      style={{
        background: "rgba(var(--ios-bg-card), 0.85)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "0.5px solid rgba(0,0,0,0.06)",
      }}
    >
      <button
        onClick={onMenuClick}
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-muted"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="flex-1 text-[17px] font-bold tracking-tight text-text-primary">
        {title}
      </h1>

      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted transition-colors"
          style={{ background: "rgb(var(--ios-bg-secondary))" }}
          aria-label="Toggle theme"
        >
          {theme === "dark"
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />}
        </button>
      )}
    </header>
  );
}
