import { PortfolioData, ProjectDto, ExperienceDto, SkillDto, SocialLinkDto } from '@/types/portfolio';

export type StudioSlideKey = 'cover' | 'projects' | 'experience' | 'skills' | 'contact' | 'settings';

export type InspectorMode = 'form' | 'json';

export type StageViewportMode = '16:9' | 'tablet' | 'mobile';

export type StageZoom = 'fit' | '100%' | '75%' | '125%';

export interface StudioSlideMeta {
  key: StudioSlideKey;
  number: string;
  title: string;
  shortLabel: string;
  subtitle: string;
  iconName: string;
  shortcut: string;
}

export const STUDIO_SLIDES: StudioSlideMeta[] = [
  {
    key: 'cover',
    number: '01',
    title: 'Identity',
    shortLabel: 'Identity',
    subtitle: 'Cover · Bio · Tuyên ngôn',
    iconName: 'User',
    shortcut: '1',
  },
  {
    key: 'projects',
    number: '02',
    title: 'Case Studies',
    shortLabel: 'Projects',
    subtitle: 'Dự án tiêu biểu & Hệ thống',
    iconName: 'FolderGit2',
    shortcut: '2',
  },
  {
    key: 'experience',
    number: '03',
    title: 'Impact Timeline',
    shortLabel: 'Exp',
    subtitle: 'Kinh nghiệm & Thành tựu',
    iconName: 'Briefcase',
    shortcut: '3',
  },
  {
    key: 'skills',
    number: '04',
    title: 'System Matrix',
    shortLabel: 'Matrix',
    subtitle: 'Ma trận Năng lực & Tech Stack',
    iconName: 'Cpu',
    shortcut: '4',
  },
  {
    key: 'contact',
    number: '05',
    title: 'Contact & Connect',
    shortLabel: 'Contact',
    subtitle: 'Liên hệ, Đặt lịch & Mạng xã hội',
    iconName: 'Mail',
    shortcut: '5',
  },
];

export interface SnapshotItem {
  id: string;
  version: string;
  hash: string;
  createdAt: string;
  note: string;
  slidesCount: number;
}
