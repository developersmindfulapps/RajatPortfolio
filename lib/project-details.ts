export interface ProjectDetail {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  period?: string;
  liveUrl?: string;
  githubUrl?: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  contributions: string[];
  technologies: string[];
  outcomes: string[];
}

export const DETAILED_PROJECTS: Record<string, ProjectDetail> = {
  "bat-cave": {
    slug: "bat-cave",
    title: "Bat Cave — Indoor Cricket Facility Booking Platform",
    tagline: "Guided digital reservation experience and modern web platform for an indoor sports facility.",
    category: "Web Application & Booking System",
    status: "Live in Production",
    liveUrl: "https://bat-cave-theta.vercel.app/",
    overview:
      "Bat Cave is an indoor cricket training and practice facility located in Baramulla, Jammu & Kashmir. The web platform provides athletes, teams, and hobbyists with an effortless way to explore lane availability, coaching packages, and book practice sessions online.",
    problem:
      "Traditional sports facilities rely on manual phone calls, WhatsApp messages, or on-site paper scheduling, leading to double bookings, customer friction, and missed revenue opportunities during peak evening hours.",
    solution:
      "Engineered a fast, mobile-first booking platform with a guided multi-step flow that allows users to select time slots, choose practice lanes, view pricing transparently, and confirm bookings in seconds.",
    architecture: [
      "Modern Next.js and React architecture with modular UI components.",
      "Optimized client-side state handling for multi-step slot selection.",
      "Lightweight styling with Tailwind CSS ensuring fast mobile loading speeds even on 3G/4G connections.",
      "Server-side rendering for search engine discoverability and fast initial content delivery."
    ],
    contributions: [
      "Designed and developed the entire responsive frontend UI from ground up.",
      "Implemented step-by-step booking logic with validation and real-time state synchronization.",
      "Optimized asset loading and mobile interaction ergonomics for smartphone users."
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Booking System UI",
      "Mobile-First Responsive Design"
    ],
    outcomes: [
      "Streamlined session reservation flow with zero customer confusion.",
      "Sub-second page load times on mobile devices.",
      "100% responsive experience tested across multiple mobile viewports."
    ]
  },
  "law-practice": {
    slug: "law-practice",
    title: "Law Practice & Consultation Platform",
    tagline: "Modern legal practice web platform with custom admin CMS and automated client consultation workflows.",
    category: "Full-Stack Web Platform & CMS",
    status: "Live in Production",
    liveUrl: "https://altafs-website-6pmd.vercel.app/",
    overview:
      "A comprehensive digital platform built for a prominent legal professional. Beyond acting as a client-facing showcase, the system gives the firm complete autonomy over site content through a secure custom administration portal.",
    problem:
      "Legal firms require credibility, professional aesthetics, and efficient client intake, but non-technical staff struggle with complex website updates or third-party bloated CMS platforms that introduce security vulnerabilities.",
    solution:
      "Built a custom, lightweight web platform paired with a bespoke admin dashboard. Integrated automated client inquiry and consultation pipelines utilizing Resend (email) and Twilio (SMS), backed by enterprise-grade SEO and accessibility.",
    architecture: [
      "Next.js App Router for high-performance server-side rendering and search discoverability.",
      "Secure admin portal allowing non-technical updates to legal practice areas, bios, and announcements without database manipulation.",
      "Automated communication pipelines powered by Resend API and Twilio SMS webhooks.",
      "Strict semantic HTML and metadata structures optimized for local professional search."
    ],
    contributions: [
      "End-to-end full-stack development covering client frontend, admin backend, and notification integrations.",
      "Engineered the content management dashboard with dynamic form validation.",
      "Architected email and SMS consultation notification triggers."
    ],
    technologies: [
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Resend API",
      "Twilio SMS",
      "Tailwind CSS",
      "Custom CMS"
    ],
    outcomes: [
      "Empowered non-technical staff to update practice areas and firm news in real time.",
      "Automated consultation booking confirmations, reducing intake latency.",
      "High Lighthouse scores across Performance, SEO, and Accessibility."
    ]
  },
  "eventually": {
    slug: "eventually",
    title: "EventUally — Cross-Platform Event Planning Platform",
    tagline: "Mobile-first platform for iOS and Android designed to eliminate chaotic messaging threads in group event coordination.",
    category: "Mobile Application & Cloud Backend",
    status: "In Private Beta",
    overview:
      "EventUally is a cross-platform mobile application designed to simplify social and community event coordination. It provides centralized event creation, RSVP tracking, itinerary scheduling, and venue coordination for groups without cluttering group messaging apps.",
    problem:
      "Organizing group outings, reunions, or community gatherings across WhatsApp or Telegram chat threads results in lost details, duplicate questions, uncoordinated headcounts, and planning fatigue.",
    solution:
      "Engineered an intuitive mobile application where organizers can create structured event agendas, invite participants, track real-time RSVP statuses, coordinate locations, and manage shared checklists.",
    architecture: [
      "Cross-platform mobile client built with React Native and Expo for unified iOS and Android deployment.",
      "Node.js and Express.js REST API backend hosted on Railway.",
      "Relational PostgreSQL database managed via Prisma ORM for type-safe queries.",
      "Authentication and secure user session management powered by Supabase Auth.",
      "Transactional email notifications powered by Resend."
    ],
    contributions: [
      "Engineered the core React Native / Expo application UI and navigation architecture.",
      "Designed the PostgreSQL relational schema and Prisma database migrations.",
      "Implemented real-time RSVP state synchronization and user authentication flows."
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma ORM",
      "Supabase Auth",
      "Railway",
      "Resend"
    ],
    outcomes: [
      "Single codebase serving native iOS and Android experiences.",
      "Seamless group event coordination with zero message lost in noise.",
      "Secure, scalable cloud infrastructure ready for public rollout."
    ]
  }
};
