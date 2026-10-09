import React from 'react';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5 animate-in fade-in duration-150">
      <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        404
      </h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        The tool or page you requested could not be found or has moved. Explore our complete directory of free image and document utilities.
      </p>

      <div className="pt-2">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
};
