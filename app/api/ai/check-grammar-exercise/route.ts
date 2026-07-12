import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic, userAnswer, exercise, correctAnswer } = await req.json()

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: `You are an English grammar teacher. Check the student's answer.

Grammar topic: ${topic}
Exercise: ${exercise}
Correct answer: ${correctAnswer}
Student's answer: ${userAnswer}

Rules:
- Minor spelling is OK if grammar structure is correct
- Accept paraphrases that use the same grammar structure
- Return JSON only

{"isCorrect": true, "feedback": "Brief feedback in Russian (1-2 sentences)", "explanation": "Grammar explanation in Russian if wrong (1 sentence)", "betterAnswer": "Ideal answer if student was wrong"}`,
      }],
    }),
  })

  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content ?? '{}'
  return NextResponse.json(JSON.parse(content))
}
