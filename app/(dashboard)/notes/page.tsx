'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons-data'

export default function NotesPage() {
  const [notes, setNotes] = useState<{ lessonId: string; title: string; content: string }[]>([])

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
