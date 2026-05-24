import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Browser client — created lazily to avoid SSR issues
let browserClient: SupabaseClient | null = null;

function getBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// Export as a proxy that lazily creates the client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getBrowserClient();
    return (client as any)[prop];
  },
});

// Server client for API routes
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component
        }
      },
    },
  });
}
