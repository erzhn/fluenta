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
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const level = typeof body.level === 'string' ? body.level.trim() : ''
  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''

  if (!text || text.length < 10) {
    return NextResponse.json({ error: 'Text too short' }, { status: 400 })
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: 'Text too long' }, { status: 400 })
  }
  if (level && !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const systemPrompt = `You are an English writing tutor. The student's level is ${level || 'B1'}. They wrote about: ${topic || 'a general topic'}.
Analyze their text and return JSON:
{
  "overallScore": <number 0-100>,
  "corrections": [
    {
      "original": "exact text from student",
      "corrected": "correct version",
      "explanation": "short explanation in Russian",
      "type": "grammar" | "vocabulary" | "style" | "spelling"
    }
  ],
  "positives": ["thing done well 1", "thing done well 2"],
  "suggestion": "one main improvement tip in Russian",
  "rewrittenVersion": "polished version of the text"
}
Keep corrections to max 5 most important. Return ONLY valid JSON, no markdown.`

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Student's writing:\n${text}` },
        ],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    })

    const data = await resp.json()
    const raw = data.choices?.[0]?.message?.content ?? '{}'

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      result = match ? JSON.parse(match[0]) : {
        overallScore: 0,
        corrections: [],
        positives: [],
        suggestion: 'Ошибка анализа',
        rewrittenVersion: '',
      }
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'API error' }, { status: 500 })
  }
}
