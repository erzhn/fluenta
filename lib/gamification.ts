import type { LucideIcon } from "lucide-react";
import {
  Sprout, Flame, MessageCircle, BookOpen, Star, Target,
  Rocket, Mic, PenLine, Trophy, GraduationCap, Crown,
} from "lucide-react";

// ─── XP / Level System ────────────────────────────────────────────────────────
export const XP_LEVELS = [0, 500, 1200, 2200, 3500, 5000, 7000, 10000] as const;

export const LEVEL_NAMES = [
  "Новичок",
  "Начинающий",
  "Элементарный",
  "Средний",
  "Выше среднего",
  "Продвинутый",
  "Эксперт",
  "Мастер",
] as const;

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  PERFECT_SCORE_BONUS: 25,
  DAILY_STREAK: 10,
  AI_CONVERSATION: 20,
  FLASHCARD_SESSION: 15,
  PRONUNCIATION_EXERCISE: 20,
  DAILY_GOAL_BONUS: 30,
} as const;

export interface LevelInfo {
  level: number;
  name: string;
  current: number;  // XP into this level
  next: number;     // XP needed for this level
  progress: number; // 0–100
  totalXP: number;
}

export function getLevelFromXP(xp: number): LevelInfo {
  let level = 0;
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i]) { level = i; break; }
  }
  const isMax = level === XP_LEVELS.length - 1;
  const floorXP = XP_LEVELS[level];
  const ceilXP = isMax ? XP_LEVELS[level] + 3000 : XP_LEVELS[level + 1];
  const current = xp - floorXP;
  const next = ceilXP - floorXP;
  return {
    level,
    name: LEVEL_NAMES[level],
    current,
    next,
    progress: isMax ? 100 : Math.min(100, Math.round((current / next) * 100)),
    totalXP: xp,
  };
}

export function getStreakBonus(streak: number): number {
  if (streak <= 0) return 1.0;
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.05;
}

export function calculateDailyGoalProgress(minutesToday: number, goalMinutes: number): number {
  if (goalMinutes <= 0) return 0;
  return Math.min(100, Math.round((minutesToday / goalMinutes) * 100));
}

