"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#475569]">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-6 shadow-xl shadow-indigo-500/30">
        F
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">
        Добро пожаловать в Fluenta!
      </h1>
      <p className="text-[#64748B] mb-6">
        Ты вошёл как <span className="text-white font-medium">{email}</span>
      </p>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl px-6 py-4 text-sm text-[#10B981]">
        Авторизация работает
      </div>
    </div>
  );
}
