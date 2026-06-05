import React from "react";
import { Container } from "@/components/shared/Container";
import { Transition } from "@/components/shared/Transition";
import { Card } from "@/components/shared/Card";
import { Project } from "@/types/portfolio";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/Icons";

interface ProjectsSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  projects: Project[];
  className?: string;
}

export function ProjectsSection({
  id = "projects",
  title,
  subtitle,
  projects,
  className,
}: ProjectsSectionProps) {
  return (
    <section id={id} className={className}>
      <Container className="py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Transition type="slide-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          </Transition>

          {subtitle && (
            <Transition type="slide-up" delay={0.1}>
              <p className="mt-4 max-w-2xl text-base text-zinc-650 dark:text-zinc-400">
                {subtitle}
              </p>
            </Transition>
          )}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <Transition
              key={project.id}
              type="slide-up"
              delay={idx * 0.05}
              className="flex"
            >
              <Card className="flex flex-col h-full w-full overflow-hidden">
                {project.image && (
                  <div className="relative -mx-6 -mt-6 aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {project.title}
                  </h3>
                  
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                      >
                        <GithubIcon className="h-4 w-4" />
                        Code
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </Transition>
          ))}
        </div>
      </Container>
    </section>
  );
}
