"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { 
  Eye, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Globe, 
  UserCheck, 
  ShieldAlert,
  Loader2,
  CalendarDays
} from "lucide-react";

interface Stats {
  portfolioVisits: number;
  resumeViews: number;
  cvDownloads: number;
  experienceViews: number;
  projectClicks: number;
  approvedRecs: number;
  pendingRecs: number;
  contactMessagesCount: number;
}

interface ActivityEvent {
  _id: string;
  eventType: string;
  timestamp: string;
  route: string;
  referrer: string;
  deviceType: string;
  browser: string;
  country: string | null;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await fetch("/api/admin/overview");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load overview data.");
        }

        setStats(data.stats);
        setLastLogin(data.lastLogin);
        setRecentActivity(data.recentActivity);
      } catch (err: any) {
        console.error("[overview-page] Load error:", err);
        setError(err.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return "First successful session";
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata"
      };
      // For India Standard Time (IST) formatting
      return new Intl.DateTimeFormat("en-US", options).format(date) + " IST";
    } catch {
      return dateString;
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "portfolio_visit": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "resume_view": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "cv_download": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "project_click": return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "contact_submission": return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      case "recommendation_submission": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "recommendations_panel_open": return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
      default: return "bg-env-text/5 text-env-muted border border-env-border/20";
    }
  };

  const getEventLabel = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-env-text opacity-80" />
        <p className="text-xs uppercase tracking-widest text-env-muted font-semibold">Loading console...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center max-w-xl mx-auto my-12">
        <ShieldAlert className="h-10 w-10 text-red-400 mb-4" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-env-text mb-2">Error Loading Dashboard</h3>
        <p className="text-xs text-red-400 leading-relaxed font-body">{error}</p>
      </div>
    );
  }

  const statCards = [
    { title: "Portfolio Visits", count: stats?.portfolioVisits ?? 0, icon: Globe },
    { title: "Resume Views", count: stats?.resumeViews ?? 0, icon: Eye },
    { title: "CV Downloads", count: stats?.cvDownloads ?? 0, icon: Download },
    { title: "Experience Views", count: stats?.experienceViews ?? 0, icon: Clock },
    { title: "Project Clicks", count: stats?.projectClicks ?? 0, icon: ExternalLink },
    { title: "Approved Recs", count: stats?.approvedRecs ?? 0, icon: CheckCircle2 },
    { title: "Pending Recs", count: stats?.pendingRecs ?? 0, icon: UserCheck },
    { title: "Contact Messages", count: stats?.contactMessagesCount ?? 0, icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Bar & Last Login */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-env-border/20 bg-env-surface/40 backdrop-blur-xs shadow-xs">
        <div>
          <h3 className="font-bold text-base text-env-text">Welcome back, Administrator</h3>
          <p className="text-xs text-env-muted font-body mt-1">Manage, moderate and analyze your portfolio resources.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto bg-env-text/5 px-4 py-2.5 rounded-lg border border-env-border/30">
          <CalendarDays className="h-4 w-4 text-env-muted shrink-0" />
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-wider font-bold text-env-muted select-none">Last Login</p>
            <p className="text-[11px] font-semibold text-env-text mt-0.5 whitespace-nowrap">{formatLastLogin(lastLogin)}</p>
          </div>
        </div>
      </div>

      {/* Grid of 8 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card 
              key={idx} 
              hoverEffect={true} 
              className="p-5 bg-env-surface/30 border-env-border/20 flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-env-muted">
                  {card.title}
                </span>
                <Icon className="h-4 w-4 text-env-muted" />
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-env-text">
                  {card.count}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-widest text-env-muted select-none">
          Recent Activity (Last 10 Events)
        </h4>
        
        <Card hoverEffect={false} className="p-0 overflow-hidden bg-env-surface/30 border-env-border/20">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-env-border/30 bg-env-text/5 text-env-muted uppercase font-bold tracking-wider select-none">
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Browser</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-env-border/10 font-body">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-env-muted italic select-none">
                      No recent activity events tracked yet.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((event) => (
                    <tr key={event._id} className="hover:bg-env-text/5 transition-colors">
                      <td className="px-6 py-4 font-semibold whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${getEventBadgeClass(event.eventType)}`}>
                          {getEventLabel(event.eventType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-env-text font-mono font-medium">{event.route}</td>
                      <td className="px-6 py-4 text-env-text/90 capitalize">{event.deviceType}</td>
                      <td className="px-6 py-4 text-env-text/90">{event.browser}</td>
                      <td className="px-6 py-4 font-semibold text-env-text">
                        {event.country ? event.country : "Local/VPN"}
                      </td>
                      <td className="px-6 py-4 text-env-muted whitespace-nowrap">
                        {new Date(event.timestamp).toLocaleString("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata"
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}
