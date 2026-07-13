ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_goal text DEFAULT 'general';
-- learning_goal values: 'tourist' | 'business' | 'exam' | 'general'
