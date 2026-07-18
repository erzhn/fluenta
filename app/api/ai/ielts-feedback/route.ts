import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
  const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : ''
  if (!transcript || transcript.length < 10) {
    return NextResponse.json({ error: 'Transcript too short' }, { status: 400 })
  }

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an expert IELTS Speaking examiner. Score the following transcript on 4 criteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation) each on a scale of 1-9 (whole numbers only). Return ONLY valid JSON in this exact format: {"fluency": N, "lexical": N, "grammar": N, "pronunciation": N, "band": N, "tips": ["tip1", "tip2", "tip3"]} where band is the average of the 4 scores rounded to nearest 0.5.',
        },
        {
          role: 'user',
          content: `IELTS Speaking transcript:\n${transcript}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.3,
    }),
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
