import React from 'react';
import {
  Home,
  Grid,
  Layers,
  Star,
  Download,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface AndroidBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  favoritesCount: number;
  onOpenCategories: () => void;
  onOpenInstallModal: () => void;
  onOpenPlatformModal: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentPage,
  onNavigate,
  favoritesCount,
  onOpenCategories,
  onOpenInstallModal,
  onOpenPlatformModal,
}) => {
  const isHome = currentPage === 'home' || currentPage === '';
  const isAllTools = currentPage === 'all-tools';
  const isFavorites = currentPage === 'favorites';

  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-zinc-800 shadow-2xl transition-all">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isHome
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all ${
              isHome
                ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 scale-105'
                : ''
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* All Tools */}
        <button
          onClick={() => onNavigate('all-tools')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isAllTools
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-all ${
              isAllTools
                ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 scale-105'
                : ''
            }`}
          >
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Tools</span>
        </button>

        {/* Categories Bottom Sheet */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800"
        >
          <div className="px-4 py-1 rounded-full">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Categories</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => {
            onNavigate('all-tools');
            // Can scroll or trigger favorites filter
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isFavorites
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <div className="px-4 py-1 rounded-full">
            <Star className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Starred</span>
          {favoritesCount > 0 && (
            <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* APK / Downloads & Platform Mode */}
        <button
          onClick={onOpenInstallModal}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800"
        >
          <div className="px-4 py-1 rounded-full relative">
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium text-emerald-600 dark:text-emerald-400">
            APK
          </span>
        </button>
      </div>
    </nav>
  );
};
