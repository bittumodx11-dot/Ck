import React, { useState } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { extractTextFromPdf, downloadFile, formatBytes } from '../../../utils/pdfProcessing';
import { FileCode2, Copy, Download, Check, AlertCircle } from 'lucide-react';

export const PdfToTextTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePdfSelect = async (files: File[]) => {
    if (!files.length) return;
    const f = files[0];
    setFile(f);
    setIsProcessing(true);

    try {
      const buffer = await f.arrayBuffer();
      const text = await extractTextFromPdf(buffer);
      setExtractedText(text.trim());
    } catch (e) {
      console.error(e);
      setExtractedText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadFile(extractedText, `${baseName}-extracted.txt`, 'text/plain');
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handlePdfSelect}
          accept="application/pdf"
          label="Select PDF document to extract text"
          sublabel="Extract selectable text directly inside your browser"
        />
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">Size: {formatBytes(file.size)}</p>
            </div>

            <div className="flex items-center gap-2">
              {extractedText && (
                <>
                  <button
                    onClick={handleCopy}
                    className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Text
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download TXT
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setExtractedText(null);
                }}
                className="py-2 px-3 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Upload another PDF
              </button>
            </div>
          </div>

          {/* Extracted Output Area */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs min-h-[300px]">
            {isProcessing ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                Parsing text streams in PDF...
              </div>
            ) : extractedText ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Extracted Document Text
                </label>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-slate-200 dark:border-slate-800">
                  {extractedText}
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  No Selectable Text Detected
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This PDF does not contain selectable text (it may be a scanned document or image-only PDF). OCR may be required to transcribe pictures of text.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
