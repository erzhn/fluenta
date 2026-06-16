import type { VocabWord } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Rating = 1 | 2 | 3 | 4; // 1=Забыл 2=Сложно 3=Хорошо 4=Легко
export type ReviewRating = Rating;   // alias kept for backward compat

export type VocabCard = {
  id: string;
  word: string;
  translation: string;
  context: string;
  phonetic: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
};

const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

// ─── Core SM-2 ────────────────────────────────────────────────────────────────
export function calculateNextReview(card: VocabCard, rating: Rating): VocabCard {
  let { interval, easeFactor, repetitions } = card;

  switch (rating) {
    case 1: // Забыл — reset
      interval = 1;
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
      repetitions = 0;
      break;
    case 2: // Сложно — interval stays, slight ease drop
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
      // interval stays, repetitions advance
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      repetitions = Math.max(1, repetitions);
      break;
    case 3: // Хорошо — normal SM-2
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
      break;
    case 4: // Легко — fast track
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor * 1.3);
      easeFactor = Math.min(3.0, easeFactor + 0.1);
      repetitions += 1;
      break;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + Math.max(1, interval));

  return { ...card, interval, easeFactor, repetitions, nextReview };
}

export function getDueCards(cards: VocabCard[]): VocabCard[] {
  const now = new Date();
  return cards.filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
}

export function getStats(cards: VocabCard[]): {
  total: number; mastered: number; learning: number; dueToday: number;
} {
  const now = new Date();
  return {
    total: cards.length,
    mastered: cards.filter((c) => c.interval >= 21).length,
    learning: cards.filter((c) => c.repetitions > 0 && c.interval < 21).length,
    dueToday: cards.filter((c) => c.nextReview <= now).length,
  };
}

// ─── VocabWord ↔ VocabCard adapters ─────────────────────────────────────────
export function wordToCard(w: VocabWord): VocabCard {
  return {
    id: w.id,
    word: w.word,
    translation: w.translation,
    context: w.context ?? "",
    phonetic: w.phonetic ?? "",
    interval: w.interval,
    easeFactor: w.ease_factor,
    repetitions: w.repetitions,
    nextReview: new Date(w.next_review),
  };
}

export function ratingToWordUpdate(
  word: VocabWord,
  rating: Rating
): Partial<VocabWord> {
  const card = wordToCard(word);
  const next = calculateNextReview(card, rating);
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + Math.max(1, next.interval));

  return {
    interval: next.interval,
    ease_factor: next.easeFactor,
    repetitions: next.repetitions,
    next_review: nextReview.toISOString(),
    last_reviewed: now.toISOString(),
    difficulty: Math.max(1, Math.min(5, 5 - rating + 1)),
  };
}

// ─── Legacy helpers ───────────────────────────────────────────────────────────
export function getDueWords(words: VocabWord[]): VocabWord[] {
  const now = new Date();
  return words
    .filter((w) => new Date(w.next_review) <= now)
    .sort((a, b) => new Date(a.next_review).getTime() - new Date(b.next_review).getTime());
}

export function createNewWord(
  userId: string,
  word: string,
  translation: string,
  options?: Partial<VocabWord>
): Omit<VocabWord, "id"> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    user_id: userId,
    word,
    translation,
    difficulty: 3,
    next_review: tomorrow.toISOString(),
    interval: 1,
    ease_factor: INITIAL_EASE,
    repetitions: 0,
    created_at: new Date().toISOString(),
    ...options,
  };
}

export function getWordsDueCount(words: VocabWord[]): number {
  return getDueWords(words).length;
}

export function getRetentionRate(words: VocabWord[]): number {
  if (words.length === 0) return 0;
  return Math.round((words.filter((w) => w.interval >= 21).length / words.length) * 100);
}

export function calculateNextReviewLegacy(
  word: VocabWord,
  rating: ReviewRating
): Partial<VocabWord> {
  return ratingToWordUpdate(word, rating);
}
