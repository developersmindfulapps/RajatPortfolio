export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
  comingSoon?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
  tags?: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'resume' | 'instagram';
  url: string;
  label: string;
}

export interface NavItem {
  label: string;
  path: string;
  isHash?: boolean;
}

export interface ConstellationNode {
  id: string;
  label: string;
  iconName: string;
  x: number; // percentage or offset from center
  y: number; // percentage or offset from center
}
