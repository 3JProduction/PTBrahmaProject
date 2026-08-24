import Sidebar from '@/components/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roleCookie = cookies().get('userRole');
  
  if (!roleCookie) {
    redirect('/login');
  }
  
  const role = roleCookie.value;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar memuat menu dan tombol logout di sebelah kiri */}
      <Sidebar role={role} />
      
      {/* Konten halaman utama */}
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
}