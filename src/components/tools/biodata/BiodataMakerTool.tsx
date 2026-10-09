import React, { useState, useEffect, useRef } from 'react';
import {
  BiodataData,
  BiodataFieldItem,
  BiodataSectionItem,
  EducationEntry,
  ExperienceEntry,
  LanguageProficiency,
} from '../../../types';
import { banglaTranslations } from '../../../data/banglaTranslations';
import { downloadFile } from '../../../utils/pdfProcessing';
import { DocumentExportBar } from './DocumentExportBar';
import { A4DocumentReviewWorkbench } from './A4DocumentReviewWorkbench';
import { PROFESSIONAL_FONTS, getCssFontFamily } from '../../../utils/fontConstants';
import {
  paginateBiodataData,
  MULTI_PAGE_REGRESSION_TEST_BIODATA,
} from '../../../utils/documentPagination';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  PenTool,
  Upload,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings,
  Layers,
  Palette,
  Check,
  Undo2,
  Redo2,
  RefreshCw,
  FileText,
  Heart,
  GraduationCap,
  Briefcase,
  User,
  Sliders,
  Type,
  Maximize2,
  ShieldCheck,
  Users,
  X,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';

const STORAGE_KEY = 'snapdoc_custom_biodata_draft';

// Default standard personal fields
const DEFAULT_PERSONAL_FIELDS: BiodataFieldItem[] = [
  { id: 'fullName', label: 'Full Name', value: 'Bittu Khan', enabled: true },
  { id: 'fatherName', label: "Father's Name", value: 'Shamsher Khan', enabled: true },
  { id: 'motherName', label: "Mother's Name", value: 'Fatema Khan', enabled: true },
  { id: 'dob', label: 'Date of Birth', value: '1999-05-18', enabled: true },
  { id: 'gender', label: 'Gender', value: 'Male', enabled: true },
  { id: 'maritalStatus', label: 'Marital Status', value: 'Unmarried', enabled: true },
  { id: 'nationality', label: 'Nationality', value: 'Indian', enabled: true },
  { id: 'religion', label: 'Religion', value: 'Islam', enabled: true },
  { id: 'bloodGroup', label: 'Blood Group', value: 'O+', enabled: true },
  { id: 'phone', label: 'Phone Number', value: '+91 7719254662', enabled: true },
  { id: 'email', label: 'Email Address', value: 'sssk46981@gmail.com', enabled: true },
  { id: 'address', label: 'Address', value: 'Park Street, Kolkata, WB - 700016', enabled: true },
];

// Default sections with custom titles
const DEFAULT_SECTIONS: BiodataSectionItem[] = [
  { id: 'personal', title: 'PERSONAL DETAILS', enabled: true, type: 'personal' },
  { id: 'education', title: 'EDUCATIONAL QUALIFICATIONS', enabled: true, type: 'education' },
  { id: 'experience', title: 'WORK EXPERIENCE', enabled: true, type: 'experience' },
  { id: 'skills', title: 'KEY SKILLS', enabled: true, type: 'skills' },
  { id: 'languages', title: 'LANGUAGES KNOWN', enabled: true, type: 'languages' },
  { id: 'family', title: 'FAMILY BACKGROUND', enabled: false, type: 'family' },
  { id: 'about', title: 'ABOUT ME', enabled: true, type: 'about' },
  { id: 'hobbies', title: 'HOBBIES & INTERESTS', enabled: true, type: 'hobbies' },
];

const INITIAL_STATE: BiodataData = {
  language: 'en',
  documentType: 'curriculum-vitae',
  template: 'classic',

  // Header / Title Customization
  documentTitle: 'CURRICULUM VITAE',
  showDocumentTitle: true,
  subtitle: 'Personal & Professional Profile',
  titleFont: 'Plus Jakarta Sans',
  titleSize: 22,
  titleColor: '#0f172a',
  titleBold: true,
  titleItalic: false,
  titleUnderline: false,
  titleLetterSpacing: 2,
  titleCase: 'uppercase',
  titleAlignment: 'center',
  titleDecoration: 'bottom-border',
  headerLayout: 'center',

  // Photo
  photoUrl: null,
  photoShape: 'rounded',
  photoBorder: 'thin',
  photoBorderColor: '#cbd5e1',
  photoAlignment: 'right',
  photoWidth: 105,
  photoHeight: 135,
  photoZoom: 1,
  photoRotation: 0,

  // Personal Info
  personalFields: DEFAULT_PERSONAL_FIELDS,
  infoLayoutStyle: 'colon',

  // Sections
  sections: DEFAULT_SECTIONS,

  // Education
  education: [
    {
      id: 'edu1',
      qualification: 'B.Tech in Computer Science',
      institution: 'Heritage Institute of Technology',
      boardUniversity: 'MAKAUT',
      year: '2021',
      percentageGrade: '8.7 CGPA',
    },
    {
      id: 'edu2',
      qualification: 'Higher Secondary (10+2)',
      institution: 'St. Xavier’s Collegiate School',
      boardUniversity: 'WBCHSE',
      year: '2017',
      percentageGrade: '88.6%',
    },
    {
      id: 'edu3',
      qualification: 'Secondary Examination (10th)',
      institution: 'St. Xavier’s Collegiate School',
      boardUniversity: 'WBBSE',
      year: '2015',
      percentageGrade: '91.2%',
    },
  ],

  // Experience
  experience: [
    {
      id: 'exp1',
      company: 'Apex Digital Solutions',
      position: 'Senior Software Engineer',
      startDate: '2022',
      endDate: 'Present',
      description: 'Developing high-speed client-side utility applications and React architectures.',
    },
  ],

  // Skills
  skills: ['Full Stack Development', 'React / TypeScript', 'Tailwind CSS', 'Problem Solving', 'Git'],
  skillsDisplayStyle: 'tags',

  // Languages
  languagesDetailed: [
    { id: 'l1', language: 'English', reading: true, writing: true, speaking: true },
    { id: 'l2', language: 'Bengali (বাংলা)', reading: true, writing: true, speaking: true },
    { id: 'l3', language: 'Hindi', reading: true, writing: false, speaking: true },
  ],

  // Family details
  familyFields: [
    { id: 'f1', label: "Father's Occupation", value: 'Business Owner', enabled: true },
    { id: 'f2', label: "Mother's Occupation", value: 'Homemaker', enabled: true },
    { id: 'f3', label: 'Siblings', value: '1 Elder Brother (Married)', enabled: true },
    { id: 'f4', label: 'Family Status', value: 'Upper Middle Class', enabled: true },
  ],
  aboutFamily: 'Respectable and culturally cultured family settled in Kolkata.',

  studentFields: [
    { id: 's1', label: 'Class / Grade', value: 'Standard XII', enabled: true },
    { id: 's2', label: 'School Name', value: 'St. Xavier’s Collegiate School', enabled: true },
    { id: 's3', label: 'Roll Number', value: '18', enabled: true },
    { id: 's4', label: 'Registration No.', value: 'REG-2024-99812', enabled: true },
  ],

  aboutMe:
    'Dedicated and ambitious professional with high ethical standards, strong problem-solving abilities, and commitment to excellence.',
  hobbies: 'Reading literature, coding web utilities, playing chess, travel photography',
  hobbiesStyle: 'tags',

  // Styling
  fontFamily: 'plus-jakarta',
  fontScale: 'standard',
  pageDensity: 'compact',
  autoFitOnePage: true,
  pageLayout: 'auto',
  sectionTitleColor: '#1e1b4b',
  sectionTitleSize: 13,
  sectionTitleStyle: 'underline',
  bodyTextColor: '#1e293b',
  accentColor: '#4f46e5',
  backgroundColor: '#ffffff',
  pageMargins: 'normal',
  pageNumbering: 'bottom-center',

  // Mandatory bottom section (PRD #55, #56, #20)
  includeDeclaration: true,
  declarationText:
    'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.',
  place: 'Kolkata',
  date: new Date().toLocaleDateString('en-GB'),
  showDate: true,
  signatureUrl: null,
  signatureType: 'type',
  signatureText: 'Bittu Khan',
  applicantName: 'Bittu Khan',
  showApplicantName: true,
  signatureAlignment: 'right',
  signatureLayout: 'split',
};

