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
      {/* Sidebar Responsif */}
      <Sidebar role={role} />
      
      {/* Konten Utama */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}