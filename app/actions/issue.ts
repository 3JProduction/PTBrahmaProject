'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createIssue(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const severity = formData.get('severity') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Tarik data user default (sebagai simulasi pelapor)
  const defaultUser = await prisma.user.findUnique({
    where: { email: 'admin@bwc.com' },
  });

  if (!defaultUser) throw new Error("User tidak ditemukan");

  // Simpan laporan kendala ke database
  await prisma.issue.create({
    data: {
      projectId,
      title,
      description,
      severity,
      reporterId: defaultUser.id,
      isResolved: false,
    },
  });

  // Refresh halaman dan kembali ke daftar issue
  revalidatePath('/dashboard/issues');
  redirect('/dashboard/issues');
}