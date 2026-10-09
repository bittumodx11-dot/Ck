import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { calculatePixels } from '../../../utils/imageProcessing';
import { downloadFile, formatBytes } from '../../../utils/pdfProcessing';
import { FileText, Download, Sliders } from 'lucide-react';

export const A4ResizeTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [dpi, setDpi] = useState<number>(300);
  const [fitMode, setFitMode] = useState<'fit' | 'fill'>('fit');
  const [marginMm, setMarginMm] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = URL.createObjectURL(files[0]);
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;

    // A4 mm dimensions
    const widthMm = orientation === 'portrait' ? 210 : 297;
    const heightMm = orientation === 'portrait' ? 297 : 210;

    const canvasW = calculatePixels(widthMm, 'mm', dpi);
    const canvasH = calculatePixels(heightMm, 'mm', dpi);
    const marginPx = calculatePixels(marginMm, 'mm', dpi);

    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d')!;

    // Clean white A4 paper
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasW, canvasH);

    const availableW = canvasW - marginPx * 2;
    const availableH = canvasH - marginPx * 2;
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const availAspect = availableW / availableH;

    let drawW: number;
    let drawH: number;

    if (fitMode === 'fit') {
      if (imgAspect > availAspect) {
        drawW = availableW;
        drawH = availableW / imgAspect;
      } else {
        drawH = availableH;
        drawW = availableH * imgAspect;
      }
    } else {
      // fill
      if (imgAspect > availAspect) {
        drawH = availableH;
        drawW = availableH * imgAspect;
      } else {
        drawW = availableW;
        drawH = availableW / imgAspect;
      }
    }

    const posX = marginPx + (availableW - drawW) / 2;
    const posY = marginPx + (availableH - drawH) / 2;

    ctx.drawImage(imgElement, posX, posY, drawW, drawH);
  }, [imgElement, orientation, dpi, fitMode, marginMm]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(blob, `${baseName}-A4-${orientation}-${dpi}dpi.jpg`, 'image/jpeg');
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image to resize to A4"
          sublabel="Standard 210×297 mm format (2480×3508 px @ 300 DPI)"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> A4 Paper Settings
            </h3>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Page Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    orientation === 'portrait'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Portrait (210 × 297 mm)
                </button>
                <button
                  onClick={() => setOrientation('landscape')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    orientation === 'landscape'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Landscape (297 × 210 mm)
                </button>
              </div>
            </div>

            {/* DPI */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Print Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[150, 200, 300].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDpi(d)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
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

            {/* Fit mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Fit Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFitMode('fit')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    fitMode === 'fit'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Fit (Keep Entire Image)
                </button>
                <button
                  onClick={() => setFitMode('fill')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    fitMode === 'fill'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Fill Page
                </button>
              </div>
            </div>

            {/* Margins */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Page Margins</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{marginMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={marginMm}
                onChange={(e) => setMarginMm(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download A4 Image
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

          {/* Canvas preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px]">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
            <div className="mt-3 text-xs text-slate-400">
              A4 Sheet: {calculatePixels(orientation === 'portrait' ? 210 : 297, 'mm', dpi)} ×{' '}
              {calculatePixels(orientation === 'portrait' ? 297 : 210, 'mm', dpi)} px @ {dpi} DPI
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
