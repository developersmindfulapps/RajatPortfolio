"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { 
  BarChart3, 
  Eye, 
  Download, 
  ExternalLink, 
  Globe, 
  ShieldAlert,
  Loader2,
  Calendar
} from "lucide-react";

interface PopularPage {
  page: string;
  count: number;
}

interface ProjectClick {
  project: string;
  count: number;
}

interface AssetDownload {
  name: string;
  count: number;
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
  sessionId: string;
}

interface AnalyticsData {
  totalEvents: number;
  popularPages: PopularPage[];
  projectClicks: ProjectClick[];
  assets: AssetDownload[];
  eventsLog: ActivityEvent[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        const resJson = await response.json();

        if (!response.ok) {
          throw new Error(resJson.error || "Failed to load analytics data.");
        }

        setData(resJson.data);
      } catch (err: any) {
        console.error("[analytics-page] Load error:", err);
        setError(err.message || "Failed to fetch analytics statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "portfolio_visit": return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30";
      case "resume_view": return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30";
      case "cv_download": return "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30";
      case "project_click": return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30";
      case "contact_submission": return "bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30";
      case "recommendation_submission": return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30";
      case "recommendations_panel_open": return "bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30";
      default: return "bg-env-text/10 text-env-text border border-env-border/30";
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
        <p className="text-xs uppercase tracking-widest text-env-muted font-semibold">Running statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center max-w-xl mx-auto my-12">
        <ShieldAlert className="h-10 w-10 text-red-400 mb-4" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-env-text mb-2">Error Loading Analytics</h3>
        <p className="text-xs text-red-400 leading-relaxed font-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview Stat Card */}
      <div className="flex items-center justify-between p-6 rounded-xl border border-env-border/30 bg-env-surface/85 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-env-text/5 rounded-xl border border-env-border/40 text-env-text">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-env-text">Total Events Tracked</h3>
            <p className="text-xs text-env-muted font-body mt-0.5">Aggregate events captured across the public portfolio website.</p>
          </div>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-env-text">
            {data?.totalEvents ?? 0}
          </span>
        </div>
      </div>

      {/* Grid of Aggregations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Popular Pages */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-widest text-env-muted flex items-center gap-2 select-none">
            <Eye className="h-4 w-4" />
            Popular Pages
          </h4>
          <Card hoverEffect={false} className="p-0 bg-env-surface/85 backdrop-blur-md border-env-border/30 shadow-xs">
            <div className="divide-y divide-env-border/15">
              {data?.popularPages.length === 0 ? (
                <div className="p-6 text-center text-env-muted italic select-none">No pages viewed yet.</div>
              ) : (
                data?.popularPages.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-5 py-3.5 text-xs gap-3">
                    <span className="font-mono text-env-text font-semibold truncate max-w-[200px]" title={item.page}>{item.page}</span>
                    <span className="font-bold bg-env-text/10 px-2.5 py-1 rounded-md text-env-text shrink-0">{item.count} hits</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Project Clicks */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-widest text-env-muted flex items-center gap-2 select-none">
            <ExternalLink className="h-4 w-4" />
            Project Clicks
          </h4>
          <Card hoverEffect={false} className="p-0 bg-env-surface/85 backdrop-blur-md border-env-border/30 shadow-xs">
            <div className="divide-y divide-env-border/15">
              {data?.projectClicks.length === 0 ? (
                <div className="p-6 text-center text-env-muted italic select-none">No project clicks recorded.</div>
              ) : (
                data?.projectClicks.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-5 py-3.5 text-xs gap-3">
                    <span className="font-medium text-env-text capitalize font-body truncate max-w-[200px]" title={item.project}>{item.project.replace(/-/g, " ")}</span>
                    <span className="font-bold bg-env-text/10 px-2.5 py-1 rounded-md text-env-text shrink-0">{item.count} clicks</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Asset Downloads */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-widest text-env-muted flex items-center gap-2 select-none">
            <Download className="h-4 w-4" />
            Asset Views / Downloads
          </h4>
          <Card hoverEffect={false} className="p-0 bg-env-surface/85 backdrop-blur-md border-env-border/30 shadow-xs">
            <div className="divide-y divide-env-border/15">
              {data?.assets.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3.5 text-xs gap-3">
                  <span className="font-medium text-env-text font-body truncate max-w-[200px]" title={item.name}>{item.name}</span>
                  <span className="font-bold bg-env-text/10 px-2.5 py-1 rounded-md text-env-text shrink-0">{item.count} events</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Analytics Event Feed */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-widest text-env-muted select-none flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Analytics Event Log (Last 50 Events)
        </h4>
        
        <Card hoverEffect={false} className="p-0 overflow-hidden bg-env-surface/85 backdrop-blur-md border-env-border/30 shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-env-border/40 bg-env-text/10 text-env-text uppercase font-bold tracking-wider select-none">
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Browser</th>
                  <th className="px-6 py-4">Session ID</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-env-border/15 font-body">
                {data?.eventsLog.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-env-muted italic select-none">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  data?.eventsLog.map((event) => (
                    <tr key={event._id} className="hover:bg-env-text/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${getEventBadgeClass(event.eventType)}`}>
                          {getEventLabel(event.eventType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-env-text font-mono font-medium max-w-[200px] truncate" title={event.route}>{event.route}</td>
                      <td className="px-6 py-4 text-env-text capitalize font-medium">{event.deviceType}</td>
                      <td className="px-6 py-4 text-env-text font-medium">{event.browser}</td>
                      <td className="px-6 py-4 text-env-muted font-mono">{event.sessionId.substring(0, 8)}...</td>
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
