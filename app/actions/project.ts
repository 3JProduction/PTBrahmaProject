'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  // 1. Ambil data dari form
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const description = formData.get('description') as string;

  // 2. Simpan ke Database Supabase via Prisma
  await prisma.project.create({
    data: {
      title,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      status: 'ON_PROGRESS',
    },
  });

  // 3. Refresh data di halaman tabel dan kembali ke halaman daftar proyek
  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}