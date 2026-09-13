"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  RotateCcw,
  User,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  trackAiAssistantOpen,
  trackAiMessageSent,
  trackAiContactCreated,
  trackAiProactiveShown,
  trackAiSceneCommentShown,
} from "@/lib/analytics";
import { AvatarFigure, AvatarState } from "./AvatarFigure";
import {
  getNextProactiveMessage,
  recordMessageShown,
  isCooldownActive,
  ProactiveMessage,
} from "@/lib/ai/personality";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolStatus?: string;
  isStreaming?: boolean;
}

const STARTER_QUESTIONS = [
  "Tell me about Rajat",
  "What did Rajat build at Netcracker?",
  "Tell me about Bat Cave",
  "What are Rajat's strongest technical skills?",
  "How can I work with Rajat?",
];

const STORAGE_KEY = "rajat_portfolio_ai_messages_v1";

let messageCounter = 0;
function generateMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}_${Date.now()}_${messageCounter}`;
}

function renderInlineFormatting(text: string, isUser = false): React.ReactNode[] {
  const regex = /(\[.*?\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*|`.*?`|https?:\/\/[^\s]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={i}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-semibold transition-colors inline-flex items-center gap-0.5 mx-0.5 cursor-pointer ${
            isUser ? "text-sky-200 hover:text-white" : "text-sky-400 hover:text-sky-300"
          }`}
        >
          <span>{linkText}</span>
          <ArrowUpRight className="h-3 w-3 inline shrink-0" />
        </a>
      );
    }

    // Raw URL: https://...
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-semibold transition-colors inline-flex items-center gap-0.5 mx-0.5 cursor-pointer ${
            isUser ? "text-sky-200 hover:text-white" : "text-sky-400 hover:text-sky-300"
          }`}
        >
          <span>{part}</span>
          <ArrowUpRight className="h-3 w-3 inline shrink-0" />
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className={`font-semibold ${isUser ? "text-inherit" : "text-env-text"}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={i} className="bg-env-text/10 px-1 py-0.5 rounded text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Plain text
    return <span key={i}>{part}</span>;
  });
}

