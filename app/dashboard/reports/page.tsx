export const dynamic = 'force-dynamic';

import { Plus, CheckCircle, Eye } from 'lucide-react'; 
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export default async function ReportsPage() {
  const role = cookies().get('userRole')?.value;
  const isPM = role === 'PROJECT_MANAGER' || role === 'OWNER';
  
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
    
    await prisma.dailyReport.update({ 
      where: { id },
      data: { status: 'APPROVED' }
    });
    revalidatePath('/dashboard/reports');
  }

  return (
    <div className="space-y-6">
      {/* HEADER RESPONSIF */}
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

      {reports.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Belum ada laporan harian.
        </div>
      ) : (
        <>
          {/* 📱 TAMPILAN MOBILE: Model Card */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400">
                      {report.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <h3 className="font-bold text-blue-700 text-base leading-tight mt-0.5">{report.project.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap shrink-0 ${
                    report.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    report.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <div className="flex flex-col space-y-1.5 text-sm text-gray-600 border-t border-gray-100 pt-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Cuaca:</span>
                    <span>{report.weather}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 w-16 shrink-0">Pelapor:</span>
                    <span>{report.reporter.name}</span>
                  </div>
                </div>

                {/* Tombol Aksi Khusus PM (Mobile) */}
                {isPM && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-6 mt-1">
                    <Link 
                      href={`/dashboard/reports/${report.id}`} 
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                    >
                      <Eye size={18} />
                      <span>Detail</span>
                    </Link>
                    
                    {report.status !== 'APPROVED' && (
                      <form action={accReport}>
                        <input type="hidden" name="id" value={report.id} />
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

          {/* 💻 TAMPILAN DESKTOP: Model Tabel */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="p-4 font-semibold">Tanggal</th>
                    <th className="p-4 font-semibold">Nama Proyek</th>
                    <th className="p-4 font-semibold">Cuaca</th>
                    <th className="p-4 font-semibold">Pelapor</th>
                    <th className="p-4 font-semibold">Status</th>
                    {isPM && <th className="p-4 font-semibold text-center">Update</th>}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
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
                      
                      {/* Tombol Aksi Khusus PM (Desktop) */}
                      {isPM && (
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-6">
                            <Link 
                              href={`/dashboard/reports/${report.id}`} 
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                            >
                              <Eye size={18} />
                              <span>Detail</span>
                            </Link>
                            
                            {report.status !== 'APPROVED' && (
                              <form action={accReport}>
                                <input type="hidden" name="id" value={report.id} />
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
          </div>
        </>
      )}
    </div>
  );
}