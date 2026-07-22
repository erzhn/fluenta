'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Check, Menu, X, ChevronDown, Bot, BookOpen, TrendingUp, Mail, MessageCircle, Rocket, Flame, Zap, Lightbulb, Sparkles, type LucideIcon } from 'lucide-react'

// ── Animation helpers ──────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
  }),
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay / 0.1}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────
const FEATURES: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    icon: Bot,
    title: 'AI Tutor Zhan',
    desc: 'Natural conversations, instant feedback, personalized learning. Zhan adapts to your level and corrects mistakes gently.',
    color: '#6366f1',
  },
  {
    icon: BookOpen,
    title: 'Smart Lessons',
    desc: 'Structured curriculum from A1 to C2, at your own pace. Grammar, vocabulary, reading — all in one place.',
    color: '#8b5cf6',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    desc: 'See your improvement with detailed stats and streaks. Stay motivated with XP, badges, and daily goals.',
    color: '#06b6d4',
  },
]

const STEPS: { n: string; icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    n: '01',
    icon: Mail,
    title: 'Sign up instantly',
    desc: 'Create your account with just your email — no password needed, no credit card.',
    color: '#6366f1',
  },
  {
    n: '02',
    icon: MessageCircle,
    title: 'Chat with Zhan',
    desc: "Start a conversation with your AI tutor. Ask anything, practice topics you care about.",
    color: '#8b5cf6',
  },
  {
    n: '03',
    icon: Rocket,
    title: 'Improve every day',
    desc: "Get personalized practice, track your streak, and watch your English get better fast.",
    color: '#10b981',
  },
]

const TESTIMONIALS = [
  {
    name: 'Aizat M.',
    city: 'Almaty',
    avatar: 'A',
    gradient: 'from-[#6366f1] to-[#8b5cf6]',
    quote:
      "I was terrified of speaking English at work. After 2 months with Zhan, I'm leading meetings confidently. The instant corrections changed everything.",
    badge: 'A2 → B2',
  },
  {
    name: 'Mikhail D.',
    city: 'Moscow',
    avatar: 'M',
    gradient: 'from-[#8b5cf6] to-[#06b6d4]',
    quote:
      "I tried Duolingo, apps, YouTube — nothing worked long-term. Fluenta feels like an actual tutor who knows me. Passed IELTS 7.0 after 5 months.",
    badge: 'IELTS 7.0',
  },
  {
    name: 'Dilnoza K.',
    city: 'Tashkent',
    avatar: 'D',
    gradient: 'from-[#10b981] to-[#6366f1]',
    quote:
      "Zhan is incredibly patient and encouraging. I practice every morning for 20 minutes and my vocabulary has tripled. It genuinely feels like a friend teaching me.",
    badge: 'A1 → B1',
  },
]

// ── Chat bubble demo data ──────────────────────────────────────────────────────
const CHAT = [
  { role: 'user', text: 'I want to improve my English speaking' },
  {
    role: 'ai',
    text: "Great goal! Let's start with what matters to you most — work, travel, or everyday conversation?",
  },
  { role: 'user', text: 'My problem is I make grammar mistakes' },
  {
    role: 'ai',
    text: 'Small correction: say "My problem is that I make…" — adding \'that\' sounds more natural. What kind of mistakes? Tenses?',
    highlight: true,
  },
]

// ── Glassmorphism helper ───────────────────────────────────────────────────────
const glass = 'bg-white/[0.04] backdrop-blur-xl border border-white/10'

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#0f0f23' }}
    >
      <style>{`
        /* Star field */
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
        .star { position:absolute; border-radius:50%; background:#fff; animation:twinkle var(--d,3s) ease-in-out infinite; animation-delay:var(--delay,0s); }

        /* Blob drift */
        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(50px,-70px) scale(1.08);}
          66%{transform:translate(-40px,40px) scale(.94);}
        }
        .blob{animation:blobDrift var(--dur,16s) ease-in-out infinite;animation-delay:var(--delay,0s);will-change:transform;}

        /* Chat message pop */
        @keyframes msgPop { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:none} }
        .msg-1{animation:msgPop .4s ease 0.8s both;}
        .msg-2{animation:msgPop .4s ease 2.0s both;}
        .msg-3{animation:msgPop .4s ease 3.3s both;}
        .msg-4{animation:msgPop .4s ease 4.7s both;}

        /* Cursor blink */
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .cursor{animation:blink 1s step-end infinite;}

        /* Gradient text shimmer */
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #818cf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }
        @keyframes shimmerText { from{background-position:0% center} to{background-position:200% center} }

        /* Scroll bar */
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0f0f23}
        ::-webkit-scrollbar-thumb{background:#2d2d4e;border-radius:4px}
      `}</style>

      <StarField />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

