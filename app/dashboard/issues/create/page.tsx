import { createIssue } from '@/app/actions/issue';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function CreateIssuePage() {
  const projects = await prisma.project.findMany({
    where: { status: 'ON_PROGRESS' },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Laporkan Kendala Baru</h1>
        <p className="text-gray-500">Beri tahu tim tentang masalah yang menghambat jalannya proyek.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form action={createIssue} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Proyek Terkait</label>
            <select 
              name="projectId" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="">-- Pilih Proyek --</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Kendala</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Contoh: Alat berat ekskavator mogok"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tingkat Keparahan (Severity)</label>
            <select 
              name="severity" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="LOW">Rendah (LOW) - Tidak terlalu mengganggu</option>
              <option value="MEDIUM">Sedang (MEDIUM) - Menghambat sebagian pekerjaan</option>
              <option value="HIGH">Tinggi (HIGH) - Pekerjaan utama terhenti</option>
              <option value="CRITICAL">Kritis (CRITICAL) - Proyek harus dihentikan total</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea 
              name="description" 
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              placeholder="Jelaskan detail masalahnya secara rinci..."
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t">
            <Link 
              href="/dashboard/issues" 
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Batal
            </Link>
            <button 
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Simpan & Laporkan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}