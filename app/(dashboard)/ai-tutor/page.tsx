"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, MessageSquare, Menu, X, Clock } from "lucide-react";
import { ChatMessage } from "@/components/ai-tutor/ChatMessage";
import { VoiceButton } from "@/components/ai-tutor/VoiceButton";
import { ModeSelector, MODES } from "@/components/ai-tutor/ModeSelector";
import { supabase } from "@/lib/supabase";
import type { Message, TutorMode } from "@/types";

// ─── Welcome messages per mode ────────────────────────────────────────────────
const WELCOME: Record<TutorMode, string> = {
  conversation:
    "Hey! I'm Alex, your personal English teacher 👋\n\nLet's practice some conversation! What would you like to talk about today? I'll gently correct any mistakes and help you express yourself more naturally.",
  grammar:
    "Hi! Ready to nail English grammar? 📝\n\nShare a sentence you're unsure about, ask me a grammar rule, or just tell me what's been confusing you. I'll explain it clearly with examples!\n\n🇷🇺: Задай любой вопрос по грамматике — объясню просто и понятно.",
  vocabulary:
    "Let's build your vocabulary! 📚\n\n💡 'Vocabulary' = 'словарный запас' — your word bank!\n\nTell me a topic you're interested in, and I'll teach you 5-10 useful words with examples. Or ask about any word you've heard!",
  writing:
    "Time to polish your writing! ✍️\n\nPaste any text — an email, essay, or message — and I'll give you detailed feedback on grammar, style, and vocabulary. I'll help you sound like a native speaker!",
  exams:
    "Let's get you ready for IELTS or TOEFL! 🎓\n\nI can help with: Writing Task 1 & 2, Speaking topics, Reading strategies, and Listening practice.\n\nWhich section would you like to work on today?",
  business:
    "Welcome to Business English! 💼\n\nI'll help you with: professional emails, meeting vocabulary, presentations, negotiations, and interview preparation.\n\n🇷🇺: Деловой английский для карьеры и переговоров.\n\nWhat's your business situation today?",
};

// ─── Starter prompts per mode ─────────────────────────────────────────────────
const STARTERS: Record<TutorMode, { text: string; emoji: string }[]> = {
  conversation: [
    { emoji: "☕", text: "Let's practice small talk" },
    { emoji: "✈️", text: "Talk about travel plans" },
    { emoji: "🎬", text: "Discuss a movie or show" },
    { emoji: "🌍", text: "Chat about culture differences" },
  ],
  grammar: [
    { emoji: "✏️", text: "Check my grammar: 'I have went to the store'" },
    { emoji: "🤔", text: "Explain Present Perfect vs Simple Past" },
    { emoji: "📌", text: "When do I use 'the' vs 'a'?" },
    { emoji: "🔄", text: "Teach me Conditional sentences" },
  ],
  vocabulary: [
    { emoji: "💡", text: "Teach me business idioms" },
    { emoji: "🎭", text: "What are common English slang words?" },
    { emoji: "📖", text: "Synonyms for 'very good'" },
    { emoji: "🔗", text: "Useful connectors for essays" },
  ],
  writing: [
    { emoji: "📧", text: "Help me write a professional email" },
    { emoji: "📝", text: "Review my paragraph: 'Yesterday I go to work...'" },
    { emoji: "💼", text: "How to write a strong CV summary?" },
    { emoji: "✍️", text: "Tips for IELTS Writing Task 2" },
  ],
  exams: [
    { emoji: "📊", text: "Give me an IELTS Writing Task 1 topic" },
    { emoji: "🗣️", text: "IELTS Speaking Part 2 practice" },
    { emoji: "📚", text: "TOEFL reading strategies" },
    { emoji: "⏱️", text: "How to manage exam time?" },
  ],
  business: [
    { emoji: "📧", text: "Write a meeting request email" },
    { emoji: "🤝", text: "Phrases for professional negotiations" },
    { emoji: "📊", text: "How to present data in English?" },
    { emoji: "💬", text: "Interview questions and answers" },
  ],
};

