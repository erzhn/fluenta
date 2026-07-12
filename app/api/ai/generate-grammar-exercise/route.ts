import { NextRequest, NextResponse } from 'next/server'

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'fill-in': 'Fill in the blank sentence with the correct form',
  'transform': 'Transform the sentence according to the instruction',
  'error-correction': 'Find and correct the grammar mistake in the sentence',
  'multiple-choice': 'Choose the correct option (A, B, C, or D)',
}

export async function POST(req: NextRequest) {
  const { topic, level, exerciseType = 'fill-in' } = await req.json()
  const typeDesc = TYPE_DESCRIPTIONS[exerciseType] ?? TYPE_DESCRIPTIONS['fill-in']

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `Create a grammar exercise for ${level} level on topic: ${topic}.
Type: ${typeDesc}

Return JSON:
{"exercise": "The exercise text (use ___ for blanks)", "instruction": "Brief instruction for the student in Russian", "correctAnswer": "The correct answer", "hint": "Optional hint in Russian", "explanation": "Grammar rule explanation in Russian (1-2 sentences)"}`,
      }],
    }),
  })

  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content ?? '{}'
  return NextResponse.json(JSON.parse(content))
}
