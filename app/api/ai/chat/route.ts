import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const systemPrompt = `You are Zhan, a friendly and encouraging native English speaker and tutor. You help users improve their English through natural conversation. You correct mistakes gently, explain grammar when needed, teach vocabulary in context, and keep conversations engaging. Always respond in a way that helps the user learn. Keep responses concise but helpful. If the user writes in another language, respond in English but acknowledge what they said.`

    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
