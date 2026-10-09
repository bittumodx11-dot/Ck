import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Crop, RotateCw, ZoomIn, ZoomOut, Download, RefreshCw, Check } from 'lucide-react';

export const ImageCropTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  }); // percentages 0-100
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragHandleRef = useRef<'move' | 'nw' | 'ne' | 'se' | 'sw' | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; box: typeof cropBox }>({
    x: 0,
    y: 0,
    box: cropBox,
  });

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      setRotation(0);
      setZoom(1);
      setCroppedDataUrl(null);
    };
    img.src = url;
  };

  const applyAspectRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (!ratio || !imgElement) return;

    // Adjust crop box width and height to match aspect ratio
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const targetW = 60;
    const targetH = (targetW * (imgElement.naturalWidth / imgElement.naturalHeight)) / ratio;
    const normalizedH = Math.min(80, Math.max(20, targetH));
    const normalizedW = Math.min(80, Math.max(20, normalizedH * ratio / imgAspect));

    setCropBox({
      x: 10,
      y: 10,
      width: Math.min(80, normalizedW),
      height: Math.min(80, normalizedH),
    });
  };

  const handlePointerDown = (e: React.PointerEvent, handle: 'move' | 'nw' | 'ne' | 'se' | 'sw') => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragHandleRef.current = handle;
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      box: { ...cropBox },
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStartPos.current.x) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartPos.current.y) / rect.height) * 100;
      const prev = dragStartPos.current.box;

      const handle = dragHandleRef.current;

      if (handle === 'move') {
        const newX = Math.max(0, Math.min(100 - prev.width, prev.x + deltaXPercent));
        const newY = Math.max(0, Math.min(100 - prev.height, prev.y + deltaYPercent));
        setCropBox((curr) => ({ ...curr, x: newX, y: newY }));
      } else if (handle === 'se') {
        const newW = Math.max(10, Math.min(100 - prev.x, prev.width + deltaXPercent));
        const newH = Math.max(10, Math.min(100 - prev.y, prev.height + deltaYPercent));
        setCropBox((curr) => ({ ...curr, width: newW, height: newH }));
      } else if (handle === 'nw') {
        const newX = Math.max(0, Math.min(prev.x + prev.width - 10, prev.x + deltaXPercent));
        const newY = Math.max(0, Math.min(prev.y + prev.height - 10, prev.y + deltaYPercent));
        const newW = prev.width - (newX - prev.x);
        const newH = prev.height - (newY - prev.y);
        setCropBox({ x: newX, y: newY, width: newW, height: newH });
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      dragHandleRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleExecuteCrop = () => {
    if (!imgElement) return;

    const canvas = document.createElement('canvas');
    const naturalW = imgElement.naturalWidth;
    const naturalH = imgElement.naturalHeight;

    const pixelX = (cropBox.x / 100) * naturalW;
    const pixelY = (cropBox.y / 100) * naturalH;
    const pixelW = (cropBox.width / 100) * naturalW;
    const pixelH = (cropBox.height / 100) * naturalH;

    canvas.width = pixelW;
    canvas.height = pixelH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply rotation if needed
    if (rotation !== 0) {
      // Rotate canvas center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    ctx.drawImage(imgElement, pixelX, pixelY, pixelW, pixelH, 0, 0, pixelW, pixelH);

    const croppedUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCroppedDataUrl(croppedUrl);
  };

  const handleDownload = () => {
    if (!croppedDataUrl) return;
    const baseName = file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'image';
    downloadFile(croppedDataUrl, `${baseName}-cropped.jpg`);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image to crop"
          sublabel="Drag & drop or use camera"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crop className="w-4 h-4 text-indigo-500" /> Crop Presets & Ratios
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Free', ratio: null },
                { label: '1:1 Square', ratio: 1 },
                { label: '4:3 Standard', ratio: 4 / 3 },
                { label: '3:4 Portrait', ratio: 3 / 4 },
                { label: '16:9 Landscape', ratio: 16 / 9 },
                { label: '9:16 Story', ratio: 9 / 16 },
              ].map((r, i) => (
                <button
                  key={i}
                  onClick={() => applyAspectRatio(r.ratio)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    aspectRatio === r.ratio
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Rotation & Zoom */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Rotate & Transform
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
                </button>
                <button
                  onClick={() => {
                    setRotation(0);
                    setZoom(1);
                    setCropBox({ x: 10, y: 10, width: 80, height: 80 });
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  title="Reset Crop"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleExecuteCrop}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crop className="w-4 h-4" /> Apply Crop
              </button>

              {croppedDataUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Cropped Image
                </button>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                  setCroppedDataUrl(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Interactive Crop Viewport */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px] select-none">
            {imgElement && (
              <div
                ref={containerRef}
                className="relative inline-block max-w-full max-h-[500px] overflow-hidden rounded-lg shadow-2xl"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <img
                  src={imgElement.src}
                  alt="Crop preview"
                  className="max-h-[500px] max-w-full block pointer-events-none"
                />

                {/* Crop Box Overlay */}
                <div
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  className="absolute border-2 border-indigo-400 bg-indigo-500/15 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  {/* Corner Handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-xs cursor-nwse-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'se')}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-xs cursor-nwse-resize"
                  />
                </div>
              </div>
            )}

            {croppedDataUrl && (
              <div className="mt-4 p-2 px-4 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" /> Cropped preview ready! Click &apos;Download Cropped Image&apos;.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
