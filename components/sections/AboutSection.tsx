import React from "react";
import { Container } from "@/components/shared/Container";
import { Transition } from "@/components/shared/Transition";

interface AboutSectionProps {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  media?: React.ReactNode;
  mediaPosition?: "left" | "right";
  className?: string;
}

export function AboutSection({
  id = "about",
  title,
  content,
  media,
  mediaPosition = "right",
  className,
}: AboutSectionProps) {
  return (
    <section id={id} className={className}>
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Main Info */}
          <div
            className={`lg:col-span-7 ${
              mediaPosition === "left" && media ? "lg:order-2" : ""
            }`}
          >
            <Transition type="slide-up">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            </Transition>
            
            <Transition type="slide-up" delay={0.1}>
              <div className="mt-6 space-y-6 text-base text-zinc-600 dark:text-zinc-400">
                {content}
              </div>
            </Transition>
          </div>

          {/* Media Column */}
          {media && (
            <div
              className={`lg:col-span-5 ${
                mediaPosition === "left" ? "lg:order-1" : ""
              }`}
            >
              <Transition type="scale" delay={0.2}>
                <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 aspect-square flex items-center justify-center">
                  {media}
                </div>
              </Transition>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
