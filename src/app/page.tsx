'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Leaf, Fish, ShoppingCart, Users, ArrowRight, MapPin, CloudLightning, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import UpazilaSwitcher from '@/components/location/UpazilaSwitcher';
import ArcRevealHero from '@/components/ui/arc-preloader-hero';

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const projectGreetings = [
  { text: "GrowHub." },
  { text: "Agriculture." },
  { text: "Community." },
  { text: "Hyperlocal." },
  { text: "Real-Time." },
  { text: "Empowering." },
  { text: "Bangladesh." }
];

export default function Home() {
  return (
    <ArcRevealHero greetings={projectGreetings}>
      <div className="flex flex-col min-h-screen">
      
      {/* Navbar - Neumorphic */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between z-20 bg-background/80 backdrop-blur-md sticky top-0 shadow-soft">
        <Link className="flex items-center gap-3" href="/">
          <div className="h-10 w-10 flex items-center justify-center bg-background shadow-extruded text-primary rounded-xl">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-black text-2xl tracking-tight font-display text-foreground">GrowHub</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 items-center">
          <UpazilaSwitcher isCompact={true} triggerClassName="hidden sm:flex shadow-inset bg-background" />
          <div className="hidden sm:flex items-center gap-6">
            <Link className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" href="/dashboard">
              Login
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" href="/dashboard">
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-background">
          <motion.div 
            className="container px-6 md:px-12 mx-auto max-w-7xl relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter font-display leading-[1.05] max-w-5xl text-foreground mt-8">
                Hyperlocal Agriculture, <br />
                <span className="text-muted-foreground bg-clip-text">Streamlined.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="mt-8 max-w-2xl text-muted-foreground md:text-xl font-medium leading-relaxed">
                Connect directly with farmers, fishermen, and local businesses in your exact Upazila. Remove the middlemen. Access AI-driven crop insights. Grow your local community securely.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 mt-12 w-full sm:w-auto">
                <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg rounded-2xl font-bold gap-2 group bg-primary text-white shadow-extruded hover:shadow-inset border-none transition-all" })}>
                  Join Your Upazila
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/marketplace" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-lg rounded-2xl font-bold border-none bg-background text-foreground shadow-extruded hover:shadow-inset transition-all" })}>
                  Explore Marketplace
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Informative Stats Section - Neumorphic */}
        <section className="w-full py-16 bg-background relative z-10 shadow-soft">
          <div className="container px-6 md:px-12 mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-background shadow-extruded rounded-[32px] p-8 md:p-12">
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-black font-display mb-2 text-primary">120k+</div>
                <div className="text-muted-foreground font-semibold text-sm md:text-base tracking-wide">Active Farmers</div>
              </div>
              <div className="px-4 border-l border-border/50">
                <div className="text-4xl md:text-5xl font-black font-display mb-2 text-foreground">৳4M+</div>
                <div className="text-muted-foreground font-semibold text-sm md:text-base tracking-wide">Daily Transactions</div>
              </div>
              <div className="px-4 border-l border-border/50">
                <div className="text-4xl md:text-5xl font-black font-display mb-2 text-foreground">0%</div>
                <div className="text-muted-foreground font-semibold text-sm md:text-base tracking-wide">Middleman Fees</div>
              </div>
              <div className="px-4 border-l border-border/50">
                <div className="text-4xl md:text-5xl font-black font-display mb-2 text-foreground">24/7</div>
                <div className="text-muted-foreground font-semibold text-sm md:text-base tracking-wide">AI Diagnostics</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ecosystem / Cards Section */}
        <section className="w-full py-24 bg-background">
          <div className="container px-6 md:px-12 mx-auto max-w-7xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="mb-16 md:mb-24 md:flex md:justify-between md:items-end">
                <motion.div variants={fadeUp} className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-foreground mb-6">The Local Ecosystem</h2>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                    A comprehensive platform providing specialized, hyper-local tools tailored for every specific role within your Upazila's borders.
                  </p>
                </motion.div>
              </div>
              
              <div className="grid gap-8 md:gap-10 sm:grid-cols-2">
                {/* Farmer Card */}
                <motion.div variants={fadeUp} className="group overflow-hidden bg-background rounded-[32px] shadow-extruded hover:shadow-extruded-hover transition-all duration-300">
                  <div className="h-64 w-full overflow-hidden p-4 pb-0">
                    <img src="https://picsum.photos/seed/growhub-farmer/800/600" alt="Farmers" className="w-full h-full object-cover rounded-t-[24px] opacity-90 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="p-8 pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-background shadow-inset text-primary">
                        <Leaf className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground">Farmers</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                      Utilize computer vision for instant plant disease detection. List your harvest in real-time and sell directly to locals without exploitation.
                    </p>
                  </div>
                </motion.div>
                
                {/* Fishermen Card */}
                <motion.div variants={fadeUp} className="group overflow-hidden bg-background rounded-[32px] shadow-extruded hover:shadow-extruded-hover transition-all duration-300">
                  <div className="h-64 w-full overflow-hidden p-4 pb-0">
                    <img src="https://picsum.photos/seed/growhub-fish/800/600" alt="Fishermen" className="w-full h-full object-cover rounded-t-[24px] opacity-90 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="p-8 pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-background shadow-inset text-primary">
                        <Fish className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground">Fishermen</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                      Alert the local market immediately when boats dock. Use AI tools for accurate species identification and market price matching.
                    </p>
                  </div>
                </motion.div>
                
                {/* Buyers Card */}
                <motion.div variants={fadeUp} className="group overflow-hidden bg-background rounded-[32px] shadow-extruded hover:shadow-extruded-hover transition-all duration-300">
                  <div className="h-64 w-full overflow-hidden p-4 pb-0">
                    <img src="https://picsum.photos/seed/growhub-buyer/800/600" alt="Buyers" className="w-full h-full object-cover rounded-t-[24px] opacity-90 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="p-8 pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-background shadow-inset text-primary">
                        <ShoppingCart className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground">Buyers</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                      Purchase the freshest local farm products and daily necessities at standard rates. Track orders and communicate via live chat.
                    </p>
                  </div>
                </motion.div>
                
                {/* Residents Card */}
                <motion.div variants={fadeUp} className="group overflow-hidden bg-background rounded-[32px] shadow-extruded hover:shadow-extruded-hover transition-all duration-300">
                  <div className="h-64 w-full overflow-hidden p-4 pb-0">
                    <img src="https://picsum.photos/seed/growhub-resident/800/600" alt="Residents" className="w-full h-full object-cover rounded-t-[24px] opacity-90 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="p-8 pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-background shadow-inset text-primary">
                        <Users className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground">Residents</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                      The ultimate local directory. Find nearby services, hire local talent, rent housing, and receive critical community emergency alerts.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Real-time Features Section */}
        <section className="w-full py-32 bg-background">
          <div className="container px-6 md:px-12 mx-auto max-w-7xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeUp} className="mx-auto w-20 h-20 bg-background shadow-extruded rounded-3xl flex items-center justify-center mb-10 text-primary">
                <CloudLightning className="w-10 h-10" />
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black font-display tracking-tight mb-8 text-foreground">Engineered for Velocity.</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-xl leading-relaxed mb-16 font-medium">
                GrowHub isn't a static directory. It's a living, breathing ecosystem powered by robust WebSockets for instant, reliable communication.
              </motion.p>
              
              <div className="grid sm:grid-cols-3 gap-8 text-left">
                <motion.div variants={fadeUp} className="p-8 rounded-[32px] bg-background shadow-inset-deep">
                  <div className="w-12 h-12 bg-background shadow-extruded rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3 font-display text-foreground">Instant Chat</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">Negotiate with buyers and sellers in real-time, just like WhatsApp. Built-in image sharing.</p>
                </motion.div>
                
                <motion.div variants={fadeUp} className="p-8 rounded-[32px] bg-background shadow-inset-deep">
                  <div className="w-12 h-12 bg-background shadow-extruded rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 font-display text-foreground">Live Tracking</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">Watch your fresh produce get delivered from the farm directly to your door on a live map.</p>
                </motion.div>
                
                <motion.div variants={fadeUp} className="p-8 rounded-[32px] bg-background shadow-inset-deep">
                  <div className="w-12 h-12 bg-background shadow-extruded rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 font-display text-foreground">Crisis Alerts</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">Critical community emergency alerts and blood requests pushed directly to local devices instantly.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Professional Neumorphic Footer */}
      <footer className="pt-24 pb-12 px-6 md:px-12 bg-background border-t border-border/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link className="flex items-center gap-3 mb-6" href="/">
                <div className="h-12 w-12 flex items-center justify-center bg-background shadow-extruded text-primary rounded-2xl">
                  <Leaf className="h-6 w-6" />
                </div>
                <span className="font-black text-2xl tracking-tight font-display text-foreground">GrowHub</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed font-medium max-w-sm mb-8 text-lg">
                The ultimate hyperlocal platform connecting farmers, businesses, and communities in Bangladesh. Streamlined, fast, and built to last.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-background shadow-extruded hover:shadow-inset flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-background shadow-extruded hover:shadow-inset flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6 font-display">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Marketplace</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Local Services</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Community</Link></li>
                <li><Link href="/ai" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">AI Agriculture</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6 font-display">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">About Us</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Blog</Link></li>
                <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Help Center</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6 font-display">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-semibold text-muted-foreground">
              © {new Date().getFullYear()} GrowHub Platform. Designed for local communities.
            </p>
            <div className="flex gap-6">
              <span className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(56,161,105,0.6)]" /> System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      </div>
    </ArcRevealHero>
  );
}
