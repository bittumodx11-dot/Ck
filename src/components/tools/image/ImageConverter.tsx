import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { formatBytes, downloadFile } from '../../../utils/pdfProcessing';
import { Download, Sliders, Check, FileCheck } from 'lucide-react';

interface ImageConverterProps {
  initialFormat?: 'jpeg' | 'png' | 'webp';
}

export const ImageConverter: React.FC<ImageConverterProps> = ({ initialFormat = 'jpeg' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>(initialFormat);
  const [quality, setQuality] = useState<number>(0.92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedResult, setConvertedResult] = useState<{
    url: string;
    size: number;
    name: string;
  } | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setConvertedResult(null);
  };

  const handleConvert = () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (outputFormat === 'jpeg') {
        // Fill white background for non-transparent JPG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${outputFormat}`;
      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
          setConvertedResult({
            url,
            size: blob.size,
            name: `${baseName}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`,
          });
        },
        mimeType,
        quality
      );
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!convertedResult) return;
    downloadFile(convertedResult.url, convertedResult.name);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          label="Select an image to convert"
          sublabel="Supports JPG, PNG, WEBP, GIF, SVG, BMP"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" /> Output Settings
            </h3>

            {/* Target format */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Target Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['jpeg', 'png', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setOutputFormat(fmt);
                      setConvertedResult(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase border transition-all ${
                      outputFormat === fmt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for JPG and WebP) */}
            {outputFormat !== 'png' && (
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Quality</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setConvertedResult(null);
                  }}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Smaller File</span>
                  <span>Higher Quality</span>
                </div>
              </div>
            )}

            {/* File info comparison */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Original Size:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatBytes(file.size)}
                </span>
              </div>
              {convertedResult && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Converted Size:</span>
                  <span>{formatBytes(convertedResult.size)}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Converting...' : 'Convert Image Now'}
              </button>

              {convertedResult && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Converted {outputFormat.toUpperCase()}
                </button>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setConvertedResult(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Preview Workspace */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[380px]">
            {previewUrl && (
              <div className="max-w-full text-center">
                <img
                  src={convertedResult ? convertedResult.url : previewUrl}
                  alt="Preview"
                  className="max-h-[460px] max-w-full object-contain rounded-xl shadow-md mx-auto"
                />
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {convertedResult
                      ? `Ready: ${convertedResult.name} (${formatBytes(convertedResult.size)})`
                      : `Source: ${file.name} (${formatBytes(file.size)})`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
