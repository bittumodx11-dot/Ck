import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { formatBytes } from './imageProcessing';

export { formatBytes };

export interface PageSizeConfig {
  name: string;
  widthPt: number;
  heightPt: number;
}

export const PDF_PAGE_SIZES: Record<string, PageSizeConfig> = {
  a4: { name: 'A4 (210 × 297 mm)', widthPt: 595.28, heightPt: 841.89 },
  a5: { name: 'A5 (148 × 210 mm)', widthPt: 419.53, heightPt: 595.28 },
  letter: { name: 'Letter (8.5 × 11 in)', widthPt: 612.0, heightPt: 792.0 },
  legal: { name: 'Legal (8.5 × 14 in)', widthPt: 612.0, heightPt: 1008.0 },
  photo4x6: { name: 'Photo 4 × 6 in', widthPt: 288.0, heightPt: 432.0 },
};

/**
 * Safely convert any image dataUrl (including webp, svg, avif) to a JPEG dataUrl using canvas
 */
async function rasterizeToJpegDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for PDF embedding.'));
    };
    img.src = dataUrl;
  });
}

/**
 * Safely load and validate a PDF buffer.
 * Fixes "No PDF header found" issues by:
 * 1. Handling leading BOM/whitespace or server output prepended before '%PDF-'
 * 2. Recognizing accidentally dropped images (JPEG, PNG, WebP, GIF) with clear explanations
 * 3. Handling base64 / data URL strings passed as buffers
 * 4. Catching corrupted or non-PDF files gracefully
 */
export async function safeLoadPdf(input: ArrayBuffer | Uint8Array): Promise<PDFDocument> {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);

  if (!bytes || bytes.length === 0) {
    throw new Error('The selected file is empty (0 bytes). Please choose a valid PDF.');
  }

  // Check if buffer contains a data: URL text string instead of raw binary
  if (
    bytes.length > 5 &&
    bytes[0] === 0x64 && // 'd'
    bytes[1] === 0x61 && // 'a'
    bytes[2] === 0x74 && // 't'
    bytes[3] === 0x61 && // 'a'
    bytes[4] === 0x3a    // ':'
  ) {
    const prefix = new TextDecoder('utf-8').decode(bytes.slice(0, 250));
    const commaIndex = prefix.indexOf(',');
    if (commaIndex !== -1) {
      const fullText = new TextDecoder('utf-8').decode(bytes);
      const b64 = fullText.slice(commaIndex + 1).trim();
      const binary = atob(b64);
      const decodedBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        decodedBytes[i] = binary.charCodeAt(i);
      }
      return safeLoadPdf(decodedBytes);
    }
  }

  // Detect image file magic bytes
  // JPEG: FF D8 FF
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    throw new Error(
      'The selected file is a JPEG image, not a PDF document. Please use the "Image to PDF" tool or select a valid .pdf file.'
    );
  }
  // PNG: 89 50 4E 47
  if (
    bytes.length > 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    throw new Error(
      'The selected file is a PNG image, not a PDF document. Please use the "Image to PDF" tool or select a valid .pdf file.'
    );
  }
  // GIF: 47 49 46 38
  if (
    bytes.length > 4 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    throw new Error(
      'The selected file is a GIF image, not a PDF document. Please use the "Image to PDF" tool or select a valid .pdf file.'
    );
  }
  // WEBP (RIFF .... WEBP)
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    throw new Error(
      'The selected file is a WebP image, not a PDF document. Please use the "Image to PDF" tool or select a valid .pdf file.'
    );
  }
  // ZIP / DOCX / XLSX: PK (50 4B 03 04)
  if (
    bytes.length > 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  ) {
    throw new Error(
      'The selected file is an Office or ZIP document, not a PDF. Please select a valid .pdf file.'
    );
  }

  // Look for '%PDF-' signature (37, 80, 68, 70, 45) in the first 4096 bytes
  let headerOffset = -1;
  const searchLimit = Math.min(bytes.length - 5, 4096);
  for (let i = 0; i <= searchLimit; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d    // -
    ) {
      headerOffset = i;
      break;
    }
  }

  if (headerOffset === -1) {
    throw new Error(
      'The selected file is not a valid PDF document (no PDF header found). Please ensure you have selected a valid .pdf file.'
    );
  }

  // If there were preceding BOM or whitespace bytes, slice starting from %PDF-
  const cleanBytes = headerOffset > 0 ? bytes.subarray(headerOffset) : bytes;

  try {
    return await PDFDocument.load(cleanBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
  } catch (err: any) {
    const msg = err?.message || '';
    if (msg.includes('encrypted') || msg.includes('Password')) {
      throw new Error(
        'This PDF document is password-protected. Please provide an unlocked PDF file.'
      );
    }
    throw new Error(`Failed to parse PDF document: ${msg}`);
  }
}