// ─── Conversation history item ────────────────────────────────────────────────
interface ConversationItem {
  id: string;
  title: string;
  updated_at: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AITutorPage() {
  const [mode, setMode] = useState<TutorMode>("conversation");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME.conversation, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState("B1");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingMsgRef = useRef<string>("");

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase
        .from("profiles")
        .select("current_level")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.current_level) setUserLevel(data.current_level);
        });
    });
  }, []);

  // Load conversation history
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("ai_conversations")
      .select("id, title, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setConversations(data);
      });
  }, [userId, conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleModeChange = (newMode: TutorMode) => {
    setMode(newMode);
    setConversationId(null);
    streamingMsgRef.current = "";
    setMessages([
      {
        id: `welcome-${newMode}`,
        role: "assistant",
        content: WELCOME[newMode],
        timestamp: new Date().toISOString(),
      },
    ]);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setConversationId(null);
    streamingMsgRef.current = "";
    setMessages([
      {
        id: `welcome-${mode}`,
        role: "assistant",
        content: WELCOME[mode],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleLoadConversation = async (convId: string) => {
    const { data } = await supabase
      .from("ai_conversations")
      .select("messages")
      .eq("id", convId)
      .single();
    if (data?.messages) {
      setMessages(data.messages as Message[]);
      setConversationId(convId);
      setSidebarOpen(false);
    }
  };

  const adjustTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || streaming) return;

      const trimmed = content.trim();
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setStreaming(true);

      const aiMsgId = `ai-${Date.now()}`;
      setStreamingMsgId(aiMsgId);
      streamingMsgRef.current = "";

      // Placeholder AI message
      const aiMsg: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      setMessages([...newHistory, aiMsg]);

      try {
        const res = await fetch("/api/ai-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
            userLevel,
            mode,
            userId,
            conversationId,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                streamingMsgRef.current += data.text;
                const snapshot = streamingMsgRef.current;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, content: snapshot } : m
                  )
                );
              }

              if (data.conversationId) {
                setConversationId(data.conversationId);
              }

              if (data.error) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? {
                          ...m,
                          content:
                            "Извини, произошла ошибка. Попробуй ещё раз 🙏",
                        }
                      : m
                  )
                );
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content:
                    "Не удалось подключиться к AI. Проверь интернет и попробуй снова.",
                }
              : m
          )
        );
      } finally {
        setStreaming(false);
        setStreamingMsgId(null);
        streamingMsgRef.current = "";
      }
    },
    [messages, streaming, mode, userLevel, userId, conversationId]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const hasOnlyWelcome =
    messages.length === 1 && messages[0].id.startsWith("welcome");

  const currentModeConfig = MODES.find((m) => m.value === mode);

  // ── Sidebar content (shared between desktop + mobile sheet) ─────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[#1E293B]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍🏫</span>
              <span className="text-white font-bold text-base">AI Репетитор</span>
            </div>
            <div className="text-[#475569] text-xs mt-0.5">Alex · Native Speaker</div>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 bg-[#6366F1] hover:bg-[#5558E3] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Новый
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="py-3 border-b border-[#1E293B]">
        <div className="px-4 text-[10px] font-semibold text-[#334155] uppercase tracking-widest mb-2">
          Режим обучения
        </div>
        <ModeSelector mode={mode} onModeChange={handleModeChange} layout="sidebar" />
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto py-3 min-h-0">
        <div className="px-4 text-[10px] font-semibold text-[#334155] uppercase tracking-widest mb-2">
          История чатов
        </div>
        {conversations.length === 0 ? (
          <div className="px-4 text-[#334155] text-xs py-2">
            Начни разговор — он сохранится здесь
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleLoadConversation(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 group ${
                  conv.id === conversationId
                    ? "bg-[#6366F1]/15 border border-[#6366F1]/25"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <MessageSquare
                  className="w-3.5 h-3.5 shrink-0 text-[#334155] group-hover:text-[#64748B]"
                />
                <span className="text-xs text-[#64748B] group-hover:text-[#94A3B8] truncate flex-1">
                  {conv.title}
                </span>
                <Clock className="w-3 h-3 text-[#334155] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    // Break out of dashboard padding to fill full height
    <div
      className="-m-4 sm:-m-6 lg:-m-8 overflow-hidden flex h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] lg:h-[calc(100%+4rem)]"
    >
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[#0A1628] border-r border-[#1E293B] overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── Main chat column ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F172A]">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#1E293B] shrink-0 bg-[#0A1628]">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentModeConfig?.emoji}</span>
              <div>
                <div className="text-white font-semibold text-sm">
                  {currentModeConfig?.label}
                </div>
                <div className="text-[#475569] text-xs">{currentModeConfig?.desc}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/25 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-xs font-medium">{userLevel}</span>
            </div>
            <button
              onClick={handleNewChat}
              className="lg:hidden flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Новый чат
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 min-h-0">
          {/* Starter prompts — shown when only welcome message exists */}
          {hasOnlyWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto mt-2"
            >
              {STARTERS[mode].map(({ emoji, text }) => (
                <button
                  key={text}
                  onClick={() => sendMessage(text)}
                  className="group text-left px-4 py-3.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 transition-all"
                >
                  <span className="text-xl block mb-1">{emoji}</span>
                  <span className="text-[#94A3B8] text-sm group-hover:text-white transition-colors">
                    {text}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                userId={userId ?? undefined}
                streaming={msg.id === streamingMsgId}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator — shown while waiting for first chunk */}
          {streaming && streamingMsgRef.current === "" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm shrink-0">
                👨‍🏫
              </div>
              <div className="bg-[#1E293B] border border-[#334155] rounded-2xl rounded-tl-sm px-4 py-3.5">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                      className="w-2 h-2 bg-[#334155] rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t border-[#1E293B] bg-[#0A1628] px-4 sm:px-6 pb-4 pt-3">
          {/* "Alex is typing" status */}
          <AnimatePresence>
            {streaming && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-xs text-[#6366F1] font-medium mb-2 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                Alex печатает...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2.5">
            <VoiceButton
              onTranscript={(t) => {
                setInput((prev) => (prev ? `${prev} ${t}` : t));
                textareaRef.current?.focus();
              }}
              disabled={streaming}
            />

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); adjustTextarea(); }}
                onKeyDown={handleKeyDown}
                placeholder="Напиши что-нибудь… (Enter отправить)"
                disabled={streaming}
                rows={1}
                maxLength={2000}
                className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3 pr-14 text-white placeholder-[#334155] text-sm transition-colors outline-none resize-none leading-relaxed disabled:opacity-50"
              />
              {/* Character counter */}
              {input.length > 1500 && (
                <div className="absolute right-12 bottom-3 text-[10px] text-[#475569]">
                  {2000 - input.length}
                </div>
              )}
            </div>

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="w-10 h-10 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] disabled:text-[#334155] text-white flex items-center justify-center transition-all disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-[#1E293B] text-center mt-2">
            Shift+Enter для переноса строки
          </div>
        </div>
      </div>

      {/* ── Mobile: bottom sheet sidebar ────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A1628] border-t border-[#1E293B] rounded-t-2xl overflow-hidden"
              style={{ maxHeight: "80vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-[#334155] rounded-full" />
              </div>

              {/* Close */}
              <div className="flex items-center justify-between px-5 py-2 border-b border-[#1E293B]">
                <span className="text-white font-semibold">Настройки чата</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 80px)" }}>
                {/* Mode grid */}
                <div className="p-4 border-b border-[#1E293B]">
                  <div className="text-[10px] font-semibold text-[#334155] uppercase tracking-widest mb-3">
                    Режим обучения
                  </div>
                  <ModeSelector mode={mode} onModeChange={handleModeChange} layout="sheet" />
                </div>

                {/* New chat */}
                <div className="p-4 border-b border-[#1E293B]">
                  <button
                    onClick={() => { handleNewChat(); setSidebarOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] text-white font-semibold text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Новый чат
                  </button>
                </div>

                {/* History */}
                {conversations.length > 0 && (
                  <div className="p-4">
                    <div className="text-[10px] font-semibold text-[#334155] uppercase tracking-widest mb-3">
                      История чатов
                    </div>
                    <div className="space-y-1">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => handleLoadConversation(conv.id)}
                          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-[#475569] shrink-0" />
                          <span className="text-sm text-[#94A3B8] truncate">{conv.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
