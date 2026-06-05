import React from "react";
import { Container } from "@/components/shared/Container";
import { SocialLink } from "@/types/portfolio";

interface FooterProps {
  socials: SocialLink[];
  copyrightName: string;
}

export function Footer({ socials, copyrightName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-zinc-500">
          &copy; {currentYear} {copyrightName}. All rights reserved.
        </p>

        <div className="flex gap-6">
          {socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label={social.label}
            >
              {social.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
