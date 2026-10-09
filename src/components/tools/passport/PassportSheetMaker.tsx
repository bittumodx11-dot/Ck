import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { generatePhotoSheet } from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Printer, Download, Sliders, Check, Sparkles } from 'lucide-react';

interface PassportSheetMakerProps {
  initialPhotoUrl?: string | null;
}

export const PassportSheetMaker: React.FC<PassportSheetMakerProps> = ({
  initialPhotoUrl = null,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Sheet configuration
  const [sheetType, setSheetType] = useState<'4x6' | 'a4'>('4x6');
  const [copies, setCopies] = useState<number>(8);
  const [photoWidthMm, setPhotoWidthMm] = useState<number>(35);
  const [photoHeightMm, setPhotoHeightMm] = useState<number>(45);
  const [dpi, setDpi] = useState<number>(300);
  const [showCutMarks, setShowCutMarks] = useState<boolean>(true);
  const [marginMm, setMarginMm] = useState<number>(6);
  const [spacingMm, setSpacingMm] = useState<number>(4);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (initialPhotoUrl) {
      setPhotoUrl(initialPhotoUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setImgElement(img);
      img.src = initialPhotoUrl;
    }
  }, [initialPhotoUrl]);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    const url = URL.createObjectURL(files[0]);
    setPhotoUrl(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = url;
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const sheetCanvas = generatePhotoSheet(imgElement, {
      sheetType,
      copies,
      dpi,
      photoWidthMm,
      photoHeightMm,
      showCutMarks,
      marginMm,
      spacingMm,
      border: true,
    });

    const displayCanvas = canvasRef.current;
    displayCanvas.width = sheetCanvas.width;
    displayCanvas.height = sheetCanvas.height;
    const ctx = displayCanvas.getContext('2d')!;
    ctx.drawImage(sheetCanvas, 0, 0);

    if (printImgRef.current) {
      printImgRef.current.src = sheetCanvas.toDataURL('image/jpeg', 0.95);
    }
  }, [
    imgElement,
    sheetType,
    copies,
    dpi,
    photoWidthMm,
    photoHeightMm,
    showCutMarks,
    marginMm,
    spacingMm,
  ]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        downloadFile(
          blob,
          `passport-sheet-${sheetType}-${copies}-copies-${dpi}dpi.jpg`,
          'image/jpeg'
        );
      },
      'image/jpeg',
      0.95
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hidden printable image for clean browser print without any UI clutter (PRD #84) */}
      <div className="hidden print:block w-full">
        <img
          ref={printImgRef}
          alt="Printable Passport Sheet"
          className="w-full h-auto block m-0 p-0"
        />
      </div>

      {!photoUrl ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select passport photo to create printable sheet"
          sublabel="Create multi-copy sheets on 4×6 inch photo paper or A4 paper"
        />
      ) : (
        <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-500" /> Photo Sheet Configuration
            </h3>

            {/* Sheet paper size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Photo Paper Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSheetType('4x6');
                    setCopies(8);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-center border transition-all ${
                    sheetType === '4x6'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">4 × 6 Inch Paper</div>
                  <div className="text-[10px] opacity-75">Standard Studio Print</div>
                </button>
                <button
                  onClick={() => {
                    setSheetType('a4');
                    setCopies(24);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-center border transition-all ${
                    sheetType === 'a4'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">A4 Paper</div>
                  <div className="text-[10px] opacity-75">Full Page (210×297 mm)</div>
                </button>
              </div>
            </div>

            {/* Copies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Number of Copies ({copies})
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 6, 8, 12, 16, 20, 24, 32].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCopies(num)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border ${
                      copies === num
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {num} Photos
                  </button>
                ))}
              </div>
            </div>

            {/* Photo size in mm */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Photo Dimension Preset
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    setPhotoWidthMm(35);
                    setPhotoHeightMm(45);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                    photoWidthMm === 35 && photoHeightMm === 45
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  35 × 45 mm
                </button>
                <button
                  onClick={() => {
                    setPhotoWidthMm(51);
                    setPhotoHeightMm(51);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                    photoWidthMm === 51 && photoHeightMm === 51
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  2 × 2 Inch
                </button>
                <button
                  onClick={() => {
                    setPhotoWidthMm(25);
                    setPhotoHeightMm(35);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                    photoWidthMm === 25 && photoHeightMm === 35
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  PAN Card
                </button>
              </div>
            </div>

            {/* Cut marks and spacing */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCutMarks}
                  onChange={(e) => setShowCutMarks(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Include Scissor Cut Marks / Lines</span>
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Spacing</span>
                    <span>{spacingMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={spacingMm}
                    onChange={(e) => setSpacingMm(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Margin</span>
                    <span>{marginMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={marginMm}
                    onChange={(e) => setMarginMm(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrint}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> 1-Click Direct Print Sheet
              </button>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download High-Res JPG Sheet
              </button>

              <button
                onClick={() => {
                  setPhotoUrl(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another photo
              </button>
            </div>
          </div>

          {/* Sheet Preview */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[500px]">
            <canvas
              ref={canvasRef}
              className="max-h-[560px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700 bg-white"
            />
            <div className="mt-4 text-xs text-slate-400 text-center">
              Ready for print • {sheetType === '4x6' ? '4×6 Inch Sheet' : 'A4 Sheet'} • {copies}{' '}
              Copies with precision cut marks
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
