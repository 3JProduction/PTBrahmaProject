import Sidebar from '@/components/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roleCookie = cookies().get('userRole');
  
  // Usir ke halaman login jika tidak punya tiket masuk
  if (!roleCookie) {
    redirect('/login');
  }
  
  const role = roleCookie.value;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="text-sm text-gray-500 mb-2">
          Login sebagai:<br/>
          <span className="font-bold text-gray-800">
            {role === 'OWNER' ? 'Project Manager' : 'Site Manager'}
          </span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-red-600 font-medium text-sm hover:underline">
            Keluar Sistem
          </button>
        </form>
      </div>
    </div>
  );
}
