import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type BgStyle = 'solid' | 'subtle-gradient' | 'mesh-gradient';
export type UiDensity = 'compact' | 'comfortable' | 'spacious';
export type RadiusPreset = 'small' | 'medium' | 'large';
export type ShadowPreset = 'none' | 'soft' | 'medium' | 'elevated';
export type NavLayout = 'top' | 'sidebar';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  pageBg: string;
  surfaceBg: string;
  textMain: string;
  textSecondary: string;
  borderColor: string;
  buttonBg: string;
  buttonText: string;
  headerBg: string;
  linkColor: string;
  focusColor: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  presetId: string;
  colorsLight: ThemeColors;
  colorsDark: ThemeColors;
  bgStyle: BgStyle;
  fontFamily: string;
  uiDensity: UiDensity;
  radius: RadiusPreset;
  shadow: ShadowPreset;
  navLayout: NavLayout;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  accentColor: string;
  colorsLight: ThemeColors;
  colorsDark: ThemeColors;
}

export const THEME_PRESETS: PresetTheme[] = [
  {
    id: 'blue',
    name: 'Professional Blue',
    description: 'Crisp corporate aesthetic for document and studio productivity',
    previewColor: '#2563EB',
    accentColor: '#38BDF8',
    colorsLight: {
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      secondary: '#475569',
      accent: '#0284C7',
      pageBg: '#F8FAFC',
      surfaceBg: '#FFFFFF',
      textMain: '#0F172A',
      textSecondary: '#64748B',
      borderColor: '#E2E8F0',
      buttonBg: '#2563EB',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#2563EB',
      focusColor: '#3B82F6',
    },
    colorsDark: {
      primary: '#3B82F6',
      primaryHover: '#60A5FA',
      secondary: '#94A3B8',
      accent: '#38BDF8',
      pageBg: '#0B0F19',
      surfaceBg: '#111827',
      textMain: '#F8FAFC',
      textSecondary: '#94A3B8',
      borderColor: '#1F2937',
      buttonBg: '#3B82F6',
      buttonText: '#FFFFFF',
      headerBg: '#0F172A',
      linkColor: '#60A5FA',
      focusColor: '#60A5FA',
    },
  },
  {
    id: 'purple',
    name: 'Modern Purple',
    description: 'Vibrant indigo and violet designed for modern creators',
    previewColor: '#7C3AED',
    accentColor: '#C084FC',
    colorsLight: {
      primary: '#7C3AED',
      primaryHover: '#6D28D9',
      secondary: '#64748B',
      accent: '#A855F7',
      pageBg: '#FAF5FF',
      surfaceBg: '#FFFFFF',
      textMain: '#1E1B4B',
      textSecondary: '#6B7280',
      borderColor: '#F3E8FF',
      buttonBg: '#7C3AED',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#7C3AED',
      focusColor: '#8B5CF6',
    },
    colorsDark: {
      primary: '#8B5CF6',
      primaryHover: '#A78BFA',
      secondary: '#A1A1AA',
      accent: '#C084FC',
      pageBg: '#0F0728',
      surfaceBg: '#180C38',
      textMain: '#F5F3FF',
      textSecondary: '#C4B5FD',
      borderColor: '#2E1065',
      buttonBg: '#8B5CF6',
      buttonText: '#FFFFFF',
      headerBg: '#130930',
      linkColor: '#A78BFA',
      focusColor: '#A78BFA',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    description: 'Fresh, balanced botanical tones with high legibility',
    previewColor: '#059669',
    accentColor: '#34D399',
    colorsLight: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#4B5563',
      accent: '#10B981',
      pageBg: '#F0FDF4',
      surfaceBg: '#FFFFFF',
      textMain: '#064E3B',
      textSecondary: '#4B5563',
      borderColor: '#DCFCE7',
      buttonBg: '#059669',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#059669',
      focusColor: '#10B981',
    },
    colorsDark: {
      primary: '#10B981',
      primaryHover: '#34D399',
      secondary: '#9CA3AF',
      accent: '#34D399',
      pageBg: '#021E14',
      surfaceBg: '#062E20',
      textMain: '#ECFDF5',
      textSecondary: '#6EE7B7',
      borderColor: '#064E3B',
      buttonBg: '#10B981',
      buttonText: '#FFFFFF',
      headerBg: '#032519',
      linkColor: '#34D399',
      focusColor: '#34D399',
    },
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    description: 'Calm marine cyan and deep teal for focused workflow',
    previewColor: '#0D9488',
    accentColor: '#22D3EE',
    colorsLight: {
      primary: '#0D9488',
      primaryHover: '#0F766E',
      secondary: '#475569',
      accent: '#06B6D4',
      pageBg: '#F0FDFA',
      surfaceBg: '#FFFFFF',
      textMain: '#134E4A',
      textSecondary: '#64748B',
      borderColor: '#CCFBF1',
      buttonBg: '#0D9488',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#0D9488',
      focusColor: '#14B8A6',
    },
    colorsDark: {
      primary: '#14B8A6',
      primaryHover: '#2DD4BF',
      secondary: '#94A3B8',
      accent: '#22D3EE',
      pageBg: '#041F1E',
      surfaceBg: '#082F2E',
      textMain: '#F0FDFA',
      textSecondary: '#5EEAD4',
      borderColor: '#134E4A',
      buttonBg: '#14B8A6',
      buttonText: '#FFFFFF',
      headerBg: '#062524',
      linkColor: '#2DD4BF',
      focusColor: '#2DD4BF',
    },
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    description: 'Energetic warm amber and bright terracotta highlights',
    previewColor: '#EA580C',
    accentColor: '#FB923C',
    colorsLight: {
      primary: '#EA580C',
      primaryHover: '#C2410C',
      secondary: '#57534E',
      accent: '#F97316',
      pageBg: '#FFF7ED',
      surfaceBg: '#FFFFFF',
      textMain: '#431407',
      textSecondary: '#78716C',
      borderColor: '#FFEDD5',
      buttonBg: '#EA580C',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#EA580C',
      focusColor: '#F97316',
    },
    colorsDark: {
      primary: '#F97316',
      primaryHover: '#FB923C',
      secondary: '#A8A29E',
      accent: '#FB923C',
      pageBg: '#1F0A03',
      surfaceBg: '#2E1207',
      textMain: '#FFF7ED',
      textSecondary: '#FDBA74',
      borderColor: '#7C2D12',
      buttonBg: '#F97316',
      buttonText: '#FFFFFF',
      headerBg: '#230C04',
      linkColor: '#FB923C',
      focusColor: '#FB923C',
    },
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    description: 'Polished crimson and vibrant magenta luxury tones',
    previewColor: '#E11D48',
    accentColor: '#FB7185',
    colorsLight: {
      primary: '#E11D48',
      primaryHover: '#BE123C',
      secondary: '#475569',
      accent: '#F43F5E',
      pageBg: '#FFF1F2',
      surfaceBg: '#FFFFFF',
      textMain: '#4C0519',
      textSecondary: '#64748B',
      borderColor: '#FFE4E6',
      buttonBg: '#E11D48',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#E11D48',
      focusColor: '#F43F5E',
    },
    colorsDark: {
      primary: '#F43F5E',
      primaryHover: '#FB7185',
      secondary: '#94A3B8',
      accent: '#FDA4AF',
      pageBg: '#1F040B',
      surfaceBg: '#2E0712',
      textMain: '#FFF1F2',
      textSecondary: '#FDA4AF',
      borderColor: '#881337',
      buttonBg: '#F43F5E',
      buttonText: '#FFFFFF',
      headerBg: '#24050D',
      linkColor: '#FB7185',
      focusColor: '#FB7185',
    },
  },
  {
    id: 'monochrome',
    name: 'Minimal Monochrome',
    description: 'High-contrast black, white, and titanium zinc',
    previewColor: '#18181B',
    accentColor: '#71717A',
    colorsLight: {
      primary: '#18181B',
      primaryHover: '#09090B',
      secondary: '#52525B',
      accent: '#3F3F46',
      pageBg: '#FAFAFA',
      surfaceBg: '#FFFFFF',
      textMain: '#09090B',
      textSecondary: '#52525B',
      borderColor: '#E4E4E7',
      buttonBg: '#18181B',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#18181B',
      focusColor: '#71717A',
    },
    colorsDark: {
      primary: '#FAFAFA',
      primaryHover: '#FFFFFF',
      secondary: '#A1A1AA',
      accent: '#D4D4D8',
      pageBg: '#09090B',
      surfaceBg: '#18181B',
      textMain: '#FAFAFA',
      textSecondary: '#A1A1AA',
      borderColor: '#27272A',
      buttonBg: '#FAFAFA',
      buttonText: '#09090B',
      headerBg: '#121215',
      linkColor: '#E4E4E7',
      focusColor: '#A1A1AA',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Deep obsidian and deep space indigo for night work',
    previewColor: '#4F46E5',
    accentColor: '#818CF8',
    colorsLight: {
      primary: '#4F46E5',
      primaryHover: '#4338CA',
      secondary: '#475569',
      accent: '#6366F1',
      pageBg: '#F1F5F9',
      surfaceBg: '#FFFFFF',
      textMain: '#0F172A',
      textSecondary: '#475569',
      borderColor: '#CBD5E1',
      buttonBg: '#4F46E5',
      buttonText: '#FFFFFF',
      headerBg: '#FFFFFF',
      linkColor: '#4F46E5',
      focusColor: '#6366F1',
    },
    colorsDark: {
      primary: '#6366F1',
      primaryHover: '#818CF8',
      secondary: '#94A3B8',
      accent: '#818CF8',
      pageBg: '#030712',
      surfaceBg: '#0B0F19',
      textMain: '#F9FAFB',
      textSecondary: '#9CA3AF',
      borderColor: '#1F2937',
      buttonBg: '#6366F1',
      buttonText: '#FFFFFF',
      headerBg: '#080C14',
      linkColor: '#818CF8',
      focusColor: '#818CF8',
    },
  },
];

export const AVAILABLE_FONTS = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Default)', family: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { id: 'Inter', name: 'Inter (Clean Technical)', family: "'Inter', system-ui, sans-serif" },
  { id: 'Poppins', name: 'Poppins (Geometric & Friendly)', family: "'Poppins', system-ui, sans-serif" },
  { id: 'Outfit', name: 'Outfit (Modern Display)', family: "'Outfit', system-ui, sans-serif" },
  { id: 'DM Sans', name: 'DM Sans (Contemporary)', family: "'DM Sans', system-ui, sans-serif" },
  { id: 'Roboto', name: 'Roboto (Neutral)', family: "'Roboto', system-ui, sans-serif" },
  { id: 'Merriweather', name: 'Merriweather (Classic Serif)', family: "'Merriweather', Georgia, serif" },
  { id: 'EB Garamond', name: 'EB Garamond (Editorial Luxury)', family: "'EB Garamond', Garamond, serif" },
  { id: 'Hind Siliguri', name: 'Hind Siliguri (বাংলা ও ইংরেজি)', family: "'Hind Siliguri', 'Plus Jakarta Sans', sans-serif" },
];

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'system',
  presetId: 'blue',
  colorsLight: { ...THEME_PRESETS[0].colorsLight },
  colorsDark: { ...THEME_PRESETS[0].colorsDark },
  bgStyle: 'subtle-gradient',
  fontFamily: 'Plus Jakarta Sans',
  uiDensity: 'comfortable',
  radius: 'medium',
  shadow: 'soft',
  navLayout: 'top',
};

