import Link from 'next/link';
import { Plus } from 'lucide-react';
import prisma from '@/lib/prisma';

// Ini adalah Server Component, bisa langsung hit database
export default async function ProjectsPage() {
  // Tarik data proyek dari database, urutkan dari yang terbaru
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Proyek</h1>
          <p className="text-gray-500">Kelola semua proyek konstruksi yang sedang berjalan.</p>
        </div>
        <Link 
          href="/dashboard/projects/create" 
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center space-x-2 font-medium"
        >
          <Plus size={20} />
          <span>Tambah Proyek</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Belum ada proyek. Silakan tambah proyek baru.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{project.title}</td>
                  <td className="p-4 text-gray-600">{project.location}</td>
                  <td className="p-4 text-gray-600">
                    {project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
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
  );
}