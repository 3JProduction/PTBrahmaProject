'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const pass = formData.get('password') as string;

  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanPass = pass?.trim() || '';

  // Skenario 1: Owner / PM
  if (cleanEmail === 'pm@bwc.com' && cleanPass === 'pm123') {
    cookies().set({
      name: 'userRole',
      value: 'OWNER',
      path: '/',
      httpOnly: true, // Aman dari penyadapan
      secure: true, // Wajib aktif untuk Vercel (HTTPS)
      sameSite: 'lax', // Mencegah tiket hilang saat pindah halaman
      maxAge: 60 * 60 * 24 * 7 // Ingat login selama 7 hari
    });
    redirect('/dashboard');
  } 
  
  // Skenario 2: Site Manager
  if (cleanEmail === 'site@bwc.com' && cleanPass === 'site123') {
    cookies().set({
      name: 'userRole',
      value: 'SITE_MANAGER',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    redirect('/dashboard');
  }

  // Jika gagal, kembalikan dengan pesan error
  redirect('/login?error=invalid');
}

export async function logout() {
  cookies().delete('userRole');
  redirect('/login');
}

export async function handleLogout() {
  cookies().delete('userRole');
  redirect('/login');
}