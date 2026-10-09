import React from 'react';
import { Smartphone, Monitor, Cpu, Check, Sparkles, X } from 'lucide-react';
import { usePlatformTheme, PlatformMode } from '../../context/PlatformThemeContext';

interface PlatformSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformSwitcherModal: React.FC<PlatformSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { platformMode, setPlatformMode, activePlatform } = usePlatformTheme();

  if (!isOpen) return null;

  const modes: {
    id: PlatformMode;
    title: string;
    bengaliTitle: string;
    subtitle: string;
    icon: React.ReactNode;
    features: string[];
    badge: string;
  }[] = [
    {
      id: 'android',
      title: 'Android OS Theme',
      bengaliTitle: 'অ্যান্ড্রয়েড থিম (Android Material 3)',
      subtitle: 'Mobile-optimized with Material 3 navigation bar, floating action buttons, and touch-first bottom sheets.',
      icon: <Smartphone className="w-6 h-6 text-emerald-500" />,
      features: [
        'Material 3 Bottom Navigation Bar',
        'Quick Actions Floating Action Button (FAB)',
        'Touch-optimized 48px responsive pills',
        'Android Bottom-sheet drawers & Material chips',
        'Direct APK download integration',
      ],
      badge: 'Material 3',
    },
    {
      id: 'pc',
      title: 'PC Workstation Theme',
      bengaliTitle: 'পিসি ডেস্কটপ থিম (Windows Fluent Studio)',
      subtitle: 'Desktop-grade workstation with Fluent acrylic title bar, command ribbon, keyboard shortcuts, and status bar.',
      icon: <Monitor className="w-6 h-6 text-indigo-500" />,
      features: [
        'Windows 11 Fluent Desktop Command Ribbon',
        'Fast Keyboard Shortcuts (Ctrl + K, Ctrl + O)',
        'Compact productivity layout with technical specs',
        'Desktop Bottom Status Bar (Engine health & stats)',
        'Direct PC .exe & Portable ZIP launcher',
      ],
      badge: 'Windows Fluent',
    },
    {
      id: 'auto',
      title: 'Auto Device Detection',
      bengaliTitle: 'স্বয়ংক্রিয় সনাক্তকরণ (Auto Detect)',
      subtitle: 'Automatically loads Android theme on mobile devices/tablets and PC workstation theme on desktop computers.',
      icon: <Cpu className="w-6 h-6 text-amber-500" />,
      features: [
        'Real-time screen & OS user-agent detection',
        'Seamless responsive transitions',
        'Currently active: ' + (activePlatform === 'android' ? 'Android Theme' : 'PC Theme'),
      ],
      badge: 'Adaptive',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Theme Experience
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla">
                অ্যান্ড্রয়েড ও পিসি-এর জন্য পৃথক ডিজাইন থিম নির্বাচন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="mt-5 space-y-3">
          {modes.map((mode) => {
            const isSelected = platformMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => {
                  setPlatformMode(mode.id);
                }}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
                      {mode.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {mode.title}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                          {mode.badge}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium font-bangla mt-0.5">
                        {mode.bengaliTitle}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {mode.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                  {mode.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Active: <strong className="text-indigo-600 dark:text-indigo-400 uppercase">{activePlatform}</strong> UI
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
