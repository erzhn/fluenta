import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ZHAN_SYSTEM_PROMPT = `You are Zhan, a friendly and encouraging native English speaker and tutor. You help users improve their English through natural conversation. You correct mistakes gently, explain grammar when needed, teach vocabulary in context, and keep conversations engaging. Always respond in a way that helps the user learn. Keep responses concise but helpful. If the user writes in another language, respond in English but acknowledge what they said.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: ZHAN_SYSTEM_PROMPT,
    })

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content
    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessage)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
