/**
 * Comprehensive client-side image processing utility.
 * Pure Canvas and Browser APIs - 100% private and client-side.
 */

export interface Point {
  x: number;
  y: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculates pixel dimensions from physical dimensions and DPI
 */
export function calculatePixels(
  value: number,
  unit: 'mm' | 'cm' | 'inch' | 'px',
  dpi: number
): number {
  switch (unit) {
    case 'mm':
      return Math.round((value / 25.4) * dpi);
    case 'cm':
      return Math.round((value / 2.54) * dpi);
    case 'inch':
      return Math.round(value * dpi);
    case 'px':
    default:
      return Math.round(value);
  }
}

/**
 * Calculate physical dimension from pixels and DPI
 */
export function calculatePhysical(
  pixels: number,
  unit: 'mm' | 'cm' | 'inch',
  dpi: number
): number {
  switch (unit) {
    case 'mm':
      return (pixels / dpi) * 25.4;
    case 'cm':
      return (pixels / dpi) * 2.54;
    case 'inch':
      return pixels / dpi;
  }
}

/**
 * Iterative compression to hit target file size in KB
 */
export async function compressToTargetKB(
  img: HTMLImageElement,
  targetKB: number,
  outputType: 'image/jpeg' | 'image/webp' = 'image/jpeg'
): Promise<{ blob: Blob; dataUrl: string; finalKB: number }> {
  let minQuality = 0.05;
  let maxQuality = 0.98;
  let bestBlob: Blob | null = null;
  let bestDiff = Infinity;

  const targetBytes = targetKB * 1024;
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  // Scale down if extremely large for very small targets (e.g. 10KB-20KB)
  if (targetKB <= 20 && (width > 1200 || height > 1200)) {
    const scale = Math.min(800 / width, 800 / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  } else if (targetKB <= 50 && (width > 2000 || height > 2000)) {
    const scale = Math.min(1400 / width, 1400 / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Binary search for closest quality setting
  for (let step = 0; step < 7; step++) {
    const currentQuality = (minQuality + maxQuality) / 2;
    const blob: Blob = await new Promise((res) => {
      canvas.toBlob((b) => res(b || new Blob()), outputType, currentQuality);
    });

    const diff = Math.abs(blob.size - targetBytes);
    if (diff < bestDiff || !bestBlob) {
      bestDiff = diff;
      bestBlob = blob;
    }

    if (blob.size > targetBytes) {
      maxQuality = currentQuality;
    } else {
      minQuality = currentQuality;
    }
  }

  // If even lowest quality is larger than targetKB, downscale canvas dimensions
  if (bestBlob && bestBlob.size > targetBytes * 1.15 && width > 300) {
    let scaleRatio = Math.sqrt(targetBytes / bestBlob.size) * 0.95;
    scaleRatio = Math.max(0.2, Math.min(0.9, scaleRatio));
    canvas.width = Math.round(width * scaleRatio);
    canvas.height = Math.round(height * scaleRatio);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const rescaleBlob: Blob = await new Promise((res) => {
      canvas.toBlob((b) => res(b || bestBlob!), outputType, 0.7);
    });
    bestBlob = rescaleBlob;
  }

  const dataUrl = URL.createObjectURL(bestBlob!);
  return {
    blob: bestBlob!,
    dataUrl,
    finalKB: Math.round((bestBlob!.size / 1024) * 10) / 10,
  };
}

/**
 * Apply filters (Brightness, Contrast, Saturation, Sharpness, Exposure, B&W, Noise/Smoothing)
 */
export function applyImageFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: {
    brightness?: number; // -100 to 100
    contrast?: number; // -100 to 100
    saturation?: number; // -100 to 100
    sharpness?: number; // 0 to 100
    exposure?: number; // -100 to 100
    grayscale?: boolean;
    blackAndWhite?: boolean;
    invert?: boolean;
    blur?: number; // 0 to 20 px
    pixelate?: number; // 1 to 20
  }
) {
  const {
    brightness = 0,
    contrast = 0,
    saturation = 0,
    sharpness = 0,
    grayscale = false,
    blackAndWhite = false,
    invert = false,
  } = options;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const bFactor = (brightness + (options.exposure || 0)) * 1.5;
  const cFactor = (contrast + 100) / 100;
  const cAdjust = cFactor * cFactor;
  const sFactor = (saturation + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness & Exposure
    r += bFactor;
    g += bFactor;
    b += bFactor;

    // Contrast
    r = (r / 255 - 0.5) * cAdjust + 0.5;
    g = (g / 255 - 0.5) * cAdjust + 0.5;
    b = (b / 255 - 0.5) * cAdjust + 0.5;
    r = Math.min(255, Math.max(0, r * 255));
    g = Math.min(255, Math.max(0, g * 255));
    b = Math.min(255, Math.max(0, b * 255));

    // Saturation
    if (sFactor !== 1) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * sFactor;
      g = gray + (g - gray) * sFactor;
      b = gray + (b - gray) * sFactor;
    }

    // Grayscale
    if (grayscale || blackAndWhite) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      if (blackAndWhite) {
        const threshold = 128;
        const bw = gray > threshold ? 255 : 0;
        r = bw;
        g = bw;
        b = bw;
      } else {
        r = gray;
        g = gray;
        b = gray;
      }
    }

    // Invert
    if (invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imgData, 0, 0);

  // Sharpening via convolution kernel if requested
  if (sharpness > 0) {
    applySharpenKernel(ctx, width, height, sharpness / 100);
  }
}

/**
 * 3x3 Sharpen Kernel
 */
function applySharpenKernel(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount: number
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(imgData.data);
  const dst = imgData.data;
  const strength = amount * 1.5;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = src[idx + c];
        const up = src[((y - 1) * w + x) * 4 + c];
        const down = src[((y + 1) * w + x) * 4 + c];
        const left = src[(y * w + (x - 1)) * 4 + c];
        const right = src[(y * w + (x + 1)) * 4 + c];

        const laplacian = 4 * center - (up + down + left + right);
        dst[idx + c] = Math.min(255, Math.max(0, center + laplacian * strength));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Replace background color (e.g. for studio passport background: sky blue, white, light blue, grey)
 * Intelligently samples border background tones while preserving skin/hair/clothes.
 */
export function replaceBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  newHexColor: string,
  tolerance = 38
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Parse new color
  const tempDiv = document.createElement('div');
  tempDiv.style.color = newHexColor;
  document.body.appendChild(tempDiv);
  const cs = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  const match = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const targetR = match ? parseInt(match[1]) : 135;
  const targetG = match ? parseInt(match[2]) : 206;
  const targetB = match ? parseInt(match[3]) : 235;

  // Sample top corners to deduce original background color
  const samplePoints = [
    0, // top-left
    Math.min(data.length - 4, (width - 1) * 4), // top-right
    Math.min(data.length - 4, (width * 5 + 5) * 4),
    Math.min(data.length - 4, (width * 5 + width - 6) * 4),
  ];

  let sumR = 0, sumG = 0, sumB = 0;
  samplePoints.forEach((p) => {
    sumR += data[p];
    sumG += data[p + 1];
    sumB += data[p + 2];
  });
  const bgR = sumR / samplePoints.length;
  const bgG = sumG / samplePoints.length;
  const bgB = sumB / samplePoints.length;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
    );

    if (dist < tolerance) {
      // Soft alpha blend
      const blend = Math.max(0, Math.min(1, dist / tolerance));
      data[i] = Math.round(targetR * (1 - blend) + r * blend);
      data[i + 1] = Math.round(targetG * (1 - blend) + g * blend);
      data[i + 2] = Math.round(targetB * (1 - blend) + b * blend);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Perform 4-corner perspective dewarp (Homography transform)
 * Maps quadrilateral (tl, tr, br, bl) to a flat rectangular canvas (dstWidth x dstHeight).
 */
export function perspectiveDewarp(
  sourceCanvas: HTMLCanvasElement,
  corners: { tl: Point; tr: Point; br: Point; bl: Point },
  dstWidth: number,
  dstHeight: number
): HTMLCanvasElement {
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = dstWidth;
  resultCanvas.height = dstHeight;
  const dstCtx = resultCanvas.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');
  if (!dstCtx || !srcCtx) return resultCanvas;

  const srcImgData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const srcData = srcImgData.data;
  const dstImgData = dstCtx.createImageData(dstWidth, dstHeight);
  const dstData = dstImgData.data;

  // Inverse bilinear interpolation mapping for perspective
  const { tl, tr, br, bl } = corners;

  for (let y = 0; y < dstHeight; y++) {
    const v = y / dstHeight;
    for (let x = 0; x < dstWidth; x++) {
      const u = x / dstWidth;

      // Point along top and bottom edges
      const topX = tl.x + u * (tr.x - tl.x);
      const topY = tl.y + u * (tr.y - tl.y);
      const botX = bl.x + u * (br.x - bl.x);
      const botY = bl.y + u * (br.y - bl.y);

      // Interpolate along vertical direction
      const srcX = Math.round(topX + v * (botX - topX));
      const srcY = Math.round(topY + v * (botY - topY));

      const dstIdx = (y * dstWidth + x) * 4;

      if (srcX >= 0 && srcX < sourceCanvas.width && srcY >= 0 && srcY < sourceCanvas.height) {
        const srcIdx = (srcY * sourceCanvas.width + srcX) * 4;
        dstData[dstIdx] = srcData[srcIdx];
        dstData[dstIdx + 1] = srcData[srcIdx + 1];
        dstData[dstIdx + 2] = srcData[srcIdx + 2];
        dstData[dstIdx + 3] = srcData[srcIdx + 3];
      } else {
        dstData[dstIdx] = 255;
        dstData[dstIdx + 1] = 255;
        dstData[dstIdx + 2] = 255;
        dstData[dstIdx + 3] = 255;
      }
    }
  }

  dstCtx.putImageData(dstImgData, 0, 0);
  return resultCanvas;
}

/**
 * Generate photo sheet (4x6 inch or A4) with cut marks and multiple photo copies
 */
export function generatePhotoSheet(
  photoImg: HTMLImageElement,
  options: {
    sheetType: '4x6' | 'a4' | 'a5' | 'letter';
    copies: number;
    dpi: number;
    photoWidthMm: number;
    photoHeightMm: number;
    showCutMarks?: boolean;
    marginMm?: number;
    spacingMm?: number;
    border?: boolean;
  }
): HTMLCanvasElement {
  const {
    sheetType,
    copies,
    dpi,
    photoWidthMm,
    photoHeightMm,
    showCutMarks = true,
    marginMm = 5,
    spacingMm = 3,
    border = true,
  } = options;

  // Sheet physical sizes in mm
  let sheetW_mm = 101.6; // 4 inch
  let sheetH_mm = 152.4; // 6 inch

  if (sheetType === 'a4') {
    sheetW_mm = 210;
    sheetH_mm = 297;
  } else if (sheetType === 'a5') {
    sheetW_mm = 148;
    sheetH_mm = 210;
  } else if (sheetType === 'letter') {
    sheetW_mm = 215.9;
    sheetH_mm = 279.4;
  }

  const sheetW_px = calculatePixels(sheetW_mm, 'mm', dpi);
  const sheetH_px = calculatePixels(sheetH_mm, 'mm', dpi);
  const photoW_px = calculatePixels(photoWidthMm, 'mm', dpi);
  const photoH_px = calculatePixels(photoHeightMm, 'mm', dpi);
  const margin_px = calculatePixels(marginMm, 'mm', dpi);
  const spacing_px = calculatePixels(spacingMm, 'mm', dpi);

  const canvas = document.createElement('canvas');
  canvas.width = sheetW_px;
  canvas.height = sheetH_px;
  const ctx = canvas.getContext('2d')!;

  // Fill sheet background with clean photo studio white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetW_px, sheetH_px);

  // Compute layout grid
  const availableW = sheetW_px - margin_px * 2;
  const availableH = sheetH_px - margin_px * 2;
  const cols = Math.max(1, Math.floor((availableW + spacing_px) / (photoW_px + spacing_px)));
  const rows = Math.max(1, Math.floor((availableH + spacing_px) / (photoH_px + spacing_px)));

  let rendered = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rendered >= copies) break;

      const x = margin_px + c * (photoW_px + spacing_px);
      const y = margin_px + r * (photoH_px + spacing_px);

      // Draw photo
      ctx.drawImage(photoImg, x, y, photoW_px, photoH_px);

      // Fine border around photo
      if (border) {
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = Math.max(1, Math.round(dpi / 300));
        ctx.strokeRect(x, y, photoW_px, photoH_px);
      }

      // Cut marks on corners
      if (showCutMarks) {
        const markLen = Math.round(dpi * 0.05); // ~1.2mm
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = Math.max(1, Math.round(dpi / 300));

        // Top-left
        ctx.beginPath();
        ctx.moveTo(x - markLen, y);
        ctx.lineTo(x, y);
        ctx.moveTo(x, y - markLen);
        ctx.lineTo(x, y);
        // Top-right
        ctx.moveTo(x + photoW_px, y);
        ctx.lineTo(x + photoW_px + markLen, y);
        ctx.moveTo(x + photoW_px, y - markLen);
        ctx.lineTo(x + photoW_px, y);
        // Bottom-left
        ctx.moveTo(x - markLen, y + photoH_px);
        ctx.lineTo(x, y + photoH_px);
        ctx.moveTo(x, y + photoH_px);
        ctx.lineTo(x, y + photoH_px + markLen);
        // Bottom-right
        ctx.moveTo(x + photoW_px, y + photoH_px);
        ctx.lineTo(x + photoW_px + markLen, y + photoH_px);
        ctx.moveTo(x + photoW_px, y + photoH_px);
        ctx.lineTo(x + photoW_px, y + photoH_px + markLen);
        ctx.stroke();
      }

      rendered++;
    }
  }

  // Studio print header mark
  ctx.fillStyle = '#64748B';
  ctx.font = `${Math.round(dpi * 0.04)}px sans-serif`;
  ctx.fillText(
    `SnapDoc Tools • ${sheetType.toUpperCase()} Sheet • ${copies} Copies • ${photoWidthMm}x${photoHeightMm}mm @ ${dpi} DPI`,
    margin_px,
    sheetH_px - Math.round(dpi * 0.05)
  );

  return canvas;
}
