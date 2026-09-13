import { Metadata } from "next";
import { ExperienceClient } from "@/components/experience/ExperienceClient";

export const metadata: Metadata = {
  title: "Enterprise Frontend Engineering Experience & Track Record",
  description:
    "Comprehensive career history and architectural accomplishments of Rajat Deep Singh across 8+ years at Netcracker, Capgemini, and Infosys. Angular Signals, React, Microfrontends, and Performance Optimization.",
  alternates: {
    canonical: "https://www.rajatdeepsingh.xyz/experience",
  },
  openGraph: {
    url: "https://www.rajatdeepsingh.xyz/experience",
    title: "Enterprise Frontend Experience | Rajat Deep Singh",
    description:
      "Explore Rajat Deep Singh's 8+ years of enterprise frontend engineering track record across Netcracker, Capgemini, and Infosys.",
  },
};

export default function ExperiencePage() {
  return (
    <main className="w-full min-h-screen">
      <ExperienceClient />
    </main>
  );
}
