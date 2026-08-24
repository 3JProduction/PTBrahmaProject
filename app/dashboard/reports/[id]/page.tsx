export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, FileText, User, Calendar, MapPin, Cloud } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  // Ambil detail laporan beserta nama proyek dan pelapornya
  const report = await prisma.dailyReport.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      reporter: true,
    }
  });

  // Jika ID laporan tidak ditemukan
  if (!report) notFound();

  // Fungsi Server Action untuk PM menyetujui laporan
  async function approveReport() {
    'use server';
    await prisma.dailyReport.update({
      where: { id: params.id },
      data: { status: 'APPROVED' }
    });
    revalidatePath('/dashboard/reports');
    redirect('/dashboard/reports'); // Kembali ke tabel laporan setelah sukses
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Laporan Harian</h1>
            <p className="text-gray-500 text-sm">Review detail pekerjaan dan progres lapangan.</p>
          </div>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
          report.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {report.status}
        </span>
      </div>

      {/* Kartu Detail */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Info Atas (Grid) */}
        <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Proyek</p>
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <MapPin size={16} className="text-blue-600" />
              {report.project.title}
            </div>
            <p className="text-sm text-gray-500 ml-6">{report.project.location}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Pelapor</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <User size={16} className="text-blue-600" />
              {report.reporter.name}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tanggal Laporan</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Calendar size={16} className="text-blue-600" />
              {report.date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Kondisi Cuaca</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Cloud size={16} className="text-blue-600" />
              {report.weather}
            </div>
          </div>
        </div>

        {/* Kotak Catatan (Teks Panjang) */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
            <FileText size={18} className="text-blue-600" />
            Catatan Progres Lapangan
          </h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed min-h-[150px]">
            {report.notes || 'Tidak ada catatan progres yang dilampirkan oleh Site Manager.'}
          </div>
        </div>

        {/* Tombol Setujui Khusus PM */}
        {report.status !== 'APPROVED' && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <form action={approveReport}>
              <button 
                type="submit"
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle size={20} />
                Tandai Sudah Direview & Setujui Laporan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}