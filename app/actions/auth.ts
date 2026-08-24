'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Kita kembalikan menjadi fungsi pengirim status sukses/gagal
export async function handleLoginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const pass = formData.get('password') as string;

  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanPass = pass?.trim() || '';

  if (cleanEmail === 'pm@bwc.com' && cleanPass === 'pm123') {
    cookies().set('userRole', 'OWNER', { path: '/' });
    return { success: true };
  } 
  
  if (cleanEmail === 'site@bwc.com' && cleanPass === 'site123') {
    cookies().set('userRole', 'SITE_MANAGER', { path: '/' });
    return { success: true };
  }

  // Kirim pesan error jika tidak cocok
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