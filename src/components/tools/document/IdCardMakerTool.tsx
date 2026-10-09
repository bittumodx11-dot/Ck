import React, { useState, useRef, useEffect } from 'react';
import { downloadFile } from '../../../utils/pdfProcessing';
import { Contact, Download, Printer, User, Building, QrCode } from 'lucide-react';

export const IdCardMakerTool: React.FC = () => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  // Fields
  const [orgName, setOrgName] = useState<string>('APEX TECH ACADEMY');
  const [cardTitle, setCardTitle] = useState<string>('STUDENT IDENTITY CARD');
  const [fullName, setFullName] = useState<string>('SNEHA MUKHERJEE');
  const [role, setRole] = useState<string>('B.Tech Computer Science');
  const [idNumber, setIdNumber] = useState<string>('STU-2026-8849');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [dob, setDob] = useState<string>('2002-05-14');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [address, setAddress] = useState<string>('Salt Lake Sector V, Kolkata, WB - 700091');
  const [primaryColor, setPrimaryColor] = useState<string>('#4F46E5'); // indigo

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setPhotoImg(img);
      img.src = url;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // CR80 Standard ID Card Aspect: 1012 x 638 px (approx 85.6 x 54 mm @ 300 DPI)
    const w = 638;
    const h = 1012; // vertical portrait ID card
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Clean background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    if (activeSide === 'front') {
      // Header banner
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, w, 140);

      // Curved shape banner
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.quadraticCurveTo(w / 2, 175, w, 140);
      ctx.lineTo(w, 0);
      ctx.lineTo(0, 0);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      // Org Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(orgName.toUpperCase(), w / 2, 60);

      // Title
      ctx.font = '13px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(cardTitle.toUpperCase(), w / 2, 95);

      // Photo Frame
      const photoSize = 220;
      const photoX = (w - photoSize) / 2;
      const photoY = 190;

      // Outer ring
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6);

      if (photoImg) {
        ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
      } else {
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = '#64748B';
        ctx.font = '14px sans-serif';
        ctx.fillText('Photo', w / 2, photoY + photoSize / 2);
      }

      // Name & Role
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(fullName, w / 2, 460);

      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(role, w / 2, 492);

      // Details Table
      const startY = 540;
      const rowGap = 38;
      const fields = [
        { label: 'ID NUMBER', val: idNumber },
        { label: 'BLOOD GROUP', val: bloodGroup },
        { label: 'D.O.B', val: dob },
        { label: 'PHONE', val: phone },
      ];

      ctx.textAlign = 'left';
      fields.forEach((f, idx) => {
        const y = startY + idx * rowGap;
        ctx.fillStyle = '#64748B';
        ctx.font = '12px sans-serif';
        ctx.fillText(f.label, 80, y);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`:  ${f.val}`, 230, y);
      });

      // Bottom barcode graphic mock
      ctx.fillStyle = '#0F172A';
      const barY = 740;
      for (let bx = 120; bx < w - 120; bx += 8) {
        const bw = (bx % 16 === 0 ? 4 : 2);
        ctx.fillRect(bx, barY, bw, 45);
      }
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(idNumber, w / 2, barY + 65);

      // Footer color bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, h - 25, w, 25);
    } else {
      // BACK SIDE
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, w, 60);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TERMS & INSTRUCTIONS', w / 2, 38);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#334155';
      ctx.font = '13px sans-serif';
      const terms = [
        '1. This card is non-transferable and must be presented upon request.',
        '2. In case of loss, immediately report to the issuing authority.',
        '3. If found, please return to the address given below.',
      ];

      terms.forEach((t, i) => {
        ctx.fillText(t, 50, 120 + i * 36);
      });

      // Address Block
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('RESIDENTIAL ADDRESS:', 50, 280);

      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText(address, 50, 310);

      // Authorized signature block
      ctx.fillStyle = '#64748B';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Authorized Signatory', w - 60, 520);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w - 220, 500);
      ctx.lineTo(w - 60, 500);
      ctx.stroke();

      // Bottom bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, h - 30, w, 30);
    }
  }, [
    activeSide,
    orgName,
    cardTitle,
    fullName,
    role,
    idNumber,
    bloodGroup,
    dob,
    phone,
    address,
    primaryColor,
    photoImg,
  ]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        downloadFile(blob, `id-card-${activeSide}-${fullName || 'student'}.jpg`, 'image/jpeg');
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Contact className="w-4 h-4 text-indigo-500" /> ID Card Designer
            </h3>

            {/* Front / Back Toggle */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveSide('front')}
                className={`py-1 px-3 rounded-lg text-xs font-semibold ${
                  activeSide === 'front' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Front Side
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`py-1 px-3 rounded-lg text-xs font-semibold ${
                  activeSide === 'back' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Back Side
              </button>
            </div>
          </div>

          {activeSide === 'front' ? (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / School / College Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Theme Color
                  </label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Course
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ID / Roll Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Action */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download {activeSide.toUpperCase()} Card
            </button>
            <button
              onClick={() => window.print()}
              className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl min-h-[460px]">
          <canvas
            ref={canvasRef}
            className="max-h-[500px] max-w-full object-contain rounded-2xl shadow-2xl bg-white border border-slate-700"
          />
          <div className="mt-3 text-xs text-slate-400">
            Preview: {activeSide.toUpperCase()} Side (Standard CR80 ID Card)
          </div>
        </div>
      </div>
    </div>
  );
};
