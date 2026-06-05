import React from "react";
import { Container } from "@/components/shared/Container";
import { Transition } from "@/components/shared/Transition";
import { Card } from "@/components/shared/Card";

interface ContactSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  infoCards?: React.ReactNode;
  formNode?: React.ReactNode;
  className?: string;
}

export function ContactSection({
  id = "contact",
  title,
  subtitle,
  infoCards,
  formNode,
  className,
}: ContactSectionProps) {
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

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Contact info column */}
          {infoCards && (
            <div className={`space-y-6 ${formNode ? "lg:col-span-5" : "lg:col-span-12 max-w-2xl mx-auto"}`}>
              {infoCards}
            </div>
          )}

          {/* Form column */}
          {formNode && (
            <div className={`w-full ${infoCards ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl mx-auto"}`}>
              <Transition type="slide-up" delay={0.2}>
                <Card className="p-8">
                  {formNode}
                </Card>
              </Transition>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
