export const dynamic = 'force-dynamic'; // Tambahkan baris ini

import prisma from '@/lib/prisma';
import { Briefcase, FileText, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardHome() {
  // 1. Mengambil statistik dari database secara paralel
  const [activeProjects, pendingReports, unresolvedIssues] = await Promise.all([
    prisma.project.count({ where: { status: 'ON_PROGRESS' } }),
    prisma.dailyReport.count({ where: { status: 'PENDING' } }),
    prisma.issue.count({ where: { isResolved: false } })
  ]);

  // 2. Mengambil 3 proyek terbaru untuk ditampilkan di beranda
  const recentProjects = await prisma.project.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Bagian Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang di Dashboard BWC</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas dan status proyek konstruksi Anda hari ini.</p>
      </div>

      {/* Bagian Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Proyek Aktif */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
            <Briefcase size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Proyek Aktif</p>
            <h2 className="text-2xl font-bold text-gray-900">{activeProjects}</h2>
          </div>
        </div>

        {/* Kartu Laporan Menunggu */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Laporan Menunggu (Pending)</p>
            <h2 className="text-2xl font-bold text-gray-900">{pendingReports}</h2>
          </div>
        </div>

        {/* Kartu Kendala Aktif */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kendala Belum Selesai</p>
            <h2 className="text-2xl font-bold text-gray-900">{unresolvedIssues}</h2>
          </div>
        </div>
      </div>

      {/* Bagian Proyek Terbaru */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Proyek Terbaru
          </h2>
          <Link href="/dashboard/projects" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentProjects.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Belum ada proyek yang ditambahkan.</div>
          ) : (
            recentProjects.map(project => (
              <div key={project.id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{project.location}</p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    {project.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    Mulai: {project.startDate.toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}