import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function Section({
  title,
  subtitle,
  children,
  align = "left",
  className,
  id,
}: SectionProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "py-10 md:py-16 border-b border-env-border/10 last:border-0",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {(title || subtitle) && (
        <div 
          className={cn(
            "mb-8 md:mb-12 space-y-2 max-w-2xl",
            align === "center" ? "mx-auto" : "mx-0"
          )}
        >
          {title && (
            <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-wide text-env-text">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="font-body text-xs sm:text-sm text-env-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
