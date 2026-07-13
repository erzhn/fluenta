"use client";

import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Главная",
  "/ai-tutor": "AI Репетитор",
  "/lessons": "Уроки",
  "/vocabulary": "Словарь",
  "/grammar": "Грамматика",
  "/phrasal-verbs": "Фразовые глаголы",
  "/idioms": "Идиомы",
  "/collocations": "Коллокации",
  "/word-formation": "Словообразование",
  "/mini-stories": "Мини-истории",
  "/writing": "Письмо",
  "/writing-templates": "Шаблоны письма",
  "/reading": "Чтение",
  "/reading-speed": "Скорость чтения",
  "/listening": "Аудирование",
  "/pronunciation": "Произношение",
  "/pronunciation-practice": "Произношение+",
  "/dictation": "Диктант",
  "/sentence-builder": "Конструктор",
  "/grammar-exercises": "Упражнения",
  "/progress": "Прогресс",
  "/achievements": "Достижения",
  "/weekly-summary": "Итоги недели",
  "/level-test": "Тест уровня",
  "/modules": "Модули",
  "/my-plan": "Мой план",
  "/notes": "Заметки",
  "/profile": "Профиль",
  "/settings": "Настройки",
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const title = PAGE_TITLES[pathname] ??
    PAGE_TITLES[Object.keys(PAGE_TITLES).find(k => pathname.startsWith(k + "/")) ?? ""] ??
    "Fluenta";

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] shrink-0">
      <button
        onClick={onMenuClick}
        className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background-secondary))] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-semibold text-[hsl(var(--foreground))] text-sm flex-1">{title}</h1>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background-secondary))] transition-colors"
          title="Сменить тему"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background-secondary))] transition-colors"
          title="Уведомления"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
