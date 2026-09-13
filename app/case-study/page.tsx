import { Metadata } from "next";
import { CaseStudyClient } from "@/components/case-study/CaseStudyClient";

export const metadata: Metadata = {
  title: "Personal Portfolio Platform Case Study — Full-Stack Next.js Architecture",
  description:
    "Comprehensive architecture case study of Rajat Deep Singh's personal portfolio platform. Featuring real-time analytics, dynamic time-aware shaders, tokenized recommendation workflows, and AI Assistant integration.",
  alternates: {
    canonical: "https://www.rajatdeepsingh.xyz/case-study",
  },
  openGraph: {
    url: "https://www.rajatdeepsingh.xyz/case-study",
    title: "Portfolio Platform Engineering Case Study | Rajat Deep Singh",
    description:
      "Full-stack Next.js App Router engineering breakdown: dynamic shaders, tokenized recommendations, edge security, and real-time analytics.",
  },
};

export default function CaseStudyPage() {
  return (
    <main className="w-full min-h-screen">
      <CaseStudyClient />
    </main>
  );
}
