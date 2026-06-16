-- ============================================================
-- FLUENTA — Complete Supabase Setup
-- Paste this entire file into Supabase SQL Editor and Run
-- ============================================================

-- ── PROFILES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL UNIQUE,
  full_name     text NOT NULL DEFAULT '',
  username      text UNIQUE,
  email         text,
  avatar_url    text,

  -- Language settings
  native_language  text DEFAULT 'Русский',
  target_language  text DEFAULT 'English',
  cefr_level       text NOT NULL DEFAULT 'A1'
                     CHECK (cefr_level IN ('A1','A2','B1','B2','C1','C2')),

  -- Gamification
  xp              integer NOT NULL DEFAULT 0,
  level           integer NOT NULL DEFAULT 1,
  streak          integer NOT NULL DEFAULT 0,
  longest_streak  integer NOT NULL DEFAULT 0,
  total_lessons   integer NOT NULL DEFAULT 0,
  total_vocab     integer NOT NULL DEFAULT 0,
  last_active     date DEFAULT current_date,

  -- Settings
  daily_goal_minutes    integer NOT NULL DEFAULT 20,
  learning_goal         text DEFAULT 'Разговорный английский',
  notifications_enabled boolean NOT NULL DEFAULT true,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── LESSONS PROGRESS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users NOT NULL,
  lesson_id    text NOT NULL,
  completed    boolean NOT NULL DEFAULT false,
  score        integer NOT NULL DEFAULT 0,
  max_score    integer NOT NULL DEFAULT 100,
  time_spent_seconds integer DEFAULT 0,
  attempts     integer NOT NULL DEFAULT 1,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- ── VOCABULARY ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users NOT NULL,
  word           text NOT NULL,
  translation    text NOT NULL DEFAULT '',
  context        text,
  phonetic       text,
  part_of_speech text,
  example_sentence text,
  difficulty     integer NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),

  -- SM-2 SRS fields
  interval       integer NOT NULL DEFAULT 1,
  ease_factor    float   NOT NULL DEFAULT 2.5,
  repetitions    integer NOT NULL DEFAULT 0,
  next_review    timestamptz NOT NULL DEFAULT now(),
  last_reviewed  timestamptz,

  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── AI CONVERSATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users NOT NULL,
  title      text NOT NULL DEFAULT 'Новый чат',
  messages   jsonb NOT NULL DEFAULT '[]',
  mode       text NOT NULL DEFAULT 'conversation'
               CHECK (mode IN ('conversation','grammar','vocabulary','writing','exams','business')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── PRONUNCIATION SCORES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS pronunciation_scores (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  exercise_type text NOT NULL,
  target        text NOT NULL,
  user_attempt  text,
  score         integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── DAILY ACTIVITY ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_activity (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES auth.users NOT NULL,
  date               date NOT NULL DEFAULT current_date,
  minutes_studied    integer NOT NULL DEFAULT 0,
  xp_earned         integer NOT NULL DEFAULT 0,
  lessons_completed  integer NOT NULL DEFAULT 0,
  vocab_reviewed     integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity     ENABLE ROW LEVEL SECURITY;

-- ── RLS POLICIES ─────────────────────────────────────────────
-- profiles: own row via user_id
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL
  USING (auth.uid() = user_id);

-- lessons_progress
CREATE POLICY "Users own their progress"
  ON lessons_progress FOR ALL
  USING (auth.uid() = user_id);

-- vocabulary
CREATE POLICY "Users own their vocabulary"
  ON vocabulary FOR ALL
  USING (auth.uid() = user_id);

-- ai_conversations
CREATE POLICY "Users own their conversations"
  ON ai_conversations FOR ALL
  USING (auth.uid() = user_id);

-- pronunciation_scores
CREATE POLICY "Users own their pronunciation scores"
  ON pronunciation_scores FOR ALL
  USING (auth.uid() = user_id);

-- daily_activity
CREATE POLICY "Users own their daily activity"
  ON daily_activity FOR ALL
  USING (auth.uid() = user_id);

-- ── PERFORMANCE INDEXES ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_user_id
  ON profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_lessons_progress_user
  ON lessons_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_lessons_progress_completed
  ON lessons_progress(user_id, completed_at DESC)
  WHERE completed = true;

CREATE INDEX IF NOT EXISTS idx_vocabulary_user_review
  ON vocabulary(user_id, next_review);

CREATE INDEX IF NOT EXISTS idx_vocabulary_mastered
  ON vocabulary(user_id, interval);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user
  ON ai_conversations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date
  ON daily_activity(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_pronunciation_scores_user
  ON pronunciation_scores(user_id, created_at DESC);

-- ── AUTO-UPDATE updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── UPDATE DAILY ACTIVITY HELPER ─────────────────────────────
-- Call this function when a user completes a lesson
CREATE OR REPLACE FUNCTION public.upsert_daily_activity(
  p_user_id uuid,
  p_xp      integer,
  p_lessons integer DEFAULT 0,
  p_vocab   integer DEFAULT 0,
  p_minutes integer DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_activity (user_id, date, xp_earned, lessons_completed, vocab_reviewed, minutes_studied)
  VALUES (p_user_id, current_date, p_xp, p_lessons, p_vocab, p_minutes)
  ON CONFLICT (user_id, date) DO UPDATE SET
    xp_earned         = daily_activity.xp_earned + EXCLUDED.xp_earned,
    lessons_completed = daily_activity.lessons_completed + EXCLUDED.lessons_completed,
    vocab_reviewed    = daily_activity.vocab_reviewed + EXCLUDED.vocab_reviewed,
    minutes_studied   = daily_activity.minutes_studied + EXCLUDED.minutes_studied;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── VERIFICATION ─────────────────────────────────────────────
-- Run this to verify all tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
