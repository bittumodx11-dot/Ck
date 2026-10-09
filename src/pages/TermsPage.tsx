import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-150">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and using SnapDoc Tools, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Permitted Free Use</h2>
        <p>
          SnapDoc Tools provides browser-based image editing, passport photo preparation, PDF utilities, and biodata creation free of charge for personal, student, professional, cyber cafe, and commercial photo studio printing operations.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. User Responsibility & Identity</h2>
        <p>
          Users are solely responsible for ensuring that photos, signatures, and documents uploaded to the tool for processing do not infringe copyright laws and adhere to official application guidelines of relevant exam boards or government portals.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
        <p>
          The tools are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. While we rigorously test all millimeter and DPI outputs, users are advised to verify requirements for their specific visa or examination boards prior to final submission.
        </p>
      </div>
    </div>
  );
};
