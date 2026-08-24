'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDailyReport(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const weather = formData.get('weather') as string;
  const notes = formData.get('notes') as string;

  // Menggunakan akun Site Manager BWAT dengan role SITE_MANAGER yang valid
  const defaultUser = await prisma.user.upsert({
    where: { email: 'site@bwat.com' },
    update: {},
    create: {
      name: 'Site Manager BWAT',
      email: 'site@bwat.com',
      role: 'SITE_MANAGER',
    },
  });

  // Simpan laporan ke database
  await prisma.dailyReport.create({
    data: {
      projectId,
      weather,
      notes,
      reporterId: defaultUser.id, // ID pengguna yang membuat laporan
      status: 'PENDING',          // Menunggu persetujuan (approval)
    },
  });

  // Refresh dan kembali ke halaman laporan
  revalidatePath('/dashboard/reports');
  redirect('/dashboard/reports');
}