"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { 
  Check, 
  X, 
  Trash2, 
  Search, 
  Mail, 
  ShieldAlert,
  Loader2,
  CalendarDays,
  Tag
} from "lucide-react";
import { LinkedinIcon } from "@/components/shared/Icons";

interface Reference {
  _id: string;
  publicId: string;
  name: string;
  relationship: "coworker" | "client" | "manager";
  company?: string;
  linkedin?: string;
  email?: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminRecommendationsPage() {
  const [statusTab, setStatusTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [recs, setRecs] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Local state to block inputs during mutation requests
  const [isMutating, setIsMutating] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch recommendations whenever tab or search term changes
  const fetchRecs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/references?status=${statusTab}&search=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load recommendations.");
      }

      setRecs(data.references);
      setError(null);
    } catch (err: any) {
      console.error("[recs-page] Fetch error:", err);
      setError(err.message || "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab, debouncedSearch]);

  // Moderation status updates
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    setIsMutating(id);
    try {
      const response = await fetch("/api/admin/references", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to moderate recommendation.");
      }

      // Remove from active tab list immediately for instant UI feedback
      setRecs(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to update recommendation.");
    } finally {
      setIsMutating(null);
    }
  };

  // Physical delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this recommendation? This action cannot be undone.")) {
      return;
    }

    setIsMutating(id);
    try {
      const response = await fetch(`/api/admin/references?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete recommendation.");
      }

      setRecs(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete recommendation.");
    } finally {
      setIsMutating(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Control bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-env-border/20 bg-env-surface/40 backdrop-blur-xs">
        
        {/* Tabs */}
        <div className="flex gap-1.5 p-1 bg-env-text/5 rounded-lg border border-env-border/20 w-full sm:w-auto">
          {(["pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`
                flex-1 sm:flex-initial px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider select-none transition-all
                ${statusTab === tab 
                  ? "bg-env-text text-env-surface shadow-xs" 
                  : "text-env-muted hover:text-env-text hover:bg-env-text/5"}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-env-muted" />
          <input
            type="text"
            placeholder="Search by Name or Company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-env-border bg-env-surface/50 text-xs outline-none focus:border-env-text focus:bg-env-surface transition-all text-env-text font-body"
          />
        </div>

      </div>

      {/* Main Content View */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-env-text opacity-80" />
          <p className="text-[10px] uppercase tracking-widest text-env-muted font-semibold">Querying recommendations...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center max-w-xl mx-auto my-8">
          <ShieldAlert className="h-8 w-8 text-red-400 mb-3" />
          <p className="text-xs text-red-400 leading-relaxed font-body">{error}</p>
        </div>
      ) : recs.length === 0 ? (
        <Card hoverEffect={false} className="p-12 text-center text-env-muted italic bg-env-surface/20 border-env-border/20 select-none">
          No {statusTab} recommendations found.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recs.map((rec) => (
            <Card 
              key={rec._id} 
              hoverEffect={false} 
              className="bg-env-surface/30 border-env-border/20 p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Name, Relationship & Company */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-env-text text-sm tracking-wide">{rec.name}</h4>
                    <p className="text-xs text-env-muted font-body mt-1">
                      {rec.company ? `${rec.company} • ` : ""}
                      <span className="capitalize">{rec.relationship}</span>
                    </p>
                  </div>
                  {rec.linkedin && (
                    <a 
                      href={rec.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-1.5 rounded-lg border border-env-border/50 text-env-muted hover:text-env-text hover:bg-env-text/5 transition-colors shrink-0"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Body Text */}
                <div className="bg-env-text/5 p-4 rounded-lg border border-env-border/10">
                  <p className="text-xs text-env-text leading-relaxed font-body whitespace-pre-wrap select-text">
                    "{rec.comment}"
                  </p>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-env-muted font-body">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(rec.createdAt).toLocaleDateString("en-GB", {
                      dateStyle: "medium",
                      timeZone: "Asia/Kolkata"
                    })}
                  </span>
                  {rec.email && (
                    <span className="flex items-center gap-1 select-all">
                      <Mail className="h-3.5 w-3.5" />
                      {rec.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    ID: {rec.publicId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-env-border/20 pt-4 mt-6">
                
                {/* Approve Button */}
                {statusTab !== "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isMutating !== null}
                    onClick={() => handleUpdateStatus(rec._id, "approved")}
                    className="h-8.5 px-3 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {isMutating === rec._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Approve
                      </span>
                    )}
                  </Button>
                )}

                {/* Reject Button */}
                {statusTab !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isMutating !== null}
                    onClick={() => handleUpdateStatus(rec._id, "rejected")}
                    className="h-8.5 px-3 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {isMutating === rec._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> Reject
                      </span>
                    )}
                  </Button>
                )}

                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isMutating !== null}
                  onClick={() => handleDelete(rec._id)}
                  className="h-8.5 px-3 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider"
                >
                  {isMutating === rec._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </span>
                  )}
                </Button>

              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
