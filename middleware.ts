import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah user memiliki tiket masuk (cookie auth_session)
  const session = request.cookies.get('auth_session');

  // Jika mencoba masuk ke dashboard tapi belum login, lempar ke halaman login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi mencoba buka halaman login, lempar langsung ke dashboard
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Menentukan rute mana saja yang dijaga oleh satpam middleware ini
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};