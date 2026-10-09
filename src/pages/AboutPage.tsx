import React from 'react';
import { ShieldCheck, Heart, Mail, MessageCircle, Sparkles, User, Printer } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free & Private Online Utilities
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About SnapDoc Tools
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          An all-in-one client-side suite for photo editing, passport sheets, PDF manipulation, and biodata creation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p>
          Online service centres, passport photo shops, cyber cafes, job applicants, and students often need quick, reliable tools to resize images to strict file sizes (e.g. 20KB for government portals), print multi-photo sheets on 4×6 photo paper, combine photos with signatures, de-warp tilted documents, and create marriage or job biodatas.
        </p>
        <p>
          Most online tools require subscriptions, show invasive ads, or upload your private documents to third-party cloud servers. <strong>SnapDoc Tools is engineered differently:</strong> all heavy processing runs directly in your web browser via HTML5 Canvas, Web APIs, and client-side libraries.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">
          Core Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero Server Storage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your files stay on your device. We do not store, view, or retain any user photos or PDF documents.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-500" /> Photo Studio Accuracy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Exact millimeter & pixel dimensions at real 200–300 DPI for standard 35×45mm, 2×2 inch, and 4×6 photo sheets.
            </p>
          </div>
        </div>

        {/* Developer Info (PRD #59) */}
        <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3 mt-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" /> Developer Information
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            SnapDoc Tools was created and developed by <strong className="text-indigo-600 dark:text-indigo-400">Bittu Khan</strong> to provide free, high-speed, and secure utilities for everyone without commercial friction.
          </p>

          <div className="flex flex-wrap gap-4 text-xs pt-2">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email: <strong>sssk46981@gmail.com</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: <strong>7719254662</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
