export const dynamic = 'force-dynamic';

import { Plus, CheckCircle, Eye, AlertTriangle } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={28} />
            Issue Tracking
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={isPM ? 6 : 5} className="p-8 text-center text-gray-500 text-sm">
                    Belum ada kendala yang dilaporkan.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
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
                    
                    {/* Kolom Aksi Khusus PM */}
                    {isPM && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/dashboard/issues/${issue.id}`} 
                            className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-blue-200"
                            title="Lihat Detail Issue"
                          >
                            <Eye size={16} />
                            <span className="text-xs font-semibold">Detail</span>
                          </Link>
                          
                          {!issue.isResolved && (
                            <form action={resolveIssue}>
                              <input type="hidden" name="id" value={issue.id} />
                              <button 
                                type="submit" 
                                className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-green-200"
                                title="ACC Selesai Cepat"
                              >
                                <CheckCircle size={16} />
                                <span className="text-xs font-semibold">Selesai</span>
                              </button>
                            </form>
                          )}
                        </div>
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