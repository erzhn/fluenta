"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, GraduationCap, Lightbulb, Mic } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  userId?: string;
  streaming?: boolean;
}

// Parse vocab patterns: VOCAB: 'word' = 'translation' — description
function extractVocab(text: string): Array<{ word: string; translation: string }> {
  const regex = /VOCAB:\s*['"]([^'"]+)['"]\s*=\s*['"]([^'"]+)['"]/gi;
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
        if (line.startsWith("RU:")) {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-muted-foreground text-xs italic"
            >
              <span className="font-semibold not-italic text-[#818CF8]">RU</span>
              <span>{line.slice(3).trim()}</span>
            </div>
          );
        }
        // Vocabulary highlight line
        if (/^VOCAB:/i.test(line.trim())) {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/25 rounded-lg px-2.5 py-1.5 text-sm"
            >
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" strokeWidth={1.75} />
              <span>{line.replace(/^\s*VOCAB:\s*/i, "")}</span>
            </div>
          );
        }
        // Pronunciation tip
        if (/^PRON:/i.test(line.trim())) {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-primary/10 border border-primary/25 rounded-lg px-2.5 py-1.5 text-sm"
            >
              <Mic className="w-4 h-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
              <span>{line.replace(/^\s*PRON:\s*/i, "")}</span>
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
            : "bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-primary/30 text-primary"
        }`}
      >
        {isUser ? "Вы" : <GraduationCap className="w-4 h-4" strokeWidth={1.75} />}
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
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
