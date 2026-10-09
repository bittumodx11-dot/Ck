import React, { useState } from 'react';
import {
  listSavedDocuments,
  deleteDocument,
  renameDocument,
  duplicateDocument,
  BiodataDocumentMeta,
} from '../../../utils/biodataStorage';
import { BiodataData } from '../../../types';
import {
  X,
  FileText,
  Copy,
  Edit2,
  Trash2,
  Check,
  Plus,
  Download,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DocumentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocId: string;
  onOpenDocument: (id: string) => void;
  onCreateNewDocument: () => void;
  currentData: BiodataData;
}

export const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({
  isOpen,
  onClose,
  activeDocId,
  onOpenDocument,
  onCreateNewDocument,
  currentData,
}) => {
  const [docs, setDocs] = useState<BiodataDocumentMeta[]>(() => listSavedDocuments());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  if (!isOpen) return null;

  const refreshList = () => {
    setDocs(listSavedDocuments());
  };

  const handleStartRename = (doc: BiodataDocumentMeta) => {
    setEditingId(doc.id);
    setEditingName(doc.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameDocument(id, editingName.trim());
      setEditingId(null);
      refreshList();
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteDocument(id);
      refreshList();
      if (activeDocId === id) {
        onOpenDocument('default');
      }
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateDocument(id, currentData);
    if (dup) {
      refreshList();
      onOpenDocument(dup.documentId || 'default');
      onClose();
    }
  };

  const handleExportBackup = () => {
    try {
      const allDocs = listSavedDocuments().map((meta) => {
        const raw = localStorage.getItem(`snapdoc_biodata_doc_v2_${meta.id}`);
        return raw ? JSON.parse(raw) : null;
      }).filter(Boolean);

      const blob = new Blob([JSON.stringify(allDocs, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapdoc_biodatas_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup: ' + err);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          parsed.forEach((docItem) => {
            if (docItem && docItem.documentId) {
              localStorage.setItem(
                `snapdoc_biodata_doc_v2_${docItem.documentId}`,
                JSON.stringify(docItem)
              );
            }
          });
          refreshList();
          alert(`Successfully imported ${parsed.length} biodatas!`);
        }
      } catch (err) {
        alert('Invalid backup file: ' + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                My Saved Biodata Documents
              </h3>
              <p className="text-xs text-slate-500">
                Create, switch between, duplicate, and manage all your saved CV and biodata drafts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/60 dark:bg-slate-900/60">
          <button
            onClick={() => {
              onCreateNewDocument();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> New Biodata Document
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              title="Download backup file of all documents"
            >
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <label
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              title="Restore from JSON backup file"
            >
              <Upload className="w-3.5 h-3.5" /> Restore
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>

        {/* Documents List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5 max-h-[50vh]">
          {docs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  Active Document Auto-Saved
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your current draft is saved automatically in your browser's local storage.
                </p>
              </div>
            </div>
          ) : (
            docs.map((d) => {
              const isActive = activeDocId === d.id;
              const isEditing = editingId === d.id;
              const formattedDate = new Date(d.lastModified).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={d.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(d.id)}
                            className="px-2 py-1 text-xs rounded border border-indigo-400 bg-white dark:bg-slate-900 flex-1 font-semibold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(d.id)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {d.name}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                        <span className="capitalize">{d.documentType.replace(/-/g, ' ')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onOpenDocument(d.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs cursor-pointer"
                      >
                        Open
                      </button>
                    )}

                    <button
                      onClick={() => handleStartRename(d)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(d.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
