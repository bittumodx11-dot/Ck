import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Share2, Download, Check } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspect: string;
}

const SOCIAL_PRESETS: Preset[] = [
  { id: 'ig-sq', platform: 'Instagram', name: 'Square Post', width: 1080, height: 1080, aspect: '1:1' },
  { id: 'ig-story', platform: 'Instagram', name: 'Story / Reel', width: 1080, height: 1920, aspect: '9:16' },
  { id: 'ig-port', platform: 'Instagram', name: 'Portrait Post', width: 1080, height: 1350, aspect: '4:5' },
  { id: 'yt-thumb', platform: 'YouTube', name: 'Video Thumbnail', width: 1280, height: 720, aspect: '16:9' },
  { id: 'fb-post', platform: 'Facebook', name: 'Feed Post', width: 1200, height: 630, aspect: '1.91:1' },
  { id: 'fb-cover', platform: 'Facebook', name: 'Page Cover', width: 820, height: 312, aspect: '2.6:1' },
  { id: 'tw-header', platform: 'X / Twitter', name: 'Header Banner', width: 1500, height: 500, aspect: '3:1' },
  { id: 'li-banner', platform: 'LinkedIn', name: 'Profile Banner', width: 1584, height: 396, aspect: '4:1' },
];

export const SocialMediaResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(SOCIAL_PRESETS[0]);
  const [fitMode, setFitMode] = useState<'fit' | 'fill'>('fill');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = URL.createObjectURL(files[0]);
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = selectedPreset.width;
    canvas.height = selectedPreset.height;
    const ctx = canvas.getContext('2d')!;

    // Clean background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const targetAspect = selectedPreset.width / selectedPreset.height;

    let drawW: number;
    let drawH: number;

    if (fitMode === 'fill') {
      if (imgAspect > targetAspect) {
        drawH = selectedPreset.height;
        drawW = selectedPreset.height * imgAspect;
      } else {
        drawW = selectedPreset.width;
        drawH = selectedPreset.width / imgAspect;
      }
    } else {
      // fit
      if (imgAspect > targetAspect) {
        drawW = selectedPreset.width;
        drawH = selectedPreset.width / imgAspect;
      } else {
        drawH = selectedPreset.height;
        drawW = selectedPreset.height * imgAspect;
      }
    }

    const posX = (selectedPreset.width - drawW) / 2;
    const posY = (selectedPreset.height - drawH) / 2;

    ctx.drawImage(imgElement, posX, posY, drawW, drawH);
  }, [imgElement, selectedPreset, fitMode]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        downloadFile(
          blob,
          `${baseName}-${selectedPreset.id}-${selectedPreset.width}x${selectedPreset.height}.jpg`,
          'image/jpeg'
        );
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
          label="Select image to resize for Social Media"
          sublabel="Instagram, YouTube Thumbnail, Facebook Cover, LinkedIn, and Twitter"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-500" /> Platform Presets
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPreset(p)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedPreset.id === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold opacity-75">{p.platform}</div>
                  <div className="text-xs font-bold truncate">{p.name}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {p.width}×{p.height} ({p.aspect})
                  </div>
                </button>
              ))}
            </div>

            {/* Fit mode */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Fitting Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFitMode('fill')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    fitMode === 'fill'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  Fill (Crop edges)
                </button>
                <button
                  onClick={() => setFitMode('fit')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    fitMode === 'fit'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  Fit (Keep entire image)
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download for {selectedPreset.platform}
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Choose another image
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px]">
            <canvas
              ref={canvasRef}
              className="max-h-[460px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
            <div className="mt-3 text-xs text-slate-400">
              {selectedPreset.platform} {selectedPreset.name} • {selectedPreset.width} ×{' '}
              {selectedPreset.height} px
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
