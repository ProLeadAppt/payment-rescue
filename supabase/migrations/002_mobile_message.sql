-- Migration 002: Add Mobile Message settings and enhance customers table
-- Run this in Supabase SQL Editor after migration 001

-- Add phone column to profiles for the user's business phone
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mobile_message_api_key TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mobile_message_sender TEXT;

-- Ensure customers has phone column (already in 001 but just in case)
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add sent_at tracking to invoices
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;

-- Update the indexes
CREATE INDEX IF NOT EXISTS idx_invoices_reminder_sent ON public.invoices(user_id, last_reminder_sent_at);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON public.reminders(scheduled_at, status);
