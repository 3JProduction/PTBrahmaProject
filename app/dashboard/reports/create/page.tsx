import { createDailyReport } from '@/app/actions/report';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function CreateReportPage() {
  // Ambil daftar proyek aktif dari database untuk ditampilkan di pilihan dropdown
  const projects = await prisma.project.findMany({
    where: { status: 'ON_PROGRESS' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buat Laporan Harian</h1>
        <p className="text-gray-500">Laporkan kondisi dan progres pekerjaan hari ini.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form action={createDailyReport} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Proyek</label>
            <select 
              name="projectId" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="">-- Pilih Proyek yang Sedang Berjalan --</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kondisi Cuaca Hari Ini</label>
            <select 
              name="weather" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="Cerah">Cerah ☀️</option>
              <option value="Berawan">Berawan ⛅</option>
              <option value="Hujan Ringan">Hujan Ringan 🌧️</option>
              <option value="Hujan Lebat">Hujan Lebat ⛈️</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan Pekerjaan / Kendala (Opsional)</label>
            <textarea 
              name="notes" 
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              placeholder="Jelaskan progres hari ini atau kendala yang terjadi..."
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t">
            <Link 
              href="/dashboard/reports" 
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Batal
            </Link>
            <button 
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Kirim Laporan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}