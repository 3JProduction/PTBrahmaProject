'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Skenario 1: Login sebagai Project Manager / Owner
  if (email === 'pm@bwc.com' && password === 'pm123') {
    cookies().set('userRole', 'OWNER', { path: '/' });
    return { success: true };
  } 
  
  // Skenario 2: Login sebagai Site Manager
  if (email === 'site@bwc.com' && password === 'site123') {
    cookies().set('userRole', 'SITE_MANAGER', { path: '/' });
    return { success: true };
  }

  // Jika gagal
  return { error: 'Email atau password salah!' };
}

// Fungsi keluar untuk Sidebar.tsx
export async function handleLogout() {
  cookies().delete('userRole');
  redirect('/login');
}

// Fungsi keluar alternatif untuk layout.tsx (berjaga-jaga)
export async function logout() {
  cookies().delete('userRole');
  redirect('/login');
}