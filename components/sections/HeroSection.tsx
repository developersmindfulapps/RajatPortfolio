import React from "react";
import { Container } from "@/components/shared/Container";
import { Transition } from "@/components/shared/Transition";

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  actions,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-24 md:py-32">
      <Container className="relative z-10 flex flex-col items-center text-center">
        <Transition type="slide-up" delay={0.1}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Transition>

        <Transition type="slide-up" delay={0.2}>
          <div className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            {subtitle}
          </div>
        </Transition>

        {actions && (
          <Transition type="slide-up" delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {actions}
            </div>
          </Transition>
        )}

        {children}
      </Container>
    </section>
  );
}
