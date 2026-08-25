import Link from 'next/link';
import { Plus, Save, CheckCircle, RefreshCw } from 'lucide-react';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const role = cookies().get('userRole')?.value;
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-sm sm:text-base text-gray-500">Kelola semua proyek konstruksi dan pantau persentase progress.</p>
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

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Belum ada proyek. Silakan tambah proyek baru.
        </div>
      ) : (
        <>
          {/* 📱 TAMPILAN MOBILE: Model Card */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{project.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1.5 text-sm text-gray-600 border-t border-gray-100 pt-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-28 shrink-0">Lokasi:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-28 shrink-0">Mulai:</span>
                    <span>{project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold text-gray-700 w-28 shrink-0">Progress Saat Ini:</span>
                    <span className="font-bold text-blue-700">{project.progress ?? 0}%</span>
                  </div>
                </div>

                {/* Form Update Progres & Status HANYA UNTUK PROJECT MANAGER (OWNER) */}
                {role === 'OWNER' && (
                  <div className="pt-3 border-t border-gray-100 flex flex-col space-y-3">
                    <form action={async (formData) => {
                      'use server';
                      const newProgress = Number(formData.get('progress'));
                      await prisma.project.update({
                        where: { id: project.id },
                        data: { 
                          progress: newProgress,
                          status: newProgress === 100 ? 'COMPLETED' : project.status 
                        }
                      });
                    }} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="number" 
                          name="progress" 
                          defaultValue={project.progress ?? 0} 
                          min="0" 
                          max="100"
                          className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-semibold text-gray-600">%</span>
                      </div>
                      <button 
                        type="submit" 
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                      >
                        <Save size={18} />
                        <span>Simpan</span>
                      </button>
                    </form>

                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      {project.status !== 'COMPLETED' ? (
                        <form action={async () => {
                          'use server';
                          await prisma.project.update({
                            where: { id: project.id },
                            data: { status: 'COMPLETED', progress: 100 }
                          });
                        }}>
                          <button 
                            type="submit"
                            className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition"
                          >
                            <CheckCircle size={18} />
                            <span>Selesaikan Proyek</span>
                          </button>
                        </form>
                      ) : (
                        <form action={async () => {
                          'use server';
                          await prisma.project.update({
                            where: { id: project.id },
                            data: { status: 'ON_PROGRESS' }
                          });
                        }}>
                          <button 
                            type="submit"
                            className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 text-sm font-medium transition"
                          >
                            <RefreshCw size={18} />
                            <span>Ubah ke On Progress</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 💻 TAMPILAN DESKTOP: Model Tabel */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Nama Proyek</th>
                  <th className="p-4 font-semibold">Lokasi</th>
                  <th className="p-4 font-semibold">Tanggal Mulai</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Progress</th>
                  {role === 'OWNER' && <th className="p-4 font-semibold text-center">Update</th>}
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
                    <td className="p-4">
                      {role === 'OWNER' ? (
                        <form action={async (formData) => {
                          'use server';
                          const newProgress = Number(formData.get('progress'));
                          await prisma.project.update({
                            where: { id: project.id },
                            data: { 
                              progress: newProgress,
                              status: newProgress === 100 ? 'COMPLETED' : project.status 
                            }
                          });
                        }} className="flex items-center gap-2">
                          <input 
                            type="number" 
                            name="progress" 
                            defaultValue={project.progress ?? 0} 
                            min="0" 
                            max="100"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center" 
                          />
                          <span className="font-semibold">%</span>
                          <button 
                            type="submit" 
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition ml-1"
                          >
                            <Save size={18} />
                            <span>Simpan</span>
                          </button>
                        </form>
                      ) : (
                        <span className="font-bold text-blue-700">{project.progress ?? 0}%</span>
                      )}
                    </td>
                    {role === 'OWNER' && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          {project.status !== 'COMPLETED' ? (
                            <form action={async () => {
                              'use server';
                              await prisma.project.update({
                                where: { id: project.id },
                                data: { status: 'COMPLETED', progress: 100 }
                              });
                            }}>
                              <button 
                                type="submit"
                                className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition"
                              >
                                <CheckCircle size={18} />
                                <span>Selesaikan Proyek</span>
                              </button>
                            </form>
                          ) : (
                            <form action={async () => {
                              'use server';
                              await prisma.project.update({
                                where: { id: project.id },
                                data: { status: 'ON_PROGRESS' }
                              });
                            }}>
                              <button 
                                type="submit"
                                className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 text-sm font-medium transition"
                              >
                                <RefreshCw size={18} />
                                <span>Ubah ke On Progress</span>
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}