import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../../common/Dropzone';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Layers, Download, Sliders, Check } from 'lucide-react';

export const PhotoSignatureMergeTool: React.FC = () => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);

  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [signImg, setSignImg] = useState<HTMLImageElement | null>(null);

  // Candidate Details
  const [candidateName, setCandidateName] = useState<string>('RAHUL SHARMA');
  const [applicationDate, setApplicationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [includeText, setIncludeText] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoSelect = (files: File[]) => {
    if (!files.length) return;
    setPhotoFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setPhotoImg(img);
    img.src = URL.createObjectURL(files[0]);
  };

  const handleSignSelect = (files: File[]) => {
    if (!files.length) return;
    setSignFile(files[0]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setSignImg(img);
    img.src = URL.createObjectURL(files[0]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Standard composite dimensions: 600px width x 800px height
    const w = 600;
    const h = 820;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Clean white form background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Border around outer composite card
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // 1. Photo Slot (Top area)
    const photoBoxW = 440;
    const photoBoxH = 480;
    const photoBoxX = (w - photoBoxW) / 2;
    const photoBoxY = 30;

    if (photoImg) {
      ctx.drawImage(photoImg, photoBoxX, photoBoxY, photoBoxW, photoBoxH);
    } else {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Passport Photo Area', w / 2, photoBoxY + photoBoxH / 2);
    }

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);

    // 2. Candidate Name & Date Text strip if enabled
    let curY = photoBoxY + photoBoxH + 15;
    if (includeText) {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(candidateName.toUpperCase(), w / 2, curY + 16);

      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.fillText(`D.O.P: ${applicationDate}`, w / 2, curY + 36);
      curY += 50;
    }

    // 3. Signature Slot (Bottom area)
    const signBoxW = 440;
    const signBoxH = 140;
    const signBoxX = (w - signBoxW) / 2;
    const signBoxY = curY + 10;

    if (signImg) {
      ctx.drawImage(signImg, signBoxX, signBoxY, signBoxW, signBoxH);
    } else {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(signBoxX, signBoxY, signBoxW, signBoxH);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Signature Area', w / 2, signBoxY + signBoxH / 2);
    }

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(signBoxX, signBoxY, signBoxW, signBoxH);
  }, [photoImg, signImg, candidateName, applicationDate, includeText]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        downloadFile(blob, `photo-signature-merged-${candidateName || 'form'}.jpg`, 'image/jpeg');
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" /> Photo & Signature Merger
          </h3>

          {/* Photo Slot Uploader */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              1. Candidate Portrait Photo
            </label>
            <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs">
                {photoFile ? photoFile.name : 'No photo chosen'}
              </span>
              <label className="py-1 px-3 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer hover:bg-indigo-700">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handlePhotoSelect(Array.from(e.target.files));
                  }}
                />
              </label>
            </div>
          </div>

          {/* Signature Slot Uploader */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              2. Candidate Signature
            </label>
            <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs">
                {signFile ? signFile.name : 'No signature chosen'}
              </span>
              <label className="py-1 px-3 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer hover:bg-indigo-700">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleSignSelect(Array.from(e.target.files));
                  }}
                />
              </label>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Include Candidate Name & Date Strip</span>
            </label>

            {includeText && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Photo (DOP)
                  </label>
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Combined Photo + Signature
            </button>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px]">
          <canvas
            ref={canvasRef}
            className="max-h-[520px] max-w-full object-contain rounded-lg shadow-2xl bg-white"
          />
          <div className="mt-3 text-xs text-slate-400">
            Standard Application Format (600×820 px)
          </div>
        </div>
      </div>
    </div>
  );
};
