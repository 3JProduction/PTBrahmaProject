export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Briefcase, FileText, AlertTriangle, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  // 1. Tarik semua data statistik dari database
  const activeProjectsCount = await prisma.project.count({
    where: { status: 'ON_PROGRESS' }
  });

  // (BARU) Tarik data jumlah proyek yang sudah selesai
  const completedProjectsCount = await prisma.project.count({
    where: { status: 'COMPLETED' }
  });

  // Asumsi status default saat laporan dibuat adalah 'PENDING'
  const pendingReportsCount = await prisma.dailyReport.count({
    where: { status: 'PENDING' }
  });

  const unresolvedIssuesCount = await prisma.issue.count({
    where: { isResolved: false }
  });

  // 2. Tarik 3 data proyek terbaru untuk ditampilkan di list bawah
  const recentProjects = await prisma.project.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang di Dashboard BWAT</h1>
        <p className="text-gray-500">Ringkasan aktivitas dan status proyek konstruksi Anda hari ini.</p>
      </div>

      {/* KARTU STATISTIK (Diubah menjadi grid-cols-4 pada layar besar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Kartu 1: Proyek Aktif */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase className="text-blue-600" size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Proyek Aktif</p>
            <h3 className="text-3xl font-bold text-gray-900">{activeProjectsCount}</h3>
          </div>
        </div>

        {/* Kartu 2: Laporan Pending */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="text-yellow-600" size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Laporan Menunggu (Pending)</p>
            <h3 className="text-3xl font-bold text-gray-900">{pendingReportsCount}</h3>
          </div>
        </div>

        {/* Kartu 3: Kendala Belum Selesai */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-red-600" size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Kendala Belum Selesai</p>
            <h3 className="text-3xl font-bold text-gray-900">{unresolvedIssuesCount}</h3>
          </div>
        </div>

        {/* Kartu 4: Proyek Selesai (BARU) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-green-600" size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Proyek Selesai</p>
            <h3 className="text-3xl font-bold text-gray-900">{completedProjectsCount}</h3>
          </div>
        </div>

      </div>

      {/* DAFTAR PROYEK TERBARU */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Proyek Terbaru
          </h2>
          <Link href="/dashboard/projects" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentProjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada data proyek.
            </div>
          ) : (
            recentProjects.map(project => (
              <div key={project.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{project.title}</h3>
                  <p className="text-gray-500 text-sm">{project.location}</p>
                </div>
                <div className="sm:text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block mb-2 sm:mb-1 ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <p className="text-gray-400 text-xs">
                    Mulai: {project.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}
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