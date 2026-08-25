export const dynamic = 'force-dynamic';

import { Plus, CheckCircle, Eye, AlertTriangle } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Kamus penerjemah level keparahan
const severityMap: Record<string, string> = {
  LOW: 'RENDAH',
  MEDIUM: 'SEDANG',
  HIGH: 'TINGGI',
  CRITICAL: 'SANGAT TINGGI',
};

export default async function IssuesPage() {
  const role = cookies().get('userRole')?.value;
  const isPM = role === 'PROJECT_MANAGER' || role === 'OWNER';

  // Tarik data kendala beserta nama proyek dan pelapornya
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project: true,
      reporter: true,
    },
  });

  async function resolveIssue(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;

    await prisma.issue.update({
      where: { id },
      data: { isResolved: true }
    });
    revalidatePath('/dashboard/issues');
  }

  return (
    <div className="space-y-6">
      {/* HEADER RESPONSIF */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={28} />
            Laporan Kendala
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Pantau dan selesaikan kendala yang terjadi di lapangan.</p>
        </div>
        {role === 'SITE_MANAGER' && (
          <Link 
            href="/dashboard/issues/create" 
            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition flex items-center justify-center space-x-2 font-medium text-sm sm:text-base w-full sm:w-auto shadow-sm"
          >
            <Plus size={20} />
            <span>Laporkan Kendala</span>
          </Link>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Belum ada kendala yang dilaporkan.
        </div>
      ) : (
        <>
          {/* 📱 TAMPILAN MOBILE: Model Card */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{issue.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap shrink-0 ${
                    issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                    issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 
                    issue.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {severityMap[issue.severity] || issue.severity}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Proyek:</span>
                    <span className="text-blue-700 font-medium">{issue.project.title}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Pelapor:</span>
                    <span>{issue.reporter.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                      issue.isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {issue.isResolved ? 'TERSELESAIKAN' : 'BELUM SELESAI'}
                    </span>
                  </div>
                </div>

                {/* Kolom Aksi Khusus PM (Mobile) */}
                {isPM && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-6 mt-1">
                    <Link 
                      href={`/dashboard/issues/${issue.id}`} 
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                    >
                      <Eye size={18} />
                      <span>Detail</span>
                    </Link>
                    
                    {!issue.isResolved && (
                      <form action={resolveIssue}>
                        <input type="hidden" name="id" value={issue.id} />
                        <button 
                          type="submit" 
                          className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition"
                        >
                          <CheckCircle size={18} />
                          <span>Selesai</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 💻 TAMPILAN DESKTOP: Model Tabel Asli */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Judul Kendala</th>
                  <th className="p-4 font-semibold">Proyek</th>
                  <th className="p-4 font-semibold">Keparahan</th>
                  <th className="p-4 font-semibold">Pelapor</th>
                  <th className="p-4 font-semibold">Status</th>
                  {isPM && (
                    <th className="p-4 font-semibold text-center">Penyelesaian</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                    <td className="p-4 font-medium text-gray-900">{issue.title}</td>
                    <td className="p-4 text-blue-700 font-medium">{issue.project.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${
                        issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                        issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 
                        issue.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {severityMap[issue.severity] || issue.severity}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{issue.reporter.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${
                        issue.isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {issue.isResolved ? 'TERSELESAIKAN' : 'BELUM SELESAI'}
                      </span>
                    </td>
                    
                    {/* Kolom Aksi Khusus PM (Desktop) */}
                    {isPM && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-6">
                          <Link 
                            href={`/dashboard/issues/${issue.id}`} 
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                          >
                            <Eye size={18} />
                            <span>Detail</span>
                          </Link>
                          
                          {!issue.isResolved && (
                            <form action={resolveIssue}>
                              <input type="hidden" name="id" value={issue.id} />
                              <button 
                                type="submit" 
                                className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition"
                              >
                                <CheckCircle size={18} />
                                <span>Selesai</span>
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