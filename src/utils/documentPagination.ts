import { BiodataData, ResumeData, BiodataSectionItem } from '../types';

export interface BiodataPageSection {
  id: string;
  type: string;
  title: string;
  items?: any[];
  isContinuation?: boolean;
  content?: any;
}

export interface BiodataPageData {
  pageIndex: number;
  totalPages: number;
  showHeader: boolean;
  sections: BiodataPageSection[];
  showDeclaration: boolean;
}

export interface ResumePageSection {
  id: string;
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'languages' | 'certifications';
  title: string;
  items?: any[];
  content?: string;
}

export interface ResumePageData {
  pageIndex: number;
  totalPages: number;
  showHeader: boolean;
  sections: ResumePageSection[];
}

/**
 * Calculate usable page height in pixels for an A4 sheet (794px x 1123px at 96 DPI)
 */
export function getUsablePageHeight(
  pageMargins: 'narrow' | 'normal' | 'wide' = 'normal'
): number {
  const TOTAL_A4_HEIGHT = 1123;
  // Account for padding (top + bottom) and page numbering footer (~24px)
  const paddingMap = {
    narrow: 40 + 24, // 20px top, 20px bottom + footer
    normal: 64 + 24, // 32px top, 32px bottom + footer
    wide: 96 + 24,   // 48px top, 48px bottom + footer
  };
  return TOTAL_A4_HEIGHT - (paddingMap[pageMargins] || paddingMap.normal);
}

/**
 * Calculate estimated height of a section in pixels for A4 layout calculations
 */
export function estimateBiodataSectionHeight(sec: BiodataSectionItem, data: BiodataData): number {
  const TITLE_HEIGHT = 36; // Header title + padding + divider
  switch (sec.type) {
    case 'personal': {
      const active = (data.personalFields || []).filter(
        (f) => f.enabled && f.id !== 'fullName' && f.id !== 'phone' && f.id !== 'email' && f.id !== 'address'
      );
      if (active.length === 0) return 0;
      const rows = Math.ceil(active.length / 2);
      return TITLE_HEIGHT + rows * 24 + 10;
    }
    case 'education': {
      const count = data.education?.length || 0;
      if (count === 0) return 0;
      return TITLE_HEIGHT + 28 + count * 36;
    }
    case 'experience': {
      const exps = data.experience || [];
      if (exps.length === 0) return 0;
      const body = exps.reduce((acc, exp) => {
        const descLines = exp.description ? Math.ceil(exp.description.length / 85) : 1;
        return acc + 28 + descLines * 16 + 10;
      }, 0);
      return TITLE_HEIGHT + body;
    }
    case 'skills': {
      const skills = data.skills || [];
      if (skills.length === 0) return 0;
      const rows = Math.ceil(skills.length / 5);
      return TITLE_HEIGHT + rows * 28 + 6;
    }
    case 'languages': {
      const langs = data.languagesDetailed || [];
      if (langs.length === 0) return 0;
      const rows = Math.ceil(langs.length / 3);
      return TITLE_HEIGHT + rows * 24 + 6;
    }
    case 'family': {
      const fam = (data.familyFields || []).filter((f) => f.enabled);
      if (fam.length === 0 && !data.aboutFamily) return 0;
      const rows = Math.ceil(fam.length / 2);
      let h = TITLE_HEIGHT + rows * 46;
      if (data.aboutFamily) {
        const noteLines = Math.ceil(data.aboutFamily.length / 85);
        h += 26 + noteLines * 16;
      }
      return h;
    }
    case 'about': {
      if (!data.aboutMe) return 0;
      const lines = Math.ceil(data.aboutMe.length / 85);
      return TITLE_HEIGHT + lines * 18 + 10;
    }
    case 'hobbies': {
      if (!data.hobbies) return 0;
      return TITLE_HEIGHT + 30;
    }
    case 'custom': {
      const contentStr = String(sec.content || '');
      const lines = Math.max(1, Math.ceil(contentStr.length / 80));
      return TITLE_HEIGHT + lines * 18 + 8;
    }
    default:
      return 50;
  }
}

