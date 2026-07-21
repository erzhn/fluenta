"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Globe,
  LogOut,
  Zap,
  Flame,
  BookOpen,
  Target,
  Bell,
  BellOff,
  ChevronRight,
  Check,
  Loader2,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import type { Profile } from "@/types";
import type { CEFRLevel } from "@/types";

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const CEFR_LABELS: Record<CEFRLevel, string> = {
  A1: "Начинающий", A2: "Элементарный",
  B1: "Средний", B2: "Выше среднего",
  C1: "Продвинутый", C2: "Мастер",
};
const CEFR_COLORS: Record<CEFRLevel, string> = {
  A1: "#10B981", A2: "#34D399",
  B1: "#6366F1", B2: "#8B5CF6",
  C1: "#F59E0B", C2: "#EF4444",
};

const DAILY_GOALS = [10, 15, 20, 30, 45, 60];

const LEARNING_GOALS = [
  "Разговорный английский", "Деловой английский",
  "Подготовка к экзаменам", "Путешествия",
  "Академические цели", "Медиа и развлечения",
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("");
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>("B1");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [learningGoal, setLearningGoal] = useState("Разговорный английский");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [nativeLang, setNativeLang] = useState("Русский");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) { router.replace("/auth/login"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.name ?? "");
        setCefrLevel(data.current_level ?? "B1");
        setDailyGoal(data.daily_goal_minutes ?? 20);
        setLearningGoal(data.learning_goal ?? "Разговорный английский");
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").upsert({
      id: profile.id,
      name: fullName,
      current_level: cefrLevel,
      daily_goal_minutes: dailyGoal,
      learning_goal: learningGoal,
    }, { onConflict: 'id' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white">Профиль</h1>

      {/* User card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{fullName || "Пользователь"}</h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${CEFR_COLORS[cefrLevel]}20`,
                  color: CEFR_COLORS[cefrLevel],
                }}
              >
                {cefrLevel}
              </span>
              <span className="text-muted-foreground text-sm">{CEFR_LABELS[cefrLevel]}</span>
            </div>
            {levelInfo && (
              <p className="text-muted-foreground text-xs mt-0.5">
                Уровень {levelInfo.level} · {levelInfo.name.replace(/[🌱📖⚡🎯🚀💎🏆👑]/g, "").trim()}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap,      label: "Всего XP",    value: (profile?.xp ?? 0).toLocaleString(), color: "#6366F1" },
            { icon: Flame,    label: "Серия дней",  value: `${profile?.streak ?? 0} д.`,        color: "#F59E0B" },
            { icon: BookOpen, label: "Уроков",       value: "—", color: "#10B981" },
          ].map((s) => (
            <div key={s.label} className="bg-background rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="font-bold text-white text-sm">{s.value}</div>
              <div className="text-muted-foreground text-[10px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP progress */}
        {levelInfo && (
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
              <span>Уровень {levelInfo.level}</span>
              <span>{levelInfo.current.toLocaleString()} / {levelInfo.next.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Personal info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-5 space-y-4"
      >
        <h3 className="font-semibold text-white">Личные данные</h3>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Имя</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-[#334155] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Родной язык</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={nativeLang}
              onChange={(e) => setNativeLang(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {["Русский", "Казахский", "Украинский", "Узбекский", "Кыргызский"].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <div className="w-full bg-background/50 border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-muted-foreground text-sm select-none">
              {profile?.id ? "Изменить можно в Supabase" : "—"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-semibold text-white mb-3">Уровень английского</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {CEFR_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setCefrLevel(l)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                cefrLevel === l
                  ? "scale-[1.03]"
                  : "bg-background text-muted-foreground border border-border hover:border-[#475569] hover:text-white"
              }`}
              style={cefrLevel === l ? {
                backgroundColor: `${CEFR_COLORS[l]}20`,
                border: `1px solid ${CEFR_COLORS[l]}60`,
                color: CEFR_COLORS[l],
              } : {}}
            >
              {l}
              <div className="text-[9px] font-normal mt-0.5 opacity-70">{CEFR_LABELS[l]}</div>
            </button>
          ))}
        </div>
        <Link
          href="/lessons"
          className="flex items-center justify-between px-4 py-3 bg-background border border-border hover:border-primary/50 rounded-xl transition-all group"
        >
          <div>
            <p className="text-white text-sm font-medium">Пройти тест на уровень</p>
            <p className="text-muted-foreground text-xs mt-0.5">Определи свой точный уровень CEFR</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </motion.div>

      {/* Daily goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-[#10B981]" />
          <h3 className="font-semibold text-white">Ежедневная цель</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DAILY_GOALS.map((mins) => (
            <button
              key={mins}
              onClick={() => setDailyGoal(mins)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                dailyGoal === mins
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                  : "bg-background text-muted-foreground border border-border hover:border-[#475569] hover:text-white"
              }`}
            >
              {mins} мин
            </button>
          ))}
        </div>
      </motion.div>

      {/* Learning goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="font-semibold text-white">Цель обучения</h3>
        </div>
        <div className="space-y-2">
          {LEARNING_GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => setLearningGoal(goal)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                learningGoal === goal
                  ? "bg-primary/15 text-white border border-primary/40"
                  : "bg-background text-muted-foreground border border-border hover:border-[#475569] hover:text-white"
              }`}
            >
              {goal}
              {learningGoal === goal && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-semibold text-white mb-3">Уведомления</h3>
        <button
          onClick={() => setNotificationsOn(!notificationsOn)}
          className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border hover:border-[#475569] rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            {notificationsOn ? (
              <Bell className="w-4 h-4 text-primary" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            <div className="text-left">
              <p className="text-white text-sm font-medium">
                {notificationsOn ? "Уведомления включены" : "Уведомления выключены"}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {notificationsOn ? "Напоминания об учёбе активны" : "Нажми, чтобы включить"}
              </p>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors shrink-0 ${notificationsOn ? "bg-primary" : "bg-secondary"}`}>
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md mt-0.5 transition-transform ${
                notificationsOn ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] text-white font-semibold text-base rounded-xl transition-all"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" /> Сохранено
            </span>
          ) : (
            "Сохранить изменения"
          )}
        </Button>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-11 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/50 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти из аккаунта
        </Button>
      </motion.div>
    </div>
  );
}
