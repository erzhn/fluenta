'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, Mic, MicOff, X, GraduationCap, MessageCircle, Drama, PenLine, BookOpen, type LucideIcon } from 'lucide-react'
import { ChatMessage } from '@/components/ai-tutor/ChatMessage'
import type { Message } from '@/types'
import { createRecognition, isSpeechRecognitionSupported } from '@/lib/speech'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'
import { awardXP, XP_REWARDS } from '@/lib/xp'
import { saveChatMessage, newSessionId } from '@/lib/chat-history'
import { SCENARIOS, type Scenario } from '@/lib/roleplay-scenarios'

type ChatMode = 'tutor' | 'conversation' | 'roleplay'

const STARTERS: Record<string, string[]> = {
  tutor: [
    "Hey! I'm Zhan, your personal English tutor. What would you like to practice today? We can work on conversation, grammar, vocabulary, pronunciation tips, or anything else!",
    "Hi there! I'm Zhan. Ready to improve your English? Tell me what you'd like to focus on today!",
    "Hello! I'm Zhan, your AI English coach. What shall we work on — speaking, grammar, or vocabulary?",
  ],
  conversation: [
    "Hey! I'm Zhan. Let's just chat — what's been happening in your life lately?",
    "Hello! Have you watched any good films or series recently?",
    "Hey! What are your plans for the weekend?",
    "Hi there! What's your favourite way to relax after a busy day?",
    "Hello! Tell me something interesting that happened to you this week.",
  ],
  roleplay: [
    "Great choice! Let's do a roleplay. Which scenario would you like to practice?",
  ],
}

function randomStarter(mode: string): Message {
  const arr = STARTERS[mode] ?? STARTERS.tutor
  const content = arr[Math.floor(Math.random() * arr.length)]
  return { id: 'welcome', role: 'assistant', content, timestamp: new Date().toISOString() }
}

const WELCOME: Message = randomStarter('tutor')

