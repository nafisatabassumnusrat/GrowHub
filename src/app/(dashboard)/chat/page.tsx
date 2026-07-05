'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const contacts = [
    { id: 1, name: 'Rahim Mia', role: 'Farmer', lastMsg: 'I have 5kg of tomatoes ready.', time: '10:30 AM', active: true },
    { id: 2, name: 'Karim Fishery', role: 'Fisherman', lastMsg: 'The Rui fish is very fresh today.', time: 'Yesterday', active: false },
    { id: 3, name: 'Sujon Tractor Repair', role: 'Mechanic', lastMsg: 'I will be there at 5 PM.', time: 'Monday', active: false },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 h-[80vh] flex flex-col md:flex-row gap-6 pb-12">
      {/* Sidebar Contacts */}
      <Card className="md:w-80 flex-shrink-0 bg-background shadow-extruded border-none rounded-[32px] overflow-hidden flex flex-col">
        <CardHeader className="p-6 pb-4 border-b border-slate-100">
          <h2 className="text-2xl font-extrabold font-display text-foreground tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Messages
          </h2>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {contacts.map(c => (
            <div key={c.id} className={`p-4 border-b border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${c.active ? 'bg-primary/5' : ''}`}>
              <Avatar className="h-12 w-12 border border-slate-200">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{c.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold font-display truncate">{c.name}</h4>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 bg-background shadow-extruded border-none rounded-[32px] overflow-hidden flex flex-col hidden md:flex">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center gap-4">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">R</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold font-display leading-none">Rahim Mia</h4>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 bg-slate-50/50 flex flex-col justify-end gap-4">
          {/* Messages Mock */}
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback>R</AvatarFallback></Avatar>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
              Hello! Are you still interested in the organic tomatoes?
            </div>
          </div>
          <div className="flex gap-4 flex-row-reverse">
            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-primary text-white">M</AvatarFallback></Avatar>
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
              Yes, I would like to order 5kg. Can you deliver to Upazila Sadar?
            </div>
          </div>
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback>R</AvatarFallback></Avatar>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
              I have 5kg of tomatoes ready. Yes I can deliver by 4 PM.
            </div>
          </div>
        </CardContent>
        <div className="p-4 bg-background border-t border-slate-100 flex gap-2">
          <Button variant="ghost" size="icon" className="text-slate-500 shrink-0"><ImageIcon className="h-5 w-5" /></Button>
          <Input placeholder="Type a message..." className="bg-background shadow-inset border-none rounded-full px-4 flex-1" />
          <Button size="icon" className="shadow-extruded rounded-full shrink-0"><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
}
