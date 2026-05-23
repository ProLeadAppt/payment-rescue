-- Payment Rescue Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  business_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (the people who owe you money)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_number TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'overdue', 'paid', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'square', 'xero', 'quickbooks')),
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders sent
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  channel TEXT DEFAULT 'sms' CHECK (channel IN ('sms', 'email')),
  type TEXT CHECK (type IN ('initial', 'follow_up_1', 'follow_up_2', 'final')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'delivered')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  message_body TEXT,
  provider_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder schedule settings per user
CREATE TABLE IF NOT EXISTS public.reminder_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  initial_days INTEGER DEFAULT 7,
  follow_up_1_days INTEGER DEFAULT 14,
  follow_up_2_days INTEGER DEFAULT 21,
  final_days INTEGER DEFAULT 30,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS templates per user
CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('initial', 'follow_up_1', 'follow_up_2', 'final')),
  body TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON public.invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_due ON public.invoices(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_invoice ON public.reminders(user_id, invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_status ON public.reminders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_user ON public.customers(user_id);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can manage own customers" ON public.customers FOR ALL USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can manage own invoices" ON public.invoices FOR ALL USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Users can manage own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

-- Reminder schedules policies
CREATE POLICY "Users can manage own schedule" ON public.reminder_schedules FOR ALL USING (auth.uid() = user_id);

-- SMS templates policies
CREATE POLICY "Users can manage own templates" ON public.sms_templates FOR ALL USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.reminder_schedules (user_id)
  VALUES (NEW.id);
  
  -- Insert default SMS templates
  INSERT INTO public.sms_templates (user_id, type, body, is_default) VALUES
    (NEW.id, 'initial', 'Hi [[name]], just a friendly reminder that invoice #[[number]] for $[[amount]] was due on [[due_date]]. If you''ve already paid, ignore this! Pay here: [[pay_link]] - [[business_name]]', TRUE),
    (NEW.id, 'follow_up_1', 'Hey [[name]], following up on invoice #[[number]] for $[[amount]] — it''s now 2 weeks overdue. Could you please arrange payment? Pay here: [[pay_link]] - [[business_name]]', TRUE),
    (NEW.id, 'follow_up_2', '[[name]], invoice #[[number]] for $[[amount]] is now 3 weeks overdue. This is our final reminder. Please pay here: [[pay_link]] - [[business_name]]', TRUE),
    (NEW.id, 'final', '[[name]], we need to escalate invoice #[[number]] for $[[amount]]. Please contact us urgently or pay here: [[pay_link]] - [[business_name]]', TRUE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
