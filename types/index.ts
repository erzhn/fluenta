export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "translation"
  | "listening"
  | "speaking";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  native_language: string;
  target_language: string;
  cefr_level: CEFRLevel;
  xp: number;
  level: number;
  streak: number;
  longest_streak: number;
  total_lessons: number;
  total_vocab: number;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  audio_url?: string;
  points: number;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: CEFRLevel;
  category: string;
  tags: string[];
  duration_minutes: number;
  xp_reward: number;
  thumbnail_url?: string;
  exercises: Exercise[];
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  max_score: number;
  time_spent_seconds: number;
  attempts: number;
  completed_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  audio_url?: string;
  corrections?: GrammarCorrection[];
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "lessons" | "xp" | "vocabulary" | "accuracy";
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  unlocked_at?: string;
  is_unlocked: boolean;
}

export interface VocabWord {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  context?: string;
  phonetic?: string;
  part_of_speech?: string;
  example_sentence?: string;
  difficulty: number;
  next_review: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  last_reviewed?: string;
  created_at: string;
}

export interface TutorSession {
  id: string;
  user_id: string;
  mode: TutorMode;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export type TutorMode =
  | "conversation"
  | "grammar"
  | "vocabulary"
  | "writing"
  | "exams"
  | "business";

export interface DailyStats {
  date: string;
  xp_earned: number;
  lessons_completed: number;
  vocab_reviewed: number;
  time_spent_minutes: number;
  streak_maintained: boolean;
}
