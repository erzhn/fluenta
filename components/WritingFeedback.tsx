'use client'

interface WritingError {
  original: string
  corrected: string
  category: string
  explanation: string
  severity: 'minor' | 'major'
}

interface FeedbackData {
  overallScore: number
  correctedText: string
  summary: string
  errors: WritingError[]
  patterns: string[]
  positives: string[]
  recommendation: string
}

export function WritingFeedback({ data }: { data: FeedbackData }) {
  return (
    <div className="space-y-4">
      {/* Оценка */}
      <div className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-2xl">
        <div className="text-4xl font-bold"
          style={{ color: data.overallScore >= 80 ? '#10b981' : data.overallScore >= 60 ? '#f59e0b' : '#ef4444' }}>
          {data.overallScore}
        </div>
        <div>
          <p className="text-white font-semibold">из 100</p>
          <p className="text-muted-foreground text-sm">{data.summary}</p>
        </div>
      </div>

      {/* Паттерны ошибок */}
      {data.patterns?.length > 0 && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-semibold text-sm mb-2">⚠️ Частые ошибки</p>
          {data.patterns.map((p, i) => <p key={i} className="text-muted-foreground text-sm">· {p}</p>)}
        </div>
      )}

      {/* Что хорошо */}
      {data.positives?.length > 0 && (
        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
          <p className="text-green-400 font-semibold text-sm mb-2">✓ Что хорошо</p>
          {data.positives.map((p, i) => <p key={i} className="text-muted-foreground text-sm">· {p}</p>)}
        </div>
      )}

      {/* Детальный разбор ошибок */}
      {data.errors?.length > 0 && (
        <div>
          <p className="text-white font-semibold text-sm mb-2">Разбор ошибок</p>
          <div className="space-y-2">
            {data.errors.map((err, i) => (
              <div key={i} className={`p-4 rounded-xl border ${err.severity === 'major' ? 'bg-red-500/5 border-red-500/15' : 'bg-yellow-500/5 border-yellow-500/15'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${err.severity === 'major' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {err.category}
                  </span>
                </div>
                <p className="text-sm mb-1"><span className="text-red-400 line-through">{err.original}</span> → <span className="text-green-400 font-medium">{err.corrected}</span></p>
                <p className="text-muted-foreground text-xs">{err.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Рекомендация */}
      {data.recommendation && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-primary font-semibold text-sm mb-1">📚 Рекомендация</p>
          <p className="text-muted-foreground text-sm">{data.recommendation}</p>
        </div>
      )}
    </div>
  )
}
