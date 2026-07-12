import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
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

  try {
    const { messages, mode } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const lastMsg = messages[messages.length - 1]
    if (!lastMsg?.content || typeof lastMsg.content !== 'string') {
      return NextResponse.json({ error: 'Invalid message content' }, { status: 400 })
    }
    if (lastMsg.content.trim().length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    const systemPrompt = mode === 'conversation'
      ? `You are Zhan, a friendly English-speaking companion. Chat naturally with the user on any topic they bring up. Be warm, curious, funny. Ask follow-up questions. Keep responses conversational and under 3 sentences unless the topic really needs more.`
      : `You are Zhan, a friendly and encouraging native English speaker and tutor. You help users improve their English through natural conversation. You correct mistakes gently, explain grammar when needed, teach vocabulary in context, and keep conversations engaging. Always respond in a way that helps the user learn. Keep responses concise but helpful. If the user writes in another language, respond in English but acknowledge what they said.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No response'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
