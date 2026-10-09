import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  FileCheck2,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronDown,
  Layers,
  Check,
} from 'lucide-react';
import { PROFESSIONAL_FONTS, FontOption } from '../../../utils/fontConstants';

interface A4DocumentReviewWorkbenchProps {
  documentRef: React.RefObject<HTMLDivElement | null>;
  currentFont: string;
  onFontChange: (fontId: string) => void;
  pageDensity?: 'comfortable' | 'standard' | 'compact' | 'ultra-compact';
  onDensityChange: (density: 'comfortable' | 'standard' | 'compact' | 'ultra-compact') => void;
  autoFitOnePage: boolean;
  onAutoFitToggle: (enabled: boolean) => void;
  pageLayout?: '1-page' | '2-pages' | 'auto';
  onPageLayoutChange?: (layout: '1-page' | '2-pages') => void;
  fontScale?: 'compact' | 'standard' | 'large';
  onFontScaleChange?: (scale: 'compact' | 'standard' | 'large') => void;
  documentTitle?: string;
  children: React.ReactNode;
}

export const A4DocumentReviewWorkbench: React.FC<A4DocumentReviewWorkbenchProps> = ({
  documentRef,
  currentFont,
  onFontChange,
  pageDensity = 'standard',
  onDensityChange,
  autoFitOnePage,
  onAutoFitToggle,
  pageLayout = 'auto',
  onPageLayoutChange,
  fontScale = 'standard',
  onFontScaleChange,
  documentTitle = 'A4 Document',
  children,
}) => {
  const [zoomScale, setZoomScale] = useState<'fit' | 0.75 | 1 | 1.15>('fit');
  const [showMarginsGuide, setShowMarginsGuide] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showDensityDropdown, setShowDensityDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageHeightPercentage, setPageHeightPercentage] = useState<number>(90);
  const [containerWidth, setContainerWidth] = useState<number>(850);
  const workbenchContainerRef = useRef<HTMLDivElement>(null);
  const draftingTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tableEl = draftingTableRef.current;
    if (!tableEl) return;
    const updateWidth = () => {
      if (tableEl.clientWidth > 0) {
        setContainerWidth(tableEl.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(tableEl);
    return () => ro.disconnect();
  }, []);

  const fitScale = Math.min(1, Math.max(0.35, (containerWidth - 32) / 810));
  const effectiveScale = zoomScale === 'fit' ? fitScale : zoomScale;

  // Standard A4 page height at 96 DPI: 1123px (794px width x 1123px height)
  const STANDARD_A4_HEIGHT_PX = 1123;

  // Measure content height inside A4 sheet to calculate 1-page fill percentage
  useEffect(() => {
    const el = documentRef.current;
    if (!el) return;

    const measureHeight = () => {
      const distinctPages = el.querySelectorAll('.a4-page');
      if (distinctPages.length > 1) {
        setPageHeightPercentage(distinctPages.length * 100);
        return;
      }
      const scrollH = el.scrollHeight;
      // Compare against 1123px
      const percent = Math.round((scrollH / STANDARD_A4_HEIGHT_PX) * 100);
      setPageHeightPercentage(percent);
    };

    measureHeight();

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [documentRef, currentFont, pageDensity, autoFitOnePage, fontScale, pageLayout]);

  const activeFontObj =
    PROFESSIONAL_FONTS.find((f) => f.id === currentFont) || PROFESSIONAL_FONTS[0];

  const handleApplyAutoFit = () => {
    onAutoFitToggle(true);
    if (onPageLayoutChange) onPageLayoutChange('1-page');
    onDensityChange('compact');
    if (onFontScaleChange) onFontScaleChange('compact');
  };

  const handleSwitchToTwoPages = () => {
    onAutoFitToggle(false);
    if (onPageLayoutChange) onPageLayoutChange('2-pages');
    onDensityChange('standard');
    if (onFontScaleChange) onFontScaleChange('standard');
  };

  const isTwoPagesMode = pageLayout === '2-pages';
  const isOverOnePage = pageHeightPercentage > 105 && !isTwoPagesMode;

  return (
    <div
      ref={workbenchContainerRef}
      className={`w-full flex flex-col items-center transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-8 overflow-y-auto'
          : 'relative'
      }`}
    >
      {/* ========================================================
          A4 REVIEW & WORKBENCH CONTROL BAR (Header)
          ======================================================== */}
      <div className="no-print w-full max-w-[840px] mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
        {/* Top row: A4 Status & 1-Page Height Gauge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  A4 পেপার রিভিউ (210 × 297 mm)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Standard A4 Ratio 1:1.414
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                প্রিন্ট ও ডাউনলোডের জন্য রিয়েল টাইম A4 পেপার প্রিভিউ
              </p>
            </div>
          </div>

          {/* 1-Page Guarantee / Height Meter Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isOverOnePage
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
              title="A4 পেজ হাইট পরিমাপ (১টি পেজের ক্ষমতা)"
            >
              {isOverOnePage ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
                  <span>
                    {pageHeightPercentage}% হাইট (১ পেজের বেশি)
                  </span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {pageHeightPercentage}% ভরা • ১টি পেজে পারফেক্ট ফিট ✓
                  </span>
                </>
              )}
            </div>

            {/* Page Count Mode Selector (1 Page vs 2 Pages) */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={handleApplyAutoFit}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isTwoPagesMode
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="১টি মাত্র A4 পেজে স্বয়ংক্রিয়ভাবে ফিট করুন"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>১ পেজ (1-Page)</span>
              </button>

              <button
                onClick={handleSwitchToTwoPages}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTwoPagesMode
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="২টি পরিচ্ছন্ন A4 পেজে বিভক্ত করুন (কোনো লেখা বা সেকশন কাটবে না)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>২ পেজ (2-Pages)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Interactive Controls (Font, Density, Zoom, Safety Margins) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Left: Professional Font Picker Quick Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFontDropdown(!showFontDropdown);
                setShowDensityDropdown(false);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                ফন্ট: <strong className="font-bold text-indigo-600 dark:text-indigo-400">{activeFontObj.name}</strong>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Font Dropdown Menu */}
            {showFontDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-40 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>প্রফেশনাল ফন্টসমূহ (Fonts)</span>
                  <span className="text-[10px] text-indigo-500">১২টি স্টাইল</span>
                </div>
                {PROFESSIONAL_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      onFontChange(font.id);
                      setShowFontDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      currentFont === font.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-xs"
                          style={{ fontFamily: font.cssFamily }}
                        >
                          {font.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          {font.tag}
                        </span>
                      </div>
                      <p
                        className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate"
                        style={{ fontFamily: font.cssFamily }}
                      >
                        {font.sampleText}
                      </p>
                    </div>
                    {currentFont === font.id && (
                      <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Density / Compactness Mode */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDensityDropdown(!showDensityDropdown);
                setShowFontDropdown(false);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                ঘনত্ব:{' '}
                <strong className="capitalize text-emerald-600 dark:text-emerald-400">
                  {pageDensity === 'comfortable'
                    ? 'স্বস্তিদায়ক'
                    : pageDensity === 'standard'
                    ? 'স্ট্যান্ডার্ড'
                    : pageDensity === 'compact'
                    ? 'কম্প্যাক্ট (১ পেজ)'
                    : 'আল্ট্রা কম্প্যাক্ট'}
                </strong>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Density Dropdown */}
            {showDensityDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-40 space-y-1">
                {[
                  {
                    id: 'comfortable',
                    label: 'স্বস্তিদায়ক (Comfortable)',
                    desc: 'খোলামেলা ও বেশি মার্জিন',
                  },
                  {
                    id: 'standard',
                    label: 'স্ট্যান্ডার্ড (Standard)',
                    desc: 'সাধারণ পরিমিত স্পেসিং',
                  },
                  {
                    id: 'compact',
                    label: 'কম্প্যাক্ট (Compact - ১ পেজ)',
                    desc: '১টি A4 পেজে সম্পূর্ণ তথ্যের জন্য সেরা',
                  },
                  {
                    id: 'ultra-compact',
                    label: 'আল্ট্রা কম্প্যাক্ট (Ultra Compact)',
                    desc: 'অতিরিক্ত তথ্যের জন্য সর্বাধিক ঘনত্ব',
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onDensityChange(d.id as any);
                      setShowDensityDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer ${
                      pageDensity === d.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{d.label}</div>
                    <div className="text-[10px] text-slate-400">{d.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Zoom Scale & Margin Guidelines & Fullscreen */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setZoomScale('fit')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                zoomScale === 'fit'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="স্ক্রিনের সাথে ফিট করুন"
            >
              Fit
            </button>
            <button
              onClick={() => setZoomScale(0.75)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                zoomScale === 0.75
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="75% জুম"
            >
              75%
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                zoomScale === 1
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="100% আসল A4 পেপার সাইজ (794px)"
            >
              100% Real
            </button>

            {/* Toggle Printable Safety Margins Guideline */}
            <button
              onClick={() => setShowMarginsGuide(!showMarginsGuide)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showMarginsGuide
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title={showMarginsGuide ? 'মার্জিন গাইডলাইন লুকান' : 'প্রিন্টেবল মার্জিন গাইডলাইন দেখুন'}
            >
              {showMarginsGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen review */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={isFullscreen ? 'ফুলস্ক্রিন বন্ধ করুন' : 'ফুলস্ক্রিন পেপার প্রিভিউ'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          A4 PAPER REVIEW WORKBENCH DRAFTING TABLE
          ======================================================== */}
      <div
        ref={draftingTableRef}
        className={`w-full flex justify-center items-start overflow-x-auto p-2 sm:p-6 rounded-3xl transition-all ${
          isFullscreen
            ? 'bg-slate-900/90 min-h-[90vh]'
            : 'bg-slate-200/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800'
        }`}
      >
        <div
          style={{
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top center',
            width: '794px',
            minWidth: '794px',
            maxWidth: '794px',
          }}
          className="relative transition-transform duration-200 shrink-0"
        >
          {/* Top Paper Header Ribbon (Review Only, hidden in print & export) */}
          <div className="no-print w-full flex items-center justify-between px-4 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-t-xl tracking-wider">
            <span>A4 PAPER SHEET (210 × 297 MM)</span>
            <span className="flex items-center gap-1">
              <span>{isTwoPagesMode ? '2-PAGES DOCUMENT' : '1-PAGE DOCUMENT'}</span>
              {isOverOnePage && (
                <span className="text-amber-400 font-extrabold ml-1">
                  [⚠️ পেজ বড় হয়েছে - ২ পেজ মোড ব্যবহার করুন]
                </span>
              )}
            </span>
          </div>

          {/* Printable Safety Margins Guideline Overlay */}
          {showMarginsGuide && (
            <div className="no-print absolute inset-x-8 inset-y-12 border-2 border-dashed border-indigo-400/40 pointer-events-none z-30 rounded-lg flex items-start justify-end p-2">
              <span className="bg-indigo-600/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                15mm Safe Print Area
              </span>
            </div>
          )}

          {/* Render Children (The Document Page Itself) */}
          {children}

          {/* Bottom Paper Sheet Indicator */}
          <div className="no-print w-full text-center py-2 text-[10px] text-slate-500 font-medium">
            A4 Standard {isTwoPagesMode ? 'Pages 1 & 2' : 'Page 1'} • SnapDoc Precision Document Studio
          </div>
        </div>
      </div>
    </div>
  );
};
