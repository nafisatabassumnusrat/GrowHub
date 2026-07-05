'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Floating Orb */}
        <div className="h-20 w-20 rounded-full bg-background shadow-extruded animate-float">
          <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]"></div>
        </div>
        
        {/* Ground shadow (expands/contracts as orb floats) */}
        <div className="mt-8 h-3 w-16 rounded-[100%] bg-foreground/10 blur-[2px] animate-pulse"></div>
        
        <h3 className="mt-8 text-xl font-bold text-foreground tracking-widest animate-pulse font-display">
          LOADING
        </h3>
      </div>
    </div>
  );
}
