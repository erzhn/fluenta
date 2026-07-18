import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { level = 'A1', goal = 'general', hoursPerWeek = 3 } = await req.json()

    const goalMap: Record<string, string> = {
      general: 'общее улучшение английского',
      travel: 'английский для путешествий',
      business: 'деловой английский',
      ielts: 'подготовка к IELTS',
      it: 'английский для IT и технологий',
      conversation: 'разговорный английский',
    }

    const prompt = `You are an English learning expert. Create a 4-week study plan for a ${level} level student.
Goal: ${goalMap[goal] || goal}
Available time: ${hoursPerWeek} hours per week.

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "week": 1,
    "focus": "Название темы недели",
    "lessons": ["Урок 1", "Урок 2", "Урок 3"],
    "vocabulary": "5-8 конкретных слов через запятую",
    "practice": "Конкретное задание для практики",
    "goal": "Что должен уметь к концу недели"
  }
]

Make it specific to ${level} level and "${goalMap[goal] || goal}" goal. All text in Russian. 4 weeks total.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an English teacher. Return valid JSON only. No markdown.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    })

    if (!res.ok) throw new Error(`Groq ${res.status}`)
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content ?? '[]'
    const match = raw.match(/\[[\s\S]*\]/)
    const parsed = match ? JSON.parse(match[0]) : []
    return NextResponse.json({ plan: parsed })
  } catch (e) {
    console.error('generate-plan error:', e)
    return NextResponse.json({ plan: [], error: 'AI unavailable' }, { status: 500 })
  }
}
