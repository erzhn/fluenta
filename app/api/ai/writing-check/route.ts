import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { text, level, topic } = await req.json()

  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return NextResponse.json({ error: 'Text too short' }, { status: 400 })
  }

  const systemPrompt = `You are an English writing tutor. The student's level is ${level ?? 'B1'}. They wrote about: ${topic ?? 'a general topic'}.
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
