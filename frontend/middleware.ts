import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isProtectedPath = path.startsWith('/student') || path.startsWith('/parent') || path.startsWith('/admin');

  if (isProtectedPath) {
    if (!user) {
      if (path.startsWith('/student')) return NextResponse.redirect(new URL('/auth/student', request.url));
      if (path.startsWith('/parent')) return NextResponse.redirect(new URL('/auth/parent', request.url));
      if (path.startsWith('/admin')) return NextResponse.redirect(new URL('/auth/admin', request.url));
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Read role from user metadata or profile table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role || user.user_metadata?.role;

    if (path.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL(`/auth/student?error=unauthorized`, request.url));
    }
    if (path.startsWith('/parent') && userRole !== 'parent') {
      return NextResponse.redirect(new URL(`/auth/parent?error=unauthorized`, request.url));
    }
    if (path.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/auth/admin?error=unauthorized`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/student/:path*', '/parent/:path*', '/admin/:path*'],
};
