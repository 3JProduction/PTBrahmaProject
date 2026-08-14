import { createProject } from '@/app/actions/project';
import Link from 'next/link';

export default function CreateProjectPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Proyek Baru</h1>
        <p className="text-gray-500">Masukkan detail informasi proyek konstruksi.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {/* Form ini akan memanggil Server Action `createProject` saat di-submit */}
        <form action={createProject} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Proyek</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="Contoh: Pembangunan Gedung A"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi Proyek</label>
            <input 
              type="text" 
              name="location" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Mulai</label>
              <input 
                type="date" 
                name="startDate" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Target Selesai</label>
              <input 
                type="date" 
                name="endDate" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Tambahan</label>
            <textarea 
              name="description" 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
              placeholder="Catatan atau ruang lingkup pekerjaan..."
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t">
            <Link 
              href="/dashboard/projects" 
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Batal
            </Link>
            <button 
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Simpan Proyek
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}