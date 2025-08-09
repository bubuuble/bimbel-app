// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware' // Import helper middleware

export async function middleware(request: NextRequest) {
  // This middleware is used to refresh the user's session cookie
  // and handle authentication redirects.
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // to get the latest session
  await supabase.auth.getSession()
  
  // OPTIONAL: Auth redirection
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Daftar halaman yang memerlukan login
  const protectedRoutes = ['/dashboard', '/admin'];

  // Jika user belum login dan mencoba mengakses halaman yang dilindungi
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Arahkan ke halaman login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // Jika user sudah login dan mencoba mengakses halaman login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
    // Arahkan ke dashboard
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}