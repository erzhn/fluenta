import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const level = typeof body.level === 'string' ? body.level.trim() : ''

  if (!level || !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const TOPICS = ['daily routine', 'travel story', 'workplace conversation', 'news report', 'nature documentary', 'historical event', 'technology news', 'food and cooking', 'science discovery', 'city life']
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

  const prompt = `Generate an English listening exercise for level ${level} about: ${topic}.
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
