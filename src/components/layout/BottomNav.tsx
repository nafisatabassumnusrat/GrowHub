'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingCart, User } from 'lucide-react';
import { useStore } from '@/components/providers/StoreProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { cart } = useStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Don't show bottom nav on auth pages or landing page
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-3 pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-primary' : 'text-slate-400'}`}>
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/marketplace" className={`flex flex-col items-center gap-1 ${pathname.startsWith('/marketplace') ? 'text-primary' : 'text-slate-400'}`}>
          <Compass className="h-6 w-6" />
          <span className="text-[10px] font-bold">Explore</span>
        </Link>
        <Link href="/orders" className={`relative flex flex-col items-center gap-1 ${pathname === '/orders' ? 'text-primary' : 'text-slate-400'}`}>
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
              {cartItemCount}
            </span>
          )}
          <span className="text-[10px] font-bold">Cart</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-primary' : 'text-slate-400'}`}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </div>
  );
}