export function getNextMilestone(xp: number): number {
  const milestones = [100, 250, 500, 1000, 2500, 5000, 7000, 10000, 25000];
  for (const m of milestones) { if (xp < m) return m; }
  return Math.ceil(xp / 10000) * 10000 + 10000;
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export interface AchievementDef {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  condition_type: string;
  condition_value: number;
  xp_reward: number;
}

export interface AchievementWithStatus extends AchievementDef {
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0–100 for locked
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_step",   icon: Sprout,         title: "Первый шаг",      desc: "Заверши первый урок",              condition_type: "lessons_completed",     condition_value: 1,  xp_reward: 50  },
  { id: "on_fire",      icon: Flame,          title: "В огне",           desc: "7 дней подряд",                    condition_type: "streak_days",            condition_value: 7,  xp_reward: 150 },
  { id: "chatterbox",   icon: MessageCircle,  title: "Болтун",           desc: "50 сообщений с AI",                condition_type: "ai_messages",            condition_value: 50, xp_reward: 100 },
  { id: "bookworm",     icon: BookOpen,       title: "Книжный червь",    desc: "10 уроков завершено",              condition_type: "lessons_completed",     condition_value: 10, xp_reward: 200 },
  { id: "perfect",      icon: Star,           title: "Перфекционист",    desc: "5 идеальных результатов подряд",   condition_type: "perfect_scores",         condition_value: 5,  xp_reward: 150 },
  { id: "focused",      icon: Target,         title: "Сфокусированный",  desc: "7 дней выполнял дневную цель",     condition_type: "goal_days",              condition_value: 7,  xp_reward: 200 },
  { id: "rocket",       icon: Rocket,         title: "Ракета",           desc: "Достиг уровня B1",                 condition_type: "cefr_b1",                condition_value: 1,  xp_reward: 300 },
  { id: "speaker",      icon: Mic,            title: "Оратор",           desc: "10 упражнений на произношение",    condition_type: "pronunciation_exercises",condition_value: 10, xp_reward: 150 },
  { id: "writer",       icon: PenLine,        title: "Писатель",         desc: "5 письменных работ с AI",          condition_type: "writing_sessions",       condition_value: 5,  xp_reward: 100 },
  { id: "champion",     icon: Trophy,         title: "Чемпион",          desc: "30 дней подряд",                   condition_type: "streak_days",            condition_value: 30, xp_reward: 500 },
  { id: "graduate",     icon: GraduationCap,  title: "Выпускник",        desc: "Все уроки одного уровня пройдены", condition_type: "level_complete",         condition_value: 1,  xp_reward: 400 },
  { id: "master",       icon: Crown,          title: "Мастер",           desc: "Достиг уровня C1",                 condition_type: "cefr_c1",                condition_value: 1,  xp_reward: 1000},
];

interface UserStats {
  lessons_completed: number;
  streak_days: number;
  ai_messages: number;
  perfect_scores: number;
  goal_days: number;
  cefr_b1: boolean;
  pronunciation_exercises: number;
  writing_sessions: number;
  cefr_c1: boolean;
  level_complete: boolean;
}

export function resolveAchievements(stats: UserStats): AchievementWithStatus[] {
  return ACHIEVEMENTS.map((a) => {
    let value = 0;
    let unlocked = false;
    switch (a.condition_type) {
      case "lessons_completed":      value = stats.lessons_completed; unlocked = value >= a.condition_value; break;
      case "streak_days":            value = stats.streak_days; unlocked = value >= a.condition_value; break;
      case "ai_messages":            value = stats.ai_messages; unlocked = value >= a.condition_value; break;
      case "perfect_scores":         value = stats.perfect_scores; unlocked = value >= a.condition_value; break;
      case "goal_days":              value = stats.goal_days; unlocked = value >= a.condition_value; break;
      case "cefr_b1":                unlocked = stats.cefr_b1; value = unlocked ? 1 : 0; break;
      case "pronunciation_exercises":value = stats.pronunciation_exercises; unlocked = value >= a.condition_value; break;
      case "writing_sessions":       value = stats.writing_sessions; unlocked = value >= a.condition_value; break;
      case "cefr_c1":                unlocked = stats.cefr_c1; value = unlocked ? 1 : 0; break;
      case "level_complete":         unlocked = stats.level_complete; value = unlocked ? 1 : 0; break;
    }
    return {
      ...a,
      unlocked,
      progress: a.condition_value > 0 ? Math.min(100, Math.round((value / a.condition_value) * 100)) : (unlocked ? 100 : 0),
    };
  });
}

// ─── Backwards compat exports ─────────────────────────────────────────────────
export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Начни серию сегодня!";
  if (streak === 1) return "Отличное начало! Продолжай!";
  if (streak < 7) return `${streak} дней подряд!`;
  if (streak < 30) return `${streak} дней! Невероятно!`;
  return `${streak} дней! Ты легенда!`;
}

export function getLevelBadgeColor(level: number): string {
  if (level < 2) return "#6B7280";
  if (level < 4) return "#3B82F6";
  if (level < 6) return "#8B5CF6";
  if (level < 7) return "#F59E0B";
  return "#EF4444";
}

// Kept for any legacy callers
export function checkAchievements(profile: { xp?: number; streak?: number; total_lessons?: number; total_vocab?: number }): string[] {
  const stats: UserStats = {
    lessons_completed: profile.total_lessons ?? 0,
    streak_days: profile.streak ?? 0,
    ai_messages: 0, perfect_scores: 0, goal_days: 0,
    cefr_b1: false, pronunciation_exercises: 0, writing_sessions: 0,
    cefr_c1: false, level_complete: false,
  };
  return resolveAchievements(stats).filter((a) => a.unlocked).map((a) => a.id);
}
