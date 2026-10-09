import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import {
  compressToTargetKB,
  calculatePixels,
  calculatePhysical,
} from '../../../utils/imageProcessing';
import { formatBytes, downloadFile } from '../../../utils/pdfProcessing';
import { Minimize2, Scaling, Sliders, Download, Check, AlertCircle } from 'lucide-react';

interface ResizeCompressionToolProps {
  initialMode?: 'target-size' | 'dimension' | 'dpi';
}

export const ResizeCompressionTool: React.FC<ResizeCompressionToolProps> = ({
  initialMode = 'target-size',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Mode: 'target-size' | 'dimension' | 'dpi'
  const [activeTab, setActiveTab] = useState<'target-size' | 'dimension' | 'dpi'>(initialMode);

  // Target size options
  const [targetKB, setTargetKB] = useState<number>(50);
  const [customTargetKB, setCustomTargetKB] = useState<string>('50');

  // Dimension options
  const [dimUnit, setDimUnit] = useState<'px' | 'cm' | 'mm' | 'inch' | '%'>('px');
  const [widthVal, setWidthVal] = useState<number>(800);
  const [heightVal, setHeightVal] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatioVal, setAspectRatioVal] = useState<number>(1);

  // DPI options
  const [dpi, setDpi] = useState<number>(300);

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    sizeBytes: number;
    width: number;
    height: number;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setWidthVal(img.naturalWidth);
      setHeightVal(img.naturalHeight);
      setAspectRatioVal(img.naturalWidth / img.naturalHeight);
      setResult(null);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidthVal(val);
    if (lockAspect && aspectRatioVal > 0) {
      setHeightVal(Math.round(val / aspectRatioVal));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeightVal(val);
    if (lockAspect && aspectRatioVal > 0) {
      setWidthVal(Math.round(val * aspectRatioVal));
    }
  };

  const handleProcess = async () => {
    if (!imgElement || !file) return;
    setIsProcessing(true);

    try {
      if (activeTab === 'target-size') {
        const kb = parseInt(customTargetKB, 10) || targetKB;
        const res = await compressToTargetKB(imgElement, kb, 'image/jpeg');
        setResult({
          url: res.dataUrl,
          sizeBytes: res.blob.size,
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight,
        });
      } else {
        // Dimension or DPI resizer
        let targetW_px = widthVal;
        let targetH_px = heightVal;

        if (activeTab === 'dimension') {
          if (dimUnit === '%') {
            targetW_px = Math.round((imgElement.naturalWidth * widthVal) / 100);
            targetH_px = Math.round((imgElement.naturalHeight * heightVal) / 100);
          } else if (dimUnit !== 'px') {
            targetW_px = calculatePixels(widthVal, dimUnit as any, dpi);
            targetH_px = calculatePixels(heightVal, dimUnit as any, dpi);
          }
        } else if (activeTab === 'dpi') {
          // DPI conversion: rescale based on target DPI (assuming standard 96 screen dpi original)
          const scale = dpi / 96;
          targetW_px = Math.round(imgElement.naturalWidth * scale);
          targetH_px = Math.round(imgElement.naturalHeight * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, targetW_px);
        canvas.height = Math.max(1, targetH_px);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResult({
                url: URL.createObjectURL(blob),
                sizeBytes: blob.size,
                width: canvas.width,
                height: canvas.height,
              });
            }
          },
          'image/jpeg',
          0.92
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    let tag = 'compressed';
    if (activeTab === 'dimension') tag = `${result.width}x${result.height}`;
    if (activeTab === 'dpi') tag = `${dpi}dpi`;
    downloadFile(result.url, `${base}-${tag}.jpg`);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image to resize or compress"
          sublabel="Compress to target KB, resize dimensions in cm/mm/inch/px, or set DPI"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('target-size');
                  setResult(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'target-size'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Target KB
              </button>
              <button
                onClick={() => {
                  setActiveTab('dimension');
                  setResult(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dimension'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Dimensions
              </button>
              <button
                onClick={() => {
                  setActiveTab('dpi');
                  setResult(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dpi'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                DPI Setting
              </button>
            </div>

            {/* TAB 1: Target File Size in KB */}
            {activeTab === 'target-size' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Target File Size (Presets for Govt Forms & Portals)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50, 100, 200, 500, 1024, 2048].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => {
                        setTargetKB(kb);
                        setCustomTargetKB(kb.toString());
                        setResult(null);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        targetKB === kb
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Or Enter Exact Target KB
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="5"
                      max="10000"
                      value={customTargetKB}
                      onChange={(e) => {
                        setCustomTargetKB(e.target.value);
                        setTargetKB(parseInt(e.target.value, 10) || 50);
                        setResult(null);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="e.g. 50"
                    />
                    <span className="p-2.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      KB
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Dimension Resizer */}
            {activeTab === 'dimension' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Measurement Unit
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['px', 'cm', 'mm', 'inch', '%'] as const).map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          setDimUnit(unit);
                          if (unit === '%') {
                            setWidthVal(100);
                            setHeightVal(100);
                          } else if (imgElement) {
                            if (unit === 'px') {
                              setWidthVal(imgElement.naturalWidth);
                              setHeightVal(imgElement.naturalHeight);
                            } else {
                              setWidthVal(
                                Math.round(calculatePhysical(imgElement.naturalWidth, unit, dpi) * 10) / 10
                              );
                              setHeightVal(
                                Math.round(calculatePhysical(imgElement.naturalHeight, unit, dpi) * 10) / 10
                              );
                            }
                          }
                          setResult(null);
                        }}
                        className={`py-1.5 text-xs font-semibold rounded-lg uppercase border ${
                          dimUnit === unit
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Width ({dimUnit})
                    </label>
                    <input
                      type="number"
                      step={dimUnit === 'px' || dimUnit === '%' ? '1' : '0.1'}
                      value={widthVal}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Height ({dimUnit})
                    </label>
                    <input
                      type="number"
                      step={dimUnit === 'px' || dimUnit === '%' ? '1' : '0.1'}
                      value={heightVal}
                      onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockAspect}
                    onChange={(e) => setLockAspect(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Lock Aspect Ratio ({aspectRatioVal.toFixed(2)})</span>
                </label>
              </div>
            )}

            {/* TAB 3: DPI Setting */}
            {activeTab === 'dpi' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Print Resolution (DPI / PPI)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[72, 96, 150, 200, 300, 600].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDpi(d);
                        setResult(null);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        dpi === d
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  • <strong>300 DPI</strong> is standard for professional passport photos and offset printing.<br />
                  • <strong>200 DPI</strong> is required by many government application portals (PAN card, SSC, UPSC).<br />
                  • <strong>72–96 DPI</strong> is ideal for lightweight web pages.
                </p>
              </div>
            )}

            {/* File info badge */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Original Size:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatBytes(file.size)} ({imgElement?.naturalWidth}×{imgElement?.naturalHeight}px)
                </span>
              </div>
              {result && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Output Size:</span>
                  <span>
                    {formatBytes(result.sizeBytes)} ({result.width}×{result.height}px)
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Processing Image...' : 'Process Image Now'}
              </button>

              {result && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Processed Image ({formatBytes(result.sizeBytes)})
                </button>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setImgElement(null);
                  setResult(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Preview Viewport */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px]">
            {previewUrl && (
              <div className="text-center max-w-full">
                <img
                  src={result ? result.url : previewUrl}
                  alt="Resized preview"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-xl mx-auto"
                />
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs">
                  {result ? (
                    <span className="text-emerald-400 font-medium">
                      ✓ Successfully processed to {formatBytes(result.sizeBytes)} ({result.width}×
                      {result.height}px)
                    </span>
                  ) : (
                    <span>Original: {imgElement?.naturalWidth}×{imgElement?.naturalHeight} px</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
