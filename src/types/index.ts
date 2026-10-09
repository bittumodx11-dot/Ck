export type ToolCategory =
  | 'image'
  | 'resize'
  | 'passport'
  | 'photo-studio'
  | 'pdf'
  | 'document'
  | 'id-card'
  | 'biodata'
  | 'other';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  icon: string;
  popular?: boolean;
  featured?: boolean;
  status: 'active' | 'beta';
  acceptedFormats: string[];
  tags: string[];
  badge?: string;
}

export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  boardUniversity: string;
  year: string;
  percentageGrade: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
  enabled: boolean;
}

export interface BiodataFieldItem {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
  isCustom?: boolean;
}

export interface BiodataSectionItem {
  id: string;
  title: string;
  enabled: boolean;
  type:
    | 'personal'
    | 'education'
    | 'experience'
    | 'skills'
    | 'languages'
    | 'family'
    | 'about'
    | 'hobbies'
    | 'student'
    | 'custom';
  content?: string;
}

export interface LanguageProficiency {
  id: string;
  language: string;
  reading: boolean;
  writing: boolean;
  speaking: boolean;
}

export interface BiodataData {
  language: 'en' | 'bn' | 'hi';
  documentType:
    | 'biodata'
    | 'cv'
    | 'curriculum-vitae'
    | 'resume'
    | 'marriage-biodata'
    | 'personal-biodata'
    | 'student-biodata'
    | 'job-cv'
    | 'custom';
  template: string;
  documentId?: string;
  documentName?: string;
  lastModified?: number;

  // Header / Title Customization
  documentTitle: string;
  showDocumentTitle: boolean;
  subtitle: string;
  sacredHeader?: string;
  titleFont: string;
  titleSize: number;
  titleColor: string;
  titleBold: boolean;
  titleItalic: boolean;
  titleUnderline: boolean;
  titleLetterSpacing: number;
  titleCase: 'uppercase' | 'lowercase' | 'capitalize' | 'normal';
  titleAlignment: 'left' | 'center' | 'right';
  titleDecoration: 'bottom-border' | 'top-border' | 'double-border' | 'divider-line' | 'none';
  headerLayout: 'center' | 'left' | 'photo-left' | 'photo-right' | 'custom';
  headerStyle?: 'standard' | 'banner' | 'clean' | 'split' | 'card' | 'traditional';
  borderStyle?: 'none' | 'thin' | 'double' | 'ornate' | 'vintage' | 'royal';

  // Profile Photo Customization
  photoUrl: string | null;
  photoShape: 'square' | 'rectangle' | 'circle' | 'rounded';
  photoBorder: 'none' | 'thin' | 'medium' | 'thick';
  photoBorderColor: string;
  photoAlignment: 'left' | 'center' | 'right';
  photoWidth: number;
  photoHeight: number;
  photoZoom: number;
  photoRotation: number;
  
  // Personal Info Fields (Fully dynamic, customizable, reorderable)
  personalFields: BiodataFieldItem[];
  infoLayoutStyle: 'colon' | 'grid' | 'card';
  
  // Sections Management
  sections: BiodataSectionItem[];
  
  // Dynamic Section Content
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  skillsDisplayStyle: 'tags' | 'bullets' | 'comma' | 'simple';
  languagesDetailed: LanguageProficiency[];
  
  // Family Info (Marriage / General)
  familyFields: BiodataFieldItem[];
  aboutFamily: string;
  
  // Student Specific
  studentFields: BiodataFieldItem[];

  // About & Hobbies
  aboutMe: string;
  hobbies: string;
  hobbiesStyle: 'text' | 'bullets' | 'tags';
  
  // Styling & Typography
  fontFamily:
    | 'plus-jakarta'
    | 'inter'
    | 'roboto'
    | 'poppins'
    | 'merriweather'
    | 'playfair'
    | 'garamond'
    | 'montserrat'
    | 'lato'
    | 'open-sans'
    | 'serif'
    | 'sans'
    | 'bangla'
    | 'bangla-serif'
    | 'hindi'
    | 'hindi-serif';
  fontScale?: 'compact' | 'standard' | 'large';
  pageDensity?: 'comfortable' | 'standard' | 'compact' | 'ultra-compact';
  autoFitOnePage?: boolean;
  pageLayout?: '1-page' | '2-pages' | 'auto';
  sectionTitleColor: string;
  sectionTitleSize: number;
  sectionTitleStyle: 'underline' | 'badge' | 'line' | 'background' | 'plain';
  bodyTextColor: string;
  accentColor: string;
  backgroundColor: string;
  pageMargins: 'narrow' | 'normal' | 'wide';
  pageNumbering: 'none' | 'bottom-center' | 'bottom-right' | 'bottom-left';

  // Declaration & Mandatory Bottom Section (PRD #55, #56)
  includeDeclaration: boolean;
  declarationText: string;
  place: string;
  date: string;
  showDate: boolean;
  signatureUrl: string | null;
  signatureType: 'draw' | 'upload' | 'type';
  signatureText: string;
  applicantName: string;
  showApplicantName: boolean;
  signatureAlignment: 'left' | 'center' | 'right';
  signatureLayout: 'split' | 'stacked';
}

export interface ResumeData {
  template: 'modern' | 'professional' | 'simple';
  fontFamily?:
    | 'plus-jakarta'
    | 'inter'
    | 'roboto'
    | 'poppins'
    | 'merriweather'
    | 'playfair'
    | 'garamond'
    | 'montserrat'
    | 'lato'
    | 'open-sans'
    | 'bangla'
    | 'bangla-serif';
  fontScale?: 'compact' | 'standard' | 'large';
  pageDensity?: 'comfortable' | 'standard' | 'compact' | 'ultra-compact';
  autoFitOnePage?: boolean;
  pageLayout?: '1-page' | '2-pages' | 'auto';
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  photoUrl: string | null;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  languages: string[];
  certifications: string[];
}
