'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import FarmerDashboard from '@/components/dashboard/FarmerDashboard';
import FishermanDashboard from '@/components/dashboard/FishermanDashboard';
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import ResidentDashboard from '@/components/dashboard/ResidentDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  switch (role?.toLowerCase()) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'fisherman':
      return <FishermanDashboard />;
    case 'buyer':
      return <BuyerDashboard />;
    case 'resident':
      return <ResidentDashboard />;
    default:
      // Fallback or unassigned role
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome to GrowHub</h2>
          <p className="text-slate-500">Please complete your profile to access your dashboard.</p>
        </div>
      );
  }
}
