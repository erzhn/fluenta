import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "placeholder-key"
);

export async function POST(request: NextRequest) {
  try {
    const { expected, userAnswer } = await request.json();

    if (!userAnswer?.trim()) {
      return NextResponse.json({ correct: false, feedback: "Введи перевод." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an English teacher checking a student's translation.

The student was asked to translate this English sentence into English (or Russian sentence into English):
Expected answer: "${expected}"
Student's answer: "${userAnswer}"

The answer doesn't need to be word-for-word identical — judge on meaning and grammar.
Respond with JSON only, no markdown:
{"correct": true or false, "feedback": "1-2 sentences in Russian explaining if correct or what the error is"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      correct: false,
      feedback: "Не удалось проверить ответ. Попробуй ещё раз.",
    });
  }
}
