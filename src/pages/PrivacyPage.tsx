import React from 'react';
import { ShieldCheck, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-150">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3 text-emerald-950 dark:text-emerald-200 text-xs">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Core Privacy Pledge:</strong> Your files are processed locally in your browser and are never transmitted to or permanently stored on any remote web server.
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Client-Side Processing Architecture</h2>
        <p>
          Unlike conventional converter websites that require uploading your photos, passport pictures, signatures, or PDF documents to remote cloud storage, <strong>SnapDoc Tools executes all image and PDF algorithms on your own device</strong> using modern Web APIs, Canvas Rendering Context 2D, and in-memory Web Workers.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Account or Personal Data Collection</h2>
        <p>
          You do not need to register an account, sign in with Google, or provide your phone number to use any tool on this website. We do not track, collect, or sell your personal identifiers.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Local Storage Usage</h2>
        <p>
          The application uses browser <code>LocalStorage</code> exclusively for convenience features on your device:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <li>Saving your recent tool shortcuts (maximum 6 items)</li>
          <li>Saving your bookmarked favorite tools</li>
          <li>Saving your theme preference (Light, Dark, or System)</li>
          <li>Auto-saving your unfinished Biodata draft so you don&apos;t lose typing if you refresh the browser</li>
        </ul>
        <p className="text-xs text-slate-500">
          This data remains isolated inside your browser storage and is never sent to our servers.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Contact & Support</h2>
        <p>
          If you have any questions regarding privacy practices, please contact the developer, <strong>Bittu Khan</strong>, via email at <code className="text-indigo-600">sssk46981@gmail.com</code> or WhatsApp at <code className="text-emerald-600">7719254662</code>.
        </p>
      </div>
    </div>
  );
};