export const BiodataMakerTool: React.FC = () => {
  // Master state with deep merge for safe loading from localStorage
  const [data, setData] = useState<BiodataData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          personalFields: parsed.personalFields || INITIAL_STATE.personalFields,
          familyFields: parsed.familyFields || INITIAL_STATE.familyFields,
          education: parsed.education || INITIAL_STATE.education,
          experience: parsed.experience || INITIAL_STATE.experience,
          skills: parsed.skills || INITIAL_STATE.skills,
          languagesDetailed: parsed.languagesDetailed || INITIAL_STATE.languagesDetailed,
          sections: parsed.sections || INITIAL_STATE.sections,
        };
      }
    } catch {}
    return INITIAL_STATE;
  });

  // Undo / Redo History stack (PRD #32)
  const [history, setHistory] = useState<BiodataData[]>(() => [data]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active settings tab
  const [activeTab, setActiveTab] = useState<
    | 'doc-type'
    | 'header'
    | 'photo'
    | 'personal'
    | 'family'
    | 'sections'
    | 'education'
    | 'experience'
    | 'skills'
    | 'about'
    | 'signature'
    | 'design'
  >('doc-type');

  // Interactive inputs for quickly adding skills, languages, and hobbies
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [newLanguageInput, setNewLanguageInput] = useState<string>('');
  const [newHobbyInput, setNewHobbyInput] = useState<string>('');

  // Mobile view switcher ('editor' vs 'preview')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Refs
  const previewDocRef = useRef<HTMLDivElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingSig = useRef(false);

  // Auto-save draft in LocalStorage (PRD #33)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus('Draft auto-saved');
      const timer = setTimeout(() => setSaveStatus(''), 2000);
      return () => clearTimeout(timer);
    } catch {}
  }, [data]);

  // Pure immutable state updater
  const updateData = (updater: (prev: BiodataData) => BiodataData) => {
    setData((prev) => updater(prev));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setData(history[historyIndex + 1]);
    }
  };

  const handleResetDocument = () => {
    if (confirm('Reset entire document to initial state? Any unsaved edits will be cleared.')) {
      setData(INITIAL_STATE);
      setHistory([INITIAL_STATE]);
      setHistoryIndex(0);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Preset switchers
  const selectDocumentType = (type: BiodataData['documentType']) => {
    updateData((prev) => {
      let title = prev.documentTitle;
      let subtitle = prev.subtitle;
      let template = prev.template;

      switch (type) {
        case 'biodata':
          title = prev.language === 'bn' ? 'বায়োডাটা' : 'BIODATA';
          subtitle = 'Personal & Family Profile';
          break;
        case 'cv':
          title = 'CURRICULUM VITAE';
          subtitle = 'Professional Profile';
          break;
        case 'curriculum-vitae':
          title = 'CURRICULUM VITAE / BIODATA';
          subtitle = 'Educational & Professional Details';
          break;
        case 'resume':
          title = 'RESUME';
          subtitle = 'Professional Summary & Experience';
          break;
        case 'marriage-biodata':
          title = prev.language === 'bn' ? 'বিবাহের বায়োডাটা' : 'MARRIAGE BIODATA';
          subtitle = 'Personal & Family Background';
          template = 'marriage';
          break;
        case 'student-biodata':
          title = prev.language === 'bn' ? 'ছাত্র / ছাত্রীর পরিচিতি' : 'STUDENT BIODATA';
          subtitle = 'Academic Details & Personal Information';
          template = 'student';
          break;
        case 'personal-biodata':
          title = prev.language === 'bn' ? 'ব্যক্তিগত পরিচিতি' : 'PERSONAL BIODATA';
          subtitle = 'Personal Background';
          break;
        case 'custom':
          title = 'CUSTOM DOCUMENT';
          break;
      }

      // Automatically enable relevant sections for Marriage / Student
      const sections = prev.sections.map((s) => {
        if (type === 'marriage-biodata' && s.id === 'family') return { ...s, enabled: true };
        if (type === 'student-biodata' && s.id === 'experience') return { ...s, enabled: false };
        return s;
      });

      return {
        ...prev,
        documentType: type,
        documentTitle: title,
        subtitle,
        template,
        sections,
      };
    });
  };

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        updateData((p) => ({ ...p, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        updateData((p) => ({
          ...p,
          signatureUrl: reader.result as string,
          signatureType: 'upload',
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Signature canvas
  const startSigDraw = (e: React.PointerEvent) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    isDrawingSig.current = true;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSig = (e: React.PointerEvent) => {
    if (!isDrawingSig.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endSigDraw = () => {
    if (!isDrawingSig.current) return;
    isDrawingSig.current = false;
    const canvas = sigCanvasRef.current;
    if (canvas) {
      updateData((p) => ({
        ...p,
        signatureUrl: canvas.toDataURL(),
        signatureType: 'draw',
      }));
    }
  };

  const clearSigDraw = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateData((p) => ({ ...p, signatureUrl: null }));
    }
  };

  // Section reorder helpers
  const moveSection = (idx: number, dir: 'up' | 'down') => {
    updateData((p) => {
      const copy = [...p.sections];
      const target = dir === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= copy.length) return p;
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return { ...p, sections: copy };
    });
  };

  // Custom Personal Field Adder (Immediate, no prompt!)
  const addCustomPersonalField = (label = 'Custom Field', value = '') => {
    const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    updateData((p) => ({
      ...p,
      personalFields: [
        ...p.personalFields,
        {
          id: newId,
          label: label.trim(),
          value: value.trim(),
          enabled: true,
          isCustom: true,
        },
      ],
    }));
  };

  // Custom Section Adder (Immediate, no prompt!)
  const addCustomSection = (title = 'NEW SECTION') => {
    const newId = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const secTitle = title.trim().toUpperCase();
    updateData((p) => ({
      ...p,
      sections: [
        ...p.sections,
        {
          id: newId,
          title: secTitle,
          enabled: true,
          type: 'custom',
          content: '',
        },
      ],
    }));
  };

  // Family Detail Adder (Immediate, no prompt!)
  const addFamilyField = (label = 'Family Detail', value = '') => {
    const newId = `fam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'family' ? { ...s, enabled: true } : s
      );
      return {
        ...p,
        sections: updatedSections,
        familyFields: [
          ...(p.familyFields || []),
          {
            id: newId,
            label: label.trim(),
            value: value.trim(),
            enabled: true,
            isCustom: true,
          },
        ],
      };
    });
  };

  // Education Entry Adder
  const addEducationRow = (qualification = '', institution = '', year = '', percentageGrade = '', boardUniversity = '') => {
    const newId = `edu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'education' ? { ...s, enabled: true } : s
      );
      return {
        ...p,
        sections: updatedSections,
        education: [
          ...p.education,
          {
            id: newId,
            qualification,
            institution,
            boardUniversity,
            year,
            percentageGrade,
          },
        ],
      };
    });
  };

  // Work Experience Adder
  const addExperienceRow = (position = '', company = '', startDate = '', endDate = '', description = '') => {
    const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'experience' ? { ...s, enabled: true } : s
      );
      return {
        ...p,
        sections: updatedSections,
        experience: [
          ...p.experience,
          {
            id: newId,
            company,
            position,
            startDate,
            endDate,
            description,
          },
        ],
      };
    });
  };

  // Skill Adder & Remover
  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'skills' ? { ...s, enabled: true } : s
      );
      if (p.skills.includes(trimmed)) {
        return {
          ...p,
          sections: updatedSections,
        };
      }
      return {
        ...p,
        sections: updatedSections,
        skills: [...p.skills, trimmed],
      };
    });
  };

  const removeSkill = (skillName: string) => {
    updateData((p) => ({
      ...p,
      skills: p.skills.filter((s) => s !== skillName),
    }));
  };

  // Language Adder & Remover
  const addLanguage = (langName = 'New Language') => {
    const newId = `lang_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'languages' ? { ...s, enabled: true } : s
      );
      return {
        ...p,
        sections: updatedSections,
        languagesDetailed: [
          ...(p.languagesDetailed || []),
          {
            id: newId,
            language: langName.trim(),
            reading: true,
            writing: true,
            speaking: true,
          },
        ],
      };
    });
  };

  const removeLanguage = (langId: string) => {
    updateData((p) => ({
      ...p,
      languagesDetailed: (p.languagesDetailed || []).filter((l) => l.id !== langId),
    }));
  };

  // Hobby Adder & Remover
  const addHobby = (hobbyName: string) => {
    const trimmed = hobbyName.trim();
    if (!trimmed) return;
    updateData((p) => {
      const updatedSections = p.sections.map((s) =>
        s.type === 'hobbies' ? { ...s, enabled: true } : s
      );
      const existing = p.hobbies
        ? p.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
        : [];
      if (existing.includes(trimmed)) {
        return {
          ...p,
          sections: updatedSections,
        };
      }
      return {
        ...p,
        sections: updatedSections,
        hobbies: [...existing, trimmed].join(', '),
      };
    });
  };

  const removeHobby = (hobbyName: string) => {
    updateData((p) => {
      const existing = p.hobbies
        ? p.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
        : [];
      return {
        ...p,
        hobbies: existing.filter((h) => h !== hobbyName.trim()).join(', '),
      };
    });
  };

  // Clean Print
  const handlePrint = () => {
    window.print();
  };

  // Text case formatter helper
  const formatTextCase = (text: string, c: BiodataData['titleCase']) => {
    if (!text) return '';
    switch (c) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
      case 'normal':
      default:
        return text;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Preset Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() =>
                updateData((p) => ({
                  ...p,
                  language: 'en',
                  documentTitle: p.documentTitle === 'জীবন বৃত্তান্ত' ? 'CURRICULUM VITAE' : p.documentTitle,
                }))
              }
              className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                data.language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() =>
                updateData((p) => ({
                  ...p,
                  language: 'bn',
                  fontFamily: 'bangla',
                  documentTitle: 'জীবন বৃত্তান্ত',
                }))
              }
              className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                data.language === 'bn'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              বাংলা (Bengali)
            </button>
          </div>

          {/* Undo / Redo / Reset */}
          <div className="flex items-center gap-1 border-l pl-2 border-slate-200 dark:border-slate-700">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetDocument}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              title="Reset Document"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Regression Test Button */}
          <button
            onClick={() => {
              setData((prev) => ({
                ...prev,
                ...MULTI_PAGE_REGRESSION_TEST_BIODATA,
              }));
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Load Multi-Page Test Document to verify zero text clipping across pages"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>⚡ Test Multi-Page Doc</span>
          </button>

          {/* Save Draft manual button */}
          <button
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                setSaveStatus('Draft saved!');
                setTimeout(() => setSaveStatus(''), 2500);
              } catch {}
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            title="Save draft to browser storage"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Save Draft</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetDocument}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/40 text-slate-500 font-semibold text-xs transition-colors cursor-pointer"
            title="Reset to default document"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {saveStatus && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}

          {/* Mobile view toggle */}
          <div className="lg:hidden flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setMobileView('editor')}
              className={`py-1 px-2.5 rounded-lg font-semibold ${
                mobileView === 'editor' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`py-1 px-2.5 rounded-lg font-semibold ${
                mobileView === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Live Preview
            </button>
          </div>

          {/* Action Buttons: A4 PDF, JPG, JPEG download */}
          <DocumentExportBar
            getDocumentElement={() => previewDocRef.current}
            baseFilename={`${
              data.personalFields.find((f) => f.id === 'fullName')?.value ||
              data.applicantName ||
              'Biodata'
            }_Biodata`}
            documentTitle={data.documentTitle}
          />
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SETTINGS PANEL (PRD #30) */}
        <div
          className={`no-print lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {[
              { id: 'doc-type', label: '1. Doc Type', icon: FileText },
              { id: 'header', label: '2. Title & Header', icon: Type },
              { id: 'photo', label: '3. Photo', icon: User },
              { id: 'personal', label: '4. Personal Info', icon: Sliders },
              { id: 'family', label: '5. Family Details', icon: Users },
              { id: 'sections', label: '6. Sections & Order', icon: Layers },
              { id: 'education', label: '7. Education', icon: GraduationCap },
              { id: 'experience', label: '8. Experience', icon: Briefcase },
              { id: 'skills', label: '9. Skills & Lang', icon: Sparkles },
              { id: 'about', label: '10. About & Hobbies', icon: Heart },
              { id: 'signature', label: '11. Sign & Date', icon: PenTool },
              { id: 'design', label: '12. Fonts & Style', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-1.5 px-2.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Document Type (PRD #1) */}
          {activeTab === 'doc-type' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Select Base Document Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'biodata', label: 'Biodata', desc: 'General & Job Formats' },
                    { id: 'curriculum-vitae', label: 'CV / Biodata', desc: 'Classic Standard' },
                    { id: 'cv', label: 'Curriculum Vitae', desc: 'Academic & Formal' },
                    { id: 'resume', label: 'Resume', desc: 'Corporate & ATS' },
                    { id: 'marriage-biodata', label: 'Marriage Biodata', desc: 'Family & Horoscope' },
                    { id: 'student-biodata', label: 'Student Biodata', desc: 'School & Admissions' },
                    { id: 'personal-biodata', label: 'Personal Biodata', desc: 'Identification' },
                    { id: 'custom', label: 'Custom Document', desc: 'Full Blank Freedom' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectDocumentType(item.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        data.documentType === item.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Title Samples (PRD #37) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Quick Document Title Choices
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'CURRICULUM VITAE',
                    'BIODATA',
                    'CURRICULUM VITAE / BIODATA',
                    'RESUME',
                    'PERSONAL BIODATA',
                    'MARRIAGE BIODATA',
                    'BIO-DATA',
                    'জীবন বৃত্তান্ত',
                    'ব্যক্তিগত পরিচিতি',
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => updateData((p) => ({ ...p, documentTitle: t }))}
                      className="py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium hover:border-indigo-500"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Header & Top Section Customization (PRD #2, #3) */}
          {activeTab === 'header' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Show Document Title in Header
                </label>
                <input
                  type="checkbox"
                  checked={data.showDocumentTitle}
                  onChange={(e) => updateData((p) => ({ ...p, showDocumentTitle: e.target.checked }))}
                  className="rounded text-indigo-600"
                />
              </div>

              {data.showDocumentTitle && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Custom Document Title Text
                    </label>
                    <input
                      type="text"
                      value={data.documentTitle}
                      onChange={(e) => updateData((p) => ({ ...p, documentTitle: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subtitle / Tagline (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.subtitle}
                      onChange={(e) => updateData((p) => ({ ...p, subtitle: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  {/* Header Layout (PRD #3) */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Header Layout Structure
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'center', label: 'Layout A: Center Title' },
                        { id: 'left', label: 'Layout B: Left Title' },
                        { id: 'photo-left', label: 'Layout C: Photo Left + Title' },
                        { id: 'photo-right', label: 'Layout D: Title Left + Photo Right' },
                      ].map((hl) => (
                        <button
                          key={hl.id}
                          onClick={() => updateData((p) => ({ ...p, headerLayout: hl.id as any }))}
                          className={`p-2 rounded-xl text-left border ${
                            data.headerLayout === hl.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-[11px]">{hl.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography & Alignment (PRD #2) */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['left', 'center', 'right'] as const).map((a) => (
                          <button
                            key={a}
                            onClick={() => updateData((p) => ({ ...p, titleAlignment: a }))}
                            className={`py-1 text-[11px] capitalize rounded border ${
                              data.titleAlignment === a
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Text Case
                      </label>
                      <select
                        value={data.titleCase}
                        onChange={(e) => updateData((p) => ({ ...p, titleCase: e.target.value as any }))}
                        className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      >
                        <option value="uppercase">UPPERCASE</option>
                        <option value="capitalize">Title Case</option>
                        <option value="lowercase">lowercase</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Title Size ({data.titleSize}px)</label>
                      <input
                        type="range"
                        min="16"
                        max="36"
                        value={data.titleSize}
                        onChange={(e) => updateData((p) => ({ ...p, titleSize: parseInt(e.target.value, 10) }))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Letter Spacing ({data.titleLetterSpacing}px)</label>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={data.titleLetterSpacing}
                        onChange={(e) => updateData((p) => ({ ...p, titleLetterSpacing: parseInt(e.target.value, 10) }))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Title Color</label>
                      <input
                        type="color"
                        value={data.titleColor}
                        onChange={(e) => updateData((p) => ({ ...p, titleColor: e.target.value }))}
                        className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Decoration */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Header Bottom Decoration
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'bottom-border', label: 'Solid Border' },
                        { id: 'double-border', label: 'Double Line' },
                        { id: 'divider-line', label: 'Thick Bar' },
                        { id: 'none', label: 'No Border' },
                      ].map((dec) => (
                        <button
                          key={dec.id}
                          onClick={() => updateData((p) => ({ ...p, titleDecoration: dec.id as any }))}
                          className={`py-1.5 px-2 rounded-lg text-[11px] border text-center ${
                            data.titleDecoration === dec.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800'
                          }`}
                        >
                          {dec.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Profile Photo Customization (PRD #4) */}
          {activeTab === 'photo' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Profile Photo File
                </label>
                <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <span className="text-slate-500 truncate max-w-xs">
                    {data.photoUrl ? 'Photo loaded' : 'No photo uploaded'}
                  </span>
                  <div className="flex gap-2">
                    <label className="py-1 px-3 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer hover:bg-indigo-700">
                      Upload
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    {data.photoUrl && (
                      <button
                        onClick={() => updateData((p) => ({ ...p, photoUrl: null }))}
                        className="py-1 px-2 rounded-lg border border-rose-300 text-rose-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Shape & Border */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Photo Shape
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['rounded', 'rectangle', 'square', 'circle'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateData((p) => ({ ...p, photoShape: s }))}
                        className={`py-1.5 capitalize rounded border text-[11px] ${
                          data.photoShape === s
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Photo Border
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['none', 'thin', 'medium', 'thick'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => updateData((p) => ({ ...p, photoBorder: b }))}
                        className={`py-1.5 capitalize rounded border text-[11px] ${
                          data.photoBorder === b
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Width ({data.photoWidth}px)</label>
                  <input
                    type="range"
                    min="70"
                    max="180"
                    value={data.photoWidth}
                    onChange={(e) => updateData((p) => ({ ...p, photoWidth: parseInt(e.target.value, 10) }))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Height ({data.photoHeight}px)</label>
                  <input
                    type="range"
                    min="80"
                    max="220"
                    value={data.photoHeight}
                    onChange={(e) => updateData((p) => ({ ...p, photoHeight: parseInt(e.target.value, 10) }))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Personal Info & Custom Fields (PRD #5, #6, #29) */}
          {activeTab === 'personal' && (
            <div className="space-y-4 text-xs">
              {/* Information Layout Style (PRD #29) */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Information Layout Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'colon', label: 'Style A: Colon Aligned' },
                    { id: 'grid', label: 'Style B: 2-Column Grid' },
                    { id: 'card', label: 'Style C: Compact Cards' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => updateData((p) => ({ ...p, infoLayoutStyle: st.id as any }))}
                      className={`p-2 rounded-xl text-center border font-bold text-[11px] ${
                        data.infoLayoutStyle === st.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Personal Information Fields
                </span>
                <button
                  onClick={() => addCustomPersonalField()}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom Field
                </button>
              </div>

              {/* Quick Add Presets */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['Height', 'Weight', 'Complexion', 'Aadhaar No', 'Gotra', 'Diet', 'LinkedIn', 'GitHub'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => addCustomPersonalField(preset, '')}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Dynamic Field List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {data.personalFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              personalFields: p.personalFields.map((f) =>
                                f.id === field.id ? { ...f, enabled: e.target.checked } : f
                              ),
                            }))
                          }
                          className="rounded text-indigo-600"
                        />
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              personalFields: p.personalFields.map((f) =>
                                f.id === field.id ? { ...f, label: e.target.value } : f
                              ),
                            }))
                          }
                          className="text-xs font-semibold bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none max-w-[140px]"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        {field.isCustom && (
                          <button
                            onClick={() =>
                              updateData((p) => ({
                                ...p,
                                personalFields: p.personalFields.filter((f) => f.id !== field.id),
                              }))
                            }
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Delete Field"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={field.value}
                      placeholder={`Enter ${field.label}...`}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          personalFields: p.personalFields.map((f) =>
                            f.id === field.id ? { ...f, value: e.target.value } : f
                          ),
                        }))
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Family Details (PRD #13, Marriage / Family Records) */}
          {activeTab === 'family' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200/70 dark:border-amber-900/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-200">
                    Family Background Information
                  </h4>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                    Essential for marriage biodatas, matrimonial profiles, and family records.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 dark:text-amber-200 text-xs shrink-0">
                  <input
                    type="checkbox"
                    checked={data.sections.find((s) => s.type === 'family')?.enabled ?? false}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        sections: p.sections.map((s) =>
                          s.type === 'family' ? { ...s, enabled: e.target.checked } : s
                        ),
                      }))
                    }
                    className="rounded text-amber-600 w-4 h-4"
                  />
                  <span>Show in Document</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Family Members & Details
                </span>
                <button
                  onClick={() => addFamilyField()}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Family Detail
                </button>
              </div>

              {/* Quick Add Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Father's Name",
                  "Father's Occupation",
                  "Mother's Name",
                  "Mother's Occupation",
                  'Siblings',
                  'Family Status',
                  'Family Type',
                  'Native District',
                  'Ancestral Home',
                  'Gotra',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => addFamilyField(preset, '')}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* List of family fields */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {(data.familyFields || []).map((field) => (
                  <div
                    key={field.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              familyFields: (p.familyFields || []).map((f) =>
                                f.id === field.id ? { ...f, enabled: e.target.checked } : f
                              ),
                            }))
                          }
                          className="rounded text-indigo-600"
                        />
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              familyFields: (p.familyFields || []).map((f) =>
                                f.id === field.id ? { ...f, label: e.target.value } : f
                              ),
                            }))
                          }
                          className="text-xs font-semibold bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none flex-1 max-w-[200px]"
                        />
                      </div>
                      <button
                        onClick={() =>
                          updateData((p) => ({
                            ...p,
                            familyFields: (p.familyFields || []).filter((f) => f.id !== field.id),
                          }))
                        }
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Family Field"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      placeholder={`Enter ${field.label}...`}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          familyFields: (p.familyFields || []).map((f) =>
                            f.id === field.id ? { ...f, value: e.target.value } : f
                          ),
                        }))
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>

              {/* Family Overview Note */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Family Overview / Background Note
                </label>
                <textarea
                  rows={3}
                  value={data.aboutFamily || ''}
                  placeholder="Enter family background overview, cultural values, or ancestral roots..."
                  onChange={(e) => updateData((p) => ({ ...p, aboutFamily: e.target.value }))}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Sections Management & Reorder (PRD #7, #8) */}
          {activeTab === 'sections' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    Manage & Reorder Document Sections
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Rename titles, drag up/down, or enable/disable any section.
                  </p>
                </div>
                <button
                  onClick={() => addCustomSection()}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>

              {/* Quick Add Section Presets */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['CERTIFICATIONS', 'PROJECTS', 'ACHIEVEMENTS', 'PUBLICATIONS', 'REFERENCES', 'AWARDS'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => addCustomSection(preset)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {data.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-2.5 flex-1">
                        <input
                          type="checkbox"
                          checked={sec.enabled}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              sections: p.sections.map((s) =>
                                s.id === sec.id ? { ...s, enabled: e.target.checked } : s
                              ),
                            }))
                          }
                          className="rounded text-indigo-600"
                        />

                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              sections: p.sections.map((s) =>
                                s.id === sec.id ? { ...s, title: e.target.value } : s
                              ),
                            }))
                          }
                          className="font-bold text-xs bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none flex-1 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === data.sections.length - 1}
                          className="p-1 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {sec.type === 'custom' && (
                          <button
                            onClick={() =>
                              updateData((p) => ({
                                ...p,
                                sections: p.sections.filter((s) => s.id !== sec.id),
                              }))
                            }
                            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Custom Section Content Editor */}
                    {sec.type === 'custom' && (
                      <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 w-full space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Section Content & Description:
                        </label>
                        <textarea
                          rows={3}
                          placeholder={`Enter details, bullet points, or description for ${sec.title}...`}
                          value={sec.content || ''}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              sections: p.sections.map((s) =>
                                s.id === sec.id ? { ...s, content: e.target.value } : s
                              ),
                            }))
                          }
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Section Styling */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Section Header Border / Divider Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'underline', label: 'Bottom Line' },
                    { id: 'badge', label: 'Pill / Badge' },
                    { id: 'background', label: 'Shaded Bar' },
                    { id: 'line', label: 'Side Accent' },
                    { id: 'plain', label: 'Plain' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => updateData((p) => ({ ...p, sectionTitleStyle: st.id as any }))}
                      className={`py-1.5 px-2 rounded-lg text-[11px] border text-center ${
                        data.sectionTitleStyle === st.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Education Section (PRD #9) */}
          {activeTab === 'education' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Educational Qualifications ({data.education.length})
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Degrees, diplomas, board exams, and academic achievements.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {data.education.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all education entries?')) {
                          updateData((p) => ({ ...p, education: [] }));
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 font-medium text-[11px] cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => addEducationRow()}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
              </div>

              {/* Quick Degree / Standard Presets */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'Secondary (10th)',
                  'Higher Secondary (12th)',
                  'Graduation / B.Tech / B.Sc',
                  'Post-Graduation / Master',
                  'Diploma / Polytechnic',
                ].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => addEducationRow(deg)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer"
                  >
                    + {deg}
                  </button>
                ))}
              </div>

              {/* Education Rows List */}
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {data.education.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                      No education entries added yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => addEducationRow()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Qualification
                    </button>
                  </div>
                ) : (
                  data.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2 relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          #{idx + 1} {edu.qualification ? `— ${edu.qualification}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateData((p) => ({
                              ...p,
                              education: p.education.filter((e) => e.id !== edu.id),
                            }))
                          }
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Delete qualification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Degree / Qualification (e.g. B.Tech / Class 12 / 10th)"
                        value={edu.qualification}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            education: p.education.map((x) =>
                              x.id === edu.id ? { ...x, qualification: e.target.value } : x
                            ),
                          }))
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Institution / School / College"
                          value={edu.institution}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              education: p.education.map((x) =>
                                x.id === edu.id ? { ...x, institution: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Board / University"
                          value={edu.boardUniversity}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              education: p.education.map((x) =>
                                x.id === edu.id ? { ...x, boardUniversity: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Passing Year (e.g. 2021)"
                          value={edu.year}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              education: p.education.map((x) =>
                                x.id === edu.id ? { ...x, year: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Grade / % / CGPA (e.g. 8.5 CGPA / 85%)"
                          value={edu.percentageGrade}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              education: p.education.map((x) =>
                                x.id === edu.id ? { ...x, percentageGrade: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: Experience (PRD #10) */}
          {activeTab === 'experience' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Work Experience ({data.experience.length})
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Professional employment, companies, roles, and job tenures.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {data.experience.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all work experience entries?')) {
                          updateData((p) => ({ ...p, experience: [] }));
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 font-medium text-[11px] cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => addExperienceRow()}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>
              </div>

              {/* Quick Role Presets */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'Software Engineer',
                  'Full Stack Developer',
                  'Project Manager',
                  'Teacher / Faculty',
                  'Executive / Sales',
                  'Intern / Trainee',
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => addExperienceRow(role)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer"
                  >
                    + {role}
                  </button>
                ))}
              </div>

              {/* Experience Rows List */}
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {data.experience.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                      No work experience added yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => addExperienceRow()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Job
                    </button>
                  </div>
                ) : (
                  data.experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2 relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          #{idx + 1} {exp.position ? `— ${exp.position}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateData((p) => ({
                              ...p,
                              experience: p.experience.filter((x) => x.id !== exp.id),
                            }))
                          }
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Delete position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Designation / Role"
                          value={exp.position}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              experience: p.experience.map((x) =>
                                x.id === exp.id ? { ...x, position: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Company / Organization"
                          value={exp.company}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              experience: p.experience.map((x) =>
                                x.id === exp.id ? { ...x, company: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Date (e.g. 2021 / Jan 2021)"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              experience: p.experience.map((x) =>
                                x.id === exp.id ? { ...x, startDate: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="End Date (e.g. Present / 2023)"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              experience: p.experience.map((x) =>
                                x.id === exp.id ? { ...x, endDate: e.target.value } : x
                              ),
                            }))
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>

                      <textarea
                        placeholder="Key responsibilities, achievements, and impact..."
                        rows={2}
                        value={exp.description}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            experience: p.experience.map((x) =>
                              x.id === exp.id ? { ...x, description: e.target.value } : x
                            ),
                          }))
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: Skills & Languages (PRD #11, #12) */}
          {activeTab === 'skills' && (
            <div className="space-y-5 text-xs">
              {/* Skills Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Key Technical & Core Skills ({data.skills.length})
                  </span>
                  {data.skills.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all skills?')) {
                          updateData((p) => ({ ...p, skills: [] }));
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 font-medium text-[11px] cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Add Skill Input Form */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter skill name (e.g. React, SQL, Team Leadership)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkillInput.trim()) {
                          addSkill(newSkillInput);
                          setNewSkillInput('');
                        }
                      }
                    }}
                    className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkillInput.trim()) {
                        addSkill(newSkillInput);
                        setNewSkillInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </div>

                {/* Quick Skill Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'React / TypeScript',
                    'JavaScript',
                    'Tailwind CSS',
                    'Python',
                    'Node.js',
                    'SQL / PostgreSQL',
                    'Problem Solving',
                    'Communication',
                    'Git / GitHub',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addSkill(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Interactive Skill Badges List */}
                {data.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-[11px] font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-indigo-400 hover:text-rose-500 cursor-pointer"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Display Style Selector */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Skills Display Style (PRD #11)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['tags', 'bullets', 'comma', 'simple'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateData((p) => ({ ...p, skillsDisplayStyle: st }))}
                        className={`py-1.5 capitalize rounded-lg border text-[11px] ${
                          data.skillsDisplayStyle === st
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Languages Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Languages Known ({data.languagesDetailed.length})
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Spoken and written language proficiencies.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addLanguage()}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Language
                  </button>
                </div>

                {/* Add Language Input Form */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter language (e.g. French, German, Japanese)..."
                    value={newLanguageInput}
                    onChange={(e) => setNewLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newLanguageInput.trim()) {
                          addLanguage(newLanguageInput);
                          setNewLanguageInput('');
                        }
                      }
                    }}
                    className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newLanguageInput.trim()) {
                        addLanguage(newLanguageInput);
                        setNewLanguageInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Quick Language Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'English',
                    'Bengali (বাংলা)',
                    'Hindi (हिंदी)',
                    'Urdu',
                    'Arabic',
                    'Spanish',
                    'French',
                    'German',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addLanguage(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Languages List */}
                <div className="space-y-2">
                  {data.languagesDetailed.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-2"
                    >
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            languagesDetailed: p.languagesDetailed.map((l) =>
                              l.id === lang.id ? { ...l, language: e.target.value } : l
                            ),
                          }))
                        }
                        className="text-xs font-semibold bg-transparent focus:outline-none flex-1 min-w-[100px]"
                      />
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.reading}
                            onChange={(e) =>
                              updateData((p) => ({
                                ...p,
                                languagesDetailed: p.languagesDetailed.map((l) =>
                                  l.id === lang.id ? { ...l, reading: e.target.checked } : l
                                ),
                              }))
                            }
                            className="rounded text-indigo-600"
                          />
                          <span>Read</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.writing}
                            onChange={(e) =>
                              updateData((p) => ({
                                ...p,
                                languagesDetailed: p.languagesDetailed.map((l) =>
                                  l.id === lang.id ? { ...l, writing: e.target.checked } : l
                                ),
                              }))
                            }
                            className="rounded text-indigo-600"
                          />
                          <span>Write</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.speaking}
                            onChange={(e) =>
                              updateData((p) => ({
                                ...p,
                                languagesDetailed: p.languagesDetailed.map((l) =>
                                  l.id === lang.id ? { ...l, speaking: e.target.checked } : l
                                ),
                              }))
                            }
                            className="rounded text-indigo-600"
                          />
                          <span>Speak</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer ml-1"
                          title="Delete language"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: About Me & Hobbies */}
          {activeTab === 'about' && (
            <div className="space-y-5 text-xs">
              {/* About Me Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    About Me / Career Objective
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={data.sections.find((s) => s.type === 'about')?.enabled ?? false}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          sections: p.sections.map((s) =>
                            s.type === 'about' ? { ...s, enabled: e.target.checked } : s
                          ),
                        }))
                      }
                      className="rounded text-indigo-600"
                    />
                    <span>Show in Document</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium self-center">Templates:</span>
                  {[
                    { label: 'Fresher Objective', text: 'Enthusiastic and motivated individual seeking an entry-level opportunity where I can leverage my academic foundation, continuous learning mindset, and technical skills to create measurable impact.' },
                    { label: 'Professional Summary', text: 'Experienced professional with demonstrated expertise in delivering high-impact solutions, collaborating across cross-functional teams, and driving operational efficiency with dedication to quality.' },
                    { label: 'Marriage Biodata', text: 'Cultured, grounded, and family-oriented individual with strong moral principles, respectful worldview, and commitment to harmonious family life.' },
                  ].map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() =>
                        updateData((p) => ({
                          ...p,
                          sections: p.sections.map((s) => s.type === 'about' ? { ...s, enabled: true } : s),
                          aboutMe: tpl.text,
                        }))
                      }
                      className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  placeholder="Write a brief professional summary, career objective, or personal introduction..."
                  value={data.aboutMe || ''}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      aboutMe: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              {/* Hobbies & Interests Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Hobbies & Interests
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={data.sections.find((s) => s.type === 'hobbies')?.enabled ?? false}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          sections: p.sections.map((s) =>
                            s.type === 'hobbies' ? { ...s, enabled: e.target.checked } : s
                          ),
                        }))
                      }
                      className="rounded text-indigo-600"
                    />
                    <span>Show in Document</span>
                  </label>
                </div>

                {/* Add Hobby Input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Add hobby (e.g. Photography, Chess)..."
                    value={newHobbyInput}
                    onChange={(e) => setNewHobbyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newHobbyInput.trim()) {
                          addHobby(newHobbyInput);
                          setNewHobbyInput('');
                        }
                      }
                    }}
                    className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newHobbyInput.trim()) {
                        addHobby(newHobbyInput);
                        setNewHobbyInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Quick Hobby Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Reading Books',
                    'Travel & Photography',
                    'Chess',
                    'Coding & Web Design',
                    'Music & Guitar',
                    'Cricket',
                    'Gardening',
                    'Cooking',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addHobby(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Interactive Hobby Badges */}
                {data.hobbies && data.hobbies.trim() && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.hobbies
                      .split(',')
                      .map((h) => h.trim())
                      .filter(Boolean)
                      .map((h, idx) => (
                        <span
                          key={`${h}-${idx}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-[11px] font-medium"
                        >
                          {h}
                          <button
                            type="button"
                            onClick={() => removeHobby(h)}
                            className="text-indigo-400 hover:text-rose-500 cursor-pointer"
                            title="Remove hobby"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                )}

                {/* Bulk comma-separated textarea */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Or edit comma-separated list:
                  </label>
                  <textarea
                    rows={2}
                    value={data.hobbies || ''}
                    onChange={(e) => updateData((p) => ({ ...p, hobbies: e.target.value }))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* Hobbies Style Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Hobbies Display Style:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['tags', 'bullets', 'text'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateData((p) => ({ ...p, hobbiesStyle: st }))}
                        className={`py-1 rounded-lg border text-[11px] font-semibold capitalize ${
                          (data.hobbiesStyle || 'tags') === st
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {st === 'text' ? 'Plain Text' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Mandatory Date / Place / Signature (PRD #19, #20, #21, #55) */}
          {activeTab === 'signature' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-indigo-950 dark:text-indigo-200">
                  Mandatory Bottom Block:
                </span>{' '}
                Always anchored cleanly at the footer of the document.
              </div>

              {/* Declaration */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.includeDeclaration}
                    onChange={(e) => updateData((p) => ({ ...p, includeDeclaration: e.target.checked }))}
                    className="rounded text-indigo-600"
                  />
                  <span>Include Formal Declaration (PRD #18)</span>
                </label>
                {data.includeDeclaration && (
                  <textarea
                    rows={2}
                    value={data.declarationText}
                    onChange={(e) => updateData((p) => ({ ...p, declarationText: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                )}
              </div>

              {/* Place & Date Inputs */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Place / Location
                  </label>
                  <input
                    type="text"
                    value={data.place}
                    onChange={(e) => updateData((p) => ({ ...p, place: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
                    <button
                      onClick={() =>
                        updateData((p) => ({ ...p, date: new Date().toLocaleDateString('en-GB') }))
                      }
                      className="text-[10px] text-indigo-600 hover:underline"
                    >
                      Today
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => updateData((p) => ({ ...p, date: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Signature Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Signature Method (PRD #19)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['type', 'draw', 'upload'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateData((p) => ({ ...p, signatureType: st }))}
                      className={`py-1.5 rounded-lg border text-[11px] font-semibold ${
                        data.signatureType === st
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {st === 'type' ? 'Typed Name' : st === 'draw' ? 'Draw Sign' : 'Upload Image'}
                    </button>
                  ))}
                </div>

                {data.signatureType === 'type' && (
                  <input
                    type="text"
                    placeholder="Signature Name"
                    value={data.signatureText}
                    onChange={(e) => updateData((p) => ({ ...p, signatureText: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-serif italic text-sm"
                  />
                )}

                {data.signatureType === 'draw' && (
                  <div className="space-y-1.5">
                    <canvas
                      ref={sigCanvasRef}
                      width={300}
                      height={90}
                      onPointerDown={startSigDraw}
                      onPointerMove={drawSig}
                      onPointerUp={endSigDraw}
                      className="border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 cursor-crosshair w-full"
                    />
                    <button onClick={clearSigDraw} className="text-xs text-rose-500 hover:underline">
                      Clear Drawing
                    </button>
                  </div>
                )}

                {data.signatureType === 'upload' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
                  />
                )}

                {/* Applicant Name Under Signature (PRD #21) */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.showApplicantName}
                      onChange={(e) => updateData((p) => ({ ...p, showApplicantName: e.target.checked }))}
                      className="rounded text-indigo-600"
                    />
                    <span>Show Applicant Name Under Signature Block</span>
                  </label>
                  {data.showApplicantName && (
                    <input
                      type="text"
                      placeholder="Applicant Name"
                      value={data.applicantName}
                      onChange={(e) => updateData((p) => ({ ...p, applicantName: e.target.value }))}
                      className="w-full p-2 mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: Styling & Page Setup (PRD #23, #24, #27, #28) */}
          {activeTab === 'design' && (
            <div className="space-y-4 text-xs">
              {/* 1-Page Auto-Fit Guarantee Feature */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      ১ পেজে ফিট করুন (Auto-Fit 1 Page)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={data.autoFitOnePage ?? true}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        autoFitOnePage: e.target.checked,
                        pageDensity: e.target.checked ? 'compact' : p.pageDensity,
                      }))
                    }
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  সব তথ্য (শিক্ষা, অভিজ্ঞতা, ছবি, ডিক্লারেশন) স্বয়ংক্রিয়ভাবে একটিমাত্র A4 পেজের ভেতর নিখুঁতভাবে সমন্বয় করে আঁটিয়ে দেবে।
                </p>
              </div>

              {/* Page Density Mode */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  পৃষ্ঠা স্পেসিং ও ঘনত্ব (Page Density)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'comfortable', label: 'স্বস্তিদায়ক (Comfortable)' },
                    { id: 'standard', label: 'স্ট্যান্ডার্ড (Standard)' },
                    { id: 'compact', label: 'কম্প্যাক্ট (Compact - ১ পেজ)' },
                    { id: 'ultra-compact', label: 'আল্ট্রা কম্প্যাক্ট (Ultra)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => updateData((p) => ({ ...p, pageDensity: d.id as any }))}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        data.pageDensity === d.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-semibold">{d.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 12 Professional Fonts Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    প্রফেশনাল ফন্টসমূহ (Professional Fonts)
                  </label>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    ১২টি প্রিমিয়াম ফন্ট
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                  {PROFESSIONAL_FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateData((p) => ({ ...p, fontFamily: f.id as any }))}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        data.fontFamily === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            data.fontFamily === f.id
                              ? 'text-white'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                          style={{ fontFamily: f.cssFamily }}
                        >
                          {f.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            data.fontFamily === f.id
                              ? 'bg-indigo-700 text-indigo-100'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {f.category}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] mt-1 truncate ${
                          data.fontFamily === f.id
                            ? 'text-indigo-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        style={{ fontFamily: f.cssFamily }}
                      >
                        {f.sampleText}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Scaling */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ফন্ট সাইজ স্কেল (Font Size Scale)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'compact', label: 'কম্প্যাক্ট (11.5px)' },
                    { id: 'standard', label: 'স্ট্যান্ডার্ড (12.5px)' },
                    { id: 'large', label: 'বড় (14px)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateData((p) => ({ ...p, fontScale: s.id as any }))}
                      className={`py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                        (data.fontScale || 'standard') === s.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Page Margins (PRD #24)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['narrow', 'normal', 'wide'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateData((p) => ({ ...p, pageMargins: m }))}
                      className={`py-1.5 capitalize rounded-lg border text-[11px] ${
                        data.pageMargins === m
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Colors */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Section Titles</label>
                  <input
                    type="color"
                    value={data.sectionTitleColor}
                    onChange={(e) => updateData((p) => ({ ...p, sectionTitleColor: e.target.value }))}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Body Text</label>
                  <input
                    type="color"
                    value={data.bodyTextColor}
                    onChange={(e) => updateData((p) => ({ ...p, bodyTextColor: e.target.value }))}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Accent Line</label>
                  <input
                    type="color"
                    value={data.accentColor}
                    onChange={(e) => updateData((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT LIVE DOCUMENT PREVIEW (PRD #30, #35) */}
        <div
          className={`lg:col-span-7 flex flex-col items-center w-full ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <A4DocumentReviewWorkbench
            documentRef={previewDocRef}
            currentFont={data.fontFamily}
            onFontChange={(fontId) => updateData((p) => ({ ...p, fontFamily: fontId as any }))}
            pageDensity={data.pageDensity || 'compact'}
            onDensityChange={(density) => updateData((p) => ({ ...p, pageDensity: density }))}
            autoFitOnePage={data.autoFitOnePage ?? true}
            onAutoFitToggle={(val) => updateData((p) => ({ ...p, autoFitOnePage: val }))}
            fontScale={data.fontScale || 'standard'}
            onFontScaleChange={(scale) => updateData((p) => ({ ...p, fontScale: scale }))}
            documentTitle={data.documentTitle}
          >
            {/* A4 Document Printable Canvas Container */}
            <div ref={previewDocRef} id="printable-biodata" className="w-[794px] min-w-[794px] space-y-6 mx-auto">
              {paginateBiodataData(data).map((pageData) => (
                <div
                  key={pageData.pageIndex}
                  className="a4-page relative w-[794px] min-w-[794px] max-w-[794px] shrink-0 min-h-[1123px] max-h-[1123px] bg-white rounded-xl shadow-2xl border border-slate-300 ring-1 ring-slate-900/5 flex flex-col justify-between overflow-hidden box-border transition-all print:my-0 print:shadow-none print:border-none print:break-after-page"
                  style={{
                    width: '794px',
                    minWidth: '794px',
                    maxWidth: '794px',
                    minHeight: '1123px',
                    maxHeight: '1123px',
                    boxSizing: 'border-box',
                    color: data.bodyTextColor,
                    backgroundColor: data.backgroundColor,
                    fontFamily: getCssFontFamily(data.fontFamily),
                    fontSize:
                      data.autoFitOnePage || data.pageDensity === 'ultra-compact'
                        ? '11.5px'
                        : data.fontScale === 'large'
                        ? '13.5px'
                        : '12.5px',
                    padding:
                      data.pageMargins === 'narrow'
                        ? '24px 28px'
                        : data.pageMargins === 'wide'
                        ? '48px 52px'
                        : '36px 40px',
                  }}
                >
                  {/* TOP / BODY CONTENT */}
                  <div className="flex-1 space-y-3">
                    {/* Page Header (Only on Page 1) */}
                    {pageData.showHeader && (
                      <div>
                        {/* Title & Subtitle */}
                        {data.showDocumentTitle && (
                          <div
                            className={`${
                              data.autoFitOnePage || data.pageDensity === 'compact' ? 'mb-2.5' : 'mb-5'
                            } ${
                              data.titleAlignment === 'center'
                                ? 'text-center'
                                : data.titleAlignment === 'right'
                                ? 'text-right'
                                : 'text-left'
                            }`}
                          >
                            <h1
                              style={{
                                color: data.titleColor,
                                fontSize: `${data.titleSize}px`,
                                letterSpacing: `${data.titleLetterSpacing}px`,
                              }}
                              className={`leading-tight ${data.titleBold ? 'font-extrabold' : 'font-normal'} ${
                                data.titleItalic ? 'italic' : ''
                              } ${data.titleUnderline ? 'underline' : ''}`}
                            >
                              {formatTextCase(data.documentTitle, data.titleCase)}
                            </h1>
                            {data.subtitle && (
                              <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-wide">
                                {data.subtitle}
                              </p>
                            )}
                            {data.titleDecoration === 'bottom-border' && (
                              <div
                                style={{ backgroundColor: data.accentColor }}
                                className="w-full h-0.5 mt-2 rounded-full opacity-80"
                              />
                            )}
                            {data.titleDecoration === 'double-border' && (
                              <div className="w-full border-b-2 border-t border-slate-800 my-2 py-0.5" />
                            )}
                          </div>
                        )}

                        {/* Profile Info & Photo */}
                        <div
                          className={`flex items-start ${
                            data.autoFitOnePage || data.pageDensity === 'compact' ? 'gap-3 mb-3' : 'gap-5 mb-5'
                          } ${
                            data.headerLayout === 'photo-left'
                              ? 'flex-row-reverse justify-end'
                              : 'flex-row justify-between'
                          }`}
                        >
                          <div className="space-y-0.5 flex-1">
                            <h2
                              className={`${
                                data.autoFitOnePage || data.pageDensity === 'compact' ? 'text-xl' : 'text-2xl'
                              } font-black text-slate-900 tracking-tight`}
                            >
                              {data.personalFields.find((f) => f.id === 'fullName')?.value || 'Bittu Khan'}
                            </h2>
                            <div className="text-xs text-slate-600 space-y-0.5">
                              {data.personalFields.find((f) => f.id === 'phone')?.enabled && (
                                <p><strong>Phone:</strong> {data.personalFields.find((f) => f.id === 'phone')?.value}</p>
                              )}
                              {data.personalFields.find((f) => f.id === 'email')?.enabled && (
                                <p><strong>Email:</strong> {data.personalFields.find((f) => f.id === 'email')?.value}</p>
                              )}
                              {data.personalFields.find((f) => f.id === 'address')?.enabled && (
                                <p><strong>Address:</strong> {data.personalFields.find((f) => f.id === 'address')?.value}</p>
                              )}
                            </div>
                          </div>
                          {data.photoUrl && (
                            <div className="shrink-0">
                              <img
                                src={data.photoUrl}
                                alt="Profile"
                                style={{
                                  width: `${data.photoWidth}px`,
                                  height: `${data.photoHeight}px`,
                                  borderColor: data.photoBorderColor,
                                  borderRadius:
                                    data.photoShape === 'circle'
                                      ? '50%'
                                      : data.photoShape === 'rounded'
                                      ? '12px'
                                      : '0px',
                                }}
                                className="object-cover shadow-sm border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Page Sections */}
                    <div className="space-y-3">
                      {pageData.sections.map((sec) => (
                        <section key={sec.id} className="space-y-1.5 w-full">
                          {/* Section Header - Single-line nowrap with separate divider */}
                          <div className="w-full pb-0.5">
                            {data.sectionTitleStyle === 'badge' ? (
                              <div className="w-full flex items-center mb-1">
                                <span
                                  style={{
                                    backgroundColor: data.sectionTitleColor || '#1e1b4b',
                                    fontSize: `${data.sectionTitleSize - 1}px`,
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'keep-all',
                                  }}
                                  className="a4-section-header-title text-white font-extrabold uppercase tracking-wider px-3 py-1 rounded-md whitespace-nowrap inline-block shadow-2xs"
                                >
                                  {sec.title}
                                </span>
                              </div>
                            ) : data.sectionTitleStyle === 'background' ? (
                              <div
                                style={{
                                  backgroundColor: data.sectionTitleColor ? `${data.sectionTitleColor}15` : '#f1f5f9',
                                  color: data.sectionTitleColor,
                                  fontSize: `${data.sectionTitleSize}px`,
                                  whiteSpace: 'nowrap',
                                  wordBreak: 'keep-all',
                                }}
                                className="w-full font-black uppercase tracking-wider px-3 py-1 rounded whitespace-nowrap flex items-center mb-1 border-l-4"
                              >
                                <span className="a4-section-header-title whitespace-nowrap inline-block">{sec.title}</span>
                              </div>
                            ) : data.sectionTitleStyle === 'line' ? (
                              <div className="w-full mb-1">
                                <div
                                  style={{
                                    color: data.sectionTitleColor,
                                    fontSize: `${data.sectionTitleSize}px`,
                                    borderColor: data.sectionTitleColor,
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'keep-all',
                                  }}
                                  className="w-full font-black uppercase tracking-wider border-l-4 pl-2.5 whitespace-nowrap"
                                >
                                  <span className="a4-section-header-title whitespace-nowrap inline-block">{sec.title}</span>
                                </div>
                                <div
                                  className="w-full mt-1 border-b border-slate-200"
                                  style={{ borderColor: data.sectionTitleColor ? `${data.sectionTitleColor}25` : '#e2e8f0' }}
                                />
                              </div>
                            ) : data.sectionTitleStyle === 'plain' ? (
                              <div
                                style={{
                                  color: data.sectionTitleColor,
                                  fontSize: `${data.sectionTitleSize}px`,
                                  whiteSpace: 'nowrap',
                                  wordBreak: 'keep-all',
                                }}
                                className="w-full font-black uppercase tracking-wider whitespace-nowrap mb-1 text-left"
                              >
                                <span className="a4-section-header-title whitespace-nowrap inline-block">{sec.title}</span>
                              </div>
                            ) : (
                              /* Default / 'underline': Heading text strictly on one line, dedicated divider beneath */
                              <div className="w-full mb-1">
                                <div
                                  style={{
                                    color: data.sectionTitleColor,
                                    fontSize: `${data.sectionTitleSize}px`,
                                    lineHeight: 1.25,
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    overflowWrap: 'normal',
                                  }}
                                  className="w-full font-black uppercase tracking-wider whitespace-nowrap text-left"
                                >
                                  <span className="a4-section-header-title whitespace-nowrap inline-block select-text">
                                    {sec.title}
                                  </span>
                                </div>
                                {/* Dedicated section divider on its own line beneath the heading */}
                                <div
                                  className="w-full mt-1.5 border-b"
                                  style={{
                                    borderColor: data.sectionTitleColor ? `${data.sectionTitleColor}35` : '#cbd5e1',
                                    borderBottomWidth: '1.5px',
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Personal Details */}
                          {sec.type === 'personal' && (
                            <div className="pt-1">
                              {data.infoLayoutStyle === 'colon' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
                                  {data.personalFields
                                    .filter((f) => f.enabled && f.id !== 'fullName' && f.id !== 'phone' && f.id !== 'email' && f.id !== 'address')
                                    .map((f) => (
                                      <div key={f.id} className="flex items-start">
                                        <span className="w-36 text-slate-500 font-medium shrink-0 pt-0.5">{f.label}</span>
                                        <span className="text-slate-900 font-semibold mr-2 pt-0.5">:</span>
                                        <span className="text-slate-900 font-semibold break-words whitespace-normal leading-snug flex-1">
                                          {f.value}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="space-y-1.5 text-xs">
                                  {data.personalFields
                                    .filter((f) => f.enabled && f.id !== 'fullName')
                                    .map((f) => (
                                      <div key={f.id} className="flex justify-between items-start py-1 border-b border-slate-100 gap-4">
                                        <span className="text-slate-500 shrink-0">{f.label}</span>
                                        <span className="font-semibold text-slate-900 text-right break-words whitespace-normal">{f.value}</span>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Education */}
                          {sec.type === 'education' && data.education.length > 0 && (
                            <div className="overflow-x-auto pt-1 w-full">
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-100 border border-slate-300 text-slate-800">
                                    <th className="p-2 text-left font-bold">Qualification</th>
                                    <th className="p-2 text-left font-bold">Institution / Board</th>
                                    <th className="p-2 text-center font-bold">Year</th>
                                    <th className="p-2 text-right font-bold">Grade / %</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {((sec.items || data.education) as typeof data.education).map((edu) => (
                                    <tr key={edu.id} className="border-b border-slate-200">
                                      <td className="p-2 font-bold text-slate-900 break-words whitespace-normal" style={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                                        {edu.qualification}
                                      </td>
                                      <td className="p-2 text-slate-700 break-words whitespace-normal" style={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                                        {edu.institution} {edu.boardUniversity ? `(${edu.boardUniversity})` : ''}
                                      </td>
                                      <td className="p-2 text-center text-slate-600 shrink-0 whitespace-nowrap">{edu.year}</td>
                                      <td className="p-2 text-right font-bold text-slate-900 shrink-0 whitespace-nowrap">{edu.percentageGrade}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Experience */}
                          {sec.type === 'experience' && data.experience.length > 0 && (
                            <div className="space-y-3 pt-1 w-full">
                              {((sec.items || data.experience) as typeof data.experience).map((exp) => (
                                <div key={exp.id} className="text-xs space-y-1 pb-2 border-b border-slate-100 last:border-none min-w-0">
                                  <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                                    <div className="font-bold text-slate-900 leading-snug flex-1 min-w-[200px]" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                                      <span className="text-slate-950 font-extrabold">{exp.position}</span>
                                      {exp.company && (
                                        <span className="text-indigo-900 font-semibold"> — {exp.company}</span>
                                      )}
                                    </div>
                                    {(exp.startDate || exp.endDate) && (
                                      <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0 font-medium whitespace-nowrap">
                                        {exp.startDate} – {exp.endDate}
                                      </span>
                                    )}
                                  </div>
                                  {exp.description && (
                                    <p className="text-slate-700 mt-1 leading-relaxed break-words whitespace-pre-line text-[11.5px]" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                                      {exp.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Skills */}
                          {sec.type === 'skills' && data.skills.length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-1.5 w-full">
                              {((sec.items || data.skills) as string[]).map((skill, i) => (
                                <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Languages */}
                          {sec.type === 'languages' && (
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-700 pt-1 w-full">
                              {((sec.items || data.languagesDetailed) as typeof data.languagesDetailed).map((l) => (
                                <div key={l.id}>
                                  <strong>{l.language}</strong>{' '}
                                  <span className="text-slate-500 text-[11px]">
                                    ({[l.reading && 'Read', l.writing && 'Write', l.speaking && 'Speak'].filter(Boolean).join(', ')})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Family Background */}
                          {sec.type === 'family' && (
                            <div className="pt-1.5 space-y-2.5 w-full">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs w-full">
                                {((sec.items || data.familyFields) as typeof data.familyFields)
                                  .filter((f) => f.enabled)
                                  .map((f) => (
                                    <div
                                      key={f.id}
                                      className="flex items-start gap-2.5 p-2 rounded-md bg-slate-50/70 border border-slate-200/70 w-full min-w-0"
                                      style={{
                                        minWidth: 0,
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      <span className="text-slate-600 font-semibold shrink-0 pt-0.5 min-w-[110px] max-w-[130px] select-text">
                                        {f.label}
                                      </span>
                                      <span className="text-slate-400 font-bold shrink-0 pt-0.5">:</span>
                                      <span
                                        className="font-bold text-slate-900 flex-1 min-w-0 leading-relaxed break-words whitespace-normal select-text"
                                        style={{
                                          minWidth: 0,
                                          overflowWrap: 'anywhere',
                                          wordBreak: 'break-word',
                                        }}
                                      >
                                        {f.value || '—'}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                              {data.aboutFamily && (
                                <div
                                  className="p-2.5 rounded-md bg-slate-50/70 border border-slate-200/70 text-xs text-slate-700 leading-relaxed w-full min-w-0"
                                  style={{ minWidth: 0, overflowWrap: 'anywhere' }}
                                >
                                  <span className="font-bold text-slate-900 mr-1.5">Family Overview:</span>
                                  <span className="break-words whitespace-normal">{data.aboutFamily}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* About Me */}
                          {sec.type === 'about' && data.aboutMe && (
                            <p className="text-xs text-slate-700 leading-relaxed pt-1 break-words whitespace-normal" style={{ overflowWrap: 'anywhere' }}>
                              {data.aboutMe}
                            </p>
                          )}

                          {/* Hobbies */}
                          {sec.type === 'hobbies' && data.hobbies && (
                            <div className="pt-1 w-full">
                              {(data.hobbiesStyle || 'tags') === 'tags' ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {data.hobbies
                                    .split(',')
                                    .map((h) => h.trim())
                                    .filter(Boolean)
                                    .map((h, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200"
                                      >
                                        {h}
                                      </span>
                                    ))}
                                </div>
                              ) : data.hobbiesStyle === 'bullets' ? (
                                <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                                  {data.hobbies
                                    .split(',')
                                    .map((h) => h.trim())
                                    .filter(Boolean)
                                    .map((h, idx) => (
                                      <li key={idx}>{h}</li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-700 pt-0.5 break-words whitespace-normal" style={{ overflowWrap: 'anywhere' }}>
                                  <strong>Interests:</strong> {data.hobbies}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Custom */}
                          {sec.type === 'custom' && (
                            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1 break-words w-full" style={{ overflowWrap: 'anywhere' }}>
                              {sec.content || (
                                <span className="text-slate-400 italic">No content added yet.</span>
                              )}
                            </div>
                          )}
                        </section>
                      ))}
                    </div>
                  </div>

                  {/* Declaration & Signature Block */}
                  {pageData.showDeclaration && (
                    <div className="pt-4 border-t-2 border-slate-300 space-y-3 mt-auto w-full page-break-inside-avoid">
                      {data.includeDeclaration && (
                        <p className="text-[11px] text-slate-700 italic leading-relaxed break-words whitespace-normal">
                          {data.declarationText}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-8 items-end pt-2 w-full">
                        {/* Place & Date - Independent rows with distinct vertical spacing and aligned labels */}
                        <div className="flex flex-col justify-end space-y-2 pb-1">
                          <div className="flex items-baseline gap-2 text-xs">
                            <span className="text-slate-600 font-bold min-w-[48px] shrink-0">Place :</span>
                            <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 min-w-[130px] inline-block">
                              {data.place || '____________________'}
                            </span>
                          </div>
                          {data.showDate && (
                            <div className="flex items-baseline gap-2 text-xs">
                              <span className="text-slate-600 font-bold min-w-[48px] shrink-0">Date :</span>
                              <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 min-w-[130px] inline-block">
                                {data.date || '____________________'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Signature Block - Dedicated right column with consistent height and alignment */}
                        <div className="flex flex-col items-center ml-auto w-44 text-center">
                          <div className="h-10 flex items-end justify-center w-full mb-1">
                            {data.signatureUrl ? (
                              <img
                                src={data.signatureUrl}
                                alt="Signature"
                                className="max-h-10 max-w-[150px] object-contain"
                              />
                            ) : (
                              <div className="font-serif italic text-base font-bold text-slate-900 tracking-wide">
                                {data.signatureText || 'Signature'}
                              </div>
                            )}
                          </div>
                          <div className="w-full border-t border-slate-700 pt-1 text-center text-xs font-bold text-slate-800">
                            Signature
                          </div>
                          {data.showApplicantName && data.applicantName && (
                            <div className="text-[11px] font-semibold text-slate-800 mt-0.5 text-center truncate w-full">
                              ({data.applicantName})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page Footer / Numbering */}
                  {data.pageNumbering !== 'none' && (
                    <div className="no-print-pdf text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span>{data.documentTitle}</span>
                      <span>
                        Page {pageData.pageIndex} of {pageData.totalPages}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </A4DocumentReviewWorkbench>
        </div>
      </div>
    </div>
  );
};
