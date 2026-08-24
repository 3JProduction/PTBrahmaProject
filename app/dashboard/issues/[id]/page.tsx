export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, FileText, User, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function IssueDetailPage({ params }: { params: { id: string } }) {
  // Ambil detail kendala beserta nama proyek dan pelapornya
  const issue = await prisma.issue.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      reporter: true,
    }
  });

  if (!issue) notFound();

  // Fungsi Server Action untuk menandai kendala telah diselesaikan
  async function resolveIssue() {
    'use server';
    await prisma.issue.update({
      where: { id: params.id },
      data: { isResolved: true }
    });
    revalidatePath('/dashboard/issues');
    redirect('/dashboard/issues');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/issues" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Kendala (Issue)</h1>
            <p className="text-gray-500 text-sm">Review detail masalah lapangan dan tindak lanjuti.</p>
          </div>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
          issue.isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {issue.isResolved ? 'TERSELESAIKAN' : 'BELUM SELESAI'}
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
              {issue.project.title}
            </div>
            <p className="text-sm text-gray-500 ml-6">{issue.project.location}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Pelapor</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <User size={16} className="text-blue-600" />
              {issue.reporter.name}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tanggal Dilaporkan</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Calendar size={16} className="text-blue-600" />
              {issue.createdAt.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tingkat Keparahan</p>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <AlertTriangle size={16} className={`
                ${issue.severity === 'CRITICAL' ? 'text-red-600' : 
                  issue.severity === 'HIGH' ? 'text-orange-500' : 
                  issue.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'}
              `} />
              <span className="font-bold">{issue.severity}</span>
            </div>
          </div>
        </div>

        {/* Kotak Deskripsi */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{issue.title}</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed min-h-[120px]">
            {issue.description || 'Tidak ada deskripsi detail yang dilampirkan.'}
          </div>
        </div>

        {/* Tombol Penyelesaian Khusus PM */}
        {!issue.isResolved && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <form action={resolveIssue}>
              <button 
                type="submit"
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle size={20} />
                Tandai Masalah Telah Diselesaikan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}