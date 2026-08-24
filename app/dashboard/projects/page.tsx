export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus, CheckCircle, Save } from 'lucide-react';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export default async function ProjectsPage() {
  const role = cookies().get('userRole')?.value;
  
  // Tarik data proyek dari database, urutkan dari yang terbaru
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Server Action untuk mengupdate persentase progress
  async function updateProgress(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const progressVal = parseInt(formData.get('progress') as string) || 0;
    
    // Batasi nilai antara 0 sampai 100
    const safeProgress = Math.min(100, Math.max(0, progressVal));

    await prisma.project.update({
      where: { id },
      data: { progress: safeProgress }
    });
    
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard'); // Agar grafik di dashboard ikut terupdate
  }

  // Server Action untuk menandai proyek selesai
  async function completeProject(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    
    await prisma.project.update({
      where: { id },
      data: { 
        status: 'COMPLETED',
        progress: 100 // Otomatis set 100% jika diselesaikan
      }
    });
    
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard');
  }

  return (
    <div className="space-y-6">
      {/* HEADER RESPONSIF */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-sm sm:text-base text-gray-500">Kelola semua proyek konstruksi dan perbarui persentase progres.</p>
        </div>
        
        {role === 'SITE_MANAGER' && (
          <Link 
            href="/dashboard/projects/create" 
            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition flex items-center justify-center space-x-2 font-medium text-sm sm:text-base w-full sm:w-auto shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Proyek</span>
          </Link>
        )}
      </div>

      {/* TABEL PROYEK */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Nama Proyek</th>
                <th className="p-4 font-semibold">Lokasi</th>
                <th className="p-4 font-semibold">Tanggal Mulai</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Progres (%)</th>
                
                {role === 'OWNER' && (
                  <th className="p-4 font-semibold text-center">Aksi (PM)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={role === 'OWNER' ? 6 : 5} className="p-8 text-center text-gray-500 text-sm">
                    Belum ada proyek. Silakan tambah proyek baru.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                    <td className="p-4 font-medium text-gray-900">{project.title}</td>
                    <td className="p-4 text-gray-600">{project.location}</td>
                    <td className="p-4 text-gray-600">
                      {project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    
                    {/* Badge Status */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${
                        project.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Kolom Angka Progres */}
                    <td className="p-4 font-semibold text-gray-700">
                      {project.progress}%
                    </td>
                    
                    {/* Kolom Aksi Khusus Project Manager */}
                    {role === 'OWNER' && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          
                          {/* Form Update Angka Progress */}
                          <form action={updateProgress} className="flex items-center gap-1">
                            <input type="hidden" name="id" value={project.id} />
                            <input 
                              type="number" 
                              name="progress" 
                              defaultValue={project.progress}
                              min="0"
                              max="100"
                              className="w-16 p-1.5 border border-gray-300 rounded-lg text-center text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                              required
                            />
                            <button 
                              type="submit" 
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 p-1.5 rounded-lg transition"
                              title="Simpan Progres"
                            >
                              <Save size={16} />
                            </button>
                          </form>

                          {/* Tombol Selesaikan */}
                          {project.status !== 'COMPLETED' && (
                            <form action={completeProject}>
                              <input type="hidden" name="id" value={project.id} />
                              <button 
                                type="submit" 
                                className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition flex items-center gap-1"
                                title="Tandai Proyek Selesai (100%)"
                              >
                                <CheckCircle size={14} />
                                Selesai
                              </button>
                            </form>
                          )}

                        </div>
                      </td>
                    )}
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}