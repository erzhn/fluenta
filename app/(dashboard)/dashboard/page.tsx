"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain, BookOpen, Layers, Mic, PenLine,
  ChevronRight, Flame, Zap, ArrowRight,
  Sparkles, Loader2, Bot,
} from "lucide-react";
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import { WordOfDay } from "@/components/WordOfDay";
import type { Profile } from "@/types";

const QUICK = [
  { href: "/ai-tutor",      icon: Brain,    label: "AI Репетитор",   desc: "Разговорная практика с ИИ"   },
  { href: "/lessons",       icon: BookOpen, label: "Уроки",          desc: "Структурированные занятия"    },
  { href: "/vocabulary",    icon: Layers,   label: "Повторить слова", desc: "Интервальное повторение"     },
  { href: "/writing",       icon: PenLine,  label: "Письмо",         desc: "Практика с AI-проверкой"     },
  { href: "/pronunciation", icon: Mic,      label: "Произношение",   desc: "Тренировка произношения"     },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [vocabDue, setVocabDue] = useState(0);
  const [emailName, setEmailName] = useState('');
  const { generate, loading: tipLoading } = useAIGenerate()
  const [dailyTip, setDailyTip] = useState<{tip:string,example:string,emoji:string}|null>(null)
  async function getTip() {
    const data = await generate<typeof dailyTip>('daily_tip', 'learning English', 'B1')
    setDailyTip(data)
  }

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;
      setEmailName(user.email?.split('@')[0] ?? '');
      const [{ data: p }, { count: today }, { count: due }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("lessons_progress").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).eq("completed", true).gte("completed_at", new Date().toISOString().slice(0, 10)),
        supabase.from("vocabulary").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).lte("next_review", new Date().toISOString().slice(0, 10)),
      ]);
      if (p) {
        setProfile(p);
      } else {
        // Profile row missing (trigger not set up) — create it now
        const { data: created } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email ?? '',
          xp: 0,
          streak: 0,
          current_level: 'A1',
          target_level: 'C1',
          daily_goal_minutes: 20,
          goal_type: 'general',
        }, { onConflict: 'id' }).select("*").single();
        if (created) setProfile(created);
      }
      setCompletedToday(today ?? 0);
      setVocabDue(due ?? 0);
    }
    load();
    getTip(); // auto-load daily tip on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 17 ? "Добрый день" : "Добрый вечер";
  const rawEmail = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : '';
  const firstName = profile?.name?.split(" ")[0] || rawEmail;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-24 md:pb-10 space-y-8">

      {/* Heading */}
      <div className="anim-up">
        <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
          {firstName
            ? `Привет, ${firstName}. Продолжим?`
            : "Добро пожаловать в Fluenta."}
        </h1>
      </div>

      {/* Stats — тёмный блок */}
      <div className="dark-block p-6 anim-up delay-1">
        <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Ваш прогресс</p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: <Flame className="w-4 h-4 text-orange-400" />, value: profile?.streak ?? 0,                 label: "дней подряд"    },
            { icon: <Zap className="w-4 h-4 text-indigo-300" />,   value: (profile?.xp ?? 0).toLocaleString(),  label: "XP всего"       },
            { icon: null,                                           value: completedToday,                       label: "уроков сегодня" },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5 mb-1">{s.icon}</div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {levelInfo && profile && (
          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Уровень {levelInfo.level} · {profile.current_level}</span>
              <span className="text-xs font-semibold text-white/80">{levelInfo.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <p className="text-[11px] text-white/40 mt-1.5">
              {(levelInfo.next - levelInfo.current).toLocaleString()} XP до следующего уровня
            </p>
          </div>
        )}
      </div>

      {/* Vocab alert */}
      {vocabDue > 0 && (
        <Link href="/vocabulary" className="anim-up delay-2 block">
          <div className="card-clean p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
               style={{ borderLeft: "3px solid var(--primary)" }}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10"><BookOpen className="w-5 h-5 text-primary" strokeWidth={1.75} /></span>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-foreground">Пора повторить слова</p>
              <p className="text-sm text-muted-foreground">{vocabDue} слов ждут</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div className="anim-up delay-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Начать занятие
        </h2>
        <div className="space-y-2">
          {QUICK.map((a) => (
            <Link key={a.href} href={a.href}>
              <div className="card-clean flex items-center gap-4 p-4 hover:shadow-md transition-all hover:-translate-y-px">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: "var(--lavender)" }}>
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{a.label}</p>
                  <p className="text-[12px] text-muted-foreground">{a.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Word of day */}
      <div className="anim-up delay-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Слово дня
        </h2>
        <WordOfDay />
      </div>

      {/* AI совет дня */}
      <div className="card-clean p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2"><Bot className="w-4 h-4 text-primary" strokeWidth={1.75} /> AI совет дня</p>
          <button onClick={getTip} disabled={tipLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl min-h-[36px] disabled:opacity-50">
            {tipLoading?<Loader2 className="w-3 h-3 animate-spin"/>:<Sparkles className="w-3 h-3"/>}
            {tipLoading?'...':'Обновить'}
          </button>
        </div>
        {dailyTip?(
          <div>
            <p className="text-sm text-foreground/80">{dailyTip.tip}</p>
            {dailyTip.example&&<p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3 mt-2">{dailyTip.example}</p>}
          </div>
        ):<p className="text-sm text-muted-foreground">Получи персональный совет по изучению английского</p>}
      </div>

    </div>
  );
}
