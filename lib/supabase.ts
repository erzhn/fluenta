import { createClient } from "@supabase/supabase-js";

/*
 * ─── SUPABASE SCHEMA — run this SQL in the Supabase SQL Editor ───────────────
 *
 * CREATE TABLE profiles (
 *   id uuid references auth.users primary key,
 *   name text,
 *   email text,
 *   avatar_url text,
 *   current_level text default 'A1',
 *   target_level text default 'C1',
 *   daily_goal_minutes int default 30,
 *   goal_type text default 'general',
 *   xp int default 0,
 *   streak int default 0,
 *   last_active date,
 *   created_at timestamptz default now()
 * );
 *
 * CREATE TABLE lessons_progress (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references profiles(id) on delete cascade,
 *   lesson_id text,
 *   completed boolean default false,
 *   score int,
 *   completed_at timestamptz
 * );
 *
 * CREATE TABLE vocabulary (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references profiles(id) on delete cascade,
 *   word text,
 *   translation text,
 *   context text,
 *   next_review timestamptz default now(),
 *   interval int default 1,
 *   ease_factor float default 2.5,
 *   repetitions int default 0
 * );
 *
 * CREATE TABLE ai_conversations (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references profiles(id) on delete cascade,
 *   title text,
 *   messages jsonb default '[]',
 *   created_at timestamptz default now(),
 *   updated_at timestamptz default now()
 * );
 *
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE lessons_progress ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users own their profile"
 *   ON profiles FOR ALL USING (auth.uid() = id);
 * CREATE POLICY "Users own their progress"
 *   ON lessons_progress FOR ALL USING (auth.uid() = user_id);
 * CREATE POLICY "Users own their vocabulary"
 *   ON vocabulary FOR ALL USING (auth.uid() = user_id);
 * CREATE POLICY "Users own their conversations"
 *   ON ai_conversations FOR ALL USING (auth.uid() = user_id);
 *
 * -- Auto-create profile on user signup
 * CREATE OR REPLACE FUNCTION public.handle_new_user()
 * RETURNS trigger AS $$
 * BEGIN
 *   INSERT INTO public.profiles (id, email, name)
 *   VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
 *   RETURN new;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_auth_user_created
 *   AFTER INSERT ON auth.users
 *   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
 */

// Use placeholder values at build time so module init never throws.
// Real API calls will fail gracefully if env vars are missing at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    { auth: { persistSession: false } }
  );
}