/**
 * Content-Aware Paginate Biodata / CV Data into discrete A4 Pages
 */
export function paginateBiodataData(data: BiodataData): BiodataPageData[] {
  const usableHeight = getUsablePageHeight(data.pageMargins);
  
  // Header height on Page 1 (Title, Contact info, Photo)
  let headerHeight = 0;
  if (data.showDocumentTitle) headerHeight += 50;
  headerHeight += 110; // Profile Name, Contact Info, Photo
  
  // Declaration & Signature block height
  const declarationHeight = data.includeDeclaration ? 135 : 0;

  // Single page mode: All enabled sections on 1 page
  if (data.pageLayout === '1-page' || data.autoFitOnePage) {
    const enabledSections: BiodataPageSection[] = data.sections
      .filter((sec) => sec.enabled && estimateBiodataSectionHeight(sec, data) > 0)
      .map((sec) => ({
        id: sec.id,
        type: sec.type,
        title: sec.title,
        content: sec.content,
      }));

    return [
      {
        pageIndex: 1,
        totalPages: 1,
        showHeader: true,
        sections: enabledSections,
        showDeclaration: data.includeDeclaration,
      },
    ];
  }

  const enabledSections = data.sections.filter(
    (sec) => sec.enabled && estimateBiodataSectionHeight(sec, data) > 0
  );

  const totalSectionHeight = enabledSections.reduce(
    (acc, s) => acc + estimateBiodataSectionHeight(s, data) + 12,
    0
  );

  // Forced 2-Page mode OR Auto mode that requires 2 pages:
  // Naturally balance content across both A4 sheets so Page 1 doesn't have huge empty space
  // while Page 2 is overcrowded!
  const isForced2Pages = data.pageLayout === '2-pages';
  const totalCombinedHeight = headerHeight + totalSectionHeight + declarationHeight;

  if (isForced2Pages || totalCombinedHeight <= usableHeight * 2 - 60) {
    // If auto mode fits on 1 page cleanly, return 1 page
    if (!isForced2Pages && totalCombinedHeight <= usableHeight) {
      return [
        {
          pageIndex: 1,
          totalPages: 1,
          showHeader: true,
          sections: enabledSections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            content: s.content,
          })),
          showDeclaration: data.includeDeclaration,
        },
      ];
    }

    // Distribute naturally across 2 pages
    // Target height on Page 1 to balance visually with Page 2
    const targetPage1SectionHeight = Math.min(
      usableHeight - headerHeight - 40,
      Math.max(280, (totalSectionHeight + declarationHeight - headerHeight) / 2)
    );

    const page1Sections: BiodataPageSection[] = [];
    const page2Sections: BiodataPageSection[] = [];
    let p1Height = 0;

    for (let i = 0; i < enabledSections.length; i++) {
      const sec = enabledSections[i];
      const secH = estimateBiodataSectionHeight(sec, data);
      const remainingSections = enabledSections.slice(i + 1);
      const remainingHeight = remainingSections.reduce(
        (acc, s) => acc + estimateBiodataSectionHeight(s, data) + 12,
        0
      );

      const fitsOnPage1 = p1Height + secH + headerHeight <= usableHeight - 30;
      const needOnPage1ForBalance = p1Height + secH <= targetPage1SectionHeight + 45;
      const page2WouldOverflow = remainingHeight + declarationHeight > usableHeight - 20;

      if (fitsOnPage1 && (needOnPage1ForBalance || page2WouldOverflow || page1Sections.length === 0)) {
        page1Sections.push({ id: sec.id, type: sec.type, title: sec.title, content: sec.content });
        p1Height += secH + 12;
      } else {
        page2Sections.push({ id: sec.id, type: sec.type, title: sec.title, content: sec.content });
      }
    }

    // Safety fallback: ensure neither page is completely empty
    if (page1Sections.length === 0 && page2Sections.length > 0) {
      page1Sections.push(page2Sections.shift()!);
    } else if (page2Sections.length === 0 && page1Sections.length > 1) {
      page2Sections.unshift(page1Sections.pop()!);
    }

    return [
      {
        pageIndex: 1,
        totalPages: 2,
        showHeader: true,
        sections: page1Sections,
        showDeclaration: false,
      },
      {
        pageIndex: 2,
        totalPages: 2,
        showHeader: false,
        sections: page2Sections,
        showDeclaration: data.includeDeclaration,
      },
    ];
  }

  // 3+ Page dynamic pagination for long curricula vitae / resumes
  const pages: BiodataPageData[] = [];
  let currentPageIndex = 1;
  let currentPageUsedHeight = headerHeight;
  let currentSections: BiodataPageSection[] = [];

  for (const sec of enabledSections) {
    const secH = estimateBiodataSectionHeight(sec, data);

    if (currentPageUsedHeight + secH <= usableHeight - 20) {
      currentSections.push({ id: sec.id, type: sec.type, title: sec.title, content: sec.content });
      currentPageUsedHeight += secH + 12;
    } else {
      if (currentSections.length > 0) {
        pages.push({
          pageIndex: currentPageIndex,
          totalPages: 0,
          showHeader: currentPageIndex === 1,
          sections: [...currentSections],
          showDeclaration: false,
        });

        currentPageIndex++;
        currentSections = [];
        currentPageUsedHeight = 0;
      }

      currentSections.push({ id: sec.id, type: sec.type, title: sec.title, content: sec.content });
      currentPageUsedHeight += secH + 12;
    }
  }

  // Declaration placement on the final page
  let declarationOnLastPage = false;
  if (data.includeDeclaration) {
    if (currentPageUsedHeight + declarationHeight <= usableHeight - 20) {
      declarationOnLastPage = true;
    } else {
      if (currentSections.length > 0) {
        pages.push({
          pageIndex: currentPageIndex,
          totalPages: 0,
          showHeader: currentPageIndex === 1,
          sections: [...currentSections],
          showDeclaration: false,
        });

        currentPageIndex++;
        currentSections = [];
        currentPageUsedHeight = 0;
      }
      declarationOnLastPage = true;
    }
  }

  if (currentSections.length > 0 || declarationOnLastPage) {
    pages.push({
      pageIndex: currentPageIndex,
      totalPages: 0,
      showHeader: currentPageIndex === 1,
      sections: currentSections,
      showDeclaration: declarationOnLastPage && data.includeDeclaration,
    });
  }

  if (pages.length === 0) {
    pages.push({
      pageIndex: 1,
      totalPages: 1,
      showHeader: true,
      sections: [],
      showDeclaration: data.includeDeclaration,
    });
  }

  const finalTotalPages = pages.length;
  return pages.map((p) => ({ ...p, totalPages: finalTotalPages }));
}

