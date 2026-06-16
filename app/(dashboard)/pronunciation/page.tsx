"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Data ─────────────────────────────────────────────────────────────────────
const MINIMAL_PAIRS = [
  { a: "ship",  b: "sheep",  a_ipa: "/ʃɪp/",   b_ipa: "/ʃiːp/",  tip: "Краткое /ɪ/ vs долгое /iː/" },
  { a: "bad",   b: "bed",    a_ipa: "/bæd/",    b_ipa: "/bed/",    tip: "/æ/ (рот широко) vs /e/" },
  { a: "live",  b: "leave",  a_ipa: "/lɪv/",    b_ipa: "/liːv/",   tip: "Краткое /ɪ/ vs долгое /iː/" },
  { a: "sit",   b: "seat",   a_ipa: "/sɪt/",    b_ipa: "/siːt/",   tip: "Краткое /ɪ/ vs долгое /iː/" },
  { a: "full",  b: "fool",   a_ipa: "/fʊl/",    b_ipa: "/fuːl/",   tip: "/ʊ/ (краткое) vs /uː/ (долгое)" },
  { a: "cat",   b: "cut",    a_ipa: "/kæt/",    b_ipa: "/kʌt/",    tip: "/æ/ vs /ʌ/ — разные гласные" },
  { a: "man",   b: "men",    a_ipa: "/mæn/",    b_ipa: "/men/",    tip: "/æ/ vs /e/ — чуть разные" },
  { a: "this",  b: "these",  a_ipa: "/ðɪs/",    b_ipa: "/ðiːz/",   tip: "Краткое /ɪ/ vs долгое /iː/" },
  { a: "bit",   b: "beat",   a_ipa: "/bɪt/",    b_ipa: "/biːt/",   tip: "Краткое /ɪ/ vs долгое /iː/" },
  { a: "not",   b: "note",   a_ipa: "/nɒt/",    b_ipa: "/nəʊt/",   tip: "/ɒ/ (короткое) vs /əʊ/ (дифтонг)" },
];

const SHADOW_SENTENCES = [
  { text: "Could you please repeat that?",       ru: "Не могли бы вы повторить это?" },
  { text: "I'd like to order a coffee, please.", ru: "Я бы хотел заказать кофе." },
  { text: "What time does the meeting start?",   ru: "В какое время начинается встреча?" },
  { text: "I'm looking for the train station.",  ru: "Я ищу железнодорожную станцию." },
  { text: "The weather is really nice today.",   ru: "Сегодня очень хорошая погода." },
  { text: "Can I have the bill, please?",        ru: "Можно счёт, пожалуйста?" },
  { text: "I've been learning English for two years.", ru: "Я учу английский два года." },
  { text: "Where can I find a pharmacy?",        ru: "Где я могу найти аптеку?" },
  { text: "I'm sorry, I didn't understand.",     ru: "Извините, я не понял." },
  { text: "It was a pleasure meeting you.",      ru: "Было приятно познакомиться." },
];

const PHONEMES = [
  { symbol: "/θ/", name: "TH глухое", example: "think, three, both", tip: "Кончик языка между зубами, без голоса", word: "think" },
  { symbol: "/ð/", name: "TH звонкое", example: "this, that, breathe", tip: "Кончик языка между зубами, с голосом", word: "this" },
  { symbol: "/æ/", name: "A широкое", example: "cat, bad, man", tip: "Рот широко открыт, язык внизу", word: "cat" },
  { symbol: "/ŋ/", name: "NG носовое", example: "sing, ring, thing", tip: "Задняя часть языка к нёбу, воздух через нос", word: "sing" },
  { symbol: "/w/", name: "W губной", example: "win, water, away", tip: "Губы вытянуты трубочкой, как 'у'", word: "water" },
  { symbol: "/v/", name: "V зубной", example: "very, voice, live", tip: "Верхние зубы касаются нижней губы", word: "very" },
];

