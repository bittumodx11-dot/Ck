import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Sliders } from 'lucide-react';

export const ImageRotateFlipTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [fineAngle, setFineAngle] = useState<number>(0);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    setPreviewUrl(URL.createObjectURL(files[0]));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFineAngle(0);
  };

  const handleDownload = () => {
    if (!previewUrl || !file) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
      const isPerpendicular = Math.abs(rotation % 180) === 90 && fineAngle === 0;

      const canvas = document.createElement('canvas');
      if (isPerpendicular) {
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(totalAngle);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const mime = file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(blob, `${baseName}-transformed.jpg`, mime);
      }, mime, 0.95);
    };
    img.src = previewUrl;
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image to rotate or flip"
          sublabel="Supports all common photo formats"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-indigo-500" /> Rotate & Mirror Controls
            </h3>

            {/* Quick 90 deg buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Rotate by 90°
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <RotateCcw className="w-4 h-4 text-indigo-500" /> Rotate Left (-90°)
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <RotateCw className="w-4 h-4 text-indigo-500" /> Rotate Right (+90°)
                </button>
              </div>
            </div>

            {/* Flip Horizontal / Vertical */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Mirror Flip
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    flipH
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" /> Flip Horizontal
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    flipV
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" /> Flip Vertical
                </button>
              </div>
            </div>

            {/* Fine Straighten Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Fine Straighten</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{fineAngle}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                step="0.5"
                value={fineAngle}
                onChange={(e) => setFineAngle(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-45°</span>
                <button
                  onClick={() => setFineAngle(0)}
                  className="text-indigo-500 hover:underline font-semibold"
                >
                  Reset (0°)
                </button>
                <span>+45°</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Transformed Image
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-8 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px] overflow-hidden">
            {previewUrl && (
              <div className="relative max-w-full max-h-[500px] flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Transformed preview"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-xl transition-transform duration-200"
                  style={{
                    transform: `rotate(${rotation + fineAngle}deg) scaleX(${
                      flipH ? -1 : 1
                    }) scaleY(${flipV ? -1 : 1})`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
