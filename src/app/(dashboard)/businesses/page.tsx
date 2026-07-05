'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Store, MapPin, PhoneCall, Star } from 'lucide-react';

export default function BusinessesPage() {
  const businesses = [
    { id: 1, name: 'Sujon Agro Shop', type: 'Agriculture', rating: 4.8, address: 'Main Market', phone: '01711XXXXXX' },
    { id: 2, name: 'Bismillah Hardware', type: 'Hardware', rating: 4.5, address: 'Station Road', phone: '01822XXXXXX' },
    { id: 3, name: 'Mayer Doa Pharmacy', type: 'Medical', rating: 4.9, address: 'Hospital Gate', phone: '01933XXXXXX' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" /> Business Directory
          </h2>
          <p className="text-muted-foreground font-medium mt-1">Explore all registered shops and businesses in your Upazila.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search businesses..." className="pl-9 bg-background shadow-inset border-none rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map(business => (
          <Card key={business.id} className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <h3 className="font-bold text-xl font-display">{business.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{business.type}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center"><Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />{business.rating}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {business.address}
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 shadow-extruded rounded-full bg-background text-primary hover:bg-slate-50" variant="outline">View Profile</Button>
                <Button size="icon" className="shadow-extruded rounded-full shrink-0"><PhoneCall className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
