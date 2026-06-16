"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Zap, CheckCircle, ChevronRight,
  BookOpen, MessageSquare, X, Send, Loader2
} from "lucide-react";
import Link from "next/link";
import { ExerciseEngine } from "@/components/lessons/ExerciseEngine";
import { getLessonById, getNextLesson, LEVEL_COLORS } from "@/lib/lessons-data";
import { supabase } from "@/lib/supabase";

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const COLORS = ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.8 + Math.random() * 1.2,
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, x: `${p.x}vw`, opacity: 1, rotate: p.rotate, scale: 1 }}
          animate={{ y: "110vh", opacity: 0, rotate: p.rotate + 720, scale: 0.5 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, top: 0 }}
        />
      ))}
    </div>
  );
}

// ─── Celebration Screen ───────────────────────────────────────────────────────
function CelebrationScreen({
  score, total, xpEarned, lessonId, nextLessonId, onRetry,
}: {
  score: number; total: number; xpEarned: number; lessonId: string;
  nextLessonId?: string; onRetry: () => void;
}) {
  const perfect = score === total;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-6 py-10 overflow-hidden">
      <Confetti />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
        className="relative z-10 text-7xl mb-5"
      >
        {perfect ? "🏆" : score >= 3 ? "🎉" : "💪"}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-2xl font-extrabold text-white mb-2"
      >
        {perfect ? "Идеально!" : score >= 3 ? "Отличная работа!" : "Урок завершён!"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="relative z-10 text-[#64748B] text-sm mb-8"
      >
        {perfect
          ? "Все упражнения выполнены правильно!"
          : `Правильных ответов: ${score} из ${total}`}
      </motion.p>

      {/* Score circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.6, stiffness: 200 }}
        className="relative z-10 flex items-center gap-6 mb-8"
      >
        {/* Accuracy */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-extrabold"
            style={{
              borderColor: pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444",
              color: pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444",
              backgroundColor: pct >= 80 ? "#10B981" + "15" : pct >= 60 ? "#F59E0B15" : "#EF444415",
            }}
          >
            {pct}%
          </div>
          <div className="text-[#475569] text-xs mt-1">точность</div>
        </div>

        {/* XP */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="w-20 h-20 rounded-full border-4 border-[#F59E0B] bg-[#F59E0B]/15 flex items-center justify-center text-xl font-extrabold text-[#F59E0B]"
          >
            +{xpEarned}
          </motion.div>
          <div className="text-[#475569] text-xs mt-1">XP</div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Link
          href="/lessons"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm font-semibold hover:border-[#475569] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          К урокам
        </Link>
        {nextLessonId ? (
          <Link
            href={`/lessons/${nextLessonId}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-semibold hover:from-[#5558E3] hover:to-[#7C3AED] transition-all"
          >
            Следующий урок
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-semibold hover:from-[#5558E3] hover:to-[#7C3AED] transition-all"
          >
            Повторить урок
          </button>
        )}
      </motion.div>
    </div>
  );
}

// ─── Alex Mini Chat ───────────────────────────────────────────────────────────
function AlexChat({ lessonTitle, onClose }: { lessonTitle: string; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([{
    role: "assistant",
    content: `Привет! Я готов ответить на вопросы по теме **"${lessonTitle}"**.\n\nЧто непонятно? Спрашивай! 😊`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef("");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");

    const userMsg = { role: "user" as const, content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    streamRef.current = "";
    setMessages([...newHistory, { role: "assistant" as const, content: "" }]);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Context: We are studying the lesson "${lessonTitle}". The student has a question.`,
            },
            ...newHistory.map((m) => ({ role: m.role, content: m.content })),
          ],
          userLevel: "B1",
          mode: "grammar",
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              streamRef.current += data.text;
              const snap = streamRef.current;
              setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snap } : m));
            }
          } catch { /* ignore */ }
        }
      }
    } catch {
      setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: "Ошибка. Попробуй ещё раз." } : m));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, lessonTitle]);

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[#0A1628] border-l border-[#1E293B] z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">👨‍🏫</span>
          <div>
            <div className="text-white font-bold text-sm">Alex</div>
            <div className="text-[#475569] text-xs">Спроси про урок</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm shrink-0">
                👨‍🏫
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#6366F1] text-white rounded-tr-sm"
                  : "bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-tl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && !streamRef.current && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm shrink-0">👨‍🏫</div>
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl rounded-tl-sm px-3 py-2.5">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 bg-[#334155] rounded-full" />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#1E293B] shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Задай вопрос..."
            disabled={loading}
            className="flex-1 bg-[#1E293B] border border-[#334155] focus:border-[#6366F1] rounded-xl px-3 py-2.5 text-white placeholder-[#334155] text-sm outline-none transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] flex items-center justify-center transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const lesson = getLessonById(id);
  const nextLesson = lesson ? getNextLesson(id) : undefined;

  const [phase, setPhase] = useState<"reading" | "exercises" | "celebration">("reading");
  const [currentEx, setCurrentEx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [alexOpen, setAlexOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const saveProgress = useCallback(async (score: number) => {
    if (!userId || !lesson) return;
    setSaving(true);
    try {
      await supabase.from("lessons_progress").upsert({
        user_id: userId,
        lesson_id: lesson.id,
        completed: true,
        score,
        completed_at: new Date().toISOString(),
      });
      // Award XP (best-effort — increment_xp RPC may not exist yet)
      try {
        const xp = Math.round(lesson.xpReward * (score / lesson.exercises.length));
        await supabase.rpc("increment_xp", { user_id: userId, amount: xp });
      } catch { /* non-fatal */ }
    } finally {
      setSaving(false);
    }
  }, [userId, lesson]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">📚</div>
          <div className="text-white font-bold mb-2">Урок не найден</div>
          <Link href="/lessons" className="text-[#6366F1] hover:underline text-sm">
            ← Вернуться к урокам
          </Link>
        </div>
      </div>
    );
  }

  const color = LEVEL_COLORS[lesson.level];
  const xpEarned = Math.round(lesson.xpReward * (correctCount / lesson.exercises.length));

  const handleCorrect = () => setCorrectCount((c) => c + 1);

  const handleNext = async () => {
    if (currentEx < lesson.exercises.length - 1) {
      setCurrentEx((i) => i + 1);
    } else {
      // All exercises done
      await saveProgress(correctCount + (phase === "exercises" ? 0 : 0));
      setPhase("celebration");
    }
  };

  const handleRetry = () => {
    setCurrentEx(0);
    setCorrectCount(0);
    setPhase("reading");
  };

  return (
    <>
      {/* Main layout */}
      <div className="flex flex-col -m-4 sm:-m-6 lg:-m-8 overflow-hidden
                      h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] lg:h-[calc(100%+4rem)]">

        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3
                        border-b border-[#1E293B] bg-[#0A1628]">
          <Link
            href="/lessons"
            className="flex items-center gap-1.5 text-[#64748B] hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">К урокам</span>
          </Link>

          {/* Exercise progress bar */}
          {phase === "exercises" && (
            <div className="flex items-center gap-2 flex-1 mx-6 max-w-xs">
              <span className="text-[#475569] text-xs shrink-0">{currentEx + 1}/{lesson.exercises.length}</span>
              <div className="flex-1 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${((currentEx) / lesson.exercises.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#475569]">
              <Clock className="w-3.5 h-3.5" />
              {lesson.duration} мин
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Zap className="w-3.5 h-3.5" />+{lesson.xpReward} XP
            </div>
            <div
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${color}25`, color }}
            >
              {lesson.level}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "celebration" ? (
              <motion.div
                key="celebration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <CelebrationScreen
                  score={correctCount}
                  total={lesson.exercises.length}
                  xpEarned={xpEarned}
                  lessonId={lesson.id}
                  nextLessonId={nextLesson?.id}
                  onRetry={handleRetry}
                />
              </motion.div>
            ) : (
              <motion.div
                key="lesson"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row h-full"
              >
                {/* ── Content Panel (left) ───────────────────────────────── */}
                <div className="lg:w-[45%] border-b lg:border-b-0 lg:border-r border-[#1E293B] overflow-y-auto
                                px-5 py-6 lg:px-8 lg:py-8 bg-[#0A1628]">
                  {/* Lesson title */}
                  <h1 className="text-xl font-extrabold text-white mb-0.5">{lesson.titleRu}</h1>
                  <p className="text-[#475569] text-sm mb-6">{lesson.title}</p>

                  {/* Explanation */}
                  <div className="prose-custom space-y-4 mb-6">
                    {lesson.content.explanation.split("\n\n").map((para, i) => (
                      <p key={i} className="text-[#CBD5E1] text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>

                  {/* Examples */}
                  {lesson.content.examples.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3 text-[#475569]">
                        Примеры
                      </h3>
                      <div className="space-y-2.5">
                        {lesson.content.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="bg-[#1E293B] border-l-2 rounded-r-xl pl-4 pr-4 py-3"
                            style={{ borderColor: color }}
                          >
                            <div className="text-white font-medium text-sm">{ex.en}</div>
                            <div className="text-[#64748B] text-xs mt-0.5">{ex.ru}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key points */}
                  {lesson.content.keyPoints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3 text-[#475569]">
                        Запомни
                      </h3>
                      <ul className="space-y-2">
                        {lesson.content.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                            <CheckCircle
                              className="w-4 h-4 mt-0.5 shrink-0"
                              style={{ color }}
                            />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ask Alex button */}
                  <button
                    onClick={() => setAlexOpen(true)}
                    className="flex items-center gap-2 w-full py-3 px-4 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/25 text-[#818CF8] text-sm font-medium hover:bg-[#6366F1]/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ask Alex про эту тему 🤖
                  </button>
                </div>

                {/* ── Exercise Panel (right) ─────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8 flex flex-col">
                  {phase === "reading" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                        className="text-6xl mb-5"
                      >
                        📝
                      </motion.div>
                      <h2 className="text-white font-extrabold text-lg mb-2">
                        Готов к упражнениям?
                      </h2>
                      <p className="text-[#64748B] text-sm mb-6 max-w-xs">
                        {lesson.exercises.length} упражнений по теме «{lesson.titleRu}»
                      </p>
                      <div className="flex items-center gap-2 text-[#475569] text-xs mb-8">
                        <BookOpen className="w-3.5 h-3.5" />
                        Прочитай материал слева, затем начинай
                      </div>
                      <button
                        onClick={() => setPhase("exercises")}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
                          boxShadow: `0 4px 24px ${color}30`,
                        }}
                      >
                        Начать упражнения
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="text-white font-bold text-sm mb-5">
                        Упражнение {currentEx + 1} из {lesson.exercises.length}
                      </div>
                      <div className="flex-1 min-h-0">
                        <ExerciseEngine
                          exercise={lesson.exercises[currentEx]}
                          exerciseNumber={currentEx + 1}
                          total={lesson.exercises.length}
                          onCorrect={handleCorrect}
                          onWrong={() => {}}
                          onNext={handleNext}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Alex Mini Chat Overlay */}
      <AnimatePresence>
        {alexOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlexOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <AlexChat
              key="chat"
              lessonTitle={lesson.titleRu}
              onClose={() => setAlexOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
