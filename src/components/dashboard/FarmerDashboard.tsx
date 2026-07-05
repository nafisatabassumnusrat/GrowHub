import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, DollarSign, CloudRain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import NearbyMap from "@/components/dashboard/NearbyMap";

export default function FarmerDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold font-display text-foreground">Farmer Hub</h2>
        <Button className="shadow-extruded">Add Crop</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Crops</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Leaf className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">+2 this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Prices</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><TrendingUp className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stable</div>
            <p className="text-xs text-muted-foreground mt-1">Rice & Wheat up 2%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><DollarSign className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳ 45,200</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Diagnostics</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><ShieldCheck className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Alerts</div>
            <p className="text-xs text-muted-foreground mt-1">All crops healthy</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
          🤖 AI Agriculture Center
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/ai/plant-disease" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Plant Disease Detection</h4>
            </Card>
          </a>
          <a href="/ai/weed-detection" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Leaf className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Weed Detection</h4>
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

      <NearbyMap />
    </div>
  );
}
