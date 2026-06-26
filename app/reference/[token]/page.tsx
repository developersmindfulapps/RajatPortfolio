"use client";

import React, { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function ReferenceTokenPage({ params }: PageProps) {
  const { token } = use(params);

  // Form states
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("manager");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [comment, setComment] = useState("");

  // UI state
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 1200) {
      setComment(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/references", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          comment: comment.trim(),
          company: company.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          sourceToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit recommendation.");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Submission Error:", err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  const isFormValid = name.trim().length > 0 && comment.trim().length > 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 select-none">
      <div className="w-full max-w-xl relative">
        
        {/* Soft background glow matching the design language */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-env-border to-env-text/5 opacity-30 blur-lg" />
        
        {/* Frosted glass card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full rounded-2xl border border-env-border bg-env-surface/40 backdrop-blur-xl p-6 md:p-8 shadow-xl text-env-text overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 space-y-5"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-black font-heading tracking-wide uppercase">
                  Thank You
                </h2>
                
                <p className="text-sm leading-relaxed text-env-text/90 font-body max-w-md mx-auto">
                  Thank you for taking the time to write a recommendation.
                  It has been received and will appear on my portfolio after approval.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-black font-heading tracking-wide uppercase leading-tight">
                    Write a Recommendation
                  </h1>
                  <p className="text-xs text-env-text-muted font-body">
                    Your testimonial is highly valued and helps document my professional contributions.
                  </p>
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-normal"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pointer-events-auto">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full rounded-lg border border-env-border bg-env-surface/30 px-4 py-2.5 text-sm placeholder-env-text/30 outline-none transition-all focus:border-env-text/40 focus:ring-2 focus:ring-env-text/10"
                    />
                  </div>

                  {/* Relationship and Company Fields (Grid layout on larger screens) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Relationship selector */}
                    <div className="space-y-1.5">
                      <label htmlFor="relationship" className="text-xs font-bold uppercase tracking-wider">
                        Relationship <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="relationship"
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          disabled={status === "submitting"}
                          className="w-full rounded-lg border border-env-border bg-env-surface/30 px-4 py-2.5 text-sm outline-none transition-all focus:border-env-text/40 focus:ring-2 focus:ring-env-text/10 appearance-none cursor-pointer"
                        >
                          <option value="manager" className="bg-zinc-900 text-white">Manager</option>
                          <option value="coworker" className="bg-zinc-900 text-white">Co-worker</option>
                          <option value="client" className="bg-zinc-900 text-white">Client</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-env-text-muted">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Company (Optional) */}
                    <div className="space-y-1.5">
                      <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider">
                        Company <span className="text-env-text-muted text-[10px] font-medium lowercase italic">(optional)</span>
                      </label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full rounded-lg border border-env-border bg-env-surface/30 px-4 py-2.5 text-sm placeholder-env-text/30 outline-none transition-all focus:border-env-text/40 focus:ring-2 focus:ring-env-text/10"
                      />
                    </div>
                  </div>

                  {/* LinkedIn Profile (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider">
                      LinkedIn Profile <span className="text-env-text-muted text-[10px] font-medium lowercase italic">(optional)</span>
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full rounded-lg border border-env-border bg-env-surface/30 px-4 py-2.5 text-sm placeholder-env-text/30 outline-none transition-all focus:border-env-text/40 focus:ring-2 focus:ring-env-text/10"
                    />
                  </div>

                  {/* Comment Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider">
                        Recommendation <span className="text-rose-500">*</span>
                      </label>
                      <span className={cn(
                        "text-[10px] font-semibold tracking-wider transition-colors",
                        comment.length >= 1100 ? "text-rose-500 font-bold" : "text-env-text-muted"
                      )}>
                        {comment.length} / 1200
                      </span>
                    </div>
                    <textarea
                      id="comment"
                      required
                      placeholder="Write your recommendation here..."
                      value={comment}
                      onChange={handleCommentChange}
                      disabled={status === "submitting"}
                      rows={5}
                      className="w-full rounded-lg border border-env-border bg-env-surface/30 px-4 py-2.5 text-sm placeholder-env-text/30 outline-none transition-all focus:border-env-text/40 focus:ring-2 focus:ring-env-text/10 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting" || !isFormValid}
                    className="w-full mt-4 inline-flex items-center justify-center rounded-lg bg-env-text text-env-surface font-bold uppercase tracking-wider text-xs py-3 px-6 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 outline-none shadow-md"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Recommendation"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
