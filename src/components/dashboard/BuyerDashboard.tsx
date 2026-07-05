import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Heart, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import NearbyMap from "@/components/dashboard/NearbyMap";

export default function BuyerDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold font-display text-foreground">Buyer Dashboard</h2>
        <Button className="shadow-extruded">Go to Marketplace</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Orders</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><ShoppingCart className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">1 arriving today</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Sellers</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Heart className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Local farmers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Local Shops</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Store className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">In your Upazila</p>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Items</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Clock className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for checkout</p>
          </CardContent>
        </Card>
      </div>

      <NearbyMap />
    </div>
  );
}
