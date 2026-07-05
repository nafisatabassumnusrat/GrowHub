import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, Anchor, Navigation, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FishermanDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold font-display text-foreground">Fisherman Hub</h2>
        <Button className="shadow-extruded">Log Catch</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Catch</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Fish className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 kg</div>
            <p className="text-xs text-muted-foreground mt-1">Hilsa, Rui</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Boat Status</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Anchor className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Docked</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for next trip</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fishing Zones</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Navigation className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Zone B</div>
            <p className="text-xs text-muted-foreground mt-1">High activity detected</p>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weather</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><CloudRain className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Clear</div>
            <p className="text-xs text-muted-foreground mt-1">Safe to sail</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
          🤖 AI Fishery Center
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/ai/fish-disease" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Fish className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Fish Disease Detection</h4>
            </Card>
          </a>
          <a href="/ai/fish-species" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Navigation className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Fish Species Recognition</h4>
            </Card>
          </a>
          <a href="/ai/assistant" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <CloudRain className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">AI Assistant Chat</h4>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
