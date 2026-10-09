import React, { useState } from 'react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { ToolItem } from '../types';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Printer,
  UserCheck,
  FileSpreadsheet,
  Scaling,
  PenTool,
  CheckCircle2,
  Heart,
  MessageCircle,
  Smartphone,
  Monitor,
  Download,
  HardDriveDownload,
  Command,
  HelpCircle,
  Globe,
  Copy,
  Check,
  Share2,
  Clock,
} from 'lucide-react';
import { usePlatformTheme } from '../context/PlatformThemeContext';
import { useCustomTheme } from '../context/CustomThemeContext';
import { AppInstallModal } from '../components/layout/AppInstallModal';

interface HomeProps {
  onNavigate: (page: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  recentTools?: string[];
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  favorites,
  onToggleFavorite,
  recentTools = [],
}) => {
  const { isAndroid, isPC } = usePlatformTheme();
  const { effectiveColors, config } = useCustomTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installModalTab, setInstallModalTab] = useState<'android' | 'pc' | 'pwa' | 'folder'>('pc');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyWebLink = async () => {
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

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const popularTools = TOOLS.filter((t) => t.popular);
  const recentToolItems = (recentTools || [])
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as ToolItem[];

  return (
    <div className="space-y-14 pb-12 animate-in fade-in duration-200">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-14 md:pt-16 md:pb-18 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Client-Side • Private & Secure • No Server Uploads</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: effectiveColors.textMain }}>
            All Your Image, Photo, PDF & Document Tools{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${effectiveColors.primary}, ${effectiveColors.accent})`,
              }}
            >
              in One Studio
            </span>
          </h1>

          <p className="text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: effectiveColors.textSecondary }}>
            Free utility suite tailored for photo studios, cyber cafes, job applicants, and students. Prepare passport photo sheets, resize for government exams, edit PDFs, straighten documents, and build Bangla/English biodatas instantly.
          </p>

          {/* Instant Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div
              className="relative flex items-center shadow-lg p-2 border transition-all"
              style={{
                backgroundColor: effectiveColors.surfaceBg,
                borderColor: effectiveColors.borderColor,
                borderRadius: config.radius === 'small' ? '10px' : config.radius === 'large' ? '22px' : '16px',
              }}
            >
              <Search className="w-5 h-5 ml-3 shrink-0" style={{ color: effectiveColors.primary }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools: e.g. Passport Photo, Resize 20KB, PDF to JPG, Signature, Biodata..."
                className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
                style={{ color: effectiveColors.textMain }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Keyword Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="font-medium">Trending:</span>
              {[
                { label: '35×45mm Passport', slug: 'passport-photo-maker' },
                { label: '4×6 Photo Sheet', slug: 'passport-sheet-maker' },
                { label: 'Target 20KB/50KB', slug: 'reduce-image-size' },
                { label: 'Exam Signature', slug: 'resize-signature' },
                { label: 'Biodata (বাংলা)', slug: 'biodata-maker' },
                { label: 'Images to PDF', slug: 'image-to-pdf' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(`tool:${item.slug}`)}
                  className="px-2.5 py-1 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: effectiveColors.surfaceBg,
                    borderColor: effectiveColors.borderColor,
                    color: effectiveColors.textSecondary,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 100% FREE WEB BANNER & SHARE LINK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-5 border border-indigo-400/30">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-blue-200" />
              <span>১০০% ফ্রি অনলাইন ওয়েবসাইট • নো সেটআপ / নো সাইন-আপ</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              সরাসরি ব্রাউজারে সম্পূর্ণ ফ্রিতে চালান — কোনো কিছু ইন্সটল লাগবে না!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-bangla leading-relaxed">
              পিসি বা মোবাইলে সফটওয়্যার ইন্সটলের ঝামেলা ছাড়াই এই লাইভ ওয়েবসাইটে সব কাজ হবে। বাংলা/ইংরেজি বায়োডাটা ও সিভি মেকার, পাসপোর্ট ছবি প্রিন্ট, ইমেজ কম্প্রেসার এবং পিডিএফ কনভার্টারের সব টুলস যেকোনো ব্রাউজারে ১০০% ফ্রি।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyWebLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-blue-50 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">ওয়েবসাইট লিঙ্ক কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>ওয়েবসাইট লিঙ্ক কপি করুন</span>
                </>
              )}
            </button>
            <button
              onClick={() => onNavigate('all-tools')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-300/40 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>সকল টুলস দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setInstallModalTab('pwa');
                setShowInstallModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার / ফ্রি গাইড</span>
            </button>
          </div>
        </div>
      </section>

      {/* PLATFORM THEME ADAPTIVE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isAndroid ? (
          /* Mobile / Android Responsive Card */
          <div className="m3-card relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>১০০% রেসপনসিভ মোবাইল ওয়েব • ইনস্টল ছাড়াই ব্যবহারযোগ্য</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                সম্পূর্ণ ফ্রি ক্লাউড ওয়েব টুলস — ব্রাউজারেই রেডি
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-bangla leading-relaxed">
                কোনো APK ইনস্টল ছাড়াই যেকোনো স্মার্টফোনের ব্রাউজার থেকে সরাসরি ছবি রিসাইজ, পাসপোর্ট সাইজ ফটো ও বায়োডাটা তৈরি করুন।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/snapdoc-web-source.zip"
                download="snapdoc-web-source.zip"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Web Source ZIP ডাউনলোড</span>
              </a>
              <button
                onClick={() => onNavigate('tool:passport-photo-maker')}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-700/60 border border-emerald-400/40 text-white font-semibold text-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <span>টুলস শুরু করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* PC Web Suite Card */
          <div className="fluent-card relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-indigo-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-medium">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>ওয়েব অ্যাপ্লিকেশন • কোনো ভারী সফটওয়্যার বা EXE প্রয়োজন নেই</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                সুপারফাস্ট অনলাইন ডকুমেন্ট ও ফটো এডিটিং স্যুট
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed">
                কোনো জটিল সফটওয়্যার বা EXE সেটআপ ছাড়াই যেকোনো ডিভাইসে তাৎক্ষণিক রান করে। GitHub ও Cloudflare Pages-এ আজীবনের জন্য ফ্রি হোস্ট করতে পারেন।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/snapdoc-web-source.zip"
                download="snapdoc-web-source.zip"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Web Source (ZIP)</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setInstallModalTab('pwa');
                  setShowInstallModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>হোস্টিং ও লাইভ সাইট গাইড</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* RECENTLY USED TOOLS SECTION (If user has recent tools) */}
      {!searchQuery && recentToolItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: effectiveColors.textMain }}>
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Recently Used Tools</span>
              </h2>
              <p className="text-xs" style={{ color: effectiveColors.textSecondary }}>
                Continue right where you left off.
              </p>
            </div>
            <span className="text-[11px] font-mono" style={{ color: effectiveColors.textSecondary }}>
              Saved locally
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {recentToolItems.slice(0, 4).map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={`recent-${tool.id}`}
                  onClick={() => onNavigate(`tool:${tool.slug}`)}
                  className="group relative p-4 border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md"
                  style={{
                    backgroundColor: effectiveColors.surfaceBg,
                    borderColor: effectiveColors.borderColor,
                    borderRadius: config.radius === 'small' ? '8px' : config.radius === 'large' ? '18px' : '12px',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${effectiveColors.primary}15`,
                        color: effectiveColors.primary,
                      }}
                    >
                      {tool.category.replace('-', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                  <h3 className="font-bold text-xs line-clamp-1 group-hover:underline" style={{ color: effectiveColors.textMain }}>
                    {tool.name}
                  </h3>
                  <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-semibold" style={{ borderColor: effectiveColors.borderColor, color: effectiveColors.linkColor }}>
                    <span>Resume Tool</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* POPULAR TOOLS SECTION */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: effectiveColors.textMain }}>
                <Sparkles className="w-5 h-5 text-amber-500" /> Most Popular Tools
              </h2>
              <p className="text-xs mt-1" style={{ color: effectiveColors.textSecondary }}>
                Essential utilities used daily by cyber cafes, students, and studios.
              </p>
            </div>
            <button
              onClick={() => onNavigate('all-tools')}
              className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              style={{ color: effectiveColors.linkColor }}
            >
              <span>View all {TOOLS.length} tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.slice(0, 8).map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(`tool:${tool.slug}`)}
                  className="group relative p-5 border hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  style={{
                    backgroundColor: effectiveColors.surfaceBg,
                    borderColor: effectiveColors.borderColor,
                    borderRadius: config.radius === 'small' ? '8px' : config.radius === 'large' ? '20px' : '14px',
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform shadow-xs"
                        style={{
                          backgroundColor: `${effectiveColors.primary}18`,
                          color: effectiveColors.primary,
                        }}
                      >
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${effectiveColors.accent}20`,
                              color: effectiveColors.accent,
                            }}
                          >
                            {tool.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(tool.id);
                          }}
                          className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                          title="Save to favorites"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm transition-colors" style={{ color: effectiveColors.textMain }}>
                      {tool.name}
                    </h3>
                    <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: effectiveColors.textSecondary }}>
                      {tool.description}
                    </p>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold"
                    style={{
                      borderColor: effectiveColors.borderColor,
                      color: effectiveColors.linkColor,
                    }}
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CATEGORY SELECTOR & ALL TOOLS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: effectiveColors.textMain }}>
              All Online Tools
            </h2>
            <p className="text-xs mt-1" style={{ color: effectiveColors.textSecondary }}>
              Browse by category or search any utility directly.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected ? 'text-white shadow-xs' : 'hover:border-indigo-400'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: effectiveColors.primary,
                          borderColor: effectiveColors.primary,
                        }
                      : {
                          backgroundColor: effectiveColors.surfaceBg,
                          borderColor: effectiveColors.borderColor,
                          color: effectiveColors.textSecondary,
                        }
                  }
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(`tool:${tool.slug}`)}
                  className="group p-5 border hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  style={{
                    backgroundColor: effectiveColors.surfaceBg,
                    borderColor: effectiveColors.borderColor,
                    borderRadius: config.radius === 'small' ? '8px' : config.radius === 'large' ? '20px' : '14px',
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <span
                        className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${effectiveColors.primary}15`,
                          color: effectiveColors.primary,
                        }}
                      >
                        {tool.category.replace('-', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm transition-colors" style={{ color: effectiveColors.textMain }}>
                      {tool.name}
                    </h3>
                    <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: effectiveColors.textSecondary }}>
                      {tool.description}
                    </p>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                    style={{ borderColor: effectiveColors.borderColor }}
                  >
                    <span className="text-[11px] font-mono" style={{ color: effectiveColors.textSecondary }}>
                      {tool.acceptedFormats.length ? 'Client-Side' : 'Free Tool'}
                    </span>
                    <span
                      className="font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
                      style={{ color: effectiveColors.linkColor }}
                    >
                      Launch Tool →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="py-16 text-center rounded-2xl border p-8"
            style={{
              backgroundColor: effectiveColors.surfaceBg,
              borderColor: effectiveColors.borderColor,
            }}
          >
            <p className="text-sm" style={{ color: effectiveColors.textSecondary }}>
              No tools found matching &quot;{searchQuery}&quot; in this category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs font-semibold hover:underline cursor-pointer"
              style={{ color: effectiveColors.linkColor }}
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* WHY SNAPDOC / SERVICE CENTRES & PRIVACY PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-base text-white">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Images, signatures, and personal documents never touch our servers. All rendering happens locally in your device&apos;s memory via HTML5 Canvas and Web APIs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-base text-white">Print-Ready Photo Sheets</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built specifically for passport photo studios and cyber cafes. Output precision 4×6 inch and A4 photo sheets with scissor cut marks at real 300 DPI.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-base text-white">No Mandatory Login</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No sign-up barriers, no Google account requirement, and no subscription paywalls. Open the browser, drag your file, process, and download immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Install Modal */}
      <AppInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        initialTab={installModalTab}
      />
    </div>
  );
};
