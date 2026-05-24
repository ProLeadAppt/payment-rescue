import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

const MOBILE_MESSAGE_API = 'https://api.mobilemessage.com.au/v1/messages';

const MM_API_KEY = process.env.MOBILE_MESSAGE_API_KEY || '';
const MM_USERNAME = MM_API_KEY.split(':')[0] || '';
const MM_PASSWORD = MM_API_KEY.includes(':') ? MM_API_KEY.split(':').slice(1).join(':') : '';
const MM_DEFAULT_SENDER = process.env.MOBILE_MESSAGE_SENDER || '61485900166';

async function sendViaMobileMessage(
  username: string,
  password: string,
  payload: { to: string; message: string; sender: string; customRef?: string }
) {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  const body: any = {
    messages: [
      {
        to: payload.to.replace(/[^0-9+]/g, '').startsWith('0')
          ? `61${payload.to.replace(/[^0-9+]/g, '').slice(1)}`
          : payload.to.replace(/[^0-9+]/g, '').replace(/^\+/, ''),
        message: payload.message,
        sender: payload.sender,
        custom_ref: payload.customRef || '',
      },
    ],
  };

  const res = await fetch(MOBILE_MESSAGE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Mobile Message API error: ${JSON.stringify(data)}`);
  }

  return data;
}

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit code
}

// POST /api/sms/verify-send — send verification code to a phone number
export async function POST(req: NextRequest) {
  try {
    if (!MM_USERNAME || !MM_PASSWORD) {
      return NextResponse.json({ error: 'SMS provider not configured' }, { status: 500 });
    }

    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const code = generateCode();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_code: code,
        verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
      .eq('id', session.user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Send the code via SMS
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = formattedPhone.startsWith('0') ? `61${formattedPhone.slice(1)}` : formattedPhone;

    const result = await sendViaMobileMessage(MM_USERNAME, MM_PASSWORD, {
      to: fullPhone,
      message: `Your Payment Rescue verification code is: ${code}. This code expires in 10 minutes.`,
      sender: MM_DEFAULT_SENDER,
      customRef: `verify_${session?.user?.id?.slice(0, 8)}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      messageId: result.results?.[0]?.message_id || null,
    });
  } catch (error: any) {
    console.error('Verification send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

// Note: We'll use the verify-check endpoint via a separate route
