import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { imagesToPdf, downloadFile, formatBytes } from '../../../utils/pdfProcessing';
import { FileUp, Download, Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  dataUrl: string;
}

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'a5' | 'letter' | 'legal' | 'photo4x6' | 'fit'>(
    'a4'
  );
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginPt, setMarginPt] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelect = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise<ImageItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            file,
            dataUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((items) => {
      setImages((prev) => [...prev, ...items]);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const copy = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const payload = images.map((img) => ({
        dataUrl: img.dataUrl,
        name: img.file.name,
      }));

      const pdfBytes = await imagesToPdf(payload, {
        pageSize,
        orientation,
        marginPt,
      });

      downloadFile(pdfBytes, 'converted-documents.pdf', 'application/pdf');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <Dropzone
          onFileSelect={handleFilesSelect}
          multiple={true}
          label="Select images to convert to PDF"
          sublabel="Combine single or multiple JPG, PNG, and WebP images into one clean PDF"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-500" /> PDF Page Layout Settings
            </h3>

            {/* Page size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Page Size Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'a4', label: 'A4' },
                  { id: 'a5', label: 'A5' },
                  { id: 'letter', label: 'Letter' },
                  { id: 'legal', label: 'Legal' },
                  { id: 'photo4x6', label: '4 × 6' },
                  { id: 'fit', label: 'Fit Image' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPageSize(p.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      pageSize === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            {pageSize !== 'fit' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      orientation === 'portrait'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      orientation === 'landscape'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            )}

            {/* Margins */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Page Margins</span>
                <span className="font-mono text-indigo-600">{marginPt} pt</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={marginPt}
                onChange={(e) => setMarginPt(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleGeneratePdf}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isProcessing
                  ? 'Generating PDF Document...'
                  : `Create & Download PDF (${images.length} Pages)`}
              </button>

              <button
                onClick={() => setImages([])}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Clear all images
              </button>
            </div>
          </div>

          {/* Image Pages Grid & Reorder List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pages in PDF Document ({images.length})
              </span>
              <label className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer">
                <Plus className="w-3.5 h-3.5 text-indigo-500" /> Add More Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFilesSelect(Array.from(e.target.files));
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto p-2">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-xs flex flex-col justify-between group"
                >
                  <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                    <img
                      src={item.dataUrl}
                      alt={item.file.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                      Page {idx + 1}
                    </div>
                  </div>

                  <div className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {item.file.name}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        title="Move Page Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        title="Move Page Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeImage(item.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      title="Remove Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
