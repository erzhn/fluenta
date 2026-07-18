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
  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''

  if (!level || !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const topicLine = topic ? `Topic: "${topic}". ` : ''
  const prompt = `Generate an English reading text for level ${level} language learners. ${topicLine}
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
