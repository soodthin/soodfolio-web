import { PortfolioData, ProjectDto, ExperienceDto, SkillDto, SocialLinkDto } from '@/types/portfolio';

export type StudioSlideKey = 'cover' | 'projects' | 'experience' | 'skills' | 'settings';

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
    title: 'Hồ sơ & Giới thiệu',
    shortLabel: 'Cover',
    subtitle: 'Danh tính, chức danh & liên kết',
    iconName: 'User',
    shortcut: '1',
  },
  {
    key: 'projects',
    number: '02',
    title: 'Selected Case Studies',
    shortLabel: 'Projects',
    subtitle: 'Dự án chọn lọc & công nghệ chính',
    iconName: 'FolderGit2',
    shortcut: '2',
  },
  {
    key: 'experience',
    number: '03',
    title: 'Kinh nghiệm Kỹ thuật',
    shortLabel: 'Exp',
    subtitle: 'Cột mốc sự nghiệp & vai trò',
    iconName: 'Briefcase',
    shortcut: '3',
  },
  {
    key: 'skills',
    number: '04',
    title: 'Ma trận Kỹ năng',
    shortLabel: 'Skills',
    subtitle: 'Ngôn ngữ, framework & công cụ',
    iconName: 'Cpu',
    shortcut: '4',
  },
  {
    key: 'settings',
    number: '05',
    title: 'Cài đặt Hiển thị',
    shortLabel: 'Config',
    subtitle: 'Bật/tắt slide & tuỳ chọn deck',
    iconName: 'Sliders',
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
