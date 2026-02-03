"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 gap-4 bg-muted/30 rounded-lg border border-destructive/20">
          <AlertTriangle className="w-12 h-12 text-destructive" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            An unexpected error occurred. Please try again or return to the
            chat.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </Button>
            <Button asChild variant="default">
              <Link href="/chat" className="gap-2">
                Back to Chat
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
