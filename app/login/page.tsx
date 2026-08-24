import { handleLogin } from '@/app/actions/auth';

// Halaman ini sekarang murni Server Component (Tanpa 'use client')
export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">PT BWC</h2>
          <p className="text-gray-500 mt-2">Sistem Manajemen Proyek & Laporan</p>
        </div>

        {/* Munculkan pesan merah jika ada '?error=invalid' di URL */}
        {searchParams?.error === 'invalid' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            Email atau password salah!
          </div>
        )}

        <form action={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="site@bwc.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2.5 px-4 rounded-lg hover:bg-blue-800 transition font-medium"
          >
            Masuk ke Dashboard
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="font-semibold mb-2 text-blue-800">Akun Demo Terdaftar:</p>
          <div className="space-y-3">
            <div>
              <p className="text-blue-700 font-medium">1. Project Manager (Hanya Lihat)</p>
              <ul className="list-disc list-inside text-blue-600 ml-1">
                <li>Email: <strong>pm@bwc.com</strong></li>
                <li>Pass: <strong>pm123</strong></li>
              </ul>
            </div>
            <div>
              <p className="text-blue-700 font-medium">2. Site Manager (Bisa Input Data)</p>
              <ul className="list-disc list-inside text-blue-600 ml-1">
                <li>Email: <strong>site@bwc.com</strong></li>
                <li>Pass: <strong>site123</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}