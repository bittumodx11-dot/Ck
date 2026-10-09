import React, { useState, useRef } from 'react';
import { ResumeData, EducationEntry, ExperienceEntry } from '../../../types';
import { FileBadge, Printer, Download, Plus, Trash2, Check, Sparkles, Sliders, Type } from 'lucide-react';
import { DocumentExportBar } from './DocumentExportBar';
import { A4DocumentReviewWorkbench } from './A4DocumentReviewWorkbench';
import { PROFESSIONAL_FONTS, getCssFontFamily } from '../../../utils/fontConstants';
import { paginateResumeData } from '../../../utils/documentPagination';

const INITIAL_RESUME: ResumeData = {
  template: 'modern',
  fontFamily: 'inter',
  pageDensity: 'compact',
  autoFitOnePage: true,
  fontScale: 'standard',
  fullName: 'Arjun Dasgupta',
  jobTitle: 'Senior Frontend Engineer & UI Specialist',
  email: 'arjun.dasgupta@example.com',
  phone: '+91 98301 23456',
  location: 'Kolkata, India',
  website: 'https://arjuncodes.dev',
  linkedin: 'linkedin.com/in/arjundasgupta',
  summary:
    'Dedicated Software Engineer with 4+ years of expertise in architecting high-performance React applications, TypeScript architectures, and client-side web utility tools.',
  photoUrl: null,
  education: [
    {
      id: 'e1',
      qualification: 'B.Tech Computer Science & Engineering',
      institution: 'Jadavpur University',
      boardUniversity: 'State University',
      year: '2020',
      percentageGrade: '8.8 CGPA',
    },
  ],
  experience: [
    {
      id: 'x1',
      company: 'Digital Innovation Labs',
      position: 'Senior Frontend Developer',
      startDate: '2022',
      endDate: 'Present',
      description:
        'Spearheaded modern web portals, client-side canvas engines, and reduced page load times by 45%.',
    },
    {
      id: 'x2',
      company: 'NextGen Solutions',
      position: 'Web Application Engineer',
      startDate: '2020',
      endDate: '2022',
      description:
        'Engineered responsive web applications and integrated REST & GraphQL APIs with zero downtime.',
    },
  ],
  skills: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5 Canvas', 'REST APIs', 'Git'],
  projects: [
    {
      id: 'p1',
      title: 'SnapDoc Client Studio',
      description: 'Privacy-first browser utility suite for image manipulation and PDF workflows.',
      technologies: 'React, TypeScript, Web APIs',
      link: 'github.com/example/snapdoc',
    },
  ],
  languages: ['English (Fluent)', 'Bengali (Native)', 'Hindi (Conversational)'],
  certifications: ['AWS Certified Cloud Practitioner', 'Meta Frontend Developer Professional Certificate'],
};

