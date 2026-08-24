'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(email: string, pass: string) {
  // Membersihkan spasi yang mungkin tidak sengaja terketik (auto-trim)
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Skenario 1: Project Manager
  if (cleanEmail === 'pm@bwc.com' && cleanPass === 'pm123') {
    cookies().set('userRole', 'OWNER', { path: '/' });
    return { success: true };
  } 
  
  // Skenario 2: Site Manager
  if (cleanEmail === 'site@bwc.com' && cleanPass === 'site123') {
    cookies().set('userRole', 'SITE_MANAGER', { path: '/' });
    return { success: true };
  }

  return { error: 'Email atau password salah!' };
}

export async function logout() {
  cookies().delete('userRole');
  redirect('/login');
}

export async function handleLogout() {
  cookies().delete('userRole');
  redirect('/login');
}