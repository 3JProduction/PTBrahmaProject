import Link from 'next/link';
import { Home, Briefcase, FileText, AlertCircle, Settings, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function Sidebar({ role }: { role: string }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0">
      {/* Logo / Header Sidebar */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-700">PT BWAT</h1>
        <p className="text-xs text-gray-500 mt-0.5">Project Management</p>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/dashboard/projects" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
        >
          <Briefcase size={20} />
          <span>Data Proyek</span>
        </Link>
        <Link 
          href="/dashboard/reports" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
        >
          <FileText size={20} />
          <span>Laporan Harian</span>
        </Link>
        <Link 
          href="/dashboard/issues" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
        >
          <AlertCircle size={20} />
          <span>Issue Tracking</span>
        </Link>
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Bagian Bawah Sidebar: Info Peran & Tombol Logout */}
      <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">
          Login sebagai:<br/>
          <span className="font-bold text-gray-800">
            {role === 'OWNER' ? 'Project Manager' : 'Site Manager'}
          </span>
        </div>
        <form action={logout}>
          <button 
            type="submit" 
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition"
          >
            <LogOut size={18} />
            <span>Keluar Sistem</span>
          </button>
        </form>
      </div>
    </aside>
  );
}