const TONGUE_TWISTERS = [
  { text: "She sells seashells by the seashore.", level: "Средний" },
  { text: "Peter Piper picked a peck of pickled peppers.", level: "Сложный" },
  { text: "How much wood would a woodchuck chuck?", level: "Средний" },
  { text: "Red lorry, yellow lorry, red lorry, yellow lorry.", level: "Лёгкий" },
  { text: "Betty Botter bought some butter but the butter was bitter.", level: "Сложный" },
];

type SectionId = "pairs" | "shadowing" | "phonemes" | "twisters";
const SECTIONS: { id: SectionId; label: string; emoji: string }[] = [
  { id: "pairs",     label: "Минимальные пары", emoji: "👂" },
  { id: "shadowing", label: "Shadowing",         emoji: "🔊" },
  { id: "phonemes",  label: "Фонемы",            emoji: "🔤" },
  { id: "twisters",  label: "Скороговорки",      emoji: "🌀" },
];

// ─── Browser support check ────────────────────────────────────────────────────
function BrowserBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl px-5 py-4 mb-6"
    >
      <AlertCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
      <p className="text-[#F59E0B] text-sm">
        🎤 Для произношения используй <b>Google Chrome</b> или <b>Microsoft Edge</b>. Safari не поддерживает Web Speech API.
      </p>
    </motion.div>
  );
}

// ─── Waveform animation ───────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          animate={active ? {
            height: ["20%", "90%", "35%", "70%", "20%"],
          } : { height: "20%" }}
          transition={active ? {
            duration: 0.7 + (i % 3) * 0.15,
            repeat: Infinity,
            delay: i * 0.06,
          } : { duration: 0.3 }}
          className="w-1 rounded-full"
          style={{
            backgroundColor: active ? "#EF4444" : "#334155",
            minHeight: 4,
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared hooks ─────────────────────────────────────────────────────────────
function useSpeech() {
  const [hasSpeech, setHasSpeech] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ok = ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) && "speechSynthesis" in window;
      setHasSpeech(ok);
    }
  }, []);

  const speak = useCallback((text: string, rate = 0.8) => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((v) => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Microsoft"))) ?? voices.find((v) => v.lang === "en-US");
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, []);

  const startRecognition = useCallback((onResult: (text: string) => void, onEnd: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = new SR() as any;
    r.lang = "en-US"; r.continuous = false; r.interimResults = false;
    r.onresult = (e: any) => onResult(e.results[0][0].transcript.toLowerCase());
    r.onend = onEnd;
    r.onerror = onEnd;
    r.start();
    return r;
  }, []);

  return { hasSpeech, speak, startRecognition };
}

