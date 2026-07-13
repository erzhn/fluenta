'use client'
import { useState, useEffect } from 'react'

export function LessonNotes({ lessonId }: { lessonId: string }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  const key = `fluenta_note_${lessonId}`

  useEffect(() => {
    setNote(localStorage.getItem(key) ?? '')
  }, [lessonId, key])

  function save() {
    localStorage.setItem(key, note)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
      {open && (
        <div className="mb-2 w-72 sm:w-80 bg-[hsl(var(--background))] border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white text-sm font-semibold">📝 Заметки</p>
            <button onClick={() => setOpen(false)} className="text-[hsl(var(--foreground-subtle))] hover:text-white text-lg">×</button>
          </div>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setSaved(false) }}
            placeholder="Запиши новые слова, правила, примеры..."
            rows={8}
            className="w-full bg-transparent px-4 py-3 text-[hsl(var(--foreground-muted))] text-sm placeholder:text-[#334155]
              outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06]">
            <span className="text-[#334155] text-xs">{note.length} символов</span>
            <button onClick={save}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                saved ? 'bg-green-500/20 text-green-400' : 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/30'
              }`}>
              {saved ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg transition-all
          ${open ? 'bg-[hsl(var(--accent))] shadow-[#6366f1]/30' : 'bg-white/[0.08] border border-white/15 hover:bg-white/15'}
          ${note ? 'ring-2 ring-[#6366f1]/40' : ''}`}
        title="Заметки">
        📝
      </button>
    </div>
  )
}
