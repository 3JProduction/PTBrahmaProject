import Link from 'next/link';
import { Plus } from 'lucide-react';
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
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-col space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Lokasi:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Mulai:</span>
                    <span>{project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 TAMPILAN DESKTOP: Model Tabel Asli */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Nama Proyek</th>
                  <th className="p-4 font-semibold">Lokasi</th>
                  <th className="p-4 font-semibold">Tanggal Mulai</th>
                  <th className="p-4 font-semibold">Status</th>
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
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block">
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
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