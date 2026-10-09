import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Shield, Download, Sliders, Image as ImageIcon } from 'lucide-react';

export const ImageWatermarkTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Watermark options
  const [type, setType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState<string>('CONFIDENTIAL / COPY');
  const [fontSize, setFontSize] = useState<number>(48);
  const [opacity, setOpacity] = useState<number>(0.35);
  const [rotation, setRotation] = useState<number>(-30);
  const [color, setColor] = useState<string>('#ffffff');
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'top-left' | 'tile'>('center');

  // Logo watermark
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoScale, setLogoScale] = useState<number>(20); // 20% of image width

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImgElement(img);
    img.src = URL.createObjectURL(files[0]);
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setLogoImg(img);
      img.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = imgElement.naturalWidth;
    const h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base image
    ctx.drawImage(imgElement, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity;

    if (type === 'text') {
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (position === 'tile') {
        const textMetrics = ctx.measureText(text);
        const stepX = textMetrics.width + 120;
        const stepY = fontSize * 3.5;

        for (let y = -h; y < h * 2; y += stepY) {
          for (let x = -w; x < w * 2; x += stepX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
          }
        }
      } else {
        let posX = w / 2;
        let posY = h / 2;
        if (position === 'bottom-right') {
          posX = w - 160;
          posY = h - 60;
        } else if (position === 'top-left') {
          posX = 160;
          posY = 60;
        }

        ctx.translate(posX, posY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
      }
    } else if (type === 'image' && logoImg) {
      const targetW = (w * logoScale) / 100;
      const targetH = (logoImg.naturalHeight * targetW) / logoImg.naturalWidth;

      let posX = (w - targetW) / 2;
      let posY = (h - targetH) / 2;
      if (position === 'bottom-right') {
        posX = w - targetW - 30;
        posY = h - targetH - 30;
      } else if (position === 'top-left') {
        posX = 30;
        posY = 30;
      }

      ctx.drawImage(logoImg, posX, posY, targetW, targetH);
    }

    ctx.restore();
  }, [imgElement, type, text, fontSize, opacity, rotation, color, position, logoImg, logoScale]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      downloadFile(blob, `${baseName}-watermarked.jpg`, 'image/jpeg');
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFileSelect={handleFileSelect}
          label="Select image to add watermark"
          sublabel="Protect copyright with text or logo stamps"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> Watermark Settings
            </h3>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType('text')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                  type === 'text'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                Text Watermark
              </button>
              <button
                onClick={() => setType('image')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                  type === 'image'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                Logo / Image Watermark
              </button>
            </div>

            {type === 'text' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Font Size ({fontSize}px)
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Upload Logo / Watermark PNG
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoSelect}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Logo Scale ({logoScale}% width)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={logoScale}
                    onChange={(e) => setLogoScale(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Placement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'center', label: 'Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'tile', label: 'Repeated Tile' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                      position === pos.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity & Rotation */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Angle ({rotation}°)
                </label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
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
                <Download className="w-4 h-4" /> Download Watermarked Image
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select another image
              </button>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="lg:col-span-7 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-[460px] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