interface CustomThemeContextType {
  config: ThemeConfig;
  activePreset: PresetTheme;
  isDark: boolean;
  effectiveColors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  selectPreset: (presetId: string) => void;
  updateColor: (colorKey: keyof ThemeColors, hex: string, targetMode?: 'current' | 'light' | 'dark') => void;
  setBgStyle: (style: BgStyle) => void;
  setFontFamily: (fontId: string) => void;
  setUiDensity: (density: UiDensity) => void;
  setRadius: (radius: RadiusPreset) => void;
  setShadow: (shadow: ShadowPreset) => void;
  setNavLayout: (layout: NavLayout) => void;
  resetToDefault: () => void;
  resetCurrentPreset: () => void;
  exportThemeJSON: () => string;
  importThemeJSON: (jsonStr: string) => boolean;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('snapdoc_custom_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_THEME_CONFIG,
          ...parsed,
          colorsLight: { ...DEFAULT_THEME_CONFIG.colorsLight, ...(parsed.colorsLight || {}) },
          colorsDark: { ...DEFAULT_THEME_CONFIG.colorsDark, ...(parsed.colorsDark || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved theme config:', e);
    }
    return DEFAULT_THEME_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [systemIsDark, setSystemIsDark] = useState(false);

  // Monitor system dark mode changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const isDark = config.mode === 'dark' || (config.mode === 'system' && systemIsDark);
  const effectiveColors = isDark ? config.colorsDark : config.colorsLight;

  const activePreset =
    THEME_PRESETS.find((p) => p.id === config.presetId) || THEME_PRESETS[0];

  // Save changes to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('snapdoc_custom_theme', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save custom theme to localStorage:', e);
    }
  }, [config]);

  // Apply CSS variables and root classes immediately
  useEffect(() => {
    const root = document.documentElement;

    // Toggle dark class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set CSS custom properties on root
    root.style.setProperty('--theme-primary', effectiveColors.primary);
    root.style.setProperty('--theme-primary-hover', effectiveColors.primaryHover);
    root.style.setProperty('--theme-secondary', effectiveColors.secondary);
    root.style.setProperty('--theme-accent', effectiveColors.accent);
    root.style.setProperty('--theme-bg-page', effectiveColors.pageBg);
    root.style.setProperty('--theme-bg-surface', effectiveColors.surfaceBg);
    root.style.setProperty('--theme-text-main', effectiveColors.textMain);
    root.style.setProperty('--theme-text-secondary', effectiveColors.textSecondary);
    root.style.setProperty('--theme-border', effectiveColors.borderColor);
    root.style.setProperty('--theme-btn-bg', effectiveColors.buttonBg);
    root.style.setProperty('--theme-btn-text', effectiveColors.buttonText);
    root.style.setProperty('--theme-header-bg', effectiveColors.headerBg);
    root.style.setProperty('--theme-link', effectiveColors.linkColor);
    root.style.setProperty('--theme-focus', effectiveColors.focusColor);

    // Border radius mapping
    const radiusMap: Record<RadiusPreset, string> = {
      small: '6px',
      medium: '12px',
      large: '18px',
    };
    root.style.setProperty('--theme-radius', radiusMap[config.radius] || '12px');

    // Shadow mapping
    const shadowMap: Record<ShadowPreset, string> = {
      none: 'none',
      soft: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
    };
    root.style.setProperty('--theme-shadow', shadowMap[config.shadow] || shadowMap.soft);

    // Font family mapping
    const fontObj = AVAILABLE_FONTS.find((f) => f.id === config.fontFamily);
    const fontCss = fontObj ? fontObj.family : "'Plus Jakarta Sans', system-ui, sans-serif";
    root.style.setProperty('--theme-font-family', fontCss);
    document.body.style.fontFamily = fontCss;

    // Density padding mapping
    const densityMap: Record<UiDensity, { py: string; px: string; cardPad: string }> = {
      compact: { py: '0.375rem', px: '0.75rem', cardPad: '1rem' },
      comfortable: { py: '0.5rem', px: '1rem', cardPad: '1.25rem' },
      spacious: { py: '0.75rem', px: '1.25rem', cardPad: '1.75rem' },
    };
    const density = densityMap[config.uiDensity] || densityMap.comfortable;
    root.style.setProperty('--theme-density-py', density.py);
    root.style.setProperty('--theme-density-px', density.px);
    root.style.setProperty('--theme-density-card-pad', density.cardPad);
  }, [config, isDark, effectiveColors]);

  const setMode = (mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }));
  };

  const selectPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setConfig((prev) => ({
      ...prev,
      presetId,
      colorsLight: { ...preset.colorsLight },
      colorsDark: { ...preset.colorsDark },
    }));
  };

  const updateColor = (
    colorKey: keyof ThemeColors,
    hex: string,
    targetMode: 'current' | 'light' | 'dark' = 'current'
  ) => {
    const modeToTarget =
      targetMode === 'current' ? (isDark ? 'dark' : 'light') : targetMode;

    setConfig((prev) => {
      if (modeToTarget === 'dark') {
        return {
          ...prev,
          colorsDark: {
            ...prev.colorsDark,
            [colorKey]: hex,
          },
        };
      } else {
        return {
          ...prev,
          colorsLight: {
            ...prev.colorsLight,
            [colorKey]: hex,
          },
        };
      }
    });
  };

  const setBgStyle = (bgStyle: BgStyle) => {
    setConfig((prev) => ({ ...prev, bgStyle }));
  };

  const setFontFamily = (fontFamily: string) => {
    setConfig((prev) => ({ ...prev, fontFamily }));
  };

  const setUiDensity = (uiDensity: UiDensity) => {
    setConfig((prev) => ({ ...prev, uiDensity }));
  };

  const setRadius = (radius: RadiusPreset) => {
    setConfig((prev) => ({ ...prev, radius }));
  };

  const setShadow = (shadow: ShadowPreset) => {
    setConfig((prev) => ({ ...prev, shadow }));
  };

  const setNavLayout = (navLayout: NavLayout) => {
    setConfig((prev) => ({ ...prev, navLayout }));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_THEME_CONFIG);
  };

  const resetCurrentPreset = () => {
    const preset = THEME_PRESETS.find((p) => p.id === config.presetId) || THEME_PRESETS[0];
    setConfig((prev) => ({
      ...prev,
      colorsLight: { ...preset.colorsLight },
      colorsDark: { ...preset.colorsDark },
    }));
  };

  const exportThemeJSON = (): string => {
    return JSON.stringify(config, null, 2);
  };

  const importThemeJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') return false;

      setConfig({
        ...DEFAULT_THEME_CONFIG,
        ...parsed,
        colorsLight: { ...DEFAULT_THEME_CONFIG.colorsLight, ...(parsed.colorsLight || {}) },
        colorsDark: { ...DEFAULT_THEME_CONFIG.colorsDark, ...(parsed.colorsDark || {}) },
      });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <CustomThemeContext.Provider
      value={{
        config,
        activePreset,
        isDark,
        effectiveColors,
        setMode,
        selectPreset,
        updateColor,
        setBgStyle,
        setFontFamily,
        setUiDensity,
        setRadius,
        setShadow,
        setNavLayout,
        resetToDefault,
        resetCurrentPreset,
        exportThemeJSON,
        importThemeJSON,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
};

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
}
