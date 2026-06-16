# Fluenta — AI English Academy

AI-powered English learning platform for Russian and Kazakh speakers. Built with Next.js 16, Supabase, Google Gemini, Tailwind CSS v4, and Framer Motion.

## Features

- **AI Tutor** — real-time conversation with Gemini (6 modes: conversation, grammar, vocabulary, writing, exams, business)
- **Lessons** — 30 structured lessons across A1-C2 CEFR levels with 5 exercise types
- **Vocabulary** — SM-2 spaced repetition flashcards with 3D flip animations
- **Pronunciation** — minimal pairs, shadowing, phoneme trainer, tongue twisters
- **Gamification** — XP, levels, streaks, 12 achievements, leaderboard
- **Progress** — radar chart, activity calendar, C1 projection
- **PWA** — installable, offline support, push notifications

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/fluenta.git
cd fluenta
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in the three required keys (see below).

### 3. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `scripts/setup-supabase.sql`
3. Go to **Authentication → Providers → Google** → enable Google OAuth
4. Copy your **Project URL** and **anon key** into `.env.local`

### 4. Get a Gemini API key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API key** → create a free key
3. Paste into `.env.local` as `GEMINI_API_KEY`

### 5. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel
1. Push code to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Click **Deploy**

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (`eyJ...`) |
| `GEMINI_API_KEY` | Google Gemini API key (`AIza...`) |
| `NEXT_PUBLIC_APP_URL` | Production URL (e.g. `https://fluenta.vercel.app`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion v12 |
| Auth + Database | Supabase |
| AI | Google Gemini 1.5 Flash |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
fluenta/
├── app/
│   ├── (dashboard)/         # Protected routes (auth required)
│   │   ├── dashboard/       # Home dashboard
│   │   ├── ai-tutor/        # AI conversation tutor
│   │   ├── lessons/         # Lesson browser + player
│   │   ├── vocabulary/      # Flashcard SRS system
│   │   ├── pronunciation/   # Pronunciation exercises
│   │   ├── progress/        # Progress & achievements
│   │   └── profile/         # User settings
│   ├── api/                 # API routes (Gemini streaming)
│   ├── auth/                # Login / Register pages
│   ├── landing/             # Public landing page
│   └── offline/             # PWA offline fallback
├── components/
│   ├── layout/              # Sidebar, TopBar, MobileNav
│   ├── gamification/        # XPBar, StreakCounter, AchievementBadge
│   └── vocabulary/          # FlashCard, ReviewSession
├── lib/
│   ├── gamification.ts      # XP levels, achievements
│   ├── lessons-data.ts      # 30 lessons content
│   ├── srs.ts               # SM-2 algorithm
│   └── supabase.ts          # Supabase client
├── scripts/
│   └── setup-supabase.sql   # Complete DB setup
└── public/
    └── sw.js                # Service worker
```

---

## Supabase Auth Setup (Google OAuth)

1. In Supabase dashboard → **Authentication → Providers → Google**
2. Enable Google provider
3. Copy the **Callback URL** shown
4. Go to [console.cloud.google.com](https://console.cloud.google.com) → create OAuth 2.0 credentials
5. Add the Supabase callback URL to **Authorized redirect URIs**
6. Paste Client ID + Client Secret back into Supabase