/**
 * Convert multiple image files/dataURLs into a clean PDF document
 */
export async function imagesToPdf(
  images: Array<{ dataUrl: string; name: string }>,
  options: {
    pageSize?: 'a4' | 'a5' | 'letter' | 'legal' | 'photo4x6' | 'fit';
    orientation?: 'portrait' | 'landscape';
    marginPt?: number;
  } = {}
): Promise<Uint8Array> {
  const { pageSize = 'a4', orientation = 'portrait', marginPt = 20 } = options;
  const pdfDoc = await PDFDocument.create();

  for (const imgItem of images) {
    let activeUrl = imgItem.dataUrl;
    let isPng = activeUrl.startsWith('data:image/png');
    let isJpg =
      activeUrl.startsWith('data:image/jpeg') ||
      activeUrl.startsWith('data:image/jpg');

    // If neither standard PNG nor JPEG (e.g. WebP, GIF, SVG, AVIF), convert to JPEG
    if (!isPng && !isJpg) {
      activeUrl = await rasterizeToJpegDataUrl(activeUrl);
      isJpg = true;
    }

    const base64 = activeUrl.split(',')[1];
    const binary = atob(base64);
    const imageBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      imageBytes[i] = binary.charCodeAt(i);
    }

    let embeddedImage;
    if (isPng) {
      try {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } catch {
        // Fallback: rasterize to JPG
        const fallbackUrl = await rasterizeToJpegDataUrl(activeUrl);
        const fbBase64 = fallbackUrl.split(',')[1];
        const fbBinary = atob(fbBase64);
        const fbBytes = new Uint8Array(fbBinary.length);
        for (let i = 0; i < fbBinary.length; i++) {
          fbBytes[i] = fbBinary.charCodeAt(i);
        }
        embeddedImage = await pdfDoc.embedJpg(fbBytes);
      }
    } else {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let targetWidth: number;
    let targetHeight: number;

    if (pageSize === 'fit') {
      targetWidth = imgWidth + marginPt * 2;
      targetHeight = imgHeight + marginPt * 2;
    } else {
      const config = PDF_PAGE_SIZES[pageSize] || PDF_PAGE_SIZES.a4;
      if (orientation === 'landscape') {
        targetWidth = config.heightPt;
        targetHeight = config.widthPt;
      } else {
        targetWidth = config.widthPt;
        targetHeight = config.heightPt;
      }
    }

    const page = pdfDoc.addPage([targetWidth, targetHeight]);

    // Fit image inside available page area with margins
    const availableW = targetWidth - marginPt * 2;
    const availableH = targetHeight - marginPt * 2;
    const scale = Math.min(availableW / imgWidth, availableH / imgHeight);

    const drawW = imgWidth * scale;
    const drawH = imgHeight * scale;
    const posX = marginPt + (availableW - drawW) / 2;
    const posY = marginPt + (availableH - drawH) / 2;

    page.drawImage(embeddedImage, {
      x: posX,
      y: posY,
      width: drawW,
      height: drawH,
    });
  }

  return await pdfDoc.save();
}

