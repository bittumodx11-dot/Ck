import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import {
  calculatePixels,
  applyImageFilters,
  replaceBackground,
} from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import {
  UserCheck,
  Download,
  Palette,
  Sparkles,
  Sliders,
  Printer,
  Eye,
  Check,
} from 'lucide-react';

interface PassportPhotoMakerProps {
  onGoToSheet?: (photoDataUrl: string) => void;
  presetKey?: string;
}

export const PassportPhotoMaker: React.FC<PassportPhotoMakerProps> = ({
  onGoToSheet,
  presetKey = '35x45',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Dimension settings
  const [unit, setUnit] = useState<'mm' | 'cm' | 'inch'>('mm');
  const [photoWidth, setPhotoWidth] = useState<number>(35);
  const [photoHeight, setPhotoHeight] = useState<number>(45);
  const [dpi, setDpi] = useState<number>(300);
  const [selectedPreset, setSelectedPreset] = useState<string>(presetKey);

  // Background replacement
  const [bgColor, setBgColor] = useState<string>('#87CEEB'); // Default sky blue per PRD #21
  const [applyBgChange, setApplyBgChange] = useState<boolean>(false);

  // Enhancement controls (preserves identity)
  const [brightness, setBrightness] = useState<number>(5);
  const [contrast, setContrast] = useState<number>(10);
  const [sharpness, setSharpness] = useState<number>(25);
  const [exposure, setExposure] = useState<number>(0);

  // Editor-only head alignment guides
  const [showHeadGuide, setShowHeadGuide] = useState<boolean>(true);

  // Pan and Zoom inside passport frame
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    };
    img.src = URL.createObjectURL(files[0]);
  };

  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    if (key === '35x45') {
      setUnit('mm');
      setPhotoWidth(35);
      setPhotoHeight(45);
      setDpi(300);
    } else if (key === '2x2') {
      setUnit('inch');
      setPhotoWidth(2);
      setPhotoHeight(2);
      setDpi(300);
    } else if (key === '51x51') {
      setUnit('mm');
      setPhotoWidth(51);
      setPhotoHeight(51);
      setDpi(300);
    } else if (key === 'pan') {
      setUnit('cm');
      setPhotoWidth(2.5);
      setPhotoHeight(3.5);
      setDpi(200);
    } else if (key === 'ssc_upsc') {
      setUnit('cm');
      setPhotoWidth(3.5);
      setPhotoHeight(4.5);
      setDpi(200);
    }
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const wPx = calculatePixels(photoWidth, unit, dpi);
    const hPx = calculatePixels(photoHeight, unit, dpi);

    canvas.width = wPx;
    canvas.height = hPx;
    const ctx = canvas.getContext('2d')!;

    // Clean background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, wPx, hPx);

    // Draw image centered with zoom & pan
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const boxAspect = wPx / hPx;
    let baseW = wPx;
    let baseH = hPx;
    if (imgAspect > boxAspect) {
      baseW = hPx * imgAspect;
    } else {
      baseH = wPx / imgAspect;
    }

    const drawW = baseW * zoom;
    const drawH = baseH * zoom;
    const drawX = (wPx - drawW) / 2 + panX;
    const drawY = (hPx - drawH) / 2 + panY;

    ctx.drawImage(imgElement, drawX, drawY, drawW, drawH);

    // Apply studio enhancements (brightness, contrast, sharpness, exposure)
    applyImageFilters(ctx, wPx, hPx, {
      brightness,
      contrast,
      sharpness,
      exposure,
    });

    // Replace background color if active
    if (applyBgChange) {
      replaceBackground(ctx, wPx, hPx, bgColor, 42);
    }
  }, [
    imgElement,
    photoWidth,
    photoHeight,
    unit,
    dpi,
    zoom,
    panX,
    panY,
    brightness,
    contrast,
    sharpness,
    exposure,
    applyBgChange,
    bgColor,
  ]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setPanX((p) => p + dx);
    setPanY((p) => p + dy);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        downloadFile(
          blob,
          `passport-photo-${photoWidth}x${photoHeight}${unit}-${dpi}dpi.jpg`,
          'image/jpeg'
        );
      },
      'image/jpeg',
      0.95
    );
  };

  const handleCreateSheet = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
    if (onGoToSheet) {
      onGoToSheet(dataUrl);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select portrait photo for Passport / Visa"
          sublabel="Works with phone selfies, portraits, and studio photos"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-500" /> Passport Presets & Specs
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '35x45', label: '35 × 45 mm', desc: 'India / UK / EU' },
                { id: '2x2', label: '2 × 2 Inch', desc: 'US Visa / OCI' },
                { id: '51x51', label: '51 × 51 mm', desc: 'Global Visa' },
                { id: 'ssc_upsc', label: '3.5 × 4.5 cm', desc: 'SSC / UPSC' },
                { id: 'pan', label: '2.5 × 3.5 cm', desc: 'PAN Card' },
                { id: 'custom', label: 'Custom', desc: 'Custom Size' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`py-2 px-2 rounded-xl text-center border transition-all ${
                    selectedPreset === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] opacity-75">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* DPI selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Print Resolution: <span className="text-indigo-600 font-bold">{dpi} DPI</span> (
                {calculatePixels(photoWidth, unit, dpi)} × {calculatePixels(photoHeight, unit, dpi)}{' '}
                px)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[150, 200, 300, 600].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDpi(d)}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${
                      dpi === d
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Changer */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyBgChange}
                  onChange={(e) => setApplyBgChange(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" /> Replace Photo Background
                </span>
              </label>

              {applyBgChange && (
                <div className="flex flex-wrap items-center gap-2 pl-5">
                  {[
                    { color: '#87CEEB', label: 'Sky Blue (Official)' },
                    { color: '#FFFFFF', label: 'White' },
                    { color: '#E0F2FE', label: 'Light Blue' },
                    { color: '#E2E8F0', label: 'Light Grey' },
                    { color: '#CBD5E1', label: 'Studio Grey' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setBgColor(c.color)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${
                        bgColor === c.color
                          ? 'border-indigo-600 font-bold ring-2 ring-indigo-300'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Photo Enhancement (strictly preserves identity per PRD #22) */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Natural Skin & Studio Enhancement
                </span>
                <span className="text-[10px] text-slate-400">Preserves Face Identity</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Brightness</span>
                    <span>{brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Contrast</span>
                    <span>{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Sharpness</span>
                    <span>{sharpness}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={sharpness}
                    onChange={(e) => setSharpness(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Zoom</span>
                    <span>{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Head guide toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeadGuide}
                  onChange={(e) => setShowHeadGuide(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" /> Show Head & Shoulder Alignment
                  Guides (Editor Only)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Single Passport Photo
              </button>

              <button
                onClick={handleCreateSheet}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Generate Printable Sheet (4×6 or A4)
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another photo
              </button>
            </div>
          </div>

          {/* Interactive Passport Viewport */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px] relative select-none">
            <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-2">
              <span>💡 Tip: Click and drag inside photo to pan/adjust face positioning</span>
            </div>

            {/* Frame container */}
            <div
              className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-indigo-400 cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <canvas
                ref={canvasRef}
                className="max-h-[440px] max-w-full block object-contain"
              />

              {/* Editor-only Head Position Guide overlay (PRD #23) */}
              {showHeadGuide && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  {/* Head Oval */}
                  <div className="w-[62%] h-[68%] rounded-[50%] border-2 border-dashed border-amber-400/70 absolute top-[12%]" />
                  {/* Eye line */}
                  <div className="w-full border-t border-cyan-400/60 absolute top-[44%]" />
                  {/* Chin line */}
                  <div className="w-24 border-t-2 border-amber-400/80 absolute top-[78%]" />
                  {/* Shoulder curve indicator */}
                  <div className="w-[85%] h-[20%] border-t-2 border-dotted border-white/50 absolute top-[85%] rounded-[50%]" />
                  <span className="absolute top-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-300">
                    Align Eyes & Chin inside Oval
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Passport Size: {photoWidth} × {photoHeight} {unit} ({calculatePixels(photoWidth, unit, dpi)} ×{' '}
              {calculatePixels(photoHeight, unit, dpi)} px @ {dpi} DPI)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
