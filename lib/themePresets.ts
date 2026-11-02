export type ThemePresetKey =
  | 'classic-deck'
  | 'spotlight-focus'
  | 'terminal-matrix'
  | 'editorial-clean';

export interface ThemePreset {
  id: ThemePresetKey;
  name: string;
  tagline: string;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  accentMutedHex: string;
  fontName: string;
  fontVar: string;
  layoutDescription: string;
}

export const THEME_PRESETS: Record<ThemePresetKey, ThemePreset> = {
  'classic-deck': {
    id: 'classic-deck',
    name: 'Classic Deck',
    tagline: 'Dark Onyx + Ruza Teal + Inter',
    bgHex: '#080D12',
    surfaceHex: '#0D131A',
    accentHex: '#2DD4BF',
    accentMutedHex: 'rgba(45, 212, 191, 0.15)',
    fontName: 'Inter',
    fontVar: 'var(--font-inter)',
    layoutDescription: 'Slide deck chuẩn cân đối, viền matte thanh thoát.',
  },
  'spotlight-focus': {
    id: 'spotlight-focus',
    name: 'Spotlight Focus',
    tagline: 'Deep Navy + Electric Indigo + Outfit',
    bgHex: '#0B0F19',
    surfaceHex: '#111827',
    accentHex: '#818CF8',
    accentMutedHex: 'rgba(129, 140, 248, 0.15)',
    fontName: 'Outfit',
    fontVar: 'var(--font-outfit)',
    layoutDescription: 'Cover căn giữa, dự án full-width tràn viền.',
  },
  'terminal-matrix': {
    id: 'terminal-matrix',
    name: 'Terminal Matrix',
    tagline: 'Obsidian Black + Terminal Emerald + JetBrains Mono',
    bgHex: '#05080A',
    surfaceHex: '#0A0F13',
    accentHex: '#34D399',
    accentMutedHex: 'rgba(52, 211, 153, 0.15)',
    fontName: 'JetBrains Mono',
    fontVar: 'var(--font-jetbrains-mono)',
    layoutDescription: 'Viền hairline 1px, ma trận năng lực dạng console.',
  },
  'editorial-clean': {
    id: 'editorial-clean',
    name: 'Editorial Clean',
    tagline: 'Warm Charcoal + Amber Copper + Inter',
    bgHex: '#121110',
    surfaceHex: '#1A1918',
    accentHex: '#F59E0B',
    accentMutedHex: 'rgba(245, 158, 11, 0.15)',
    fontName: 'Inter',
    fontVar: 'var(--font-inter)',
    layoutDescription: 'Lưới bất đối xứng, nhịp điệu tạp chí thanh lịch.',
  },
};

export const DEFAULT_PRESET: ThemePresetKey = 'classic-deck';

export function getThemePreset(id?: string | null): ThemePreset {
  if (id && id in THEME_PRESETS) {
    return THEME_PRESETS[id as ThemePresetKey];
  }
  return THEME_PRESETS[DEFAULT_PRESET];
}
