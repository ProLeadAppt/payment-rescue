import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const MOBILE_MESSAGE_API = 'https://api.mobilemessage.com.au/v1/messages';

// Server-side Mobile Message credentials (shared across all users)
const MM_API_KEY = process.env.MOBILE_MESSAGE_API_KEY || '';
const MM_DEFAULT_SENDER = process.env.MOBILE_MESSAGE_DEFAULT_SENDER || 'PayRescue';

async function sendViaMobileMessage(
  username: string,
  password: string,
  payload: { to: string; message: string; sender: string; customRef?: string }
) {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  const body: any = {
    messages: [
      {
        to: payload.to.startsWith('0') ? `61${payload.to.slice(1)}` : payload.to,
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

// POST /api/sms/send — send an SMS reminder
export async function POST(req: NextRequest) {
  try {
    if (!MM_API_KEY) {
      return NextResponse.json(
        { error: 'SMS provider not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { invoiceId, templateType = 'initial' } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId required' }, { status: 400 });
    }

    // Get invoice with customer
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*, customers(name, phone)')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.customers?.phone) {
      return NextResponse.json(
        { error: 'Customer has no phone number. Add a phone number to send SMS reminders.' },
        { status: 400 }
      );
    }

    // Get the SMS template
    const { data: template } = await supabase
      .from('sms_templates')
      .select('body')
      .eq('user_id', userId)
      .eq('type', templateType)
      .eq('is_default', true)
      .single();

    const templateBody =
      template?.body ||
      `Hi [[name]], just a friendly reminder that invoice #[[number]] for $[[amount]] was due on [[due_date]]. If you've already paid, ignore this! - [[business_name]]`;

    // Get user's business name
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', userId)
      .single();

    const businessName = profile?.business_name || 'Payment Rescue';

    // Replace placeholders
    const message = templateBody
      .replace(/\[\[name\]\]/g, invoice.customers.name || 'there')
      .replace(/\[\[number\]\]/g, invoice.invoice_number || invoice.id.slice(0, 8))
      .replace(/\[\[amount\]\]/g, `$${Number(invoice.amount).toFixed(2)}`)
      .replace(
        /\[\[due_date\]\]/g,
        invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-AU') : 'N/A'
      )
      .replace(/\[\[business_name\]\]/g, businessName)
      .replace(/\[\[pay_link\]\]/g, '');

    // Parse API key (format: username:password)
    const [username, password] = MM_API_KEY.split(':');

    if (!username || !password) {
      return NextResponse.json(
        { error: 'SMS provider not configured correctly. Please contact support.' },
        { status: 500 }
      );
    }

    // Send SMS
    const result = await sendViaMobileMessage(username, password, {
      to: invoice.customers.phone,
      message,
      sender: MM_DEFAULT_SENDER,
      customRef: `inv_${invoice.id.slice(0, 8)}_${templateType}`,
    });

    // Record the reminder
    const messageId = result.results?.[0]?.message_id || null;

    await supabase.from('reminders').insert({
      user_id: userId,
      invoice_id: invoice.id,
      channel: 'sms',
      type: templateType,
      status: 'sent',
      sent_at: new Date().toISOString(),
      message_body: message,
      provider_message_id: messageId,
    });

    // Update invoice reminder count
    await supabase
      .from('invoices')
      .update({
        reminder_count: (invoice.reminder_count || 0) + 1,
        last_reminder_sent_at: new Date().toISOString(),
        status: invoice.status === 'pending' ? 'sent' : invoice.status,
      })
      .eq('id', invoice.id);

    return NextResponse.json({
      success: true,
      messageId,
      result,
    });
  } catch (error: any) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
