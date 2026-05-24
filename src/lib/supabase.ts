import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Browser client — uses localStorage
function createBrowserSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createClient('https://placeholder.supabase.co', 'placeholder_key');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createBrowserSupabase();
