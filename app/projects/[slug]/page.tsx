import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, CheckCircle2, Code2, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { SceneSelector } from "@/components/navigation/SceneSelector";
import { DETAILED_PROJECTS, ProjectDetail } from "@/lib/project-details";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(DETAILED_PROJECTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = DETAILED_PROJECTS[slug];

  if (!project) {
    return {
      title: "Project Not Found | Rajat Deep Singh",
    };
  }

  const baseUrl = "https://www.rajatdeepsingh.xyz";
  const url = `${baseUrl}/projects/${slug}`;

  return {
    title: `${project.title} | Case Study`,
    description: project.tagline,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: `${project.title} | Rajat Deep Singh`,
      description: project.tagline,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Rajat Deep Singh`,
      description: project.tagline,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project: ProjectDetail | undefined = DETAILED_PROJECTS[slug];

  if (!project) {
    notFound();
  }

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.overview,
    applicationCategory: project.category,
    operatingSystem: "Web, iOS, Android",
    author: {
      "@type": "Person",
      name: "Rajat Deep Singh",
      url: "https://www.rajatdeepsingh.xyz",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start p-6 md:p-12 lg:p-16 relative z-10 pt-[calc(env(safe-area-inset-top)+6rem)] text-env-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <SceneSelector className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-1/2 -translate-x-1/2 md:fixed md:top-6 md:right-6 md:left-auto md:translate-x-0" />

      <div className="w-full max-w-4xl space-y-10 pb-16">
        {/* Top Navigation */}
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-env-border bg-env-surface backdrop-blur-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-env-text hover:opacity-90 transition-all select-none hover:scale-[1.02] shadow-sm outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-env-text text-env-surface px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all select-none shadow-sm hover:scale-[1.02] outline-none"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Hero Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-env-border bg-env-surface backdrop-blur-xl text-env-text shadow-sm">
              {project.category}
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold backdrop-blur-xl shadow-sm">
              {project.status}
            </span>
          </div>
          <h1 className="text-2xl md:text-5xl font-extrabold uppercase font-heading tracking-wide leading-tight text-shadow-env text-env-text">
            {project.title}
          </h1>
          <p className="text-sm md:text-lg text-env-text/90 font-medium max-w-3xl leading-relaxed text-shadow-env">
            {project.tagline}
          </p>
        </header>

        {/* Overview & Problem & Solution Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Problem */}
          <Card hoverEffect={false} className="p-6 md:p-7 bg-env-surface backdrop-blur-xl border-env-border shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-xs" />
              <h2 className="font-extrabold text-sm uppercase tracking-wider font-heading text-env-text">
                The Problem &amp; Challenge
              </h2>
            </div>
            <p className="text-xs md:text-sm text-env-text/90 leading-relaxed font-body font-medium">
              {project.problem}
            </p>
          </Card>

          {/* Solution */}
          <Card hoverEffect={false} className="p-6 md:p-7 bg-env-surface backdrop-blur-xl border-env-border shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <h2 className="font-extrabold text-sm uppercase tracking-wider font-heading text-env-text">
                Engineering Solution
              </h2>
            </div>
            <p className="text-xs md:text-sm text-env-text/90 leading-relaxed font-body font-medium">
              {project.solution}
            </p>
          </Card>
        </div>

        {/* Technical Architecture */}
        <section className="space-y-4">
          <div className="border-b border-env-border/60 pb-2">
            <h2 className="text-base font-extrabold uppercase tracking-widest font-heading text-env-text text-shadow-env">
              Technical Architecture &amp; Decisions
            </h2>
          </div>
          <Card hoverEffect={false} className="p-6 md:p-7 bg-env-surface backdrop-blur-xl border-env-border shadow-lg space-y-3">
            <ul className="space-y-3.5">
              {project.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-env-text/90 leading-relaxed font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Key Contributions */}
        <section className="space-y-4">
          <div className="border-b border-env-border/60 pb-2">
            <h2 className="text-base font-extrabold uppercase tracking-widest font-heading text-env-text text-shadow-env">
              Rajat&apos;s Key Contributions
            </h2>
          </div>
          <Card hoverEffect={false} className="p-6 md:p-7 bg-env-surface backdrop-blur-xl border-env-border shadow-lg space-y-3">
            <ul className="space-y-3.5">
              {project.contributions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-env-text/90 leading-relaxed font-medium">
                  <Code2 className="h-4 w-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Technologies Stack */}
        <section className="space-y-4">
          <div className="border-b border-env-border/60 pb-2">
            <h2 className="text-base font-extrabold uppercase tracking-widest font-heading text-env-text text-shadow-env">
              Technologies &amp; Tools Used
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-env-border bg-env-surface backdrop-blur-xl text-env-text shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Verified Outcomes */}
        <section className="space-y-4">
          <div className="border-b border-env-border/60 pb-2">
            <h2 className="text-base font-extrabold uppercase tracking-widest font-heading text-env-text text-shadow-env">
              Verified Project Outcomes
            </h2>
          </div>
          <Card hoverEffect={false} className="p-6 md:p-7 bg-env-surface backdrop-blur-xl border-env-border shadow-lg space-y-3">
            <ul className="space-y-3.5">
              {project.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-env-text/90 leading-relaxed font-medium">
                  <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Bottom CTA Card */}
        <Card hoverEffect={false} className="p-8 bg-env-surface backdrop-blur-xl border-env-border shadow-lg text-center space-y-5">
          <h3 className="font-extrabold text-base md:text-xl uppercase tracking-wider font-heading text-env-text text-shadow-env">
            Explore More Engineering Work
          </h3>
          <p className="text-xs md:text-sm text-env-text/90 max-w-xl mx-auto font-medium">
            Discover Rajat Deep Singh&apos;s 8+ years of enterprise experience at Netcracker, Capgemini, and Infosys or explore other interactive case studies.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-lg bg-env-text text-env-surface px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all select-none shadow-sm hover:scale-[1.02] outline-none"
            >
              <span>View Enterprise Track Record</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/case-study"
              className="inline-flex items-center gap-2 rounded-lg border border-env-border bg-env-surface px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-env-text hover:opacity-90 transition-all select-none hover:scale-[1.02] shadow-sm outline-none"
            >
              <span>Portfolio Platform Case Study</span>
            </Link>
          </div>
        </Card>
      </div>

      <footer className="mt-8 text-center text-[10px] uppercase tracking-widest text-env-muted select-none pb-safe">
        Rajat Deep Singh • Senior Frontend Engineer
      </footer>
    </main>
  );
}
