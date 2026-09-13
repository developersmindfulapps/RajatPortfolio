import { Metadata } from "next";
import { HomeInteractive } from "@/components/home/HomeInteractive";
import { SemanticPortfolioContent } from "@/components/home/SemanticPortfolioContent";

export const metadata: Metadata = {
  title: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
  description:
    "Official portfolio of Rajat Deep Singh — Senior Frontend Engineer with 8+ years of enterprise experience building scalable web applications, microfrontends, and high-performance user interfaces with Angular, React, Next.js, and TypeScript.",
  alternates: {
    canonical: "https://www.rajatdeepsingh.xyz",
  },
  openGraph: {
    url: "https://www.rajatdeepsingh.xyz",
    title: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
    description:
      "Senior Frontend Engineer with 8+ years of enterprise experience building scalable web applications, microfrontends, and high-performance user interfaces with Angular, React, Next.js, and TypeScript.",
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Search Engine & Accessibility Semantic Content Layer */}
      <SemanticPortfolioContent />
      {/* Primary Visual & Interactive Constellation UI */}
      <HomeInteractive />
    </main>
  );
}
