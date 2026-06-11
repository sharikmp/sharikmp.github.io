/**
 * App.js – Top-level controller.
 *
 * Responsibilities:
 *   • Boot sequence (storage ready → render dashboard)
 *   • Page routing (dashboard ↔ builder)
 *   • Global event wiring (keyboard shortcuts, navbar)
 *   • Autosave coordinator
 */

import { storageService }      from '../services/StorageService.js';
import { resumeManager, BLANK_RESUME } from './ResumeManager.js';
import { atsAnalyzer }         from './ATSAnalyzer.js';
import { PreviewRenderer }     from '../modules/PreviewRenderer.js';
import { pdfGenerator }        from '../modules/PDFGenerator.js';
import { importExportService } from '../modules/ImportExportService.js';
import { toastService }        from '../modules/ToastService.js';
import { debounce, uid, sanitize, relativeTime, deepClone, truncate } from '../utils/helpers.js';

/* ── Skill suggestions (shown in the tag input) ─────────────────── */
const SKILL_SUGGESTIONS = [
  'JavaScript','TypeScript','React','Vue','Angular','Node.js','Express',
  'Python','Django','Flask','FastAPI','Java','Spring Boot','Kotlin',
  'PHP','Laravel','Ruby on Rails','Go','Rust','C#','.NET','Swift',
  'HTML','CSS','Sass','Tailwind CSS','Bootstrap',
  'PostgreSQL','MySQL','MongoDB','Redis','SQLite','Elasticsearch',
  'Docker','Kubernetes','AWS','Azure','GCP','Terraform',
  'Git','GitHub Actions','CI/CD','Jenkins','Linux','Bash',
  'REST API','GraphQL','gRPC','WebSockets','Microservices',
  'Playwright','Selenium','Cypress','Jest','Mocha','JUnit','TestNG',
  'Agile','Scrum','JIRA','Figma','Adobe XD',
  'Machine Learning','TensorFlow','PyTorch','Pandas','NumPy','Scikit-learn',
  'SQL','Data Analysis','Data Visualization','Tableau','Power BI',
  'API Testing','Automation Testing','Manual Testing','Regression Testing',
];

class App {
  constructor() {
    this._resume          = null;   // currently open resume
    this._preview         = null;   // PreviewRenderer instance
    this._deletedResume   = null;   // for undo-delete
    this._autosaveTimer   = null;
    this._saveStatus      = 'idle'; // 'idle' | 'saving' | 'saved'
    this._skillSuggRef    = null;   // active suggestion dropdown

    // Bind debounced save
    this._debouncedSave = debounce(() => this._doSave(), 1000);
  }

  /* ────────────────────────────────────────────────────────────
     Boot
  ──────────────────────────────────────────────────────────── */

  async init() {
    await storageService.ready();
    this._registerGlobalShortcuts();
    this._showPage('dashboard');
    await this._renderDashboard();
  }

  /* ────────────────────────────────────────────────────────────
     Routing
  ──────────────────────────────────────────────────────────── */

  _showPage(name) {
    document.querySelectorAll('.app-page').forEach(el => {
      el.style.display = el.id === `page-${name}` ? '' : 'none';
    });
  }

  /* ────────────────────────────────────────────────────────────
     Dashboard
  ──────────────────────────────────────────────────────────── */

  async _renderDashboard() {
    const resumes = await resumeManager.getAll();
    const grid    = document.getElementById('resume-grid');
    if (!grid) return;

    // Sort newest first
    resumes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    const newCard = `
      <div class="resume-card-new" id="btn-new-resume" tabindex="0" role="button" aria-label="Create new resume">
        <div class="icon-wrap"><i class="fa-solid fa-plus"></i></div>
        <span class="fw-600">Create New Resume</span>
        <span style="font-size:.78rem;color:inherit">Start from scratch</span>
      </div>`;

    if (resumes.length === 0) {
      grid.innerHTML = newCard + `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-illustration"><i class="fa-solid fa-file-lines"></i></div>
          <h3 class="mb-2">No resumes yet</h3>
          <p class="text-muted mb-3" style="max-width:360px;margin:0 auto .75rem">
            Create your first ATS-optimised resume in minutes.
          </p>
          <button class="btn btn-primary btn-new-resume-2">
            <i class="fa-solid fa-plus"></i> New Resume
          </button>
        </div>`;
    } else {
      const cards = resumes.map(r => this._resumeCard(r)).join('');
      grid.innerHTML = newCard + cards;
    }

    this._bindDashboardEvents();
  }