// ─── Minimal Pairs ────────────────────────────────────────────────────────────
function MinimalPairs({ speak, startRecognition }: { speak: (t: string, r?: number) => void; startRecognition: Function }) {
  const [pairIdx, setPairIdx] = useState(0);
  const [target, setTarget] = useState<"a" | "b" | null>(null);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<any>(null);
  const pair = MINIMAL_PAIRS[pairIdx];

  const selectTarget = (t: "a" | "b") => {
    setTarget(t);
    setResult(null);
    setTranscript("");
    speak(t === "a" ? pair.a : pair.b);
  };

  const startRecord = () => {
    if (!target) return;
    setRecording(true);
    setResult(null);
    recRef.current = startRecognition(
      (text: string) => {
        setTranscript(text);
        const expected = (target === "a" ? pair.a : pair.b).toLowerCase();
        setResult(text.includes(expected) ? "correct" : "wrong");
      },
      () => setRecording(false)
    );
  };

  const next = () => {
    setPairIdx((i) => (i + 1) % MINIMAL_PAIRS.length);
    setTarget(null); setResult(null); setTranscript("");
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-extrabold text-base">👂 Минимальные пары</h2>
          <p className="text-[#475569] text-xs mt-0.5">Услышь разницу — произнеси правильно</p>
        </div>
        <span className="text-[#334155] text-xs tabular-nums">{pairIdx + 1}/{MINIMAL_PAIRS.length}</span>
      </div>

      {/* Pair cards */}
      <div className="grid grid-cols-2 gap-3">
        {(["a","b"] as const).map((side) => {
          const word = side === "a" ? pair.a : pair.b;
          const ipa  = side === "a" ? pair.a_ipa : pair.b_ipa;
          return (
            <button
              key={side}
              onClick={() => selectTarget(side)}
              className={`flex flex-col items-center py-5 px-4 rounded-2xl border-2 transition-all ${
                target === side
                  ? "border-[#6366F1] bg-[#6366F1]/10"
                  : "border-[#334155] bg-[#0F172A] hover:border-[#475569]"
              }`}
            >
              <span className="text-3xl font-extrabold text-white mb-1">{word}</span>
              <span className="text-[#64748B] font-mono text-sm">{ipa}</span>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word); }}
                className="mt-2 text-[#475569] hover:text-[#6366F1]"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </button>
          );
        })}
      </div>

      <div className="text-[#475569] text-xs text-center">💡 {pair.tip}</div>

      {/* Record */}
      <div className="flex flex-col items-center gap-3">
        {target && (
          <div className="text-[#64748B] text-sm">
            Произнеси: <span className="text-white font-bold">{target === "a" ? pair.a : pair.b}</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={startRecord}
            disabled={!target || recording}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              recording ? "bg-[#EF4444]" : target ? "bg-[#6366F1] hover:bg-[#5558E3]" : "bg-[#1E293B] cursor-not-allowed"
            }`}
          >
            {recording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          {recording && <Waveform active={true} />}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full max-w-xs px-4 py-3 rounded-xl text-sm text-center font-semibold ${
                result === "correct"
                  ? "bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]"
                  : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
              }`}
            >
              {result === "correct" ? "✅ Правильно!" : "❌ Попробуй снова"}
              {transcript && <div className="text-[#64748B] text-xs mt-1 font-normal">"{transcript}"</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <button
          onClick={next}
          className="flex items-center gap-1.5 text-[#6366F1] text-sm font-semibold hover:text-[#818CF8] transition-colors"
        >
          Следующая пара <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Shadowing ────────────────────────────────────────────────────────────────
function compareWords(original: string, spoken: string): { word: string; correct: boolean }[] {
  const clean = (s: string) => s.toLowerCase().replace(/[.,!?']/g, "");
  const orig = original.split(" ").map(clean);
  const said = spoken.split(" ").map(clean);
  return orig.map((w, i) => ({ word: original.split(" ")[i], correct: said[i] === w || said.includes(w) }));
}

function Shadowing({ speak, startRecognition }: { speak: (t: string, r?: number) => void; startRecognition: Function }) {
  const [sentIdx, setSentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [comparison, setComparison] = useState<{ word: string; correct: boolean }[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(0.8);
  const sentence = SHADOW_SENTENCES[sentIdx];

  const listen = () => { speak(sentence.text, speed); };

  const startRecord = () => {
    setRecording(true);
    setComparison(null);
    startRecognition(
      (text: string) => {
        const cmp = compareWords(sentence.text, text);
        setComparison(cmp);
        const pct = Math.round((cmp.filter((w) => w.correct).length / cmp.length) * 100);
        setScore(pct);
      },
      () => setRecording(false)
    );
  };

  const next = () => { setSentIdx((i) => (i + 1) % SHADOW_SENTENCES.length); setComparison(null); setScore(null); };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-extrabold text-base">🔊 Shadowing</h2>
          <p className="text-[#475569] text-xs mt-0.5">Слушай и повторяй за диктором</p>
        </div>
        <span className="text-[#334155] text-xs">{sentIdx + 1}/{SHADOW_SENTENCES.length}</span>
      </div>

      <div className="bg-[#0F172A] rounded-2xl p-5 text-center">
        <p className="text-white font-semibold text-lg leading-relaxed mb-1.5">{sentence.text}</p>
        <p className="text-[#475569] text-sm">{sentence.ru}</p>
      </div>

      {/* Speed selector */}
      <div className="flex items-center gap-2">
        <span className="text-[#475569] text-xs">Скорость:</span>
        {[{ label: "Медленно", val: 0.6 }, { label: "Норма", val: 0.85 }, { label: "Быстро", val: 1.1 }].map((s) => (
          <button
            key={s.val}
            onClick={() => setSpeed(s.val)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              speed === s.val ? "bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40" : "text-[#475569] hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={listen}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#6366F1]/40 text-white text-sm font-semibold transition-all"
        >
          <Volume2 className="w-4 h-4 text-[#6366F1]" />
          Прослушать
        </button>
        <button
          onClick={startRecord}
          disabled={recording}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            recording ? "bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444]" : "bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#818CF8] hover:bg-[#6366F1]/25"
          }`}
        >
          {recording ? <><MicOff className="w-4 h-4" /> Слушаю...</> : <><Mic className="w-4 h-4" /> Повторить</>}
        </button>
      </div>

      {recording && <div className="flex justify-center"><Waveform active={true} /></div>}

      {/* Comparison */}
      <AnimatePresence>
        {comparison && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex flex-wrap gap-1.5 bg-[#0F172A] rounded-xl p-4">
              {comparison.map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-sm font-medium"
                  style={{
                    backgroundColor: w.correct ? "#10B98120" : "#EF444420",
                    color: w.correct ? "#10B981" : "#EF4444",
                  }}
                >
                  {w.word}
                </span>
              ))}
            </div>
            {score !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 w-32 bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm">{score}%</span>
                </div>
                <button onClick={next} className="text-[#6366F1] text-sm font-semibold flex items-center gap-1 hover:text-[#818CF8]">
                  Следующее <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Phoneme Trainer ──────────────────────────────────────────────────────────
function PhonemeTrainer({ speak }: { speak: (t: string, r?: number) => void }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="text-white font-extrabold text-base">🔤 Тренажёр фонем</h2>
        <p className="text-[#475569] text-xs mt-0.5">Звуки, которых нет в русском</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PHONEMES.map((ph) => (
          <motion.div
            key={ph.symbol}
            whileHover={{ y: -2 }}
            onClick={() => setActive(active === ph.symbol ? null : ph.symbol)}
            className={`rounded-2xl p-4 cursor-pointer border transition-all ${
              active === ph.symbol
                ? "bg-[#6366F1]/10 border-[#6366F1]/40"
                : "bg-[#0F172A] border-[#1E293B] hover:border-[#334155]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl font-extrabold text-white font-mono">{ph.symbol}</span>
              <button
                onClick={(e) => { e.stopPropagation(); speak(ph.word, 0.6); }}
                className="p-1.5 rounded-lg bg-[#1E293B] text-[#6366F1] hover:bg-[#334155] transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-white font-semibold text-sm mb-1">{ph.name}</div>
            <div className="text-[#64748B] text-xs">{ph.example}</div>
            <AnimatePresence>
              {active === ph.symbol && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-[#334155] text-[#94A3B8] text-xs leading-relaxed">
                    💡 {ph.tip}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Tongue Twisters ──────────────────────────────────────────────────────────
function TongueTwisters({ speak, startRecognition }: { speak: (t: string, r?: number) => void; startRecognition: Function }) {
  const [idx, setIdx] = useState(0);
  const [speed, setSpeed] = useState<number>(0.7);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const tw = TONGUE_TWISTERS[idx];

  const record = () => {
    setRecording(true);
    setTranscript(null);
    startRecognition(
      (text: string) => setTranscript(text),
      () => setRecording(false)
    );
  };

  const speedOptions = [{ label: "Медленно", val: 0.55 }, { label: "Нормально", val: 0.8 }, { label: "Быстро", val: 1.2 }];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-white font-extrabold text-base">🌀 Скороговорки</h2>
        <p className="text-[#475569] text-xs mt-0.5">Тренируй беглость и артикуляцию</p>
      </div>

      {/* Twist selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TONGUE_TWISTERS.map((t, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setTranscript(null); }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              idx === i ? "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#818CF8]" : "border-[#334155] text-[#475569] hover:text-white"
            }`}
          >
            {i + 1}. {t.level}
          </button>
        ))}
      </div>

      <div className="bg-[#0F172A] rounded-2xl p-5 text-center">
        <p className="text-white font-semibold text-base leading-relaxed">{tw.text}</p>
        <span
          className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
            tw.level === "Лёгкий" ? "bg-[#10B981]/20 text-[#10B981]"
              : tw.level === "Средний" ? "bg-[#F59E0B]/20 text-[#F59E0B]"
              : "bg-[#EF4444]/20 text-[#EF4444]"
          }`}
        >
          {tw.level}
        </span>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-2">
        <span className="text-[#475569] text-xs">Скорость TTS:</span>
        {speedOptions.map((s) => (
          <button
            key={s.val}
            onClick={() => setSpeed(s.val)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              speed === s.val ? "bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40" : "text-[#475569] hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => speak(tw.text, speed)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#6366F1]/40 text-white text-sm font-semibold transition-all"
        >
          <Volume2 className="w-4 h-4 text-[#6366F1]" /> Прослушать
        </button>
        <button
          onClick={record}
          disabled={recording}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
            recording
              ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
              : "bg-[#6366F1]/10 border-[#6366F1]/30 text-[#818CF8] hover:bg-[#6366F1]/20"
          }`}
        >
          {recording ? <><MicOff className="w-4 h-4" /> Записываю...</> : <><Mic className="w-4 h-4" /> Записать</>}
        </button>
      </div>

      {recording && <div className="flex justify-center"><Waveform active={true} /></div>}

      <AnimatePresence>
        {transcript !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] rounded-xl p-4 space-y-2"
          >
            <div className="text-[#475569] text-xs">Ты сказал:</div>
            <div className="text-white text-sm italic">"{transcript}"</div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setTranscript(null); record(); }}
                className="flex items-center gap-1.5 text-[#6366F1] text-xs font-semibold hover:text-[#818CF8]"
              >
                <RefreshCw className="w-3 h-3" /> Попробовать ещё
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PronunciationPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("pairs");
  const [showBanner, setShowBanner] = useState(false);
  const { hasSpeech, speak, startRecognition } = useSpeech();
  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    pairs: null, shadowing: null, phonemes: null, twisters: null,
  });

  useEffect(() => {
    if (!hasSpeech) setShowBanner(true);
  }, [hasSpeech]);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Произношение 🎤</h1>
        <p className="text-[#475569] text-sm mt-0.5">Тренируй акцент с AI-анализом</p>
      </div>

      {showBanner && <BrowserBanner />}

      {/* Section nav (sticky) */}
      <div className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur-sm pt-2 pb-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeSection === s.id
                  ? "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#818CF8]"
                  : "bg-[#1E293B] border-[#334155] text-[#64748B] hover:text-white hover:border-[#475569]"
              }`}
            >
              <span>{s.emoji}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <div ref={(el) => { sectionRefs.current.pairs = el; }}>
          <MinimalPairs speak={speak} startRecognition={startRecognition} />
        </div>
        <div ref={(el) => { sectionRefs.current.shadowing = el; }}>
          <Shadowing speak={speak} startRecognition={startRecognition} />
        </div>
        <div ref={(el) => { sectionRefs.current.phonemes = el; }}>
          <PhonemeTrainer speak={speak} />
        </div>
        <div ref={(el) => { sectionRefs.current.twisters = el; }}>
          <TongueTwisters speak={speak} startRecognition={startRecognition} />
        </div>
      </div>
    </div>
  );
}
