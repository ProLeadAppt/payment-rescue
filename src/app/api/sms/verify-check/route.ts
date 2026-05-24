import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// POST /api/sms/verify-check — verify the code entered by the user
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    // Get the stored code
    const { data: profile } = await supabase
      .from('profiles')
      .select('verification_code, verification_code_expires, mobile')
      .eq('id', session.user.id)
      .single();

    if (!profile?.verification_code) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
    }

    // Check expiry
    if (profile.verification_code_expires && new Date(profile.verification_code_expires) < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 });
    }

    // Check match
    if (profile.verification_code !== code.trim()) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // Mark as verified
    await supabase
      .from('profiles')
      .update({
        mobile_verified: true,
        verification_code: null,
        verification_code_expires: null,
      })
      .eq('id', session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully!',
      mobile: profile.mobile,
    });
  } catch (error: any) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify code' },
      { status: 500 }
    );
  }
}

// GET /api/sms/verify-status — check if user's mobile is verified
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('mobile, mobile_verified')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      mobile: profile?.mobile || '',
      verified: profile?.mobile_verified || false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
