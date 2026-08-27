export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "frontend-core",
    title: "Frontend & Core",
    skills: ["Angular", "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"]
  },
  {
    id: "state-architecture",
    title: "State & Architecture",
    skills: ["RxJS", "Angular Signals", "Redux", "Microfrontends", "Component Architecture", "Configuration-Driven UI", "Lazy Loading"]
  },
  {
    id: "ui-dataviz",
    title: "UI & Data Visualization",
    skills: ["AG Grid", "Highcharts", "React Flow", "Tailwind CSS", "Material UI", "Angular Material", "shadcn/ui", "WCAG"]
  },
  {
    id: "apis-backend",
    title: "APIs & Backend",
    skills: ["REST APIs", "GraphQL", "Node.js", "Express.js", "Microservices Integration", "Keycloak", "VS Code APIs"]
  },
  {
    id: "data-cloud",
    title: "Data, Cloud & Services",
    skills: ["PostgreSQL", "MongoDB", "Supabase", "Prisma", "Vercel", "Railway", "Resend", "Cloudflare"]
  },
  {
    id: "testing-delivery",
    title: "Testing & Delivery",
    skills: ["Jest", "React Testing Library", "SonarQube", "CI/CD", "Git", "GitHub", "Jenkins"]
  },
  {
    id: "ai-assisted",
    title: "AI-Assisted Engineering",
    skills: ["ChatGPT", "Claude", "Claude Code", "Cursor", "Antigravity"]
  }
];

export const FAMILIAR_WITH: string[] = [
  "Python",
  "AWS Lambda",
  "gRPC / RPC",
  "System Design",
  "Data Structures",
  "Web Security"
];
