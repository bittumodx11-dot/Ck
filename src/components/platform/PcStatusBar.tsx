import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Cpu,
  HardDrive,
  Maximize2,
  Download,
  Terminal,
} from 'lucide-react';

interface PcStatusBarProps {
  currentPage: string;
  onOpenInstallModal: () => void;
}

export const PcStatusBar: React.FC<PcStatusBarProps> = ({
  currentPage,
  onOpenInstallModal,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <footer className="no-print w-full h-7 bg-slate-900 border-t border-slate-800 text-slate-400 text-[11px] flex items-center justify-between px-3 select-none font-mono">
      {/* Left: Engine & privacy guarantees */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Status: Ready</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Privacy: 100% Offline Client-Side</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-slate-500">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span>WASM Canvas Thread: Optimal</span>
        </div>
      </div>

      {/* Center: Workspace info */}
      <div className="hidden md:block text-slate-400 truncate max-w-sm">
        {currentPage === 'home' || !currentPage
          ? 'Ready to process documents and images'
          : `Active Module: ${currentPage}`}
      </div>

      {/* Right: Quick actions & build */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenInstallModal}
          className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
          title="Download PC .exe / Android APK"
        >
          <Download className="w-3 h-3 text-indigo-400" />
          <span className="hidden sm:inline">Desktop .exe Available</span>
        </button>

        <span className="text-slate-600">|</span>

        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
        </button>

        <span className="text-slate-600">|</span>
        <span className="text-slate-500">PC Studio v2.4</span>
      </div>
    </footer>
  );
};
