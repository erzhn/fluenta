"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  userId?: string;
  streaming?: boolean;
}

// Parse 💡 vocab patterns: 💡 'word' = 'translation' — description
function extractVocab(text: string): Array<{ word: string; translation: string }> {
  const regex = /💡\s*['"]([^'"]+)['"]\s*=\s*['"]([^'"]+)['"]/g;
  const items: Array<{ word: string; translation: string }> = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    items.push({ word: match[1], translation: match[2] });
  }
  return items;
}

// Render text with lightweight highlighting
function MessageText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Russian explanation line
        if (line.startsWith("🇷🇺:")) {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-muted-foreground text-xs italic"
            >
              <span>🇷🇺</span>
              <span>{line.slice(3).trim()}</span>
            </div>
          );
        }
        // Vocabulary highlight line
        if (line.includes("💡")) {
          return (
            <div
              key={i}
              className="bg-[#F59E0B]/10 border border-[#F59E0B]/25 rounded-lg px-2.5 py-1.5 text-sm"
            >
              {line}
            </div>
          );
        }
        // Pronunciation tip
        if (line.includes("🎤")) {
          return (
            <div
              key={i}
              className="bg-primary/10 border border-primary/25 rounded-lg px-2.5 py-1.5 text-sm"
            >
              {line}
            </div>
          );
        }
        // Empty line
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        return (
          <p key={i} className="text-sm leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessage({ message, userId, streaming }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const vocabItems = !isUser ? extractVocab(message.content) : [];

  const saveWord = async (word: string, translation: string) => {
    if (!userId || savedWords.has(word)) return;
    setSavedWords((prev) => new Set([...prev, word]));
    try {
      await supabase.from("vocabulary").insert({
        user_id: userId,
        word,
        translation,
        context: message.content.slice(0, 200),
        next_review: new Date().toISOString(),
      });
    } catch {
      // Non-fatal — word stays in UI as "saved"
    }
  };

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold select-none ${
          isUser
            ? "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white"
            : "bg-card border border-border text-lg"
        }`}
      >
        {isUser ? "Вы" : "👨‍🏫"}
      </div>

      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender label */}
        <div className={`text-[11px] font-medium ${isUser ? "text-muted-foreground" : "text-primary"}`}>
          {isUser ? "Вы" : "Zhan"}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isUser
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-card border border-border text-[#E2E8F0] rounded-tl-sm"
          }`}
        >
          {isUser ? (
            message.isVoice && message.audioUrl ? (
              <div className="space-y-2">
                <audio src={message.audioUrl} controls className="h-8 w-full max-w-[200px] opacity-80" />
                {message.content && (
                  <p className="text-xs italic opacity-75 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            )
          ) : (
            <MessageText text={message.content} />
          )}

          {/* Streaming cursor */}
          {streaming && !isUser && (
            <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 rounded-full" />
          )}
        </div>

        {/* Vocabulary save buttons */}
        {vocabItems.length > 0 && !streaming && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {vocabItems.map(({ word, translation }) => (
              <motion.button
                key={word}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => saveWord(word, translation)}
                disabled={savedWords.has(word)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                  savedWords.has(word)
                    ? "border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-[#818CF8]"
                }`}
              >
                {savedWords.has(word) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <BookmarkPlus className="w-3 h-3" />
                )}
                {savedWords.has(word) ? "Сохранено" : `Сохранить «${word}»`}
              </motion.button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-[#334155] px-1">{time}</div>
      </div>
    </motion.div>
  );
}