  _resumeCard(r) {
    const score = r.atsScore || 0;
    const gradeClass = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor';
    const gradeLabel = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
    const updated = r.updatedAt ? relativeTime(r.updatedAt) : '';
    return `
    <div class="resume-card fade-in" data-id="${sanitize(r.id)}">
      <div class="d-flex align-items-start justify-content-between mb-1">
        <div>
          <div class="resume-card-title">${sanitize(truncate(r.name, 40))}</div>
          <div class="resume-card-subtitle">${sanitize(r.personal?.title || 'No title set')}</div>
        </div>
        <span class="ats-badge ${gradeClass}">${score} · ${gradeLabel}</span>
      </div>
      <div class="resume-card-date"><i class="fa-regular fa-clock me-1"></i>${sanitize(updated)}</div>
      <div class="card-actions mt-2">
        <button class="btn btn-primary btn-sm card-edit"   data-id="${sanitize(r.id)}"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn btn-outline-primary btn-sm card-download" data-id="${sanitize(r.id)}"><i class="fa-solid fa-download"></i></button>
        <button class="btn btn-ghost btn-sm card-duplicate" data-id="${sanitize(r.id)}" title="Duplicate"><i class="fa-solid fa-copy"></i></button>
        <button class="btn btn-outline-danger btn-sm card-delete"   data-id="${sanitize(r.id)}" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }

  _bindDashboardEvents() {
    const grid = document.getElementById('resume-grid');
    if (!grid) return;

    grid.addEventListener('click', async e => {
      const btn = e.target.closest('[class*="card-"], #btn-new-resume, .btn-new-resume-2');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.id === 'btn-new-resume' || btn.classList.contains('btn-new-resume-2')) {
        this._showNewResumeModal();
        return;
      }
      if (btn.classList.contains('card-edit'))      { await this._openBuilder(id); return; }
      if (btn.classList.contains('card-download'))  { await this._quickDownload(id); return; }
      if (btn.classList.contains('card-duplicate')) { await this._duplicateResume(id); return; }
      if (btn.classList.contains('card-delete'))    { await this._confirmDelete(id); return; }
    });

    // Keyboard activation of new card
    document.getElementById('btn-new-resume')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._showNewResumeModal(); }
    });

    // Import button
    document.getElementById('btn-import')?.addEventListener('click', () => this._importResume());
  }

  /* ────────────────────────────────────────────────────────────
     New Resume Modal
  ──────────────────────────────────────────────────────────── */

  _showNewResumeModal() {
    const modal = document.getElementById('modal-new-resume');
    modal?.classList.add('active');
    document.getElementById('new-resume-name')?.focus();
  }

  _hideNewResumeModal() {
    document.getElementById('modal-new-resume')?.classList.remove('active');
  }

  /* ────────────────────────────────────────────────────────────
     Builder
  ──────────────────────────────────────────────────────────── */

  async _openBuilder(id) {
    const resume = await resumeManager.get(id);
    if (!resume) { toastService.error('Resume not found.'); return; }
    this._resume = resume;
    this._showPage('builder');
    this._mountBuilder();
  }

  _mountBuilder() {
    const r = this._resume;
    document.getElementById('builder-resume-name').textContent = r.name || 'Untitled';

    // Init preview
    const canvas  = document.getElementById('resume-canvas');
    const zoomVal = document.getElementById('zoom-val');
    this._preview = new PreviewRenderer(canvas, zoomVal);
    this._preview.update(r);

    // Populate all form sections
    this._populateForm(r);

    // Bind builder events
    this._bindBuilderEvents();

    // Initial ATS score
    this._updateATSPanel();
  }

  /* ────────────────────────────────────────────────────────────
     Form Population
  ──────────────────────────────────────────────────────────── */

  _populateForm(r) {
    const p = r.personal || {};
    this._setVal('f-fullName',   p.fullName);
    this._setVal('f-title',      p.title);
    this._setVal('f-email',      p.email);
    this._setVal('f-phone',      p.phone);
    this._setVal('f-city',       p.city);
    this._setVal('f-country',    p.country);
    this._setVal('f-linkedin',   p.linkedin);
    this._setVal('f-github',     p.github);
    this._setVal('f-portfolio',  p.portfolio);
    this._setVal('f-summary',    r.summary);
    this._setVal('f-targetRole', r.targetRole);
    this._updateCharCount('f-summary', 'summary-char-count', 500);

    // Skills
    this._renderSkillTags(r.skills || []);

    // Template selector
    document.querySelectorAll('.tpl-thumb').forEach(t => {
      t.classList.toggle('active', t.dataset.tpl === r.template);
    });

    // Dynamic lists
    this._renderExperienceList(r.experience || []);
    this._renderEducationList(r.education || []);
    this._renderProjectsList(r.projects || []);
    this._renderCertificationsList(r.certifications || []);
    this._renderDynamicList('achievements-list', r.achievements || [], 'achievement');
    this._renderDynamicList('languages-list',    r.languages || [],    'language');
  }

  _setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  /* ────────────────────────────────────────────────────────────
     Builder Event Binding
  ──────────────────────────────────────────────────────────── */

  _bindBuilderEvents() {
    // Back to dashboard
    document.getElementById('btn-back-dashboard')?.addEventListener('click', () => this._exitBuilder());

    // Section toggles
    document.querySelectorAll('.section-header').forEach(h => {
      h.addEventListener('click', () => h.closest('.section-card').classList.toggle('open'));
    });

    // Personal fields
    ['fullName','title','email','phone','city','country','linkedin','github','portfolio'].forEach(field => {
      document.getElementById(`f-${field}`)?.addEventListener('input', e => {
        this._resume.personal[field] = e.target.value;
        this._triggerSave();
      });
    });

    // Summary
    const summaryEl = document.getElementById('f-summary');
    summaryEl?.addEventListener('input', e => {
      this._resume.summary = e.target.value;
      this._updateCharCount('f-summary', 'summary-char-count', 500);
      this._triggerSave();
    });

    // Target role
    document.getElementById('f-targetRole')?.addEventListener('input', e => {
      this._resume.targetRole = e.target.value;
      this._triggerSave();
      this._updateATSPanel();
    });

    // Template selector
    document.querySelectorAll('.tpl-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        this._resume.template = btn.dataset.tpl;
        document.querySelectorAll('.tpl-thumb').forEach(b => b.classList.toggle('active', b === btn));
        this._triggerSave();
      });
    });

    // Skills tag input
    this._bindSkillInput();

    // Add entry buttons
    document.getElementById('btn-add-exp')?.addEventListener('click', () => {
      resumeManager.addExperience(this._resume);
      this._renderExperienceList(this._resume.experience);
      this._triggerSave();
    });
    document.getElementById('btn-add-edu')?.addEventListener('click', () => {
      resumeManager.addEducation(this._resume);
      this._renderEducationList(this._resume.education);
      this._triggerSave();
    });
    document.getElementById('btn-add-proj')?.addEventListener('click', () => {
      resumeManager.addProject(this._resume);
      this._renderProjectsList(this._resume.projects);
      this._triggerSave();
    });
    document.getElementById('btn-add-cert')?.addEventListener('click', () => {
      resumeManager.addCertification(this._resume);
      this._renderCertificationsList(this._resume.certifications);
      this._triggerSave();
    });
    document.getElementById('btn-add-achievement')?.addEventListener('click', () => {
      this._resume.achievements.push('');
      this._renderDynamicList('achievements-list', this._resume.achievements, 'achievement');
      this._triggerSave();
    });
    document.getElementById('btn-add-language')?.addEventListener('click', () => {
      this._resume.languages.push('');
      this._renderDynamicList('languages-list', this._resume.languages, 'language');
      this._triggerSave();
    });

    // Preview zoom
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this._preview?.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this._preview?.zoomOut());
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this._preview?.zoomReset());

    // Download PDF
    document.getElementById('btn-download-pdf')?.addEventListener('click', () => this._downloadPDF());

    // ATS panel toggle
    document.getElementById('btn-ats-score')?.addEventListener('click', () => {
      const panel = document.getElementById('ats-panel');
      panel?.classList.toggle('visible');
      this._updateATSPanel();
    });

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      importExportService.exportResume(this._resume);
      toastService.success('Resume exported as JSON.');
    });

    // Resume name edit
    document.getElementById('builder-resume-name')?.addEventListener('blur', e => {
      this._resume.name = e.target.textContent.trim() || 'Untitled';
      this._triggerSave();
    });
  }

  /* ────────────────────────────────────────────────────────────
     Skills tag input
  ──────────────────────────────────────────────────────────── */

  _renderSkillTags(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    const input = container.querySelector('.skills-input') || this._createSkillInput(container);

    // Remove existing tags (keep input)
    container.querySelectorAll('.skill-tag').forEach(t => t.remove());

    skills.forEach(skill => {
      const tag = this._makeSkillTag(skill);
      container.insertBefore(tag, input);
    });
  }

  _createSkillInput(container) {
    const input = document.createElement('input');
    input.className   = 'skills-input';
    input.type        = 'text';
    input.placeholder = 'Add skill…';
    input.setAttribute('aria-label', 'Add skill');
    container.appendChild(input);
    return input;
  }

  _makeSkillTag(skill) {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.innerHTML = `${sanitize(skill)} <span class="remove" aria-label="Remove ${sanitize(skill)}">✕</span>`;
    tag.querySelector('.remove').addEventListener('click', () => {
      this._resume.skills = this._resume.skills.filter(s => s !== skill);
      tag.remove();
      this._triggerSave();
    });
    return tag;
  }

  _bindSkillInput() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    const input = container.querySelector('.skills-input');
    if (!input) return;

    container.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
        e.preventDefault();
        this._addSkill(input.value.trim().replace(/,$/, ''));
        input.value = '';
        this._hideSuggestions();
      }
      if (e.key === 'Backspace' && !input.value) {
        if (this._resume.skills.length) {
          this._resume.skills.pop();
          this._renderSkillTags(this._resume.skills);
          this._triggerSave();
        }
      }
    });

    input.addEventListener('input', () => this._showSkillSuggestions(input));
    input.addEventListener('blur',  () => setTimeout(() => this._hideSuggestions(), 200));
  }

  _addSkill(skill) {
    if (!skill || this._resume.skills.includes(skill)) return;
    this._resume.skills.push(skill);
    this._renderSkillTags(this._resume.skills);
    this._triggerSave();
  }

  _showSkillSuggestions(input) {
    this._hideSuggestions();
    const q = input.value.toLowerCase();
    if (!q) return;
    const matches = SKILL_SUGGESTIONS.filter(s =>
      s.toLowerCase().includes(q) && !this._resume.skills.includes(s)
    ).slice(0, 8);
    if (!matches.length) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'skill-suggestions';
    dropdown.style.cssText = `position:absolute;z-index:200;min-width:180px;`;

    matches.forEach(s => {
      const item = document.createElement('div');
      item.className = 'skill-suggestion-item';
      item.textContent = s;
      item.addEventListener('mousedown', e => { e.preventDefault(); this._addSkill(s); input.value = ''; });
      dropdown.appendChild(item);
    });

    const container = document.getElementById('skills-container');
    container.style.position = 'relative';
    container.appendChild(dropdown);
    this._skillSuggRef = dropdown;
  }

  _hideSuggestions() {
    this._skillSuggRef?.remove();
    this._skillSuggRef = null;
  }

  /* ────────────────────────────────────────────────────────────
     Dynamic Entry Lists
  ──────────────────────────────────────────────────────────── */

  _renderExperienceList(list) {
    const el = document.getElementById('experience-list');
    if (!el) return;
    el.innerHTML = list.map((e, idx) => `
      <div class="entry-item" data-id="${sanitize(e.id)}">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${sanitize(e.company || 'Company Name')}</div>
            <div class="entry-item-subtitle">${sanitize(e.role || 'Job Title')}</div>
          </div>
          <div class="entry-actions">
            <button class="btn-icon entry-toggle" title="Expand"><i class="fa-solid fa-chevron-down"></i></button>
            <button class="btn-icon danger entry-delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="entry-item-body">
          <div class="row g-2 mb-2">
            <div class="col-6"><label class="form-label">Company</label><input type="text" class="form-control exp-company" value="${sanitize(e.company)}" placeholder="Company Name"></div>
            <div class="col-6"><label class="form-label">Job Title</label><input type="text" class="form-control exp-role" value="${sanitize(e.role)}" placeholder="Software Engineer"></div>
            <div class="col-6"><label class="form-label">Location</label><input type="text" class="form-control exp-location" value="${sanitize(e.location)}" placeholder="City, Country"></div>
            <div class="col-3"><label class="form-label">Start</label><input type="month" class="form-control exp-start" value="${sanitize(e.startDate)}"></div>
            <div class="col-3"><label class="form-label">End</label><input type="month" class="form-control exp-end" value="${sanitize(e.endDate)}" ${e.current ? 'disabled' : ''}></div>
            <div class="col-12">
              <div class="form-check">
                <input class="form-check-input exp-current" type="checkbox" id="exp-cur-${sanitize(e.id)}" ${e.current ? 'checked' : ''}>
                <label class="form-check-label" for="exp-cur-${sanitize(e.id)}" style="font-size:.8rem">Currently working here</label>
              </div>
            </div>
          </div>
          <label class="form-label">Responsibilities</label>
          <div class="bullet-list" id="bullets-${sanitize(e.id)}">
            ${(e.bullets || ['']).map((b, bi) => this._bulletRow(b, bi)).join('')}
          </div>
          <button class="btn btn-ghost btn-xs mt-1 add-bullet"><i class="fa-solid fa-plus"></i> Add bullet</button>
        </div>
      </div>`).join('');

    this._bindEntryListEvents(el, 'experience', list);
    this._bindBulletEvents(el, list);
  }

  _bulletRow(text, idx) {
    return `<li class="bullet-item">
      <textarea class="bullet-input" rows="1" placeholder="Describe your impact…">${sanitize(text)}</textarea>
      <button class="btn-icon danger remove-bullet" style="margin-top:4px" title="Remove"><i class="fa-solid fa-minus"></i></button>
    </li>`;
  }

  _bindBulletEvents(el, list) {
    el.querySelectorAll('.entry-item').forEach(item => {
      const entryId = item.dataset.id;
      const entry   = list.find(e => e.id === entryId);
      if (!entry) return;

      const bulletList = item.querySelector('.bullet-list');

      bulletList?.addEventListener('input', e => {
        if (e.target.classList.contains('bullet-input')) {
          const idx = [...bulletList.querySelectorAll('.bullet-input')].indexOf(e.target);
          entry.bullets[idx] = e.target.value;
          this._triggerSave();
          // Auto-resize
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }
      });

      bulletList?.addEventListener('click', e => {
        const btn = e.target.closest('.remove-bullet');
        if (btn) {
          const li  = btn.closest('.bullet-item');
          const idx = [...bulletList.querySelectorAll('.bullet-item')].indexOf(li);
          entry.bullets.splice(idx, 1);
          li.remove();
          this._triggerSave();
        }
      });

      item.querySelector('.add-bullet')?.addEventListener('click', () => {
        entry.bullets.push('');
        const li = document.createElement('li');
        li.className = 'bullet-item';
        li.innerHTML = this._bulletRow('', entry.bullets.length - 1);
        bulletList?.appendChild(li);
        li.querySelector('.bullet-input')?.focus();
        this._triggerSave();
      });
    });
  }

  _renderEducationList(list) {
    const el = document.getElementById('education-list');
    if (!el) return;
    el.innerHTML = list.map(e => `
      <div class="entry-item" data-id="${sanitize(e.id)}">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${sanitize(e.institution || 'Institution')}</div>
            <div class="entry-item-subtitle">${sanitize(e.degree || 'Degree')}</div>
          </div>
          <div class="entry-actions">
            <button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button>
            <button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="entry-item-body">
          <div class="row g-2">
            <div class="col-12"><label class="form-label">Institution</label><input type="text" class="form-control edu-institution" value="${sanitize(e.institution)}" placeholder="University Name"></div>
            <div class="col-6"><label class="form-label">Degree</label><input type="text" class="form-control edu-degree" value="${sanitize(e.degree)}" placeholder="B.Tech / B.Sc"></div>
            <div class="col-6"><label class="form-label">Field</label><input type="text" class="form-control edu-field" value="${sanitize(e.field)}" placeholder="Computer Science"></div>
            <div class="col-4"><label class="form-label">Start Year</label><input type="number" class="form-control edu-start" value="${sanitize(e.startYear)}" placeholder="2020" min="1990" max="2040"></div>
            <div class="col-4"><label class="form-label">End Year</label><input type="number" class="form-control edu-end" value="${sanitize(e.endYear)}" placeholder="2024" min="1990" max="2040"></div>
            <div class="col-4"><label class="form-label">CGPA / GPA</label><input type="text" class="form-control edu-cgpa" value="${sanitize(e.cgpa)}" placeholder="8.5"></div>
          </div>
        </div>
      </div>`).join('');

    this._bindEntryListEvents(el, 'education', list);

    el.querySelectorAll('.entry-item').forEach(item => {
      const entryId = item.dataset.id;
      const entry   = list.find(e => e.id === entryId);
      if (!entry) return;
      ['institution','degree','field','startYear','endYear','cgpa'].forEach(field => {
        item.querySelector(`.edu-${field}`)?.addEventListener('input', ev => {
          entry[field] = ev.target.value;
          item.querySelector('.entry-item-title').textContent = entry.institution || 'Institution';
          item.querySelector('.entry-item-subtitle').textContent = entry.degree || 'Degree';
          this._triggerSave();
        });
      });
    });
  }

  _renderProjectsList(list) {
    const el = document.getElementById('projects-list');
    if (!el) return;
    el.innerHTML = list.map(p => `
      <div class="entry-item" data-id="${sanitize(p.id)}">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${sanitize(p.name || 'Project Name')}</div>
            <div class="entry-item-subtitle">${sanitize(p.tech || '')}</div>
          </div>
          <div class="entry-actions">
            <button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button>
            <button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="entry-item-body">
          <div class="row g-2">
            <div class="col-12"><label class="form-label">Project Name</label><input type="text" class="form-control proj-name" value="${sanitize(p.name)}" placeholder="Project Title"></div>
            <div class="col-12"><label class="form-label">Description</label><textarea class="form-control proj-desc" rows="2" placeholder="What did you build and what impact did it have?">${sanitize(p.description)}</textarea></div>
            <div class="col-12"><label class="form-label">Technologies</label><input type="text" class="form-control proj-tech" value="${sanitize(p.tech)}" placeholder="React, Node.js, MongoDB"></div>
            <div class="col-6"><label class="form-label">GitHub URL</label><input type="url" class="form-control proj-github" value="${sanitize(p.github)}" placeholder="https://github.com/..."></div>
            <div class="col-6"><label class="form-label">Live Demo</label><input type="url" class="form-control proj-live" value="${sanitize(p.live)}" placeholder="https://..."></div>
          </div>
        </div>
      </div>`).join('');

    this._bindEntryListEvents(el, 'projects', list);
    el.querySelectorAll('.entry-item').forEach(item => {
      const entryId = item.dataset.id;
      const proj = list.find(p => p.id === entryId);
      if (!proj) return;
      ['name','description','tech','github','live'].forEach(f => {
        item.querySelector(`.proj-${f}`)?.addEventListener('input', ev => {
          proj[f] = ev.target.value;
          item.querySelector('.entry-item-title').textContent = proj.name || 'Project Name';
          item.querySelector('.entry-item-subtitle').textContent = proj.tech || '';
          this._triggerSave();
        });
      });
    });
  }

  _renderCertificationsList(list) {
    const el = document.getElementById('certifications-list');
    if (!el) return;
    el.innerHTML = list.map(c => `
      <div class="entry-item" data-id="${sanitize(c.id)}">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${sanitize(c.name || 'Certificate Name')}</div>
            <div class="entry-item-subtitle">${sanitize(c.org || '')}</div>
          </div>
          <div class="entry-actions">
            <button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button>
            <button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="entry-item-body">
          <div class="row g-2">
            <div class="col-12"><label class="form-label">Certificate Name</label><input type="text" class="form-control cert-cname" value="${sanitize(c.name)}" placeholder="AWS Certified Developer"></div>
            <div class="col-6"><label class="form-label">Organisation</label><input type="text" class="form-control cert-org" value="${sanitize(c.org)}" placeholder="Amazon / Coursera"></div>
            <div class="col-6"><label class="form-label">Issue Date</label><input type="month" class="form-control cert-date" value="${sanitize(c.issueDate)}"></div>
            <div class="col-12"><label class="form-label">Credential URL</label><input type="url" class="form-control cert-url" value="${sanitize(c.credentialUrl)}" placeholder="https://..."></div>
          </div>
        </div>
      </div>`).join('');

    this._bindEntryListEvents(el, 'certifications', list);
    el.querySelectorAll('.entry-item').forEach(item => {
      const entryId = item.dataset.id;
      const cert = list.find(c => c.id === entryId);
      if (!cert) return;
      item.querySelector('.cert-cname')?.addEventListener('input', ev => { cert.name = ev.target.value; item.querySelector('.entry-item-title').textContent = cert.name || 'Certificate Name'; this._triggerSave(); });
      item.querySelector('.cert-org')?.addEventListener('input', ev => { cert.org = ev.target.value; item.querySelector('.entry-item-subtitle').textContent = cert.org || ''; this._triggerSave(); });
      item.querySelector('.cert-date')?.addEventListener('change', ev => { cert.issueDate = ev.target.value; this._triggerSave(); });
      item.querySelector('.cert-url')?.addEventListener('input', ev => { cert.credentialUrl = ev.target.value; this._triggerSave(); });
    });
  }

  _bindEntryListEvents(el, section, list) {
    el.addEventListener('click', e => {
      const toggle = e.target.closest('.entry-toggle');
      const del    = e.target.closest('.entry-delete');
      const item   = e.target.closest('.entry-item');
      if (!item) return;

      if (toggle) { item.classList.toggle('open'); return; }
      if (del) {
        const id = item.dataset.id;
        switch (section) {
          case 'experience':     resumeManager.removeExperience(this._resume, id);     this._renderExperienceList(this._resume.experience); break;
          case 'education':      resumeManager.removeEducation(this._resume, id);      this._renderEducationList(this._resume.education); break;
          case 'projects':       resumeManager.removeProject(this._resume, id);        this._renderProjectsList(this._resume.projects); break;
          case 'certifications': resumeManager.removeCertification(this._resume, id);  this._renderCertificationsList(this._resume.certifications); break;
        }
        this._triggerSave();
        return;
      }
    });

    // Experience-specific field bindings
    if (section === 'experience') {
      el.querySelectorAll('.entry-item').forEach(item => {
        const entryId = item.dataset.id;
        const entry   = list.find(e => e.id === entryId);
        if (!entry) return;

        item.querySelector('.exp-company')?.addEventListener('input', ev => {
          entry.company = ev.target.value;
          item.querySelector('.entry-item-title').textContent = entry.company || 'Company Name';
          this._triggerSave();
        });
        item.querySelector('.exp-role')?.addEventListener('input', ev => {
          entry.role = ev.target.value;
          item.querySelector('.entry-item-subtitle').textContent = entry.role || 'Job Title';
          this._triggerSave();
        });
        item.querySelector('.exp-location')?.addEventListener('input', ev => { entry.location = ev.target.value; this._triggerSave(); });
        item.querySelector('.exp-start')?.addEventListener('change', ev => { entry.startDate = ev.target.value; this._triggerSave(); });
        item.querySelector('.exp-end')?.addEventListener('change', ev => { entry.endDate = ev.target.value; this._triggerSave(); });
        item.querySelector('.exp-current')?.addEventListener('change', ev => {
          entry.current = ev.target.checked;
          const endInput = item.querySelector('.exp-end');
          if (endInput) endInput.disabled = entry.current;
          this._triggerSave();
        });
      });
    }
  }

  _renderDynamicList(containerId, items, type) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map((val, idx) => `
      <div class="d-flex gap-2 align-items-center mb-1">
        <input type="text" class="form-control form-control-sm dyn-input" data-idx="${idx}" data-type="${type}" value="${sanitize(val)}" placeholder="${type === 'achievement' ? 'e.g. Top Performer Q3 2023' : 'e.g. English'}">
        <button class="btn-icon danger dyn-remove" data-idx="${idx}" data-type="${type}"><i class="fa-solid fa-minus"></i></button>
      </div>`).join('');

    el.addEventListener('input', e => {
      if (e.target.classList.contains('dyn-input')) {
        const idx = +e.target.dataset.idx;
        if (type === 'achievement') this._resume.achievements[idx] = e.target.value;
        else this._resume.languages[idx] = e.target.value;
        this._triggerSave();
      }
    });

    el.addEventListener('click', e => {
      const btn = e.target.closest('.dyn-remove');
      if (!btn) return;
      const idx = +btn.dataset.idx;
      if (type === 'achievement') { this._resume.achievements.splice(idx, 1); this._renderDynamicList(containerId, this._resume.achievements, type); }
      else { this._resume.languages.splice(idx, 1); this._renderDynamicList(containerId, this._resume.languages, type); }
      this._triggerSave();
    });
  }

  /* ────────────────────────────────────────────────────────────
     ATS Panel
  ──────────────────────────────────────────────────────────── */

  _updateATSPanel() {
    if (!this._resume) return;
    const result = atsAnalyzer.analyze(this._resume);
    this._resume.atsScore = result.score;

    // ── Score badge on the ATS tab button ──────────────────
    const badge = document.getElementById('ats-score-badge');
    if (badge) {
      const prev = badge.textContent;
      badge.textContent = result.score;

      // grade → CSS data attribute drives colour via stylesheet
      const grade = result.score >= 85 ? 'excellent'
                  : result.score >= 70 ? 'great'
                  : result.score >= 50 ? 'good'
                  : '';                            // default red (no attr)
      if (grade) badge.setAttribute('data-grade', grade);
      else       badge.removeAttribute('data-grade');

      // pop animation on score change
      if (prev !== String(result.score)) {
        badge.classList.remove('pop');
        void badge.offsetWidth;   // force reflow to restart animation
        badge.classList.add('pop');
      }
    }

    const panel = document.getElementById('ats-panel');
    if (!panel) return;

    const color = result.score >= 85 ? '#10B981' : result.score >= 70 ? '#2563EB' : result.score >= 50 ? '#F59E0B' : '#EF4444';

    // Score ring
    const circumference = 2 * Math.PI * 45;
    const dash = (result.score / 100) * circumference;

    panel.querySelector('.score-ring svg circle.track')?.setAttribute('stroke', '#E2E8F0');
    const fill = panel.querySelector('.score-ring svg circle.fill');
    if (fill) {
      fill.setAttribute('stroke', color);
      fill.setAttribute('stroke-dasharray', `${dash} ${circumference}`);
    }
    const scoreText = panel.querySelector('.score-ring .score-num');
    if (scoreText) scoreText.textContent = result.score;
    const gradeText = panel.querySelector('.score-ring .score-grade');
    if (gradeText) { gradeText.textContent = result.grade; gradeText.style.color = color; }

    // Criteria bars
    const criteriaEl = panel.querySelector('.ats-criteria');
    if (criteriaEl) {
      criteriaEl.innerHTML = result.criteria.map(c => {
        const pct = Math.round((c.earned / c.max) * 100);
        const barColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#2563EB' : pct >= 40 ? '#F59E0B' : '#EF4444';
        return `<div class="ats-criterion">
          <span class="criterion-label">${sanitize(c.label)}</span>
          <div class="criterion-bar"><div class="criterion-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
          <span class="criterion-score" style="color:${barColor}">${c.earned}/${c.max}</span>
        </div>`;
      }).join('');
    }

    // Suggestions / warnings
    const suggestEl = panel.querySelector('.ats-suggestions');
    if (suggestEl) {
      const all = [
        ...result.warnings.map(w    => `<div class="ats-suggestion-item error"><i class="fa-solid fa-circle-xmark"></i><span>${sanitize(w)}</span></div>`),
        ...result.suggestions.map(s => `<div class="ats-suggestion-item warn"><i class="fa-solid fa-triangle-exclamation"></i><span>${sanitize(s)}</span></div>`),
        ...result.tips.map(t        => `<div class="ats-suggestion-item tip"><i class="fa-solid fa-lightbulb"></i><span>${sanitize(t)}</span></div>`),
      ];
      suggestEl.innerHTML = all.length ? all.join('') : `<div class="ats-suggestion-item tip"><i class="fa-solid fa-check"></i><span>Great job! Your resume is well optimised.</span></div>`;
    }

    // Keywords
    const kwEl = panel.querySelector('.keyword-chips');
    if (kwEl && result.keywords.suggested.length) {
      kwEl.innerHTML = result.keywords.suggested.map(kw => {
        const present = result.keywords.present.includes(kw);
        return `<span class="keyword-chip${present ? '' : ' missing'}" title="${present ? 'Present' : 'Missing — click to add to skills'}" data-kw="${sanitize(kw)}" style="${present ? 'opacity:.5;cursor:default' : ''}">${sanitize(kw)}</span>`;
      }).join('');

      kwEl.querySelectorAll('.keyword-chip.missing').forEach(chip => {
        chip.addEventListener('click', () => {
          this._addSkill(chip.dataset.kw);
          this._updateATSPanel();
          toastService.info(`"${chip.dataset.kw}" added to skills.`);
        });
      });
    }
  }

  /* ────────────────────────────────────────────────────────────
     Autosave
  ──────────────────────────────────────────────────────────── */

  _triggerSave() {
    this._setSaveStatus('saving');
    this._preview?.update(this._resume);
    this._updateATSPanel();
    this._debouncedSave();
  }

  async _doSave() {
    try {
      await resumeManager.save(this._resume);
      this._setSaveStatus('saved');
    } catch (e) {
      console.error('[App] Autosave failed', e);
      this._setSaveStatus('idle');
    }
  }

  _setSaveStatus(status) {
    this._saveStatus = status;
    const indicator = document.getElementById('autosave-indicator');
    if (!indicator) return;
    indicator.className = `autosave-indicator ${status}`;
    const label = indicator.querySelector('.label');
    if (label) {
      label.textContent = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : '';
    }
  }

  /* ────────────────────────────────────────────────────────────
     Delete / Duplicate helpers
  ──────────────────────────────────────────────────────────── */

  async _confirmDelete(id) {
    const resume = (await resumeManager.getAll()).find(r => r.id === id);
    if (!resume) return;

    const modal = document.getElementById('modal-confirm-delete');
    const nameEl = document.getElementById('delete-resume-name');
    if (nameEl) nameEl.textContent = resume.name;
    modal?.classList.add('active');

    const confirm = document.getElementById('btn-confirm-delete');
    const cancel  = document.getElementById('btn-cancel-delete');

    const onConfirm = async () => {
      this._deletedResume = deepClone(resume);
      await resumeManager.delete(id);
      modal?.classList.remove('active');
      await this._renderDashboard();
      const dismiss = toastService.warning(
        `"${resume.name}" deleted. <button class="btn btn-xs btn-ghost ms-1" id="undo-delete" style="padding:.1rem .4rem;font-size:.78rem">Undo</button>`,
        0
      );
      setTimeout(() => {
        document.getElementById('undo-delete')?.addEventListener('click', async () => {
          dismiss?.();
          if (this._deletedResume) {
            await resumeManager.save(this._deletedResume);
            this._deletedResume = null;
            await this._renderDashboard();
            toastService.success('Resume restored.');
          }
        });
      }, 50);

      confirm.removeEventListener('click', onConfirm);
      cancel.removeEventListener('click', onCancel);
    };

    const onCancel = () => {
      modal?.classList.remove('active');
      confirm.removeEventListener('click', onConfirm);
      cancel.removeEventListener('click', onCancel);
    };

    confirm?.addEventListener('click', onConfirm);
    cancel?.addEventListener('click', onCancel);
  }

  async _duplicateResume(id) {
    try {
      const copy = await resumeManager.duplicate(id);
      await this._renderDashboard();
      toastService.success(`"${copy.name}" created.`);
    } catch { toastService.error('Could not duplicate resume.'); }
  }

  async _quickDownload(id) {
    const resume = await resumeManager.get(id);
    if (!resume) return;
    const was = this._resume;
    this._resume = resume;
    await this._downloadPDF();
    this._resume = was;
  }

  async _downloadPDF() {
    if (!this._resume) return;
    try {
      toastService.info('Opening print dialog…');
      await pdfGenerator.generate(this._resume);
    } catch (e) {
      toastService.error('PDF generation failed. Try printing manually.');
    }
  }

  async _importResume() {
    try {
      const resume = await importExportService.importResume();
      await resumeManager.save(resume);
      await this._renderDashboard();
      toastService.success(`"${resume.name}" imported successfully.`);
    } catch (e) {
      toastService.error(e.message || 'Import failed.');
    }
  }

  _exitBuilder() {
    this._showPage('dashboard');
    this._renderDashboard();
    this._preview = null;
    this._resume  = null;
  }

  /* ────────────────────────────────────────────────────────────
     Form helpers
  ──────────────────────────────────────────────────────────── */

  _updateCharCount(inputId, countId, max) {
    const input = document.getElementById(inputId);
    const count = document.getElementById(countId);
    if (!input || !count) return;
    const len = input.value.length;
    count.textContent = `${len} / ${max}`;
    count.className = `char-count ${len > max ? 'over' : len > max * 0.85 ? 'warn' : ''}`;
  }

  /* ────────────────────────────────────────────────────────────
     Global keyboard shortcuts
  ──────────────────────────────────────────────────────────── */

  _registerGlobalShortcuts() {
    document.addEventListener('keydown', e => {
      const active = document.activeElement;
      const inInput = ['INPUT','TEXTAREA','SELECT'].includes(active?.tagName);

      // Ctrl/Cmd+S → force save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this._resume) this._doSave().then(() => toastService.success('Saved.'));
        return;
      }

      // Escape → close modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  }
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  window.__app = app; // expose for debugging

  // New resume modal submit
  document.getElementById('form-new-resume')?.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('new-resume-name').value.trim() || 'My Resume';
    const tpl     = document.getElementById('new-resume-template').value || 'classic';
    const role    = document.getElementById('new-resume-role').value.trim();
    const resume  = await resumeManager.create({ name, template: tpl, targetRole: role });
    app._hideNewResumeModal();
    await app._openBuilder(resume.id);
  });

  document.getElementById('modal-new-resume')?.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) app._hideNewResumeModal();
  });

  document.querySelector('#modal-new-resume .modal-close')?.addEventListener('click', () => app._hideNewResumeModal());

  document.getElementById('modal-confirm-delete')?.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
  });

  await app.init();
});
