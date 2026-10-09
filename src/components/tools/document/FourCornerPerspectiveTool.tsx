import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { perspectiveDewarp, Point } from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Focus, Download, RefreshCw, Check, Sparkles } from 'lucide-react';

interface FourCornerPerspectiveToolProps {
  onStraightenedReady?: (canvas: HTMLCanvasElement) => void;
}

export const FourCornerPerspectiveTool: React.FC<FourCornerPerspectiveToolProps> = ({
  onStraightenedReady,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // 4 corners in normalized percentage coordinates (0 to 100)
  const [corners, setCorners] = useState<{ tl: Point; tr: Point; br: Point; bl: Point }>({
    tl: { x: 12, y: 15 },
    tr: { x: 88, y: 12 },
    br: { x: 85, y: 88 },
    bl: { x: 15, y: 85 },
  });

  const [activeCorner, setActiveCorner] = useState<'tl' | 'tr' | 'br' | 'bl' | null>(null);
  const [straightenedDataUrl, setStraightenedDataUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setCorners({
        tl: { x: 10, y: 10 },
        tr: { x: 90, y: 10 },
        br: { x: 90, y: 90 },
        bl: { x: 10, y: 90 },
      });
      setStraightenedDataUrl(null);
    };
    img.src = URL.createObjectURL(files[0]);
  };

  const handlePointerDown = (e: React.PointerEvent, cornerKey: 'tl' | 'tr' | 'br' | 'bl') => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setActiveCorner(cornerKey);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !activeCorner || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      setCorners((curr) => ({
        ...curr,
        [activeCorner]: { x: xPercent, y: yPercent },
      }));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setActiveCorner(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeCorner]);

  const handleExecuteDewarp = () => {
    if (!imgElement) return;

    // Draw source image to temp canvas
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = imgElement.naturalWidth;
    srcCanvas.height = imgElement.naturalHeight;
    const srcCtx = srcCanvas.getContext('2d')!;
    srcCtx.drawImage(imgElement, 0, 0);

    // Convert percentage corners to actual source image pixel points
    const pixelCorners = {
      tl: {
        x: (corners.tl.x / 100) * srcCanvas.width,
        y: (corners.tl.y / 100) * srcCanvas.height,
      },
      tr: {
        x: (corners.tr.x / 100) * srcCanvas.width,
        y: (corners.tr.y / 100) * srcCanvas.height,
      },
      br: {
        x: (corners.br.x / 100) * srcCanvas.width,
        y: (corners.br.y / 100) * srcCanvas.height,
      },
      bl: {
        x: (corners.bl.x / 100) * srcCanvas.width,
        y: (corners.bl.y / 100) * srcCanvas.height,
      },
    };

    // Calculate target width and height
    const topW = Math.hypot(pixelCorners.tr.x - pixelCorners.tl.x, pixelCorners.tr.y - pixelCorners.tl.y);
    const botW = Math.hypot(pixelCorners.br.x - pixelCorners.bl.x, pixelCorners.br.y - pixelCorners.bl.y);
    const leftH = Math.hypot(pixelCorners.bl.x - pixelCorners.tl.x, pixelCorners.bl.y - pixelCorners.tl.y);
    const rightH = Math.hypot(pixelCorners.br.x - pixelCorners.tr.x, pixelCorners.br.y - pixelCorners.tr.y);

    const dstW = Math.round(Math.max(topW, botW));
    const dstH = Math.round(Math.max(leftH, rightH));

    const resultCanvas = perspectiveDewarp(srcCanvas, pixelCorners, dstW, dstH);
    const dataUrl = resultCanvas.toDataURL('image/jpeg', 0.95);
    setStraightenedDataUrl(dataUrl);

    if (onStraightenedReady) {
      onStraightenedReady(resultCanvas);
    }
  };

  const handleDownload = () => {
    if (!straightenedDataUrl || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadFile(straightenedDataUrl, `${baseName}-straightened.jpg`, 'image/jpeg');
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select photographed document or paper"
          sublabel="Draggable 4-corners to remove angled perspective distortion (CamScanner style)"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Focus className="w-4 h-4 text-indigo-500" /> 4-Corner Correction
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag the 4 corner handles on the document preview to snap exactly to the 4 edges of the physical paper. Then click <strong>&quot;Straighten Document&quot;</strong> to remove the camera tilt.
            </p>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5">
              <div className="font-semibold text-indigo-950 dark:text-indigo-300">
                Corner Coordinates:
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <span>TL: ({Math.round(corners.tl.x)}%, {Math.round(corners.tl.y)}%)</span>
                <span>TR: ({Math.round(corners.tr.x)}%, {Math.round(corners.tr.y)}%)</span>
                <span>BL: ({Math.round(corners.bl.x)}%, {Math.round(corners.bl.y)}%)</span>
                <span>BR: ({Math.round(corners.br.x)}%, {Math.round(corners.br.y)}%)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleExecuteDewarp}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Focus className="w-4 h-4" /> Straighten Document
              </button>

              {straightenedDataUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Straightened Paper
                </button>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                  setStraightenedDataUrl(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Upload different document
              </button>
            </div>
          </div>

          {/* Interactive Document Corners Viewport */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px] select-none">
            {imgElement && !straightenedDataUrl && (
              <div
                ref={containerRef}
                className="relative inline-block max-w-full max-h-[500px] overflow-hidden rounded-lg shadow-2xl"
              >
                <img
                  src={imgElement.src}
                  alt="Original tilted document"
                  className="max-h-[500px] max-w-full block pointer-events-none"
                />

                {/* SVG Connecting Polygon Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <polygon
                    points={`${corners.tl.x}%,${corners.tl.y}% ${corners.tr.x}%,${corners.tr.y}% ${corners.br.x}%,${corners.br.y}% ${corners.bl.x}%,${corners.bl.y}%`}
                    fill="rgba(99, 102, 241, 0.2)"
                    stroke="#818CF8"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* 4 Draggable Corner Handles */}
                {(['tl', 'tr', 'br', 'bl'] as const).map((key) => {
                  const pt = corners[key];
                  return (
                    <div
                      key={key}
                      onPointerDown={(e) => handlePointerDown(e, key)}
                      style={{
                        left: `${pt.x}%`,
                        top: `${pt.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute w-7 h-7 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center cursor-move text-[9px] font-bold text-white uppercase select-none hover:scale-125 transition-transform"
                    >
                      {key}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Straightened Result Preview */}
            {straightenedDataUrl && (
              <div className="text-center max-w-full">
                <img
                  src={straightenedDataUrl}
                  alt="Straightened Result"
                  className="max-h-[480px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700 mx-auto"
                />
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" /> Paper straightened with perspective distortion
                  removed!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
