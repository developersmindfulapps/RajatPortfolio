import { Project } from "@/types/portfolio";

/*
TODO: Future project: "UX Design Gallery"
This will later showcase website concepts, landing pages, mobile app screens, design explorations, and product workflows created using design and prototyping tools.
*/
export const PROJECTS: Project[] = [
  {
    id: "project-enterprise",
    title: "Enterprise Frontend Engineering",
    description: "Over the past 8+ years, I've worked on large-scale enterprise platforms for Fortune 500 companies and industry-leading organizations. Much of this work is protected by client confidentiality, but the experience has shaped how I approach architecture, usability, maintainability, and long-term product development.",
    tags: ["Angular", "TypeScript", "JavaScript", "RxJS", "REST APIs", "Node.js"],
    link: "/experience",
  },
  {
    id: "project-eventually",
    title: "EventUally",
    description: "A mobile-first event planning platform designed to simplify group coordination. EventUally helps friends, families, and communities organize events, manage RSVPs, coordinate venues, and keep everyone on the same page without endless messaging threads. Built with a strong focus on privacy, usability, and reducing the friction involved in planning group events.",
    tags: ["React Native", "Node.js", "PostgreSQL", "Event Planning", "Mobile App"],
    comingSoon: true,
  },
  {
    id: "project-law-practice",
    title: "Law Practice Platform",
    description: "Built a modern website platform for a well-known legal professional. Beyond a traditional landing page, the platform gives complete control over website content through a secure admin experience, allowing updates without touching code or databases. Integrated consultation workflows using Resend and Twilio, while maintaining strong SEO foundations and mobile responsiveness.",
    tags: ["Next.js", "Node.js", "Resend", "Twilio", "SEO", "Responsive Design"],
    link: "https://altafs-website-6pmd.vercel.app/",
  },
];
