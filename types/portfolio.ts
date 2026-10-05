export interface SocialLinkDto {
  platform: string;
  url: string;
  label: string;
}

export interface ExperienceDto {
  id: string;
  roleTitle: string;
  companyName: string;
  companyUrl?: string | null;
  location: string;
  periodText: string;
  description: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface ProjectDto {
  id: string;
  title: string;
  subtitle?: string | null;
  role?: string | null;
  periodText: string;
  description: string;
  highlights: string[];
  techStack: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  imageUrl?: string | null;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
}

export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  periodText: string;
  highlights?: string | null;
}

export interface PortfolioData {
  id: string;
  username: string;
  title: string;
  tagline: string;
  bio: string;
  statusText: string;
  resumeUrl?: string | null;
  themeMode: string;
  showExperience: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showEducation: boolean;
  showContact: boolean;
  socialLinks: SocialLinkDto[];
  experiences: ExperienceDto[];
  projects: ProjectDto[];
  skills: SkillDto[];
  educations: EducationDto[];
}
