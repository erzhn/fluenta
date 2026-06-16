"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, Loader2 } from "lucide-react";
import type { ExerciseItem } from "@/lib/lessons-data";

interface ExerciseEngineProps {
  exercise: ExerciseItem;
  exerciseNumber: number;
  total: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

type Status = "unanswered" | "correct" | "wrong";

// ─── Multiple Choice ──────────────────────────────────────────────────────────
function MultipleChoice({
  exercise,
  onResult,
}: {
  exercise: Extract<ExerciseItem, { type: "multiple-choice" }>;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onResult(idx === exercise.answer);
  };

  const getBtnClass = (idx: number) => {
    if (selected === null)
      return "border-[#334155] bg-[#1E293B] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5 text-white";
    if (idx === exercise.answer)
      return "border-[#10B981] bg-[#10B981]/15 text-[#10B981]";
    if (idx === selected)
      return "border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444]";
    return "border-[#1E293B] bg-[#0F172A] text-[#475569]";
  };

  return (
    <div className="space-y-3">
      <p className="text-white font-medium text-base leading-relaxed">{exercise.question}</p>
      <div className="space-y-2.5 mt-4">
        {exercise.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={selected === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 ${getBtnClass(idx)}`}
          >
            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
              selected !== null && idx === exercise.answer
                ? "border-[#10B981] bg-[#10B981] text-white"
                : selected === idx && idx !== exercise.answer
                ? "border-[#EF4444] bg-[#EF4444] text-white"
                : "border-current"
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 px-4 py-3 rounded-xl text-sm ${
            selected === exercise.answer
              ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {exercise.explanation}
        </motion.div>
      )}
    </div>
  );
}

// ─── Fill Blank ───────────────────────────────────────────────────────────────
function FillBlank({
  exercise,
  onResult,
}: {
  exercise: Extract<ExerciseItem, { type: "fill-blank" }>;
  onResult: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);

  const isCorrect = checked && value.trim().toLowerCase() === exercise.answer.toLowerCase();

  const handleCheck = () => {
    if (!value.trim() || checked) return;
    setChecked(true);
    onResult(value.trim().toLowerCase() === exercise.answer.toLowerCase());
  };

  const parts = exercise.sentence.split("___");

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
                    ? isCorrect
                      ? "border-[#10B981] text-[#10B981]"
                      : "border-[#EF4444] text-[#EF4444]"
                    : "border-[#6366F1] text-[#818CF8] focus:border-[#818CF8]"
                }`}
              />
            )}
          </span>
        ))}
      </div>
      <p className="text-[#475569] text-xs">💡 {exercise.hint}</p>
      {!checked && (
        <button
          onClick={handleCheck}
          disabled={!value.trim()}
          className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] disabled:text-[#334155] text-white text-sm font-semibold transition-all"
        >
          Проверить
        </button>
      )}
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            isCorrect
              ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {isCorrect ? "Верно! ✓" : `Правильный ответ: "${exercise.answer}"`}
        </motion.div>
      )}
    </div>
  );
}

