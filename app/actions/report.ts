'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDailyReport(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const weather = formData.get('weather') as string;
  const notes = formData.get('notes') as string;

  // Karena kita belum punya fitur registrasi, kita buat/pastikan 
  // akun "Admin" default sudah ada di database untuk dijadikan pembuat laporan (reporter)
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@bwc.com' },
    update: {},
    create: {
      name: 'Admin BWC',
      email: 'admin@bwc.com',
      role: 'ADMIN_KANTOR',
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