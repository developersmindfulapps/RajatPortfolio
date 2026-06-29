export interface Scene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imagePath?: string;
  placementLabel: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TimelineNode {
  id: string;
  title: string;
  description: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
}

export const heroData = {
  label: "Project Case Study",
  title: "Personal Portfolio Platform",
  description: [
    "This platform is not just a static showcase of projects; it is a full-stack product built entirely from scratch to demonstrate engineering proficiency, architectural design, and modern production standards.",
    "Engineered with a Node.js and Next.js App Router framework, the system features dynamic time-based atmosphere rendering, a custom recommendation submission and moderation engine, real-time fire-and-forget event tracking, and a secure internal admin dashboard protected at the Edge."
  ],
  liveLink: "/",
  codeLink: "https://github.com/developersmindfulapps/RajatPortfolio"
};

export const scenesData: Scene[] = [
  {
    id: "day",
    title: "Day Scene",
    subtitle: "Bright & Energetic",
    description: "Crisp lighting and high-contrast styling designed for active daytime reading.",
    imagePath: "/scenes/day/bg_desktop.avif",
    placementLabel: "Day Scene Screenshot"
  },
  {
    id: "sunset",
    title: "Sunset Scene",
    subtitle: "Warm & Reflective",
    description: "Soft orange and amber gradients mimicking the calming hues of dusk.",
    imagePath: "/scenes/sunset/bg_desktop.avif",
    placementLabel: "Sunset Scene Screenshot"
  },
  {
    id: "night",
    title: "Night Scene",
    subtitle: "Peaceful & Starry",
    description: "Deep navy backgrounds with subtle particle glows creating an immersive midnight workspace.",
    imagePath: "/scenes/night/bg_desktop.avif",
    placementLabel: "Night Scene Screenshot"
  },
  {
    id: "sunrise",
    title: "Sunrise Scene",
    subtitle: "Soft & Inspiring",
    description: "Golden hour tones and smooth transitions representing new beginnings.",
    imagePath: "/scenes/sunrise/bg_desktop.avif",
    placementLabel: "Sunrise Scene Screenshot"
  }
];

export const whyBuiltData = {
  title: "Why did I build this?",
  paragraphs: [
    "Static portfolio templates are common, but they fail to demonstrate how an engineer designs, implements, and maintains a production-grade web application. I built this platform to serve as a tangible example of my coding practices, system design capabilities, and attention to detail.",
    "Beyond displaying code snippets, it offers visitors a live product experience. Every component—from the custom WebGL atmosphere faders to the secure admin dashboard—is hand-coded to serve as a playground for learning, experimentation, and demonstrating engineering excellence."
  ],
  placeholderLabel: "Why Built Camp Illustration",
  placeholderSubtitle: "Painterly Night Camp Landscape",
  imagePath: "/scenes/night/bg_desktop.avif"
};

export const featuresData: Feature[] = [
  {
    id: "constellation",
    title: "Interactive Constellation",
    description: "SVG-based node network mapping portfolio navigation with smooth spring animations.",
    iconName: "Network"
  },
  {
    id: "recommendations",
    title: "Recommendations Engine",
    description: "Dynamic forms with token-based authentication links allowing peers to submit reviews.",
    iconName: "ThumbsUp"
  },
  {
    id: "dashboard",
    title: "Admin Dashboard",
    description: "Secure, hidden internal portal to moderate reviews, inspect activities, and read messages.",
    iconName: "LayoutDashboard"
  },
  {
    id: "analytics",
    title: "Analytics Tracking",
    description: "Fire-and-forget logging API storing route hits, CTA clicks, and downloads in MongoDB.",
    iconName: "BarChart3"
  },
  {
    id: "contact",
    title: "Contact System",
    description: "Spam-protected contact forms connected to Resend for instantaneous mail delivery.",
    iconName: "Mail"
  },
  {
    id: "auth",
    title: "Secure Authentication",
    description: "Edge-verified 8-hour JWT session cookies with robust brute-force protection.",
    iconName: "ShieldAlert"
  },
  {
    id: "responsive",
    title: "Responsive Design",
    description: "Fluid, desktop-first container structures wrapping columns cleanly for mobile compatibility.",
    iconName: "Smartphone"
  },
  {
    id: "themes",
    title: "Dynamic Themes",
    description: "Observer-driven client stylesheet selectors syncing environmental atmospheres to local time.",
    iconName: "Clock"
  }
];

