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
      .select('business_name, phone, sms_sender_type, own_sender_number, sms_sender_label')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      business_name: profile?.business_name || '',
      phone: profile?.phone || '',
      sms_sender_type: profile?.sms_sender_type || 'shared',
      own_sender_number: profile?.own_sender_number || '',
      sms_sender_label: profile?.sms_sender_label || '',
      sms_configured: !!(process.env.MOBILE_MESSAGE_USERNAME && process.env.MOBILE_MESSAGE_PASSWORD),
      default_sender: process.env.MOBILE_MESSAGE_DEFAULT_SENDER || 'PayRescue',
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
    const { business_name, phone, sms_sender_type, own_sender_number, sms_sender_label } = body;

    const updateData: any = {};
    if (business_name !== undefined) updateData.business_name = business_name;
    if (phone !== undefined) updateData.phone = phone;
    if (sms_sender_type !== undefined) updateData.sms_sender_type = sms_sender_type;
    if (own_sender_number !== undefined) updateData.own_sender_number = own_sender_number;
    if (sms_sender_label !== undefined) updateData.sms_sender_label = sms_sender_label;
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
