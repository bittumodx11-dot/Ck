import React, { useState } from 'react';
import {
  BIODATA_TEMPLATES,
  BiodataTemplateDefinition,
} from '../../../data/biodataTemplates';
import { X, Search, Check, Sparkles, Palette, ShieldCheck } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  activeTemplateId,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates', count: BIODATA_TEMPLATES.length },
    { id: 'marriage', label: '💍 Marriage Biodata', count: BIODATA_TEMPLATES.filter((t) => t.category === 'marriage').length },
    { id: 'job', label: '💼 Job Resume', count: BIODATA_TEMPLATES.filter((t) => t.category === 'job').length },
    { id: 'modern', label: '⚡ Modern', count: BIODATA_TEMPLATES.filter((t) => t.category === 'modern').length },
    { id: 'minimal', label: '✨ Minimal / ATS', count: BIODATA_TEMPLATES.filter((t) => t.category === 'minimal').length },
    { id: 'classic', label: '📜 Classic CV', count: BIODATA_TEMPLATES.filter((t) => t.category === 'classic').length },
    { id: 'traditional', label: '🕉️ Traditional', count: BIODATA_TEMPLATES.filter((t) => t.category === 'traditional').length },
    { id: 'elegant', label: '👑 Elegant', count: BIODATA_TEMPLATES.filter((t) => t.category === 'elegant').length },
    { id: 'professional', label: '🏢 Professional', count: BIODATA_TEMPLATES.filter((t) => t.category === 'professional').length },
  ];

  const filteredTemplates = BIODATA_TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.badge && t.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Template Gallery
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {BIODATA_TEMPLATES.length} Styles
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose a handcrafted template. All your entered data, educations, and sections are preserved automatically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe notice banner */}
        <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Zero Data Loss Guarantee:</strong> Switching templates only updates fonts, colors, and layout aesthetics. Your information stays 100% intact.
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates (e.g. ATS, Royal, Bengali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-5 overflow-y-auto flex-1 max-h-[60vh]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p className="font-semibold text-sm">No templates found matching your search.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => {
                const isActive = activeTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      onSelectTemplate(tpl.id);
                      onClose();
                    }}
                    className={`group relative rounded-2xl border p-4 text-left transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Badge & Color Swatches */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: tpl.primaryColor }}
                            title="Primary Color"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: tpl.accentColor }}
                            title="Accent Color"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: tpl.backgroundColor }}
                            title="Background Color"
                          />
                        </div>

                        {tpl.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            {tpl.badge}
                          </span>
                        )}
                      </div>

                      {/* Sacred Header Preview if any */}
                      {tpl.sacredHeader && (
                        <div className="text-[11px] font-bold text-center mb-1.5 opacity-80" style={{ color: tpl.primaryColor }}>
                          {tpl.sacredHeader}
                        </div>
                      )}

                      {/* Title & Description */}
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                        {tpl.name}
                        {isActive && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Features tags */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium capitalize">
                        {tpl.fontFamily} • {tpl.infoLayoutStyle} layout
                      </span>
                      <span
                        className={`font-bold ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600'
                        }`}
                      >
                        {isActive ? 'Applied' : 'Use Template →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredTemplates.length} of {BIODATA_TEMPLATES.length} templates
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