// ── Star field ─────────────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    dur: `${2.5 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              '--d': s.dur,
              '--delay': s.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f0f23]/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/30">
            F
          </div>
          <span className="font-black text-xl gradient-text">Fluenta</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground font-medium">
          {[['Features', '#features'], ['How it works', '#how'], ['Testimonials', '#testimonials']].map(([label, href]) => (
            <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium px-4 py-2">
            Log in
          </Link>
          <Link href="/auth/login">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-lg shadow-indigo-500/25 hover:scale-105 hover:shadow-indigo-500/40">
              Start for free
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
              : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.div>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0f0f23]/98 backdrop-blur-xl border-b border-white/8"
          >
            <div className="px-5 py-4 space-y-1">
              {[['Features', '#features'], ['How it works', '#how'], ['Testimonials', '#testimonials']].map(([label, href]) => (
                <a key={label} href={href} onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-all font-medium">
                  {label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-medium text-muted-foreground border border-white/10 hover:text-white hover:bg-white/5 transition-all">Log in</button>
                </Link>
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">Start for free</button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-12 overflow-hidden">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6366f1, #4338ca, transparent 70%)', filter: 'blur(80px)', '--dur': '18s' } as React.CSSProperties} />
        <div className="blob absolute top-20 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, #6d28d9, transparent 70%)', filter: 'blur(80px)', '--dur': '22s', '--delay': '-6s' } as React.CSSProperties} />
        <div className="blob absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #06b6d4, #0369a1, transparent 70%)', filter: 'blur(80px)', '--dur': '26s', '--delay': '-12s' } as React.CSSProperties} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={`inline-flex items-center gap-2 ${glass} rounded-full px-4 py-2 text-sm text-[#a5b4fc] mb-7`}>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-medium">AI-powered · completely free</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-[64px] font-black leading-[1.06] tracking-tight mb-6"
          >
            Speak English
            <br />
            <span className="gradient-text">with confidence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-9 max-w-lg"
          >
            Meet <strong className="text-white">Zhan</strong>, your personal AI English tutor.
            Available 24/7, completely free. Real conversations, instant corrections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="flex flex-col sm:flex-row gap-3 mb-9"
          >
            <Link href="/auth/login">
              <button className="group flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03]">
                Start for free →
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a href="#how">
              <button className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all">
                See how it works
                <ChevronDown className="w-4 h-4" />
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-5"
          >
            {['No credit card required', 'Cancel anytime', 'Free forever'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: animated chat */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/15 rounded-3xl blur-3xl scale-95 translate-y-6" />

          <div className={`relative ${glass} rounded-3xl overflow-hidden shadow-2xl shadow-black/50`}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-white/[0.02]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/30">
                  Z
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#0f0f23]" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Zhan</div>
                <div className="text-[#10b981] text-xs font-medium">Online · your AI tutor</div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/70" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/70" />
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-3.5 min-h-[280px]">
              <div className="msg-1 flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                    {CHAT[0].text}
                  </div>
                  <div className="text-[10px] text-muted-foreground text-right mt-1">You · just now</div>
                </div>
              </div>

              <div className="msg-2 flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-[10px] shrink-0">Z</div>
                <div className={`${glass} rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[82%] text-[#e2e8f0]`}>
                  {CHAT[1].text}
                </div>
              </div>

              <div className="msg-3 flex justify-end">
                <div className="max-w-[78%]">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                    {CHAT[2].text}
                  </div>
                </div>
              </div>

              <div className="msg-4 flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-[10px] shrink-0">Z</div>
                <div className="max-w-[82%]">
                  <div className={`${glass} rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#e2e8f0]`}>
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b]/15 border border-[#f59e0b]/25 text-[#fbbf24] rounded px-1.5 py-0.5 text-xs font-semibold mr-1.5"><Lightbulb className="w-3 h-3" strokeWidth={2} /> Correction</span>
                    Say <span className="font-semibold text-white">&ldquo;My problem is <span className="text-[#34d399] bg-[#10b981]/15 px-1 rounded">that</span> I make…&rdquo;</span> — sounds more natural!
                  </div>
                </div>
              </div>

              {/* Input mock */}
              <div className={`${glass} rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground`}>
                <span>Type your message…</span>
                <span className="cursor text-primary font-bold">|</span>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.5, type: 'spring' }}
            className={`absolute -right-4 -bottom-4 ${glass} rounded-2xl px-4 py-3 shadow-xl shadow-black/40`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#F59E0B]" fill="#F59E0B" strokeWidth={1.5} />
              <div>
                <div className="text-white font-bold text-sm">7-day streak</div>
                <div className="text-muted-foreground text-xs">Keep it up!</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5, type: 'spring' }}
            className={`absolute -left-4 top-8 ${glass} rounded-2xl px-4 py-3 shadow-xl shadow-black/40`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#F59E0B]" fill="#F59E0B" strokeWidth={1.5} />
              <div>
                <div className="text-white font-bold text-sm">+150 XP</div>
                <div className="text-muted-foreground text-xs">earned today</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Features ───────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Features</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Everything you need to{' '}
              <span className="gradient-text">learn faster</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              One platform, all the tools — no extras to buy, no subscriptions to manage.
            </p>
          </FadeUp>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className={`group relative ${glass} rounded-2xl p-7 h-full overflow-hidden cursor-default`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}18 0%, transparent 65%)` }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}70, transparent)` }}
                />

                <div
                  className="rounded-xl flex items-center justify-center mb-5 w-12 h-12"
                  style={{ backgroundColor: `${f.color}20` }}
                >
                  <f.icon className="w-6 h-6" strokeWidth={1.75} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how" className="relative py-24 px-5 sm:px-8">
      {/* Section glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">How it works</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-4xl sm:text-5xl font-black">
              Start speaking in{' '}
              <span className="gradient-text">3 simple steps</span>
            </h2>
          </FadeUp>
        </div>

        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden sm:block absolute top-[52px] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-[2px] overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)' }}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div
                      className="w-[104px] h-[104px] rounded-3xl flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <step.icon className="w-11 h-11" strokeWidth={1.5} style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.n}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.3} className="text-center mt-12">
          <Link href="/auth/login">
            <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c3aed] transition-all shadow-xl shadow-indigo-500/25 hover:scale-[1.03]">
              Get started free →
            </button>
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 px-5 sm:px-8">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp>
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Testimonials</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Students who{' '}
              <span className="gradient-text">transformed</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <div className="flex items-center justify-center gap-1 text-[#f59e0b]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              <span className="text-white font-bold ml-2">4.9</span>
              <span className="text-muted-foreground text-sm ml-1.5">from 50,000+ learners</span>
            </div>
          </FadeUp>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className={`${glass} rounded-3xl p-7 relative overflow-hidden h-full flex flex-col`}
              >
                <div className={`absolute inset-0 opacity-[0.04] bg-gradient-to-br ${t.gradient} pointer-events-none`} />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-[#f59e0b] fill-current" />)}
                </div>

                <p className="text-[#cbd5e1] text-sm leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center font-black text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                      {t.name}
                    </div>
                    <div className="text-muted-foreground text-xs">{t.city}</div>
                  </div>
                  <div className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${t.gradient} text-white shrink-0`}>
                    {t.badge}
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#4338ca]" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />

            <div className="relative z-10 text-center py-16 px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 mb-7"
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Join 50,000+ learners — it&apos;s free
              </motion.div>

              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-white leading-tight mb-5">
                Ready to speak English
                <br />fluently?
              </h2>
              <p className="text-indigo-200 text-lg mb-9 max-w-md mx-auto">
                Start learning for free today. No credit card, no commitment.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/login">
                  <button className="group flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-primary bg-white hover:bg-white/95 transition-all hover:scale-[1.04] shadow-2xl shadow-black/20">
                    Start learning for free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-7 text-sm text-indigo-200">
                {['No credit card', 'Free forever', 'Cancel anytime'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-300" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-black text-xs">
            F
          </div>
          <span className="font-black gradient-text">Fluenta</span>
        </div>
        <p className="text-[#334155] text-sm text-center">Fluenta © 2026 — Free AI English Academy</p>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
}
