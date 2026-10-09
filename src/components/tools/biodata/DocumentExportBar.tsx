import React, { useState } from 'react';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Printer,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { exportElementToA4, ExportFormat } from '../../../utils/documentExport';

interface DocumentExportBarProps {
  getDocumentElement: () => HTMLElement | null;
  baseFilename: string;
  documentTitle?: string;
  className?: string;
}

export const DocumentExportBar: React.FC<DocumentExportBarProps> = ({
  getDocumentElement,
  baseFilename,
  documentTitle = 'Document',
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleExport = async (format: ExportFormat) => {
    const el = getDocumentElement();
    if (!el) {
      setErrorMessage('ডকুমেন্ট রেন্ডার করার জন্য এখনও প্রস্তুত হয়নি।');
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    try {
      setIsExporting(true);
      setActiveFormat(format);
      setShowDropdown(false);
      setSuccessMessage('');
      setErrorMessage('');

      const cleanFilename = baseFilename.trim().replace(/\s+/g, '_') || 'document';

      await exportElementToA4(el, {
        filename: `${cleanFilename}_A4`,
        format,
        scale: 2.2,
        quality: 0.95,
        onProgress: (status) => setExportStatus(status),
      });

      setSuccessMessage(`A4 ${format.toUpperCase()} ডাউনলোড সম্পন্ন হয়েছে!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Export error:', err);
      setErrorMessage(`ডাউনলোড ব্যর্থ হয়েছে: ${(err as Error)?.message || 'অপ্রত্যাশিত সমস্যা'}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsExporting(false);
      setActiveFormat(null);
      setExportStatus('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`relative flex flex-wrap items-center gap-2 ${className}`}>
      {/* Primary Action Button: A4 PDF */}
      <button
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
        className="py-2 px-3.5 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60"
        title="Download exact A4 page PDF format"
      >
        {isExporting && activeFormat === 'pdf' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>{exportStatus || 'Generating A4 PDF...'}</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-indigo-200" />
            <span>A4 PDF ডাউনলোড</span>
          </>
        )}
      </button>

      {/* JPG Download Button */}
      <button
        onClick={() => handleExport('jpg')}
        disabled={isExporting}
        className="py-2 px-3 sm:px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-60"
        title="Download high-resolution JPG image"
      >
        {isExporting && activeFormat === 'jpg' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Exporting JPG...</span>
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 text-emerald-200" />
            <span>JPG ডাউনলোড</span>
          </>
        )}
      </button>

      {/* JPEG Download Button */}
      <button
        onClick={() => handleExport('jpeg')}
        disabled={isExporting}
        className="py-2 px-3 sm:px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-600/30 transition-all cursor-pointer disabled:opacity-60"
        title="Download high-resolution JPEG image"
      >
        {isExporting && activeFormat === 'jpeg' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Exporting JPEG...</span>
          </>
        ) : (
          <>
            <FileCheck className="w-4 h-4 text-teal-200" />
            <span>JPEG ডাউনলোড</span>
          </>
        )}
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        title="Clean 1-Click Print (System dialog)"
      >
        <Printer className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">প্রিন্ট</span>
      </button>

      {/* Success badge */}
      {successMessage && (
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {successMessage}
        </span>
      )}

      {/* Error badge */}
      {errorMessage && (
        <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 animate-fade-in">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
