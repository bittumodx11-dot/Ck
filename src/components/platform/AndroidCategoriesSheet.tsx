import React from 'react';
import { X, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../data/tools';

interface AndroidCategoriesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const AndroidCategoriesSheet: React.FC<AndroidCategoriesSheetProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1E1F22] rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-zinc-800 p-5 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
      >
        {/* Android Material 3 Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600 mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                All Tool Categories
              </h3>
              <p className="text-xs text-slate-500 font-bangla">
                ক্যাটেগরি অনুযায়ী টুলস বেছে নিন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto py-3 space-y-2 flex-1">
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-zinc-700/50 flex items-center justify-between transition-colors text-left group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bangla mt-0.5">
                    {cat.bengaliName} • {count} টি টুলস
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-zinc-700 text-slate-700 dark:text-slate-300">
                    {count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
