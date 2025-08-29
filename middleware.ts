// FILE: middleware.ts (VERSI FINAL YANG SUDAH DIPERBAIKI)

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

// Beritahu Next.js untuk menggunakan runtime Node.js untuk kompatibilitas
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  // Langkah 1: Buat client Supabase dan siapkan respons awal
  const { supabase, response } = createClient(request);

  // --- [PERBAIKAN UTAMA] ---
  // Panggil getSession() HANYA SEKALI. Panggilan ini melakukan DUA hal:
  // 1. Menyegarkan cookie sesi (menulis ke objek 'response').
  // 2. Mengembalikan data sesi saat ini.
  const { data: { session } } = await supabase.auth.getSession();
  // -------------------------

  // Langkah 2: Gunakan data 'session' yang sudah kita dapatkan untuk logika redirect
  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/dashboard'];

  // Logika 2a: Jika TIDAK ada sesi (pengguna belum login) dan mencoba mengakses rute yang dilindungi
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Arahkan ke halaman login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // Logika 2b: Jika ADA sesi (pengguna sudah login) dan mencoba mengakses halaman login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
    // Arahkan ke dashboard
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Langkah 3: Jika tidak ada redirect, kembalikan 'response' asli yang sudah diperbarui dengan cookie sesi yang baru
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|image/).*)',
  ],
}