// src/types/data.ts

export interface TeamMember {
  name: string;
  lastName: string;
  mothersLastName?: string;
  role: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
}

export type TeamMembers = Record<string, TeamMember>;

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  schema_description?: string;
  featured?: boolean;
}

export interface ServicesLocaleData {
  heading: string;
  subtitle: string;
  secondaryHeading: string;
  services: ServiceItem[];
}

export type ServicesData = Record<string, ServicesLocaleData>;

export interface SeoData {
  business_name: string;
  domain: string;
  thumbnail?: string;
  socials?: string[];
}
