import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { FourCornerPerspectiveTool } from '../document/FourCornerPerspectiveTool';
import { applyImageFilters } from '../../../utils/imageProcessing';
import { imagesToPdf, downloadFile } from '../../../utils/pdfProcessing';
import { ScanLine, Download, Check, Sparkles, Sliders } from 'lucide-react';

export const ScanToPdfTool: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'dewarp' | 'enhance' | 'pdf'>('upload');
  const [initialFile, setInitialFile] = useState<File | null>(null);
  const [dewarpedCanvas, setDewarpedCanvas] = useState<HTMLCanvasElement | null>(null);

  // Enhancement options
  const [enhanceMode, setEnhanceMode] = useState<'clean' | 'bw' | 'color'>('clean');
  const [finalDataUrl, setFinalDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDewarpReady = (canvas: HTMLCanvasElement) => {
    setDewarpedCanvas(canvas);
    // Apply initial clean document enhancement
    const procCanvas = document.createElement('canvas');
    procCanvas.width = canvas.width;
    procCanvas.height = canvas.height;
    const ctx = procCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0);

    applyImageFilters(ctx, canvas.width, canvas.height, {
      brightness: 18,
      contrast: 40,
      sharpness: 40,
      grayscale: enhanceMode === 'bw',
      blackAndWhite: enhanceMode === 'bw',
    });

    setFinalDataUrl(procCanvas.toDataURL('image/jpeg', 0.95));
    setStep('enhance');
  };

  const handleFilterChange = (mode: 'clean' | 'bw' | 'color') => {
    setEnhanceMode(mode);
    if (!dewarpedCanvas) return;
    const procCanvas = document.createElement('canvas');
    procCanvas.width = dewarpedCanvas.width;
    procCanvas.height = dewarpedCanvas.height;
    const ctx = procCanvas.getContext('2d')!;
    ctx.drawImage(dewarpedCanvas, 0, 0);

    applyImageFilters(ctx, dewarpedCanvas.width, dewarpedCanvas.height, {
      brightness: mode === 'clean' ? 18 : mode === 'bw' ? 15 : 0,
      contrast: mode === 'clean' ? 40 : mode === 'bw' ? 60 : 0,
      sharpness: mode === 'clean' ? 40 : mode === 'bw' ? 50 : 0,
      grayscale: mode === 'bw',
      blackAndWhite: mode === 'bw',
    });

    setFinalDataUrl(procCanvas.toDataURL('image/jpeg', 0.95));
  };

  const handleExportPdf = async () => {
    if (!finalDataUrl) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPdf([{ dataUrl: finalDataUrl, name: 'scanned-document' }], {
        pageSize: 'a4',
        marginPt: 15,
      });
      downloadFile(pdfBytes, 'scanned-paper-document.pdf', 'application/pdf');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow step indicators */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold pb-4 border-b border-slate-200 dark:border-slate-800">
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'upload'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          1. Upload / Camera
        </span>
        <span className="text-slate-400">→</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'dewarp'
              ? 'bg-indigo-600 text-white'
              : step === 'enhance'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          2. 4-Corner Straighten
        </span>
        <span className="text-slate-400">→</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'enhance'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          3. Enhance & Download PDF
        </span>
      </div>

      {step === 'upload' && (
        <Dropzone
          onFileSelect={(files) => {
            if (files[0]) {
              setInitialFile(files[0]);
              setStep('dewarp');
            }
          }}
          label="Snap or select paper document to scan"
          sublabel="Camera captures and photos will be straightened and converted to a PDF"
        />
      )}

      {step === 'dewarp' && (
        <FourCornerPerspectiveTool onStraightenedReady={handleDewarpReady} />
      )}

      {step === 'enhance' && finalDataUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-indigo-500" /> Document PDF Optimization
            </h3>

            {/* Filter buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Document Enhancement Filter
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'clean', label: 'Magic Clean' },
                  { id: 'bw', label: 'B&W Photocopy' },
                  { id: 'color', label: 'Original Color' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleFilterChange(f.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      enhanceMode === f.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleExportPdf}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? 'Generating PDF...' : 'Download Clean Scanned PDF'}
              </button>

              <button
                onClick={() => {
                  downloadFile(finalDataUrl, 'scanned-document.jpg', 'image/jpeg');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Download as High-Res JPG Image
              </button>

              <button
                onClick={() => setStep('upload')}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Scan another document
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px]">
            <img
              src={finalDataUrl}
              alt="Scanned Document Preview"
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700 bg-white"
            />
            <div className="mt-3 text-xs text-emerald-400 font-medium">
              ✓ Straightened & Enhanced • Ready for PDF Export
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
