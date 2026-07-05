import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { text, prompt } = await req.json()

  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return NextResponse.json({ error: 'Text too short' }, { status: 400 })
  }

  const systemPrompt = `You are an English language teacher. Analyze the student's writing and return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "level": "<A1|A2|B1|B2|C1>",
  "overall": "<2-3 sentence overall feedback in Russian>",
  "errors": [
    { "original": "<the error phrase>", "correction": "<corrected version>", "explanation": "<brief explanation in Russian>" }
  ],
  "strengths": ["<strength 1 in Russian>", "<strength 2 in Russian>"],
  "suggestions": ["<suggestion 1 in Russian>", "<suggestion 2 in Russian>"]
}
Keep errors array to max 5 most important errors. Return ONLY valid JSON, no markdown.`

  const userMsg = prompt
    ? `Task: "${prompt}"\n\nStudent's writing:\n${text}`
    : `Student's writing:\n${text}`

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
          { role: 'user', content: userMsg },
        ],
        max_tokens: 800,
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
      result = match ? JSON.parse(match[0]) : { score: 0, overall: 'Ошибка анализа', errors: [], strengths: [], suggestions: [] }
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'API error' }, { status: 500 })
  }
}
