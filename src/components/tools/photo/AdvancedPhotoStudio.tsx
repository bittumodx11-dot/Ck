import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { applyImageFilters } from '../../../utils/imageProcessing';
import { downloadFile } from '../../../utils/pdfProcessing';
import {
  Camera,
  Undo2,
  Redo2,
  Download,
  RotateCw,
  Sparkles,
  Sliders,
  RefreshCw,
  Layers,
} from 'lucide-react';

interface StudioState {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  exposure: number;
  filter: 'none' | 'vintage' | 'warm' | 'cool' | 'dramatic' | 'bw';
}

const DEFAULT_STATE: StudioState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  exposure: 0,
  filter: 'none',
};

export const AdvancedPhotoStudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Undo / Redo History stack (PRD #34)
  const [history, setHistory] = useState<StudioState[]>([DEFAULT_STATE]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentState = history[historyIndex] || DEFAULT_STATE;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setHistory([DEFAULT_STATE]);
      setHistoryIndex(0);
    };
    img.src = URL.createObjectURL(files[0]);
  };

  const updateState = (updates: Partial<StudioState>) => {
    const nextState = { ...currentState, ...updates };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex((i) => i - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = imgElement.naturalWidth;
    const h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(imgElement, 0, 0);

    let b = currentState.brightness;
    let c = currentState.contrast;
    let s = currentState.saturation;

    // Apply color tone filters
    if (currentState.filter === 'vintage') {
      b += 5;
      c += 10;
      s -= 15;
    } else if (currentState.filter === 'warm') {
      b += 8;
      s += 15;
    } else if (currentState.filter === 'cool') {
      c += 15;
      s -= 10;
    } else if (currentState.filter === 'dramatic') {
      c += 40;
      s += 10;
    }

    applyImageFilters(ctx, w, h, {
      brightness: b,
      contrast: c,
      saturation: s,
      sharpness: currentState.sharpness,
      exposure: currentState.exposure,
      grayscale: currentState.filter === 'bw',
    });
  }, [imgElement, currentState]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(blob, `${baseName}-studio-edit.jpg`, 'image/jpeg');
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select photo for Studio Retouch & Editing"
          sublabel="Pro studio controls with layers, tone grading, sharpness, and full undo/redo history"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto">
            {/* Header with Undo / Redo */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-500" /> Photo Studio
              </h3>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-30"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-30"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateState(DEFAULT_STATE)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  title="Reset All"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Look Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Studio Color Grades
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Natural' },
                  { id: 'warm', label: 'Warm Glow' },
                  { id: 'cool', label: 'Cool Film' },
                  { id: 'vintage', label: 'Vintage' },
                  { id: 'dramatic', label: 'Dramatic' },
                  { id: 'bw', label: 'Studio B&W' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateState({ filter: item.id as any })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      currentState.filter === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Adjustments */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Brightness</span>
                  <span>{currentState.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={currentState.brightness}
                  onChange={(e) => updateState({ brightness: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Contrast</span>
                  <span>{currentState.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="60"
                  value={currentState.contrast}
                  onChange={(e) => updateState({ contrast: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Color Saturation</span>
                  <span>{currentState.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={currentState.saturation}
                  onChange={(e) => updateState({ saturation: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Sharpness & Clarity</span>
                  <span>{currentState.sharpness}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentState.sharpness}
                  onChange={(e) => updateState({ sharpness: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Exposure Compensation</span>
                  <span>{currentState.exposure}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={currentState.exposure}
                  onChange={(e) => updateState({ exposure: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Studio Edited Photo
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Open another photo
              </button>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="lg:col-span-7 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
