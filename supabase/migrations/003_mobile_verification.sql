-- Add mobile verification columns to profiles

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMPTZ;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON profiles(mobile) WHERE mobile IS NOT NULL;
