import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Refreshes the Supabase auth session on every request and guards /admin.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response; // not configured yet — don't block

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith('/admin');
  const isLogin = path === '/admin/login';

  // Protect /admin — redirect unauthenticated users to the login page.
  if (isAdmin && !isLogin && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin/login';
    return NextResponse.redirect(redirect);
  }
  // Already signed in? Skip the login page.
  if (isLogin && user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin';
    return NextResponse.redirect(redirect);
  }

  return response;
}
