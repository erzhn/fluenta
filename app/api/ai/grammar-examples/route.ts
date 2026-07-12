import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { topic, level, type } = await req.json()

  const prompts: Record<string, string> = {
    examples: `Generate 4 fresh example sentences for the grammar topic "${topic}" at ${level} level.
Return ONLY valid JSON: {"examples":[{"english":"...","russian":"..."},{"english":"...","russian":"..."},{"english":"...","russian":"..."},{"english":"...","russian":"..."}]}
Make examples varied: different subjects, tenses, contexts. Level-appropriate vocabulary.`,

    exercise: `Create one fill-in-the-blank grammar exercise for "${topic}" at ${level} level.
Return ONLY valid JSON: {"sentence":"He ___ (go) to school every day.","answer":"goes","explanation":"Объяснение на русском языке почему именно этот ответ."}
Make the blank genuinely require knowledge of ${topic}.`,

    explain: `Explain the English grammar rule "${topic}" for a Russian speaker at ${level} level.
Return ONLY valid JSON: {"explanation":"Краткое объяснение на русском языке (2-3 предложения).","tip":"Один практический совет как запомнить или применить правило.","common_mistake":"Самая частая ошибка русскоязычных с этим правилом."}`,
  }

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompts[type] }], max_tokens: 500, temperature: 0.7 }),
  })
  const data = await resp.json()
  const raw = data.choices?.[0]?.message?.content ?? '{}'
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    return NextResponse.json(JSON.parse(match?.[0] ?? raw))
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }
}
