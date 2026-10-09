import React, { useState } from 'react';
import { ShieldCheck, Heart, Mail, MessageCircle, Sparkles, ExternalLink, HardDriveDownload } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { AppInstallModal } from './AppInstallModal';
import { usePlatformTheme } from '../../context/PlatformThemeContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isAndroid } = usePlatformTheme();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  return (
    <>
      <footer className="no-print mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xs">
        {/* Privacy Banner */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 py-3.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-indigo-950 dark:text-indigo-200">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>100% Client-Side Privacy:</strong> Your photos, documents, and biodata are processed directly in your browser. No files are uploaded to any server.
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div className="md:col-span-1 space-y-3">
              <div
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2.5 cursor-pointer inline-flex"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  S
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  SnapDoc<span className="text-indigo-600 dark:text-indigo-400">Tools</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The all-in-one free online studio utility for photo editing, passport sheets, PDF manipulation, document de-warping, and Bengali/English biodata creation.
              </p>
              
              <div className="pt-2 flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 w-fit">
                  <span>Built by</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Bittu Khan</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>
                <button
                  onClick={() => setShowInstall(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs w-fit transition-colors"
                >
                  <HardDriveDownload className="w-3.5 h-3.5" />
                  <span>Download APK & PC App</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Key Tool Suites
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => onNavigate('tool:passport-photo-maker')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Passport Photo Maker (35×45mm, 2×2")
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:passport-sheet-maker')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Passport Photo Sheet (4×6 & A4)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:reduce-image-size')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Reduce Size to Target KB (20KB, 50KB)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:resize-signature')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Signature Resizer for Govt Forms
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:biodata-maker')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Biodata Maker (English & বাংলা)
                  </button>
                </li>
              </ul>
            </div>

            {/* Document & PDF */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                PDF & Documents
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => onNavigate('tool:image-to-pdf')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Image to PDF Converter
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:pdf-manager')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    PDF Manager (Merge, Split, Rotate)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:scan-to-pdf')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Scan to PDF with 4-Corner Warp
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:four-corner-correction')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Perspective Document Correction
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tool:resume-maker')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Professional Resume Maker
                  </button>
                </li>
              </ul>
            </div>

            {/* Developer Contact & Feedback */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Developer Contact & Support
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Developed by <span className="text-indigo-600 dark:text-indigo-400">Bittu Khan</span>
                </p>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <a href="mailto:sssk46981@gmail.com" className="hover:underline truncate">
                    sssk46981@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <a href="https://wa.me/917719254662" target="_blank" rel="noreferrer" className="hover:underline">
                    WhatsApp: 7719254662
                  </a>
                </div>
                <button
                  onClick={() => setShowFeedback(true)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Send Direct Feedback
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} SnapDoc Tools. Free & client-side software utility.</p>
            <div className="flex items-center gap-5">
              <button onClick={() => onNavigate('about')} className="hover:text-slate-800 dark:hover:text-slate-200">
                About
              </button>
              <button onClick={() => onNavigate('privacy')} className="hover:text-slate-800 dark:hover:text-slate-200">
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} className="hover:text-slate-800 dark:hover:text-slate-200">
                Terms of Service
              </button>
              <button onClick={() => onNavigate('contact')} className="hover:text-slate-800 dark:hover:text-slate-200">
                Contact Developer
              </button>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      <AppInstallModal
        isOpen={showInstall}
        onClose={() => setShowInstall(false)}
        initialTab={isAndroid ? 'android' : 'pc'}
      />
    </>
  );
};
