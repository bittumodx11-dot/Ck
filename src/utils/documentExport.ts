import { toCanvas } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from './pdfProcessing';

export type ExportFormat = 'pdf' | 'jpg' | 'jpeg' | 'png';

export interface ExportA4Options {
  filename?: string;
  format: ExportFormat;
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  onProgress?: (status: string) => void;
}

// Standard A4 dimensions in PDF points (72 points per inch)
// 210 mm = 8.2677 inches * 72 = 595.28 points
// 297 mm = 11.6929 inches * 72 = 841.89 points
export const A4_WIDTH_PT = 595.28;
export const A4_HEIGHT_PT = 841.89;
export const A4_RATIO = A4_HEIGHT_PT / A4_WIDTH_PT; // ~1.4142

/**
 * Capture an element using html-to-image with skipFonts=true to eliminate
 * CORS / SecurityError when inlining external stylesheet rules, while preserving
 * full DOM typography, layout, colors, and graphics.
 */
async function captureElementCanvas(
  element: HTMLElement,
  pixelRatio: number,
  backgroundColor: string
): Promise<HTMLCanvasElement> {
  // Ensure all fonts and images in the DOM have loaded
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const isA4Page = element.classList.contains('a4-page');
  const targetWidth = isA4Page ? 794 : (element.offsetWidth || 794);
  const targetHeight = isA4Page ? 1123 : (element.offsetHeight || 1123);

  const baseOptions = {
    pixelRatio,
    backgroundColor,
    cacheBust: false,
    skipFonts: true, // Prevents SecurityError: Cannot access rules on cross-origin CSS links
    width: targetWidth,
    height: targetHeight,
    canvasWidth: Math.round(targetWidth * pixelRatio),
    canvasHeight: Math.round(targetHeight * pixelRatio),
    style: {
      width: `${targetWidth}px`,
      minWidth: `${targetWidth}px`,
      maxWidth: `${targetWidth}px`,
      height: isA4Page ? '1123px' : undefined,
      minHeight: isA4Page ? '1123px' : undefined,
      maxHeight: isA4Page ? '1123px' : undefined,
      boxSizing: 'border-box',
      transform: 'none',
      margin: '0',
    },
    filter: (node: Node) => {
      if (node instanceof HTMLElement && node.classList.contains('no-print')) {
        return false;
      }
      return true;
    },
  };

  try {
    return await toCanvas(element, baseOptions);
  } catch (firstError) {
    console.warn('Standard canvas capture failed, retrying with conservative scale:', firstError);
    try {
      const conservativeRatio = Math.min(pixelRatio, 1.5);
      return await toCanvas(element, {
        ...baseOptions,
        pixelRatio: conservativeRatio,
        canvasWidth: Math.round(targetWidth * conservativeRatio),
        canvasHeight: Math.round(targetHeight * conservativeRatio),
      });
    } catch (secondError) {
      console.warn('Second attempt failed, final retry with pixelRatio 1:', secondError);
      return await toCanvas(element, {
        ...baseOptions,
        pixelRatio: 1,
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
      });
    }
  }
}

/**
 * Capture an HTML DOM element and export it as an exact A4 PDF, JPG, or JPEG file.
 */
