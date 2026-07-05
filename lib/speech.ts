'use client'

// ─── TEXT TO SPEECH ───────────────────────────────────────────────

let _voices: SpeechSynthesisVoice[] = []

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) { _voices = voices; resolve(voices); return }
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      _voices = window.speechSynthesis.getVoices()
      resolve(_voices)
    }, { once: true })
  })
}

export function getBestEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return (
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.lang === 'en-US' && !v.name.toLowerCase().includes('male')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en-GB')) ||
    voices.find(v => v.lang.startsWith('en'))
  )
}

export async function speak(
  text: string,
  options: { rate?: number; pitch?: number; onEnd?: () => void; onStart?: () => void } = {}
): Promise<void> {
  if (typeof window === 'undefined') return

  window.speechSynthesis.cancel()

  // Small pause after cancel — Chrome sometimes ignores the next speak without it
  await new Promise(r => setTimeout(r, 100))

  const voices = _voices.length > 0 ? _voices : await loadVoices()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = options.rate ?? 1
  utterance.pitch = options.pitch ?? 1

  const voice = getBestEnglishVoice(voices)
  if (voice) utterance.voice = voice

  if (options.onStart) utterance.onstart = options.onStart
  if (options.onEnd) utterance.onend = options.onEnd

  utterance.onerror = (e) => {
    if (e.error !== 'interrupted') console.warn('TTS error:', e.error)
    options.onEnd?.()
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined') return false
  return window.speechSynthesis.speaking
}

// ─── SPEECH RECOGNITION (STT) ─────────────────────────────────────

type RecognitionCallback = (transcript: string, isFinal: boolean) => void

export function createRecognition(onResult: RecognitionCallback, onEnd?: () => void) {
  if (typeof window === 'undefined') return null

  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRec) return null

  const rec = new SpeechRec()
  rec.lang = 'en-US'
  rec.continuous = true
  rec.interimResults = true
  rec.maxAlternatives = 1

  rec.onresult = (event: any) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript
      if (event.results[i].isFinal) final += t
      else interim += t
    }
    if (final) onResult(final, true)
    else if (interim) onResult(interim, false)
  }

  rec.onerror = (e: any) => {
    if (e.error !== 'aborted' && e.error !== 'no-speech') {
      console.warn('STT error:', e.error)
    }
  }

  rec.onend = () => onEnd?.()

  return rec
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
}
