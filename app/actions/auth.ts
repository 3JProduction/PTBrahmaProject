'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function handleLoginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const pass = formData.get('password') as string;

  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanPass = pass?.trim() || '';

  let role = '';
  
  // Email berubah menjadi @bwat.com
  if (cleanEmail === 'pm@bwat.com' && cleanPass === 'pm123') {
    role = 'OWNER';
  } else if (cleanEmail === 'site@bwat.com' && cleanPass === 'site123') {
    role = 'SITE_MANAGER';
  }

  if (!role) {
    return { error: 'Email atau password salah!' };
  }

  cookies().set('userRole', role, { path: '/' });
  revalidatePath('/dashboard', 'layout');
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