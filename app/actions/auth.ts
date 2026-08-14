'use server';

import { cookies } from 'next/headers';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Catatan: Ini adalah simulasi login statis. 
  // Nanti kita akan sambungkan ini dengan Prisma (prisma.user.findUnique)
  if (email === 'admin@bwc.com' && password === 'admin123') {
    // Set cookie sesi (berlaku 24 jam)
    cookies().set('auth_session', 'admin_role_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, 
      path: '/',
    });
    
    return { success: true };
  }

  return { error: 'Email atau password salah!' };
}

export async function handleLogout() {
  cookies().delete('auth_session');
}