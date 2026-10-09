import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { applyImageFilters } from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import { SlidersHorizontal, Download, Sparkles, Check } from 'lucide-react';

export const DocumentEnhancementTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Enhancement Mode: 'original' | 'auto' | 'document' | 'bw' | 'grayscale'
  const [mode, setMode] = useState<'original' | 'auto' | 'document' | 'bw' | 'grayscale'>('document');
  const [brightness, setBrightness] = useState<number>(15);
  const [contrast, setContrast] = useState<number>(35);
  const [sharpness, setSharpness] = useState<number>(40);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = URL.createObjectURL(files[0]);
  };

  const applyModePreset = (m: 'original' | 'auto' | 'document' | 'bw' | 'grayscale') => {
    setMode(m);
    if (m === 'original') {
      setBrightness(0);
      setContrast(0);
      setSharpness(0);
    } else if (m === 'auto') {
      setBrightness(10);
      setContrast(20);
      setSharpness(30);
    } else if (m === 'document') {
      setBrightness(20);
      setContrast(45);
      setSharpness(50);
    } else if (m === 'bw') {
      setBrightness(15);
      setContrast(60);
      setSharpness(60);
    } else if (m === 'grayscale') {
      setBrightness(10);
      setContrast(25);
      setSharpness(25);
    }
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = imgElement.naturalWidth;
    const h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(imgElement, 0, 0);

    applyImageFilters(ctx, w, h, {
      brightness,
      contrast,
      sharpness,
      grayscale: mode === 'grayscale',
      blackAndWhite: mode === 'bw',
    });
  }, [imgElement, mode, brightness, contrast, sharpness]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const base = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(blob, `${base}-enhanced-${mode}.jpg`, 'image/jpeg');
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
          label="Select document to enhance"
          sublabel="Improve readability, convert to clean black & white or clear photocopy mode"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Enhancement Modes
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'document', label: 'Clean Document', desc: 'Whitens background paper' },
                { id: 'bw', label: 'Pure Black & White', desc: 'High contrast photocopy' },
                { id: 'auto', label: 'Auto Balanced', desc: 'Natural text contrast' },
                { id: 'grayscale', label: 'Grayscale', desc: 'Even monochrome tone' },
                { id: 'original', label: 'Original', desc: 'No filters applied' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => applyModePreset(item.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    mode === item.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-75">{item.desc}</div>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Paper Whitening (Brightness)</span>
                  <span>{brightness}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="60"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Text Contrast</span>
                  <span>{contrast}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="80"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Letter Sharpness</span>
                  <span>{sharpness}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sharpness}
                  onChange={(e) => setSharpness(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Enhanced Document
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Upload different document
              </button>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="lg:col-span-7 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
