"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, RotateCcw } from "lucide-react";
import type { VocabWord } from "@/types";

interface FlashCardProps {
  word: VocabWord;
  onFlip?: (flipped: boolean) => void;
  forceFlipped?: boolean;
}

function HighlightedContext({ context, word }: { context: string; word: string }) {
  const lower = context.toLowerCase();
  const wordLower = word.toLowerCase();
  const idx = lower.indexOf(wordLower);
  if (idx === -1) return <span className="italic text-[#94A3B8]">"{context}"</span>;
  return (
    <span className="italic text-[#94A3B8]">
      "{context.slice(0, idx)}
      <mark className="bg-[#6366F1]/30 text-[#818CF8] rounded-sm not-italic px-0.5 mx-0.5">
        {context.slice(idx, idx + word.length)}
      </mark>
      {context.slice(idx + word.length)}"
    </span>
  );
}

export function FlashCard({ word, onFlip, forceFlipped }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (forceFlipped !== undefined) setFlipped(forceFlipped);
  }, [forceFlipped]);

  const handleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(word.word);
    u.lang = "en-US";
    u.rate = 0.85;
    // Prefer an American English voice
    const voices = window.speechSynthesis.getVoices();
    const american = voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ?? voices.find((v) => v.lang === "en-US");
    if (american) u.voice = american;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const isNew = word.repetitions === 0;
  const isMastered = word.interval >= 21;

  return (
    <div
      onClick={handleFlip}
      className="cursor-pointer w-full select-none"
      style={{ perspective: "1200px" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleFlip(); } }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}
        className="w-full h-64 sm:h-72"
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 bg-[#1E293B] border border-[#334155] rounded-2xl flex flex-col items-center justify-center p-8 text-center"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isNew && <span className="text-[10px] font-bold bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded-full">Новое</span>}
            {isMastered && <span className="text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full">Выучено</span>}
            {word.part_of_speech && (
              <span className="text-[10px] text-[#475569] bg-[#0F172A] px-2 py-0.5 rounded-full">{word.part_of_speech}</span>
            )}
          </div>

          <h3 className="text-4xl font-extrabold text-white mt-3 mb-2 tracking-tight">{word.word}</h3>

          {word.phonetic && (
            <p className="text-[#64748B] font-mono text-base mb-4">{word.phonetic}</p>
          )}

          <button
            onClick={speak}
            className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] hover:border-[#475569] text-[#64748B] hover:text-white transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 mt-5 text-[#334155] text-xs">
            <RotateCcw className="w-3 h-3" />
            Пробел или нажми для перевода
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <p className="text-3xl font-extrabold text-white mb-3">{word.translation}</p>

          {word.context && (
            <div className="text-sm mb-4 max-w-xs leading-relaxed">
              <HighlightedContext context={word.context} word={word.word} />
            </div>
          )}

          {word.part_of_speech && (
            <span className="text-[10px] font-bold bg-[#334155] text-[#94A3B8] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {word.part_of_speech}
            </span>
          )}

          <button
            onClick={speak}
            className="mt-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white transition-all"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
