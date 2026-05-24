import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { execSync } from 'child_process';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    // Authenticate user
    const cookieStore = cookies();
    const supabase = await createServerClient();
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Optional: restrict to specific email(s)
    const allowedEmail = process.env.INTERNAL_DASHBOARD_ALLOWED_EMAIL;
    if (allowedEmail) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData) {
        return new NextResponse('User profile not found', { status: 403 });
      }

      if (userData.email !== allowedEmail) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Generate dashboard by running the script
    const scriptPath = join(process.cwd(), '..', '..', 'scripts', 'payment_rescue_ops_dashboard.py');
    const output = execSync(`python3 ${scriptPath}`, { encoding: 'utf-8', maxBuffer: 1024 * 1024 });
    const dashboardPath = output.trim(); // script prints the path

    // Read the generated HTML
    const html = await fetch(`file://${dashboardPath}`).then(res => res.text());
    // Alternatively, read directly:
    // const fs = require('fs');
    // const html = fs.readFileSync(dashboardPath, 'utf-8');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (err: any) {
    console.error('Internal dashboard error:', err);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}