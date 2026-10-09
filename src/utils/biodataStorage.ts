import { BiodataData } from '../types';

export interface BiodataDocumentMeta {
  id: string;
  name: string;
  documentType: BiodataData['documentType'];
  template: string;
  applicantName: string;
  lastModified: number;
}

const STORAGE_LIST_KEY = 'snapdoc_biodata_documents_list_v2';
const STORAGE_DOC_PREFIX = 'snapdoc_biodata_doc_v2_';
const ACTIVE_DOC_ID_KEY = 'snapdoc_biodata_active_id_v2';
const LEGACY_STORAGE_KEY = 'snapdoc_biodata_master_draft_v1';

export function getActiveDocumentId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_DOC_ID_KEY);
    if (id) return id;
  } catch {}
  return 'default';
}

export function setActiveDocumentId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_DOC_ID_KEY, id);
  } catch {}
}

export function listSavedDocuments(): BiodataDocumentMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_LIST_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.warn('Failed to parse saved documents list:', err);
  }
  return [];
}

function saveDocumentsList(list: BiodataDocumentMeta[]): void {
  try {
    localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save documents list:', err);
  }
}

export function loadDocument(id: string, fallbackInitial: BiodataData): BiodataData {
  try {
    const raw = localStorage.getItem(`${STORAGE_DOC_PREFIX}${id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...fallbackInitial,
        ...parsed,
        documentId: id,
        personalFields: parsed.personalFields || fallbackInitial.personalFields,
        familyFields: parsed.familyFields || fallbackInitial.familyFields,
        education: parsed.education || fallbackInitial.education,
        experience: parsed.experience || fallbackInitial.experience,
        skills: parsed.skills || fallbackInitial.skills,
        languagesDetailed: parsed.languagesDetailed || fallbackInitial.languagesDetailed,
        sections: parsed.sections || fallbackInitial.sections,
      };
    }

    // Check legacy draft if id is default
    if (id === 'default') {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        return {
          ...fallbackInitial,
          ...legacyParsed,
          documentId: 'default',
          documentName: legacyParsed.documentName || 'My Biodata Draft',
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load document, returning fallback:', err);
  }

  return {
    ...fallbackInitial,
    documentId: id,
    documentName: fallbackInitial.documentName || 'My Biodata',
  };
}

export function saveDocument(doc: BiodataData): void {
  const docId = doc.documentId || getActiveDocumentId();
  const applicantName =
    doc.personalFields.find((f) => f.id === 'fullName')?.value ||
    doc.applicantName ||
    'Untitled';

  const docName = doc.documentName || `${applicantName} - ${doc.documentTitle || 'Biodata'}`;
  const now = Date.now();

  const prepared: BiodataData = {
    ...doc,
    documentId: docId,
    documentName: docName,
    lastModified: now,
  };

  try {
    localStorage.setItem(`${STORAGE_DOC_PREFIX}${docId}`, JSON.stringify(prepared));
    // Also keep legacy sync for backwards compatibility
    if (docId === 'default') {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(prepared));
    }

    // Update metadata list
    const list = listSavedDocuments();
    const existingIdx = list.findIndex((m) => m.id === docId);
    const meta: BiodataDocumentMeta = {
      id: docId,
      name: docName,
      documentType: doc.documentType,
      template: doc.template,
      applicantName,
      lastModified: now,
    };

    if (existingIdx >= 0) {
      list[existingIdx] = meta;
    } else {
      list.unshift(meta);
    }

    saveDocumentsList(list);
  } catch (err) {
    console.warn('Failed to save document to localStorage:', err);
  }
}

export function createDocument(
  baseInitial: BiodataData,
  name?: string,
  docType?: BiodataData['documentType']
): BiodataData {
  const newId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const docName = name || `Biodata #${listSavedDocuments().length + 1}`;

  const newDoc: BiodataData = {
    ...baseInitial,
    documentId: newId,
    documentName: docName,
    documentType: docType || baseInitial.documentType,
    lastModified: Date.now(),
  };

  saveDocument(newDoc);
  setActiveDocumentId(newId);
  return newDoc;
}

export function duplicateDocument(
  sourceId: string,
  baseInitial: BiodataData
): BiodataData | null {
  const source = loadDocument(sourceId, baseInitial);
  if (!source) return null;

  const newId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const duplicate: BiodataData = {
    ...source,
    documentId: newId,
    documentName: `${source.documentName || 'Biodata'} (Copy)`,
    lastModified: Date.now(),
  };

  saveDocument(duplicate);
  setActiveDocumentId(newId);
  return duplicate;
}

export function renameDocument(id: string, newName: string): void {
  const list = listSavedDocuments();
  const meta = list.find((m) => m.id === id);
  if (meta) {
    meta.name = newName;
    meta.lastModified = Date.now();
    saveDocumentsList(list);
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_DOC_PREFIX}${id}`);
    if (raw) {
      const doc = JSON.parse(raw);
      doc.documentName = newName;
      doc.lastModified = Date.now();
      localStorage.setItem(`${STORAGE_DOC_PREFIX}${id}`, JSON.stringify(doc));
    }
  } catch {}
}

export function deleteDocument(id: string): void {
  try {
    localStorage.removeItem(`${STORAGE_DOC_PREFIX}${id}`);
    if (id === 'default') {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {}

  const list = listSavedDocuments().filter((m) => m.id !== id);
  saveDocumentsList(list);

  if (getActiveDocumentId() === id) {
    if (list.length > 0) {
      setActiveDocumentId(list[0].id);
    } else {
      setActiveDocumentId('default');
    }
  }
}
