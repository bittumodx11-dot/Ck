import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { applyImageFilters } from '../../../utils/imageProcessing';
import { Sparkles, Sliders, Download, RefreshCw, CircleDot } from 'lucide-react';

export const ImageEffectsTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Effect sliders
  const [borderRadius, setBorderRadius] = useState<number>(0); // 0 to 50%
  const [blurVal, setBlurVal] = useState<number>(0); // 0 to 30
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [blackAndWhite, setBlackAndWhite] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [pixelate, setPixelate] = useState<number>(1); // 1 to 25

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
    };
    img.src = URL.createObjectURL(files[0]);
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = imgElement.naturalWidth;
    const h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    // Apply rounded clipping if border radius > 0
    if (borderRadius > 0) {
      const radiusPx = (Math.min(w, h) * borderRadius) / 100;
      ctx.beginPath();
      ctx.moveTo(radiusPx, 0);
      ctx.lineTo(w - radiusPx, 0);
      ctx.quadraticCurveTo(w, 0, w, radiusPx);
      ctx.lineTo(w, h - radiusPx);
      ctx.quadraticCurveTo(w, h, w - radiusPx, h);
      ctx.lineTo(radiusPx, h);
      ctx.quadraticCurveTo(0, h, 0, h - radiusPx);
      ctx.lineTo(0, radiusPx);
      ctx.quadraticCurveTo(0, 0, radiusPx, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Pixelate downscaling technique
    if (pixelate > 1) {
      const smallW = Math.max(1, Math.floor(w / pixelate));
      const smallH = Math.max(1, Math.floor(h / pixelate));
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(imgElement, 0, 0, smallW, smallH);
      ctx.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
    } else {
      ctx.drawImage(imgElement, 0, 0);
    }

    // Apply filters
    applyImageFilters(ctx, w, h, {
      grayscale,
      blackAndWhite,
      invert,
    });

    // Blur via canvas filter if supported
    if (blurVal > 0) {
      const blurCanvas = document.createElement('canvas');
      blurCanvas.width = w;
      blurCanvas.height = h;
      const bCtx = blurCanvas.getContext('2d')!;
      bCtx.filter = `blur(${blurVal}px)`;
      bCtx.drawImage(canvas, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(blurCanvas, 0, 0);
    }
  }, [imgElement, borderRadius, blurVal, grayscale, blackAndWhite, invert, pixelate]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const mime = borderRadius > 0 ? 'image/png' : 'image/jpeg';
    const ext = borderRadius > 0 ? 'png' : 'jpg';
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      downloadFile(blob, `${baseName}-effects.${ext}`, mime);
    }, mime, 0.95);
  };

  const handleReset = () => {
    setBorderRadius(0);
    setBlurVal(0);
    setGrayscale(false);
    setBlackAndWhite(false);
    setInvert(false);
    setPixelate(1);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image for effects & filters"
          sublabel="Round corners, blur, pixelate, grayscale"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Filter Controls
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Round Corners */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1">
                  <CircleDot className="w-3.5 h-3.5" /> Round Corners Radius
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {borderRadius}% {borderRadius === 50 ? '(Circle)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Square)</span>
                <span>25%</span>
                <span>50% (Circle)</span>
              </div>
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Blur Intensity</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{blurVal}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={blurVal}
                onChange={(e) => setBlurVal(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Pixelate */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Pixelate / Censor</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{pixelate}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={pixelate}
                onChange={(e) => setPixelate(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setGrayscale(!grayscale);
                  if (blackAndWhite) setBlackAndWhite(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                  grayscale
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Grayscale
              </button>

              <button
                onClick={() => {
                  setBlackAndWhite(!blackAndWhite);
                  if (grayscale) setGrayscale(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                  blackAndWhite
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Pure B&W
              </button>

              <button
                onClick={() => setInvert(!invert)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                  invert
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Invert
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Processed Image
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                  handleReset();
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="lg:col-span-7 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-[460px] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
