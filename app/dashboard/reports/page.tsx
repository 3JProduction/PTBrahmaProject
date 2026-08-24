export const dynamic = 'force-dynamic';

import { Plus, Edit, CheckCircle } from 'lucide-react'; 
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { cookies } from 'next/headers'; // FIX 1: Import cookies ditambahkan
import prisma from '@/lib/prisma';

export default async function ReportsPage() {
  const role = cookies().get('userRole')?.value;
  
  // Ambil data laporan sekaligus menarik nama proyek dan nama pelapor
  const reports = await prisma.dailyReport.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project: true,
      reporter: true,
    },
  });

  async function accReport(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    
    // FIX 4: Disamakan menjadi dailyReport sesuai nama model findMany
    await prisma.dailyReport.update({ 
      where: { id },
      data: { status: 'APPROVED' }
    });
    revalidatePath('/dashboard/reports');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Laporan Harian</h1>
          <p className="text-sm sm:text-base text-gray-500">Daftar laporan progres harian dari lokasi proyek.</p>
        </div>
        {role === 'SITE_MANAGER' && (
          <Link 
            href="/dashboard/reports/create" 
            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition flex items-center justify-center space-x-2 font-medium text-sm sm:text-base w-full sm:w-auto shadow-sm"
          >
            <Plus size={20} />
            <span>Buat Laporan</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Nama Proyek</th>
                <th className="p-4 font-semibold">Cuaca</th>
                <th className="p-4 font-semibold">Pelapor</th>
                <th className="p-4 font-semibold">Status</th>
                {role === 'OWNER' && (
                  <th className="p-4 font-semibold text-center">Aksi (PM)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">
                    Belum ada laporan harian.
                  </td>
                </tr>
              ) : (
                // FIX 3: Menghilangkan kurawal {} ekstra di sekitar reports.map
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                    <td className="p-4 font-medium text-gray-900">
                      {report.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-blue-700 font-medium">{report.project.title}</td>
                    <td className="p-4 text-gray-600">{report.weather}</td>
                    <td className="p-4 text-gray-600">{report.reporter.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block ${
                        report.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        report.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    
                    {role === 'OWNER' && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link 
                            href={`/dashboard/reports/${report.id}/edit`} 
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                            title="Edit Laporan"
                          >
                            <Edit size={18} />
                          </Link>
                          
                          {report.status !== 'APPROVED' && (
                            <form action={accReport}>
                              <input type="hidden" name="id" value={report.id} />
                              <button 
                                type="submit" 
                                className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition"
                                title="ACC / Setujui Laporan"
                              >
                                <CheckCircle size={18} />
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