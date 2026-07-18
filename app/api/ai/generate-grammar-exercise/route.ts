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

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        messages: [{
          role: 'system',
          content: 'You are an English grammar teacher. Return only valid JSON, no markdown.',
        }, {
          role: 'user',
          content: `Create a unique grammar exercise for ${level} level on topic: ${topic}.
Type: ${typeDesc}

Return JSON:
{"exercise": "The exercise text (use ___ for blanks)", "instruction": "Brief instruction for the student in Russian", "correctAnswer": "The correct answer", "hint": "Optional hint in Russian", "explanation": "Grammar rule explanation in Russian (1-2 sentences)"}`,
        }],
      }),
    })

    if (!resp.ok) throw new Error(`Groq ${resp.status}`)
    const data = await resp.json()
    const raw = data.choices?.[0]?.message?.content ?? '{}'
    const match = raw.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : {}
    return NextResponse.json(parsed)
  } catch (e) {
    console.error('grammar-exercise error:', e)
    return NextResponse.json({
      exercise: `Complete the sentence using ${topic}: She ___ (study) English every day.`,
      instruction: 'Вставьте правильную форму глагола',
      correctAnswer: 'studies',
      hint: 'Present Simple: he/she/it + verb+s',
      explanation: 'В Present Simple для 3-го лица единственного числа добавляем -s/-es к глаголу.',
    })
  }
}
