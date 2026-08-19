"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Play, Mic, Layers, Award,
  Flame, Trophy, Star, Loader2, Bot, Target,
} from "lucide-react";
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { supabase } from "@/lib/supabase";
import { getLevelFromXP } from "@/lib/gamification";
import { localDate } from "@/lib/date";
import { WordOfDay } from "@/components/WordOfDay";
import type { Profile } from "@/types";

const WEEK_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [vocabDue, setVocabDue] = useState(0);
  const [emailName, setEmailName] = useState('');
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [activeDays, setActiveDays] = useState<boolean[]>([false, false, false, false, false, false, false]);

  const { generate, loading: tipLoading } = useAIGenerate();
  const [dailyTip, setDailyTip] = useState<{ tip: string; example: string; emoji: string } | null>(null);

  async function getTip() {
    const data = await generate<typeof dailyTip>('daily_tip', 'learning English', 'B1');
    setDailyTip(data);
  }

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;
      setEmailName(user.email?.split('@')[0] ?? '');

      // Понедельник текущей недели
      const now = new Date();
      const dayIdx = (now.getDay() + 6) % 7; // 0=Пн … 6=Вс
      const monday = new Date(now);
      monday.setDate(now.getDate() - dayIdx);
      monday.setHours(0, 0, 0, 0);
      const mondayStr = localDate(monday);
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return localDate(d);
      });
      const todayStr = localDate();

      const [{ data: p }, { count: today }, { count: due }, { data: activity }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("lessons_progress").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).eq("completed", true).gte("completed_at", todayStr),
        supabase.from("vocabulary").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).lte("next_review", todayStr),
        supabase.from("daily_activity").select("date,minutes,xp_earned")
          .eq("user_id", user.id).gte("date", mondayStr),
      ]);

      if (p) {
        setProfile(p);
      } else {
        const { data: created } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email ?? '',
          xp: 0, streak: 0, current_level: 'A1', target_level: 'C1',
          daily_goal_minutes: 20, goal_type: 'general',
        }, { onConflict: 'id' }).select("*").single();
        if (created) setProfile(created);
      }
      setCompletedToday(today ?? 0);
      setVocabDue(due ?? 0);

      if (activity) {
        const byDate = new Map<string, { minutes: number; xp_earned: number }>();
        for (const a of activity) byDate.set(a.date, a);
        setActiveDays(weekDates.map((d) => {
          const rec = byDate.get(d);
          return !!rec && ((rec.minutes ?? 0) > 0 || (rec.xp_earned ?? 0) > 0);
        }));
        setTodayMinutes(byDate.get(todayStr)?.minutes ?? 0);
      }
    }
    load();
    getTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelInfo = profile ? getLevelFromXP(profile.xp ?? 0) : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 17 ? "Добрый день" : "Добрый вечер";
  const rawEmail = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : '';
  const firstName = profile?.name?.split(" ")[0] || rawEmail;

  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7;
  const dateLabel = `${WEEK_LABELS[todayIdx]} · ${now.getDate()} ${MONTHS[now.getMonth()]}`.toUpperCase();

  const goalMinutes = profile?.daily_goal_minutes || 20;
  const ringPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const minutesLeft = Math.max(0, goalMinutes - todayMinutes);

  const xp = profile?.xp ?? 0;
  const streak = profile?.streak ?? 0;
  const badges = [
    { earned: xp > 0,       cls: "b1", Icon: Star,   label: "Первые шаги" },
    { earned: streak >= 3,  cls: "b2", Icon: Flame,  label: "Стрик 3 дня" },
    { earned: xp >= 500,    cls: "b3", Icon: Trophy, label: "500 XP" },
  ];
  const badgesLeft = badges.filter((b) => !b.earned).length;

  return (
    <div className="quest">
      <div className="q-inner space-y-1">

        {/* ── Hero ── */}
        <section className="q-hero anim-up">
          <div>
            <span className="q-eyebrow">{dateLabel}</span>
            <h1 className="q-display">
              {firstName ? <>{greeting}, {firstName}!<br /><span>Готов к маленькой победе?</span></>
                         : <>Добро пожаловать<br /><span>в Fluenta.</span></>}
            </h1>
            <p>У тебя отличный темп. Сегодня достаточно {goalMinutes} минут, чтобы стать увереннее в английском.</p>
          </div>
          <div className="q-orbit">
            <span className="q-planet"><Sparkles className="w-6 h-6" strokeWidth={2} /></span>
            <div className="q-orbit-ring" style={{ position: "absolute", inset: 0 }}>
              <span className="q-dot q-dot-1" />
              <span className="q-dot q-dot-2" />
            </div>
          </div>
        </section>

        {/* ── Фокус дня + Цель ── */}
        <section className="q-focus-grid anim-up delay-1">
          <article className="q-card q-focus">
            <div className="flex items-center justify-between text-xs q-muted">
              <span className="q-pill"><Sparkles className="w-3 h-3" /> ФОКУС ДНЯ</span>
              <span>~12 мин</span>
            </div>
            <h2 className="q-display">Разговор<br />с Zhan AI</h2>
            <p>Живая практика с AI-репетитором · {profile?.current_level ?? "A2"}</p>
            <div className="flex items-end justify-between mt-7">
              <div className="q-teacher">
                <span>Z</span>
                <small className="q-muted">с Zhan AI</small>
              </div>
              <Link href="/ai-tutor" className="q-btn-primary">
                Начать <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          <article className="q-card q-daily">
            <span className="q-eyebrow">ТВОЯ ЦЕЛЬ НА СЕГОДНЯ</span>
            <h3 className="q-display">{todayMinutes} <small>/ {goalMinutes} минут</small></h3>
            <p className="q-muted text-sm">
              {ringPct >= 100 ? "Цель на сегодня выполнена!" : `Осталось ${minutesLeft} мин`}
            </p>
            <div className="q-ring" style={{
              background: `radial-gradient(closest-side, #191a30 76%, transparent 77%), conic-gradient(var(--q-violet) ${ringPct}%, #363756 0)`,
            }}>
              <strong className="q-display">{ringPct}%</strong>
              <span>выполнено</span>
            </div>
            <div className="q-days">
              {WEEK_LABELS.map((d, i) => (
                <span key={d} className={i === todayIdx ? "today" : activeDays[i] ? "done" : ""}>{d}</span>
              ))}
            </div>
          </article>
        </section>

        {/* ── Продолжить путь ── */}
        <div className="q-section-head anim-up delay-1">
          <div>
            <span className="q-eyebrow">ТВОЯ ТРАЕКТОРИЯ</span>
            <h2 className="q-display">Продолжить путь</h2>
          </div>
          <Link href="/my-plan" className="q-link">Весь план <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <Link href="/lessons" className="block">
          <article className="q-card q-path q-hoverable">
            <div className="q-path-icon"><Layers className="w-6 h-6" strokeWidth={1.75} /></div>
            <div className="q-path-info">
              <span className="q-eyebrow">
                УРОВЕНЬ {levelInfo?.level ?? 0} · {profile?.current_level ?? "A1"}
              </span>
              <h3 className="q-display">{levelInfo?.name ?? "Начало пути"}</h3>
              <p className="q-muted text-[13px]">
                {levelInfo
                  ? `${levelInfo.current.toLocaleString()} / ${levelInfo.next.toLocaleString()} XP до следующего уровня`
                  : "Пройди первый урок, чтобы начать"}
              </p>
              <div className="q-bar"><i style={{ width: `${levelInfo?.progress ?? 0}%` }} /></div>
            </div>
            <span className="q-play"><Play className="w-4 h-4 fill-current" strokeWidth={0} /></span>
          </article>
        </Link>

        {/* ── Быстрая практика ── */}
        <div className="q-section-head anim-up delay-2">
          <div>
            <span className="q-eyebrow">БЫСТРАЯ ПРАКТИКА</span>
            <h2 className="q-display">Прокачай навык</h2>
          </div>
          <Link href="/vocabulary" className="q-link">Все навыки <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <section className="q-skill-grid anim-up delay-2">
          <Link href="/pronunciation" className="q-card q-skill q-hoverable mint">
            <span className="q-skill-icon"><Mic className="w-5 h-5" strokeWidth={1.75} /></span>
            <span className="q-eyebrow">ПРОИЗНОШЕНИЕ</span>
            <h3 className="q-display">Скажи правильно</h3>
            <p>Короткие фразы с мгновенной обратной связью</p>
            <span className="q-skill-cta">Попробовать <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>

          <Link href="/vocabulary" className="q-card q-skill q-hoverable lilac">
            <span className="q-skill-icon"><Layers className="w-5 h-5" strokeWidth={1.75} /></span>
            <span className="q-eyebrow">СЛОВАРЬ · SRS</span>
            <h3 className="q-display">{vocabDue > 0 ? `${vocabDue} слов ждут тебя` : "Словарь на повторение"}</h3>
            <p>Закрепи слова интервальным повторением</p>
            <span className="q-skill-cta">Повторить <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>

          <article className="q-card q-skill" style={{ minHeight: 200 }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="q-eyebrow">ТВОЙ ПРОГРЕСС</span>
                <h3 className="q-display" style={{ marginTop: 4 }}>Коллекция</h3>
              </div>
              <Link href="/achievements" className="q-link" aria-label="Все достижения">
                <Award className="w-4 h-4" />
              </Link>
            </div>
            <div className="q-badges">
              {badges.map((b) => (
                <span key={b.cls} className={`q-badge ${b.earned ? b.cls : "locked"}`} title={b.label}>
                  {b.earned ? <b.Icon className="w-5 h-5" strokeWidth={1.75} /> : <Target className="w-4 h-4" />}
                </span>
              ))}
            </div>
            <p className="q-muted text-[11px]" style={{ marginTop: 18 }}>
              {badgesLeft > 0 ? `Ещё ${badgesLeft} до новой награды` : "Все награды недели собраны! 🎯"}
            </p>
          </article>
        </section>

        {/* ── Слово дня ── */}
        <div className="q-section-head anim-up delay-3">
          <div>
            <span className="q-eyebrow">НОВОЕ СЛОВО</span>
            <h2 className="q-display">Слово дня</h2>
          </div>
        </div>
        <div className="anim-up delay-3"><WordOfDay /></div>

        {/* ── AI совет дня ── */}
        <article className="q-card anim-up delay-3" style={{ padding: 22, marginTop: 18 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Bot className="w-4 h-4" style={{ color: "var(--q-lav)" }} strokeWidth={1.75} /> AI совет дня
            </p>
            <button onClick={getTip} disabled={tipLoading}
              className="q-btn-primary" style={{ padding: "8px 14px", fontSize: 12 }}>
              {tipLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {tipLoading ? '...' : 'Обновить'}
            </button>
          </div>
          {dailyTip ? (
            <div>
              <p className="text-sm" style={{ color: "#dcdcf0" }}>{dailyTip.tip}</p>
              {dailyTip.example && (
                <p className="text-xs q-muted italic mt-2" style={{ borderLeft: "2px solid var(--q-violet)", paddingLeft: 12 }}>
                  {dailyTip.example}
                </p>
              )}
            </div>
          ) : <p className="text-sm q-muted">Получи персональный совет по изучению английского.</p>}
        </article>

      </div>
    </div>
  );
}
