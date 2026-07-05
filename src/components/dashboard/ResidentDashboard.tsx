import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResidentDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold font-display text-foreground">Resident Portal</h2>
        <Button className="shadow-extruded">Local Forum</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community Posts</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><MessageSquare className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">New updates today</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Local Jobs</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Briefcase className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Hiring nearby</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upazila Events</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><MapPin className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Upcoming this week</p>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-extruded border-none rounded-[32px] hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Neighbors</CardTitle>
            <div className="h-8 w-8 rounded-full shadow-inset-deep flex items-center justify-center bg-background"><Users className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold font-display mb-4">Resident Hub</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <a href="/community" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Community</h4>
            </Card>
          </a>
          <a href="/services" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Local Services</h4>
            </Card>
          </a>
          <a href="/jobs" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Jobs</h4>
            </Card>
          </a>
          <a href="/rentals" className="block">
            <Card className="bg-background shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">Rentals</h4>
            </Card>
          </a>
          <a href="/emergency" className="block">
            <Card className="bg-red-50 shadow-extruded border-none rounded-[24px] hover:shadow-extruded-hover hover:-translate-y-1 transition-all text-center p-6">
              <Users className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h4 className="font-bold text-red-600">Emergency</h4>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