/**
 * Merge multiple PDF files into one combined PDF
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < pdfBuffers.length; i++) {
    const buffer = pdfBuffers[i];
    try {
      const pdf = await safeLoadPdf(buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err: any) {
      throw new Error(`Document #${i + 1} error: ${err.message || 'Failed to read PDF'}`);
    }
  }

  return await mergedPdf.save();
}

/**
 * Parse page range string (e.g. "1, 3-5, 8") to zero-indexed page numbers
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pages.add(p - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Split or extract pages from a PDF
 */
export async function splitPdf(
  pdfBuffer: ArrayBuffer,
  pageIndicesToKeep: number[]
): Promise<Uint8Array> {
  const srcPdf = await safeLoadPdf(pdfBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(srcPdf, pageIndicesToKeep);
  copiedPages.forEach((p) => newPdf.addPage(p));

  return await newPdf.save();
}

/**
 * Rotate pages of a PDF by 90, 180, or 270 degrees
 */
export async function rotatePdf(
  pdfBuffer: ArrayBuffer,
  rotationAngle: 90 | 180 | 270,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const pdf = await safeLoadPdf(pdfBuffer);
  const pages = pdf.getPages();
  const targetIndices = pageIndices || pages.map((_, i) => i);

  for (const idx of targetIndices) {
    if (pages[idx]) {
      const currentRotation = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((currentRotation + rotationAngle) % 360));
    }
  }

  return await pdf.save();
}

/**
 * Add watermark text to every page of a PDF
 */
export async function addPdfWatermark(
  pdfBuffer: ArrayBuffer,
  watermarkText: string,
  options: {
    opacity?: number;
    fontSize?: number;
    angle?: number;
  } = {}
): Promise<Uint8Array> {
  const { opacity = 0.25, fontSize = 50, angle = 45 } = options;
  const pdf = await safeLoadPdf(pdfBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(angle),
    });
  }

  return await pdf.save();
}

/**
 * Read PDF Metadata
 */
export async function getPdfMetadata(pdfBuffer: ArrayBuffer) {
  const pdf = await safeLoadPdf(pdfBuffer);
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle() || 'Not specified',
    author: pdf.getAuthor() || 'Not specified',
    subject: pdf.getSubject() || 'Not specified',
    creator: pdf.getCreator() || 'Not specified',
    producer: pdf.getProducer() || 'Not specified',
    creationDate: pdf.getCreationDate() ? pdf.getCreationDate()?.toLocaleString() : 'Not specified',
    modificationDate: pdf.getModificationDate()
      ? pdf.getModificationDate()?.toLocaleString()
      : 'Not specified',
  };
}

/**
 * Client-side extract selectable text from PDF buffer
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    const decoder = new TextDecoder('utf-8');
    const textContent = decoder.decode(new Uint8Array(pdfBuffer));
    // Simple stream text regex parser for client-side without heavy external worker
    const matches = textContent.match(/\(([^)]+)\)\s*Tj/g) || textContent.match(/\[(.*?)\]\s*TJ/g);
    if (!matches || matches.length === 0) {
      return '';
    }
    const extracted = matches
      .map((m) => m.replace(/[()[\]\s*TjTJ]/g, ''))
      .filter((s) => s.length > 0)
      .join(' ');
    return extracted;
  } catch {
    return '';
  }
}

/**
 * Helper to trigger browser file download for Blob, Uint8Array or data URL
 */
export function downloadFile(
  data: Blob | Uint8Array | string,
  filename: string,
  mimeType = 'application/octet-stream'
) {
  let url: string;
  if (typeof data === 'string') {
    url = data;
  } else if (data instanceof Blob) {
    url = URL.createObjectURL(data);
  } else {
    const blob = new Blob([data as unknown as BlobPart], { type: mimeType });
    url = URL.createObjectURL(blob);
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (typeof data !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
}
