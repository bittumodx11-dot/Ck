import React, { useState } from 'react';
import { calculatePixels, calculatePhysical } from '../../../utils/imageProcessing';
import { Calculator, ArrowRightLeft, Sparkles, Sliders } from 'lucide-react';

export const ImageSizeCalculator: React.FC = () => {
  // Physical to pixels
  const [valLength, setValLength] = useState<number>(35);
  const [valUnit, setValUnit] = useState<'mm' | 'cm' | 'inch'>('mm');
  const [calcDpi, setCalcDpi] = useState<number>(300);

  // Pixels to physical
  const [valPixels, setValPixels] = useState<number>(600);
  const [calcDpi2, setCalcDpi2] = useState<number>(300);

  const pixelsResult = calculatePixels(valLength, valUnit, calcDpi);
  const physicalMmResult = calculatePhysical(valPixels, 'mm', calcDpi2);
  const physicalCmResult = calculatePhysical(valPixels, 'cm', calcDpi2);
  const physicalInchResult = calculatePhysical(valPixels, 'inch', calcDpi2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Converter 1: Physical to Pixels */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <span>Physical Size → Pixels</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Physical Dimension
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={valLength}
                  onChange={(e) => setValLength(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={valUnit}
                  onChange={(e) => setValUnit(e.target.value as any)}
                  className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="inch">inch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resolution (DPI)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[72, 150, 200, 300].map((d) => (
                  <button
                    key={d}
                    onClick={() => setCalcDpi(d)}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${
                      calcDpi === d
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-center">
              <div className="text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                Calculated Pixel Dimension
              </div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {pixelsResult} <span className="text-sm font-normal">px</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {valLength} {valUnit} at {calcDpi} DPI = {pixelsResult} pixels
              </div>
            </div>
          </div>
        </div>

        {/* Converter 2: Pixels to Physical Size */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Pixels → Physical Print Size</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Pixels
              </label>
              <input
                type="number"
                value={valPixels}
                onChange={(e) => setValPixels(parseInt(e.target.value, 10) || 0)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. 600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resolution (DPI)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[72, 150, 200, 300].map((d) => (
                  <button
                    key={d}
                    onClick={() => setCalcDpi2(d)}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${
                      calcDpi2 === d
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 space-y-1.5 text-center">
              <div className="text-xs text-violet-900 dark:text-violet-300 font-medium">
                Physical Output Dimensions
              </div>
              <div className="text-xl font-bold text-violet-700 dark:text-violet-300">
                {physicalMmResult.toFixed(1)} mm ({physicalCmResult.toFixed(2)} cm)
              </div>
              <div className="text-xs text-slate-500">
                or {physicalInchResult.toFixed(2)} inches
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Standard Dimensions Cheat Sheet */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Standard Photo & Document Reference Chart (at 300 DPI)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2 pr-4 font-semibold">Standard Purpose</th>
                <th className="py-2 px-4 font-semibold">Physical Size</th>
                <th className="py-2 px-4 font-semibold">Pixels @ 300 DPI</th>
                <th className="py-2 pl-4 font-semibold">Common Portals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 pr-4 font-medium">Standard Passport Photo</td>
                <td className="py-2.5 px-4 font-mono">35 × 45 mm</td>
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">413 × 531 px</td>
                <td className="py-2.5 pl-4">India, UK, Schengen Visa</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">US Visa / 2×2 Inch</td>
                <td className="py-2.5 px-4 font-mono">2 × 2 inch (51×51 mm)</td>
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">600 × 600 px</td>
                <td className="py-2.5 pl-4">US Visa, OCI Card</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Exam Signature Box</td>
                <td className="py-2.5 px-4 font-mono">50 × 20 mm</td>
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">591 × 236 px</td>
                <td className="py-2.5 pl-4">UPSC, SSC, Banking, Railways</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">A4 Document Paper</td>
                <td className="py-2.5 px-4 font-mono">210 × 297 mm</td>
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">2480 × 3508 px</td>
                <td className="py-2.5 pl-4">Certificates, Biodata, Forms</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Studio 4×6 Photo Sheet</td>
                <td className="py-2.5 px-4 font-mono">102 × 152 mm (4×6 in)</td>
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">1200 × 1800 px</td>
                <td className="py-2.5 pl-4">Photo Printing Studios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
