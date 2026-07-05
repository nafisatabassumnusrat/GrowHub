import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import BottomNav from "@/components/layout/BottomNav";

import { StoreProvider } from "@/components/providers/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GrowHub - Hyperlocal Agriculture & Community",
  description: "AI Powered Hyperlocal Agriculture & Community Platform",
};

import { LocationProvider } from "@/components/providers/LocationProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <StoreProvider>
            <LocationProvider>
              {children}
              <BottomNav />
            </LocationProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
