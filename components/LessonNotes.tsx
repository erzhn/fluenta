'use client'
import { useState, useEffect } from 'react'
import { StickyNote, Check, X } from 'lucide-react'

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
        <div className="mb-2 w-72 sm:w-80 bg-background border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white text-sm font-semibold inline-flex items-center gap-1.5"><StickyNote className="w-4 h-4" strokeWidth={1.75} /> Заметки</p>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setSaved(false) }}
            placeholder="Запиши новые слова, правила, примеры..."
            rows={8}
            className="w-full bg-transparent px-4 py-3 text-muted-foreground text-sm placeholder:text-[#334155]
              outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06]">
            <span className="text-[#334155] text-xs">{note.length} символов</span>
            <button onClick={save}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                saved ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}>
              {saved ? <span className="inline-flex items-center gap-1"><Check className="w-3 h-3" strokeWidth={2.5} /> Сохранено</span> : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-3 sm:px-4 rounded-2xl shadow-xl transition-all ${
          open
            ? 'bg-primary text-white shadow-primary/30'
            : 'bg-[#1e1e2e] border-2 border-primary/40 text-primary hover:border-primary/70 shadow-black/40'
        } ${note ? 'ring-2 ring-primary/50' : ''}`}
        title="Заметки к уроку">
        <StickyNote className="w-4 h-4" strokeWidth={1.75} />
        <span className="hidden sm:inline text-sm font-semibold">Заметки</span>
        {note && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
      </button>
    </div>
  );
}
