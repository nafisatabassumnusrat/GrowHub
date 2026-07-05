'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, GraduationCap, MapPin, Star } from 'lucide-react';

export default function TutorsPage() {
  const tutors = [
    { id: 1, name: 'Rafiqul Islam', subject: 'Math & Physics', level: 'SSC/HSC', rating: 4.9, address: 'Upazila Sadar', fee: '৳3000/mo' },
    { id: 2, name: 'Ayesha Siddiqua', subject: 'English', level: 'Class 6-8', rating: 4.7, address: 'College Road', fee: '৳2000/mo' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" /> Tutor Finder
          </h2>
          <p className="text-muted-foreground font-medium mt-1">Find the best local teachers for your children.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search subject..." className="pl-9 bg-background shadow-inset border-none rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map(tutor => (
          <Card key={tutor.id} className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden hover:-translate-y-1 transition-transform">
            <CardHeader className="p-6 pb-2">
              <h3 className="font-bold text-xl font-display">{tutor.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-primary">{tutor.subject}</span>
                <span className="text-xs text-muted-foreground">• {tutor.level}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="flex justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {tutor.address}</div>
                <div className="font-bold">{tutor.fee}</div>
              </div>
              <div className="flex items-center text-sm font-medium"><Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" /> {tutor.rating} Rating</div>
              <Button className="w-full shadow-extruded rounded-full">Request Tutor</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
