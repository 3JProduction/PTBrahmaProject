import { CheckCircle, Save } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const role = cookies().get('userRole')?.value;
  const isPM = role === 'PROJECT_MANAGER' || role === 'OWNER';

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Server Action untuk langsung memperbarui progres dan status proyek di tempat
  async function updateProgress(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const progressVal = parseInt(formData.get('progress') as string) || 0;

    // Jika progres mencapai 100%, otomatis ubah status jadi COMPLETED
    const newStatus = progressVal >= 100 ? 'COMPLETED' : 'ON_PROGRESS';

    await prisma.project.update({
      where: { id },
      data: { 
        progress: progressVal,
        status: newStatus
      }
    });
    revalidatePath('/dashboard/projects');
  }

  // Server Action untuk menyelesaikan proyek secara instan
  async function completeProject(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.project.update({
      where: { id },
      data: { status: 'COMPLETED', progress: 100 }
    });
    revalidatePath('/dashboard/projects');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-sm sm:text-base text-gray-500">Kelola semua proyek konstruksi dan perbarui persentase progres.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Belum ada proyek.
        </div>
      ) : (
        <>
          {/* 📱 TAMPILAN MOBILE: Card */}
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

                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Lokasi:</strong> {project.location}</p>
                  <p><strong>Mulai:</strong> {project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p><strong>Progres Saat Ini:</strong> <span className="font-bold text-blue-700">{project.progress ?? 0}%</span></p>
                </div>

                {/* Form Update Progres Langsung di Card HP */}
                <form action={updateProgress} className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <input type="hidden" name="id" value={project.id} />
                  <input 
                    type="number" 
                    name="progress" 
                    defaultValue={project.progress ?? 0} 
                    min={0} 
                    max={100} 
                    className="w-20 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-center font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-sm font-bold text-gray-500">%</span>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-800 transition flex items-center justify-center gap-1"
                  >
                    <Save size={14} />
                    <span>Simpan</span>
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* 💻 TAMPILAN DESKTOP: Tabel dengan Input Progres Langsung */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="p-4 font-semibold">Nama Proyek</th>
                    <th className="p-4 font-semibold">Lokasi</th>
                    <th className="p-4 font-semibold">Tanggal Mulai</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Progres (%)</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
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

                      {/* Kolom Input Angka Progres Langsung */}
                      <td className="p-4 text-center">
                        <form action={updateProgress} className="flex items-center justify-center gap-1.5">
                          <input type="hidden" name="id" value={project.id} />
                          <input 
                            type="number" 
                            name="progress" 
                            defaultValue={project.progress ?? 0} 
                            min={0} 
                            max={100} 
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <span className="font-bold text-gray-500">%</span>
                          <button 
                            type="submit" 
                            className="bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white p-1.5 rounded-lg transition"
                            title="Simpan Progres"
                          >
                            <Save size={16} />
                          </button>
                        </form>
                      </td>

                      {/* Tombol Selesaikan Instan */}
                      <td className="p-4 text-center">
                        {project.status !== 'COMPLETED' ? (
                          <form action={completeProject}>
                            <input type="hidden" name="id" value={project.id} />
                            <button 
                              type="submit" 
                              className="inline-flex items-center gap-1 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition font-semibold text-xs border border-transparent hover:border-green-200"
                              title="Tandai Selesai 100%"
                            >
                              <CheckCircle size={15} />
                              <span>Selesaikan</span>
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Selesai</span>
                        )}
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