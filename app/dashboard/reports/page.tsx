import Link from 'next/link';
import { Plus } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function ReportsPage() {
  // Ambil data laporan sekaligus menarik nama proyek dan nama pelapor (relasi tabel)
  const reports = await prisma.dailyReport.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project: true,
      reporter: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Harian</h1>
          <p className="text-gray-500">Daftar laporan progres harian dari lokasi proyek.</p>
        </div>
        <Link 
          href="/dashboard/reports/create" 
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center space-x-2 font-medium"
        >
          <Plus size={20} />
          <span>Buat Laporan</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold">Nama Proyek</th>
              <th className="p-4 font-semibold">Cuaca</th>
              <th className="p-4 font-semibold">Pelapor</th>
              <th className="p-4 font-semibold">Status Approval</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Belum ada laporan harian.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">
                    {report.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-blue-700 font-medium">{report.project.title}</td>
                  <td className="p-4 text-gray-600">{report.weather}</td>
                  <td className="p-4 text-gray-600">{report.reporter.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      report.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      report.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
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