// ─── Reorder ──────────────────────────────────────────────────────────────────
function Reorder({
  exercise,
  onResult,
}: {
  exercise: Extract<ExerciseItem, { type: "reorder" }>;
  onResult: (correct: boolean) => void;
}) {
  const [available, setAvailable] = useState<string[]>([...exercise.words]);
  const [arranged, setArranged] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const addWord = (word: string, idx: number) => {
    if (checked) return;
    setArranged((p) => [...p, word]);
    setAvailable((p) => p.filter((_, i) => i !== idx));
  };

  const removeWord = (_: string, idx: number) => {
    if (checked) return;
    const word = arranged[idx];
    setAvailable((p) => [...p, word]);
    setArranged((p) => p.filter((_, i) => i !== idx));
  };

  const handleCheck = () => {
    if (arranged.length !== exercise.words.length || checked) return;
    const correct = arranged.join(" ") === exercise.correct;
    setChecked(true);
    onResult(correct);
  };

  const isCorrect = checked && arranged.join(" ") === exercise.correct;

  return (
    <div className="space-y-4">
      <p className="text-[#94A3B8] text-sm">Расставь слова в правильном порядке:</p>
      <div className="min-h-[52px] flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed border-[#334155] bg-[#0F172A]">
        {arranged.length === 0 && (
          <span className="text-[#334155] text-sm self-center">Нажми на слова ниже...</span>
        )}
        {arranged.map((word, idx) => (
          <motion.button
            key={`arr-${idx}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => removeWord(word, idx)}
            disabled={checked}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              checked
                ? isCorrect
                  ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]"
                  : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                : "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#818CF8] hover:bg-[#6366F1]/25"
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {available.map((word, idx) => (
          <motion.button
            key={`avail-${idx}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWord(word, idx)}
            disabled={checked}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1E293B] border border-[#334155] text-white hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10 transition-all disabled:opacity-40"
          >
            {word}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-2">
        {!checked ? (
          <>
            <button
              onClick={handleCheck}
              disabled={arranged.length !== exercise.words.length}
              className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] disabled:text-[#334155] text-white text-sm font-semibold transition-all"
            >
              Проверить порядок
            </button>
            <button
              onClick={() => { setAvailable([...exercise.words]); setArranged([]); }}
              className="px-4 py-2.5 rounded-xl border border-[#334155] text-[#64748B] hover:text-white text-sm transition-all"
            >
              Сброс
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium flex-1 ${
              isCorrect
                ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
                : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
            }`}
          >
            {isCorrect ? "Верно! ✓" : `Правильный порядок: "${exercise.correct}"`}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Translation ──────────────────────────────────────────────────────────────
function Translation({
  exercise,
  onResult,
}: {
  exercise: Extract<ExerciseItem, { type: "translation" }>;
  onResult: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);

  const handleCheck = async () => {
    if (!value.trim() || loading || feedback) return;
    setLoading(true);
    try {
      const res = await fetch("/api/check-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expected: exercise.en, userAnswer: value }),
      });
      const data = await res.json();
      setFeedback(data);
      onResult(data.correct);
    } catch {
      const fb = { correct: false, feedback: "Ошибка проверки. Попробуй ещё раз." };
      setFeedback(fb);
      onResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
        <div className="text-[#475569] text-xs mb-1.5 uppercase tracking-wide font-medium">
          Переведи на английский:
        </div>
        <div className="text-white font-medium text-lg leading-relaxed">{exercise.ru}</div>
      </div>
      <textarea
        value={value}
        onChange={(e) => { if (!feedback) setValue(e.target.value); }}
        placeholder="Write your English translation here..."
        rows={3}
        disabled={!!feedback || loading}
        className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3 text-white placeholder-[#334155] text-sm outline-none resize-none transition-colors disabled:opacity-60"
      />
      {!feedback && (
        <button
          onClick={handleCheck}
          disabled={!value.trim() || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] disabled:text-[#334155] text-white text-sm font-semibold transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "AI проверяет..." : "Проверить перевод"}
        </button>
      )}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm space-y-1.5 ${
            feedback.correct
              ? "bg-[#10B981]/10 border border-[#10B981]/30"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30"
          }`}
        >
          <div className={`font-semibold ${feedback.correct ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {feedback.correct ? "✓ Отлично!" : "✗ Не совсем верно"}
          </div>
          <div className="text-[#94A3B8]">{feedback.feedback}</div>
          {!feedback.correct && (
            <div className="text-[#64748B] text-xs">
              Правильный вариант: <span className="text-white italic">{exercise.en}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Error Spot ───────────────────────────────────────────────────────────────
function ErrorSpot({
  exercise,
  onResult,
}: {
  exercise: Extract<ExerciseItem, { type: "error-spot" }>;
  onResult: (correct: boolean) => void;
}) {
  const [clicked, setClicked] = useState<string | null>(null);
  const words = exercise.sentence.split(" ");

  const matchesError = (word: string) =>
    word.toLowerCase().replace(/[.,!?;:'"]/g, "") ===
    exercise.errorWord.toLowerCase().replace(/[.,!?;:'"]/g, "");

  const handleClick = (word: string) => {
    if (clicked !== null) return;
    setClicked(word);
    onResult(matchesError(word));
  };

  const getBtnClass = (word: string) => {
    if (clicked === null)
      return "border-[#1E293B] bg-[#1E293B] hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/5 text-white cursor-pointer";
    if (matchesError(word))
      return "border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444]";
    if (word === clicked)
      return "border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]";
    return "border-[#0F172A] bg-[#0F172A] text-[#334155] cursor-default";
  };

  const isCorrect = clicked !== null && matchesError(clicked);

  return (
    <div className="space-y-4">
      <p className="text-[#94A3B8] text-sm">Кликни на слово с ошибкой:</p>
      <div className="flex flex-wrap gap-2 p-4 bg-[#0F172A] rounded-xl border border-[#1E293B]">
        {words.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(word)}
            disabled={clicked !== null}
            className={`px-2.5 py-1.5 rounded-lg border text-sm font-medium transition-all ${getBtnClass(word)}`}
          >
            {word}
          </button>
        ))}
      </div>
      {clicked !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm space-y-1 ${
            isCorrect
              ? "bg-[#10B981]/10 border border-[#10B981]/30"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30"
          }`}
        >
          <div className={`font-semibold ${isCorrect ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {isCorrect ? "✓ Верно!" : "✗ Не та ошибка"}
          </div>
          <div className="text-[#94A3B8]">
            Исправление:{" "}
            <span className="text-[#EF4444] line-through mr-1">{exercise.errorWord}</span>
            <span className="text-[#10B981] font-semibold">→ {exercise.correction}</span>
          </div>
          <div className="text-[#64748B] text-xs mt-0.5">{exercise.explanation}</div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main ExerciseEngine ──────────────────────────────────────────────────────
export function ExerciseEngine({
  exercise,
  exerciseNumber,
  total,
  onCorrect,
  onWrong,
  onNext,
}: ExerciseEngineProps) {
  const [status, setStatus] = useState<Status>("unanswered");

  useEffect(() => {
    setStatus("unanswered");
  }, [exerciseNumber]);

  const handleResult = (correct: boolean) => {
    setStatus(correct ? "correct" : "wrong");
    if (correct) onCorrect();
    else onWrong();
  };

  const typeLabels: Record<ExerciseItem["type"], string> = {
    "multiple-choice": "Выбери правильный ответ",
    "fill-blank": "Заполни пропуск",
    reorder: "Восстанови порядок",
    translation: "Переведи предложение",
    "error-spot": "Найди ошибку",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[#475569] text-xs font-medium">{typeLabels[exercise.type]}</span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < exerciseNumber - 1
                  ? "bg-[#10B981] w-5"
                  : i === exerciseNumber - 1
                  ? "bg-[#6366F1] w-7"
                  : "bg-[#1E293B] w-5"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={exerciseNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {exercise.type === "multiple-choice" && (
              <MultipleChoice exercise={exercise} onResult={handleResult} />
            )}
            {exercise.type === "fill-blank" && (
              <FillBlank exercise={exercise} onResult={handleResult} />
            )}
            {exercise.type === "reorder" && (
              <Reorder exercise={exercise} onResult={handleResult} />
            )}
            {exercise.type === "translation" && (
              <Translation exercise={exercise} onResult={handleResult} />
            )}
            {exercise.type === "error-spot" && (
              <ErrorSpot exercise={exercise} onResult={handleResult} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {status !== "unanswered" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-5 pt-4 border-t border-[#1E293B] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {status === "correct" ? (
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#EF4444]" />
              )}
              <span className={`font-semibold text-sm ${status === "correct" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {status === "correct" ? "Правильно! +10 XP" : "Неправильно"}
              </span>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] text-white text-sm font-semibold transition-all hover:scale-[1.03]"
            >
              {exerciseNumber < total ? "Следующее упражнение" : "Завершить урок"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
