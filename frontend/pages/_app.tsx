import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

import { TrpcProvider } from "@/lib/trpc";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TrpcProvider>
      <ErrorBoundary>
        <OfflineBanner />
        <Component {...pageProps} />
      </ErrorBoundary>
      <Toaster />
      <Analytics />
    </TrpcProvider>
  );
}
