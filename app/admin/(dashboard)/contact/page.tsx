"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { 
  Check, 
  Archive, 
  Trash2, 
  Search, 
  Mail, 
  MailOpen, 
  CalendarDays,
  ShieldAlert,
  Loader2
} from "lucide-react";

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived" | "deleted";
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local mutation state
  const [isMutating, setIsMutating] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch contact messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/contact?search=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load contact submissions.");
      }

      setMessages(data.messages);
      setError(null);
    } catch (err: any) {
      console.error("[contacts-page] Fetch error:", err);
      setError(err.message || "Failed to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Update status (mark read, archive, mark unread)
  const handleUpdateStatus = async (id: string, newStatus: "read" | "archived" | "unread") => {
    setIsMutating(id);
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update message status.");
      }

      // Locally update state for immediate response
      setMessages(prev => 
        prev.map(msg => msg._id === id ? { ...msg, status: newStatus } : msg)
      );
    } catch (err: any) {
      alert(err.message || "Failed to update message.");
    } finally {
      setIsMutating(null);
    }
  };

  // Soft delete message (updates status to "deleted")
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message? It will be archived on the server but hidden from the dashboard.")) {
      return;
    }

    setIsMutating(id);
    try {
      const response = await fetch(`/api/admin/contact?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete message.");
      }

      // Remove from active list
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete message.");
    } finally {
      setIsMutating(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "unread": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "read": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "archived": return "bg-env-text/5 text-env-muted border border-env-border/20";
      default: return "bg-env-text/5 text-env-muted border border-env-border/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Control bar: Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-env-border/20 bg-env-surface/40 backdrop-blur-xs">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-env-muted select-none">
            Inbound Messages
          </h3>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-env-muted" />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-env-border bg-env-surface/50 text-xs outline-none focus:border-env-text focus:bg-env-surface transition-all text-env-text font-body"
          />
        </div>
      </div>

      {/* Main Content Feed */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-env-text opacity-80" />
          <p className="text-[10px] uppercase tracking-widest text-env-muted font-semibold">Reading messages...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center max-w-xl mx-auto my-8">
          <ShieldAlert className="h-8 w-8 text-red-400 mb-3" />
          <p className="text-xs text-red-400 leading-relaxed font-body">{error}</p>
        </div>
      ) : messages.length === 0 ? (
        <Card hoverEffect={false} className="p-12 text-center text-env-muted italic bg-env-surface/20 border-env-border/20 select-none">
          No contact messages found.
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUnread = msg.status === "unread";
            return (
              <Card 
                key={msg._id} 
                hoverEffect={false} 
                className={`
                  bg-env-surface/30 border p-6 flex flex-col transition-all duration-300
                  ${isUnread ? "border-env-text/50 bg-env-surface/50 shadow-md" : "border-env-border/20"}
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-bold text-env-text text-sm tracking-wide">{msg.name}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider ${getStatusBadgeClass(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <a 
                      href={`mailto:${msg.email}`} 
                      className="text-xs text-env-muted hover:text-env-text hover:underline transition-all inline-flex items-center gap-1.5 font-body select-all"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {msg.email}
                    </a>
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-[10px] text-env-muted font-body inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(msg.createdAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata"
                    })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="mt-4 bg-env-text/5 p-4 rounded-lg border border-env-border/10">
                  <p className="text-xs text-env-text leading-relaxed font-body whitespace-pre-wrap select-text">
                    {msg.message}
                  </p>
                </div>

                {/* Actions row */}
                <div className="flex justify-end gap-2.5 border-t border-env-border/20 pt-4 mt-6">
                  
                  {/* Toggle Read/Unread */}
                  {isUnread ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating !== null}
                      onClick={() => handleUpdateStatus(msg._id, "read")}
                      className="h-8.5 px-3 text-[10px] font-bold uppercase tracking-wider text-env-text border-env-border/50 hover:bg-env-text/5"
                    >
                      {isMutating === msg._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Mark Read
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating !== null}
                      onClick={() => handleUpdateStatus(msg._id, "unread")}
                      className="h-8.5 px-3 text-[10px] font-bold uppercase tracking-wider text-env-muted border-env-border/50 hover:bg-env-text/5"
                    >
                      {isMutating === msg._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <MailOpen className="h-3.5 w-3.5" /> Mark Unread
                        </span>
                      )}
                    </Button>
                  )}

                  {/* Archive Button */}
                  {msg.status !== "archived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating !== null}
                      onClick={() => handleUpdateStatus(msg._id, "archived")}
                      className="h-8.5 px-3 text-[10px] font-bold uppercase tracking-wider text-env-muted border-env-border/50 hover:bg-env-text/5"
                    >
                      {isMutating === msg._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Archive className="h-3.5 w-3.5" /> Archive
                        </span>
                      )}
                    </Button>
                  )}

                  {/* Delete Button (Soft Delete) */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isMutating !== null}
                    onClick={() => handleDelete(msg._id)}
                    className="h-8.5 px-3 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {isMutating === msg._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </span>
                    )}
                  </Button>

                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
