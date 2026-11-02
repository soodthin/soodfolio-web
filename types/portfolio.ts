export interface SocialLinkDto {
  platform: string;
  url: string;
  label?: string | null;
}

export interface ExperienceDto {
  id: string;
  roleTitle: string;
  companyName: string;
  companyUrl?: string | null;
  location?: string | null;
  periodText?: string | null;
  description?: string | null;
  highlights?: string[];
  skillsUsed?: string[];
}

export interface ProjectDto {
  id: string;
  title: string;
  subtitle?: string | null;
  role?: string | null;
  periodText?: string | null;
  description?: string | null;
  highlights?: string[];
  techStack?: string[];
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
  degree?: string | null;
  fieldOfStudy?: string | null;
  periodText?: string | null;
  highlights?: string | null;
}

export interface PortfolioData {
  id: string;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  title: string;
  tagline?: string | null;
  bio?: string | null;
  statusText?: string | null;
  resumeUrl?: string | null;
  themeMode?: string | null;
  themeConfig?: string | null;
  isPublished?: boolean;
  totalViews?: number;
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
