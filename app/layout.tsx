import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { EnvironmentBg } from "@/components/scene/EnvironmentBg";

export const metadata: Metadata = {
  title: "Personal Portfolio | Professional Work & Projects",
  description: "A showcase of engineering experience, projects, skills, and professional accomplishments.",
  keywords: ["Software Engineer", "Developer Portfolio", "Web Development", "TypeScript", "React", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hour = new Date().getHours();
                  var theme = 'night';
                  if (hour >= 5 && hour < 7) theme = 'sunrise';
                  else if (hour >= 7 && hour < 18) theme = 'day';
                  else if (hour >= 18 && hour < 20) theme = 'sunset';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-env-text">
        <EnvironmentBg>
          {children}
        </EnvironmentBg>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
