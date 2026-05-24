-- Migration 003: SMS sender configuration per user
-- Allows users to set their own sender number (ported from their business phone)
-- or use the app default sender ID / dedicated number

-- Add SMS sender config to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_sender_type TEXT DEFAULT 'shared';
-- Options: 'shared' (use app default), 'own_number' (port their business number), 'business_name' (alphanumeric sender ID)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS own_sender_number TEXT;
-- The user's own mobile number (e.g. '0412345678') — only used when sms_sender_type = 'own_number'

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_sender_label TEXT;
-- Human-readable label for the sender, e.g. "Smith Landscaping" or "0412 345 678"

-- Add index for SMS-related profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_sms_sender ON public.profiles(id, sms_sender_type);
