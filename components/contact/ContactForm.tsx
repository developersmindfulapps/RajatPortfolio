"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/shared/Button";
import { trackContactSubmission } from "@/lib/analytics";

// ─── Turnstile widget (loaded lazily via script tag) ──────────────────────────

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

type FormState = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  captcha?: string;
}

import { useTurnstile } from "@/hooks/useTurnstile";

// ─── ContactForm ──────────────────────────────────────────────────────────────

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, resetWidget } = useTurnstile(
    turnstileContainerRef
  );

  const inputClass =
    "rounded-lg border border-env-border bg-transparent px-3 py-2 text-xs outline-none " +
    "focus:border-env-text transition-colors text-env-text font-body w-full";

  const errorInputClass = "border-red-400/70";

  // ── Client-side validation ─────────────────────────────────────────────────

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim() || name.trim().length < 2)
      errors.name = "At least 2 characters required.";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!email.trim() || !emailOk) errors.email = "Valid email required.";

    if (!message.trim() || message.trim().length < 10)
      errors.message = "At least 10 characters required.";

    if (!turnstileToken) errors.captcha = "Please complete the verification.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          turnstileToken,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setFormState("error");
        resetWidget();
        return;
      }

      setFormState("success");
      trackContactSubmission();
    } catch {
      setServerError("Network error. Please check your connection and retry.");
      setFormState("error");
      resetWidget();
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "oklch(from var(--env-text) l c h / 0.12)",
          }}
        >
          {/* Checkmark */}
          <svg
            className="h-6 w-6 text-env-text"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-env-text">Message sent!</p>
          <p className="text-xs text-env-muted mt-1">
            {`Thanks for reaching out. I'll get back to you soon.`}
          </p>
        </div>
        <button
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            setFormState("idle");
            setServerError(null);
            setFieldErrors({});
          }}
          className="mt-2 text-[10px] font-bold uppercase tracking-widest text-env-muted hover:text-env-text transition-colors underline underline-offset-2"
        >
          Send another
        </button>
      </div>
    );
  }

  // ── Default form ───────────────────────────────────────────────────────────

  const isLoading = formState === "loading";

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-name"
            className="text-[10px] font-bold uppercase tracking-widest text-env-muted"
          >
            Name
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            disabled={isLoading}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name)
                setFieldErrors((p) => ({ ...p, name: undefined }));
            }}
            className={`${inputClass} ${fieldErrors.name ? errorInputClass : ""}`}
          />
          {fieldErrors.name && (
            <p className="text-[10px] text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-email"
            className="text-[10px] font-bold uppercase tracking-widest text-env-muted"
          >
            Email
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email)
                setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            className={`${inputClass} ${fieldErrors.email ? errorInputClass : ""}`}
          />
          {fieldErrors.email && (
            <p className="text-[10px] text-red-400">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-[10px] font-bold uppercase tracking-widest text-env-muted"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          disabled={isLoading}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message)
              setFieldErrors((p) => ({ ...p, message: undefined }));
          }}
          className={`${inputClass} resize-none ${fieldErrors.message ? errorInputClass : ""}`}
        />
        {fieldErrors.message && (
          <p className="text-[10px] text-red-400">{fieldErrors.message}</p>
        )}
      </div>

      {/* Cloudflare Turnstile */}
      <div className="flex flex-col gap-1.5">
        <div ref={turnstileContainerRef} className="w-full rounded-lg overflow-hidden" />
        {fieldErrors.captcha && (
          <p className="text-[10px] text-red-400">{fieldErrors.captcha}</p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <p className="text-[10px] text-red-400 text-center">{serverError}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-xs font-bold uppercase tracking-widest"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-3.5 w-3.5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
