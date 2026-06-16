import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "placeholder-key");

export async function POST(request: NextRequest) {
  try {
    const { word, translation } = await request.json();
    if (!word?.trim()) return NextResponse.json({ error: "Word required" }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `For the English word "${word}" (Russian translation: "${translation}"), provide:
1. IPA phonetic transcription (e.g. /wɜːrd/)
2. A natural example sentence using this word (not too complex)
3. Part of speech (noun/verb/adjective/adverb/etc)
4. 3-4 English synonyms
5. One sentence in Russian explaining nuance or usage tip

Respond ONLY with valid JSON, no markdown:
{
  "phonetic": "/..../",
  "context": "Example sentence here.",
  "partOfSpeech": "noun",
  "synonyms": ["word1", "word2", "word3"],
  "tip": "Совет на русском..."
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { phonetic: "", context: "", partOfSpeech: "noun", synonyms: [], tip: "" },
      { status: 200 }
    );
  }
}
