export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/settings — get user settings
export async function GET() {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, phone, mobile_message_sender')
      .eq('id', session.user.id)
      .single();

    // Don't return the full API key, just whether it's configured
    const { data: keyCheck } = await supabase
      .from('profiles')
      .select('mobile_message_api_key')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      business_name: profile?.business_name || '',
      phone: profile?.phone || '',
      mobile_message_sender: profile?.mobile_message_sender || '',
      has_mobile_message_key: !!keyCheck?.mobile_message_api_key,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/settings — update user settings
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { business_name, phone, mobile_message_api_key, mobile_message_sender } = body;

    const updateData: any = {};
    if (business_name !== undefined) updateData.business_name = business_name;
    if (phone !== undefined) updateData.phone = phone;
    if (mobile_message_api_key !== undefined) updateData.mobile_message_api_key = mobile_message_api_key;
    if (mobile_message_sender !== undefined) updateData.mobile_message_sender = mobile_message_sender;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
