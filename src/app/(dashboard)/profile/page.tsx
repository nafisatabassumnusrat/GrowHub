'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, MapPin, Package, Clock, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, role, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight">Your Profile</h2>
        <Button variant="outline" className="shadow-extruded rounded-full border-none">
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-background shadow-extruded border-none rounded-[32px] overflow-hidden flex flex-col items-center p-8 text-center">
          <div className="relative h-24 w-24 rounded-full shadow-inset-deep mb-4 flex items-center justify-center bg-background">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">U</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="font-bold text-2xl font-display">{user?.email?.split('@')[0] || 'User'}</h3>
          <p className="text-sm text-primary font-bold uppercase tracking-wider mt-1">{role}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" /> Upazila Sadar
          </div>
          <Button variant="ghost" className="w-full mt-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
            Sign Out
          </Button>
        </Card>

        {/* Activity & Stats */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <h3 className="font-bold text-xl font-display">Activity Summary</h3>
            </CardHeader>
            <CardContent className="p-6 pt-4 grid grid-cols-2 gap-4">
              <div className="bg-background shadow-inset p-4 rounded-[20px] flex items-center gap-4">
                <div className="h-10 w-10 rounded-full shadow-extruded flex items-center justify-center bg-background">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                </div>
              </div>
              <div className="bg-background shadow-inset p-4 rounded-[20px] flex items-center gap-4">
                <div className="h-10 w-10 rounded-full shadow-extruded flex items-center justify-center bg-background">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-xs text-muted-foreground">AI Scans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <h3 className="font-bold text-xl font-display">Recent History</h3>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-bold">Purchased Organic Tomatoes</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-bold">Used Plant Disease AI</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
