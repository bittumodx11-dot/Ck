import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  X,
  CheckCircle2,
  FolderArchive,
  ArrowDownToLine,
  ShieldCheck,
  FileCode2,
  ExternalLink,
  HardDriveDownload,
  Sparkles,
  Globe,
  Copy,
  Check,
  GitBranch,
  Terminal,
  Layers,
} from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'zip' | 'cloudflare' | 'pwa' | 'github' | 'android' | 'pc' | 'folder';
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({ isOpen, onClose, initialTab = 'zip' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  
  // Map legacy tabs to modern web-only tabs
  const getInitialTab = (tab?: string): 'zip' | 'cloudflare' | 'pwa' | 'github' => {
    if (tab === 'android' || tab === 'pc') return 'pwa';
    if (tab === 'folder') return 'zip';
    if (tab === 'cloudflare') return 'cloudflare';
    if (tab === 'github') return 'github';
    if (tab === 'pwa') return 'pwa';
    return 'zip';
  };

  const [activeTab, setActiveTab] = useState<'zip' | 'cloudflare' | 'pwa' | 'github'>(getInitialTab(initialTab));
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = window.location.href.split('#')[0];
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyGit = async () => {
    const gitCmds = `git remote add origin https://github.com/<your-username>/snapdoc-tools.git\ngit branch -M main\ngit push -u origin main`;
    try {
      await navigator.clipboard.writeText(gitCmds);
      setCopiedGit(true);
      setTimeout(() => setCopiedGit(false), 3000);
    } catch {
      setCopiedGit(true);
      setTimeout(() => setCopiedGit(false), 3000);
    }
  };

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(getInitialTab(initialTab));
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handlePWAInstall = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/20 text-white">
            <Globe className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            SnapDoc Tools — 100% Web Application
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto font-bangla">
            কোনো ভারী .EXE বা .APK ছাড়াই সম্পূর্ণ ওয়েব কোড দিয়ে ওয়েবসাইট চালু ও ফ্রি হোস্ট করুন।
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('zip')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'zip'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="truncate">Web ZIP ফাইল</span>
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cloudflare'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate">Cloudflare লাইভ</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="truncate">GitHub গাইড</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">PWA অ্যাপ</span>
          </button>
        </div>

        {/* TAB 1: Clean Web Source ZIP */}
        {activeTab === 'zip' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-sm">
                  <FolderArchive className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      snapdoc-web-source.zip
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      ~320 KB • Clean Pure Web Source
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-bangla">
                    অপ্রয়োজনীয় ও ভারী কোনো .EXE, .APK বা node_modules এই ফাইলে নেই। শুধুমাত্র পিওর ওয়েবসাইট সোর্স কোড (React, Vite, Tailwind CSS ও Cloudflare Pages কনফিগারেশন)।
                  </p>
                </div>
              </div>

              <a
                href="/snapdoc-web-source.zip"
                download="snapdoc-web-source.zip"
                className="shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-indigo-500/25 active:scale-95"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download ZIP (320 KB)</span>
              </a>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs font-bangla">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span>জিপ ফাইলটি কীভাবে ব্যবহার করবেন:</span>
              </h5>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>উপরে <strong>"Download ZIP"</strong> বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।</li>
                <li>আপনার কম্পিউটারে ফাইলটি <strong>Extract (আনজিপ)</strong> করুন।</li>
                <li>আনজিপ করা ফোল্ডারে টার্মিনাল বা কমান্ড প্রম্পট খুলে লিখুন:
                  <div className="my-1.5 p-2 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px]">
                    npm install<br />
                    npm run dev
                  </div>
                </li>
                <li>ব্রাউজারে <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">http://localhost:3000</code> ওপেন করলেই ওয়েবসাইট চলতে শুরু করবে!</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 2: Cloudflare Pages Free Deployment */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-4 text-xs font-bangla">
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/40 dark:to-slate-900 border border-orange-200 dark:border-orange-900/50">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-600 text-white shrink-0 mt-0.5 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Cloudflare Pages-এ আজীবনের জন্য ফ্রি লাইভ ওয়েবসাইট
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Cloudflare Pages সম্পূর্ণ ফ্রিতে আনলিমিটেড ব্যান্ডউইথ, ফ্রি SSL (https) এবং বিশ্বব্যাপী আল্ট্রা-ফাস্ট CDN স্পিড প্রদান করে।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cloudflare Pages-এ সেটআপের সহজ ধাপ:</span>
              </h5>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <p>১. <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">dash.cloudflare.com</a> এ ফ্রি অ্যাকাউন্ট খুলে লগইন করুন।</p>
                <p>২. বামপাশের মেনু থেকে <strong>Workers &amp; Pages</strong> &gt; <strong>Create application</strong> &gt; <strong>Pages</strong> ট্যাবে যান।</p>
                <p>৩. <strong>Connect to Git</strong> নির্বাচন করে আপনার GitHub একাউন্ট থেকে রিপোজিটরিটি সিলেক্ট করুন।</p>
                <p>৪. বিল্ড সেটিংস দিন:</p>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] space-y-1">
                  <div>Framework preset: <span className="text-amber-400">Vite</span></div>
                  <div>Build command: <span className="text-emerald-400">npm run build</span></div>
                  <div>Build output directory: <span className="text-emerald-400">dist</span></div>
                </div>
                <p>৫. <strong>Save and Deploy</strong> বাটনে ক্লিক করলেই ১ মিনিটের মধ্যে আপনার ওয়েবসাইট লাইভ হয়ে যাবে (যেমন: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[11px]">https://snapdoc-tools.pages.dev</code>)!</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GitHub Upload Guide */}
        {activeTab === 'github' && (
          <div className="space-y-4 text-xs font-bangla">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  GitHub-এ আপলোড করার নিয়ম
                </h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                প্রোজেক্টের মধ্যে প্রয়োজনীয় সব কনফিগারেশন এবং <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">.gitignore</code> সেট করা আছে।
              </p>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">Git টার্মিনাল কমান্ড:</span>
                <button
                  onClick={handleCopyGit}
                  className="flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  {copiedGit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedGit ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>
              <pre className="font-mono text-[11px] leading-relaxed text-indigo-300 overflow-x-auto whitespace-pre">
{`git remote add origin https://github.com/<your-username>/snapdoc-tools.git
git branch -M main
git push -u origin main`}
              </pre>
            </div>

            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/50 text-slate-700 dark:text-slate-300 text-[11px]">
              <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                ⚠️ মনে রাখবেন:
              </p>
              <p>
                GitHub-এ কখনই <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded">node_modules/</code> ফোল্ডার আপলোড করবেন না। Git নিজে থেকেই এটি বাদ দেবে।
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: 1-Click PWA Browser App */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-xs font-bangla">
            {/* Live Web Link Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/50 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      অনলাইন লাইভ ওয়েব টুলস
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      সরাসরি ব্রাউজারে চালু
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    পিসিতে কোনো .exe বা ফোনে কোনো .apk ইনস্টল করার দরকার নেই! সরাসরি ব্রাউজারেই সব কাজ আনলিমিটেড ও দ্রুত সম্পন্ন করতে পারবেন।
                  </p>
                </div>
              </div>

              {/* URL Box & Actions */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                  <span className="text-slate-400 font-mono text-xs shrink-0">URL:</span>
                  <code className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 truncate select-all">
                    {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
                  </code>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>লিঙ্ক কপি করুন</span>
                      </>
                    )}
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>নতুন ট্যাবে খুলুন</span>
                  </a>
                </div>
              </div>
            </div>

            {/* PWA 1-Click Install Button */}
            {isInstallable && (
              <button
                onClick={handlePWAInstall}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>ব্রাউজার থেকে ডেক্সটপ / হোমস্ক্রিন অ্যাপ সেভ করুন (1-Click PWA)</span>
              </button>
            )}

            {isInstalled && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>SnapDoc আপনার ব্রাউজার অ্যাপ হিসেবে সেভ করা আছে!</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">100% Privacy First • Zero Cloud Uploads • All in Browser</span>
            <span className="sm:hidden">100% Private Web App</span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
