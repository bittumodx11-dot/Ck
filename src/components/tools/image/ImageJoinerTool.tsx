import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { LayoutGrid, Download, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface ImageItem {
  id: string;
  img: HTMLImageElement;
  name: string;
}

export const ImageJoinerTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [mode, setMode] = useState<'horizontal' | 'vertical' | 'grid'>('grid');
  const [columns, setColumns] = useState<number>(2);
  const [spacing, setSpacing] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelect = (files: File[]) => {
    const newItems: Promise<ImageItem>[] = files.map((file) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            img,
            name: file.name,
          });
        };
        img.src = URL.createObjectURL(file);
      });
    });

    Promise.all(newItems).then((res) => {
      setImages((prev) => [...prev, ...res]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const copy = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  useEffect(() => {
    if (!images.length || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'horizontal') {
      const maxH = Math.max(...images.map((i) => i.img.naturalHeight));
      const totalW =
        images.reduce((sum, i) => sum + (i.img.naturalWidth * maxH) / i.img.naturalHeight, 0) +
        spacing * (images.length + 1);

      canvas.width = totalW;
      canvas.height = maxH + spacing * 2;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let curX = spacing;
      images.forEach((item) => {
        const drawW = (item.img.naturalWidth * maxH) / item.img.naturalHeight;
        ctx.drawImage(item.img, curX, spacing, drawW, maxH);
        curX += drawW + spacing;
      });
    } else if (mode === 'vertical') {
      const maxW = Math.max(...images.map((i) => i.img.naturalWidth));
      const totalH =
        images.reduce((sum, i) => sum + (i.img.naturalHeight * maxW) / i.img.naturalWidth, 0) +
        spacing * (images.length + 1);

      canvas.width = maxW + spacing * 2;
      canvas.height = totalH;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let curY = spacing;
      images.forEach((item) => {
        const drawH = (item.img.naturalHeight * maxW) / item.img.naturalWidth;
        ctx.drawImage(item.img, spacing, curY, maxW, drawH);
        curY += drawH + spacing;
      });
    } else {
      // Grid mode
      const cols = Math.max(1, Math.min(columns, images.length));
      const rows = Math.ceil(images.length / cols);
      const cellW = 800;
      const cellH = 800;

      canvas.width = cols * cellW + (cols + 1) * spacing;
      canvas.height = rows * cellH + (rows + 1) * spacing;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      images.forEach((item, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = spacing + c * (cellW + spacing);
        const y = spacing + r * (cellH + spacing);

        // Aspect fit in cell
        const imgAspect = item.img.naturalWidth / item.img.naturalHeight;
        let w = cellW;
        let h = cellH;
        if (imgAspect > 1) {
          h = cellW / imgAspect;
        } else {
          w = cellH * imgAspect;
        }
        const posX = x + (cellW - w) / 2;
        const posY = y + (cellH - h) / 2;

        ctx.drawImage(item.img, posX, posY, w, h);
      });
    }
  }, [images, mode, columns, spacing, bgColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      downloadFile(blob, 'joined-images.jpg', 'image/jpeg');
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <Dropzone
          onFileSelect={handleFilesSelect}
          multiple={true}
          label="Select multiple images to join"
          sublabel="Combine horizontally, vertically, or in a photo collage grid"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-500" /> Layout Settings
            </h3>

            {/* Layout Mode */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'horizontal', label: 'Horizontal' },
                { id: 'vertical', label: 'Vertical' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    mode === m.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {mode === 'grid' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Number of Columns ({columns})
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={columns}
                  onChange={(e) => setColumns(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Spacing / Gap ({spacing}px)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={spacing}
                onChange={(e) => setSpacing(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="font-mono text-xs uppercase text-slate-600 dark:text-slate-300">
                  {bgColor}
                </span>
              </div>
            </div>

            {/* List of images */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Images ({images.length})
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="truncate max-w-[140px] font-medium text-slate-800 dark:text-slate-200">
                      {idx + 1}. {item.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50">
                  <Plus className="w-3.5 h-3.5" /> Add more images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleFilesSelect(Array.from(e.target.files));
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Combined Image
              </button>
            </div>
          </div>

          {/* Combined Preview */}
          <div className="lg:col-span-8 flex items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[440px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
