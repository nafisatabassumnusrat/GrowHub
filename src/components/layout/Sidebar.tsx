'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Wrench, Briefcase, Key, Users, HeartPulse, Settings, LogOut, Bot } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, href: '/dashboard', label: 'Dashboard' },
    { icon: Bot, href: '/ai', label: 'AI Center' },
    { icon: ShoppingCart, href: '/marketplace', label: 'Buy & Sell' },
    { icon: Wrench, href: '/services', label: 'Local Services' },
    { icon: Briefcase, href: '/jobs', label: 'Jobs & Tutors' },
    { icon: Key, href: '/rentals', label: 'Rentals' },
    { icon: Users, href: '/community', label: 'Community' },
    { icon: HeartPulse, href: '/emergency', label: 'Emergency' },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center py-6 w-24 h-full bg-white rounded-2xl border border-gray-200 shadow-soft flex-shrink-0 relative z-20">
      {/* Logo Area */}
      <Link href="/dashboard" className="mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors font-display font-extrabold text-2xl">
          G
        </div>
      </Link>

      {/* Navigation Icons - Scrollable if needed */}
      <nav className="flex flex-col items-center gap-3 flex-1 w-full overflow-y-auto no-scrollbar py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="relative group flex justify-center w-full">
              <div className={`p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black'
              }`}>
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white font-semibold text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto w-full flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
        <Link href="/profile" className="relative group flex justify-center w-full">
          <div className={`p-3 rounded-xl transition-all duration-200 ${
            pathname.startsWith('/profile') 
              ? 'bg-black text-white shadow-md' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-black'
          }`}>
            <Settings className="w-[22px] h-[22px]" strokeWidth={pathname.startsWith('/profile') ? 2.5 : 2} />
          </div>
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white font-semibold text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
            Settings
          </div>
        </Link>
        <button onClick={logout} className="relative group flex justify-center w-full">
          <div className="p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-[22px] h-[22px]" strokeWidth={2} />
          </div>
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-500 text-white font-semibold text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
            Log out
          </div>
        </button>
      </div>
    </aside>
  );
}
