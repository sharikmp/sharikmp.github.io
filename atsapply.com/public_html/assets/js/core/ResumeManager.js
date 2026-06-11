/**
 * ResumeManager.js
 *
 * Owns all CRUD, versioning, and duplication of resume documents.
 * Works through StorageService so the rest of the app never calls
 * IndexedDB / LocalStorage directly.
 *
 * Resume schema:
 * {
 *   id, name, createdAt, updatedAt, atsScore,
 *   template: 'classic' | 'professional' | 'minimal',
 *   personal:  { fullName, title, email, phone, city, country, linkedin, github, portfolio },
 *   summary:   string,
 *   skills:    string[],
 *   experience: [{ id, company, role, location, startDate, endDate, current, bullets: string[] }],
 *   education:  [{ id, institution, degree, field, startYear, endYear, cgpa }],
 *   projects:   [{ id, name, description, tech, github, live }],
 *   certifications: [{ id, name, org, issueDate, credentialUrl }],
 *   achievements: string[],
 *   languages:    string[],
 *   targetRole:   string,
 * }
 */

import { storageService } from '../services/StorageService.js';
import { uid, deepClone } from '../utils/helpers.js';

/** Blank resume template to seed new documents. */
export const BLANK_RESUME = () => ({
  id:        uid(),
  name:      'My Resume',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  atsScore:  0,
  template:  'classic',
  personal: {
    fullName:  '',
    title:     '',
    email:     '',
    phone:     '',
    city:      '',
    country:   '',
    linkedin:  '',
    github:    '',
    portfolio: '',
  },
  summary:        '',
  skills:         [],
  experience:     [],
  education:      [],
  projects:       [],
  certifications: [],
  achievements:   [],
  languages:      [],
  targetRole:     '',
});

/** Schema version – bump when shape changes, drive migration logic. */
const SCHEMA_VERSION = 1;

class ResumeManager {
  constructor() {
    this._listeners = [];     // change subscribers
  }

  /* ────────────────────────────────────────────────────────────
     CRUD
  ──────────────────────────────────────────────────────────── */

  async getAll() {
    return storageService.getAllResumes();
  }

  async get(id) {
    const resume = await storageService.getResume(id);
    if (!resume) return null;
    return this._migrate(resume);
  }

  async create(partial = {}) {
    const resume = Object.assign(BLANK_RESUME(), partial);
    await storageService.saveResume(resume);
    this._emit('created', resume);
    return resume;
  }

  async save(resume) {
    const saved = await storageService.saveResume(resume);
    this._emit('saved', saved);
    return saved;
  }

  async delete(id) {
    const resume = await storageService.getResume(id);
    await storageService.deleteResume(id);
    this._emit('deleted', { id, resume });
    return resume;
  }

  /** Duplicate a resume, appending "(Copy)" to the name. */
  async duplicate(id) {
    const original = await this.get(id);
    if (!original) throw new Error(`Resume ${id} not found`);
    const copy = deepClone(original);
    copy.id        = uid();
    copy.name      = original.name + ' (Copy)';
    copy.createdAt = Date.now();
    copy.updatedAt = Date.now();
    await storageService.saveResume(copy);
    this._emit('created', copy);
    return copy;
  }

  /* ────────────────────────────────────────────────────────────
     Entry helpers (experience / education / etc.)
  ──────────────────────────────────────────────────────────── */

  addExperience(resume) {
    resume.experience.push({
      id: uid(), company: '', role: '', location: '',
      startDate: '', endDate: '', current: false, bullets: [''],
    });
    return resume;
  }

  removeExperience(resume, entryId) {
    resume.experience = resume.experience.filter(e => e.id !== entryId);
    return resume;
  }

  addEducation(resume) {
    resume.education.push({
      id: uid(), institution: '', degree: '', field: '',
      startYear: '', endYear: '', cgpa: '',
    });
    return resume;
  }

  removeEducation(resume, entryId) {
    resume.education = resume.education.filter(e => e.id !== entryId);
    return resume;
  }

  addProject(resume) {
    resume.projects.push({
      id: uid(), name: '', description: '', tech: '', github: '', live: '',
    });
    return resume;
  }

  removeProject(resume, entryId) {
    resume.projects = resume.projects.filter(e => e.id !== entryId);
    return resume;
  }

  addCertification(resume) {
    resume.certifications.push({
      id: uid(), name: '', org: '', issueDate: '', credentialUrl: '',
    });
    return resume;
  }

  removeCertification(resume, entryId) {
    resume.certifications = resume.certifications.filter(e => e.id !== entryId);
    return resume;
  }

  /* ────────────────────────────────────────────────────────────
     Import / Export
  ──────────────────────────────────────────────────────────── */

  exportJSON(resume) {
    return JSON.stringify({ _version: SCHEMA_VERSION, resume }, null, 2);
  }

  importJSON(jsonStr) {
    let parsed;
    try { parsed = JSON.parse(jsonStr); }
    catch { throw new Error('Invalid JSON — could not parse file.'); }

    // Support bare resume object or wrapped { _version, resume }
    const data = parsed.resume ?? parsed;

    // Basic schema validation
    if (typeof data !== 'object' || !data.personal || !Array.isArray(data.skills)) {
      throw new Error('Invalid resume schema. File may be corrupt or from an incompatible source.');
    }

    const resume = this._migrate(data);
    resume.id        = uid(); // always assign new id on import
    resume.createdAt = Date.now();
    resume.updatedAt = Date.now();
    return resume;
  }

  /* ────────────────────────────────────────────────────────────
     Migration (schema evolution safety net)
  ──────────────────────────────────────────────────────────── */

  _migrate(resume) {
    // Ensure all top-level arrays exist (guards against older saved data)
    const lists = ['skills', 'experience', 'education', 'projects', 'certifications', 'achievements', 'languages'];
    lists.forEach(k => { if (!Array.isArray(resume[k])) resume[k] = []; });
    if (!resume.personal) resume.personal = BLANK_RESUME().personal;
    if (!resume.template) resume.template = 'classic';
    if (!resume.targetRole) resume.targetRole = '';
    return resume;
  }

  /* ────────────────────────────────────────────────────────────
     Change pub/sub
  ──────────────────────────────────────────────────────────── */

  onChange(fn) { this._listeners.push(fn); }

  _emit(event, payload) {
    this._listeners.forEach(fn => fn(event, payload));
  }
}

export const resumeManager = new ResumeManager();
