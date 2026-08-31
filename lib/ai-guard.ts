import { NextResponse } from 'next/server'

/**
 * Возвращает 503-ответ, если не сконфигурирован GROQ_API_KEY, иначе null.
 * Используется в начале AI-роутов, чтобы отдавать понятную ошибку вместо 500.
 *
 *   const g = groqKeyMissing(); if (g) return g
 */
export function groqKeyMissing(): NextResponse | null {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'AI temporarily unavailable (GROQ_API_KEY is not configured)' },
      { status: 503 },
    )
  }
  return null
}