function FormattedMessage({ content, isUser = false }: { content: string; isUser?: boolean }) {
  if (!content) return null;

  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listIndex = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${listIndex++}`} className="space-y-1.5 my-1.5 pl-0.5">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    // Strip Markdown headers (### or ## or #)
    const headerMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headerMatch) {
      flushList();
      blocks.push(
        <div key={`head-${idx}`} className="font-bold text-env-text text-xs md:text-[13px] font-heading mt-2 mb-1">
          {renderInlineFormatting(headerMatch[1], isUser)}
        </div>
      );
      return;
    }

    // Bullet items (- or * or •)
    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      currentList.push(
        <li key={`li-${idx}`} className="flex items-start gap-1.5 text-xs md:text-[13px] leading-relaxed">
          <span className="text-env-text/60 font-bold shrink-0 select-none">•</span>
          <span className="flex-1">{renderInlineFormatting(bulletMatch[1], isUser)}</span>
        </li>
      );
      return;
    }

    // Standard line
    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="text-xs md:text-[13px] leading-relaxed my-0.5">
        {renderInlineFormatting(line, isUser)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1">{blocks}</div>;
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeToolLabel, setActiveToolLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [proactiveBubble, setProactiveBubble] = useState<ProactiveMessage | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streamingTextRef = useRef<string>("");
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger temporary reaction animation
  const triggerReactionState = useCallback((durationMs = 2400) => {
    setAvatarState("reaction");
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => {
      setAvatarState("idle");
    }, durationMs);
  }, []);

  // Display proactive speech bubble
  const showProactiveBubble = useCallback(
    (msg: ProactiveMessage) => {
      if (isOpen || isLoading) return;
      setProactiveBubble(msg);
      recordMessageShown(msg.id);
      triggerReactionState(2000);

      if (msg.type === "scene" && msg.scene) {
        trackAiSceneCommentShown(msg.scene);
      } else {
        trackAiProactiveShown(msg.id);
      }

      if (bubbleDismissTimerRef.current) clearTimeout(bubbleDismissTimerRef.current);
      bubbleDismissTimerRef.current = setTimeout(() => {
        setProactiveBubble(null);
      }, 7500);
    },
    [isOpen, isLoading, triggerReactionState]
  );

  // 1. Initial proactive suggestion timer
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialTimer = setTimeout(() => {
      if (!isCooldownActive() && !isOpen) {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "night";
        const msg = getNextProactiveMessage("idle_time", currentTheme);
        if (msg) showProactiveBubble(msg);
      }
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, [isOpen, showProactiveBubble]);

  // 2. Scene Change Observer
  useEffect(() => {
    if (typeof window === "undefined") return;

    let previousTheme = document.documentElement.getAttribute("data-theme") || "night";

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme") || "night";
          if (newTheme !== previousTheme) {
            previousTheme = newTheme;
            if (!isCooldownActive() && !isOpen && !isLoading) {
              const msg = getNextProactiveMessage("scene_change", newTheme);
              if (msg) showProactiveBubble(msg);
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [isOpen, isLoading, showProactiveBubble]);

  // 3. Persist messages to sessionStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        const toSave = messages.map(({ id, role, content }) => ({ id, role, content }));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  // 4. Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth >= 768) {
        const timer = setTimeout(() => inputRef.current?.focus(), 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, messages, scrollToBottom]);

  // 5. Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setProactiveBubble(null);
    triggerReactionState(1500);
    trackAiAssistantOpen();
  };

  const handleClose = () => {
    setIsOpen(false);
    setAvatarState("idle");
  };

  const handleClear = () => {
    setMessages([]);
    setErrorMessage(null);
    setActiveToolLabel(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput("");
    setErrorMessage(null);
    setActiveToolLabel(null);
    setAvatarState("thinking");
    streamingTextRef.current = "";

    const userMessageId = generateMessageId("user");
    const assistantMessageId = generateMessageId("asst");

    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMessageId, role: "user", content: text },
    ];

    setMessages(newMessages);
    setIsLoading(true);
    trackAiMessageSent(text.slice(0, 50));

    // Add empty assistant placeholder
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Streaming reader not available.");
      }

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const dataStr = trimmed.replace(/^data:\s*/, "");
          if (dataStr === "[DONE]") continue;

          try {
            const event = JSON.parse(dataStr);

            if (event.type === "token" && event.delta) {
              streamingTextRef.current = `${streamingTextRef.current}${event.delta}`;
              const currentAccumulated = streamingTextRef.current;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: currentAccumulated, isStreaming: true }
                    : msg
                )
              );
            } else if (event.type === "tool_start") {
              setActiveToolLabel(event.label || "Executing action...");
              setAvatarState("thinking");
              if (event.tool === "create_contact_request") {
                trackAiContactCreated();
              }
            } else if (event.type === "tool_done") {
              setActiveToolLabel(null);
              triggerReactionState(1800);
            } else if (event.type === "error") {
              throw new Error(event.message || "An error occurred during response generation.");
            }
          } catch (jsonErr) {
            console.warn("Failed to parse SSE line:", jsonErr);
          }
        }
      }

      // Finalize assistant message
      const finalAccumulated = streamingTextRef.current;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: finalAccumulated || "I have received your request.", isStreaming: false }
            : msg
        )
      );
      triggerReactionState(1600);
    } catch (err: unknown) {
      const errorStr = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(errorStr);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId || msg.content.length > 0)
      );
      setAvatarState("idle");
    } finally {
      setIsLoading(false);
      setActiveToolLabel(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Rajat Avatar Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none select-none">
            {/* Proactive Speech Bubble */}
            <AnimatePresence>
              {proactiveBubble && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={handleOpen}
                  className="pointer-events-auto mb-2.5 mr-1 max-w-[260px] md:max-w-[300px] cursor-pointer rounded-2xl border border-env-border/80 bg-env-surface/95 px-3.5 py-2.5 shadow-xl backdrop-blur-xl transition-transform hover:scale-[1.02]"
                  style={{
                    boxShadow: "0 8px 32px var(--env-shadow), 0 0 16px var(--env-border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-env-text leading-snug font-body">
                      {proactiveBubble.text}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProactiveBubble(null);
                      }}
                      className="text-env-muted hover:text-env-text p-0.5 rounded cursor-pointer shrink-0"
                      aria-label="Dismiss message"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  {/* Subtle speech pointer notch */}
                  <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-env-border/80 bg-env-surface" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar Button */}
            <div className="relative pointer-events-auto">
              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && !proactiveBubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute -top-9 right-0 whitespace-nowrap rounded-lg border border-env-border bg-env-surface/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-env-text shadow-md backdrop-blur-md pointer-events-none"
                  >
                    {"Talk to Rajat's AI"}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={handleOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Talk to Rajat's AI Assistant"
                className="relative flex items-center justify-center rounded-full border border-env-border/80 bg-env-surface/85 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.06] hover:border-env-text/50 focus:outline-none focus:ring-2 focus:ring-env-text/50 cursor-pointer group"
                style={{
                  boxShadow: "0 10px 36px var(--env-shadow), 0 0 20px var(--env-border)",
                }}
              >
                <AvatarFigure
                  size="lg"
                  state={avatarState}
                  showIndicator={true}
                  indicatorStatus={avatarState === "thinking" ? "thinking" : avatarState === "reaction" ? "reaction" : "online"}
                />
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Assistant Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end md:items-end justify-center md:justify-end md:p-6">
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs md:hidden pointer-events-auto"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="pointer-events-auto w-full md:w-[440px] h-[82vh] md:h-[600px] max-h-[85dvh] flex flex-col rounded-t-3xl md:rounded-2xl border border-env-border bg-env-surface/95 shadow-2xl backdrop-blur-2xl overflow-hidden transition-colors"
              style={{
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.35), 0 0 24px var(--env-border)",
              }}
            >
              {/* Header with Rajat Avatar */}
              <div className="flex items-center justify-between border-b border-env-border/60 px-4 md:px-5 py-3 bg-env-surface/50 backdrop-blur-md select-none">
                <div className="flex items-center gap-3">
                  <AvatarFigure
                    size="md"
                    state={avatarState}
                    showIndicator={true}
                    indicatorStatus={avatarState === "thinking" ? "thinking" : avatarState === "reaction" ? "reaction" : "online"}
                  />
                  <div>
                    <h3 className="font-heading text-xs md:text-sm font-bold uppercase tracking-wider text-env-text leading-tight">
                      {"Rajat's AI Assistant"}
                    </h3>
                    <p className="text-[10px] text-env-muted font-medium flex items-center gap-1">
                      <span>
                        {avatarState === "thinking"
                          ? "Thinking..."
                          : avatarState === "reaction"
                          ? "Responding..."
                          : "Verified Portfolio Knowledge"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={handleClear}
                      title="Clear conversation"
                      aria-label="Clear conversation"
                      className="rounded-lg p-1.5 text-env-muted hover:text-env-text hover:bg-env-text/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    title="Close assistant"
                    aria-label="Close assistant"
                    className="rounded-lg p-1.5 text-env-muted hover:text-env-text hover:bg-env-text/10 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar text-xs md:text-sm">
                {messages.length === 0 ? (
                  // Empty State with Starter Chips
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-3 select-none">
                    <AvatarFigure size="lg" state={avatarState} />
                    <div className="space-y-1 max-w-xs">
                      <h4 className="font-heading font-bold text-sm text-env-text uppercase tracking-wider">
                        {"Ask me about Rajat"}
                      </h4>
                      <p className="text-xs text-env-muted leading-relaxed">
                        {"I can answer questions about Rajat's 8+ years of engineering experience, skills, projects, or help you get in touch."}
                      </p>
                    </div>

                    {/* Starter Suggestions */}
                    <div className="w-full pt-2 space-y-2 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-env-muted px-1">
                        Suggested questions:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {STARTER_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="w-full text-left rounded-xl border border-env-border/60 bg-env-text/5 hover:bg-env-text/10 px-3 py-2 text-xs font-medium text-env-text transition-all duration-200 flex items-center justify-between group cursor-pointer hover:border-env-text/40"
                          >
                            <span>{q}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-env-muted group-hover:text-env-text transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Message Thread
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar beside AI messages */}
                      {msg.role === "assistant" && (
                        <div className="shrink-0 mt-0.5">
                          <AvatarFigure
                            size="sm"
                            state={msg.isStreaming ? "thinking" : "idle"}
                          />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 max-w-[84%] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-env-text text-env-surface font-medium rounded-tr-xs shadow-xs"
                            : "bg-env-text/5 border border-env-border/60 text-env-text rounded-tl-xs"
                        }`}
                      >
                        <FormattedMessage
                          content={msg.content || (msg.isStreaming ? "..." : "")}
                          isUser={msg.role === "user"}
                        />
                      </div>

                      {/* User message icon */}
                      {msg.role === "user" && (
                        <div className="h-6 w-6 rounded-lg bg-env-text/20 border border-env-border flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-3 w-3 text-env-text" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Active Tool Label Badge */}
                {activeToolLabel && (
                  <div className="flex items-center gap-2 text-[11px] text-env-muted bg-env-text/5 border border-env-border/40 rounded-xl px-3 py-1.5 w-fit animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin text-env-text" />
                    <span>{activeToolLabel}</span>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p>{errorMessage}</p>
                      <button
                        onClick={() => sendMessage()}
                        className="text-[11px] font-bold underline hover:text-rose-300 cursor-pointer"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="border-t border-env-border/60 p-3 bg-env-surface/60 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Rajat's experience, skills..."
                    maxLength={1000}
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-env-border/80 bg-env-text/5 px-3.5 py-2.5 text-xs md:text-sm text-env-text placeholder:text-env-muted/70 focus:outline-none focus:border-env-text/60 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-env-text text-env-surface hover:opacity-90 transition-all disabled:opacity-40 disabled:hover:opacity-40 cursor-pointer shrink-0 shadow-xs"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>
                <div className="flex items-center justify-between pt-1.5 px-1 text-[10px] text-env-muted select-none">
                  <span>Press Enter to send</span>
                  <span>{"Rajat's Portfolio AI"}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
