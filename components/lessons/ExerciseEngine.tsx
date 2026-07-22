"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, Lightbulb, Check, Bot } from "lucide-react";
import type { ExerciseItem } from "@/lib/lessons-data";
import { useAIGenerate } from "@/hooks/useAIGenerate";

interface ExerciseEngineProps {
  exercise: ExerciseItem;
  exerciseNumber: number;
  total: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

type Status = "unanswered" | "correct" | "wrong";

// ─── Fill Blank ───────────────────────────────────────────────────────────────
function FillBlank({ exercise, onResult }: {
  exercise: Extract<ExerciseItem, { type: "fill_blank" }>;
  onResult: (correct: boolean, userAnswer?: string) => void;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const parts = exercise.question.split("___");
  const isCorrect = checked && value.trim().toLowerCase() === exercise.answer.toLowerCase();

  const handleCheck = () => {
    if (!value.trim() || checked) return;
    setChecked(true);
    onResult(value.trim().toLowerCase() === exercise.answer.toLowerCase(), value.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-base font-medium text-white leading-loose">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1 flex-wrap">
            <span>{part}</span>
            {i < parts.length - 1 && (
              <input
                type="text"
                value={value}
                onChange={(e) => { if (!checked) setValue(e.target.value); }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="______"
                disabled={checked}
                className={`w-28 sm:w-36 border-b-2 bg-transparent text-center font-semibold outline-none transition-colors px-1 ${
                  checked
                    ? isCorrect ? "border-[#10B981] text-[#10B981]" : "border-[#EF4444] text-[#EF4444]"
                    : "border-primary text-[#818CF8] focus:border-[#818CF8]"
                }`}
              />
            )}
          </span>
        ))}
      </div>
      {exercise.hint && <p className="text-muted-foreground text-xs flex items-start gap-1.5"><Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#F59E0B]" strokeWidth={1.75} /> {exercise.hint}</p>}
      {!checked && (
        <button onClick={handleCheck} disabled={!value.trim()}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#5558E3] disabled:bg-card disabled:text-[#334155] text-white text-sm font-semibold transition-all">
          Проверить
        </button>
      )}
      {checked && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            isCorrect ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}>
          {isCorrect ? <span className="inline-flex items-center gap-1.5">Верно! <Check className="w-4 h-4" strokeWidth={2.5} /></span> : `Правильный ответ: "${exercise.answer}"`}
        </motion.div>
      )}
    </div>
  );
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────
function MultipleChoice({ exercise, onResult }: {
  exercise: Extract<ExerciseItem, { type: "multiple_choice" }>;
  onResult: (correct: boolean, userAnswer?: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    onResult(opt === exercise.answer, opt);
  };

  const getBtnClass = (opt: string) => {
    if (selected === null) return "border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-white";
    if (opt === exercise.answer) return "border-[#10B981] bg-[#10B981]/15 text-[#10B981]";
    if (opt === selected) return "border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444]";
    return "border-[#1E293B] bg-background text-muted-foreground";
  };

  return (
    <div className="space-y-3">
      <p className="text-white font-medium text-base leading-relaxed">{exercise.question}</p>
      <div className="space-y-2.5 mt-4">
        {exercise.options?.map((opt) => (
          <motion.button key={opt} whileTap={selected === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(opt)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 ${getBtnClass(opt)}`}>
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Build Sentence ───────────────────────────────────────────────────────────
function BuildSentence({ exercise, onResult }: {
  exercise: Extract<ExerciseItem, { type: "build_sentence" }>;
  onResult: (correct: boolean, userAnswer?: string) => void;
}) {
  const [available, setAvailable] = useState<string[]>([...(exercise.words ?? [])].sort(() => Math.random() - 0.5));
  const [arranged, setArranged] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (checked) return;
    const correct = arranged.join(" ") === exercise.answer;
    setChecked(true);
    onResult(correct, arranged.join(" "));
  };

  const isCorrect = checked && arranged.join(" ") === exercise.answer;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{exercise.question || "Расставь слова в правильном порядке:"}</p>
      <div className="min-h-[52px] flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed border-border bg-background">
        {arranged.length === 0 && <span className="text-[#334155] text-sm self-center">Нажми на слова ниже...</span>}
        {arranged.map((word, idx) => (
          <motion.button key={`a${idx}`} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={() => { if (checked) return; setAvailable(a => [...a, word]); setArranged(b => b.filter((_, i) => i !== idx)); }}
            disabled={checked}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              checked ? (isCorrect ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]" : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]")
                : "bg-primary/15 border-primary/40 text-[#818CF8] hover:bg-primary/25"
            }`}>
            {word}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {available.map((word, idx) => (
          <motion.button key={`v${idx}`} whileTap={{ scale: 0.95 }}
            onClick={() => { if (checked) return; setArranged(b => [...b, word]); setAvailable(a => a.filter((_, i) => i !== idx)); }}
            disabled={checked}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-card border border-border text-white hover:border-primary/50 hover:bg-primary/10 transition-all disabled:opacity-40">
            {word}
          </motion.button>
        ))}
      </div>
      {!checked ? (
        <button onClick={handleCheck} disabled={arranged.length === 0}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#5558E3] disabled:bg-card disabled:text-[#334155] text-white text-sm font-semibold transition-all">
          Проверить порядок
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            isCorrect ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}>
          {isCorrect ? <span className="inline-flex items-center gap-1.5">Верно! <Check className="w-4 h-4" strokeWidth={2.5} /></span> : `Правильный порядок: "${exercise.answer}"`}
        </motion.div>
      )}
    </div>
  );
}

// ─── Main ExerciseEngine ──────────────────────────────────────────────────────
export function ExerciseEngine({ exercise, exerciseNumber, total, onCorrect, onWrong, onNext }: ExerciseEngineProps) {
  const [status, setStatus] = useState<Status>("unanswered");
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const { generate, loading: aiLoading } = useAIGenerate();

  useEffect(() => {
    setStatus("unanswered");
    setAiExplanation("");
    setShowExplanation(false);
    setLastUserAnswer("");
  }, [exerciseNumber]);

  const handleResult = (correct: boolean, userAnswer?: string) => {
    setStatus(correct ? "correct" : "wrong");
    if (userAnswer) setLastUserAnswer(userAnswer);
    if (correct) onCorrect(); else onWrong();
  };

  async function getAIExplanation() {
    setShowExplanation(true);
    const question = exercise.question ?? exercise.answer;
    const context = `Question: "${question}". Correct answer: "${exercise.answer}". User answered: "${lastUserAnswer}". Explain briefly in Russian why the correct answer is right and common mistake to avoid. Max 2 sentences.`;
    const data = await generate<{ explanation: string }>('grammar_exercise', context, 'B1');
    setAiExplanation(data?.explanation ?? 'Не удалось получить объяснение.');
  }

  const typeLabels: Record<string, string> = {
    "multiple_choice": "Выбери правильный ответ",
    "fill_blank": "Заполни пропуск",
    "build_sentence": "Восстанови порядок",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <span className="text-muted-foreground text-xs font-medium">{typeLabels[exercise.type] ?? exercise.type}</span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              i < exerciseNumber - 1 ? "bg-[#10B981] w-5" : i === exerciseNumber - 1 ? "bg-primary w-7" : "bg-card w-5"
            }`} />
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={exerciseNumber} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {exercise.type === "fill_blank" && <FillBlank exercise={exercise as Extract<ExerciseItem, { type: "fill_blank" }>} onResult={(c, ua) => handleResult(c, ua)} />}
            {exercise.type === "multiple_choice" && <MultipleChoice exercise={exercise as Extract<ExerciseItem, { type: "multiple_choice" }>} onResult={(c, ua) => handleResult(c, ua)} />}
            {exercise.type === "build_sentence" && <BuildSentence exercise={exercise as Extract<ExerciseItem, { type: "build_sentence" }>} onResult={(c, ua) => handleResult(c, ua)} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {status !== "unanswered" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="mt-5 pt-4 border-t border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === "correct"
                  ? <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  : <XCircle className="w-5 h-5 text-[#EF4444]" />}
                <span className={`font-semibold text-sm ${status === "correct" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {status === "correct" ? "Правильно! +10 XP" : "Неправильно"}
                </span>
              </div>
              <button onClick={onNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#5558E3] text-white text-sm font-semibold transition-all hover:scale-[1.03]">
                {exerciseNumber < total ? "Следующее упражнение" : "Завершить урок"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {status === "wrong" && (
              <div>
                {showExplanation && aiExplanation && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground/80">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary"><Bot className="w-4 h-4" strokeWidth={1.75} /> AI объясняет: </span>
                    {aiExplanation}
                  </div>
                )}
                {showExplanation && !aiExplanation && aiLoading && (
                  <p className="text-xs text-muted-foreground animate-pulse">Загружаю объяснение...</p>
                )}
                {!showExplanation && (
                  <button onClick={getAIExplanation} disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50">
                    <Bot className="w-4 h-4" strokeWidth={1.75} /> AI объясняет
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
