import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { level } = await req.json()
  const prompt = `Generate an English reading text for level ${level} language learners.
Return ONLY valid JSON:
{
  "title": "text title",
  "text": "2-4 paragraphs appropriate for the level",
  "highlightWords": ["word1","word2","word3","word4","word5"],
  "vocabulary": {"word1":"Russian translation","word2":"Russian translation","word3":"Russian translation","word4":"Russian translation","word5":"Russian translation"},
  "questions": [
    {"question":"...","options":["a","b","c","d"],"answer":"correct"},
    {"question":"...","options":["a","b","c","d"],"answer":"correct"},
    {"question":"...","options":["a","b","c","d"],"answer":"correct"}
  ]
}
Level: A1=very simple. A2=everyday topics. B1=intermediate. B2=semi-academic. C1=complex analytical.
highlightWords MUST appear exactly in the text. Questions must genuinely test comprehension.`

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], max_tokens: 1000, temperature: 0.85 }),
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
