/**
 * ATSApply – app.bundle.js
 * Single-file bundle: works with file://, http://, and https://
 * No build tools required.
 */

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const Helpers = (() => {
  function debounce(fn, wait = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function sanitize(str = '') {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function formatMonthYear(value) {
    if (!value) return '';
    const d = new Date(value + '-01');
    if (isNaN(d)) return value;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function toFilename(name = '') {
    return name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '') + '_Resume';
  }

  function truncate(str = '', maxLen = 60) {
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 3) + '…';
  }

  function downloadText(content, filename, mimeType = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsText(file);
    });
  }

  function relativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const s = Math.round(diff / 1000);
    if (s < 10)  return 'Just now';
    if (s < 60)  return `${s}s ago`;
    const m = Math.round(s / 60);
    if (m < 60)  return `${m}m ago`;
    const h = Math.round(m / 60);
    if (h < 24)  return `${h}h ago`;
    const dy = Math.round(h / 24);
    return `${dy}d ago`;
  }

  return { debounce, uid, sanitize, formatMonthYear, deepClone, clamp, toFilename, truncate, downloadText, readFileAsText, relativeTime };
})();

/* ══════════════════════════════════════════════════════════════
   STORAGE SERVICE  (IndexedDB → LocalStorage fallback)
══════════════════════════════════════════════════════════════ */
const StorageService = (() => {
  const DB_NAME        = 'atsapply_db';
  const DB_VERSION     = 1;
  const STORE_RESUMES  = 'resumes';
  const STORE_SETTINGS = 'settings';
  const LS_RESUMES_KEY = 'atsapply_resumes';
  const LS_SET_KEY     = 'atsapply_settings';

  let _db   = null;
  let _mode = 'idb';

  const _openIDB = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_RESUMES))  db.createObjectStore(STORE_RESUMES,  { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });

  const _tx  = (store, mode = 'readonly') => _db.transaction(store, mode).objectStore(store);
  const _get = (store, key)  => new Promise((res, rej) => { const r = _tx(store).get(key);   r.onsuccess = e => res(e.target.result ?? null); r.onerror = e => rej(e.target.error); });
  const _all = (store)       => new Promise((res, rej) => { const r = _tx(store).getAll();   r.onsuccess = e => res(e.target.result);          r.onerror = e => rej(e.target.error); });
  const _put = (store, val)  => new Promise((res, rej) => { const r = _tx(store,'readwrite').put(val); r.onsuccess = e => res(e.target.result); r.onerror = e => rej(e.target.error); });
  const _del = (store, key)  => new Promise((res, rej) => { const r = _tx(store,'readwrite').delete(key); r.onsuccess = () => res(); r.onerror = e => rej(e.target.error); });

  const _lsLoad = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
  const _lsSave = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.error(e); } };

  const _ready = (async () => {
    try   { _db = await _openIDB(); _mode = 'idb'; }
    catch { _mode = 'ls'; console.warn('[Storage] Using LocalStorage fallback'); }
  })();

  async function ready()          { return _ready; }
  async function getAllResumes()   { await _ready; return _mode === 'idb' ? _all(STORE_RESUMES)  : Object.values(_lsLoad(LS_RESUMES_KEY) || {}); }
  async function getResume(id)    { await _ready; if (_mode === 'idb') return _get(STORE_RESUMES, id); return (_lsLoad(LS_RESUMES_KEY) || {})[id] ?? null; }
  async function saveResume(r)    { await _ready; r.updatedAt = Date.now(); if (_mode === 'idb') { await _put(STORE_RESUMES, r); } else { const a = _lsLoad(LS_RESUMES_KEY)||{}; a[r.id]=r; _lsSave(LS_RESUMES_KEY,a); } return r; }
  async function deleteResume(id) { await _ready; if (_mode === 'idb') { await _del(STORE_RESUMES, id); } else { const a = _lsLoad(LS_RESUMES_KEY)||{}; delete a[id]; _lsSave(LS_RESUMES_KEY,a); } }
  async function getSetting(key)  { await _ready; if (_mode === 'idb') { const r = await _get(STORE_SETTINGS, key); return r ? r.value : null; } return (_lsLoad(LS_SET_KEY)||{})[key]??null; }
  async function setSetting(k,v)  { await _ready; if (_mode === 'idb') { await _put(STORE_SETTINGS,{key:k,value:v}); } else { const a=_lsLoad(LS_SET_KEY)||{}; a[k]=v; _lsSave(LS_SET_KEY,a); } }

  return { ready, getAllResumes, getResume, saveResume, deleteResume, getSetting, setSetting, get engine() { return _mode; } };
})();

/* ══════════════════════════════════════════════════════════════
   RESUME MANAGER
══════════════════════════════════════════════════════════════ */
const ResumeManager = (() => {
  const SCHEMA_VERSION = 1;

  function blankResume() {
    return {
      id: Helpers.uid(), name: 'My Resume',
      createdAt: Date.now(), updatedAt: Date.now(),
      atsScore: 0, template: 'classic',
      personal: { fullName:'', title:'', email:'', phone:'', city:'', country:'', linkedin:'', github:'', portfolio:'' },
      summary: '', skills: [],
      experience: [], education: [], projects: [],
      certifications: [], achievements: [], languages: [],
      targetRole: '', colorTheme: '',
    };
  }

  function migrate(r) {
    ['skills','experience','education','projects','certifications','achievements','languages'].forEach(k => { if (!Array.isArray(r[k])) r[k] = []; });
    if (!r.personal)         r.personal         = blankResume().personal;
    if (!r.template)         r.template         = 'classic';
    if (!r.targetRole)       r.targetRole       = '';
    if (r.colorTheme === undefined) r.colorTheme = '';
    return r;
  }

  const _listeners = [];
  function emit(ev, payload) { _listeners.forEach(fn => fn(ev, payload)); }
  function onChange(fn)       { _listeners.push(fn); }

  async function getAll()        { return StorageService.getAllResumes(); }
  async function get(id)         { const r = await StorageService.getResume(id); return r ? migrate(r) : null; }
  async function create(partial) { const r = Object.assign(blankResume(), partial); await StorageService.saveResume(r); emit('created', r); return r; }
  async function save(r)         { const s = await StorageService.saveResume(r); emit('saved', s); return s; }
  async function remove(id)      { const r = await StorageService.getResume(id); await StorageService.deleteResume(id); emit('deleted',{id,r}); return r; }

  async function duplicate(id) {
    const orig = await get(id);
    if (!orig) throw new Error('Not found');
    const copy = Helpers.deepClone(orig);
    copy.id = Helpers.uid(); copy.name = orig.name + ' (Copy)';
    copy.createdAt = copy.updatedAt = Date.now();
    await StorageService.saveResume(copy); emit('created', copy); return copy;
  }

  function addExperience(r)         { r.experience.push({ id:Helpers.uid(), company:'', role:'', location:'', startDate:'', endDate:'', current:false, bullets:['','',''] }); return r; }
  function removeExperience(r, id)  { r.experience = r.experience.filter(e => e.id !== id); return r; }
  function addEducation(r)          { r.education.push({ id:Helpers.uid(), institution:'', degree:'', field:'', startYear:'', endYear:'', cgpa:'' }); return r; }
  function removeEducation(r, id)   { r.education = r.education.filter(e => e.id !== id); return r; }
  function addProject(r)            { r.projects.push({ id:Helpers.uid(), name:'', description:'', tech:'', github:'', live:'' }); return r; }
  function removeProject(r, id)     { r.projects = r.projects.filter(e => e.id !== id); return r; }
  function addCertification(r)      { r.certifications.push({ id:Helpers.uid(), name:'', org:'', issueDate:'', credentialUrl:'' }); return r; }
  function removeCertification(r,id){ r.certifications = r.certifications.filter(e => e.id !== id); return r; }

  function exportJSON(r)   { return JSON.stringify({ _version: SCHEMA_VERSION, resume: r }, null, 2); }
  function importJSON(str) {
    let parsed;
    try { parsed = JSON.parse(str); } catch { throw new Error('Invalid JSON.'); }
    const data = parsed.resume ?? parsed;
    if (typeof data !== 'object' || !data.personal || !Array.isArray(data.skills)) throw new Error('Invalid resume schema.');
    const r = migrate(data);
    r.id = Helpers.uid(); r.createdAt = r.updatedAt = Date.now();
    return r;
  }

  return { blankResume, getAll, get, create, save, remove, duplicate, onChange, exportJSON, importJSON, addExperience, removeExperience, addEducation, removeEducation, addProject, removeProject, addCertification, removeCertification };
})();

/* ══════════════════════════════════════════════════════════════
   ATS ANALYZER
══════════════════════════════════════════════════════════════ */
const ATSAnalyzer = (() => {
  const ROLE_KEYWORDS = {
    'Frontend Developer':    ['React','JavaScript','TypeScript','HTML','CSS','Webpack','Vite','REST API','Jest','Playwright','CI/CD','Agile','Git','Redux','Vue'],
    'Backend Developer':     ['Node.js','Express','Python','Django','REST API','GraphQL','PostgreSQL','MySQL','MongoDB','Docker','Kubernetes','AWS','CI/CD','Microservices','Redis'],
    'Full Stack Developer':  ['React','Node.js','TypeScript','REST API','MongoDB','PostgreSQL','Docker','AWS','CI/CD','GraphQL','Git','Agile','Jest','Webpack'],
    'QA Engineer':           ['Selenium','Playwright','Cypress','Jest','TestNG','JUnit','API Testing','Manual Testing','Automation','CI/CD','JIRA','Agile','SQL','Regression'],
    'DevOps Engineer':       ['Docker','Kubernetes','AWS','Azure','GCP','Terraform','CI/CD','Jenkins','Ansible','Linux','Python','Bash','Monitoring','Git'],
    'Data Scientist':        ['Python','Pandas','NumPy','Scikit-learn','TensorFlow','Machine Learning','SQL','Statistics','Jupyter','Data Visualization','NLP','Deep Learning'],
    'Data Engineer':         ['Python','SQL','Spark','Airflow','Kafka','AWS','ETL','Data Pipeline','PostgreSQL','BigQuery','dbt','Hadoop','Redshift','Snowflake'],
    'Product Manager':       ['Roadmap','Agile','Scrum','KPIs','Stakeholder','User Research','A/B Testing','JIRA','Product Strategy','Go-to-market','OKRs'],
    'UI/UX Designer':        ['Figma','User Research','Wireframing','Prototyping','Usability Testing','Design System','Adobe XD','Accessibility','Interaction Design','CSS'],
    'Android Developer':     ['Kotlin','Java','Android SDK','Jetpack Compose','MVVM','Retrofit','Room','Coroutines','Firebase','CI/CD','Play Store','REST API'],
    'iOS Developer':         ['Swift','Objective-C','SwiftUI','UIKit','CoreData','Xcode','REST API','MVVM','TestFlight','App Store','Combine'],
    'Cloud Architect':       ['AWS','Azure','GCP','Terraform','CloudFormation','Kubernetes','Docker','Microservices','Serverless','Security','Cost Optimization','Networking'],
  };
  const DEFAULT_KW = ['Communication','Problem Solving','Leadership','Teamwork','Agile','Git','CI/CD','Analytical','Detail-oriented','Project Management'];

  function keywordsForRole(role) {
    if (!role) return DEFAULT_KW;
    if (ROLE_KEYWORDS[role]) return ROLE_KEYWORDS[role];
    const lower = role.toLowerCase();
    const match = Object.keys(ROLE_KEYWORDS).find(k => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase().split(' ')[0]));
    return match ? ROLE_KEYWORDS[match] : DEFAULT_KW;
  }

  function fullText(r) {
    const p = r.personal || {};
    const parts = [p.fullName, p.title, r.summary, r.targetRole, ...(r.skills||[])];
    (r.experience||[]).forEach(e => { parts.push(e.company, e.role, e.location); (e.bullets||[]).forEach(b => parts.push(b)); });
    (r.education||[]).forEach(e => parts.push(e.institution, e.degree, e.field));
    (r.projects||[]).forEach(p => parts.push(p.name, p.description, p.tech));
    (r.certifications||[]).forEach(c => parts.push(c.name, c.org));
    (r.achievements||[]).forEach(a => parts.push(a));
    return parts.filter(Boolean).join(' ');
  }

  function analyze(r) {
    const result = { score:0, grade:'', criteria:[], suggestions:[], warnings:[], tips:[], keywords:{ present:[], missing:[], suggested:[] } };

    // Sections (20)
    let secPts = 0;
    const p = r.personal || {};
    if (p.fullName?.trim()) secPts += 3; else result.warnings.push('Full name is missing — required by all ATS systems.');
    if (r.summary?.trim()) secPts += 4;  else result.warnings.push('Add a professional summary — most ATS rank it highly.');
    if (r.skills?.length)  secPts += 4;  else result.warnings.push('Add at least 5 skills. Skills sections are critical for keyword matching.');
    if (r.experience?.length) secPts += 5; else result.warnings.push('Work experience is the most weighted section in ATS scoring.');
    if (r.education?.length)  secPts += 4; else result.warnings.push('Education section is required by most ATS filters.');

    // Keywords (25)
    const kws     = keywordsForRole(r.targetRole?.trim());
    const resText = fullText(r).toLowerCase();
    const present = kws.filter(k => resText.includes(k.toLowerCase()));
    const missing = kws.filter(k => !resText.includes(k.toLowerCase()));
    result.keywords = { present, missing, suggested: kws };
    let kwPts = 0;
    if (!r.targetRole?.trim()) { result.tips.push('Enter a target role to get keyword suggestions tailored to that position.'); kwPts = 8; }
    else { if (missing.length > 5) result.suggestions.push('Your resume is missing important keywords for this role.'); kwPts = Math.round((present.length / kws.length) * 25); }

    // Experience quality (20)
    let expPts = 0, totalBullets = 0, shortBullets = 0;
    (r.experience||[]).forEach(e => {
      if (e.company?.trim()) expPts += 1;
      if (e.role?.trim())    expPts += 1;
      if (e.startDate)       expPts += 0.5;
      (e.bullets||[]).forEach(b => { if (b.trim()) { totalBullets++; if (b.trim().split(/\s+/).length < 8) shortBullets++; } });
    });
    if (totalBullets > 0) expPts += (1 - shortBullets/totalBullets) * 8;
    if (shortBullets > 0) result.suggestions.push('Use action-oriented bullet points (10+ words) to describe your impact.');
    expPts = Math.min(20, expPts);

    // Skill density (15)
    const cnt = (r.skills||[]).length;
    let skillPts = cnt === 0 ? 0 : cnt < 5 ? 4 : cnt < 8 ? 9 : cnt < 12 ? 13 : 15;
    if (cnt > 0 && cnt < 5) result.suggestions.push('Add more skills (aim for 8–15) to improve keyword density.');

    // Completeness (20)
    let compPts = 0;
    if (p.email?.trim()) compPts += 3; else result.warnings.push('Email address is missing from contact information.');
    if (p.phone?.trim()) compPts += 2; else result.warnings.push('Phone number is missing from contact information.');
    if (p.city?.trim())  compPts += 1;
    if (p.linkedin?.trim()) compPts += 2;
    const wc = r.summary?.trim().split(/\s+/).length || 0;
    if (wc >= 30) compPts += 3; else if (wc > 0) { compPts += 1; result.suggestions.push('Your summary is too short. Aim for 50-150 words.'); }
    if ((r.projects||[]).length >= 1)      compPts += 2;
    if ((r.certifications||[]).length >= 1) compPts += 2;
    if ((r.achievements||[]).length >= 1)   compPts += 2;
    if ((r.languages||[]).length >= 1)      compPts += 1;
    compPts = Math.min(20, compPts);

    result.score = Math.min(100, Math.round(secPts + kwPts + expPts + skillPts + compPts));
    result.grade = result.score >= 85 ? 'Excellent' : result.score >= 70 ? 'Good' : result.score >= 50 ? 'Fair' : 'Poor';
    result.criteria = [
      { label:'Required Sections',  max:20, earned:Math.round(secPts)  },
      { label:'Keyword Presence',   max:25, earned:Math.round(kwPts)   },
      { label:'Experience Quality', max:20, earned:Math.round(expPts)  },
      { label:'Skill Density',      max:15, earned:skillPts            },
      { label:'Completeness',       max:20, earned:Math.round(compPts) },
    ];
    return result;
  }

  function suggestKeywords(role) { return keywordsForRole(role); }
  const supportedRoles = Object.keys(ROLE_KEYWORDS);

  return { analyze, suggestKeywords, supportedRoles };
})();

