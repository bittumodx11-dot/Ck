import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  allowCamera?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  accept = 'image/jpeg,image/png,image/webp',
  multiple = false,
  maxSizeMB = 50,
  label = 'Select or drop file here',
  sublabel = 'Supports JPG, PNG, WebP up to 50MB',
  allowCamera = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = (fileList: FileList | null) => {
    setError(null);
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const validFiles: File[] = [];

    const isPdfOnly = accept.includes('application/pdf') || accept.includes('.pdf');
    const isImageOnly = accept.includes('image/') && !isPdfOnly;

    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSizeMB}MB file limit.`);
        return;
      }

      if (isPdfOnly) {
        const isPdf =
          file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
          setError(
            `"${file.name}" is not a PDF document. Please select a valid .pdf file.`
          );
          return;
        }
      } else if (isImageOnly) {
        const isImg =
          file.type.startsWith('image/') ||
          /\.(jpe?g|png|webp|gif|bmp|svg|avif)$/i.test(file.name);
        if (!isImg) {
          setError(
            `"${file.name}" is not an image file. Please select a supported image (JPG, PNG, WebP).`
          );
          return;
        }
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : [validFiles[0]]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndEmit(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.005]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => validateAndEmit(e.target.files)}
        />

        {allowCamera && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => validateAndEmit(e.target.files)}
          />
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            {accept.includes('pdf') ? (
              <FileText className="w-8 h-8" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              {label}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {sublabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Browse Files
            </button>

            {allowCamera && !accept.includes('pdf') && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-indigo-500" />
                <span>Use Camera</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
