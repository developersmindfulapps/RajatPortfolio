import { ConstellationNode } from "@/types/portfolio";

export const CONSTELLATION_NODES: ConstellationNode[] = [
  { id: "identity", label: "Rajat Deep Singh", iconName: "User", x: 0, y: 0 },
  { id: "about", label: "About", iconName: "User", x: -240, y: -120 },
  { id: "projects", label: "Projects", iconName: "FolderGit", x: 200, y: -160 },
  { id: "skills", label: "Skills", iconName: "Wrench", x: 240, y: 40 },
  { id: "work-with-me", label: "Work With Me", iconName: "Briefcase", x: -260, y: 100 },
  { id: "contact", label: "Contact", iconName: "Mail", x: 20, y: 200 },
];

export const CONSTELLATION_CONNECTIONS: [string, string][] = [
  ["identity", "about"],
  ["identity", "projects"],
  ["identity", "skills"],
  ["identity", "work-with-me"],
  ["identity", "contact"],
];
