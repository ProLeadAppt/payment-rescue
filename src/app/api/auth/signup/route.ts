import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password, business_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient();

    // Sign up the user using the admin/service role client
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_name },
      },
    });

    if (signupError) {
      if (signupError.message?.toLowerCase().includes('already') || signupError.message?.toLowerCase().includes('exists')) {
        return NextResponse.json({ error: 'An account with this email already exists. Try signing in.' }, { status: 409 });
      }
      return NextResponse.json({ error: signupError.message }, { status: 400 });
    }

    // If we got a session back (email confirmation is OFF)
    if (signupData?.session) {
      // Set the session cookies manually
      const response = NextResponse.json({
        success: true,
        redirectTo: '/dashboard?welcome=true',
        user: { id: signupData.user?.id, email: signupData.user?.email },
      });

      // Set auth cookies
      response.cookies.set('sb-access-token', signupData.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: signupData.session.expires_in,
        path: '/',
      });
      response.cookies.set('sb-refresh-token', signupData.session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Email confirmation required
    return NextResponse.json({
      success: true,
      requiresConfirmation: true,
      message: 'Check your email for a confirmation link.',
    });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
