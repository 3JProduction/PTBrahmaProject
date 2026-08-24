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
      {/* HEADER RESPONSIF: Di HP ditumpuk ke bawah, di Laptop sejajar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-sm sm:text-base text-gray-500">Kelola semua proyek konstruksi yang sedang berjalan.</p>
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

      {/* TABEL DENGAN SCROLL HORIZONTAL DI HP */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Nama Proyek</th>
                <th className="p-4 font-semibold">Lokasi</th>
                <th className="p-4 font-semibold">Tanggal Mulai</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 text-sm">
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
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block">
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
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