/**
 * Content-Aware Paginate Resume Data into discrete A4 Pages
 */
export function paginateResumeData(data: ResumeData): ResumePageData[] {
  const usableHeight = getUsablePageHeight();

  if (data.pageLayout === '1-page' || data.autoFitOnePage) {
    return [
      {
        pageIndex: 1,
        totalPages: 1,
        showHeader: true,
        sections: [
          { id: 'summary', type: 'summary', title: 'Professional Profile' },
          { id: 'experience', type: 'experience', title: 'Work Experience' },
          { id: 'education', type: 'education', title: 'Education' },
          { id: 'skills', type: 'skills', title: 'Key Skills & Technologies' },
          { id: 'projects', type: 'projects', title: 'Key Projects' },
        ],
      },
    ];
  }

  if (data.pageLayout === '2-pages') {
    return [
      {
        pageIndex: 1,
        totalPages: 2,
        showHeader: true,
        sections: [
          { id: 'summary', type: 'summary', title: 'Professional Profile' },
          { id: 'experience', type: 'experience', title: 'Work Experience' },
        ],
      },
      {
        pageIndex: 2,
        totalPages: 2,
        showHeader: false,
        sections: [
          { id: 'education', type: 'education', title: 'Education' },
          { id: 'skills', type: 'skills', title: 'Key Skills & Technologies' },
          { id: 'projects', type: 'projects', title: 'Key Projects' },
        ],
      },
    ];
  }

  // Dynamic Auto Mode
  let headerHeight = 110;
  let currentHeight = headerHeight;
  let currentSections: ResumePageSection[] = [];
  const pages: ResumePageData[] = [];
  let pageIndex = 1;

  const sectionsToProcess: ResumePageSection[] = [
    { id: 'summary', type: 'summary', title: 'Professional Profile' },
    { id: 'experience', type: 'experience', title: 'Work Experience' },
    { id: 'education', type: 'education', title: 'Education' },
    { id: 'skills', type: 'skills', title: 'Key Skills & Technologies' },
    { id: 'projects', type: 'projects', title: 'Key Projects' },
  ];

  for (const sec of sectionsToProcess) {
    let secHeight = 30;
    if (sec.type === 'summary' && data.summary) {
      secHeight += Math.ceil(data.summary.length / 70) * 18;
    } else if (sec.type === 'experience' && data.experience) {
      secHeight += data.experience.reduce((acc, exp) => {
        const descLines = exp.description ? Math.ceil(exp.description.length / 60) : 1;
        return acc + 35 + descLines * 16;
      }, 0);
    } else if (sec.type === 'education' && data.education) {
      secHeight += data.education.length * 40;
    } else if (sec.type === 'skills' && data.skills) {
      secHeight += Math.ceil(data.skills.length / 4) * 28;
    } else if (sec.type === 'projects' && data.projects) {
      secHeight += data.projects.reduce((acc, proj) => {
        const descLines = proj.description ? Math.ceil(proj.description.length / 60) : 1;
        return acc + 35 + descLines * 16;
      }, 0);
    }

    if (secHeight <= 30) continue; // Skip empty section

    if (currentHeight + secHeight <= usableHeight) {
      currentSections.push(sec);
      currentHeight += secHeight + 12;
    } else {
      if (currentSections.length > 0) {
        pages.push({
          pageIndex,
          totalPages: 0,
          showHeader: pageIndex === 1,
          sections: [...currentSections],
        });
        pageIndex++;
        currentSections = [];
        currentHeight = 0;
      }
      currentSections.push(sec);
      currentHeight += secHeight + 12;
    }
  }

  if (currentSections.length > 0) {
    pages.push({
      pageIndex,
      totalPages: 0,
      showHeader: pageIndex === 1,
      sections: currentSections,
    });
  }

  if (pages.length === 0) {
    pages.push({
      pageIndex: 1,
      totalPages: 1,
      showHeader: true,
      sections: sectionsToProcess,
    });
  }

  const totalPages = pages.length;
  return pages.map((p) => ({ ...p, totalPages }));
}

