import { requireAuth } from '@/lib/auth/server';
import { Sidebar } from '@/components/layout';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="font-sans text-gray-800 bg-gray-50 h-screen flex flex-col overflow-hidden selection:bg-gray-900/10 selection:text-gray-900">
      <div className="flex h-full gap-2 overflow-hidden">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
