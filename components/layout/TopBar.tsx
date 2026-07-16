"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":             "Fluenta",
  "/ai-tutor":              "AI Репетитор",
  "/lessons":               "Уроки",
  "/vocabulary":            "Словарь",
  "/grammar":               "Грамматика",
  "/phrasal-verbs":         "Фразовые глаголы",
  "/idioms":                "Идиомы",
  "/collocations":          "Коллокации",
  "/word-formation":        "Словообразование",
  "/mini-stories":          "Мини-истории",
  "/writing":               "Письмо",
  "/writing-templates":     "Шаблоны письма",
  "/reading":               "Чтение",
  "/reading-speed":         "Скорость чтения",
  "/listening":             "Аудирование",
  "/pronunciation":         "Произношение",
  "/pronunciation-practice":"Произношение+",
  "/dictation":             "Диктант",
  "/sentence-builder":      "Конструктор",
  "/grammar-exercises":     "Упражнения по грамматике",
  "/progress":              "Прогресс",
  "/achievements":          "Достижения",
  "/weekly-summary":        "Итоги недели",
  "/level-test":            "Тест уровня",
  "/modules":               "Модули",
  "/my-plan":               "Мой план",
  "/notes":                 "Заметки",
  "/profile":               "Профиль",
  "/settings":              "Настройки",
};

interface TopBarProps { onMenuClick: () => void; }

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] ??
    PAGE_TITLES[Object.keys(PAGE_TITLES).find(k => k !== "/" && pathname.startsWith(k)) ?? ""] ??
    "Fluenta";

  return (
    <header className="h-14 shrink-0 flex items-center px-4 gap-3
      bg-background/80 backdrop-blur-md
      border-b border-border sticky top-0 z-30">

      <button
        onClick={onMenuClick}
        className="md:hidden w-8 h-8 -ml-1 flex items-center justify-center
          rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="flex-1 text-[16px] font-bold tracking-tight text-foreground">
        {title}
      </h1>

    </header>
  );
}
