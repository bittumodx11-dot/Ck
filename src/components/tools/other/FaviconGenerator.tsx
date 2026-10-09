import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Globe, Download, Check, Sparkles } from 'lucide-react';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];

export const FaviconGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<Array<{ size: number; dataUrl: string }>>([]);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const results = FAVICON_SIZES.map((size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(img, 0, 0, size, size);
        return {
          size,
          dataUrl: canvas.toDataURL('image/png'),
        };
      });
      setGeneratedIcons(results);
    };
    img.src = URL.createObjectURL(files[0]);
  };

  const handleDownloadSingle = (size: number, dataUrl: string) => {
    downloadFile(dataUrl, `favicon-${size}x${size}.png`, 'image/png');
  };

  const handleDownloadAll = () => {
    generatedIcons.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadSingle(item.size, item.dataUrl);
      }, idx * 300);
    });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select square logo or icon to generate Favicons"
          sublabel="Generates all standard website favicon PNGs: 16px, 32px, 48px, 64px, 128px, 256px"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Favicons Generated ({generatedIcons.length} Sizes)
              </h3>
              <p className="text-xs text-slate-500">
                Pixel-perfect sharp resampling for browser tabs, mobile bookmarks, and progressive web apps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAll}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download All Favicons
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setGeneratedIcons([]);
                }}
                className="py-2 px-3 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Upload different icon
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {generatedIcons.map((item) => (
              <div
                key={item.size}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-between text-center"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                  {item.size} × {item.size} px
                </div>

                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center p-2 mb-3 border border-slate-200 dark:border-slate-800">
                  <img
                    src={item.dataUrl}
                    alt={`${item.size}x${item.size}`}
                    style={{ width: `${Math.min(item.size, 64)}px`, height: `${Math.min(item.size, 64)}px` }}
                    className="image-rendering-pixelated"
                  />
                </div>

                <button
                  onClick={() => handleDownloadSingle(item.size, item.dataUrl)}
                  className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
