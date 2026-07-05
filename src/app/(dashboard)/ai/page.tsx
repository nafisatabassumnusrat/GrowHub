import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bot, Leaf, Bug, Fish, ShieldAlert, ChevronRight } from 'lucide-react';

export default function AICenterPage() {
  const tools = [
    {
      title: 'AI Agriculture Assistant',
      description: 'Chat with our intelligent agriculture and fisheries assistant for expert advice, seasonal recommendations, and farming practices.',
      icon: Bot,
      href: '/ai/assistant',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Plant Disease Detection',
      description: 'Upload a photo of a crop or leaf. AI will identify any diseases and recommend treatments.',
      icon: Leaf,
      href: '/ai/plant-disease',
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Weed Detection',
      description: 'Scan your field for invasive weeds and get herbicide or organic removal recommendations.',
      icon: Bug,
      href: '/ai/weed-detection',
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      title: 'Fish Species Recognition',
      description: 'Upload an image of a fish to identify its exact species, nutritional value, and estimated market price.',
      icon: Fish,
      href: '/ai/fish-species',
      color: 'text-cyan-500',
      bg: 'bg-cyan-50'
    },
    {
      title: 'Fish Disease Detection',
      description: 'Scan fish for visible anomalies, scales diseases, and get immediate quarantine protocols.',
      icon: ShieldAlert,
      href: '/ai/fish-disease',
      color: 'text-red-500',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight font-display text-foreground flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          AI Center
        </h1>
        <p className="text-muted-foreground text-lg font-medium">Harness the power of artificial intelligence for your farm and business.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="h-full border-none shadow-extruded hover:shadow-extruded-hover transition-all duration-300 bg-background overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${tool.bg} ${tool.color}`}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  Launch Tool <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
