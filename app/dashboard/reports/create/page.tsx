export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function CreateReportPage() {
  // 1. Ambil daftar proyek untuk pilihan dropdown
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 2. Ambil user pertama sebagai fallback pelapor jika belum ada sistem login spesifik
  const defaultUser = await prisma.user.findFirst();

  // Jika belum ada user sama sekali di database, berikan peringatan agar tidak error
  if (!defaultUser) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
        <h2 className="text-xl font-bold text-red-600 mb-2">Data Pengguna Belum Ada</h2>
        <p className="text-gray-600 mb-4">Silakan buat minimal 1 data User (Pelapor) di database Supabase terlebih dahulu.</p>
        <Link href="/dashboard/reports" className="text-blue-600 hover:underline font-medium">
          Kembali ke Daftar Laporan
        </Link>
      </div>
    );
  }

  // 3. Fungsi Server Action untuk menyimpan laporan baru
  async function createReport(formData: FormData) {
    'use server';
    
    const projectId = formData.get('projectId') as string;
    const weather = formData.get('weather') as string;
    const notes = formData.get('notes') as string;

    // Ambil user aktif dari cookie role atau gunakan default user
    const user = await prisma.user.findFirst(); 

    if (!projectId || !user) return;

    await prisma.dailyReport.create({
      data: {
        projectId,
        reporterId: user.id, // Menggunakan ID user yang valid dari database
        weather,
        notes,
        status: 'PENDING'
      }
    });

    revalidatePath('/dashboard/reports');
    revalidatePath('/dashboard');
    redirect('/dashboard/reports');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Laporan Harian</h1>
          <p className="text-gray-500 text-sm">Laporkan progres dan kondisi cuaca di lapangan hari ini.</p>
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
          <form action={createReport} className="space-y-5">
            
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

            {/* Pilihan Cuaca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Cuaca</label>
              <select 
                name="weather" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              >
                <option value="Cerah">Cerah</option>
                <option value="Berawan">Berawan</option>
                <option value="Hujan Ringan">Hujan Ringan</option>
                <option value="Hujan Deras">Hujan Deras</option>
              </select>
            </div>

            {/* Catatan / Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Progres Lapangan</label>
              <textarea 
                name="notes" 
                rows={4}
                placeholder="Tuliskan progres pekerjaan hari ini..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
              <Link 
                href="/dashboard/reports"
                className="flex-1 py-3 text-center bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Batal
              </Link>
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <Save size={18} />
                Kirim Laporan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}