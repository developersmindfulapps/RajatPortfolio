"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { 
  Settings, 
  ShieldAlert, 
  EyeOff, 
  Eye, 
  CheckCircle2, 
  Laptop, 
  ShieldCheck, 
  Link2,
  Sparkles
} from "lucide-react";
import { isAnalyticsDisabled, setAnalyticsExcluded } from "@/lib/analytics";

export default function AdminSettingsPage() {
  const [isExcluded, setIsExcluded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsExcluded(isAnalyticsDisabled());
  }, []);

  const handleToggleExclusion = () => {
    const nextState = !isExcluded;
    setAnalyticsExcluded(nextState);
    setIsExcluded(nextState);
  };

  const copyOptOutLink = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/?disable_analytics=true`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-env-text flex items-center gap-2">
          <Settings className="h-5 w-5 text-env-accent" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-env-muted font-body mt-1">
          Manage admin preferences, tracking exclusions, and system configurations.
        </p>
      </div>

      {/* Analytics Privacy / Exclusion Card */}
      <Card hoverEffect={false} className="bg-env-surface/40 border-env-border/40 p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-lg border ${isExcluded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
              {isExcluded ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-env-text">Analytics Tracking Exclusion</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold border ${
                  isExcluded 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                }`}>
                  {isExcluded ? 'Tracking Excluded' : 'Tracking Active'}
                </span>
              </div>
              <p className="text-xs text-env-muted font-body mt-1 leading-relaxed">
                Prevent your own visits, page loads, and clicks on this browser from being recorded in MongoDB Analytics and Vercel Analytics.
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggleExclusion}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono tracking-wider transition-all border shrink-0 cursor-pointer ${
              isExcluded
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-env-surface border-env-border text-env-text hover:bg-env-surface/80 hover:border-env-border/60'
            }`}
          >
            {isExcluded ? 'Excluded (Click to Re-enable)' : 'Exclude This Browser'}
          </button>
        </div>

        {/* Multi-layered Protection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-env-border/20 bg-env-text/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-env-text">
              <Laptop className="h-3.5 w-3.5 text-env-accent" />
              <span>Localhost / Dev</span>
            </div>
            <p className="text-[11px] text-env-muted font-body leading-normal">
              Always automatically blocked from logging events.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-env-border/20 bg-env-text/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-env-text">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Admin Session</span>
            </div>
            <p className="text-[11px] text-env-muted font-body leading-normal">
              Backend API automatically ignores requests with active admin session.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-env-border/20 bg-env-text/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-env-text">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Vercel Analytics</span>
            </div>
            <p className="text-[11px] text-env-muted font-body leading-normal">
              Client tracker safely bypasses Vercel analytics calls when excluded.
            </p>
          </div>
        </div>

        {/* Secret URL parameter shortcut */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-env-border/30 bg-env-surface/50 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-env-text">Instant Opt-Out URL for other devices:</span>
            <p className="text-[11px] text-env-muted font-body">
              Open your portfolio with <code className="text-env-accent font-mono text-[10px] bg-env-text/5 px-1 py-0.5 rounded">?disable_analytics=true</code> on any device to exclude it permanently.
            </p>
          </div>
          <button
            onClick={copyOptOutLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-env-border/50 bg-env-text/5 hover:bg-env-text/10 text-env-text text-xs transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5 text-env-muted" />
                <span>Copy Opt-Out URL</span>
              </>
            )}
          </button>
        </div>
      </Card>

      {/* General System Info Card */}
      <Card hoverEffect={false} className="bg-env-surface/30 border-env-border/20 p-6">
        <div className="flex items-start gap-3.5 text-xs text-env-muted font-body">
          <ShieldAlert className="h-4 w-4 shrink-0 text-env-text opacity-80 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-env-text">System Configuration:</span>
            <p className="leading-relaxed">
              Environment variables (database connection, SMTP mailing, turnstile verification, and admin credentials) are securely configured at the server/edge layer.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

