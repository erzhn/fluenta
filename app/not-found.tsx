import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-2xl">
          F
        </div>
      </div>

      {/* 404 */}
      <div className="text-center mb-8">
        <p className="text-[#1E293B] text-8xl font-black select-none mb-0 leading-none"
           style={{ WebkitTextStroke: "2px #334155" }}>
          404
        </p>
        <h1 className="text-2xl font-bold text-white mt-2 mb-2">Страница не найдена</h1>
        <p className="text-[hsl(var(--foreground-muted))] max-w-sm mx-auto leading-relaxed">
          Похоже, эта страница не существует. Возможно, она была перемещена или удалена.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:from-[#5558E3] hover:to-[#7C3AED] transition-all"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
        <Link
          href="/lessons"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] hover:text-white hover:border-[#475569] text-sm font-medium transition-all"
        >
          <Search className="w-4 h-4" />
          Перейти к урокам
        </Link>
      </div>
    </div>
  );
}