export async function exportElementToA4(
  element: HTMLElement,
  options: ExportA4Options
): Promise<void> {
  const {
    filename = 'document',
    format,
    scale = 2,
    quality = 0.95,
    backgroundColor = '#ffffff',
    onProgress,
  } = options;

  try {
    const cleanBaseName = filename.replace(/\.(pdf|jpg|jpeg)$/i, '');

    // Check if the element contains multiple explicit A4 pages (.a4-page)
    const distinctPages = Array.from(element.querySelectorAll<HTMLElement>('.a4-page'));

    if (distinctPages.length > 0) {
      // Exporting multiple designated A4 pages cleanly
      if (format === 'jpg' || format === 'jpeg' || format === 'png') {
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const fileExt = format === 'jpeg' ? 'jpeg' : format === 'png' ? 'png' : 'jpg';

        for (let i = 0; i < distinctPages.length; i++) {
          onProgress?.(`Capturing page ${i + 1} of ${distinctPages.length}...`);
          const pageCanvas = await captureElementCanvas(distinctPages[i], scale, backgroundColor);
          const pageDataUrl = format === 'png' ? pageCanvas.toDataURL(mimeType) : pageCanvas.toDataURL(mimeType, quality);
          const pageName = distinctPages.length > 1 ? `${cleanBaseName}_page_${i + 1}` : cleanBaseName;
          downloadFile(pageDataUrl, `${pageName}.${fileExt}`, mimeType);
        }
        onProgress?.('Download complete!');
        return;
      }

      if (format === 'pdf') {
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < distinctPages.length; i++) {
          onProgress?.(`Rendering page ${i + 1} of ${distinctPages.length}...`);
          const pageCanvas = await captureElementCanvas(distinctPages[i], scale, backgroundColor);

          const jpegDataUrl = pageCanvas.toDataURL('image/jpeg', quality);
          const base64Data = jpegDataUrl.split(',')[1];
          const pageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const embeddedImg = await pdfDoc.embedJpg(pageBytes);

          const pdfPage = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

          // Render exact A4 page without cutting
          const renderHeight = Math.min(
            A4_HEIGHT_PT,
            (pageCanvas.height / pageCanvas.width) * A4_WIDTH_PT
          );

          pdfPage.drawImage(embeddedImg, {
            x: 0,
            y: A4_HEIGHT_PT - renderHeight,
            width: A4_WIDTH_PT,
            height: renderHeight,
          });
        }

        onProgress?.('Saving multi-page A4 PDF...');
        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, `${cleanBaseName}.pdf`, 'application/pdf');
        onProgress?.('Download complete!');
        return;
      }
    }

    // Single DOM element capture fallback
    onProgress?.('Preparing high-resolution render...');
    const canvas = await captureElementCanvas(element, scale, backgroundColor);

    onProgress?.(`Generating ${format.toUpperCase()} file...`);

    if (format === 'jpg' || format === 'jpeg' || format === 'png') {
      // Export as JPG / JPEG / PNG image
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const fileExt = format === 'jpeg' ? 'jpeg' : format === 'png' ? 'png' : 'jpg';

      try {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              downloadFile(blob, `${cleanBaseName}.${fileExt}`, mimeType);
            } else {
              const dataUrl = format === 'png' ? canvas.toDataURL(mimeType) : canvas.toDataURL(mimeType, quality);
              downloadFile(dataUrl, `${cleanBaseName}.${fileExt}`, mimeType);
            }
            onProgress?.('Download complete!');
          },
          mimeType,
          format === 'png' ? undefined : quality
        );
      } catch {
        const dataUrl = format === 'png' ? canvas.toDataURL(mimeType) : canvas.toDataURL(mimeType, quality);
        downloadFile(dataUrl, `${cleanBaseName}.${fileExt}`, mimeType);
        onProgress?.('Download complete!');
      }
      return;
    }

    if (format === 'pdf') {
      // Export as Standard A4 Page PDF
      const pdfDoc = await PDFDocument.create();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pageHeightInCanvasPx = Math.floor(imgWidth * A4_RATIO);

      // Check if it fits on a single A4 page or needs multiple pages
      if (imgHeight <= pageHeightInCanvasPx * 1.08) {
        // Fits on a single A4 page
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = jpegDataUrl.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const embeddedImg = await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

        // Fit proportionally within A4 boundaries
        const renderWidth = A4_WIDTH_PT;
        const renderHeight = (imgHeight / imgWidth) * A4_WIDTH_PT;

        page.drawImage(embeddedImg, {
          x: 0,
          y: A4_HEIGHT_PT - renderHeight,
          width: renderWidth,
          height: renderHeight,
        });
      } else {
        // Multi-page A4 document: Use smart slicing with slight overlap guard to avoid mid-line cuts
        let currentY = 0;
        let pageIndex = 1;

        while (currentY < imgHeight) {
          onProgress?.(`Formatting A4 page ${pageIndex}...`);

          const sliceHeight = Math.min(pageHeightInCanvasPx, imgHeight - currentY);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = pageHeightInCanvasPx;

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              currentY,
              imgWidth,
              sliceHeight,
              0,
              0,
              imgWidth,
              sliceHeight
            );
          }

          const pageDataUrl = pageCanvas.toDataURL('image/jpeg', quality);
          const base64Data = pageDataUrl.split(',')[1];
          const pageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const embeddedSlice = await pdfDoc.embedJpg(pageBytes);

          const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);
          page.drawImage(embeddedSlice, {
            x: 0,
            y: 0,
            width: A4_WIDTH_PT,
            height: A4_HEIGHT_PT,
          });

          currentY += pageHeightInCanvasPx;
          pageIndex++;
        }
      }

      onProgress?.('Saving A4 PDF file...');
      const pdfBytes = await pdfDoc.save();
      downloadFile(pdfBytes, `${cleanBaseName}.pdf`, 'application/pdf');
      onProgress?.('Download complete!');
    }
  } catch (error) {
    console.error('Failed to export A4 document:', error);
    throw error;
  }
}
