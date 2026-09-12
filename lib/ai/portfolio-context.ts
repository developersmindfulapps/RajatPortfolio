/**
 * Structured Portfolio Knowledge Base for Rajat Deep Singh's AI Assistant.
 * Ground truth factual information — no invented data.
 */

export interface ExperienceRecord {
  id: string;
  company: string;
  client?: string;
  role: string;
  period: string;
  location: string;
  scope: string;
  summaryHighlights: string[];
  expandedHighlights: string[];
  metrics: string[];
  technologies: string[];
}

export interface ProjectRecord {
  id: string;
  title: string;
  date?: string;
  status?: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export const PORTFOLIO_CONTEXT = {
  personal: {
    name: "Rajat Deep Singh",
    preferredName: "Rajat",
    title: "Senior Frontend Engineer",
    tagline: "Senior Frontend Engineer with 8+ years of experience specializing in Angular, React, and TypeScript.",
    email: "rajatdeepsingh0605@gmail.com",
    phone: "8825056011",
    location: "Gurgaon, India",
    website: "https://rajatdeepsingh.xyz",
    linkedin: "https://www.linkedin.com/in/rajatdeepsingh2417/",
    github: "https://github.com/developersmindfulapps",
    instagram: "https://www.instagram.com/hereismyrhyme/",
    resumeUrl: "/cv/RajatDeep_Singh_Resume_August.pdf",
    languages: [
      { language: "Hindi", proficiency: "Native / Fluent" },
      { language: "English", proficiency: "Professional / Fluent" },
      { language: "German", proficiency: "A1 Level" }
    ],
    education: {
      degree: "B.Tech in Electronics & Communication Engineering",
      institution: "BBSB Engineering College, Fatehgarh Sahib, Punjab",
      location: "Sirhind, Punjab",
      period: "08/2013 – 06/2017"
    },
    bio: "Senior Frontend Engineer with 8+ years of experience building enterprise-scale web applications, independently deployable microfrontends, data-intensive interfaces, and developer tooling. Strong expertise in Angular, React, TypeScript, JavaScript, component architecture, signal-based state management, RxJS, and frontend performance optimization across telecom, finance, recruitment, and developer platforms.",
    personalInterests: [
      "Playing guitar (self-described 'gloriously average guitarist')",
      "Adventure enthusiast, mountain hiking trails, and high-altitude road trips (4,000+ meters above sea level)",
      "Writing poetry (Instagram: @hereismyrhyme)",
      "Cloudy skies, rain, and sitting somewhere quiet with a warm cup of chai"
    ]
  },

  experiences: [
    {
      id: "netcracker",
      company: "Netcracker",
      role: "Software Engineer",
      period: "12/2024 – 08/2026",
      location: "Gurgaon, India",
      scope: "Developer Tooling & Low-Code Platform Extension",
      summaryHighlights: [
        "Designed and developed an Angular-based VS Code extension for a commercial low-code platform, enabling developers to create and manage UI and application configurations through YAML and JSON.",
        "Reduced production frontend bundle size by 35% through lazy-loading improvements, dependency cleanup, and optimization of shared library usage.",
        "Built 10–15 reusable Angular components using Signals and shared services, implementing local and shared state management, computed state, and component communication using input(), output(), and model()."
      ],
      expandedHighlights: [
        "Owned 5+ features from requirements through production delivery, including technical design, implementation, debugging, and peer review.",
        "Integrated TypeScript-based Data API and validation modules as reusable npm libraries and worked with VS Code APIs for extension communication and functionality."
      ],
      metrics: [
        "35% production frontend bundle size reduction",
        "5+ features owned end-to-end from requirements to production",
        "10–15 reusable Angular components built with Signals"
      ],
      technologies: [
        "Angular",
        "Angular Signals",
        "TypeScript",
        "VS Code APIs",
        "YAML/JSON",
        "npm Libraries",
        "State Management",
        "Lazy Loading"
      ]
    },
    {
      id: "capgemini",
      company: "Capgemini",
      client: "Tata Communications",
      role: "Software Engineer",
      period: "08/2021 – 10/2024",
      location: "Remote, Gurgaon, India",
      scope: "Enterprise Billing, Analytics & Telecom Operations Platforms",
      summaryHighlights: [
        "Built enterprise billing and analytics applications supporting 5,000+ internal users and 100,000+ monthly page hits, using Angular, RxJS, REST APIs, AG Grid, and Highcharts.",
        "Independently implemented AG Grid for data-intensive workflows, replacing traditional Bootstrap-based tables and integrating server-side filtering, sorting, and offset-based pagination for datasets exceeding 1M records.",
        "Developed a reusable configuration-driven Angular UI where JSON configurations dynamically controlled page structure and behavior."
      ],
      expandedHighlights: [
        "Developed 15+ reusable components and integrated Keycloak for secure authentication and access management.",
        "Contributed to frontend architecture and technical discussions, collaborated with backend teams on data contracts, and independently evaluated and introduced Highcharts for application data visualization.",
        "Contributed substantially to the frontend development of an internal telecom monitoring and troubleshooting tool using React, Material UI, Highcharts, REST APIs, and React Flow.",
        "Mentored 3 developers and supported frontend implementation and technical problem-solving across the team."
      ],
      metrics: [
        "Supported 5,000+ internal users",
        "Handled 100,000+ monthly page hits",
        "Implemented AG Grid for datasets exceeding 1M+ records with server-side pagination",
        "Mentored 3 junior developers",
        "15+ reusable components built"
      ],
      technologies: [
        "Angular",
        "React",
        "AG Grid",
        "Highcharts",
        "RxJS",
        "React Flow",
        "Keycloak",
        "Material UI",
        "REST APIs",
        "Configuration-Driven UI"
      ]
    },
    {
      id: "infosys",
      company: "Infosys",
      role: "System Engineer Trainee → Senior Software Developer",
      period: "05/2018 – 07/2021",
      location: "Remote, Chandigarh, India",
      scope: "INTAP (Recruitment & Talent Acquisition) • CSTR (Banking & Finance)",
      summaryHighlights: [
        "Progressed from System Engineer Trainee to Senior Software Developer, taking increasing ownership of frontend features and delivery.",
        "Developed independently deployable microfrontends and owned recruitment workflows from job application through offer release, reducing manual operational work by approximately 40%.",
        "Built custom banking workflows using React, Redux, GraphQL, and Material UI; reduced signup-to-onboarding interactions by approximately 20% and implemented WCAG 2.0 accessibility improvements."
      ],
      expandedHighlights: [
        "Built 5+ reusable UI components and integrated jsPDF to automate offer-letter generation.",
        "Reduced production frontend bundle size from 12 MB to 6.8 MB (43% reduction), while maintaining 90+ Lighthouse scores and clean SonarQube standards.",
        "Integrated GraphQL queries and created custom frontend request objects for backend data operations."
      ],
      metrics: [
        "43% bundle size reduction (12 MB down to 6.8 MB)",
        "~40% reduction in manual operational recruitment work via automation",
        "~20% reduction in banking signup-to-onboarding interactions",
        "Maintained 90+ Lighthouse performance and clean SonarQube quality standards",
        "Promoted from Trainee to Senior Software Developer"
      ],
      technologies: [
        "Microfrontends",
        "React",
        "Redux",
        "GraphQL",
        "Material UI",
        "jsPDF",
        "WCAG 2.0",
        "SonarQube",
        "Performance Optimization"
      ]
    }
  ] as ExperienceRecord[],

  skillGroups: [
    {
      id: "frontend-core",
      title: "Frontend & Core",
      skills: ["Angular", "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"]
    },
    {
      id: "state-architecture",
      title: "State & Architecture",
      skills: [
        "RxJS",
        "Angular Signals",
        "Signal-Based State Management",
        "Zustand",
        "Redux",
        "Microfrontends",
        "Component Architecture",
        "Reusable UI Development",
        "Configuration-Driven UI",
        "Lazy Loading"
      ]
    },
    {
      id: "ui-dataviz",
      title: "UI & Quality / Data Visualization",
      skills: [
        "AG Grid",
        "Highcharts",
        "React Flow",
        "Angular Material",
        "Material UI",
        "Tailwind CSS",
        "shadcn/ui",
        "Bootstrap",
        "WCAG (Accessibility)",
        "SonarQube"
      ]
    },
    {
      id: "apis-backend",
      title: "APIs & Backend",
      skills: [
        "REST APIs",
        "GraphQL",
        "Node.js",
        "Express.js",
        "Microservices Integration",
        "Keycloak",
        "VS Code APIs"
      ]
    },
    {
      id: "data-cloud",
      title: "Data & Platforms / Cloud",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Supabase",
        "Supabase Auth",
        "Prisma",
        "Vercel",
        "Railway",
        "Resend",
        "Cloudflare"
      ]
    },
    {
      id: "testing-delivery",
      title: "Testing & Delivery",
      skills: ["Jest", "React Testing Library", "Jenkins", "CI/CD", "Git", "GitHub"]
    },
    {
      id: "ai-assisted",
      title: "AI-Assisted Engineering",
      skills: ["ChatGPT", "Claude", "Claude Code", "Cursor", "Antigravity"]
    }
  ] as SkillCategory[],

