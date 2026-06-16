"use client";

import { useState, useRef } from "react";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message... (Enter to send)"
          disabled={disabled}
          rows={1}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 pr-4 text-white placeholder-[#475569] focus:outline-none focus:border-[#6366F1] transition-colors resize-none text-sm leading-relaxed"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="w-10 h-10 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#334155] disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
      >
        <Send className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
