'use client';

import { useState, useTransition } from 'react';
import { handleLoginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState('');
  
  // useTransition adalah standar Next.js untuk mencegah layar membeku
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await handleLoginAction(formData);
      // Jika ada error (password salah), tampilkan pesannya
      if (result?.error) {
        setError(result.error);
      }
      // Jika sukses, server akan mengurus perpindahan halamannya secara otomatis
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">PT BWAT</h2>
          <p className="text-gray-500 mt-2">Sistem Manajemen Proyek & Laporan</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              placeholder="Ketik email..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              placeholder="Ketik password..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-700 text-white py-2.5 px-4 rounded-lg hover:bg-blue-800 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Memeriksa Data...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="font-semibold mb-2 text-blue-800">Gunakan Akun Ini:</p>
          <div className="space-y-3">
            <div>
              <p className="text-blue-700 font-medium">1. Project Manager (Lihat Saja)</p>
              <ul className="list-disc list-inside text-blue-600 ml-1">
                <li>Email: <strong>pm@bwat.com</strong></li>
                <li>Pass: <strong>pm123</strong></li>
              </ul>
            </div>
            <div>
              <p className="text-blue-700 font-medium">2. Site Manager (Bisa Input)</p>
              <ul className="list-disc list-inside text-blue-600 ml-1">
                <li>Email: <strong>site@bwat.com</strong></li>
                <li>Pass: <strong>site123</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}