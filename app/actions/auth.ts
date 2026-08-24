'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const pass = formData.get('password') as string;

  // Bersihkan spasi tidak sengaja
  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanPass = pass?.trim() || '';

  // Skenario 1: Owner / PM
  if (cleanEmail === 'pm@bwc.com' && cleanPass === 'pm123') {
    cookies().set('userRole', 'OWNER', { path: '/' });
    redirect('/dashboard');
  } 
  
  // Skenario 2: Site Manager
  if (cleanEmail === 'site@bwc.com' && cleanPass === 'site123') {
    cookies().set('userRole', 'SITE_MANAGER', { path: '/' });
    redirect('/dashboard');
  }

  // Jika gagal, kembalikan ke halaman login dengan tanda error
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