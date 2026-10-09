import React from 'react';
import { ShieldCheck, ChevronRight, Star, RefreshCw, Sparkles, ArrowLeft, Smartphone, Monitor, Cpu } from 'lucide-react';
import { ToolItem } from '../../types';
import { usePlatformTheme } from '../../context/PlatformThemeContext';
import { useCustomTheme } from '../../context/CustomThemeContext';

interface ToolLayoutProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReset?: () => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onReset,
  onNavigateHome,
  children,
}) => {
  const { isAndroid, isPC } = usePlatformTheme();
  const { effectiveColors, config } = useCustomTheme();

  return (
    <div
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-in fade-in duration-200 ${
        isAndroid ? 'm3-layout' : 'fluent-layout'
      }`}
    >
      {/* Platform-Specific Top Navigation Bar */}
      {isAndroid ? (
        /* Android Material 3 Mobile App Bar */
        <div className="no-print flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 text-xs font-semibold active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Android Mode
            </span>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-400'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      ) : (
        /* PC Workstation Desktop Breadcrumbs & Specs Ribbon */
        <div className="no-print flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap">
          <nav className="flex items-center gap-1.5 font-mono">
            <button
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              Studio Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{tool.category.replace('-', ' ')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {tool.name}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <Cpu className="w-3 h-3 text-indigo-500" />
              <span>Native WASM Engine</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>100% Client-Side</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            {!isAndroid && (
              <button
                onClick={onToggleFavorite}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Action reset */}
        {onReset && (
          <div className="shrink-0 self-start md:self-auto">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset tool workspace"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Container */}
      <div
        className={`w-full ${
          isAndroid
            ? 'm3-card p-4 sm:p-6 shadow-sm border'
            : 'fluent-card p-5 sm:p-7 shadow-sm border'
        }`}
        style={{
          backgroundColor: effectiveColors.surfaceBg,
          borderColor: effectiveColors.borderColor,
          borderRadius: config.radius === 'small' ? '8px' : config.radius === 'large' ? '24px' : '16px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

