'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useStore } from '@/components/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, Heart, ShoppingCart, MessageSquare, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import UpazilaSwitcher from '@/components/location/UpazilaSwitcher';

export default function Navbar() {
  const { user } = useAuth();
  const { wishlist, cart } = useStore();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full flex h-20 items-center justify-between px-4 md:px-8 z-40 bg-white border-b border-gray-100">
      
      {/* Mobile Menu Trigger */}
      <div className="md:hidden flex items-center mr-4">
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100 rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Left Section: Search */}
      <div className="flex-1 max-w-lg relative hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input 
          type="search" 
          placeholder="Search for anything..." 
          className="w-full pl-12 bg-gray-50 border border-gray-200 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all font-medium text-black text-base"
        />
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4 md:ml-auto justify-end flex-1 md:flex-none">
        
        <UpazilaSwitcher />
        
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10 w-10 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/wishlist">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10 w-10 transition-colors relative">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black" />
            )}
          </Button>
        </Link>
        <Link href="/orders">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10 w-10 transition-colors relative mr-2">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Button>
        </Link>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10 w-10 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </Button>
        </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <Avatar className="h-9 w-9 rounded-lg border border-gray-200">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" className="rounded-lg object-cover" />
              <AvatarFallback className="bg-black text-white font-bold rounded-lg text-xs">
                {user?.email?.[0].toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-bold text-black leading-none mb-1">
                {user?.email?.split('@')[0] || 'Guest User'}
              </span>
              <span className="text-xs text-gray-500 font-semibold leading-none">
                Farmer
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl p-2 border border-gray-200 shadow-soft mt-2" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-black">My Account</p>
                  <p className="text-xs font-medium leading-none text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-gray-100" />
            <DropdownMenuItem className="rounded-lg cursor-pointer font-medium text-gray-700 focus:bg-gray-100 focus:text-black">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer font-medium text-gray-700 focus:bg-gray-100 focus:text-black">
              Change Upazila
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-100" />
            <DropdownMenuItem className="text-red-600 font-bold rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
