import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Camera,
  Maximize2,
  FileText,
  FileSpreadsheet,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AndroidFloatingActionButtonProps {
  onNavigate: (page: string) => void;
}

export const AndroidFloatingActionButton: React.FC<AndroidFloatingActionButtonProps> = ({
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickTools = [
    {
      name: 'Passport Photo 35×45mm',
      bengali: 'পাসপোর্ট ছবি তৈরি',
      slug: 'tool:passport-photo-maker',
      icon: <Camera className="w-4 h-4 text-indigo-500" />,
      tag: 'Studio',
    },
    {
      name: 'Target 20KB / 50KB Resize',
      bengali: 'কেবি সাইজ কমান',
      slug: 'tool:reduce-image-size',
      icon: <Maximize2 className="w-4 h-4 text-emerald-500" />,
      tag: 'Fast',
    },
    {
      name: 'Images to PDF Converter',
      bengali: 'ছবি থেকে পিডিএফ',
      slug: 'tool:image-to-pdf',
      icon: <FileText className="w-4 h-4 text-rose-500" />,
      tag: 'PDF',
    },
    {
      name: 'Bangla / English Biodata',
      bengali: 'জীবনবৃত্তান্ত বায়োডাটা',
      slug: 'tool:biodata-maker',
      icon: <FileSpreadsheet className="w-4 h-4 text-amber-500" />,
      tag: 'Document',
    },
  ];

  return (
    <div className="no-print fixed bottom-20 right-4 z-40">
      {/* Quick Action Sheet backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs -z-10 animate-in fade-in duration-150"
        />
      )}

      {/* Speed Dial Menu */}
      {isOpen && (
        <div className="mb-3 space-y-2 max-w-xs animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white dark:bg-[#1E1F22] rounded-3xl p-3 shadow-2xl border border-slate-200 dark:border-zinc-800">
            <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ⚡ Quick Android Actions
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                Direct Launch
              </span>
            </div>

            <div className="space-y-1">
              {quickTools.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate(tool.slug);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 group-hover:scale-105 transition-transform">
                      {tool.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bangla">
                        {tool.bengali}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Material 3 FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Actions"
        className="m3-fab flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-xl hover:shadow-indigo-500/30 active:scale-95 transition-all"
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5" />
            <span>Close</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="tracking-wide">Quick Tools</span>
          </>
        )}
      </button>
    </div>
  );
};
