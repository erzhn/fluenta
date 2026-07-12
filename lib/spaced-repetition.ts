export interface SRCard {
  wordId: string
  word: string
  translation: string
  example?: string
  easeFactor: number
  interval: number
  repetitions: number
  dueDate: string
  nextReview?: string
}

export function sm2(card: SRCard, quality: 0|1|2|3|4|5): SRCard {
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions++
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const due = new Date()
  due.setDate(due.getDate() + interval)

  return { ...card, easeFactor, interval, repetitions, dueDate: due.toISOString().slice(0, 10) }
}

export function isDue(card: SRCard): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return card.dueDate <= today
}

export function getDueCards(cards: SRCard[], limit = 10): SRCard[] {
  return cards.filter(isDue).slice(0, limit)
}

export function getNewWordsForToday(
  allWords: { id: string; word: string; translation: string; example?: string }[],
  knownIds: Set<string>,
  limit = 5
): SRCard[] {
  return allWords
    .filter(w => !knownIds.has(w.id))
    .slice(0, limit)
    .map(w => ({
      wordId: w.id,
      word: w.word,
      translation: w.translation,
      example: w.example,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString().slice(0, 10),
    }))
}

export function loadSRCards(): SRCard[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('fluenta_sr_cards') ?? '[]')
  } catch { return [] }
}

export function saveSRCards(cards: SRCard[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('fluenta_sr_cards', JSON.stringify(cards))
}

export function addCardToSR(entry: { wordId: string; word: string; translation: string; example?: string }) {
  const cards = loadSRCards()
  if (cards.some(c => c.wordId === entry.wordId)) return
  const newCard: SRCard = {
    ...entry,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString().slice(0, 10),
  }
  saveSRCards([...cards, newCard])
}
