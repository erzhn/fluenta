"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in (window as any));
    setUnsupported(!supported);
  }, []);

  const handleToggle = () => {
    if (disabled) return;

    if (unsupported) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechAPI =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechAPI() as any;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    setIsRecording(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="relative shrink-0">
      {/* Recording overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#EF4444] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Слушаю...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsupported tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] text-[#CBD5E1] text-xs px-3 py-2 rounded-xl shadow-xl z-10 max-w-[180px] text-center"
          >
            Используй Chrome или Edge для голосового ввода
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        disabled={disabled}
        title={
          unsupported
            ? "Голосовой ввод не поддерживается"
            : isRecording
            ? "Остановить запись"
            : "Голосовой ввод"
        }
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          isRecording
            ? "bg-[#EF4444] text-white shadow-lg shadow-red-500/30"
            : unsupported
            ? "bg-[hsl(var(--background-secondary))] text-[#334155] cursor-help"
            : "bg-[hsl(var(--background-secondary))] hover:bg-[#334155] text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground-muted))]"
        }`}
      >
        {/* Pulsing ring when recording */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-xl bg-[#EF4444] animate-ping opacity-30" />
            <span className="absolute inset-[-4px] rounded-[14px] border-2 border-[#EF4444]/40 animate-pulse" />
          </>
        )}
        {isRecording ? (
          <MicOff className="w-4 h-4 relative z-10" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
