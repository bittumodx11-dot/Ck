export interface FontOption {
  id: string;
  name: string;
  bengaliName: string;
  category: 'Sans-Serif' | 'Serif' | 'Bengali' | 'Decorative';
  tag: string;
  cssFamily: string;
  sampleText: string;
}

export const PROFESSIONAL_FONTS: FontOption[] = [
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    bengaliName: 'প্লাস জাকার্তা সান্স',
    category: 'Sans-Serif',
    tag: 'Executive & Tech',
    cssFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    sampleText: 'Professional Resume & Modern Biodata',
  },
  {
    id: 'inter',
    name: 'Inter',
    bengaliName: 'ইন্টার',
    category: 'Sans-Serif',
    tag: 'Clean ATS Standard',
    cssFamily: "'Inter', system-ui, sans-serif",
    sampleText: 'High Readability & Precision Profile',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    bengaliName: 'রোবোটো',
    category: 'Sans-Serif',
    tag: 'Corporate Classic',
    cssFamily: "'Roboto', system-ui, sans-serif",
    sampleText: 'Standard Corporate Engineering Profile',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    bengaliName: 'পপিন্স',
    category: 'Sans-Serif',
    tag: 'Geometric & Elegant',
    cssFamily: "'Poppins', system-ui, sans-serif",
    sampleText: 'Modern Aesthetic & Creative Clarity',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    bengaliName: 'মন্টসেরাট',
    category: 'Sans-Serif',
    tag: 'Contemporary Bold',
    cssFamily: "'Montserrat', system-ui, sans-serif",
    sampleText: 'Confident Leadership & Presentation',
  },
  {
    id: 'lato',
    name: 'Lato',
    bengaliName: 'লাতো',
    category: 'Sans-Serif',
    tag: 'Warm Corporate',
    cssFamily: "'Lato', system-ui, sans-serif",
    sampleText: 'Warm, Balanced & Trustworthy Style',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    bengaliName: 'ওপেন সান্স',
    category: 'Sans-Serif',
    tag: 'Universal Clarity',
    cssFamily: "'Open Sans', system-ui, sans-serif",
    sampleText: 'Neutral, Crisp & Clean Readability',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    bengaliName: 'মেরিওয়েদার',
    category: 'Serif',
    tag: 'Editorial & Academic',
    cssFamily: "'Merriweather', Georgia, serif",
    sampleText: 'Authoritative & Sophisticated Editorial',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    bengaliName: 'প্লেফেয়ার ডিসপ্লে',
    category: 'Serif',
    tag: 'Luxury & Heritage',
    cssFamily: "'Playfair Display', Georgia, serif",
    sampleText: 'Prestigious & Classic Traditional Profile',
  },
  {
    id: 'garamond',
    name: 'EB Garamond',
    bengaliName: 'ইবি গ্যারামন্ড',
    category: 'Serif',
    tag: 'Classic Legal & Academic',
    cssFamily: "'EB Garamond', 'Times New Roman', Georgia, serif",
    sampleText: 'Scholarly, Legal & Timeless Elegance',
  },
  {
    id: 'bangla',
    name: 'Hind Siliguri',
    bengaliName: 'হিন্দ শিলিগুড়ি (বাংলা আধুনিক)',
    category: 'Bengali',
    tag: 'বাংলা আধুনিক সান্স',
    cssFamily: "'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif",
    sampleText: 'জীবনবৃত্তান্ত ও প্রফেশনাল বায়োডাটা',
  },
  {
    id: 'bangla-serif',
    name: 'Noto Serif Bengali',
    bengaliName: 'নোটো সেরিফ (বাংলা ক্লাসিক্যাল)',
    category: 'Bengali',
    tag: 'বাংলা ক্লাসিক্যাল সেরিফ',
    cssFamily: "'Noto Serif Bengali', 'Hind Siliguri', Georgia, serif",
    sampleText: 'ঐতিহ্যবাহী ও রাজকীয় বাংলা বায়োডাটা',
  },
  {
    id: 'hindi',
    name: 'Noto Sans Devanagari',
    bengaliName: 'হিন্দি দেবনাগরী সান্স',
    category: 'Bengali',
    tag: 'हिंदी आधुनिक फॉन्ट',
    cssFamily: "'Noto Sans Devanagari', 'Poppins', system-ui, sans-serif",
    sampleText: 'व्यावसायिक एवं पारिवारिक बायोडाटा',
  },
  {
    id: 'hindi-serif',
    name: 'Noto Serif Devanagari',
    bengaliName: 'হিন্দি দেবনাগরী সেরিফ',
    category: 'Bengali',
    tag: 'हिंदी क्लासिकल सेरिफ',
    cssFamily: "'Noto Serif Devanagari', Georgia, serif",
    sampleText: 'पारंपरिक एवं सुरुचिपूर्ण बायोडाटा',
  },
];

export function getCssFontFamily(fontId?: string): string {
  const match = PROFESSIONAL_FONTS.find((f) => f.id === fontId);
  if (match) return match.cssFamily;

  if (fontId === 'serif') return "'EB Garamond', 'Times New Roman', Georgia, serif";
  if (fontId === 'sans') return "'Inter', system-ui, sans-serif";
  if (fontId === 'bangla') return "'Hind Siliguri', system-ui, sans-serif";
  if (fontId === 'hindi') return "'Noto Sans Devanagari', 'Poppins', system-ui, sans-serif";
  if (fontId === 'hindi-serif') return "'Noto Serif Devanagari', Georgia, serif";

  return "'Plus Jakarta Sans', system-ui, sans-serif";
}
