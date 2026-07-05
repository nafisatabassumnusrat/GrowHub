import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/layout/PageTransition';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden md:p-4 gap-4">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative bg-white md:rounded-2xl border-x md:border border-gray-200 shadow-soft">
          <Navbar />
          <main className="flex-1 overflow-y-auto pb-24 md:pb-8 pt-4 md:pt-6 px-4 md:px-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
