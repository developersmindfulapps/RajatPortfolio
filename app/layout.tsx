import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { EnvironmentBg } from "@/components/scene/EnvironmentBg";
import { AiAssistant } from "@/components/ai/AiAssistant";
import { getRootJsonLd } from "@/lib/structured-data";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070913" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rajatdeepsingh.xyz"),
  title: {
    default: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
    template: "%s | Rajat Deep Singh",
  },
  description:
    "Portfolio of Rajat Deep Singh — Senior Frontend Engineer with 8+ years of enterprise experience specializing in Angular, React, Next.js, TypeScript, Microfrontends, and Performance Optimization.",
  keywords: [
    "Rajat Deep Singh",
    "Rajat Deep Singh developer",
    "Rajat Deep Singh software engineer",
    "Rajat Deep Singh frontend developer",
    "Rajat Deep Singh Angular developer",
    "Rajat Deep Singh React developer",
    "Senior Frontend Engineer",
    "Angular Developer",
    "React Developer",
    "Next.js Consultant",
    "Freelance Frontend Developer Gurgaon",
    "Freelance Web Developer Delhi NCR",
    "Microfrontend Architecture",
    "Web Performance Optimization",
  ],
  authors: [{ name: "Rajat Deep Singh", url: "https://www.rajatdeepsingh.xyz" }],
  creator: "Rajat Deep Singh",
  publisher: "Rajat Deep Singh",
  alternates: {
    canonical: "https://www.rajatdeepsingh.xyz",
  },
  icons: {
    icon: [
      { url: "/assets/ai/rajat-ai.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/assets/ai/rajat-ai.png",
    apple: "/assets/ai/rajat-ai.png",
  },
  openGraph: {
    type: "profile",
    firstName: "Rajat",
    lastName: "Singh",
    username: "rajatdeepsingh2417",
    gender: "male",
    locale: "en_US",
    url: "https://www.rajatdeepsingh.xyz",
    title: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
    description:
      "Senior Frontend Engineer with 8+ years of enterprise experience building scalable web applications, microfrontends, and high-performance user interfaces with Angular, React, Next.js, and TypeScript.",
    siteName: "Rajat Deep Singh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
    description:
      "Senior Frontend Engineer with 8+ years of enterprise experience building scalable web applications with Angular, React, Next.js, and TypeScript.",
    creator: "@rajatdeepsingh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdSchemas = getRootJsonLd();

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
        {jsonLdSchemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-env-text">
        <EnvironmentBg>
          {children}
          <AiAssistant />
        </EnvironmentBg>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
