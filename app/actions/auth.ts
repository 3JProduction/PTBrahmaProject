'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; // Senjata penghancur cache

export async function handleLoginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const pass = formData.get('password') as string;

  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanPass = pass?.trim() || '';

  let role = '';
  
  if (cleanEmail === 'pm@bwc.com' && cleanPass === 'pm123') {
    role = 'OWNER';
  } else if (cleanEmail === 'site@bwc.com' && cleanPass === 'site123') {
    role = 'SITE_MANAGER';
  }

  // Jika gagal, kembalikan pesan error tanpa memindahkan halaman
  if (!role) {
    return { error: 'Email atau password salah!' };
  }

  // Jika sukses, cetak tiketnya
  cookies().set('userRole', role, { path: '/' });

  // 1. Hapus ingatan "ditolak" dari halaman dashboard
  revalidatePath('/dashboard', 'layout');
  
  // 2. Langsung pindahkan dari sisi Server (Browser pasti menurut)
  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('userRole');
  redirect('/login');
}

export async function handleLogout() {
  cookies().delete('userRole');
  redirect('/login');
}