const QUICK_STARTS: { icon: LucideIcon; text: string }[] = [
  { icon: MessageCircle, text: "Let's have a conversation" },
  { icon: PenLine, text: 'Check my grammar' },
  { icon: BookOpen, text: 'Teach me new vocabulary' },
  { icon: Mic, text: 'Pronunciation tips' },
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>('tutor')
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [listening, setListening] = useState(false)
  const [sessionId] = useState(() => newSessionId())
  const [userId, setUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const srRef = useRef<ReturnType<typeof createRecognition>>(null)
  const xpAwardedRef = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const adjustTextarea = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || loading) return

      const trimmed = content.trim()
      setInput('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }

      const newHistory = [...messages, userMsg]
      setMessages(newHistory)
      setLoading(true)

      // Persist user message
      if (userId) saveChatMessage(userId, sessionId, 'user', trimmed).catch(() => {})

      try {
        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token ?? ''}`,
          },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
            mode,
            ...(activeScenario ? { customSystemPrompt: activeScenario.systemPrompt } : {}),
          }),
        })

        if (!res.ok) {
          if (res.status === 429) toast('Слишком много запросов. Подожди минуту.', 'error')
          else if (res.status === 401) toast('Необходимо войти в систему', 'error')
          else toast('Что-то пошло не так. Попробуй ещё раз.', 'error')
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()

        const reply = data.reply
        if (!xpAwardedRef.current) {
          xpAwardedRef.current = true
          awardXP(XP_REWARDS.AI_CONVERSATION).catch(() => {})
        }
        // Persist assistant message
        if (userId) saveChatMessage(userId, sessionId, 'assistant', reply).catch(() => {})
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: new Date().toISOString(),
          },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: "Sorry, I couldn't connect right now. Please try again!",
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading, mode, activeScenario]
  )

  const toggleMode = (next: ChatMode) => {
    setMode(next)
    setActiveScenario(null)
    if (next !== 'roleplay') {
      setMessages([randomStarter(next)])
      setInput('')
    }
  }

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) return
    srRef.current?.stop()
    setListening(true)
    srRef.current = createRecognition(
      (transcript, isFinal) => {
        if (isFinal) {
          setListening(false)
          srRef.current?.stop()
          sendMessage(transcript)
        }
      },
      () => setListening(false)
    )
    srRef.current?.start()
  }

  const stopListening = () => {
    srRef.current?.stop()
    setListening(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleReset = () => {
    setMessages([{ ...WELCOME, timestamp: new Date().toISOString() }])
    setInput('')
  }

  const isFirstMessage = messages.length === 1

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 overflow-hidden flex flex-col h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] lg:h-[calc(100%+4rem)] bg-background">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0A1628] border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#0A1628] rounded-full" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Zhan</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-xs font-medium">Online · Native English Speaker</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex bg-card rounded-xl p-1 gap-1">
            <button
              onClick={() => toggleMode('tutor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'tutor'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Учёба</span>
            </button>
            <button
              onClick={() => toggleMode('conversation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'conversation'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Разговор</span>
            </button>
            <button
              onClick={() => toggleMode('roleplay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'roleplay'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><Drama className="w-3.5 h-3.5" /> Ролевая игра</span>
            </button>
          </div>

          {/* Active scenario badge */}
          {activeScenario && (
            <div className="flex items-center gap-2 ml-1">
              <activeScenario.icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
              <span className="text-white text-xs font-medium">{activeScenario.title}</span>
              <button onClick={() => { setActiveScenario(null) }} className="text-muted-foreground hover:text-white"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <button
            onClick={handleReset}
            title="Start new conversation"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-muted-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </div>

      {/* ── Scenario Picker ───────────────────────────────────────────────── */}
      {mode === 'roleplay' && !activeScenario && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Выбери сценарий</h2>
            <button onClick={() => toggleMode('tutor')} className="text-muted-foreground text-sm hover:text-white transition-colors">
              ← Обычный чат
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SCENARIOS.map(s => (
              <button key={s.id}
                onClick={() => {
                  setActiveScenario(s)
                  setMessages([{
                    id: 'roleplay-open',
                    role: 'assistant',
                    content: s.openingLine,
                    timestamp: new Date().toISOString(),
                  }])
                }}
                className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-left
                  hover:border-primary/40 hover:bg-white/[0.06] transition-all">
                <span className="mb-2.5 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10">
                  <s.icon className="w-5 h-5 text-indigo-300" strokeWidth={1.75} />
                </span>
                <p className="text-white text-sm font-medium">{s.title}</p>
                <p className="text-muted-foreground text-xs mt-1">{s.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {s.level}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      {(mode !== 'roleplay' || activeScenario) && (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 min-h-0">

        {/* Quick-start chips — only before first user message */}
        <AnimatePresence>
          {isFirstMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-2 gap-2 max-w-sm"
            >
              {QUICK_STARTS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => sendMessage(text)}
                  className="group text-left px-3.5 py-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon className="w-4 h-4 mb-1 text-indigo-300" strokeWidth={1.75} />
                  <span className="text-muted-foreground text-xs group-hover:text-white transition-colors leading-snug">
                    {text}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3.5">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                      className="w-2 h-2 bg-[#475569] rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
      )}

      {/* ── Input bar ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-[#1E293B] bg-[#0A1628] px-4 sm:px-6 pb-4 pt-3">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-xs text-primary font-medium mb-2 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Zhan is typing…
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2.5">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                adjustTextarea()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              disabled={loading}
              rows={1}
              maxLength={2000}
              className="w-full bg-card border border-border hover:border-[#475569] focus:border-primary rounded-xl px-4 py-3 text-white placeholder-[#334155] text-sm transition-colors outline-none resize-none leading-relaxed disabled:opacity-50"
            />
            {input.length > 1500 && (
              <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">
                {2000 - input.length}
              </div>
            )}
          </div>

          {/* Mic button */}
          <motion.button
            onClick={listening ? stopListening : startListening}
            disabled={loading}
            whileTap={{ scale: 0.92 }}
            title={listening ? 'Stop listening' : 'Speak'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              listening
                ? 'bg-red-500/20 border border-red-500/60 text-red-400'
                : 'bg-card border border-border text-muted-foreground hover:text-muted-foreground hover:border-[#475569]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {listening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <MicOff className="w-4 h-4" />
              </motion.div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </motion.button>

          {/* Send button */}
          <motion.button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-xl bg-primary hover:bg-[#5558E3] disabled:bg-card disabled:text-[#334155] text-white flex items-center justify-center transition-colors disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        <p className="text-[10px] text-[#1E293B] text-center mt-2">
          Shift+Enter for new line · Zhan may make mistakes
        </p>
      </div>
    </div>
  );
}
