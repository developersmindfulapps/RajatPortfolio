import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export function useTurnstile(containerRef: React.RefObject<HTMLDivElement | null>) {
  const widgetIdRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
    if (!sitekey) return;

    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      if (!containerRef.current) return;
      if (widgetIdRef.current) return; // already rendered

      if (!window.turnstile) {
        // Not ready yet — try again next animation frame
        rafRef.current = requestAnimationFrame(tryRender);
        return;
      }

      const id = window.turnstile.render(containerRef.current, {
        sitekey,
        theme: "auto",
        size: "flexible",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(null),
        "error-callback": () => setToken(null),
      });
      widgetIdRef.current = id;
    };

    // Inject script once (use ?render=explicit so Turnstile doesn't auto-scan)
    if (!document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Start polling — resolves immediately if script was already loaded
    rafRef.current = requestAnimationFrame(tryRender);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      // Clean up widget when panel unmounts
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetWidget = useCallback(() => {
    setToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { token, resetWidget };
}