/* ══════════════════════════════════════════════════════════════
   RESUME TEMPLATES
══════════════════════════════════════════════════════════════ */
const ResumeTemplates = (() => {
  const S = Helpers.sanitize;
  const FMY = Helpers.formatMonthYear;

  function contact(p) {
    const items = [
      p.email     && { label: 'Email',     value: p.email },
      p.phone     && { label: 'Phone',     value: p.phone },
      (p.city || p.country) && { label: 'Address',  value: [p.city, p.country].filter(Boolean).join(', ') },
      p.linkedin  && { label: 'LinkedIn',  value: p.linkedin },
      p.github    && { label: 'GitHub',    value: p.github },
      p.portfolio && { label: 'Portfolio', value: p.portfolio },
    ].filter(Boolean);
    return items.map(({ label, value }) =>
      `<span><span class="contact-label">${label}:</span> ${S(value)}</span>`
    ).join('');
  }

  function summary(s)   { return s?.trim() ? `<div class="sec-title">Professional Summary</div><p class="sec-content">${S(s)}</p>` : ''; }
  function skills(sk)   { return sk?.length  ? `<div class="sec-title">Skills</div><p class="skills-text">${sk.map(s=>S(s)).join(' • ')}</p>` : ''; }

  function experience(exp) {
    if (!exp?.length) return '';
    return '<div class="sec-title">Work Experience</div>' + exp.map(e => {
      const dates = e.current ? `${FMY(e.startDate)} – Present` : `${FMY(e.startDate)}${e.endDate?' – '+FMY(e.endDate):''}`;
      const bullets = (e.bullets||[]).filter(b=>b.trim());
      return `<div class="exp-entry">
        <div class="exp-header"><span class="exp-company">${S(e.company)}</span><span class="exp-dates">${S(dates)}</span></div>
        <div class="exp-role">${S(e.role)}${e.location?' · '+S(e.location):''}</div>
        ${bullets.length?`<ul class="exp-bullets">${bullets.map(b=>`<li>${S(b)}</li>`).join('')}</ul>`:''}
      </div>`;
    }).join('');
  }

  function education(edu) {
    if (!edu?.length) return '';
    return '<div class="sec-title">Education</div>' + edu.map(e => `
      <div class="edu-entry">
        <div class="edu-header"><span class="edu-school">${S(e.institution)}</span><span class="edu-years">${S(e.startYear)}${e.endYear?' – '+S(e.endYear):''}</span></div>
        <div class="edu-degree">${S(e.degree)}${e.field?', '+S(e.field):''}${e.cgpa?' · GPA: '+S(e.cgpa):''}</div>
      </div>`).join('');
  }

  function projects(projs) {
    if (!projs?.length) return '';
    return '<div class="sec-title">Projects</div>' + projs.map(p => `
      <div class="proj-entry">
        <div class="proj-name">${S(p.name)}${p.github?` <span style="font-weight:400;font-size:.9em;color:#666"> · ${S(p.github)}</span>`:''}${p.live?` <span style="font-weight:400;font-size:.9em;color:#666"> · ${S(p.live)}</span>`:''}</div>
        ${p.tech?`<div class="proj-tech">Tech: ${S(p.tech)}</div>`:''}
        ${p.description?`<div class="proj-desc">${S(p.description)}</div>`:''}
      </div>`).join('');
  }

  function certifications(certs) {
    if (!certs?.length) return '';
    return '<div class="sec-title">Certifications</div>' + certs.map(c => `
      <div class="cert-entry">
        <span class="cert-name">${S(c.name)}</span>${c.org?` — <span class="cert-org">${S(c.org)}</span>`:''}${c.issueDate?` <span style="color:#9CA3AF;font-size:.9em">(${S(c.issueDate)})</span>`:''}${c.credentialUrl?` <span style="color:#666;font-size:.9em">${S(c.credentialUrl)}</span>`:''}
      </div>`).join('');
  }

  function achievements(items) {
    if (!items?.length) return '';
    return `<div class="sec-title">Achievements</div><ul class="achiev-list">${items.filter(Boolean).map(a=>`<li>${S(a)}</li>`).join('')}</ul>`;
  }

  function languages(langs) {
    if (!langs?.length) return '';
    return `<div class="sec-title">Languages</div><p class="lang-list">${langs.map(l=>S(l)).join(' · ')}</p>`;
  }

  function renderClassic(r) {
    const p = r.personal||{};
    return `<div class="tpl-classic">
      <div class="res-name">${S(p.fullName||'Your Name')}</div>
      ${p.title?`<div class="res-title">${S(p.title)}</div>`:''}
      <div class="res-contact">${contact(p)}</div>
      ${summary(r.summary)}${skills(r.skills)}${experience(r.experience)}${education(r.education)}${projects(r.projects)}${certifications(r.certifications)}${achievements(r.achievements)}${languages(r.languages)}
    </div>`;
  }

  function renderProfessional(r) {
    const p = r.personal||{};
    return `<div class="tpl-professional">
      <div class="res-name">${S(p.fullName||'Your Name')}</div>
      ${p.title?`<div class="res-title">${S(p.title)}</div>`:''}
      <div class="res-contact">${contact(p)}</div>
      ${summary(r.summary)}${skills(r.skills)}${experience(r.experience)}${education(r.education)}${projects(r.projects)}${certifications(r.certifications)}${achievements(r.achievements)}${languages(r.languages)}
    </div>`;
  }

  function renderMinimal(r) {
    const p = r.personal||{};
    return `<div class="tpl-minimal">
      <div class="res-name">${S(p.fullName||'Your Name')}</div>
      ${p.title?`<div class="res-title">${S(p.title)}</div>`:''}
      <div class="res-contact">${contact(p)}</div>
      ${summary(r.summary)}${skills(r.skills)}${experience(r.experience)}${education(r.education)}${projects(r.projects)}${certifications(r.certifications)}${achievements(r.achievements)}${languages(r.languages)}
    </div>`;
  }

  function render(r) {
    switch (r.template) {
      case 'professional': return renderProfessional(r);
      case 'minimal':      return renderMinimal(r);
      default:             return renderClassic(r);
    }
  }

  return { render };
})();

/* ══════════════════════════════════════════════════════════════
   PREVIEW RENDERER
══════════════════════════════════════════════════════════════ */
const PreviewRenderer = (() => {
  const ZOOM_STEP = 0.1, ZOOM_MIN = 0.4, ZOOM_MAX = 1.4, ZOOM_DEFAULT = 0.65;

  function create(canvasEl, zoomValEl) {
    let zoom = ZOOM_DEFAULT, pending = false, _resume = null;

    function applyZoom() {
      if (canvasEl) canvasEl.style.transform = `scale(${zoom})`;
      if (zoomValEl) zoomValEl.textContent = Math.round(zoom * 100) + '%';
    }

    function render() {
      if (!_resume || !canvasEl) return;

      const html = ResumeTemplates.render(_resume);

      // Measure content in a hidden off-screen container
      const measurer = document.createElement('div');
      measurer.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;pointer-events:none;z-index:-1;';
      measurer.innerHTML = html;
      document.body.appendChild(measurer);

      const tplDiv = measurer.firstElementChild;
      const tplClass = tplDiv ? tplDiv.className : '';

      // Usable height per page = A4 (1123px) minus the template's top+bottom padding
      const vPad = tplClass.includes('professional') ? 80 : tplClass.includes('minimal') ? 56 : 72;
      const usableH = 1123 - vPad;

      // Measure each direct child including its margins
      const kids = Array.from((tplDiv || measurer).children).map(el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          el: el.cloneNode(true),
          h: r.height + parseFloat(s.marginTop) + parseFloat(s.marginBottom),
          isSec: el.classList.contains('sec-title'),
        };
      });

      document.body.removeChild(measurer);

      // Paginate: keep sec-title together with the next sibling (no orphan headings)
      const pages = [[]];
      let used = 0;

      for (let i = 0; i < kids.length; i++) {
        const { el, h, isSec } = kids[i];
        const peekH = isSec && kids[i + 1] ? kids[i + 1].h : 0;

        if (used > 0 && used + h + peekH > usableH) {
          pages.push([]);
          used = 0;
        }
        pages[pages.length - 1].push(el);
        used += h;
      }

      // Build page divs in canvas
      canvasEl.innerHTML = '';
      pages.forEach(children => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'resume-page';
        const tpl = document.createElement('div');
        tpl.className = tplClass;
        children.forEach(c => tpl.appendChild(c));
        pageDiv.appendChild(tpl);
        canvasEl.appendChild(pageDiv);
      });
    }

    function schedule() {
      if (pending) return; pending = true;
      requestAnimationFrame(() => { pending = false; render(); });
    }

    applyZoom();

    return {
      update(r)  { _resume = r; schedule(); },
      zoomIn()   { zoom = Helpers.clamp(zoom + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX); applyZoom(); },
      zoomOut()  { zoom = Helpers.clamp(zoom - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX); applyZoom(); },
      zoomReset(){ zoom = ZOOM_DEFAULT; applyZoom(); },
    };
  }

  return { create };
})();