export const techStackData = [
  "Next.js",
  "React",
  "TypeScript",
  "MongoDB",
  "Tailwind CSS",
  "Resend",
  "Cloudflare",
  "Vercel",
  "JWT",
  "Turnstile",
  "Responsive"
];

export const capabilitiesData: Capability[] = [
  {
    id: "interactive-ui",
    title: "Interactive UI",
    description: "Stunning environment atmospheres and micro-interactions built with Framer Motion and Tailwind CSS.",
    iconName: "Sparkles"
  },
  {
    id: "secure-auth",
    title: "Secure Authentication",
    description: "Edge-verifiable JWT token management, login rate limiting, and Cloudflare Turnstile bot shielding.",
    iconName: "Lock"
  },
  {
    id: "recommendations",
    title: "Recommendations",
    description: "Tokenized submission pathways, instant moderation switches, and client-side toggle lists.",
    iconName: "UserCheck"
  },
  {
    id: "analytics",
    title: "Analytics Tracking",
    description: "Non-blocking background events collection parsed serverless-side for geographical insights.",
    iconName: "AreaChart"
  },
  {
    id: "admin-dashboard",
    title: "Admin Dashboard",
    description: "Production-grade internal management console complete with soft deletes, search, and activity audits.",
    iconName: "Sliders"
  }
];

export const timelineData: TimelineNode[] = [
  {
    id: "design",
    title: "Design",
    description: "Creating the painterly environment art boards and grid spacings."
  },
  {
    id: "planning",
    title: "Planning",
    description: "Structuring database collections, routing tables, and edge middleware paths."
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Fleshing out the constellation layout, responsive panels, and form flows."
  },
  {
    id: "backend",
    title: "Backend",
    description: "Implementing Serverless API route handlers and MongoDB connection layers."
  },
  {
    id: "security",
    title: "Security",
    description: "Configuring CSRF headers, login rate limiting, and Edge sessions proxy."
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Setting up continuous delivery pipelines on Vercel with HTTPS protocols."
  },
  {
    id: "analytics-tuning",
    title: "Analytics",
    description: "Decoupling event logs to ensure non-blocking background network threads."
  },
  {
    id: "future",
    title: "Future",
    description: "Planning NextAuth integration, feature toggles, and rich email templating."
  }
];

export const metricsData: Metric[] = [
  { id: "accessibility", label: "Accessibility", value: "100", subtitle: "Lighthouse Score" },
  { id: "seo", label: "SEO Score", value: "100", subtitle: "Lighthouse Score" },
  { id: "performance", label: "Performance", value: "98+", subtitle: "Lighthouse Score" },
  { id: "best-practices", label: "Best Practices", value: "100", subtitle: "Lighthouse Score" },
  { id: "auth", label: "Secure Sessions", value: "8 Hrs", subtitle: "JWT Cookie Expiry" },
  { id: "database", label: "MongoDB Atlas", value: "Cloud", subtitle: "Managed Cluster" },
  { id: "email", label: "Resend Mail", value: "Direct", subtitle: "Transactional Delivery" },
  { id: "tracking", label: "Analytics Log", value: "Async", subtitle: "Non-blocking Thread" }
];

export const ctaData = {
  title: "Always evolving. Always improving.",
  description: "The platform's code structure is built to scale. Future expansions will implement NextAuth workflows, customizable email notification templates, and analytics charts—all built upon the same solid, modular architectural foundation.",
  buttonLabel: "Explore Live Platform",
  placeholderLabel: "CTA Panoramic Artwork",
  placeholderSubtitle: "Painterly Night Landscape panorama",
  imagePath: "/scenes/sunset/bg_desktop.avif"
};

export const mobileCompanionData = {
  phoneHeaderTime: "09:41",
  placeholders: [
    { id: "mob-hero", title: "Mobile Hero Screenshot", subtitle: "Responsive Hero Layout", imagePath: "/case-study/mobile/hero.png" },
    { id: "mob-scenes", title: "Mobile Scenes Carousel", subtitle: "Swipeable Scene Selection", imagePath: "/case-study/mobile/scenes.png" },
    { id: "mob-features", title: "Mobile Features Stack", subtitle: "Vertical Feature List", imagePath: "/case-study/mobile/features.png" },
    { id: "mob-cta", title: "Mobile CTA Section", subtitle: "Footer CTA Panel", imagePath: "/case-study/mobile/cta.png" }
  ]
};
