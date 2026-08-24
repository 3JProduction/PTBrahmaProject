export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { AlertTriangle, Plus, CheckSquare } from 'lucide-react';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export default async function IssuesPage() {
  const role = cookies().get('userRole')?.value;

  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project: true,
      reporter: true,
    },
  });

  // Fungsi pembantu untuk warna tingkat keparahan
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // Fungsi Server Action untuk ACC Kendala Selesai
  async function accIssue(formData: FormData) {
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={28} />
            Issue Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Pantau dan selesaikan kendala yang terjadi di lapangan.</p>
        </div>
        
        {/* Tombol lapor hanya untuk Site Manager */}
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Judul Kendala</th>
                <th className="p-4 font-semibold">Proyek</th>
                <th className="p-4 font-semibold">Keparahan</th>
                <th className="p-4 font-semibold">Pelapor</th>
                <th className="p-4 font-semibold">Status</th>
                
                {/* Kolom Aksi Khusus Project Manager */}
                {role === 'OWNER' && (
                  <th className="p-4 font-semibold text-center">Penyelesaian</th>
                )}
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">
                    Semua proyek berjalan lancar. Tidak ada kendala aktif.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                    <td className="p-4 font-medium text-gray-900">{issue.title}</td>
                    <td className="p-4 text-blue-700 font-medium">{issue.project.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
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
                    
                    {/* Tombol ACC Selesai Khusus Project Manager */}
                    {role === 'OWNER' && (
                      <td className="p-4 text-center">
                        {!issue.isResolved && (
                          <form action={accIssue}>
                            <input type="hidden" name="id" value={issue.id} />
                            <button 
                              type="submit" 
                              className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition flex items-center justify-center gap-2 mx-auto"
                              title="Tandai Isu Telah Diselesaikan"
                            >
                              <CheckSquare size={16} />
                              ACC Selesai
                            </button>
                          </form>
                        )}
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