/* ══════════════════════════════════════════════════════════════
   TOAST SERVICE
══════════════════════════════════════════════════════════════ */
const ToastService = (() => {
  const ICONS = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  let container = null;

  function ensure() {
    if (!container) {
      container = document.getElementById('toast-container');
      if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    }
  }

  function show(message, type = 'info', duration = 4000) {
    ensure();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.setAttribute('role','alert');
    t.innerHTML = `<i class="toast-icon fa-solid ${ICONS[type]||ICONS.info}"></i><span class="toast-msg">${message}</span><button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;
    container.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    const dismiss = () => { t.classList.remove('show'); t.classList.add('hide'); setTimeout(() => t.remove(), 350); };
    t.querySelector('.toast-close').addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
    return dismiss;
  }

  return {
    show,
    success: (m,d) => show(m,'success',d),
    error:   (m,d) => show(m,'error',  d),
    warning: (m,d) => show(m,'warning',d),
    info:    (m,d) => show(m,'info',   d),
  };
})();

/* ══════════════════════════════════════════════════════════════
   PDF GENERATOR
══════════════════════════════════════════════════════════════ */
const PDFGenerator = (() => {
  const TEMPLATE_CSS = `
    @page{size:A4;margin-top:15mm;margin-bottom:15mm;margin-left:0;margin-right:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff}
    .tpl-classic{font-family:Arial,sans-serif;font-size:11pt;color:#1a1a1a;padding:0 48px;line-height:1.45}
    .tpl-classic .res-name{font-size:22pt;font-weight:700;margin-bottom:2px}
    .tpl-classic .res-title{font-size:11.5pt;color:#374151;margin-bottom:6px}
    .tpl-classic .res-contact{font-size:9.5pt;color:#4B5563;display:flex;flex-wrap:wrap;gap:6px 18px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #1a1a1a}
    .tpl-classic .sec-title{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin:14px 0 4px;padding-bottom:2px;border-bottom:1px solid #9CA3AF;color:#111827}
    .tpl-classic .exp-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-classic .exp-company{font-weight:700;font-size:10.5pt}.tpl-classic .exp-dates{font-size:9.5pt;color:#6B7280}
    .tpl-classic .exp-role{font-size:10pt;color:#374151;font-style:italic}
    .tpl-classic .exp-bullets{margin:3px 0 0 12px;padding-left:14px}.tpl-classic .exp-bullets li{font-size:10pt;margin-bottom:2px}
    .tpl-classic .edu-entry{margin-bottom:6px}.tpl-classic .edu-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-classic .edu-school{font-weight:700;font-size:10.5pt}.tpl-classic .edu-years{font-size:9.5pt;color:#6B7280}
    .tpl-classic .edu-degree{font-size:10pt;color:#374151}.tpl-classic .skills-text{font-size:10pt;line-height:1.6}
    .tpl-classic .proj-entry{margin-bottom:5px}.tpl-classic .proj-name{font-weight:700;font-size:10.5pt}
    .tpl-classic .proj-tech{font-size:9.5pt;color:#6B7280;font-style:italic}.tpl-classic .proj-desc{font-size:10pt}
    .tpl-classic .cert-entry{margin-bottom:4px;font-size:10pt}.tpl-classic .cert-name{font-weight:700}.tpl-classic .cert-org{color:#6B7280}
    .tpl-classic .achiev-list{padding-left:16px;font-size:10pt}.tpl-classic .achiev-list li{margin-bottom:2px}.tpl-classic .lang-list{font-size:10pt}
    .tpl-professional{font-family:Georgia,serif;font-size:11pt;color:#111827;padding:0 52px;line-height:1.5}
    .tpl-professional .res-name{font-size:24pt;font-weight:700;color:#1E3A5F;margin-bottom:2px}
    .tpl-professional .res-title{font-size:12pt;color:#4B5563;margin-bottom:8px}
    .tpl-professional .res-contact{font-size:9.5pt;color:#6B7280;display:flex;flex-wrap:wrap;gap:5px 16px;margin-bottom:14px;padding-bottom:10px;border-bottom:2.5px solid #1E3A5F}
    .tpl-professional .sec-title{font-size:10.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:16px 0 5px;color:#1E3A5F;padding-bottom:3px;border-bottom:1px solid #CBD5E1}
    .tpl-professional .exp-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-professional .exp-company{font-weight:700;font-size:10.5pt;color:#1E3A5F}.tpl-professional .exp-dates{font-size:9.5pt;color:#9CA3AF}
    .tpl-professional .exp-role{font-size:10pt;color:#374151}.tpl-professional .exp-bullets{margin:3px 0 0 14px;padding-left:14px}
    .tpl-professional .exp-bullets li{font-size:10pt;margin-bottom:2px}
    .tpl-professional .edu-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-professional .edu-school{font-weight:700;font-size:10.5pt;color:#1E3A5F}.tpl-professional .edu-years{font-size:9.5pt;color:#9CA3AF}
    .tpl-professional .edu-degree{font-size:10pt;color:#374151}.tpl-professional .skills-text{font-size:10pt}
    .tpl-professional .proj-entry{margin-bottom:6px}.tpl-professional .proj-name{font-weight:700;color:#1E3A5F;font-size:10.5pt}
    .tpl-professional .proj-tech{font-size:9.5pt;color:#9CA3AF;font-style:italic}.tpl-professional .proj-desc{font-size:10pt}
    .tpl-professional .cert-entry{margin-bottom:4px;font-size:10pt}.tpl-professional .achiev-list{padding-left:16px;font-size:10pt}.tpl-professional .lang-list{font-size:10pt}
    .tpl-minimal{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10pt;color:#1a1a1a;padding:0 42px;line-height:1.4}
    .tpl-minimal .res-name{font-size:18pt;font-weight:700;margin-bottom:1px}.tpl-minimal .res-title{font-size:10.5pt;color:#555;margin-bottom:5px}
    .tpl-minimal .res-contact{font-size:9pt;color:#666;display:flex;flex-wrap:wrap;gap:4px 14px;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #ccc}
    .tpl-minimal .sec-title{font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:11px 0 3px;color:#333}
    .tpl-minimal .exp-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-minimal .exp-company{font-weight:700;font-size:10pt}.tpl-minimal .exp-dates{font-size:9pt;color:#999}
    .tpl-minimal .exp-role{font-size:9.5pt;color:#555}.tpl-minimal .exp-bullets{margin:2px 0 0 12px;padding-left:14px}
    .tpl-minimal .exp-bullets li{font-size:9.5pt;margin-bottom:1.5px}
    .tpl-minimal .edu-header{display:flex;justify-content:space-between;align-items:baseline}
    .tpl-minimal .edu-school{font-weight:700;font-size:10pt}.tpl-minimal .edu-years{font-size:9pt;color:#999}
    .tpl-minimal .edu-degree{font-size:9.5pt;color:#555}.tpl-minimal .skills-text{font-size:9.5pt}
    .tpl-minimal .proj-entry{margin-bottom:4px}.tpl-minimal .proj-name{font-weight:700;font-size:10pt}
    .tpl-minimal .proj-tech{font-size:9pt;color:#999;font-style:italic}.tpl-minimal .proj-desc{font-size:9.5pt}
    .tpl-minimal .cert-entry{margin-bottom:3px;font-size:9.5pt}.tpl-minimal .achiev-list{padding-left:14px;font-size:9.5pt}.tpl-minimal .lang-list{font-size:9.5pt}
    .tpl-classic .res-contact{display:block;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #1a1a1a}
    .tpl-classic .res-contact>span{display:block;line-height:1.8}
    .tpl-classic .contact-label{font-weight:700;color:#111827}
    .tpl-professional .res-contact{display:block;margin-bottom:14px;padding-bottom:10px;border-bottom:2.5px solid #1E3A5F}
    .tpl-professional .res-contact>span{display:block;line-height:1.8}
    .tpl-professional .contact-label{font-weight:700;color:#1E3A5F}
    .tpl-minimal .res-contact{display:block;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #ccc}
    .tpl-minimal .res-contact>span{display:block;line-height:1.75}
    .tpl-minimal .contact-label{font-weight:700;color:#333}
    .exp-entry,.edu-entry,.proj-entry,.cert-entry{margin-bottom:8px;break-inside:avoid;page-break-inside:avoid}.sec-content{font-size:10pt;margin:0}`;

  function generate(resume) {
    const filename  = Helpers.toFilename(resume.personal?.fullName || 'Resume') + '.pdf';
    const body      = ResumeTemplates.render(resume);
    const t         = COLOR_THEMES[resume.colorTheme];
    const colorCSS  = t ? `.res-name{color:${t.resName}!important}.res-title{color:${t.resTitle}!important}.contact-label{color:${t.contactLabel}!important}.sec-title{color:${t.secTitle}!important;border-bottom-color:${t.secBorder}!important}.exp-company,.edu-school,.proj-name,.cert-name{color:${t.entryTitle}!important}.exp-role,.proj-tech,.cert-org,.exp-dates,.edu-years{color:${t.entrySubtitle}!important}` : '';
    const html      = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename.replace('.pdf','')}</title><style>${TEMPLATE_CSS}${colorCSS}</style></head><body>${body}</body></html>`;

    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        try {
          iframe.contentDocument.title = filename.replace('.pdf', '');
          setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => { document.body.removeChild(iframe); resolve(filename); }, 1500);
          }, 400);
        } catch(e) { document.body.removeChild(iframe); reject(e); }
      };
      iframe.srcdoc = html;
    });
  }

  return { generate };
})();

/* ══════════════════════════════════════════════════════════════
   IMPORT / EXPORT SERVICE
══════════════════════════════════════════════════════════════ */
const ImportExportService = (() => {
  function exportResume(r) {
    const json     = ResumeManager.exportJSON(r);
    const filename = (r.name || 'resume').replace(/\s+/g,'_') + '.json';
    Helpers.downloadText(json, filename);
  }

  function importResume() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = '.json,application/json';
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return reject(new Error('No file selected.'));
        try { const text = await Helpers.readFileAsText(file); resolve(ResumeManager.importJSON(text)); }
        catch(e) { reject(e); }
      };
      input.click();
    });
  }

  return { exportResume, importResume };
})();

/* ══════════════════════════════════════════════════════════════
   SKILL SUGGESTIONS LIST
══════════════════════════════════════════════════════════════ */
const SKILL_SUGGESTIONS = [
  'JavaScript','TypeScript','React','Vue','Angular','Node.js','Express',
  'Python','Django','Flask','FastAPI','Java','Spring Boot','Kotlin','PHP',
  'Laravel','Ruby on Rails','Go','Rust','C#','.NET','Swift',
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

/* ══════════════════════════════════════════════════════════════
   COLOR THEMES  – preset palette applied to every resume element
══════════════════════════════════════════════════════════════ */
const COLOR_THEMES = {
  default: { resName:'#111827', resTitle:'#374151', contactLabel:'#111827', secTitle:'#111827', secBorder:'#9CA3AF', entryTitle:'#111827', entrySubtitle:'#6B7280' },
  blue:    { resName:'#1E3A8A', resTitle:'#1D4ED8', contactLabel:'#1E3A8A', secTitle:'#1E3A8A', secBorder:'#93C5FD', entryTitle:'#1E40AF', entrySubtitle:'#3B82F6' },
  purple:  { resName:'#3B0764', resTitle:'#6D28D9', contactLabel:'#4C1D95', secTitle:'#4C1D95', secBorder:'#C4B5FD', entryTitle:'#5B21B6', entrySubtitle:'#7C3AED' },
  green:   { resName:'#022C22', resTitle:'#065F46', contactLabel:'#047857', secTitle:'#064E3B', secBorder:'#6EE7B7', entryTitle:'#047857', entrySubtitle:'#059669' },
  red:     { resName:'#7F1D1D', resTitle:'#991B1B', contactLabel:'#B91C1C', secTitle:'#7F1D1D', secBorder:'#FCA5A5', entryTitle:'#B91C1C', entrySubtitle:'#EF4444' },
  saffron: { resName:'#78350F', resTitle:'#92400E', contactLabel:'#B45309', secTitle:'#78350F', secBorder:'#FCD34D', entryTitle:'#B45309', entrySubtitle:'#D97706' },
};

/* ══════════════════════════════════════════════════════════════
   ROLES  – single source of truth for all role dropdowns,
            ATS keywords, sample cards, and metadata maps
══════════════════════════════════════════════════════════════ */
const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'QA Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Android Developer',
  'iOS Developer',
  'Cloud Architect',
];

function populateRoleSelects() {
  const optionsHTML = ROLES.map(r => `<option value="${r}">${r}</option>`).join('');
  ['f-targetRole', 'new-resume-role'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const blank = sel.querySelector('option[value=""]');
    sel.innerHTML = (blank ? blank.outerHTML : '') + optionsHTML;
  });
}

/* ══════════════════════════════════════════════════════════════
   SAMPLE RESUMES  – realistic pre-filled data per role
══════════════════════════════════════════════════════════════ */
const SAMPLE_RESUMES = {

  'Frontend Developer': {
    name: 'Frontend Developer – Sample',
    template: 'classic',
    targetRole: 'Frontend Developer',
    personal: { fullName: 'Aisha Kapoor', title: 'Senior Frontend Developer', email: 'aisha.kapoor@email.com', phone: '+91 98201 34567', city: 'Bengaluru', country: 'India', linkedin: 'linkedin.com/in/aishakapoor', github: 'github.com/aishakapoor', portfolio: 'aishakapoor.dev' },
    summary: 'Results-driven Senior Frontend Developer with 5+ years of experience building high-performance, accessible web applications using React and TypeScript. Passionate about clean code, design systems, and delivering pixel-perfect UIs that delight users. Proven track record of reducing page load times by 40% and leading cross-functional teams to ship features on schedule.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS', 'Webpack', 'Vite', 'Jest', 'Playwright', 'REST API', 'GraphQL', 'Git', 'CI/CD', 'Figma', 'Agile'],
    experience: [
      { id: Helpers.uid(), company: 'Flipkart', role: 'Senior Frontend Developer', location: 'Bengaluru, India', startDate: '2022-03', endDate: '', current: true, bullets: ['Led a team of 4 engineers to redesign the product listing page, improving Core Web Vitals scores by 35% and increasing conversions by 12%.', 'Architected a reusable component library using React + TypeScript, adopted across 6 product teams and reducing UI development time by 30%.', 'Implemented lazy loading and code-splitting strategies that reduced initial bundle size from 1.8 MB to 620 KB.', 'Mentored 3 junior developers through bi-weekly code reviews and pair programming sessions.'] },
      { id: Helpers.uid(), company: 'Razorpay', role: 'Frontend Developer', location: 'Bengaluru, India', startDate: '2020-06', endDate: '2022-02', current: false, bullets: ['Built the payment checkout flow using React and Redux, handling ₹50 Cr+ in daily transactions with 99.9% uptime.', 'Integrated Playwright end-to-end tests covering 85% of critical user journeys, catching 20+ regressions before release.', 'Collaborated with UX designers to implement a new design system, reducing inconsistencies across 30+ screens.'] },
      { id: Helpers.uid(), company: 'Infosys', role: 'Junior Frontend Developer', location: 'Pune, India', startDate: '2019-07', endDate: '2020-05', current: false, bullets: ['Developed responsive landing pages for 5 enterprise clients using HTML5, CSS3, and vanilla JavaScript.', 'Reduced reported UI bugs by 40% by introducing ESLint and Prettier into the development workflow.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'BITS Pilani', degree: 'B.E. Computer Science', field: 'Computer Science', startYear: '2015', endYear: '2019', cgpa: '8.4' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'OpenCart UI', description: 'Open-source e-commerce frontend built with Next.js 14, featuring server-side rendering, dynamic product filters, and a cart with optimistic UI updates. Reached 1.2k GitHub stars.', tech: 'Next.js, TypeScript, Tailwind CSS, Zustand', github: 'github.com/aishakapoor/opencart-ui', live: 'opencart-ui.vercel.app' },
      { id: Helpers.uid(), name: 'DevBoard', description: 'Real-time developer dashboard for monitoring CI/CD pipelines and deployment metrics, built with React, WebSockets, and Recharts.', tech: 'React, WebSockets, Recharts, Node.js', github: 'github.com/aishakapoor/devboard', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Meta Frontend Developer Professional Certificate', org: 'Meta / Coursera', issueDate: '2022-08', credentialUrl: 'coursera.org/verify/meta-fe-2022' },
      { id: Helpers.uid(), name: 'AWS Certified Developer – Associate', org: 'Amazon Web Services', issueDate: '2023-01', credentialUrl: 'aws.amazon.com/certification' },
    ],
    achievements: ['Speaker at ReactConf India 2023 – "Building Design Systems at Scale"', 'Won internal Hackathon 2022 at Razorpay for fastest checkout prototype', 'Open-source maintainer with 2k+ GitHub stars across repositories'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Kannada (Basic)'],
  },

  'Backend Developer': {
    name: 'Backend Developer – Sample',
    template: 'classic',
    targetRole: 'Backend Developer',
    personal: { fullName: 'Rohan Sharma', title: 'Senior Backend Engineer', email: 'rohan.sharma@email.com', phone: '+91 97301 22456', city: 'Hyderabad', country: 'India', linkedin: 'linkedin.com/in/rohansharma', github: 'github.com/rohansharma', portfolio: '' },
    summary: 'Senior Backend Engineer with 6 years of experience designing and scaling distributed systems that serve 10M+ daily active users. Deep expertise in Node.js, Python, PostgreSQL, and cloud-native architectures on AWS. Passionate about clean API design, observability, and engineering reliability.',
    skills: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Kafka', 'Git', 'Terraform', 'Agile'],
    experience: [
      { id: Helpers.uid(), company: 'Swiggy', role: 'Senior Backend Engineer', location: 'Hyderabad, India', startDate: '2021-09', endDate: '', current: true, bullets: ['Designed and built the order-tracking microservice in Node.js that handles 200K+ concurrent WebSocket connections with sub-100ms latency.', 'Migrated a monolithic payments service to event-driven microservices using Kafka, reducing deployment coupling and improving release cadence from monthly to weekly.', 'Led database performance optimisations on PostgreSQL that reduced query P99 latency from 800 ms to 90 ms for the restaurant search API.', 'Implemented distributed tracing with OpenTelemetry and Datadog, cutting mean-time-to-resolve incidents by 55%.'] },
      { id: Helpers.uid(), company: 'Freshworks', role: 'Backend Engineer', location: 'Hyderabad, India', startDate: '2019-06', endDate: '2021-08', current: false, bullets: ['Built RESTful APIs in Python/FastAPI for the CRM notification engine, serving 5M+ events per day.', 'Designed a Redis-based rate-limiting layer that prevented API abuse and reduced infrastructure costs by 18%.', 'Contributed to internal tooling that automated DB migration deployments, saving 3 hours per sprint cycle.'] },
      { id: Helpers.uid(), company: 'Cognizant', role: 'Associate Software Engineer', location: 'Chennai, India', startDate: '2018-07', endDate: '2019-05', current: false, bullets: ['Developed CRUD REST APIs using Express.js for a healthcare client portal used by 50K+ patients.', 'Wrote unit and integration tests achieving 80% code coverage using Jest and Supertest.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'NIT Warangal', degree: 'B.Tech Computer Science', field: 'Computer Science', startYear: '2014', endYear: '2018', cgpa: '8.7' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'LogStream', description: 'High-throughput log aggregation service built with Node.js and Kafka, capable of processing 500K log events/sec. Includes a REST query API backed by Elasticsearch.', tech: 'Node.js, Kafka, Elasticsearch, Docker', github: 'github.com/rohansharma/logstream', live: '' },
      { id: Helpers.uid(), name: 'AuthKit', description: 'Open-source JWT + OAuth2 authentication library for Node.js with built-in rate limiting, refresh token rotation, and PKCE support.', tech: 'Node.js, TypeScript, Redis, PostgreSQL', github: 'github.com/rohansharma/authkit', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'AWS Certified Solutions Architect – Associate', org: 'Amazon Web Services', issueDate: '2022-05', credentialUrl: 'aws.amazon.com/certification' },
      { id: Helpers.uid(), name: 'MongoDB Certified Developer', org: 'MongoDB University', issueDate: '2021-11', credentialUrl: 'university.mongodb.com' },
    ],
    achievements: ['Reduced Swiggy order API p99 latency by 65% through systematic query optimisation', 'Led backend guild of 8 engineers, establishing coding standards adopted company-wide', 'Published article "Scaling WebSockets to 200K connections" – 15K+ reads on Medium'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Telugu (Conversational)'],
  },

  'Full Stack Developer': {
    name: 'Full Stack Developer – Sample',
    template: 'professional',
    targetRole: 'Full Stack Developer',
    personal: { fullName: 'Priya Nair', title: 'Full Stack Developer', email: 'priya.nair@email.com', phone: '+91 99201 78654', city: 'Mumbai', country: 'India', linkedin: 'linkedin.com/in/priyanair', github: 'github.com/priyanair', portfolio: 'priyanair.io' },
    summary: 'Full Stack Developer with 4 years of experience delivering end-to-end web applications from database schema to responsive UI. Proficient across the MERN stack with strong DevOps skills. Thrive in startup environments where ownership, speed, and quality matter equally.',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Express', 'Docker', 'AWS', 'REST API', 'GraphQL', 'Redux', 'Tailwind CSS', 'CI/CD', 'Jest', 'Git', 'Agile', 'Webpack'],
    experience: [
      { id: Helpers.uid(), company: 'Urban Company', role: 'Full Stack Developer', location: 'Mumbai, India', startDate: '2022-01', endDate: '', current: true, bullets: ['Built a real-time service partner tracking feature end-to-end using React, Node.js, and WebSockets, used by 2M+ customers monthly.', 'Redesigned the onboarding flow for service partners, reducing drop-off by 28% through form optimisation and progressive profiling.', 'Set up the company\'s first Docker + GitHub Actions CI/CD pipeline, cutting deployment time from 45 minutes to 8 minutes.', 'Integrated Stripe payment gateway with webhook handling, processing ₹10 Cr+ monthly with zero downtime.'] },
      { id: Helpers.uid(), company: 'Ola', role: 'Software Engineer', location: 'Bengaluru, India', startDate: '2020-08', endDate: '2021-12', current: false, bullets: ['Developed driver earnings dashboard using React and D3.js, improving driver retention by providing transparent payout visibility.', 'Built and maintained 12 REST APIs in Node.js/Express for the driver app backend, handling 500K+ daily requests.', 'Optimised MongoDB aggregation queries reducing dashboard load time from 4s to 600ms.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'Mumbai University', degree: 'B.Sc. Information Technology', field: 'Information Technology', startYear: '2016', endYear: '2020', cgpa: '8.1' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'TaskFlow', description: 'A full-stack project management SaaS with real-time collaboration, Kanban boards, and Slack integration. 500+ active users. Built solo from design to deployment.', tech: 'React, Node.js, MongoDB, Socket.io, AWS EC2', github: 'github.com/priyanair/taskflow', live: 'taskflow.app' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Full Stack Web Development', org: 'Udemy – Angela Yu', issueDate: '2020-03', credentialUrl: 'udemy.com/certificate/full-stack' },
    ],
    achievements: ['Solo-built and launched TaskFlow SaaS with 500+ paying users in 6 months', 'Top 5% on LeetCode with 400+ problems solved'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Native)'],
  },

  'QA Engineer': {
    name: 'QA Engineer – Sample',
    template: 'classic',
    targetRole: 'QA Engineer',
    personal: { fullName: 'Arjun Mehta', title: 'Senior QA Automation Engineer', email: 'arjun.mehta@email.com', phone: '+91 98567 43210', city: 'Pune', country: 'India', linkedin: 'linkedin.com/in/arjunmehta-qa', github: 'github.com/arjunmehta-qa', portfolio: '' },
    summary: 'Senior QA Automation Engineer with 5 years of experience building robust test frameworks from scratch. Expert in Playwright, Selenium, and API testing with a strong focus on shifting quality left. Reduced regression cycle time by 70% at previous employer through strategic test automation.',
    skills: ['Playwright', 'Selenium', 'Cypress', 'Jest', 'TestNG', 'JUnit', 'API Testing', 'Postman', 'Rest Assured', 'SQL', 'CI/CD', 'Jenkins', 'JIRA', 'Agile', 'Python', 'JavaScript', 'Performance Testing', 'Manual Testing'],
    experience: [
      { id: Helpers.uid(), company: 'Paytm', role: 'Senior QA Automation Engineer', location: 'Pune, India', startDate: '2021-06', endDate: '', current: true, bullets: ['Architected an end-to-end Playwright test framework from zero covering web and API layers, achieving 92% automation coverage across 8 product squads.', 'Reduced regression execution time from 6 hours to 45 minutes by parallelising tests across 20 workers in CI.', 'Mentored a team of 5 junior QA engineers on writing maintainable Page Object Model tests and BDD scenarios.', 'Caught 34 critical production bugs in staging through exploratory testing sessions before each major release.'] },
      { id: Helpers.uid(), company: 'Wipro', role: 'QA Engineer', location: 'Pune, India', startDate: '2019-08', endDate: '2021-05', current: false, bullets: ['Built Selenium + TestNG automation suite for a banking client covering 600+ test cases with data-driven testing.', 'Performed API testing using Postman and Rest Assured for 40+ REST endpoints, identifying 18 contract violations.', 'Coordinated UAT with stakeholders and maintained JIRA test cycles for quarterly releases.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'Savitribai Phule Pune University', degree: 'B.E. Computer Engineering', field: 'Computer Engineering', startYear: '2015', endYear: '2019', cgpa: '7.9' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'PlaywrightKit', description: 'Open-source Playwright starter framework with POM architecture, API client, Allure reporting, GitHub Actions integration, and multi-browser CI matrix. 800+ GitHub stars.', tech: 'Playwright, TypeScript, Allure, GitHub Actions', github: 'github.com/arjunmehta-qa/playwrightkit', live: '' },
      { id: Helpers.uid(), name: 'APIAssert', description: 'Lightweight REST API testing CLI tool written in Python that validates JSON schemas, response times, and status codes from YAML test configs.', tech: 'Python, PyYAML, Requests, pytest', github: 'github.com/arjunmehta-qa/apiassert', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'ISTQB Certified Tester – Foundation Level', org: 'ISTQB', issueDate: '2020-02', credentialUrl: 'istqb.org' },
      { id: Helpers.uid(), name: 'Playwright Advanced Certification', org: 'LambdaTest', issueDate: '2023-03', credentialUrl: 'lambdatest.com/certifications' },
    ],
    achievements: ['Reduced regression cycle from 6 hours to 45 minutes at Paytm – saved 220 engineering hours/month', 'PlaywrightKit open-source repo reached 800+ GitHub stars in 6 months', 'Speaker at QAFest 2023 – "Shift-Left Testing with Playwright"'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Gujarati (Native)'],
  },

  'DevOps Engineer': {
    name: 'DevOps Engineer – Sample',
    template: 'classic',
    targetRole: 'DevOps Engineer',
    personal: { fullName: 'Vikram Singh', title: 'Senior DevOps Engineer', email: 'vikram.singh@email.com', phone: '+91 96201 55432', city: 'Bengaluru', country: 'India', linkedin: 'linkedin.com/in/vikramsingh-devops', github: 'github.com/vikramsingh-devops', portfolio: '' },
    summary: 'Senior DevOps Engineer with 6 years of experience building and operating production infrastructure on AWS and GCP serving 50M+ monthly users. Expert in Kubernetes, Terraform, and GitOps practices. Reduced deployment failure rate from 12% to 0.3% and cut cloud spend by $200K/year through rightsizing and reserved instance strategy.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Linux', 'Python', 'Bash', 'Prometheus', 'Grafana', 'Helm', 'ArgoCD', 'Datadog', 'Git'],
    experience: [
      { id: Helpers.uid(), company: 'Meesho', role: 'Senior DevOps Engineer', location: 'Bengaluru, India', startDate: '2021-04', endDate: '', current: true, bullets: ['Managed a 200-node Kubernetes cluster (EKS) across 3 AWS regions, maintaining 99.98% uptime for 50M+ monthly users.', 'Implemented GitOps with ArgoCD and Helm, enabling 15+ deploys per day with automated rollback on failure.', 'Authored Terraform modules for VPC, EKS, RDS, and S3 infrastructure, reducing provisioning time from 3 days to 2 hours.', 'Established SLO/SLI monitoring with Prometheus + Grafana, reducing MTTR from 45 minutes to 8 minutes.', 'Rightsized EC2 instances and adopted Spot instances for non-critical workloads, saving $200K/year in cloud costs.'] },
      { id: Helpers.uid(), company: 'Tata Consultancy Services', role: 'DevOps Engineer', location: 'Bengaluru, India', startDate: '2018-08', endDate: '2021-03', current: false, bullets: ['Migrated 40+ services from bare-metal VMs to Docker containers, reducing server count by 60%.', 'Built Jenkins CI/CD pipelines for 12 microservices with automated test, build, and deploy stages.', 'Configured Ansible playbooks for automated OS patching across a fleet of 300+ servers.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'Delhi Technological University', degree: 'B.Tech Electronics & Communication', field: 'Electronics & Communication', startYear: '2014', endYear: '2018', cgpa: '7.6' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'K8s Auto-Scaler', description: 'Custom Kubernetes operator that scales deployments based on custom business metrics from Prometheus, beyond what HPA supports natively. Used in production at Meesho.', tech: 'Go, Kubernetes Operator SDK, Prometheus', github: 'github.com/vikramsingh-devops/k8s-autoscaler', live: '' },
      { id: Helpers.uid(), name: 'TerraKit', description: 'Opinionated Terraform module library for AWS (VPC, EKS, RDS, S3, IAM) with best-practice defaults, automated compliance checks, and cost estimation.', tech: 'Terraform, AWS, Python, GitHub Actions', github: 'github.com/vikramsingh-devops/terrakit', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'AWS Certified DevOps Engineer – Professional', org: 'Amazon Web Services', issueDate: '2022-07', credentialUrl: 'aws.amazon.com/certification' },
      { id: Helpers.uid(), name: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF', issueDate: '2021-09', credentialUrl: 'cncf.io/certification/cka' },
    ],
    achievements: ['Reduced cloud spend by $200K/year through rightsizing and Spot instance adoption', 'Achieved 99.98% uptime SLA for Meesho platform serving 50M+ users', 'CKA certified in first attempt with top 10% percentile score'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Punjabi (Native)'],
  },

  'Data Scientist': {
    name: 'Data Scientist – Sample',
    template: 'professional',
    targetRole: 'Data Scientist',
    personal: { fullName: 'Sneha Rao', title: 'Senior Data Scientist', email: 'sneha.rao@email.com', phone: '+91 94501 66789', city: 'Bengaluru', country: 'India', linkedin: 'linkedin.com/in/snehararao-ds', github: 'github.com/sneharao-ds', portfolio: '' },
    summary: 'Senior Data Scientist with 5 years of experience applying machine learning and statistical modelling to solve business problems in e-commerce and fintech. Led ML projects delivering $15M+ incremental annual revenue. Proficient in the full ML lifecycle from ideation and feature engineering through production deployment and monitoring.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'SQL', 'Spark', 'Airflow', 'Statistics', 'Data Visualization', 'Tableau', 'AWS SageMaker', 'Docker', 'Git'],
    experience: [
      { id: Helpers.uid(), company: 'Amazon (Alexa AI)', role: 'Senior Data Scientist', location: 'Bengaluru, India', startDate: '2022-02', endDate: '', current: true, bullets: ['Built an NLP-based intent classification model using BERT fine-tuning achieving 94.2% accuracy, replacing a rule-based system and reducing misrouted queries by 38%.', 'Led an A/B test framework overhaul enabling 3x more experiments per quarter, directly attributing $8M in incremental revenue uplift.', 'Developed a real-time product recommendation engine using two-tower neural networks, increasing click-through rate by 22%.', 'Collaborated with MLOps team to deploy 6 ML models to production using SageMaker with automated retraining pipelines.'] },
      { id: Helpers.uid(), company: 'Flipkart', role: 'Data Scientist', location: 'Bengaluru, India', startDate: '2019-07', endDate: '2022-01', current: false, bullets: ['Built a demand forecasting model (LightGBM + feature engineering) that reduced inventory holding costs by ₹12 Cr annually.', 'Developed customer churn prediction model with 87% recall, enabling targeted retention campaigns that reduced churn by 15%.', 'Analysed large-scale clickstream data using PySpark on AWS EMR to uncover drop-off patterns, informing a checkout redesign.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'IIT Bombay', degree: 'M.Tech Data Science', field: 'Data Science', startYear: '2017', endYear: '2019', cgpa: '9.1' },
      { id: Helpers.uid(), institution: 'Osmania University', degree: 'B.E. Computer Science', field: 'Computer Science', startYear: '2013', endYear: '2017', cgpa: '8.6' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'SentimentLens', description: 'End-to-end product review sentiment analysis tool using fine-tuned RoBERTa. Includes a FastAPI backend and a Streamlit dashboard. Processes 10K reviews/min.', tech: 'Python, PyTorch, RoBERTa, FastAPI, Streamlit', github: 'github.com/sneharao-ds/sentimentlens', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Deep Learning Specialization', org: 'Coursera – Andrew Ng', issueDate: '2021-04', credentialUrl: 'coursera.org/verify/deep-learning' },
      { id: Helpers.uid(), name: 'AWS Certified Machine Learning – Specialty', org: 'Amazon Web Services', issueDate: '2023-02', credentialUrl: 'aws.amazon.com/certification' },
    ],
    achievements: ['NLP model at Amazon reduced misrouted queries by 38%, saving $7M/year in escalation costs', 'Published paper "Demand Forecasting at Scale" at KDD 2021', 'Kaggle Competition Master – top 0.5% globally'],
    languages: ['English (Fluent)', 'Hindi (Fluent)', 'Telugu (Native)', 'Kannada (Basic)'],
  },

  'Data Engineer': {
    name: 'Data Engineer – Sample',
    template: 'classic',
    targetRole: 'Data Engineer',
    personal: { fullName: 'Rahul Banerjee', title: 'Senior Data Engineer', email: 'rahul.banerjee@email.com', phone: '+91 97801 34521', city: 'Kolkata', country: 'India', linkedin: 'linkedin.com/in/rahulbanerjee-de', github: 'github.com/rahulbanerjee-de', portfolio: '' },
    summary: 'Senior Data Engineer with 5 years of experience designing and operating petabyte-scale data pipelines on AWS and GCP. Expert in Spark, Airflow, dbt, and modern data stack architectures. Built a lakehouse that consolidated 12 data sources and cut analyst query times from hours to seconds.',
    skills: ['Python', 'SQL', 'Apache Spark', 'Apache Airflow', 'Kafka', 'dbt', 'AWS', 'GCP', 'BigQuery', 'Redshift', 'Snowflake', 'ETL', 'Data Pipeline', 'PostgreSQL', 'Delta Lake', 'Terraform', 'Docker', 'Git'],
    experience: [
      { id: Helpers.uid(), company: 'Zomato', role: 'Senior Data Engineer', location: 'Gurugram, India', startDate: '2021-03', endDate: '', current: true, bullets: ['Designed and built a real-time data lakehouse on AWS using Delta Lake and Spark Structured Streaming, ingesting 5 TB/day from 12 source systems.', 'Reduced analyst query time from 4 hours to under 30 seconds by implementing Redshift Spectrum partitioning and columnar storage.', 'Migrated 80+ legacy Hadoop batch pipelines to Apache Spark on EMR, cutting compute costs by 45%.', 'Built dbt data transformation layer with 300+ models, automated tests, and lineage documentation used by 40+ analysts.', 'Orchestrated all pipelines using Airflow 2.0 with dynamic DAG generation, improving observability and reducing on-call load.'] },
      { id: Helpers.uid(), company: 'Accenture', role: 'Data Engineer', location: 'Kolkata, India', startDate: '2019-06', endDate: '2021-02', current: false, bullets: ['Built ETL pipelines in Python and PySpark ingesting data from Salesforce, SAP, and flat files into a Redshift data warehouse.', 'Implemented data quality checks using Great Expectations, blocking 15 bad data loads from reaching production.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'Jadavpur University', degree: 'B.E. Computer Science', field: 'Computer Science', startYear: '2015', endYear: '2019', cgpa: '8.2' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'StreamStack', description: 'Open-source data streaming reference architecture using Kafka, Spark Streaming, Delta Lake, and Grafana for end-to-end real-time analytics on a local Docker Compose stack.', tech: 'Kafka, Spark, Delta Lake, Docker, Grafana', github: 'github.com/rahulbanerjee-de/streamstack', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Google Professional Data Engineer', org: 'Google Cloud', issueDate: '2022-09', credentialUrl: 'cloud.google.com/certification' },
      { id: Helpers.uid(), name: 'dbt Analytics Engineering Certification', org: 'dbt Labs', issueDate: '2023-04', credentialUrl: 'credentials.getdbt.com' },
    ],
    achievements: ['Reduced analyst query time by 98% via lakehouse redesign at Zomato', 'Migrated 80+ Hadoop pipelines to Spark, saving $300K/year in compute costs', 'StreamStack repo reached 600+ stars on GitHub'],
    languages: ['English (Fluent)', 'Hindi (Fluent)', 'Bengali (Native)'],
  },

  'Product Manager': {
    name: 'Product Manager – Sample',
    template: 'professional',
    targetRole: 'Product Manager',
    personal: { fullName: 'Neha Joshi', title: 'Senior Product Manager', email: 'neha.joshi@email.com', phone: '+91 98901 22345', city: 'Delhi', country: 'India', linkedin: 'linkedin.com/in/nehajoshi-pm', github: '', portfolio: '' },
    summary: 'Senior Product Manager with 6 years of experience leading 0-to-1 and growth products in B2C fintech and edtech. Drove features contributing to $20M+ ARR growth. Known for combining data rigour with deep customer empathy to ship products users love.',
    skills: ['Product Strategy', 'Roadmap', 'Agile', 'Scrum', 'User Research', 'A/B Testing', 'OKRs', 'KPIs', 'JIRA', 'Figma', 'SQL', 'Stakeholder Management', 'Go-to-market', 'Growth', 'Competitive Analysis', 'Wireframing'],
    experience: [
      { id: Helpers.uid(), company: 'CRED', role: 'Senior Product Manager', location: 'Bengaluru, India', startDate: '2021-07', endDate: '', current: true, bullets: ['Owned the credit card bill payment product used by 8M+ members, driving a 25% increase in D30 retention through personalised nudges and payment reminders.', 'Launched "CRED Pay" one-tap checkout feature in 6 months, achieving 35% adoption within 90 days post-launch and contributing ₹40 Cr GMV in Q1.', 'Ran 20+ A/B tests per quarter using Mixpanel and internal tooling, shipping winning variants with data-backed confidence.', 'Coordinated cross-functional squads of 15 (engineering, design, data, marketing) and managed a product roadmap with quarterly OKRs.'] },
      { id: Helpers.uid(), company: 'Byju\'s', role: 'Product Manager', location: 'Bengaluru, India', startDate: '2018-09', endDate: '2021-06', current: false, bullets: ['Rebuilt the in-app learning content player, improving session completion rate from 44% to 67% through micro-interaction and progress visibility improvements.', 'Conducted 50+ user interviews and 8 usability studies that directly informed 3 major product pivots.', 'Defined and launched the premium subscription bundle, contributing 30% of new revenue in FY2020.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'IIM Ahmedabad', degree: 'MBA', field: 'Marketing & Strategy', startYear: '2016', endYear: '2018', cgpa: '' },
      { id: Helpers.uid(), institution: 'Delhi University', degree: 'B.Com (Hons)', field: 'Commerce', startYear: '2013', endYear: '2016', cgpa: '8.8' },
    ],
    projects: [],
    certifications: [
      { id: Helpers.uid(), name: 'Product Management Certification', org: 'Product School', issueDate: '2020-06', credentialUrl: 'productschool.com' },
    ],
    achievements: ['CRED Pay launch – ₹40 Cr GMV in first quarter, top product launch of 2022', 'Speaker at ProductCon India 2023 on "Data-Driven Product Decisions"', 'Grew D30 retention from 42% to 67% across CRED bill payment product'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Conversational)'],
  },

  'UI/UX Designer': {
    name: 'UI/UX Designer – Sample',
    template: 'minimal',
    targetRole: 'UI/UX Designer',
    personal: { fullName: 'Kavya Reddy', title: 'Senior UI/UX Designer', email: 'kavya.reddy@email.com', phone: '+91 95601 78900', city: 'Hyderabad', country: 'India', linkedin: 'linkedin.com/in/kavyareddy-ux', github: '', portfolio: 'kavyareddy.design' },
    summary: 'Senior UI/UX Designer with 5 years of experience crafting intuitive digital products for millions of users in fintech and healthcare. Expert in Figma, user research, and design systems. Redesigned an onboarding flow that increased activation rate by 40%, reducing drop-off at a critical funnel stage.',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design System', 'Interaction Design', 'Accessibility', 'Adobe XD', 'CSS', 'HTML', 'Principle', 'FramerX', 'A/B Testing', 'Information Architecture'],
    experience: [
      { id: Helpers.uid(), company: 'PhonePe', role: 'Senior UI/UX Designer', location: 'Bengaluru, India', startDate: '2022-01', endDate: '', current: true, bullets: ['Led design of PhonePe\'s merchant onboarding flow serving 35M+ merchants, increasing activation completion by 40% through progressive disclosure and contextual help.', 'Built and maintained the PhonePe Design System (120+ components in Figma) adopted by 25 product designers, cutting design-to-handoff time by 50%.', 'Conducted 6 rounds of moderated usability testing with 60+ participants, surfacing 28 critical issues before production.', 'Partnered with accessibility team to achieve WCAG 2.1 AA compliance across 12 key screens.'] },
      { id: Helpers.uid(), company: 'Apollo 24|7', role: 'UI/UX Designer', location: 'Hyderabad, India', startDate: '2019-09', endDate: '2021-12', current: false, bullets: ['Designed the teleconsultation booking flow from scratch, achieving a 4.6/5 App Store rating in the first month post-launch.', 'Ran competitive analysis of 10 telehealth apps and delivered a 40-page UX audit that shaped the 6-month product roadmap.', 'Collaborated with developers using Zeplin for pixel-perfect implementation, reducing dev QA rounds by 35%.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'National Institute of Design, Ahmedabad', degree: 'M.Des Interaction Design', field: 'Interaction Design', startYear: '2017', endYear: '2019', cgpa: '' },
      { id: Helpers.uid(), institution: 'JNTU Hyderabad', degree: 'B.Tech Computer Science', field: 'Computer Science', startYear: '2013', endYear: '2017', cgpa: '8.0' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'HealthTrack App Redesign', description: 'End-to-end redesign of a fitness tracking app UX — including user research, journey mapping, wireframes, and high-fidelity prototype. Case study published on Behance with 5K+ views.', tech: 'Figma, Principle, User Research', github: '', live: 'behance.net/kavyareddy/healthtrack' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Google UX Design Certificate', org: 'Google / Coursera', issueDate: '2021-03', credentialUrl: 'coursera.org/verify/google-ux' },
    ],
    achievements: ['Merchant onboarding redesign increased PhonePe activation rate by 40%', 'Design system adopted by 25 designers, cutting handoff time by 50%', 'Featured in "Top 40 Under 40 Designers in India 2023" by Design Matters'],
    languages: ['English (Fluent)', 'Telugu (Native)', 'Hindi (Fluent)', 'Kannada (Basic)'],
  },

  'Android Developer': {
    name: 'Android Developer – Sample',
    template: 'classic',
    targetRole: 'Android Developer',
    personal: { fullName: 'Siddharth Gupta', title: 'Senior Android Developer', email: 'siddharth.gupta@email.com', phone: '+91 99001 45678', city: 'Delhi', country: 'India', linkedin: 'linkedin.com/in/siddharthgupta-android', github: 'github.com/siddharthgupta-android', portfolio: '' },
    summary: 'Senior Android Developer with 5 years of experience building high-quality native Android apps with 10M+ combined downloads. Deep expertise in Kotlin, Jetpack Compose, and MVVM architecture. Reduced app crash rate from 2.3% to 0.1% at previous role by overhauling error handling and crash reporting.',
    skills: ['Kotlin', 'Java', 'Android SDK', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Retrofit', 'Room', 'Hilt', 'Firebase', 'REST API', 'CI/CD', 'Play Store', 'Git', 'Unit Testing', 'Espresso', 'Material Design 3'],
    experience: [
      { id: Helpers.uid(), company: 'Dream11', role: 'Senior Android Developer', location: 'Mumbai, India', startDate: '2021-08', endDate: '', current: true, bullets: ['Rebuilt the Dream11 team creation screen in Jetpack Compose, reducing frame drops by 60% and improving perceived performance during peak IPL traffic of 5M concurrent users.', 'Implemented offline-first architecture using Room + WorkManager, enabling core features to work without internet connection.', 'Reduced APK size by 35% through R8 optimisation and resource deduplication, improving install conversion by 18%.', 'Set up Fastlane + GitHub Actions CD pipeline enabling daily internal builds and bi-weekly Play Store releases.'] },
      { id: Helpers.uid(), company: 'MakeMyTrip', role: 'Android Developer', location: 'Gurugram, India', startDate: '2019-06', endDate: '2021-07', current: false, bullets: ['Built the hotel booking flow end-to-end using Kotlin and MVVM, handling 200K+ daily bookings.', 'Integrated Firebase Crashlytics and reduced crash-free session rate from 97.7% to 99.9%.', 'Wrote Espresso and JUnit tests achieving 75% unit test coverage on critical payment modules.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'NSIT Delhi', degree: 'B.E. Information Technology', field: 'Information Technology', startYear: '2015', endYear: '2019', cgpa: '8.3' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'ExpenseTracker', description: 'Material Design 3 Android app for personal expense tracking with Jetpack Compose UI, Room database, Hilt DI, and Coroutines. 50K+ downloads on Play Store.', tech: 'Kotlin, Jetpack Compose, Room, Hilt, Coroutines', github: 'github.com/siddharthgupta-android/expensetracker', live: 'play.google.com/store/apps/expensetracker' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'Associate Android Developer', org: 'Google', issueDate: '2021-11', credentialUrl: 'developers.google.com/certification' },
    ],
    achievements: ['Apps published to Play Store with combined 10M+ downloads', 'Reduced Dream11 app crash rate by 95% – from 2.3% to 0.1%', 'ExpenseTracker personal project hit 50K+ downloads organically'],
    languages: ['English (Fluent)', 'Hindi (Native)'],
  },

  'iOS Developer': {
    name: 'iOS Developer – Sample',
    template: 'classic',
    targetRole: 'iOS Developer',
    personal: { fullName: 'Ananya Krishnan', title: 'Senior iOS Developer', email: 'ananya.krishnan@email.com', phone: '+91 98401 56789', city: 'Chennai', country: 'India', linkedin: 'linkedin.com/in/ananyakrishnan-ios', github: 'github.com/ananyakrishnan-ios', portfolio: '' },
    summary: 'Senior iOS Developer with 5 years of experience shipping polished Swift apps on the App Store with 8M+ combined downloads. Passionate about SwiftUI, performance engineering, and accessibility. Rebuilt the core navigation of a fintech app that cut time-to-first-transaction by 30%.',
    skills: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'MVVM', 'CoreData', 'Xcode', 'REST API', 'TestFlight', 'App Store', 'CI/CD', 'Firebase', 'Accessibility', 'XCTest', 'Git', 'Fastlane'],
    experience: [
      { id: Helpers.uid(), company: 'Groww', role: 'Senior iOS Developer', location: 'Bengaluru, India', startDate: '2021-10', endDate: '', current: true, bullets: ['Led the migration of the Groww iOS app from UIKit to SwiftUI for core screens, improving developer velocity by 40%.', 'Rebuilt the portfolio dashboard with real-time data using Combine, cutting stale-data user complaints by 70%.', 'Improved app launch time from 3.8s to 1.2s through eliminating blocking main-thread work and adopting lazy loading.', 'Set up XCTest unit and UI test suites covering 80% of business-critical flows, integrated into CI via GitHub Actions.'] },
      { id: Helpers.uid(), company: 'HDFC Bank', role: 'iOS Developer', location: 'Mumbai, India', startDate: '2019-07', endDate: '2021-09', current: false, bullets: ['Developed the HDFC MobileBanking app\'s fund transfer module in Swift/UIKit serving 3M+ active users.', 'Implemented Face ID and Touch ID biometric authentication using LocalAuthentication framework.', 'Maintained App Store rating above 4.5/5 by triaging and resolving 95% of user-reported bugs within 48 hours.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'Anna University', degree: 'B.E. Computer Science', field: 'Computer Science', startYear: '2015', endYear: '2019', cgpa: '8.5' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'HabitForge', description: 'SwiftUI habit tracking app with iCloud sync, HealthKit integration, and home screen widgets. 30K+ App Store downloads, featured in App Store "Apps We Love" section.', tech: 'Swift, SwiftUI, CoreData, CloudKit, WidgetKit', github: 'github.com/ananyakrishnan-ios/habitforge', live: 'apps.apple.com/habitforge' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'iOS App Development with Swift', org: 'Apple / Coursera', issueDate: '2020-05', credentialUrl: 'coursera.org/verify/ios-swift' },
    ],
    achievements: ['Groww iOS app launch time improved 3x – from 3.8s to 1.2s', 'HabitForge featured in App Store "Apps We Love" with 30K+ downloads', 'Published 6 apps to App Store with combined 8M+ downloads'],
    languages: ['English (Fluent)', 'Tamil (Native)', 'Hindi (Conversational)'],
  },

  'Cloud Architect': {
    name: 'Cloud Architect – Sample',
    template: 'professional',
    targetRole: 'Cloud Architect',
    personal: { fullName: 'Deepak Menon', title: 'Principal Cloud Architect', email: 'deepak.menon@email.com', phone: '+91 98001 23456', city: 'Bengaluru', country: 'India', linkedin: 'linkedin.com/in/deepakmenon-cloud', github: 'github.com/deepakmenon-cloud', portfolio: '' },
    summary: 'Principal Cloud Architect with 9 years of experience designing mission-critical cloud-native systems on AWS and Azure for Fortune 500 clients. Led cloud migrations saving $5M+ annually. Expert in multi-region architecture, zero-trust security, FinOps, and serverless design patterns.',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'Kubernetes', 'Docker', 'Microservices', 'Serverless', 'Security', 'Cost Optimization', 'Networking', 'CI/CD', 'Python', 'Well-Architected Framework', 'FinOps', 'IAM'],
    experience: [
      { id: Helpers.uid(), company: 'Deloitte (Cloud Practice)', role: 'Principal Cloud Architect', location: 'Bengaluru, India', startDate: '2019-05', endDate: '', current: true, bullets: ['Architected a multi-region active-active AWS platform for a banking client processing $2B/day in transactions, achieving 99.999% SLA.', 'Led cloud migration of 200+ on-premise workloads to AWS for a telecom client, delivering $5M/year in infrastructure savings.', 'Designed zero-trust network architecture using AWS PrivateLink, VPC Lattice, and IAM Identity Centre, passing ISO 27001 audit.', 'Built FinOps governance framework across 15 AWS accounts reducing cloud waste by 40% in 90 days.', 'Mentored a team of 12 cloud engineers; introduced internal Cloud Centre of Excellence driving certification of 30+ engineers.'] },
      { id: Helpers.uid(), company: 'Infosys', role: 'Cloud Solutions Architect', location: 'Pune, India', startDate: '2015-07', endDate: '2019-04', current: false, bullets: ['Designed Azure-based hybrid cloud architecture for a manufacturing client, integrating on-prem SAP with cloud analytics.', 'Delivered 6 cloud migration projects on time, achieving average 30% cost savings vs. on-prem.', 'Wrote reusable CloudFormation and ARM templates used across 20+ client engagements.'] },
    ],
    education: [
      { id: Helpers.uid(), institution: 'IIT Madras', degree: 'M.Tech Computer Science', field: 'Distributed Systems', startYear: '2013', endYear: '2015', cgpa: '9.0' },
      { id: Helpers.uid(), institution: 'College of Engineering Trivandrum', degree: 'B.Tech Computer Science', field: 'Computer Science', startYear: '2009', endYear: '2013', cgpa: '8.9' },
    ],
    projects: [
      { id: Helpers.uid(), name: 'CloudCost Analyser', description: 'Open-source AWS cost anomaly detection tool using AWS Cost Explorer APIs and ML-based forecasting. Alerts teams via Slack when spend deviates from trend. 1K+ GitHub stars.', tech: 'Python, AWS Lambda, Cost Explorer, Scikit-learn, Terraform', github: 'github.com/deepakmenon-cloud/cloudcost-analyser', live: '' },
    ],
    certifications: [
      { id: Helpers.uid(), name: 'AWS Certified Solutions Architect – Professional', org: 'Amazon Web Services', issueDate: '2020-03', credentialUrl: 'aws.amazon.com/certification' },
      { id: Helpers.uid(), name: 'AWS Certified Security – Specialty', org: 'Amazon Web Services', issueDate: '2021-08', credentialUrl: 'aws.amazon.com/certification' },
      { id: Helpers.uid(), name: 'Azure Solutions Architect Expert', org: 'Microsoft', issueDate: '2022-04', credentialUrl: 'microsoft.com/certification' },
      { id: Helpers.uid(), name: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF', issueDate: '2021-01', credentialUrl: 'cncf.io/certification/cka' },
    ],
    achievements: ['Led $5M/year cloud migration savings for telecom client – largest in Deloitte India practice', 'Built FinOps framework reducing cloud waste by 40% in 90 days across 15 AWS accounts', 'Holds 4 cloud certifications across AWS, Azure, and CNCF'],
    languages: ['English (Fluent)', 'Malayalam (Native)', 'Hindi (Fluent)', 'Tamil (Conversational)'],
  },

};

const SAMPLE_ROLE_META = {
  'Frontend Developer':   { icon: 'fa-display',           color: '#2563EB' },
  'Backend Developer':    { icon: 'fa-server',             color: '#7C3AED' },
  'Full Stack Developer': { icon: 'fa-layer-group',        color: '#0891B2' },
  'QA Engineer':          { icon: 'fa-bug-slash',          color: '#059669' },
  'DevOps Engineer':      { icon: 'fa-gears',              color: '#D97706' },
  'Data Scientist':       { icon: 'fa-brain',              color: '#DC2626' },
  'Data Engineer':        { icon: 'fa-database',           color: '#7C3AED' },
  'Product Manager':      { icon: 'fa-compass-drafting',   color: '#EA580C' },
  'UI/UX Designer':       { icon: 'fa-pen-nib',            color: '#DB2777' },
  'Android Developer':    { icon: 'fa-mobile-screen-button', color: '#16A34A' },
  'iOS Developer':        { icon: 'fa-apple',              color: '#374151' },
  'Cloud Architect':      { icon: 'fa-cloud',              color: '#0284C7' },
};

/* ══════════════════════════════════════════════════════════════
   APP  (main controller)
══════════════════════════════════════════════════════════════ */
const App = (() => {
  const S = Helpers.sanitize;
  let _resume       = null;
  let _preview      = null;
  let _deletedResume = null;
  let _skillSuggRef  = null;

  const _debouncedSave = Helpers.debounce(_doSave, 1000);

  /* ── Color theme ─────────────────────────────────────────── */
  function applyColorTheme(themeKey) {
    let style = document.getElementById('resume-color-override');
    if (!style) { style = document.createElement('style'); style.id = 'resume-color-override'; document.head.appendChild(style); }
    const t = COLOR_THEMES[themeKey];
    if (!t || themeKey === 'default' || !themeKey) { style.textContent = ''; return; }
    style.textContent = [
      `.resume-page .res-name{color:${t.resName}!important}`,
      `.resume-page .res-title{color:${t.resTitle}!important}`,
      `.resume-page .contact-label{color:${t.contactLabel}!important}`,
      `.resume-page .sec-title{color:${t.secTitle}!important;border-bottom-color:${t.secBorder}!important}`,
      `.resume-page .exp-company,.resume-page .edu-school,.resume-page .proj-name,.resume-page .cert-name{color:${t.entryTitle}!important}`,
      `.resume-page .exp-role,.resume-page .proj-tech,.resume-page .cert-org,.resume-page .exp-dates,.resume-page .edu-years{color:${t.entrySubtitle}!important}`,
    ].join('\n');
  }

  /* ── Routing ─────────────────────────────────────────────── */
  function showPage(name) {
    document.querySelectorAll('.app-page').forEach(el => {
      el.style.display = el.id === `page-${name}` ? '' : 'none';
    });
    const builderVisible = name === 'builder';
    document.getElementById('btn-back-dashboard')?.classList.toggle('d-none', !builderVisible);
    document.getElementById('builder-resume-name')?.classList.toggle('d-none', !builderVisible);
  }

  /* ── Dashboard ───────────────────────────────────────────── */
  async function renderDashboard() {
    const resumes = await ResumeManager.getAll();
    const grid    = document.getElementById('resume-grid');
    if (!grid) return;
    resumes.sort((a, b) => (b.updatedAt||0) - (a.updatedAt||0));

    const newCard = `<div class="resume-card-new" id="btn-new-resume" tabindex="0" role="button" aria-label="Create new resume">
      <div class="icon-wrap"><i class="fa-solid fa-plus"></i></div>
      <span class="fw-600">Create New Resume</span>
      <span style="font-size:.78rem;color:inherit">Start from scratch</span>
    </div>`;

    if (!resumes.length) {
      grid.innerHTML = newCard + `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-illustration"><i class="fa-solid fa-file-lines"></i></div>
        <h3 class="mb-2">No resumes yet</h3>
        <p class="text-muted mb-3" style="max-width:360px;margin:0 auto .75rem">Create your first ATS-optimised resume in minutes.</p>
        <button class="btn btn-primary btn-new-resume-2"><i class="fa-solid fa-plus"></i> New Resume</button>
      </div>`;
    } else {
      grid.innerHTML = newCard + resumes.map(r => {
        const score = r.atsScore || 0;
        const gc = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor';
        const gl = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
        return `<div class="resume-card fade-in" data-id="${S(r.id)}">
          <div class="d-flex align-items-start justify-content-between mb-1">
            <div>
              <div class="resume-card-title">${S(Helpers.truncate(r.name,40))}</div>
              <div class="resume-card-subtitle">${S(r.personal?.title||'No title set')}</div>
            </div>
            <span class="ats-badge ${gc}">${score} · ${gl}</span>
          </div>
          <div class="resume-card-date"><i class="fa-regular fa-clock me-1"></i>${S(Helpers.relativeTime(r.updatedAt||0))}</div>
          <div class="card-actions mt-2">
            <button class="btn btn-primary btn-sm card-edit"      data-id="${S(r.id)}"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-outline-primary btn-sm card-download" data-id="${S(r.id)}"><i class="fa-solid fa-download"></i></button>
            <button class="btn btn-ghost btn-sm card-duplicate"   data-id="${S(r.id)}" title="Duplicate"><i class="fa-solid fa-copy"></i></button>
            <button class="btn btn-outline-danger btn-sm card-delete" data-id="${S(r.id)}" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`;
      }).join('');
    }

    bindDashboardEvents();
    renderSampleSection();
  }

  function renderSampleSection() {
    const el = document.getElementById('sample-resumes-section');
    if (!el) return;

    el.innerHTML = `
      <div class="sample-section-header">
        <h2 class="sample-section-title">
          <i class="fa-solid fa-wand-magic-sparkles me-2" style="color:var(--primary)"></i>
          Start from a Sample Resume
        </h2>
        <p class="sample-section-sub">Pick your role and get a realistic, ATS-ready resume pre-filled with real-world experience. Edit it to match your own.</p>
      </div>
      <div class="sample-grid">
        ${ROLES.map(role => {
          const meta = SAMPLE_ROLE_META[role] || { icon: 'fa-file-lines', color: '#2563EB' };
          return `
          <div class="sample-role-card" data-role="${Helpers.sanitize(role)}" tabindex="0" role="button" aria-label="Use ${role} sample resume">
            <div class="sample-role-icon" style="background:${meta.color}15;color:${meta.color}">
              <i class="fa-solid ${meta.icon}"></i>
            </div>
            <div class="sample-role-name">${Helpers.sanitize(role)}</div>
            <div class="sample-role-cta">Use this sample <i class="fa-solid fa-arrow-right" style="font-size:.65rem"></i></div>
          </div>`;
        }).join('')}
      </div>`;

    el.querySelectorAll('.sample-role-card').forEach(card => {
      const activate = () => loadSampleResume(card.dataset.role);
      card.addEventListener('click', activate);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });
  }

  async function loadSampleResume(role) {
    const sample = SAMPLE_RESUMES[role];
    if (!sample) return;
    const resume = ResumeManager.blankResume();
    Object.assign(resume, Helpers.deepClone(sample));
    resume.id        = Helpers.uid();
    resume.createdAt = Date.now();
    resume.updatedAt = Date.now();
    await ResumeManager.save(resume);
    ToastService.success(`"${resume.name}" created — customise it to make it yours!`);
    await openBuilder(resume.id);
  }

  function bindDashboardEvents() {
    const grid = document.getElementById('resume-grid');
    if (!grid) return;

    // Remove previous listeners by replacing the node
    const fresh = grid.cloneNode(true);
    grid.parentNode.replaceChild(fresh, grid);

    fresh.addEventListener('click', async e => {
      const btn = e.target.closest('[class*="card-"], #btn-new-resume, .btn-new-resume-2');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.id === 'btn-new-resume' || btn.classList.contains('btn-new-resume-2')) { showNewResumeModal(); return; }
      if (btn.classList.contains('card-edit'))      { await openBuilder(id); return; }
      if (btn.classList.contains('card-download'))  { await quickDownload(id); return; }
      if (btn.classList.contains('card-duplicate')) { await duplicateResume(id); return; }
      if (btn.classList.contains('card-delete'))    { await confirmDelete(id); return; }
    });

    fresh.addEventListener('keydown', e => {
      if (e.target.id === 'btn-new-resume' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showNewResumeModal(); }
    });
  }

  /* ── Modal helpers ───────────────────────────────────────── */
  function showNewResumeModal()  { document.getElementById('modal-new-resume')?.classList.add('active'); document.getElementById('new-resume-name')?.focus(); }
  function hideNewResumeModal()  { document.getElementById('modal-new-resume')?.classList.remove('active'); }

  /* ── Builder ─────────────────────────────────────────────── */
  async function openBuilder(id) {
    const resume = await ResumeManager.get(id);
    if (!resume) { ToastService.error('Resume not found.'); return; }
    _resume = resume;
    showPage('builder');
    mountBuilder();
  }

  function mountBuilder() {
    const r = _resume;
    const nameEl = document.getElementById('builder-resume-name');
    if (nameEl) nameEl.textContent = r.name || 'Untitled';
    document.title = (r.name || 'Untitled') + ' – ATSApply';

    _preview = PreviewRenderer.create(
      document.getElementById('resume-canvas'),
      document.getElementById('zoom-val')
    );
    _preview.update(r);
    populateForm(r);
    bindBuilderEvents();
    updateATSPanel();
  }

  /* ── Form population ─────────────────────────────────────── */
  function populateForm(r) {
    const p = r.personal || {};
    const sv = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    sv('f-fullName', p.fullName); sv('f-title', p.title); sv('f-email', p.email);
    sv('f-phone', p.phone); sv('f-city', p.city); sv('f-country', p.country);
    sv('f-linkedin', p.linkedin); sv('f-github', p.github); sv('f-portfolio', p.portfolio);
    sv('f-summary', r.summary); sv('f-targetRole', r.targetRole);
    const activeTheme = r.colorTheme || 'default';
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === activeTheme));
    applyColorTheme(activeTheme);
    updateCharCount();
    renderSkillTags(r.skills || []);
    document.querySelectorAll('.tpl-thumb').forEach(t => t.classList.toggle('active', t.dataset.tpl === r.template));
    renderExperienceList(r.experience || []);
    renderEducationList(r.education || []);
    renderProjectsList(r.projects || []);
    renderCertificationsList(r.certifications || []);
    renderDynamicList('achievements-list', r.achievements || [], 'achievement');
    renderDynamicList('languages-list', r.languages || [], 'language');
  }

  /* ── Builder event binding ───────────────────────────────── */
  function bindBuilderEvents() {
    // Use a single delegated listener on the builder page to avoid stacking duplicates
    const builder = document.getElementById('page-builder');
    if (!builder) return;

    // Clone to clear any previous listeners
    const fresh = builder.cloneNode(true);
    builder.parentNode.replaceChild(fresh, builder);

    // Re-bind preview canvas ref after clone
    _preview = PreviewRenderer.create(
      fresh.querySelector('#resume-canvas'),
      fresh.querySelector('#zoom-val')
    );
    if (_resume) _preview.update(_resume);

    /* Back (handled by #btn-back-dashboard in navbar) */

    /* Section accordion toggles */
    fresh.querySelectorAll('.section-header').forEach(h => {
      h.addEventListener('click', () => h.closest('.section-card').classList.toggle('open'));
    });

    /* Template thumbs */
    fresh.querySelectorAll('.tpl-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        _resume.template = btn.dataset.tpl;
        fresh.querySelectorAll('.tpl-thumb').forEach(b => b.classList.toggle('active', b === btn));
        triggerSave();
      });
    });

    /* Personal fields */
    ['fullName','title','email','phone','city','country','linkedin','github','portfolio'].forEach(f => {
      fresh.querySelector(`#f-${f}`)?.addEventListener('input', e => { _resume.personal[f] = e.target.value; triggerSave(); });
    });

    /* Summary */
    fresh.querySelector('#f-summary')?.addEventListener('input', e => {
      _resume.summary = e.target.value; updateCharCount(); triggerSave();
    });

    /* Target role */
    fresh.querySelector('#f-targetRole')?.addEventListener('change', e => {
      _resume.targetRole = e.target.value; triggerSave();
    });

    /* Color theme dots */
    fresh.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        _resume.colorTheme = dot.dataset.theme || 'default';
        fresh.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d === dot));
        applyColorTheme(_resume.colorTheme);
        triggerSave();
      });
    });

    /* Add entry buttons */
    fresh.querySelector('#btn-add-exp')?.addEventListener('click',         () => { ResumeManager.addExperience(_resume);     renderExperienceList(_resume.experience); triggerSave(); });
    fresh.querySelector('#btn-add-edu')?.addEventListener('click',         () => { ResumeManager.addEducation(_resume);      renderEducationList(_resume.education); triggerSave(); });
    fresh.querySelector('#btn-add-proj')?.addEventListener('click',        () => { ResumeManager.addProject(_resume);        renderProjectsList(_resume.projects); triggerSave(); });
    fresh.querySelector('#btn-add-cert')?.addEventListener('click',        () => { ResumeManager.addCertification(_resume);  renderCertificationsList(_resume.certifications); triggerSave(); });
    fresh.querySelector('#btn-add-achievement')?.addEventListener('click', () => { _resume.achievements.push(''); renderDynamicList('achievements-list', _resume.achievements, 'achievement'); triggerSave(); });
    fresh.querySelector('#btn-add-language')?.addEventListener('click',    () => { _resume.languages.push(''); renderDynamicList('languages-list', _resume.languages, 'language'); triggerSave(); });

    /* Zoom */
    fresh.querySelector('#btn-zoom-in')?.addEventListener('click',    () => _preview?.zoomIn());
    fresh.querySelector('#btn-zoom-out')?.addEventListener('click',   () => _preview?.zoomOut());
    fresh.querySelector('#btn-zoom-reset')?.addEventListener('click', () => _preview?.zoomReset());

    /* PDF */
    fresh.querySelector('#btn-download-pdf')?.addEventListener('click', downloadPDF);

    /* Preview tabs */
    function switchTab(tab) {
      const isATS = tab === 'ats';
      fresh.querySelector('#ats-panel')?.classList.toggle('visible', isATS);
      fresh.querySelector('.preview-scroll')?.classList.toggle('d-none', isATS);
      fresh.querySelector('.zoom-controls')?.classList.toggle('d-none', isATS);
      fresh.querySelector('#tab-ats-score')?.classList.toggle('active', isATS);
      fresh.querySelector('#tab-live-preview')?.classList.toggle('active', !isATS);
      if (isATS) updateATSPanel();
    }
    fresh.querySelector('#tab-live-preview')?.addEventListener('click', () => switchTab('preview'));
    fresh.querySelector('#tab-ats-score')?.addEventListener('click',    () => switchTab('ats'));

    /* Export JSON */
    fresh.querySelector('#btn-export-json')?.addEventListener('click', () => {
      ImportExportService.exportResume(_resume); ToastService.success('Exported as JSON.');
    });

    /* Resume name inline edit (element lives in navbar, use document scope) */
    document.getElementById('builder-resume-name')?.addEventListener('input', e => {
      const name = e.target.textContent.trim() || 'Untitled';
      document.title = name + ' – ATSApply';
    });
    document.getElementById('builder-resume-name')?.addEventListener('blur', e => {
      _resume.name = e.target.textContent.trim() || 'Untitled'; triggerSave();
    });

    /* Skills */
    bindSkillInput(fresh);

    /* Dynamic list events wired inside render functions; re-render to attach to new DOM */
    renderExperienceList(_resume.experience || []);
    renderEducationList(_resume.education || []);
    renderProjectsList(_resume.projects || []);
    renderCertificationsList(_resume.certifications || []);
    renderDynamicList('achievements-list', _resume.achievements || [], 'achievement');
    renderDynamicList('languages-list', _resume.languages || [], 'language');
    renderSkillTags(_resume.skills || []);
  }

  /* ── Skills ───────────────────────────────────────────────── */
  function renderSkillTags(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;
    let input = container.querySelector('.skills-input');
    container.querySelectorAll('.skill-tag').forEach(t => t.remove());
    if (!input) { input = document.createElement('input'); input.className = 'skills-input'; input.type = 'text'; input.placeholder = 'Add skill…'; input.setAttribute('aria-label','Add skill'); container.appendChild(input); }
    skills.forEach(skill => container.insertBefore(makeSkillTag(skill), input));
  }

  function makeSkillTag(skill) {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.innerHTML = `${Helpers.sanitize(skill)} <span class="remove" aria-label="Remove">✕</span>`;
    tag.querySelector('.remove').addEventListener('click', () => {
      _resume.skills = _resume.skills.filter(s => s !== skill); tag.remove(); triggerSave();
    });
    return tag;
  }

  function bindSkillInput(root = document) {
    const container = root.getElementById ? root.getElementById('skills-container') : root.querySelector('#skills-container');
    if (!container) return;
    const input = container.querySelector('.skills-input');
    if (!input) return;
    container.addEventListener('click', () => input.focus());
    input.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
        e.preventDefault(); addSkill(input.value.trim().replace(/,$/,'')); input.value = ''; hideSuggestions();
      }
      if (e.key === 'Backspace' && !input.value && _resume.skills.length) {
        _resume.skills.pop(); renderSkillTags(_resume.skills); triggerSave();
      }
    });
    input.addEventListener('input', () => showSkillSuggestions(input));
    input.addEventListener('blur',  () => setTimeout(hideSuggestions, 200));
  }

  function addSkill(skill) {
    if (!skill || _resume.skills.includes(skill)) return;
    _resume.skills.push(skill);
    renderSkillTags(_resume.skills);
    triggerSave();
  }

  function showSkillSuggestions(input) {
    hideSuggestions();
    const q = input.value.toLowerCase();
    if (!q) return;
    const matches = SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(q) && !_resume.skills.includes(s)).slice(0, 8);
    if (!matches.length) return;
    const dd = document.createElement('div');
    dd.className = 'skill-suggestions';
    dd.style.cssText = 'position:absolute;z-index:200;min-width:180px;';
    matches.forEach(s => {
      const item = document.createElement('div');
      item.className = 'skill-suggestion-item'; item.textContent = s;
      item.addEventListener('mousedown', e => { e.preventDefault(); addSkill(s); input.value = ''; });
      dd.appendChild(item);
    });
    const container = document.getElementById('skills-container');
    if (container) { container.style.position = 'relative'; container.appendChild(dd); }
    _skillSuggRef = dd;
  }

  function hideSuggestions() { _skillSuggRef?.remove(); _skillSuggRef = null; }

  /* ── Experience list ─────────────────────────────────────── */
  function renderExperienceList(list) {
    const el = document.getElementById('experience-list');
    if (!el) return;
    el.innerHTML = list.map(e => {
      const buls = (e.bullets||['']).map(b => `<li class="bullet-item">${bulletRowInner(b)}</li>`).join('');
      return `<div class="entry-item" data-id="${S(e.id)}">
        <div class="entry-item-header">
          <div><div class="entry-item-title">${S(e.company||'Company Name')}</div><div class="entry-item-subtitle">${S(e.role||'Job Title')}</div></div>
          <div class="entry-actions">
            <button class="btn-icon entry-toggle" title="Expand"><i class="fa-solid fa-chevron-down"></i></button>
            <button class="btn-icon danger entry-delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="entry-item-body ef-body">
          <div class="ef-row">
            <span class="ef-label">Company</span>
            <input type="text" class="ef-input exp-company" value="${S(e.company)}" placeholder="Google, Amazon…">
          </div>
          <div class="ef-row">
            <span class="ef-label">Job Title</span>
            <input type="text" class="ef-input exp-role" value="${S(e.role)}" placeholder="Software Engineer">
          </div>
          <div class="ef-row">
            <span class="ef-label">Location</span>
            <input type="text" class="ef-input exp-location" value="${S(e.location)}" placeholder="City, Country">
          </div>
          <div class="ef-row">
            <span class="ef-label">Period</span>
            <div class="ef-pair">
              <div class="ef-pair-item">
                <span class="ef-pair-label">From</span>
                <input type="month" class="ef-input exp-start" value="${S(e.startDate)}">
              </div>
              <div class="ef-pair-item">
                <span class="ef-pair-label">To</span>
                <input type="month" class="ef-input exp-end" value="${S(e.endDate)}" ${e.current?'disabled':''}>
              </div>
            </div>
          </div>
          <div class="ef-check-row">
            <input class="form-check-input exp-current" type="checkbox" id="ec-${S(e.id)}" ${e.current?'checked':''} style="margin:0">
            <label class="form-check-label" for="ec-${S(e.id)}">Currently working here</label>
          </div>
          <div class="ef-row ef-row-area" style="margin-top:.3rem;border-top:1px solid var(--border);padding-top:.4rem">
            <span class="ef-label" style="font-size:.63rem;margin-bottom:.2rem">Responsibilities</span>
            <ul class="bullet-list" id="blist-${S(e.id)}">${buls}</ul>
            <button class="btn btn-ghost btn-xs add-bullet" style="padding:.1rem .35rem;margin-top:.2rem;align-self:flex-start;font-size:.72rem"><i class="fa-solid fa-plus"></i> Add</button>
          </div>
        </div>
      </div>`;
    }).join('');

    el.querySelectorAll('.entry-item').forEach(item => {
      const entryId = item.dataset.id;
      const entry   = list.find(e => e.id === entryId);
      if (!entry) return;

      item.querySelector('.entry-item-header')?.addEventListener('click', e => { if (!e.target.closest('.entry-delete')) item.classList.toggle('open'); });
      item.querySelector('.entry-delete')?.addEventListener('click', () => {
        ResumeManager.removeExperience(_resume, entryId);
        renderExperienceList(_resume.experience); triggerSave();
      });
      item.querySelector('.exp-company')?.addEventListener('input', ev => { entry.company = ev.target.value; item.querySelector('.entry-item-title').textContent = entry.company||'Company Name'; triggerSave(); });
      item.querySelector('.exp-role')?.addEventListener('input', ev => { entry.role = ev.target.value; item.querySelector('.entry-item-subtitle').textContent = entry.role||'Job Title'; triggerSave(); });
      item.querySelector('.exp-location')?.addEventListener('input', ev => { entry.location = ev.target.value; triggerSave(); });
      item.querySelector('.exp-start')?.addEventListener('change', ev => { entry.startDate = ev.target.value; triggerSave(); });
      item.querySelector('.exp-end')?.addEventListener('change', ev => { entry.endDate = ev.target.value; triggerSave(); });
      item.querySelector('.exp-current')?.addEventListener('change', ev => {
        entry.current = ev.target.checked;
        const endEl = item.querySelector('.exp-end');
        if (endEl) endEl.disabled = entry.current;
        triggerSave();
      });

      const bList = item.querySelector('.bullet-list');
      bList?.addEventListener('input', e => {
        if (e.target.classList.contains('bullet-input')) {
          const idx     = [...bList.querySelectorAll('.bullet-input')].indexOf(e.target);
          entry.bullets[idx] = e.target.value;
          triggerSave();
          const warnEl = e.target.closest('.bullet-input-wrap')?.querySelector('.bullet-warn');
          if (warnEl) checkBulletWarnings(e.target, warnEl);
        }
      });
      bList?.addEventListener('click', e => {
        const btn = e.target.closest('.remove-bullet');
        if (btn) {
          const li  = btn.closest('.bullet-item');
          const idx = [...bList.querySelectorAll('.bullet-item')].indexOf(li);
          entry.bullets.splice(idx, 1); li.remove(); triggerSave();
        }
      });
      item.querySelector('.add-bullet')?.addEventListener('click', () => {
        entry.bullets.push('');
        const li = document.createElement('li');
        li.className = 'bullet-item';
        li.innerHTML = bulletRowInner('');
        bList?.appendChild(li);
        li.querySelector('.bullet-input')?.focus();
        triggerSave();
      });
    });
  }

  /* Returns the INNER content of a bullet <li> — no <li> wrapper.
     Both the initial render and the "Add" handler create their own <li class="bullet-item">
     and set innerHTML to this, keeping the DOM structure clean. */
  function bulletRowInner(text) {
    return `<div class="bullet-input-wrap">
        <input type="text" class="bullet-input" value="${Helpers.sanitize(text)}" placeholder="Describe your impact…">
        <div class="bullet-warn" aria-live="polite"></div>
      </div>
      <button class="btn-icon danger remove-bullet" title="Remove"><i class="fa-solid fa-minus"></i></button>`;
  }

  function checkBulletWarnings(textarea, warnEl) {
    const val   = textarea.value.trim();
    const words = val ? val.split(/\s+/).length : 0;
    const msgs  = [];
    if (words > 0 && words <= 5)  msgs.push('Too short — add more detail.');
    if (words > 10)               msgs.push('Too long — keep bullets concise (10 words max).');
    if (val && !/\d/.test(val))   msgs.push('Add a number to quantify impact (e.g. 40%, 3x, $2M).');
    warnEl.innerHTML = msgs.map(m => `<span class="bwarn">${m}</span>`).join('');
  }

  /* ── Education list ──────────────────────────────────────── */
  function renderEducationList(list) {
    const el = document.getElementById('education-list');
    if (!el) return;
    el.innerHTML = list.map(e => `
      <div class="entry-item" data-id="${S(e.id)}">
        <div class="entry-item-header">
          <div><div class="entry-item-title">${S(e.institution||'Institution')}</div><div class="entry-item-subtitle">${S(e.degree||'Degree')}</div></div>
          <div class="entry-actions"><button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button><button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button></div>
        </div>
        <div class="entry-item-body ef-body">
          <div class="ef-row">
            <span class="ef-label">Institution</span>
            <input type="text" class="ef-input edu-institution" value="${S(e.institution)}" placeholder="University / College Name">
          </div>
          <div class="ef-row">
            <span class="ef-label">Degree</span>
            <input type="text" class="ef-input edu-degree" value="${S(e.degree)}" placeholder="B.Tech / B.Sc / MBA">
          </div>
          <div class="ef-row">
            <span class="ef-label">Field</span>
            <input type="text" class="ef-input edu-field" value="${S(e.field)}" placeholder="Computer Science">
          </div>
          <div class="ef-row">
            <span class="ef-label">Years</span>
            <div class="ef-pair">
              <div class="ef-pair-item">
                <span class="ef-pair-label">Start</span>
                <input type="number" class="ef-input edu-startYear" value="${S(e.startYear)}" placeholder="2020" min="1990" max="2040">
              </div>
              <div class="ef-pair-item">
                <span class="ef-pair-label">End</span>
                <input type="number" class="ef-input edu-endYear" value="${S(e.endYear)}" placeholder="2024" min="1990" max="2040">
              </div>
              <div class="ef-pair-item">
                <span class="ef-pair-label">GPA</span>
                <input type="text" class="ef-input edu-cgpa" value="${S(e.cgpa)}" placeholder="8.5">
              </div>
            </div>
          </div>
        </div>
      </div>`).join('');

    el.querySelectorAll('.entry-item').forEach(item => {
      const entry = list.find(e => e.id === item.dataset.id); if (!entry) return;
      item.querySelector('.entry-item-header')?.addEventListener('click', e => { if (!e.target.closest('.entry-delete')) item.classList.toggle('open'); });
      item.querySelector('.entry-delete')?.addEventListener('click', () => { ResumeManager.removeEducation(_resume, entry.id); renderEducationList(_resume.education); triggerSave(); });
      ['institution','degree','field','startYear','endYear','cgpa'].forEach(f => {
        item.querySelector(`.edu-${f}`)?.addEventListener('input', ev => {
          entry[f] = ev.target.value;
          if (f === 'institution') item.querySelector('.entry-item-title').textContent = entry.institution || 'Institution';
          if (f === 'degree')      item.querySelector('.entry-item-subtitle').textContent = entry.degree || 'Degree';
          triggerSave();
        });
      });
    });
  }

  /* ── Projects list ───────────────────────────────────────── */
  function renderProjectsList(list) {
    const el = document.getElementById('projects-list');
    if (!el) return;
    el.innerHTML = list.map(p => `
      <div class="entry-item" data-id="${S(p.id)}">
        <div class="entry-item-header">
          <div><div class="entry-item-title">${S(p.name||'Project Name')}</div><div class="entry-item-subtitle">${S(p.tech||'')}</div></div>
          <div class="entry-actions"><button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button><button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button></div>
        </div>
        <div class="entry-item-body ef-body">
          <div class="ef-row">
            <span class="ef-label">Name</span>
            <input type="text" class="ef-input proj-name" value="${S(p.name)}" placeholder="Project Title">
          </div>
          <div class="ef-row">
            <span class="ef-label">Tech Stack</span>
            <input type="text" class="ef-input proj-tech" value="${S(p.tech)}" placeholder="React, Node.js, MongoDB">
          </div>
          <div class="ef-row">
            <span class="ef-label">GitHub</span>
            <input type="url" class="ef-input proj-github" value="${S(p.github)}" placeholder="github.com/user/repo">
          </div>
          <div class="ef-row">
            <span class="ef-label">Live Demo</span>
            <input type="url" class="ef-input proj-live" value="${S(p.live)}" placeholder="yourproject.vercel.app">
          </div>
          <div class="ef-row ef-row-area">
            <span class="ef-label">Description</span>
            <textarea class="ef-textarea proj-description" rows="2" placeholder="What did you build and what impact did it have?">${S(p.description)}</textarea>
          </div>
        </div>
      </div>`).join('');

    el.querySelectorAll('.entry-item').forEach(item => {
      const proj = list.find(p => p.id === item.dataset.id); if (!proj) return;
      item.querySelector('.entry-item-header')?.addEventListener('click', e => { if (!e.target.closest('.entry-delete')) item.classList.toggle('open'); });
      item.querySelector('.entry-delete')?.addEventListener('click', () => { ResumeManager.removeProject(_resume, proj.id); renderProjectsList(_resume.projects); triggerSave(); });
      ['name','description','tech','github','live'].forEach(f => {
        item.querySelector(`.proj-${f}`)?.addEventListener('input', ev => {
          proj[f] = ev.target.value;
          if (f === 'name') item.querySelector('.entry-item-title').textContent = proj.name || 'Project Name';
          if (f === 'tech') item.querySelector('.entry-item-subtitle').textContent = proj.tech || '';
          triggerSave();
        });
      });
    });
  }

  /* ── Certifications list ─────────────────────────────────── */
  function renderCertificationsList(list) {
    const el = document.getElementById('certifications-list');
    if (!el) return;
    el.innerHTML = list.map(c => `
      <div class="entry-item" data-id="${S(c.id)}">
        <div class="entry-item-header">
          <div><div class="entry-item-title">${S(c.name||'Certificate Name')}</div><div class="entry-item-subtitle">${S(c.org||'')}</div></div>
          <div class="entry-actions"><button class="btn-icon entry-toggle"><i class="fa-solid fa-chevron-down"></i></button><button class="btn-icon danger entry-delete"><i class="fa-solid fa-trash"></i></button></div>
        </div>
        <div class="entry-item-body">
          <div class="row g-2">
            <div class="col-12"><label class="form-label">Certificate Name</label><input type="text" class="form-control cert-cname" value="${S(c.name)}" placeholder="AWS Certified Developer"></div>
            <div class="col-6"><label class="form-label">Organisation</label><input type="text" class="form-control cert-org" value="${S(c.org)}" placeholder="Amazon / Coursera"></div>
            <div class="col-6"><label class="form-label">Issue Date</label><input type="month" class="form-control cert-issueDate" value="${S(c.issueDate)}"></div>
            <div class="col-12"><label class="form-label">Credential URL</label><input type="url" class="form-control cert-credentialUrl" value="${S(c.credentialUrl)}" placeholder="https://..."></div>
          </div>
        </div>
      </div>`).join('');

    el.querySelectorAll('.entry-item').forEach(item => {
      const cert = list.find(c => c.id === item.dataset.id); if (!cert) return;
      item.querySelector('.entry-item-header')?.addEventListener('click', e => { if (!e.target.closest('.entry-delete')) item.classList.toggle('open'); });
      item.querySelector('.entry-delete')?.addEventListener('click', () => { ResumeManager.removeCertification(_resume, cert.id); renderCertificationsList(_resume.certifications); triggerSave(); });
      ['cname','org','issueDate','credentialUrl'].forEach(f => {
        item.querySelector(`.cert-${f}`)?.addEventListener('input', ev => {
          const field = f === 'cname' ? 'name' : f;
          cert[field] = ev.target.value;
          if (f === 'cname') item.querySelector('.entry-item-title').textContent = cert.name || 'Certificate Name';
          if (f === 'org')   item.querySelector('.entry-item-subtitle').textContent = cert.org || '';
          triggerSave();
        });
      });
    });
  }

  /* ── Dynamic list (achievements / languages) ─────────────── */
  function renderDynamicList(containerId, items, type) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map((val, idx) => `
      <div class="d-flex gap-2 align-items-center mb-1">
        <input type="text" class="form-control form-control-sm dyn-input" data-idx="${idx}" value="${S(val)}" placeholder="${type === 'achievement' ? 'e.g. Top Performer Q3 2023' : 'e.g. English'}">
        <button class="btn-icon danger dyn-remove" data-idx="${idx}"><i class="fa-solid fa-minus"></i></button>
      </div>`).join('');

    const newEl = el.cloneNode(true);
    el.parentNode.replaceChild(newEl, el);

    newEl.addEventListener('input', e => {
      if (!e.target.classList.contains('dyn-input')) return;
      const idx = +e.target.dataset.idx;
      if (type === 'achievement') _resume.achievements[idx] = e.target.value;
      else                        _resume.languages[idx]    = e.target.value;
      triggerSave();
    });
    newEl.addEventListener('click', e => {
      const btn = e.target.closest('.dyn-remove'); if (!btn) return;
      const idx = +btn.dataset.idx;
      if (type === 'achievement') { _resume.achievements.splice(idx, 1); renderDynamicList(containerId, _resume.achievements, type); }
      else                        { _resume.languages.splice(idx, 1);    renderDynamicList(containerId, _resume.languages, type); }
      triggerSave();
    });
  }

  /* ── ATS Panel ───────────────────────────────────────────── */
  function updateATSPanel() {
    if (!_resume) return;
    const result = ATSAnalyzer.analyze(_resume);
    _resume.atsScore = result.score;

    // ── Score badge on ATS Analysis tab (always update, panel need not be open) ──
    const badge = document.getElementById('ats-score-badge');
    if (badge) {
      const prev = badge.textContent;
      badge.textContent = result.score;
      const grade = result.score >= 85 ? 'excellent'
                  : result.score >= 70 ? 'great'
                  : result.score >= 50 ? 'good'
                  : '';
      if (grade) badge.setAttribute('data-grade', grade);
      else       badge.removeAttribute('data-grade');
      if (prev !== String(result.score)) {
        badge.classList.remove('pop');
        void badge.offsetWidth;
        badge.classList.add('pop');
      }
    }

    const panel = document.getElementById('ats-panel');
    if (!panel) return;

    const color = result.score >= 85 ? '#10B981' : result.score >= 70 ? '#2563EB' : result.score >= 50 ? '#F59E0B' : '#EF4444';
    const circ  = 2 * Math.PI * 45;
    const dash  = (result.score / 100) * circ;

    const fillEl = panel.querySelector('circle.fill');
    if (fillEl) { fillEl.setAttribute('stroke', color); fillEl.setAttribute('stroke-dasharray', `${dash} ${circ}`); }

    const numEl = panel.querySelector('.score-num');
    if (numEl) numEl.textContent = result.score;
    const gradeEl = panel.querySelector('.score-grade');
    if (gradeEl) { gradeEl.textContent = result.grade; gradeEl.style.color = color; }

    const cEl = panel.querySelector('.ats-criteria');
    if (cEl) {
      cEl.innerHTML = result.criteria.map(c => {
        const pct = Math.round((c.earned / c.max) * 100);
        const bc  = pct >= 80 ? '#10B981' : pct >= 60 ? '#2563EB' : pct >= 40 ? '#F59E0B' : '#EF4444';
        return `<div class="ats-criterion">
          <span class="criterion-label">${S(c.label)}</span>
          <div class="criterion-bar"><div class="criterion-bar-fill" style="width:${pct}%;background:${bc}"></div></div>
          <span class="criterion-score" style="color:${bc}">${c.earned}/${c.max}</span>
        </div>`;
      }).join('');
    }

    const sEl = panel.querySelector('.ats-suggestions');
    if (sEl) {
      const all = [
        ...result.warnings.map(w    => `<div class="ats-suggestion-item error"><i class="fa-solid fa-circle-xmark"></i><span>${S(w)}</span></div>`),
        ...result.suggestions.map(s => `<div class="ats-suggestion-item warn"><i class="fa-solid fa-triangle-exclamation"></i><span>${S(s)}</span></div>`),
        ...result.tips.map(t        => `<div class="ats-suggestion-item tip"><i class="fa-solid fa-lightbulb"></i><span>${S(t)}</span></div>`),
      ];
      sEl.innerHTML = all.length ? all.join('') : `<div class="ats-suggestion-item tip"><i class="fa-solid fa-check"></i><span>Great job! Your resume is well optimised.</span></div>`;
    }

    const kwEl = panel.querySelector('.keyword-chips');
    if (kwEl && result.keywords.suggested.length) {
      kwEl.innerHTML = result.keywords.suggested.map(kw => {
        const present = result.keywords.present.includes(kw);
        return `<span class="keyword-chip${present?'':' missing'}" data-kw="${S(kw)}" title="${present?'Present in resume':'Click to add to skills'}" style="${present?'opacity:.5;cursor:default':''}">${S(kw)}</span>`;
      }).join('');
      kwEl.querySelectorAll('.keyword-chip.missing').forEach(chip => {
        chip.addEventListener('click', () => { addSkill(chip.dataset.kw); updateATSPanel(); ToastService.info(`"${chip.dataset.kw}" added to skills.`); });
      });
    }
  }

  /* ── Autosave ────────────────────────────────────────────── */
  function triggerSave() {
    setSaveStatus('saving');
    _preview?.update(_resume);
    updateATSPanel();
    _debouncedSave();
  }

  async function _doSave() {
    try { await ResumeManager.save(_resume); setSaveStatus('saved'); }
    catch(e) { console.error('[App] Save failed', e); setSaveStatus('idle'); }
  }

  function setSaveStatus(status) {
    const ind = document.getElementById('autosave-indicator');
    if (!ind) return;
    ind.className = `autosave-indicator ${status}`;
    const lbl = ind.querySelector('.label');
    if (lbl) lbl.textContent = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : '';
  }

  /* ── Char count ──────────────────────────────────────────── */
  function updateCharCount() {
    const input = document.getElementById('f-summary');
    const count = document.getElementById('summary-char-count');
    if (!input || !count) return;
    const len = input.value.length;
    count.textContent = `${len} / 500`;
    count.className = `char-count ${len > 500 ? 'over' : len > 425 ? 'warn' : ''}`;
  }

  /* ── Delete / Duplicate / Download ──────────────────────── */
  async function confirmDelete(id) {
    const all = await ResumeManager.getAll();
    const resume = all.find(r => r.id === id);
    if (!resume) return;
    const modal  = document.getElementById('modal-confirm-delete');
    const nameEl = document.getElementById('delete-resume-name');
    if (nameEl) nameEl.textContent = resume.name;
    modal?.classList.add('active');

    const confirm = document.getElementById('btn-confirm-delete');
    const cancel  = document.getElementById('btn-cancel-delete');
    const cleanup = () => { confirm.removeEventListener('click', onConfirm); cancel.removeEventListener('click', onCancel); };

    async function onConfirm() {
      _deletedResume = Helpers.deepClone(resume);
      await ResumeManager.remove(id);
      modal?.classList.remove('active');
      cleanup();
      await renderDashboard();
      const dismiss = ToastService.warning(
        `"${resume.name}" deleted. <button id="undo-del" class="btn btn-xs btn-ghost ms-1" style="padding:.1rem .4rem;font-size:.78rem">Undo</button>`, 0
      );
      setTimeout(() => {
        document.getElementById('undo-del')?.addEventListener('click', async () => {
          dismiss?.();
          if (_deletedResume) { await ResumeManager.save(_deletedResume); _deletedResume = null; await renderDashboard(); ToastService.success('Resume restored.'); }
        });
      }, 50);
    }
    function onCancel() { modal?.classList.remove('active'); cleanup(); }
    confirm?.addEventListener('click', onConfirm);
    cancel?.addEventListener('click', onCancel);
  }

  async function duplicateResume(id) {
    try { const copy = await ResumeManager.duplicate(id); await renderDashboard(); ToastService.success(`"${copy.name}" created.`); }
    catch { ToastService.error('Could not duplicate resume.'); }
  }

  async function quickDownload(id) {
    const resume = await ResumeManager.get(id);
    if (!resume) return;
    const was = _resume; _resume = resume;
    await downloadPDF();
    _resume = was;
  }

  async function downloadPDF() {
    if (!_resume) return;
    try { ToastService.info('Opening print dialog…'); await PDFGenerator.generate(_resume); }
    catch { ToastService.error('PDF generation failed. Try printing manually.'); }
  }

  async function importResume() {
    try {
      const resume = await ImportExportService.importResume();
      await ResumeManager.save(resume);
      await renderDashboard();
      ToastService.success(`"${resume.name}" imported.`);
    } catch(e) { ToastService.error(e.message || 'Import failed.'); }
  }

  function exitBuilder() {
    showPage('dashboard');
    renderDashboard();
    _preview = null; _resume = null;
  }

  /* ── Global shortcuts ────────────────────────────────────── */
  function registerShortcuts() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (_resume) _doSave().then(() => ToastService.success('Saved.'));
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  async function init() {
    await StorageService.ready();
    registerShortcuts();
    showPage('dashboard');
    await renderDashboard();
  }

  return { init, openBuilder, renderDashboard, hideNewResumeModal, importResume };
})();

/* ══════════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  populateRoleSelects();

  // New resume form
  document.getElementById('form-new-resume')?.addEventListener('submit', async e => {
    e.preventDefault();
    const name   = document.getElementById('new-resume-name').value.trim() || 'My Resume';
    const tpl    = document.getElementById('new-resume-template').value || 'classic';
    const role   = document.getElementById('new-resume-role').value.trim();
    const resume = await ResumeManager.create({ name, template: tpl, targetRole: role });
    App.hideNewResumeModal();
    await App.openBuilder(resume.id);
  });

  document.getElementById('btn-cancel-new')?.addEventListener('click', () => App.hideNewResumeModal());

  document.getElementById('modal-new-resume')?.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) App.hideNewResumeModal();
  });

  document.querySelector('#modal-new-resume .modal-close')?.addEventListener('click', () => App.hideNewResumeModal());

  document.getElementById('modal-confirm-delete')?.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
  });

  document.querySelector('#modal-confirm-delete .modal-close')?.addEventListener('click', () => {
    document.getElementById('modal-confirm-delete')?.classList.remove('active');
  });

  // Import buttons (navbar + dashboard header)
  const doImport = () => App.importResume();
  document.getElementById('btn-import')?.addEventListener('click', doImport);
  document.getElementById('btn-import-dash')?.addEventListener('click', doImport);

  await App.init();
});
