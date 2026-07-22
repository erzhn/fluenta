'use client'
import { useState, useRef } from 'react'
import { createRecognition, speak, isSpeechRecognitionSupported } from '@/lib/speech'
import { Mic, MicOff, Volume2, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react'

interface Props {
  prompt: string
  sampleAnswer?: string
  onComplete?: () => void
}

export default function SpeakingExercise({ prompt, sampleAnswer, onComplete }: Props) {
  const [phase, setPhase] = useState<'ready' | 'listening' | 'done'>('ready')
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const recRef = useRef<ReturnType<typeof createRecognition>>(null)
  const supported = isSpeechRecognitionSupported()

  function startListening() {
    if (!supported) return
    setPhase('listening')
    setTranscript('')
    setInterimText('')

    recRef.current = createRecognition(
      (text, isFinal) => {
        if (isFinal) setTranscript(prev => prev + ' ' + text)
        else setInterimText(text)
      },
      () => {
        setPhase('done')
        setInterimText('')
      }
    )
    recRef.current?.start()
  }

  function stopListening() {
    recRef.current?.stop()
    setPhase('done')
    setInterimText('')
  }

  async function listenSample() {
    if (sampleAnswer) await speak(sampleAnswer, { rate: 0.9 })
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
        <p className="text-white text-sm font-medium mb-1 flex items-center gap-1.5"><MessageSquare className="w-4 h-4" strokeWidth={1.75} /> Говори на тему:</p>
        <p className="text-[#a5b4fc] text-base">{prompt}</p>
      </div>

      {(transcript || interimText) && (
        <div className="bg-white/[0.03] rounded-xl p-4 min-h-[80px]">
          <p className="text-white text-sm">{transcript}</p>
          <p className="text-muted-foreground text-sm italic">{interimText}</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {phase === 'ready' && (
          <button onClick={startListening} disabled={!supported}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-[#5558e8] text-white rounded-xl font-semibold transition-all disabled:opacity-40">
            <Mic className="w-4 h-4" /> Начать говорить
          </button>
        )}

        {phase === 'listening' && (
          <button onClick={stopListening}
            className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all animate-pulse">
            <MicOff className="w-4 h-4" /> Остановить
          </button>
        )}

        {phase === 'done' && (
          <>
            <button onClick={() => { setPhase('ready'); setTranscript('') }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 text-white rounded-xl text-sm transition-all">
              <Mic className="w-4 h-4" /> Ещё раз
            </button>
            {sampleAnswer && (
              <button onClick={listenSample}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 text-white rounded-xl text-sm transition-all">
                <Volume2 className="w-4 h-4" /> Образец ответа
              </button>
            )}
            {wordCount >= 5 && (
              <button onClick={onComplete}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500/20 border border-green-500/40 text-green-400 rounded-xl text-sm transition-all">
                <CheckCircle className="w-4 h-4" /> Засчитать ({wordCount} слов)
              </button>
            )}
          </>
        )}
      </div>

      {!supported && (
        <p className="text-yellow-400 text-xs flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} /> Микрофон работает только в Chrome</p>
      )}

      {phase === 'done' && wordCount > 0 && (
        <div className="text-muted-foreground text-xs">
          Произнесено слов: {wordCount} {wordCount < 10 ? '— попробуй сказать больше!' : '— отлично!'}
        </div>
      )}
    </div>
  );
}