/**
 * Regression Test Dataset for Multi-Page Content Testing
 */
export const MULTI_PAGE_REGRESSION_TEST_BIODATA: Partial<BiodataData> = {
  documentTitle: 'CURRICULUM VITAE (REGRESSION TEST)',
  subtitle: 'Comprehensive Multi-Page Verification Document',
  
  personalFields: [
    { id: 'fullName', label: 'Full Name', value: 'Tanvir Ahmed Mazumder (তানভীর আহমেদ মজুমদার)', enabled: true },
    { id: 'fatherName', label: "Father's Name", value: 'Late Mahbubur Rahman Mazumder', enabled: true },
    { id: 'motherName', label: "Mother's Name", value: 'Begum Rokeya Mazumder', enabled: true },
    { id: 'dob', label: 'Date of Birth', value: '1995-11-24', enabled: true },
    { id: 'gender', label: 'Gender', value: 'Male (পুরুষ)', enabled: true },
    { id: 'maritalStatus', label: 'Marital Status', value: 'Unmarried (অবিবাহিত)', enabled: true },
    { id: 'nationality', label: 'Nationality', value: 'Bangladeshi / Indian', enabled: true },
    { id: 'religion', label: 'Religion', value: 'Islam (ইসলাম)', enabled: true },
    { id: 'bloodGroup', label: 'Blood Group', value: 'B+ (Positive)', enabled: true },
    { id: 'phone', label: 'Phone Number', value: '+880 1711-908234 / +91 98301-22910', enabled: true },
    { id: 'email', label: 'Email Address', value: 'tanvir.mazumder.official@gmail.com', enabled: true },
    { id: 'address', label: 'Present Address', value: 'House 42, Road 11, Block D, Banani, Dhaka-1213 / Park Circus, Kolkata WB', enabled: true },
  ],

  education: [
    {
      id: 'edu1',
      qualification: 'Master of Science (M.Sc) in Computer Science & Engineering',
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      boardUniversity: 'BUET Academic Council',
      year: '2019',
      percentageGrade: 'CGPA 3.92 out of 4.00 (Distinction)',
    },
    {
      id: 'edu2',
      qualification: 'Bachelor of Science (B.Sc) in Computer Science & Technology',
      institution: 'Dhaka University (DU) / Heritage Institute of Technology',
      boardUniversity: 'University of Dhaka / MAKAUT',
      year: '2017',
      percentageGrade: 'CGPA 3.88 out of 4.00 (First Class First)',
    },
    {
      id: 'edu3',
      qualification: 'Higher Secondary Certificate (HSC - Science)',
      institution: 'Notre Dame College, Dhaka',
      boardUniversity: 'Dhaka Education Board',
      year: '2013',
      percentageGrade: 'GPA 5.00 out of 5.00 (Golden A+)',
    },
    {
      id: 'edu4',
      qualification: 'Secondary School Certificate (SSC - Science)',
      institution: 'Government Laboratory High School, Dhaka',
      boardUniversity: 'Dhaka Education Board',
      year: '2011',
      percentageGrade: 'GPA 5.00 out of 5.00 (Golden A+)',
    },
  ],

  experience: [
    {
      id: 'exp1',
      company: 'Brain Station 23 / Lead Software Architect',
      position: 'Staff Software Architect & Tech Lead',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description:
        'Directing cloud-native enterprise application development, distributed database clustering, microservices performance optimization, and mentoring senior engineering teams across South Asia.',
    },
    {
      id: 'exp2',
      company: 'Samsung R&D Institute / Senior Software Engineer',
      position: 'Senior Software Engineer (Mobile & Cloud Systems)',
      startDate: 'Jul 2018',
      endDate: 'Dec 2020',
      description:
        'Architected real-time asynchronous document parsing engines, multi-thread canvas rendering modules, and secure client-side cryptographic storage integrations.',
    },
    {
      id: 'exp3',
      company: 'Kona Software Lab / Junior Systems Engineer',
      position: 'Systems & Algorithm Engineer',
      startDate: 'Jan 2017',
      endDate: 'Jun 2018',
      description:
        'Implemented high-throughput data processing algorithms, PDF rendering primitives, and UTF-8 Bengali Unicode font parser routines.',
    },
  ],

  aboutMe:
    'I am a passionate software engineer with over 7 years of hands-on experience building scalable applications. I specialize in document rendering systems, clean architecture, and localized user interfaces in Bengali and English. (আমি একজন প্রফেশনাল সফটওয়্যার প্রকৌশলী যিনি দীর্ঘ ৭ বছর ধরে আধুনিক ওয়েব অ্যাপ্লিকেশন এবং ডকুমেন্ট অটোমেশন সিস্টেমে কাজ করছেন।)',

  aboutFamily:
    'Highly respectable educational background and culturally rooted Sunni Muslim family with strong ethics. (আমাদের পরিবার একটি সুশিক্ষিত, মার্জিত ও সম্ভ্রান্ত মুসলিম পরিবার।)',

  includeDeclaration: true,
  declarationText:
    'I hereby solemnly affirm and declare that all statements made in this curriculum vitae are true, complete and correct to the best of my knowledge and belief. (আমি সজ্ঞানে ঘোষণা করছি যে উপরে প্রদত্ত সকল বিবরণ সম্পূর্ণ সত্য ও সঠিক।)',
  place: 'Dhaka / Kolkata',
  date: new Date().toLocaleDateString('en-GB'),
  showDate: true,
  signatureType: 'type',
  signatureText: 'Tanvir Ahmed Mazumder',
  applicantName: 'Tanvir Ahmed Mazumder',
  showApplicantName: true,
  pageLayout: 'auto',
  autoFitOnePage: false,
};
