'use client'
import { useState, useEffect } from 'react'
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
      <h1 className="text-2xl font-bold text-white mb-2">Мои заметки</h1>
      <p className="text-muted-foreground text-sm mb-6">{notes.length} заметок</p>

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-white font-semibold mb-2">Заметок пока нет</p>
          <p className="text-muted-foreground text-sm">Открой любой урок и нажми на иконку 📝 внизу справа</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.lessonId} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-white font-semibold text-sm">{note.title}</p>
                <button onClick={() => deleteNote(note.lessonId)}
                  className="text-[#334155] hover:text-red-400 transition-colors text-sm ml-2">✕</button>
              </div>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
