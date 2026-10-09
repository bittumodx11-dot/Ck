import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  addPdfWatermark,
  getPdfMetadata,
  parsePageRange,
  downloadFile,
  formatBytes,
} from '../../../utils/pdfProcessing';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  RotateCw,
  Stamp,
  Info,
  Layers,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const PdfManagerTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'merge' | 'split' | 'rotate' | 'watermark' | 'metadata'>(
    'merge'
  );

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // Single PDF tools state
  const [singlePdfFile, setSinglePdfFile] = useState<File | null>(null);
  const [singlePdfBuffer, setSinglePdfBuffer] = useState<ArrayBuffer | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  // Split state
  const [splitRange, setSplitRange] = useState<string>('1-2');

  // Rotate state
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);

  // Watermark state
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.25);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Handle single PDF upload for split/rotate/watermark/metadata
  const handleSinglePdfSelect = async (files: File[]) => {
    if (!files.length) return;
    setErrorMessage(null);
    const f = files[0];

    // Preliminary validation
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
      setErrorMessage(`"${f.name}" is not a PDF file. Please select a .pdf document.`);
      return;
    }

    try {
      const buf = await f.arrayBuffer();
      const meta = await getPdfMetadata(buf);
      setSinglePdfFile(f);
      setSinglePdfBuffer(buf);
      setMetadata(meta);
      setSplitRange(`1-${Math.min(meta.pageCount, 2)}`);
    } catch (e: any) {
      console.warn('PDF load warning:', e);
      setSinglePdfFile(null);
      setSinglePdfBuffer(null);
      setMetadata(null);
      setErrorMessage(e?.message || 'Failed to read PDF document. Please verify the file.');
    }
  };

  // Merge handler
  const handleMergeAction = async () => {
    if (mergeFiles.length < 2) return;
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const buffers = await Promise.all(mergeFiles.map((f) => f.arrayBuffer()));
      const mergedBytes = await mergePdfs(buffers);
      downloadFile(mergedBytes, 'merged-document.pdf', 'application/pdf');
      showSuccess(`Successfully merged ${mergeFiles.length} PDF files!`);
    } catch (e: any) {
      console.warn('PDF merge error:', e);
      setErrorMessage(e?.message || 'Failed to merge PDF files. Please ensure all files are valid PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Split handler
  const handleSplitAction = async () => {
    if (!singlePdfBuffer || !metadata) return;
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const pageIndices = parsePageRange(splitRange, metadata.pageCount);
      if (pageIndices.length === 0) {
        setErrorMessage('Please enter valid page numbers or ranges, e.g. "1-3, 5".');
        setIsProcessing(false);
        return;
      }
      const splitBytes = await splitPdf(singlePdfBuffer, pageIndices);
      downloadFile(splitBytes, 'split-pages.pdf', 'application/pdf');
      showSuccess(`Extracted ${pageIndices.length} page(s) successfully!`);
    } catch (e: any) {
      console.warn('PDF split error:', e);
      setErrorMessage(e?.message || 'Failed to split PDF. Please check page numbers and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Rotate handler
  const handleRotateAction = async () => {
    if (!singlePdfBuffer) return;
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const rotatedBytes = await rotatePdf(singlePdfBuffer, rotationAngle);
      downloadFile(rotatedBytes, 'rotated-document.pdf', 'application/pdf');
      showSuccess(`Rotated pages by ${rotationAngle}° successfully!`);
    } catch (e: any) {
      console.warn('PDF rotate error:', e);
      setErrorMessage(e?.message || 'Failed to rotate PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Watermark handler
  const handleWatermarkAction = async () => {
    if (!singlePdfBuffer) return;
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const markedBytes = await addPdfWatermark(singlePdfBuffer, watermarkText, {
        opacity: watermarkOpacity,
      });
      downloadFile(markedBytes, 'watermarked-document.pdf', 'application/pdf');
      showSuccess('Watermark added to PDF successfully!');
    } catch (e: any) {
      console.warn('PDF watermark error:', e);
      setErrorMessage(e?.message || 'Failed to apply watermark to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start justify-between gap-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <span className="font-bold">Error: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Function Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {[
          { id: 'merge', label: 'Merge PDFs', icon: Layers },
          { id: 'split', label: 'Split & Extract Pages', icon: FileSpreadsheet },
          { id: 'rotate', label: 'Rotate Pages', icon: RotateCw },
          { id: 'watermark', label: 'PDF Watermark', icon: Stamp },
          { id: 'metadata', label: 'Inspect Metadata', icon: Info },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MERGE TAB */}
      {activeTab === 'merge' && (
        <div className="space-y-6">
          {mergeFiles.length === 0 ? (
            <Dropzone
              onFileSelect={(files) => setMergeFiles(files)}
              accept="application/pdf"
              multiple={true}
              label="Select 2 or more PDF files to merge"
              sublabel="Combine separate PDF reports, applications, or certificates into one document"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Files to Combine ({mergeFiles.length})
                  </h3>
                  <label className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add more PDFs
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const incoming = Array.from(e.target.files);
                          const validPdfs = incoming.filter(
                            (f) => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'
                          );
                          if (validPdfs.length < incoming.length) {
                            setErrorMessage('Some non-PDF files were ignored. Only PDF documents (.pdf) can be merged.');
                          }
                          setMergeFiles((prev) => [...prev, ...validPdfs]);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {mergeFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatBytes(file.size)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setMergeFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleMergeAction}
                    disabled={isProcessing || mergeFiles.length < 2}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {isProcessing ? 'Merging PDFs...' : `Merge & Download PDF (${mergeFiles.length} files)`}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <Layers className="w-12 h-12 text-indigo-500 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Instant Client-Side Merging
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Files are loaded in browser memory via pdf-lib and stitched together. None of your confidential paperwork is uploaded to any cloud server.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SINGLE PDF WORKFLOW: Split, Rotate, Watermark, Metadata */}
      {activeTab !== 'merge' && (
        <div className="space-y-6">
          {!singlePdfFile ? (
            <Dropzone
              onFileSelect={handleSinglePdfSelect}
              accept="application/pdf"
              label="Select a PDF document"
              sublabel="Process pages directly in your browser"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {singlePdfFile.name}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      {metadata ? `${metadata.pageCount} Pages • ` : ''}
                      {formatBytes(singlePdfFile.size)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSinglePdfFile(null);
                      setSinglePdfBuffer(null);
                      setMetadata(null);
                    }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Change file
                  </button>
                </div>

                {/* SPLIT CONTROLS */}
                {activeTab === 'split' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Pages to Extract (e.g. 1-3, 5)
                      </label>
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        placeholder="1-3, 5"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Total document pages: {metadata?.pageCount || 1}
                      </p>
                    </div>

                    <button
                      onClick={handleSplitAction}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Extract Selected Pages
                    </button>
                  </div>
                )}

                {/* ROTATE CONTROLS */}
                {activeTab === 'rotate' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Rotation Degree
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setRotationAngle(deg as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            rotationAngle === deg
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          +{deg}°
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleRotateAction}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" /> Rotate All Pages & Download
                    </button>
                  </div>
                )}

                {/* WATERMARK CONTROLS */}
                {activeTab === 'watermark' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Watermark Opacity</span>
                        <span>{Math.round(watermarkOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <button
                      onClick={handleWatermarkAction}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Stamp className="w-4 h-4" /> Apply Watermark & Download PDF
                    </button>
                  </div>
                )}

                {/* METADATA VIEW */}
                {activeTab === 'metadata' && metadata && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      PDF Document Details
                    </h4>
                    <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-500">Page Count:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {metadata.pageCount}
                        </span>
                      </div>
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-500">Document Title:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {metadata.title}
                        </span>
                      </div>
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-500">Author:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {metadata.author}
                        </span>
                      </div>
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-500">Creator / Software:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {metadata.creator}
                        </span>
                      </div>
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-500">Creation Date:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {metadata.creationDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status / Instructions Viewport */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <FileCheck className="w-12 h-12 text-emerald-500 mb-3" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Document Ready for Processing
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  &quot;{singlePdfFile.name}&quot; loaded ({metadata?.pageCount || 1} pages). Configure settings on the left and click the action button to download the processed file.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
