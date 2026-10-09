import React, { createContext, useContext, useState, useEffect } from 'react';

export type PlatformMode = 'auto' | 'android' | 'pc';
export type ActivePlatform = 'android' | 'pc';

interface PlatformThemeContextType {
  platformMode: PlatformMode;
  setPlatformMode: (mode: PlatformMode) => void;
  activePlatform: ActivePlatform;
  isAndroid: boolean;
  isPC: boolean;
}

const PlatformThemeContext = createContext<PlatformThemeContextType | undefined>(undefined);

export const PlatformThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformMode, setPlatformModeState] = useState<PlatformMode>(() => {
    try {
      const saved = localStorage.getItem('snapdoc_platform_theme_mode');
      if (saved === 'android' || saved === 'pc' || saved === 'auto') {
        return saved;
      }
    } catch {}
    return 'auto';
  });

  const [activePlatform, setActivePlatform] = useState<ActivePlatform>('pc');

  // Determine active platform based on platformMode and device environment
  useEffect(() => {
    const updateActivePlatform = () => {
      if (platformMode === 'android') {
        setActivePlatform('android');
        return;
      }
      if (platformMode === 'pc') {
        setActivePlatform('pc');
        return;
      }

      // Auto detection
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
      const isMobileUA = /android|iphone|ipad|ipod|mobile|touch|webos|blackberry/i.test(ua);
      const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 820;
      const isTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 1);

      if (isMobileUA || (isSmallScreen && isTouch)) {
        setActivePlatform('android');
      } else {
        setActivePlatform('pc');
      }
    };

    updateActivePlatform();

    window.addEventListener('resize', updateActivePlatform);
    return () => window.removeEventListener('resize', updateActivePlatform);
  }, [platformMode]);

  const setPlatformMode = (mode: PlatformMode) => {
    setPlatformModeState(mode);
    try {
      localStorage.setItem('snapdoc_platform_theme_mode', mode);
    } catch {}
  };

  const isAndroid = activePlatform === 'android';
  const isPC = activePlatform === 'pc';

  return (
    <PlatformThemeContext.Provider
      value={{
        platformMode,
        setPlatformMode,
        activePlatform,
        isAndroid,
        isPC,
      }}
    >
      <div
        className={`platform-theme-wrapper ${
          isAndroid ? 'theme-android' : 'theme-pc'
        }`}
      >
        {children}
      </div>
    </PlatformThemeContext.Provider>
  );
};

export function usePlatformTheme() {
  const context = useContext(PlatformThemeContext);
  if (!context) {
    throw new Error('usePlatformTheme must be used within a PlatformThemeProvider');
  }
  return context;
}
