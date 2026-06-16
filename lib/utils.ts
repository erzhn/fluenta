import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CEFRLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
}

export function calculateXP(baseXP: number, streak: number, accuracy: number): number {
  const streakBonus = Math.min(streak * 0.05, 0.5);
  const accuracyBonus = accuracy >= 0.9 ? 0.2 : accuracy >= 0.7 ? 0.1 : 0;
  return Math.round(baseXP * (1 + streakBonus + accuracyBonus));
}

export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevel(xp);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}

export function getLevelName(level: number): string {
  const names = [
    "Novice",
    "Beginner",
    "Explorer",
    "Learner",
    "Student",
    "Scholar",
    "Apprentice",
    "Practitioner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
  ];
  return names[Math.min(level - 1, names.length - 1)];
}

export function getCEFRColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A1: "#10B981",
    A2: "#34D399",
    B1: "#6366F1",
    B2: "#8B5CF6",
    C1: "#F59E0B",
    C2: "#EF4444",
  };
  return colors[level];
}

export function getCEFRLabel(level: CEFRLevel): string {
  const labels: Record<CEFRLevel, string> = {
    A1: "Beginner",
    A2: "Elementary",
    B1: "Intermediate",
    B2: "Upper-Intermediate",
    C1: "Advanced",
    C2: "Proficient",
  };
  return labels[level];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
