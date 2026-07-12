import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { level } = await req.json()
  const prompt = `Generate an English listening exercise for level ${level}.
Return ONLY valid JSON:
{
  "title": "short title",
  "text": "the listening text (dialogue or monologue, 6-10 sentences)",
  "questions": [
    {"question":"...","options":["a","b","c","d"],"answer":"correct option"},
    {"question":"...","options":["a","b","c","d"],"answer":"correct option"},
    {"question":"...","options":["a","b","c","d"],"answer":"correct option"}
  ]
}
Level guidelines: A1=very simple dialogue. A2=everyday situation. B1=slightly complex topic. B2=article/lecture excerpt. C1=complex discussion.
All wrong options must be plausible. Questions must test comprehension, not memory.`

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], max_tokens: 800, temperature: 0.85 }),
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
