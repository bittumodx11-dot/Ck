import React, { useState } from 'react';
import {
  X,
  Palette,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  Check,
  Copy,
  Download,
  Upload,
  Sparkles,
  Sliders,
  Type,
  Layout,
  Eye,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Star,
  Search,
} from 'lucide-react';
import {
  useCustomTheme,
  THEME_PRESETS,
  AVAILABLE_FONTS,
  ThemeMode,
  ThemeColors,
  RadiusPreset,
  ShadowPreset,
  UiDensity,
  BgStyle,
  NavLayout,
} from '../../context/CustomThemeContext';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    config,
    activePreset,
    isDark,
    effectiveColors,
    setMode,
    selectPreset,
    updateColor,
    setBgStyle,
    setFontFamily,
    setUiDensity,
    setRadius,
    setShadow,
    setNavLayout,
    resetToDefault,
    resetCurrentPreset,
    exportThemeJSON,
    importThemeJSON,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useCustomTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography' | 'io'>('presets');
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isCustomizerOpen) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportThemeJSON());
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2500);
  };

  const handleApplyImport = () => {
    if (!importText.trim()) return;
    const success = importThemeJSON(importText);
    if (success) {
      setImportStatus('success');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('error');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  // Safe Hex input helper
  const renderColorRow = (
    label: string,
    description: string,
    colorKey: keyof ThemeColors
  ) => {
    const currentColor = effectiveColors[colorKey] || '#000000';
    return (
      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:border-indigo-400/50 transition-colors">
        <div className="pr-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white">{label}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{description}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <input
              type="color"
              value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#4F46E5'}
              onChange={(e) => updateColor(colorKey, e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
              title={`Pick ${label}`}
            />
          </div>
          <input
            type="text"
            value={currentColor}
            onChange={(e) => {
              const val = e.target.value;
              if (val.startsWith('#') || val === '') {
                updateColor(colorKey, val);
              }
            }}
            placeholder="#000000"
            className="w-20 px-2 py-1 text-xs font-mono font-semibold uppercase rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        style={{
          backgroundColor: effectiveColors.surfaceBg,
          color: effectiveColors.textMain,
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
              style={{ backgroundColor: effectiveColors.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Theme & Design Studio
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${effectiveColors.primary}20`,
                    color: effectiveColors.primary,
                  }}
                >
                  Live Preview
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize colors, fonts, presets, shadows, and UI density in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefault}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset everything to factory default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset All</span>
            </button>
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close theme customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto shrink-0">
          {[
            { id: 'presets', label: 'Theme Presets & Mode', icon: Sparkles },
            { id: 'colors', label: 'Color Palette', icon: Sliders },
            { id: 'typography', label: 'Typography & Layout', icon: Type },
            { id: 'io', label: 'Export & Backup', icon: Copy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: effectiveColors.primary,
                      }
                    : undefined
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Workspace (Split layout: Settings on Left, Live Preview on Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-160px)]">
            {/* TAB 1: PRESETS & MODE */}
            {activeTab === 'presets' && (
              <div className="space-y-6">
                {/* Theme Mode Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Appearance Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { mode: 'light', label: 'Light Mode', icon: Sun },
                      { mode: 'dark', label: 'Dark Mode', icon: Moon },
                      { mode: 'system', label: 'System Mode', icon: Laptop },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = config.mode === item.mode;
                      return (
                        <button
                          key={item.mode}
                          onClick={() => setMode(item.mode as ThemeMode)}
                          className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 8 Ready-made Theme Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Ready-Made Theme Preset
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Pick any preset to customize further
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THEME_PRESETS.map((preset) => {
                      const isSelected = config.presetId === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => selectPreset(preset.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {/* Color swatches dots */}
                              <div className="flex -space-x-1">
                                <span
                                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs"
                                  style={{ backgroundColor: preset.previewColor }}
                                />
                                <span
                                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs"
                                  style={{ backgroundColor: preset.accentColor }}
                                />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {preset.name}
                              </span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Active Preset Palette */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Made changes and want to restore this preset?
                  </span>
                  <button
                    onClick={resetCurrentPreset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset &quot;{activePreset.name}&quot; Defaults</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: COLOR PALETTE */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Fine-Tune Exact HEX Colors
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Changes apply instantly to {isDark ? 'Dark Mode' : 'Light Mode'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMode(isDark ? 'light' : 'dark')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      {isDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>Switch to {isDark ? 'Light' : 'Dark'} Tuning</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {renderColorRow('Primary Color', 'Main brand accent, buttons, active highlights', 'primary')}
                  {renderColorRow('Primary Hover', 'Interaction hover state for primary elements', 'primaryHover')}
                  {renderColorRow('Secondary Color', 'Subtitles, secondary buttons, subtle borders', 'secondary')}
                  {renderColorRow('Accent Color', 'Badges, status indicators, glowing highlights', 'accent')}
                  {renderColorRow('Page Background', 'Whole application canvas background', 'pageBg')}
                  {renderColorRow('Surface & Card Background', 'Cards, modals, sidebars, container surface', 'surfaceBg')}
                  {renderColorRow('Main Text', 'Headings, primary paragraph reading text', 'textMain')}
                  {renderColorRow('Secondary Text', 'Subtext, captions, metadata, dates', 'textSecondary')}
                  {renderColorRow('Border Color', 'Card outlines, dividers, input borders', 'borderColor')}
                  {renderColorRow('Button Background', 'Primary action button background', 'buttonBg')}
                  {renderColorRow('Button Text', 'Text inside primary action buttons', 'buttonText')}
                  {renderColorRow('Header Background', 'Sticky navigation header bar surface', 'headerBg')}
                  {renderColorRow('Link & Focus Color', 'Clickable hyperlinks and accessibility focus rings', 'linkColor')}
                </div>
              </div>
            )}

            {/* TAB 3: TYPOGRAPHY & LAYOUT */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                {/* Font Family */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Font Family
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_FONTS.map((font) => {
                      const isSelected = config.fontFamily === font.id;
                      return (
                        <button
                          key={font.id}
                          onClick={() => setFontFamily(font.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                          style={{ fontFamily: font.family }}
                        >
                          <div className="text-xs">{font.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            Quick brown fox jumps over lazy dog • ১ ২ ৩ বাংলা
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* UI Density */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Interface Density
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'compact', label: 'Compact', desc: 'Tight spacing for power users' },
                      { id: 'comfortable', label: 'Comfortable', desc: 'Balanced default readability' },
                      { id: 'spacious', label: 'Spacious', desc: 'Airy, relaxed touch padding' },
                    ].map((item) => {
                      const isSelected = config.uiDensity === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setUiDensity(item.id as UiDensity)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Corner Radius */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Corner Radius (Curvature)
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'small', label: 'Small (6px)', previewClass: 'rounded-md' },
                      { id: 'medium', label: 'Medium (12px)', previewClass: 'rounded-xl' },
                      { id: 'large', label: 'Large (18px)', previewClass: 'rounded-2xl' },
                    ].map((item) => {
                      const isSelected = config.radius === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setRadius(item.id as RadiusPreset)}
                          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-4 h-4 bg-slate-300 dark:bg-slate-700 ${item.previewClass}`} />
                          <span className="text-xs">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shadow Intensity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Card Shadow Intensity
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'soft', label: 'Soft' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'elevated', label: 'Elevated' },
                    ].map((item) => {
                      const isSelected = config.shadow === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setShadow(item.id as ShadowPreset)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Styling */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Background Style
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'solid', label: 'Solid Color', desc: 'Minimal clean flat field' },
                      { id: 'subtle-gradient', label: 'Subtle Gradient', desc: 'Soft top-to-bottom tint' },
                      { id: 'mesh-gradient', label: 'Mesh Glow', desc: 'Subtle ambient radial light' },
                    ].map((item) => {
                      const isSelected = config.bgStyle === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setBgStyle(item.id as BgStyle)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EXPORT / IMPORT */}
            {activeTab === 'io' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Export Theme Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Copy your customized palette and font configuration to share with colleagues or save a backup.
                  </p>
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={5}
                      value={exportThemeJSON()}
                      className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={handleCopyJSON}
                      className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                    >
                      {copiedJSON ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Import Theme JSON
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Paste a theme JSON config to immediately apply its styles.
                  </p>
                  <textarea
                    rows={4}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder='Paste {"mode": "dark", "presetId": "emerald", ...}'
                    className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between mt-2.5">
                    {importStatus === 'success' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Theme imported successfully!
                      </span>
                    )}
                    {importStatus === 'error' && (
                      <span className="text-xs font-bold text-rose-600">
                        Invalid JSON format. Please verify your theme structure.
                      </span>
                    )}
                    {!importStatus && <span />}
                    <button
                      onClick={handleApplyImport}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                    >
                      Apply Imported Theme
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Live Preview (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-50/60 dark:bg-slate-950/60 space-y-4 overflow-y-auto max-h-[calc(92vh-160px)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                Live UI Sandbox
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {activePreset.name} • {isDark ? 'Dark' : 'Light'}
              </span>
            </div>

            {/* Mock Header Sample */}
            <div
              className="p-3 rounded-2xl border shadow-xs flex items-center justify-between transition-colors"
              style={{
                backgroundColor: effectiveColors.headerBg,
                borderColor: effectiveColors.borderColor,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: effectiveColors.primary }}
                >
                  S
                </div>
                <span className="text-xs font-extrabold" style={{ color: effectiveColors.textMain }}>
                  SnapDoc Studio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${effectiveColors.primary}15`,
                    color: effectiveColors.primary,
                  }}
                >
                  Active Theme
                </span>
              </div>
            </div>

            {/* Mock Card Sample */}
            <div
              className="p-5 border transition-all"
              style={{
                backgroundColor: effectiveColors.surfaceBg,
                borderColor: effectiveColors.borderColor,
                borderRadius:
                  config.radius === 'small' ? '6px' : config.radius === 'large' ? '18px' : '12px',
                boxShadow:
                  config.shadow === 'none'
                    ? 'none'
                    : config.shadow === 'elevated'
                    ? '0 10px 15px -3px rgba(0,0,0,0.1)'
                    : '0 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs"
                  style={{
                    backgroundColor: `${effectiveColors.primary}18`,
                    color: effectiveColors.primary,
                  }}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${effectiveColors.accent}20`,
                    color: effectiveColors.accent,
                  }}
                >
                  CLIENT-SIDE
                </span>
              </div>

              <h4 className="text-sm font-black" style={{ color: effectiveColors.textMain }}>
                Passport & Document Maker
              </h4>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: effectiveColors.textSecondary }}>
                Real-time preview responding instantaneously to your chosen color palette, font typography, and radius.
              </p>

              <div
                className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                style={{ borderColor: effectiveColors.borderColor }}
              >
                <span style={{ color: effectiveColors.textSecondary }} className="text-[11px] font-mono">
                  Ready to Export
                </span>
                <span
                  className="font-bold flex items-center gap-1 cursor-pointer"
                  style={{ color: effectiveColors.linkColor }}
                >
                  Launch Tool <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Interactive Buttons Sandbox */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Interactive Buttons
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: effectiveColors.buttonBg,
                    color: effectiveColors.buttonText,
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    borderColor: effectiveColors.borderColor,
                    color: effectiveColors.textMain,
                    backgroundColor: `${effectiveColors.secondary}15`,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  style={{
                    borderColor: effectiveColors.borderColor,
                    color: effectiveColors.textSecondary,
                  }}
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Form Input Field Sandbox */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Input & Focus Ring
              </span>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Interactive input with customized focus..."
                  defaultValue="Kolkata Cyber Studio Sample"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border transition-all focus:outline-none"
                  style={{
                    backgroundColor: effectiveColors.surfaceBg,
                    color: effectiveColors.textMain,
                    borderColor: effectiveColors.borderColor,
                  }}
                />
              </div>
            </div>

            {/* Color Palette Chips */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Active Hex Tokens
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                <div className="p-1.5 rounded-lg border text-center" style={{ borderColor: effectiveColors.borderColor }}>
                  <div className="w-full h-3 rounded mb-1" style={{ backgroundColor: effectiveColors.primary }} />
                  <span className="truncate block" style={{ color: effectiveColors.textSecondary }}>
                    {effectiveColors.primary}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg border text-center" style={{ borderColor: effectiveColors.borderColor }}>
                  <div className="w-full h-3 rounded mb-1" style={{ backgroundColor: effectiveColors.accent }} />
                  <span className="truncate block" style={{ color: effectiveColors.textSecondary }}>
                    {effectiveColors.accent}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg border text-center" style={{ borderColor: effectiveColors.borderColor }}>
                  <div className="w-full h-3 rounded mb-1" style={{ backgroundColor: effectiveColors.pageBg }} />
                  <span className="truncate block" style={{ color: effectiveColors.textSecondary }}>
                    {effectiveColors.pageBg}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg border text-center" style={{ borderColor: effectiveColors.borderColor }}>
                  <div className="w-full h-3 rounded mb-1" style={{ backgroundColor: effectiveColors.surfaceBg }} />
                  <span className="truncate block" style={{ color: effectiveColors.textSecondary }}>
                    {effectiveColors.surfaceBg}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Theme auto-saves to your local browser storage</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: effectiveColors.buttonBg }}
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
