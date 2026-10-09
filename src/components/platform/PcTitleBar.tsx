import React from 'react';
import {
  Monitor,
  Minus,
  Square,
  X,
  ShieldCheck,
  Cpu,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { usePlatformTheme } from '../../context/PlatformThemeContext';

interface PcTitleBarProps {
  onOpenPlatformModal: () => void;
  currentPage: string;
}

export const PcTitleBar: React.FC<PcTitleBarProps> = ({
  onOpenPlatformModal,
  currentPage,
}) => {
  const { platformMode, activePlatform } = usePlatformTheme();

  return (
    <div className="no-print desktop-window-bar w-full h-8 bg-slate-900 text-slate-300 text-xs flex items-center justify-between px-3 border-b border-slate-800 select-none">
      {/* App branding & window title */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-black">
          S
        </div>
        <span className="font-semibold text-slate-200 tracking-tight">
          SnapDoc Studio Pro
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
          {currentPage === 'home' || !currentPage
            ? 'Workspace: Dashboard'
            : `Workspace: ${currentPage}`}
        </span>
      </div>

      {/* Engine Status & Platform Switcher */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local WASM Engine: 100% Client-Side</span>
        </div>

        {/* Platform Theme Selector Button */}
        <button
          onClick={onOpenPlatformModal}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 hover:text-white transition-colors text-[11px] font-medium"
          title="Switch Platform Theme (Android vs PC)"
        >
          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
          <span>Theme: PC Workstation</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {/* Windows Fluent Window Controls Simulation */}
        <div className="flex items-center ml-2 border-l border-slate-800 pl-2">
          <button
            aria-label="Minimize"
            className="w-7 h-6 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            aria-label="Maximize"
            className="w-7 h-6 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            aria-label="Close"
            className="w-7 h-6 flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
