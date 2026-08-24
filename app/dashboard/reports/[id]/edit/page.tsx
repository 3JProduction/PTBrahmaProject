import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default async function EditReportPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Tarik data laporan yang mau diedit beserta nama proyeknya
  const report = await prisma.dailyReport.findUnique({
    where: { id },
    include: { project: true }
  });

  // Jika laporan tidak ditemukan di database
  if (!report) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Tidak Ditemukan</h1>
        <Link href="/dashboard/reports" className="text-blue-600 hover:underline mt-4 inline-block">
          Kembali ke Daftar Laporan
        </Link>
      </div>
    );
  }

  // 2. Fungsi Server Action untuk menyimpan perubahan ke database
  async function updateReport(formData: FormData) {
    'use server';
    
    const weather = formData.get('weather') as string;
    // const content = formData.get('content') as string; // Hapus komentar ini jika Anda mau mengedit isi laporan

    await prisma.dailyReport.update({
      where: { id },
      data: { 
        weather,
        // content, // Hapus komentar ini juga menyesuaikan field di schema.prisma Anda
      }
    });

    revalidatePath('/dashboard/reports');
    redirect('/dashboard/reports');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Laporan Harian</h1>
          <p className="text-gray-500">Proyek: <span className="font-semibold">{report.project?.title}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form action={updateReport} className="space-y-5">
          
          {/* Input Edit Cuaca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuaca Saat Ini</label>
            <select 
              name="weather" 
              defaultValue={report.weather}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            >
              <option value="Cerah">Cerah</option>
              <option value="Berawan">Berawan</option>
              <option value="Hujan Ringan">Hujan Ringan</option>
              <option value="Hujan Deras">Hujan Deras</option>
            </select>
          </div>

          {/* CATATAN: Jika di database Anda ada kolom catatan/progres, Anda bisa menambahkan input teks di sini */}
          {/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Progres Lapangan</label>
            <textarea 
              name="content" 
              defaultValue={report.content} 
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            ></textarea>
          </div> 
          */}

          <div className="pt-4 flex gap-3">
            <Link 
              href="/dashboard/reports"
              className="flex-1 py-3 text-center bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Batal
            </Link>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Save size={20} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}