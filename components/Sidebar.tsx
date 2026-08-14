'use client'; // Wajib ditambahkan agar bisa menggunakan fungsi interaktif (onClick)

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Briefcase, FileText, AlertCircle, Settings, LogOut } from 'lucide-react';
import { handleLogout } from '@/app/actions/auth';

export default function Sidebar() {
  const router = useRouter();
  
  const menu = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Data Proyek', icon: Briefcase, path: '/dashboard/projects' },
    { name: 'Laporan Harian', icon: FileText, path: '/dashboard/reports' },
    { name: 'Issue Tracking', icon: AlertCircle, path: '/dashboard/issues' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const onLogout = async () => {
    await handleLogout();      // Hapus cookie sesi
    router.push('/login');     // Arahkan kembali ke halaman login
  };

  return (
    <div className="w-64 bg-white h-screen border-r flex flex-col fixed">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-blue-700">PT BWC</h2>
        <p className="text-xs text-gray-500">Project Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, idx) => (
          <Link key={idx} href={item.path} className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition">
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Tombol Logout di bagian paling bawah Sidebar */}
      <div className="p-4 border-t">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 text-red-600 p-2 w-full rounded-lg hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}