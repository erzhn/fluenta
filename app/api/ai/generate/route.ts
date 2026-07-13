import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, context, level = 'B1' } = await request.json()

  const prompts: Record<string, string> = {
    vocabulary_example: `Generate 2 natural example sentences for the word "${context}" at CEFR level ${level}. Return JSON: {"sentences": ["...", "..."]}`,
    vocabulary_set: `Generate 8 useful English vocabulary words for topic: "${context}" at level ${level}. For each word include: word, translation (Russian), example sentence. Return JSON: {"words": [{"word":"...","translation":"...","example":"..."}]}`,
    grammar_exercise: `Create a fill-in-the-blank grammar exercise about "${context}" at level ${level}. Return JSON: {"question":"...","blank":"...","answer":"...","options":["...","...","...","..."],"explanation":"..."}`,
    mini_story: `Write a short English story (150-200 words) about "${context}" at level ${level}. Make it engaging and educational. Return JSON: {"title":"...","content":"...","vocabulary":[{"word":"...","meaning":"..."}]}`,
    reading_text: `Write a reading comprehension text (200-250 words) about "${context}" at level ${level}. Include 3 comprehension questions. Return JSON: {"title":"...","text":"...","questions":[{"question":"...","answer":"..."}]}`,
    word_formation: `Create a word formation exercise using the root word "${context}". Generate noun, verb, adjective, adverb forms with examples. Return JSON: {"root":"...","forms":[{"type":"noun/verb/adj/adverb","word":"...","example":"..."}]}`,
    writing_prompt: `Generate an engaging writing prompt about "${context}" for level ${level} English learner. Include helpful vocabulary. Return JSON: {"prompt":"...","tips":["..."],"vocabulary":["..."]}`,
    conversation_starter: `Generate 5 conversation starter questions about "${context}" for English practice at level ${level}. Return JSON: {"starters":["...","...","...","...","..."]}`,
  }

  const systemPrompt = prompts[type]
  if (!systemPrompt) return NextResponse.json({ error: 'Unknown type' }, { status: 400 })

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are an English language teacher. Always respond with valid JSON only, no markdown, no explanation.' },
        { role: 'user', content: systemPrompt },
      ],
      max_tokens: 800,
      temperature: 0.8,
    }),
  })

  if (!response.ok) return NextResponse.json({ error: 'AI error' }, { status: 500 })

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || '{}'

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(raw)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ raw })
  }
}
