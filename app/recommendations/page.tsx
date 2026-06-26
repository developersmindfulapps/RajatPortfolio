import React from "react";

export default function RecommendationsPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center text-env-text bg-transparent p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold font-heading tracking-wide uppercase">
          Recommendations
        </h1>
        <p className="text-sm text-env-muted font-body">
          Future route for displaying coworker, manager, and client testimonials.
        </p>
      </div>
    </div>
  );
}
