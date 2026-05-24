import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/sync-session
 * Syncs the client-side session (from localStorage) to server-side cookies.
 * Called after successful signup or signin.
 */
export async function POST(req: NextRequest) {
  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Set the session on the server client (this validates the tokens and sets cookies)
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('Session sync error:', error);
    return NextResponse.json({ error: 'Failed to sync session' }, { status: 500 });
  }
}
