'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw } from 'lucide-react'
import { ChatMessage } from '@/components/ai-tutor/ChatMessage'
import type { Message } from '@/types'

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey! I'm Zhan, your personal English tutor 👋 What would you like to practice today? We can work on conversation, grammar, vocabulary, pronunciation tips, or anything else!",
  timestamp: new Date().toISOString(),
}

const QUICK_STARTS = [
  { emoji: '💬', text: "Let's have a conversation" },
  { emoji: '📝', text: 'Check my grammar' },
  { emoji: '📚', text: 'Teach me new vocabulary' },
  { emoji: '🎤', text: 'Pronunciation tips' },
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toISOString(),
          },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: "Sorry, I couldn't connect right now. Please try again! 🙏",
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading]
  )

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
    <div className="-m-4 sm:-m-6 lg:-m-8 overflow-hidden flex flex-col h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] lg:h-[calc(100%+4rem)] bg-[#0F172A]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0A1628] border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xl shadow-lg shadow-indigo-500/25">
              👨‍🏫
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

        <button
          onClick={handleReset}
          title="Start new conversation"
          className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94A3B8] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
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
              {QUICK_STARTS.map(({ emoji, text }) => (
                <button
                  key={text}
                  onClick={() => sendMessage(text)}
                  className="group text-left px-3.5 py-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 transition-all"
                >
                  <span className="text-lg block mb-0.5">{emoji}</span>
                  <span className="text-[#94A3B8] text-xs group-hover:text-white transition-colors leading-snug">
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
              <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm shrink-0">
                👨‍🏫
              </div>
              <div className="bg-[#1E293B] border border-[#334155] rounded-2xl rounded-tl-sm px-4 py-3.5">
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

      {/* ── Input bar ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-[#1E293B] bg-[#0A1628] px-4 sm:px-6 pb-4 pt-3">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-xs text-[#6366F1] font-medium mb-2 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
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
              className="w-full bg-[#1E293B] border border-[#334155] hover:border-[#475569] focus:border-[#6366F1] rounded-xl px-4 py-3 text-white placeholder-[#334155] text-sm transition-colors outline-none resize-none leading-relaxed disabled:opacity-50"
            />
            {input.length > 1500 && (
              <div className="absolute right-3 bottom-3 text-[10px] text-[#475569]">
                {2000 - input.length}
              </div>
            )}
          </div>

          <motion.button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] disabled:bg-[#1E293B] disabled:text-[#334155] text-white flex items-center justify-center transition-colors disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        <p className="text-[10px] text-[#1E293B] text-center mt-2">
          Shift+Enter for new line · Zhan may make mistakes
        </p>
      </div>
    </div>
  )
}
