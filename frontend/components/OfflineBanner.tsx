"use client";

import { useOffline } from "@/lib/useOffline";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4" aria-hidden />
      You&apos;re offline. Some features may not work until you reconnect.
    </div>
  );
}
