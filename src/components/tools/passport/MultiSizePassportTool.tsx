import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { calculatePixels } from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import { CopyCheck, Download, Check } from 'lucide-react';

interface SizeConfig {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  description: string;
}

const PRESET_SIZES: SizeConfig[] = [
  {
    id: '35x45',
    name: '35 × 45 mm',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    description: 'Standard India / UK / Schengen Passport',
  },
  {
    id: '2x2',
    name: '2 × 2 Inch (51 × 51 mm)',
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    description: 'US Visa, OCI Card, Online Portals',
  },
  {
    id: 'pan',
    name: '25 × 35 mm',
    widthMm: 25,
    heightMm: 35,
    dpi: 200,
    description: 'PAN Card & NSDL Application Format',
  },
  {
    id: 'exam',
    name: '35 × 35 mm',
    widthMm: 35,
    heightMm: 35,
    dpi: 200,
    description: 'State Govt & Railway Board Standard',
  },
];

export const MultiSizePassportTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [generatedSizes, setGeneratedSizes] = useState<
    Array<{
      config: SizeConfig;
      dataUrl: string;
      pixelW: number;
      pixelH: number;
    }>
  >([]);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const results = PRESET_SIZES.map((config) => {
        const wPx = calculatePixels(config.widthMm, 'mm', config.dpi);
        const hPx = calculatePixels(config.heightMm, 'mm', config.dpi);

        const canvas = document.createElement('canvas');
        canvas.width = wPx;
        canvas.height = hPx;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, wPx, hPx);

        // Aspect fit centered
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const boxAspect = wPx / hPx;
        let drawW = wPx;
        let drawH = hPx;
        if (imgAspect > boxAspect) {
          drawW = hPx * imgAspect;
        } else {
          drawH = wPx / imgAspect;
        }

        const posX = (wPx - drawW) / 2;
        const posY = (hPx - drawH) / 2;
        ctx.drawImage(img, posX, posY, drawW, drawH);

        return {
          config,
          dataUrl: canvas.toDataURL('image/jpeg', 0.95),
          pixelW: wPx,
          pixelH: hPx,
        };
      });

      setGeneratedSizes(results);
    };
    img.src = URL.createObjectURL(selected);
  };

  const handleDownloadSingle = (item: (typeof generatedSizes)[0]) => {
    downloadFile(
      item.dataUrl,
      `passport-${item.config.name.replace(/\s+/g, '')}-${item.config.dpi}dpi.jpg`
    );
  };

  const handleDownloadAll = () => {
    generatedSizes.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, idx * 400);
    });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Upload one photo to generate all standard sizes at once"
          sublabel="Generates 35×45mm, 2×2 inch, PAN Card, and Exam formats simultaneously"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Generated {generatedSizes.length} Passport Standard Formats
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Each dimension is resampled at official print DPI (200–300 DPI).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAll}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download All Sizes
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setGeneratedSizes([]);
                }}
                className="py-2 px-3 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Upload different photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {generatedSizes.map((item) => (
              <div
                key={item.config.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.config.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold">
                      {item.config.dpi} DPI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                    {item.config.description}
                  </p>

                  <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center mb-4 min-h-[200px]">
                    <img
                      src={item.dataUrl}
                      alt={item.config.name}
                      className="max-h-48 object-contain rounded shadow-md border border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 text-center mb-3">
                    Dimensions: {item.pixelW} × {item.pixelH} px
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadSingle(item)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download {item.config.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
