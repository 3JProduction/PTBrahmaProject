import Link from 'next/link';
import { Plus, CheckCircle, Edit3 } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const role = cookies().get('userRole')?.value;
  const isPM = role === 'PROJECT_MANAGER' || role === 'OWNER';
  const isSiteManager = role === 'SITE_MANAGER';

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Server action untuk mengubah status proyek menjadi COMPLETED
  async function completeProject(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.project.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
    revalidatePath('/dashboard/projects');
  }

  return (
    <div className="space-y-6">
      {/* HEADER RESPONSIF */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-sm sm:text-base text-gray-500">Kelola semua proyek konstruksi dan perbarui persentase progres.</p>
        </div>
        {isSiteManager && (
          <Link 
            href="/dashboard/projects/create" 
            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition flex items-center justify-center space-x-2 font-medium text-sm sm:text-base w-full sm:w-auto shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Proyek</span>
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Belum ada proyek. Silakan tambah proyek baru.
        </div>
      ) : (
        <>
          {/* 📱 TAMPILAN MOBILE: Model Card (List Kebawah) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{project.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap shrink-0 ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex flex-col space-y-1.5 text-sm text-gray-600 border-t border-gray-100 pt-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-20 shrink-0">Lokasi:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-20 shrink-0">Tanggal:</span>
                    <span>{project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Tombol Aksi / Progres untuk PM / Site Manager */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 mt-2">
                  <Link 
                    href={`/dashboard/projects/${project.id}`} 
                    className="flex-1 flex justify-center items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition font-medium text-xs"
                  >
                    <Edit3 size={16} />
                    <span>Update Progres</span>
                  </Link>

                  {isPM && project.status !== 'COMPLETED' && (
                    <form action={completeProject} className="flex-1 flex">
                      <input type="hidden" name="id" value={project.id} />
                      <button 
                        type="submit" 
                        className="w-full flex justify-center items-center gap-1 text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition font-medium text-xs"
                      >
                        <CheckCircle size={16} />
                        <span>Selesaikan</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 💻 TAMPILAN DESKTOP: Model Tabel Asli */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="p-4 font-semibold">Nama Proyek</th>
                    <th className="p-4 font-semibold">Lokasi</th>
                    <th className="p-4 font-semibold">Tanggal Mulai</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi / Progres</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                      <td className="p-4 font-medium text-gray-900">{project.title}</td>
                      <td className="p-4 text-gray-600">{project.location}</td>
                      <td className="p-4 text-gray-600">
                        {project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${
                          project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/dashboard/projects/${project.id}`} 
                            className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-blue-200 text-xs font-semibold"
                          >
                            <Edit3 size={15} />
                            <span>Update Progres</span>
                          </Link>

                          {isPM && project.status !== 'COMPLETED' && (
                            <form action={completeProject}>
                              <input type="hidden" name="id" value={project.id} />
                              <button 
                                type="submit" 
                                className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-green-200 text-xs font-semibold"
                                title="Tandai Proyek Selesai"
                              >
                                <CheckCircle size={15} />
                                <span>Selesaikan</span>
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}