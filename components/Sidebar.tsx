'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileText, AlertCircle, Settings, LogOut, Menu, X } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function Sidebar({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/projects', label: 'Data Proyek', icon: Briefcase },
    { href: '/dashboard/reports', label: 'Laporan Harian', icon: FileText },
    { href: '/dashboard/issues', label: 'Issue Tracking', icon: AlertCircle },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Tombol & Header Khusus Mobile (Fixed di atas) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-lg text-blue-700">PT BWAT</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
          {role === 'OWNER' ? 'Project Manager' : 'Site Manager'}
        </span>
      </div>

      {/* Latar Belakang Gelap Saat Sidebar HP Dibuka */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      {/* Konten Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Header Logo untuk Desktop */}
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h1 className="text-xl font-bold text-blue-700">PT BWAT</h1>
          <p className="text-xs text-gray-500 mt-0.5">Project Management</p>
        </div>

        {/* Header Logo untuk Mobile (Di dalam sidebar geser) */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between md:hidden">
          <div>
            <h1 className="text-lg font-bold text-blue-700">PT BWAT</h1>
            <p className="text-xs text-gray-500">Project Management</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" onClick={() => setIsOpen(false)}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bagian Bawah: Info Peran & Tombol Logout */}
        <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 hidden md:block">
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
              <LogOut size= {18} />
              <span>Keluar Sistem</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}