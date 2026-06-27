"use client";

import React from "react";
import { Card } from "@/components/shared/Card";
import { Settings, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <Card hoverEffect={false} className="bg-env-surface/30 border-env-border/20 p-8 text-center">
        <div className="p-4 bg-env-text/5 rounded-full border border-env-border/40 text-env-text w-fit mx-auto mb-6">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-base text-env-text mb-2">Settings Console</h3>
        <p className="text-xs text-env-muted leading-relaxed font-body mb-6">
          Configuration parameters for layout templates, portfolio nodes, and API integrations will be implemented in Phase 2.
        </p>
        <div className="flex items-start gap-3.5 rounded-lg border border-env-border/30 bg-env-text/5 p-4 text-xs text-env-muted text-left font-body">
          <ShieldAlert className="h-4 w-4 shrink-0 text-env-text opacity-80 mt-0.5" />
          <span>Access control settings and email dispatch settings are currently managed via server environment variables.</span>
        </div>
      </Card>
    </div>
  );
}