  familiarWith: [
    "AWS Lambda",
    "gRPC",
    "RPC",
    "System Design",
    "Data Structures",
    "Web Security",
    "Python"
  ],

  projects: [
    {
      id: "project-portfolio",
      title: "Personal Portfolio Platform",
      date: "07/2026",
      status: "Live & Featured",
      description: "A full-stack, production-grade portfolio platform built from scratch with an App Router architecture, interactive SVG constellation node map, time-aware dynamic environment atmospheres (day, sunset, night, sunrise), tokenized recommendation submission and moderation engine, fire-and-forget real-time event analytics, and Edge-authenticated admin dashboard.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "MongoDB",
        "Tailwind CSS",
        "Cloudflare Turnstile",
        "Resend",
        "Vercel",
        "JWT Session Security",
        "Framer Motion"
      ],
      link: "/case-study",
      github: "https://github.com/developersmindfulapps/RajatPortfolio",
      highlights: [
        "Time-based atmosphere dynamic themes with canvas and particle effects",
        "Interactive SVG constellation navigation graph with spring physics",
        "Secure admin portal with Edge session verification and moderation workflows",
        "Real-time analytics logging without blocking client rendering (Lighthouse 98-100 scores)"
      ]
    },
    {
      id: "project-bat-cave",
      title: "Bat Cave",
      status: "Live",
      description: "A modern web platform for an indoor cricket facility in Baramulla, Jammu & Kashmir, built to make discovering services and booking practice sessions simpler through a guided, multi-step digital booking experience.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Booking System",
        "Responsive Design"
      ],
      link: "https://bat-cave-theta.vercel.app/",
      highlights: [
        "Guided multi-step cricket lane and coaching booking flow",
        "High-performance mobile-first responsive layout"
      ]
    },
    {
      id: "project-law-practice",
      title: "Law Practice Platform",
      status: "Live",
      description: "Built a modern website platform for a well-known legal professional. Beyond a traditional landing page, the platform provides complete control over website content through a secure admin experience, allowing updates without touching code or databases. Integrated consultation workflows using Resend and Twilio, with strong SEO and mobile responsiveness.",
      technologies: ["Next.js", "Node.js", "Resend", "Twilio", "SEO", "Responsive Design"],
      link: "https://altafs-website-6pmd.vercel.app/",
      highlights: [
        "Custom content management admin dashboard for non-technical site updates",
        "Integrated client consultation booking and SMS/email notifications via Resend & Twilio",
        "Optimized for search engines (SEO) and mobile accessibility"
      ]
    },
    {
      id: "project-eventually",
      title: "EventUally",
      date: "05/2026",
      status: "In Private Beta",
      description: "Cross-platform mobile event-planning platform for iOS and Android designed to simplify group coordination. EventUally helps friends, families, and communities organize events, manage RSVPs, coordinate venues, and keep everyone in sync without chaotic messaging threads.",
      technologies: [
        "React Native",
        "Expo",
        "TypeScript",
        "Node.js",
        "Express.js",
        "Prisma",
        "PostgreSQL",
        "Supabase",
        "Railway",
        "Resend"
      ],
      highlights: [
        "Cross-platform iOS and Android mobile app built with Expo and React Native",
        "Group event management, RSVP tracking, and notifications",
        "PostgreSQL and Prisma backend hosted on Railway with Supabase Auth"
      ]
    },
    {
      id: "project-enterprise",
      title: "Enterprise Frontend Engineering",
      status: "Production Enterprise",
      description: "Over 8+ years of building large-scale platforms for Fortune 500 companies and telecom leaders, delivering microfrontends, high-throughput data tables (1M+ rows in AG Grid), and internal developer tooling.",
      technologies: ["Angular", "React", "TypeScript", "Microfrontends", "RxJS", "AG Grid", "Developer Tooling"],
      link: "/experience",
      highlights: [
        "Architected scalable microfrontend ecosystems",
        "Engineered real-time data monitoring interfaces with AG Grid, Highcharts, and React Flow",
        "Led bundle size and runtime performance optimizations across legacy codebases"
      ]
    }
  ] as ProjectRecord[],

  services: [
    {
      title: "High-Converting Business & Product Websites",
      description: "Building fast, modern, and reliable web experiences that convert visitors into customers."
    },
    {
      title: "SEO-Friendly & Mobile-Responsive Development",
      description: "Ensuring top Lighthouse scores, strong search ranking foundations, and seamless responsiveness across devices."
    },
    {
      title: "Frontend Architecture & Microfrontends",
      description: "Structuring maintainable, scalable component architectures, state management (Signals, RxJS, Redux, Zustand), and lazy-loading systems."
    },
    {
      title: "Data-Intensive Applications & Dashboards",
      description: "Building complex grid workflows (AG Grid), interactive charts (Highcharts), and flow diagrams (React Flow) for large datasets."
    },
    {
      title: "Product Consultation & Technical Design",
      description: "Reviewing requirements, creating technical roadmaps, designing API contracts, and planning UI/UX before writing code."
    },
    {
      title: "Performance Optimization & Audits",
      description: "Bundle size reduction, code splitting, asset optimization, WCAG accessibility compliance, and SonarQube code quality enforcement."
    }
  ],

  contactWays: {
    directEmail: "rajatdeepsingh0605@gmail.com",
    contactEmail: "developers.mindfulapps@gmail.com",
    phone: "8825056011",
    linkedin: "https://www.linkedin.com/in/rajatdeepsingh2417/",
    github: "https://github.com/developersmindfulapps",
    instagram: "https://www.instagram.com/hereismyrhyme/",
    websiteContactForm: "Available via the Contact node on the homepage or by asking this AI assistant to submit a message for you."
  }
};