export const ResumeMakerTool: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_RESUME);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'design'
  >('profile');
  const previewResumeRef = useRef<HTMLDivElement>(null);

  const addExperience = () => {
    const newExp: ExperienceEntry = {
      id: Math.random().toString(36).substring(2, 9),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setData((p) => ({ ...p, experience: [...p.experience, newExp] }));
  };

  const removeExperience = (id: string) => {
    setData((p) => ({ ...p, experience: p.experience.filter((x) => x.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: Math.random().toString(36).substring(2, 9),
      qualification: '',
      institution: '',
      boardUniversity: '',
      year: '',
      percentageGrade: '',
    };
    setData((p) => ({ ...p, education: [...p.education, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setData((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Professional ATS-Ready Resume Builder
          </h3>
          <p className="text-xs text-slate-500">Live preview & 1-click A4 PDF, JPG, JPEG export</p>
        </div>

        {/* Action Buttons: A4 PDF, JPG, JPEG download */}
        <DocumentExportBar
          getDocumentElement={() => previewResumeRef.current}
          baseFilename={`${data.fullName || 'Professional'}_Resume`}
          documentTitle="ATS Resume"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Sidebar */}
        <div className="no-print lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-[85vh] overflow-y-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'design', label: 'Font & Layout' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => setData((p) => ({ ...p, jobTitle: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData((p) => ({ ...p, location: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Summary
                </label>
                <textarea
                  value={data.summary}
                  onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Work History
                </span>
                <button
                  onClick={addExperience}
                  className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Job
                </button>
              </div>

              {data.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Position #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Position / Job Title"
                    value={exp.position}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        experience: p.experience.map((x) =>
                          x.id === exp.id ? { ...x, position: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        experience: p.experience.map((x) =>
                          x.id === exp.id ? { ...x, company: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Start (e.g. 2021)"
                      value={exp.startDate}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          experience: p.experience.map((x) =>
                            x.id === exp.id ? { ...x, startDate: e.target.value } : x
                          ),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="End (e.g. Present)"
                      value={exp.endDate}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          experience: p.experience.map((x) =>
                            x.id === exp.id ? { ...x, endDate: e.target.value } : x
                          ),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <textarea
                    placeholder="Responsibilities and achievements..."
                    rows={2}
                    value={exp.description}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        experience: p.experience.map((x) =>
                          x.id === exp.id ? { ...x, description: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Education</span>
                <button
                  onClick={addEducation}
                  className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              </div>

              {data.education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Degree #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Degree / Major"
                    value={edu.qualification}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        education: p.education.map((x) =>
                          x.id === edu.id ? { ...x, qualification: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Institution / University"
                    value={edu.institution}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        education: p.education.map((x) =>
                          x.id === edu.id ? { ...x, institution: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          education: p.education.map((x) =>
                            x.id === edu.id ? { ...x, year: e.target.value } : x
                          ),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Grade / GPA"
                      value={edu.percentageGrade}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          education: p.education.map((x) =>
                            x.id === edu.id ? { ...x, percentageGrade: e.target.value } : x
                          ),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={data.skills.join(', ')}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      skills: e.target.value.split(',').map((s) => s.trim()),
                    }))
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Languages
                </label>
                <input
                  type="text"
                  value={data.languages.join(', ')}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      languages: e.target.value.split(',').map((s) => s.trim()),
                    }))
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4 text-xs">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        projects: p.projects.map((x) =>
                          x.id === proj.id ? { ...x, title: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (e.g. React, Node.js)"
                    value={proj.technologies}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        projects: p.projects.map((x) =>
                          x.id === proj.id ? { ...x, technologies: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <textarea
                    placeholder="Brief description..."
                    rows={2}
                    value={proj.description}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        projects: p.projects.map((x) =>
                          x.id === proj.id ? { ...x, description: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              ))}
            </div>
          )}
          {activeTab === 'design' && (
            <div className="space-y-4 text-xs">
              {/* 1-Page Auto Fit */}
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
                      setData((p) => ({
                        ...p,
                        autoFitOnePage: e.target.checked,
                        pageDensity: e.target.checked ? 'compact' : p.pageDensity,
                      }))
                    }
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  রেজিউমের সম্পূর্ণ টেক্সট একটিমাত্র A4 পেজে ফিট করার জন্য স্বয়ংক্রিয়ভাবে স্পেসিং ও ফন্ট সমন্বয় করে দেবে।
                </p>
              </div>

              {/* Density Mode */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  স্পেসিং ও ঘনত্ব (Spacing Density)
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
                      onClick={() => setData((p) => ({ ...p, pageDensity: d.id as any }))}
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
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-1 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                  {PROFESSIONAL_FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setData((p) => ({ ...p, fontFamily: f.id as any }))}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        data.fontFamily === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            data.fontFamily === f.id ? 'text-white' : 'text-slate-900 dark:text-slate-100'
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
                        className={`text-[10px] mt-0.5 truncate ${
                          data.fontFamily === f.id ? 'text-indigo-100' : 'text-slate-400'
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
                      onClick={() => setData((p) => ({ ...p, fontScale: s.id as any }))}
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
            </div>
          )}
        </div>

        {/* Live Clean Resume Preview (A4 Printable) */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <A4DocumentReviewWorkbench
            documentRef={previewResumeRef}
            currentFont={data.fontFamily || 'inter'}
            onFontChange={(fontId) => setData((p) => ({ ...p, fontFamily: fontId as any }))}
            pageDensity={data.pageDensity || 'compact'}
            onDensityChange={(density) => setData((p) => ({ ...p, pageDensity: density }))}
            autoFitOnePage={data.autoFitOnePage ?? true}
            onAutoFitToggle={(val) => setData((p) => ({ ...p, autoFitOnePage: val }))}
            fontScale={data.fontScale || 'standard'}
            onFontScaleChange={(scale) => setData((p) => ({ ...p, fontScale: scale }))}
            documentTitle={`${data.fullName || 'Professional'}_Resume`}
          >
            <div ref={previewResumeRef} id="printable-resume" className="w-[794px] min-w-[794px] space-y-6 mx-auto">
              {paginateResumeData(data).map((pageData) => (
                <div
                  key={pageData.pageIndex}
                  className="a4-page relative w-[794px] min-w-[794px] max-w-[794px] shrink-0 min-h-[1123px] max-h-[1123px] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 ring-1 ring-slate-900/5 flex flex-col justify-between overflow-hidden box-border p-8 transition-all print:my-0 print:shadow-none print:border-none print:break-after-page"
                  style={{
                    width: '794px',
                    minWidth: '794px',
                    maxWidth: '794px',
                    minHeight: '1123px',
                    maxHeight: '1123px',
                    boxSizing: 'border-box',
                    fontFamily: getCssFontFamily(data.fontFamily || 'inter'),
                    fontSize:
                      data.autoFitOnePage || data.pageDensity === 'ultra-compact'
                        ? '11.5px'
                        : data.fontScale === 'large'
                        ? '13.5px'
                        : '12.5px',
                  }}
                >
                  <div className="flex-1 space-y-4">
                    {/* Page Header (Page 1 only) */}
                    {pageData.showHeader && (
                      <div className="border-b-2 border-slate-900 pb-3 mb-3.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                          {data.fullName}
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold text-indigo-700 mt-0.5">{data.jobTitle}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
                          <span>{data.email}</span>
                          <span>•</span>
                          <span>{data.phone}</span>
                          <span>•</span>
                          <span>{data.location}</span>
                        </div>
                      </div>
                    )}

                    {/* Page Sections */}
                    <div className="space-y-4">
                      {pageData.sections.map((sec) => (
                        <React.Fragment key={sec.id}>
                          {sec.type === 'summary' && data.summary && (
                            <div className="w-full">
                              <div className="w-full mb-1.5">
                                <h2 className="a4-section-header-title text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap inline-block">
                                  Professional Profile
                                </h2>
                                <div className="w-full mt-1 border-b border-slate-200" />
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed break-words whitespace-normal">{data.summary}</p>
                            </div>
                          )}

                          {sec.type === 'experience' && data.experience.length > 0 && (
                            <div className="w-full">
                              <div className="w-full mb-2">
                                <h2 className="a4-section-header-title text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap inline-block">
                                  Work Experience
                                </h2>
                                <div className="w-full mt-1 border-b border-slate-200" />
                              </div>
                              <div className="space-y-3">
                                {data.experience.map((exp) => (
                                  <div key={exp.id} className="text-xs space-y-1 pb-2 border-b border-slate-100 last:border-none">
                                    <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                                      <div className="font-bold text-slate-900 leading-snug flex-1 min-w-[200px]">
                                        <span className="text-slate-950 font-extrabold">{exp.position}</span>
                                        {exp.company && (
                                          <span className="text-indigo-900 font-semibold"> — {exp.company}</span>
                                        )}
                                      </div>
                                      {(exp.startDate || exp.endDate) && (
                                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0 font-medium">
                                          {exp.startDate} – {exp.endDate}
                                        </span>
                                      )}
                                    </div>
                                    {exp.description && (
                                      <p className="text-slate-700 mt-1 leading-relaxed break-words whitespace-pre-line text-[11.5px]">
                                        {exp.description}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sec.type === 'education' && data.education.length > 0 && (
                            <div className="w-full">
                              <div className="w-full mb-2">
                                <h2 className="a4-section-header-title text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap inline-block">
                                  Education
                                </h2>
                                <div className="w-full mt-1 border-b border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                {data.education.map((edu) => (
                                  <div key={edu.id} className="text-xs flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-slate-900 break-words whitespace-normal">{edu.qualification}</div>
                                      <div className="text-slate-600 break-words whitespace-normal">{edu.institution}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="font-mono text-slate-500 text-[10px]">{edu.year}</div>
                                      <div className="font-semibold text-slate-800">{edu.percentageGrade}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sec.type === 'skills' && data.skills.length > 0 && (
                            <div className="w-full">
                              <div className="w-full mb-1.5">
                                <h2 className="a4-section-header-title text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap inline-block">
                                  Key Skills & Technologies
                                </h2>
                                <div className="w-full mt-1 border-b border-slate-200" />
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {data.skills.map((skill, i) => (
                                  <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {sec.type === 'projects' && data.projects.length > 0 && (
                            <div className="w-full">
                              <div className="w-full mb-1.5">
                                <h2 className="a4-section-header-title text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap inline-block">
                                  Key Projects
                                </h2>
                                <div className="w-full mt-1 border-b border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                {data.projects.map((proj) => (
                                  <div key={proj.id} className="text-xs">
                                    <div className="font-bold text-slate-900">
                                      {proj.title} <span className="font-normal text-slate-500 text-[10px]">({proj.technologies})</span>
                                    </div>
                                    <p className="text-slate-600 mt-0.5">{proj.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="no-print-pdf text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <span>{data.fullName} Resume</span>
                    <span>
                      Page {pageData.pageIndex} of {pageData.totalPages}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </A4DocumentReviewWorkbench>
        </div>
      </div>
    </div>
  );
};
