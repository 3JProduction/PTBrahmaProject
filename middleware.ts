import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek tiket yang benar, yaitu 'userRole' sesuai yang dibuat di auth.ts
  const role = request.cookies.get('userRole');

  // Jika mencoba masuk ke dashboard tapi belum login, lempar ke login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi buka halaman login, lempar langsung ke dashboard
  if (request.nextUrl.pathname === '/login' && role) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};