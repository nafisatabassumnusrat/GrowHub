'use client';

// Authentication bypassed as requested
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
