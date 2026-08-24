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
      {/* Kirim data role ke Sidebar */}
      <Sidebar role={role} />
      
      {/* Konten Utama */}
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
}