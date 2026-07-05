'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapComponent so leaflet window object doesn't break SSR
const DynamicMap = dynamic(() => import('@/components/dashboard/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-[32px] animate-pulse">
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <MapPin className="w-8 h-8 animate-bounce" />
        <span className="font-bold text-sm">Loading Google Maps...</span>
      </div>
    </div>
  )
});

export default function NearbyMap() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <Card className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden mt-8">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border/30">
        <CardTitle className="text-xl font-bold font-display flex items-center gap-2">
          <div className="h-10 w-10 bg-background shadow-inset rounded-xl flex items-center justify-center text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          Nearby Community
        </CardTitle>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-extruded hover:shadow-inset ${activeFilter === 'all' ? 'bg-primary text-white shadow-inset-deep border-none' : 'bg-background text-muted-foreground'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('farmer')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-extruded hover:shadow-inset ${activeFilter === 'farmer' ? 'bg-[#38a169] text-white shadow-inset-deep border-none' : 'bg-background text-muted-foreground'}`}
          >
            Farmers
          </button>
          <button 
            onClick={() => setActiveFilter('buyer')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-extruded hover:shadow-inset ${activeFilter === 'buyer' ? 'bg-[#3182ce] text-white shadow-inset-deep border-none' : 'bg-background text-muted-foreground'}`}
          >
            Buyers
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-background p-2 rounded-[36px] shadow-inset-deep">
          <DynamicMap activeFilter={activeFilter} />
        </div>
      </CardContent>
    </Card>
  );
}
