-- ============================================================
-- Fluenta — Safe Migration
-- Run this in Supabase SQL Editor (Project > SQL Editor)
-- All statements use IF NOT EXISTS / IF EXISTS — safe to re-run
-- ============================================================

-- 1. Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp              int     DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak          int     DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active     date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_goal   text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- 2. Reset existing NULL values so the app sees clean 0s
UPDATE profiles SET xp = 0     WHERE xp IS NULL;
UPDATE profiles SET streak = 0  WHERE streak IS NULL;

-- 3. Add unique constraint on lessons_progress(user_id, lesson_id)
--    so upsert with onConflict:'user_id,lesson_id' works correctly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lessons_progress_user_lesson_unique'
  ) THEN
    ALTER TABLE lessons_progress
      ADD CONSTRAINT lessons_progress_user_lesson_unique
      UNIQUE (user_id, lesson_id);
  END IF;
END $$;

-- 4. Create daily_activity table (for weekly chart on progress page)
CREATE TABLE IF NOT EXISTS daily_activity (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid    REFERENCES profiles(id) ON DELETE CASCADE,
  date       date    NOT NULL,
  minutes    int     DEFAULT 0,
  xp_earned  int     DEFAULT 0,
  UNIQUE (user_id, date)
);

ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their activity" ON daily_activity;
CREATE POLICY "Users own their activity"
  ON daily_activity FOR ALL
  USING (auth.uid() = user_id);

-- Done. Verify with:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';
-- SELECT * FROM daily_activity LIMIT 5;
