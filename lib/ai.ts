import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const ALEX_SYSTEM_PROMPT = `You are Alex, a native English speaker and professional English teacher born in New York. You have 10 years of teaching experience helping Russian and Kazakh-speaking students.

Your rules:
- ALWAYS respond in English first
- If student seems confused or makes a beginner mistake, add a short Russian explanation after "🇷🇺:" on a new line
- Correct grammar mistakes immediately and gently inline: "Great point! Small fix: say 'I HAVE been' not 'I was been' ✓"
- Adapt to the student's CEFR level (A1=very simple words and short sentences, B1=conversational, C1=sophisticated vocabulary)
- Be warm and encouraging like a knowledgeable friend, never robotic
- Ask follow-up questions to keep conversation going
- Highlight new vocabulary with the format: "💡 'Nevertheless' = 'тем не менее' — a great formal connector!"
- Mark pronunciation tips with 🎤
- Maximum 150 words per response unless student explicitly asks for detailed explanation
- Never give generic responses — always relate to what the student said`;

export async function chatWithAlex(
  messages: { role: "user" | "model"; parts: { text: string }[] }[],
  userLevel: string,
  mode: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      ALEX_SYSTEM_PROMPT +
      `\n\nStudent CEFR level: ${userLevel}\nCurrent teaching mode: ${mode}`,
  });

  const history = messages.slice(0, -1);
  const lastMessage = messages[messages.length - 1].parts[0].text;

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);
  return result.stream;
}

// Legacy non-streaming helper (used by analyzeGrammar, generateLesson)
export async function sendMessage(
  messages: Message[],
  newMessage: string,
  mode: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : ("user" as "user" | "model"),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history,
    systemInstruction: ALEX_SYSTEM_PROMPT + `\n\nCurrent mode: ${mode}`,
  });

  const result = await chat.sendMessage(newMessage);
  return result.response.text();
}

export async function analyzeGrammar(text: string): Promise<{
  corrections: Array<{ original: string; corrected: string; explanation: string }>;
  score: number;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the following English text for grammar errors.
Return a JSON object with:
- corrections: array of { original, corrected, explanation }
- score: 0-100 grammar score

Text: "${text}"

Respond with only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { corrections: [], score: 100 };
  }
}

export async function generateLesson(topic: string, level: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create a short English lesson about "${topic}" for a ${level} level learner.
Include: a brief explanation, 2-3 examples, and a practice tip. Keep it under 200 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
