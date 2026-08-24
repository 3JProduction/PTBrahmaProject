export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

export default async function CreateIssuePage() {
  // 1. Tarik daftar proyek untuk pilihan dropdown
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 2. Tarik user pertama sebagai fallback pelapor
  const defaultUser = await prisma.user.findFirst();

  if (!defaultUser) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
        <h2 className="text-xl font-bold text-red-600 mb-2">Data Pengguna Belum Ada</h2>
        <p className="text-gray-600 mb-4">Silakan buat minimal 1 data User di database Supabase terlebih dahulu.</p>
        <Link href="/dashboard/issues" className="text-blue-600 hover:underline font-medium">
          Kembali ke Daftar Issue
        </Link>
      </div>
    );
  }

  // 3. Fungsi Server Action untuk menyimpan kendala baru
  async function createIssue(formData: FormData) {
    'use server';
    
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const severity = formData.get('severity') as any;

    const user = await prisma.user.findFirst(); 

    if (!projectId || !user || !title) return;

    await prisma.issue.create({
      data: {
        projectId,
        reporterId: user.id,
        title,
        description,
        severity: severity || 'MEDIUM',
        isResolved: false
      }
    });

    revalidatePath('/dashboard/issues');
    revalidatePath('/dashboard');
    redirect('/dashboard/issues');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/issues" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={26} />
            Laporkan Kendala (Issue)
          </h1>
          <p className="text-gray-500 text-sm">Catat kendala atau hambatan yang terjadi di lapangan.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada data proyek aktif. Anda harus membuat proyek terlebih dahulu.</p>
            <Link 
              href="/dashboard/projects" 
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
            >
              Kelola Data Proyek
            </Link>
          </div>
        ) : (
          <form action={createIssue} className="space-y-5">
            
            {/* Pilihan Proyek */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Proyek</label>
              <select 
                name="projectId" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              >
                <option value="">-- Pilih Proyek Konstruksi --</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title} ({project.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Judul Kendala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kendala</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Contoh: Material semen terlambat / Pipa bocor"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              />
            </div>

            {/* Tingkat Keparahan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Keparahan (Severity)</label>
              <select 
                name="severity" 
                defaultValue="MEDIUM"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              >
                <option value="LOW">LOW (Rendah)</option>
                <option value="MEDIUM">MEDIUM (Sedang)</option>
                <option value="HIGH">HIGH (Tinggi)</option>
                <option value="CRITICAL">CRITICAL (Kritis)</option>
              </select>
            </div>

            {/* Deskripsi Kendala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap Kendala</label>
              <textarea 
                name="description" 
                rows={4}
                placeholder="Jelaskan detail kendala dan tindakan yang dibutuhkan..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
              <Link 
                href="/dashboard/issues"
                className="flex-1 py-3 text-center bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Batal
              </Link>
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <Save size={18} />
                Kirim Laporan Kendala
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}