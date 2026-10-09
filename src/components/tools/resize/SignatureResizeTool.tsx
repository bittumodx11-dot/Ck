import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { calculatePixels } from '../../../utils/imageProcessing';
import { formatBytes, downloadFile } from '../../../utils/pdfProcessing';
import { PenTool, Download, Sliders, Check, Sparkles } from 'lucide-react';

export const SignatureResizeTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Preset sizes in cm
  const [preset, setPreset] = useState<'6x2' | '5x2' | '4x2' | 'custom'>('5x2');
  const [widthCm, setWidthCm] = useState<number>(5);
  const [heightCm, setHeightCm] = useState<number>(2);
  const [dpi, setDpi] = useState<number>(200);

  // Ink enhancement options
  const [boostInk, setBoostInk] = useState<boolean>(true);
  const [thresholdVal, setThresholdVal] = useState<number>(180);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [targetMaxKb, setTargetMaxKb] = useState<number>(20);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = URL.createObjectURL(files[0]);
  };

  const applyPreset = (p: '6x2' | '5x2' | '4x2') => {
    setPreset(p);
    if (p === '6x2') {
      setWidthCm(6);
      setHeightCm(2);
    } else if (p === '5x2') {
      setWidthCm(5);
      setHeightCm(2);
    } else if (p === '4x2') {
      setWidthCm(4);
      setHeightCm(2);
    }
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const wPx = calculatePixels(widthCm, 'cm', dpi);
    const hPx = calculatePixels(heightCm, 'cm', dpi);

    canvas.width = wPx;
    canvas.height = hPx;
    const ctx = canvas.getContext('2d')!;

    // Clean background
    if (transparentBg) {
      ctx.clearRect(0, 0, wPx, hPx);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, wPx, hPx);
    }

    // Fit signature preserving aspect ratio
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const boxAspect = wPx / hPx;
    let drawW = wPx * 0.9;
    let drawH = hPx * 0.9;
    if (imgAspect > boxAspect) {
      drawH = drawW / imgAspect;
    } else {
      drawW = drawH * imgAspect;
    }
    const drawX = (wPx - drawW) / 2;
    const drawY = (hPx - drawH) / 2;

    ctx.drawImage(imgElement, drawX, drawY, drawW, drawH);

    // Boost ink and threshold white paper
    if (boostInk) {
      const imgData = ctx.getImageData(0, 0, wPx, hPx);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        if (gray > thresholdVal) {
          // Paper background
          if (transparentBg) {
            data[i + 3] = 0; // Transparent
          } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          }
        } else {
          // Dark ink boost
          data[i] = 10;
          data[i + 1] = 20;
          data[i + 2] = 40; // Deep dark navy/black ink
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [imgElement, widthCm, heightCm, dpi, boostInk, thresholdVal, transparentBg]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const mime = transparentBg ? 'image/png' : 'image/jpeg';
    const ext = transparentBg ? 'png' : 'jpg';

    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(blob, `${baseName}-signature-${widthCm}x${heightCm}cm.${ext}`, mime);
      },
      mime,
      0.9
    );
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select signature image to resize"
          sublabel="Formats for SSC, UPSC, IBPS, PAN Card, and official exams (6×2cm, 5×2cm, <20KB)"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PenTool className="w-4 h-4 text-indigo-500" /> Exam Signature Presets
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '6x2', label: '6 × 2 cm', desc: 'SSC / UPSC' },
                { id: '5x2', label: '5 × 2 cm', desc: 'Standard' },
                { id: '4x2', label: '4 × 2 cm', desc: 'Compact' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-center border transition-all ${
                    preset === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] opacity-80">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Custom CM */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Width (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={widthCm}
                  onChange={(e) => {
                    setWidthCm(parseFloat(e.target.value) || 1);
                    setPreset('custom');
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={heightCm}
                  onChange={(e) => {
                    setHeightCm(parseFloat(e.target.value) || 1);
                    setPreset('custom');
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Ink Enhancer */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={boostInk}
                  onChange={(e) => setBoostInk(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Clean Paper Background & Boost Ink
                </span>
              </label>

              {boostInk && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Paper Whitening Threshold</span>
                    <span>{thresholdVal}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="230"
                    value={thresholdVal}
                    onChange={(e) => setThresholdVal(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Transparent Background (PNG format)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Resized Signature
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Canvas preview box */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl min-h-[440px]">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center max-w-full">
              <div className="text-[11px] font-semibold text-slate-400 mb-3">
                Preview: {widthCm} × {heightCm} cm ({calculatePixels(widthCm, 'cm', dpi)} ×{' '}
                {calculatePixels(heightCm, 'cm', dpi)} px @ {dpi} DPI)
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-dashed border-slate-600 inline-block max-w-full">
                <canvas
                  ref={canvasRef}
                  className="max-h-40 max-w-full object-contain rounded shadow-lg border border-slate-300"
                />
              </div>
              <p className="text-[11px] text-emerald-400 mt-3 font-medium">
                ✓ Crisp dark strokes & clean white paper background ready for official forms.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
