import { NextRequest, NextResponse } from "next/server";
import { chatWithAlex } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase";

// In-memory rate limiter (per serverless instance; good enough for abuse prevention)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      userLevel = "B1",
      mode = "conversation",
      userId,
      conversationId,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const rateLimitKey = userId ?? (request.headers.get("x-forwarded-for") || "anon");
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Превышен лимит: 20 сообщений в минуту" },
        { status: 429 }
      );
    }

    const geminiMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
        parts: [{ text: m.content }],
      })
    );

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const geminiStream = await chatWithAlex(geminiMessages, userLevel, mode);

          for await (const chunk of geminiStream) {
            const text = chunk.text();
            if (text) {
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Persist to Supabase (non-fatal)
          let savedConvId: string | null = conversationId ?? null;
          if (userId) {
            try {
              const supabase = createServerClient();
              const allMessages = [
                ...messages,
                {
                  role: "assistant",
                  content: fullResponse,
                  timestamp: new Date().toISOString(),
                },
              ];

              if (conversationId) {
                await supabase
                  .from("ai_conversations")
                  .update({
                    messages: allMessages,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", conversationId)
                  .eq("user_id", userId);
              } else {
                const title =
                  messages[0]?.content?.slice(0, 60) || "Новый разговор";
                const { data: newConv } = await supabase
                  .from("ai_conversations")
                  .insert({ user_id: userId, title, messages: allMessages })
                  .select("id")
                  .single();
                savedConvId = newConv?.id ?? null;
              }
            } catch {
              // DB failure is non-fatal — keep streaming
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, conversationId: savedConvId })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI unavailable";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
