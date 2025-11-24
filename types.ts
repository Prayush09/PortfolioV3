import React from 'react';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  timeline?: string;
  summary?: string[];
  description?: string; // Fallback
  tech: string[]; // Was tags
  links: ProjectLink[];
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}