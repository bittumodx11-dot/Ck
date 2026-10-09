import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Moon,
  Sun,
  Laptop,
  Menu,
  X,
  Star,
  Clock,
  Sparkles,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  HardDriveDownload,
  Download,
  Smartphone,
  Monitor,
  Palette,
} from 'lucide-react';
import { ToolItem } from '../../types';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { FeedbackModal } from './FeedbackModal';
import { AppInstallModal } from './AppInstallModal';
import { usePlatformTheme } from '../../context/PlatformThemeContext';
import { useCustomTheme } from '../../context/CustomThemeContext';
import { PlatformSwitcherModal } from '../platform/PlatformSwitcherModal';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  favorites: string[];
  recentTools: string[];
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  favorites,
  recentTools,
  theme,
  setTheme,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { activePlatform, isAndroid } = usePlatformTheme();
  const { setIsCustomizerOpen, effectiveColors, activePreset } = useCustomTheme();
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Keyboard shortcut Ctrl+K or / to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCategoriesOpen(false);
        setThemeMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const recentToolItems = recentTools
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as ToolItem[];

  return (
    <>
      <header className="no-print sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                SnapDoc<span className="text-indigo-600 dark:text-indigo-400">Tools</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                100% Client-Side
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('all-tools')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentPage === 'all-tools'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              All Tools
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {categoriesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate(`category:${cat.id}`);
                        setCategoriesOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('tool:passport-photo-maker')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Passport Photo
            </button>

            <button
              onClick={() => onNavigate('tool:passport-sheet-maker')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Photo Sheet
            </button>

            <button
              onClick={() => onNavigate('tool:image-to-pdf')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              PDF Tools
            </button>

            <button
              onClick={() => onNavigate('tool:biodata-maker')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition-colors"
            >
              Biodata & CV
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search tools...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Platform Theme Switcher (Android vs PC Theme) */}
            <button
              onClick={() => setShowPlatformModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isAndroid
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 shadow-xs'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 shadow-xs'
              }`}
              title="Switch Themes: Android Material 3 vs PC Workstation"
            >
              {isAndroid ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Android Theme</span>
                  <span className="sm:hidden">Android</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">PC Theme</span>
                  <span className="sm:hidden">PC</span>
                </>
              )}
            </button>

            {/* Download App (APK / PC) button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
              title="Download APK for Android or .EXE for PC"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>Download App</span>
              <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1 py-0.5 rounded font-mono">APK / PC</span>
            </button>

            {/* Developer Feedback quick button */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 transition-colors"
              title="Contact Developer Bittu Khan"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Feedback</span>
            </button>

            {/* Global Theme & Colors Customizer Button */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-indigo-500 shadow-xs active:scale-95"
              title="Customize Themes, Colors, Fonts & Layout (Live Preview)"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Theme</span>
              <span
                className="w-2 h-2 rounded-full inline-block shadow-2xs"
                style={{ backgroundColor: effectiveColors.primary }}
              />
            </button>

            {/* Theme Toggle Menu */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Laptop className="w-4 h-4" />
                )}
              </button>

              {themeMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setThemeMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setTheme('light');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Laptop className="w-3.5 h-3.5" /> System
                  </button>

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsCustomizerOpen(true);
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                  >
                    <Palette className="w-3.5 h-3.5" /> Customizer Studio...
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  onNavigate('all-tools');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                ⚡ All 30+ Tools
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:passport-photo-maker');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                👤 Passport Photo
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:passport-sheet-maker');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                🖨️ 4×6 / A4 Sheet
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:reduce-image-size');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                🎯 Target KB Resizer
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:resize-signature');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                ✍️ Signature Resizer
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:image-to-pdf');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                📄 Image to PDF
              </button>
              <button
                onClick={() => {
                  onNavigate('tool:biodata-maker');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-left"
              >
                📋 Biodata Maker (বাংলা)
              </button>
              <button
                onClick={() => {
                  setIsCustomizerOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>Theme & Color Customizer Studio</span>
              </button>
              <button
                onClick={() => {
                  setShowInstallModal(true);
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>Download App (Android APK & PC .EXE)</span>
              </button>
            </div>

            {/* Quick Developer info & Feedback */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Dev: <strong>Bittu Khan</strong></span>
              <button
                onClick={() => {
                  setShowFeedbackModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-medium underline"
              >
                Feedback / WhatsApp
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. Passport, Resize 20KB, PDF, Signature, Biodata)..."
                className="w-full text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ESC
              </button>
            </div>

            {/* Results or recent */}
            <div className="max-h-96 overflow-y-auto p-2">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          onNavigate(`tool:${tool.slug}`);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tool.category}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No tools found matching &quot;{searchQuery}&quot;. Try &apos;passport&apos;, &apos;crop&apos;, &apos;pdf&apos;, or &apos;size&apos;.
                  </div>
                )
              ) : (
                <div className="p-3 space-y-4">
                  {recentToolItems.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Recent Tools
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {recentToolItems.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              onNavigate(`tool:${tool.slug}`);
                              setSearchOpen(false);
                            }}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left text-xs hover:border-indigo-500 transition-colors"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                              {tool.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular Quick Picks
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TOOLS.filter((t) => t.popular)
                        .slice(0, 6)
                        .map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              onNavigate(`tool:${tool.slug}`);
                              setSearchOpen(false);
                            }}
                            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left text-xs transition-colors"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                              {tool.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
      <AppInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        initialTab={isAndroid ? 'android' : 'pc'}
      />
      <PlatformSwitcherModal isOpen={showPlatformModal} onClose={() => setShowPlatformModal(false)} />
    </>
  );
};
