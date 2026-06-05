"use client";

import React, { Suspense, Component, ErrorInfo, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface SceneContainerProps {
  children?: ReactNode;
  fallback?: ReactNode;
  aspectRatio?: "video" | "square" | "auto";
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WebGL / Scene rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-red-200 bg-red-50/50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/20 rounded-2xl">
          <p className="text-sm font-semibold text-red-650 dark:text-red-400">
            WebGL Scene Error
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Unable to load interactive visuals.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SceneContainer({
  children,
  fallback,
  aspectRatio = "video",
  className,
}: SceneContainerProps) {
  const defaultFallback = (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    auto: "h-full w-full",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 ${aspectClass[aspectRatio]} ${className || ""}`}>
      <SceneErrorBoundary>
        <Suspense fallback={fallback || defaultFallback}>
          {children ? (
            children
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-zinc-400 dark:text-zinc-500">
              <p className="text-sm font-medium">Interactive Scene Area</p>
              <p className="mt-1 text-xs">
                Assets will be loaded from public/scenes/ later.
              </p>
            </div>
          )}
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}
