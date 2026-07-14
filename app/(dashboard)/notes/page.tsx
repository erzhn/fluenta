'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons-data'
import { useAIGenerate } from '@/hooks/useAIGenerate'

export default function NotesPage() {
  const [notes, setNotes] = useState<{ lessonId: string; title: string; content: string }[]>([])
  const { generate } = useAIGenerate()
  const [loadingNote, setLoadingNote] = useState<string | null>(null)
  const [aiSummaries, setAiSummaries] = useState<Record<string, { summary: string; takeaways: string[] }>>({})

  useEffect(() => {
    const result: { lessonId: string; title: string; content: string }[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('fluenta_note_')) {
        const lessonId = key.replace('fluenta_note_', '')
        const content = localStorage.getItem(key) ?? ''
        if (content.trim()) {
          const lesson = LESSONS.find(l => l.id === lessonId)
          result.push({ lessonId, title: lesson?.title ?? lessonId, content })
        }
      }
    }
    setNotes(result)
  }, [])

  async function summarizeNote(lessonId: string, content: string) {
    setLoadingNote(lessonId)
    const result = await generate<{ summary: string; takeaways: string[] }>('note_summary', content)
    if (result) setAiSummaries(prev => ({ ...prev, [lessonId]: result }))
    setLoadingNote(null)
  }

  function deleteNote(lessonId: string) {
    localStorage.removeItem(`fluenta_note_${lessonId}`)
    setNotes(n => n.filter(note => note.lessonId !== lessonId))
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Мои заметки</h1>
      <p className="text-muted-foreground text-sm mb-6">{notes.length} заметок из уроков</p>

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-foreground font-semibold mb-2">Заметок пока нет</p>
          <p className="text-muted-foreground text-sm mb-6">
            Открой любой урок и нажми на иконку 📝 внизу справа
          </p>
          <Link href="/lessons"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Перейти к урокам
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.lessonId} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <Link href={`/lessons/${note.lessonId}`}
                  className="text-foreground font-semibold text-sm hover:text-primary transition-colors">
                  {note.title}
                </Link>
                <button onClick={() => deleteNote(note.lessonId)}
                  className="text-muted-foreground hover:text-red-400 transition-colors text-sm ml-2 shrink-0">
                  ✕
                </button>
              </div>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
              <button
                onClick={() => summarizeNote(note.lessonId, note.content)}
                disabled={loadingNote === note.lessonId}
                className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-[#818cf8] transition-colors disabled:opacity-50"
              >
                {loadingNote === note.lessonId ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI: суммаризировать заметку
              </button>
              {aiSummaries[note.lessonId] && (
                <div className="mt-3 bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <p className="text-primary text-xs font-semibold mb-2">AI Краткое содержание</p>
                  <p className="text-muted-foreground text-sm mb-3">{aiSummaries[note.lessonId].summary}</p>
                  {aiSummaries[note.lessonId].takeaways.length > 0 && (
                    <div>
                      <p className="text-white text-xs font-semibold mb-1">Ключевые моменты:</p>
                      <ul className="space-y-1">
                        {aiSummaries[note.lessonId].takeaways.map((t, i) => (
                          <li key={i} className="text-muted-foreground text-xs flex gap-2">
                            <span className="text-primary">·</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
