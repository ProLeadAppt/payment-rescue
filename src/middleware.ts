import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function applyIndexingPolicy(response: NextResponse, request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = /^\/(dashboard|internal|login|signup)(?:\/|$)/.test(pathname);
  const isVercelAlias = request.nextUrl.hostname.endsWith('.vercel.app');

  // Private application routes must never appear in search. Vercel's generated
  // aliases serve the same marketing page as the custom domain, so mark every
  // alias noindex and keep www.paymentrescue.com.au as the canonical origin.
  if (isPrivateRoute || isVercelAlias) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = /^\/(dashboard|internal)(?:\/|$)/.test(pathname);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Marketing and auth pages must still render in isolated previews where
  // production auth secrets are intentionally unavailable. Protected routes
  // fail closed and return users to login instead of exposing app content.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return applyIndexingPolicy(NextResponse.redirect(url), request);
    }

    return applyIndexingPolicy(NextResponse.next({ request }), request);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return applyIndexingPolicy(NextResponse.redirect(url), request);
  }

  if (session && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return applyIndexingPolicy(NextResponse.redirect(url), request);
  }

  return applyIndexingPolicy(supabaseResponse, request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
