import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, context = '', level = 'B1' } = await request.json()

  const PROMPTS: Record<string, string> = {
    collocations: `Generate 6 useful English collocations related to "${context}". Return JSON: {"collocations":[{"collocation":"make a decision","translation":"принять решение","example":"She made a difficult decision.","category":"${context}"}]}`,
    idioms: `Generate 4 English idioms related to topic "${context}". Return JSON: {"idioms":[{"idiom":"bite the bullet","meaning":"терпеть неприятное","example":"Just bite the bullet and do it.","level":"${level}"}]}`,
    phrasal_verbs: `Generate 5 English phrasal verbs related to "${context}". Return JSON: {"verbs":[{"verb":"give up","meaning":"сдаться","example":"Don't give up on your dreams.","category":"${context}"}]}`,
    sentences: `Generate 5 English sentences at CEFR level ${level} about "${context || 'everyday life'}". Return JSON: {"sentences":[{"words":["I","like","coffee"],"translation":"Я люблю кофе","level":"${level}"}]}`,
    pronunciation_phrases: `Generate 6 English pronunciation practice phrases at level ${level} about "${context || 'everyday topics'}". Focus on sounds that are hard for Russian speakers. Return JSON: {"phrases":["Hello, how are you?","The weather is beautiful today."]}`,
    dictation_words: `Generate 10 English words appropriate for level ${level} dictation practice. Related to "${context || 'common vocabulary'}". Return JSON: {"words":["beautiful","necessary","environment"]}`,
    writing_template_section: `Help write this section of an English text. Section: "${context}". Level: ${level}. Return a 2-3 sentence example in fluent English. Return JSON: {"text":"example text here"}`,
    note_summary: `Summarize and improve these English learning notes. Make it clearer and add 2 key takeaways. Notes: "${context}". Return JSON: {"summary":"...", "takeaways":["...","..."]}`,
    progress_insight: `Based on these English learning stats: ${context}. Give a brief motivational insight in Russian (2-3 sentences) with specific advice on what to focus on next. Return JSON: {"insight":"...", "focus":"..."}`,
    weekly_analysis: `Analyze these weekly English learning stats: ${context}. Write a brief analysis in Russian (3-4 sentences) with specific praise and one improvement tip. Do not use emojis. Return JSON: {"analysis":"...", "tip":"..."}`,
    daily_tip: `Generate a practical English learning tip for a level ${level} student. Make it actionable and specific. Do not use emojis. Return JSON: {"tip":"...", "example":"..."}`,
    vocabulary_example: `Generate 2 natural example sentences for the English word "${context}" at CEFR level ${level}. Return JSON: {"sentences":["She made a good decision.","The decision was made quickly."]}`,
    grammar_exercise: `Create a fill-in-the-blank grammar exercise about "${context}" at level ${level}. Return JSON: {"question":"She ___ (go) to school every day.","answer":"goes","options":["go","goes","going","went"],"explanation":"Present Simple: he/she/it + verb+s"}`,
    mini_story: `Write a short engaging story (120-150 words) at level ${level} about "${context}". Return JSON: {"title":"...","content":"...","vocabulary":[{"word":"...","meaning":"..."}]}`,
    word_formation: `Show word formation from root "${context}": noun, verb, adjective, adverb with examples. Return JSON: {"root":"${context}","forms":[{"type":"noun","word":"decision","example":"Make a decision."}]}`,
    conversation_starter: `Generate 5 conversation starters for English practice at level ${level} about "${context || 'general topics'}". Return JSON: {"starters":["What do you think about...?","Have you ever...?"]}`,
  }

  const prompt = PROMPTS[type]
  if (!prompt) return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 })

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an English teacher. Respond with valid JSON only. No markdown, no explanation, just JSON.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    if (!res.ok) throw new Error(`Groq ${res.status}`)
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content ?? '{}'
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(raw)
    return NextResponse.json(parsed)
  } catch (e) {
    console.error('AI generate error:', e)
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
