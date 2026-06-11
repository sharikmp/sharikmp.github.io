/**
 * resumeTemplates.js
 *
 * Pure HTML renderers for each resume template.
 * All output is ATS-compliant:
 *   - No tables, no icons, no images, no multi-column layout.
 *   - Semantic headings, plain-text friendly.
 *
 * Each function: (resume) → HTML string
 */

import { sanitize, formatMonthYear } from '../utils/helpers.js';

/* ── Shared section builders (template-agnostic HTML) ─────────── */

function contactLine(p) {
  const parts = [p.email, p.phone, p.city && p.country ? `${p.city}, ${p.country}` : p.city || p.country, p.linkedin, p.github, p.portfolio].filter(Boolean);
  return parts.map(v => `<span>${sanitize(v)}</span>`).join('');
}

function summarySection(cls, summary) {
  if (!summary?.trim()) return '';
  return `
    <div class="sec-title">Professional Summary</div>
    <p class="sec-content">${sanitize(summary)}</p>`;
}

function skillsSection(cls, skills) {
  if (!skills?.length) return '';
  return `
    <div class="sec-title">Skills</div>
    <p class="skills-text">${skills.map(s => sanitize(s)).join(' • ')}</p>`;
}

function experienceSection(cls, exp) {
  if (!exp?.length) return '';
  const items = exp.map(e => {
    const dates = e.current ? `${formatMonthYear(e.startDate)} – Present` : `${formatMonthYear(e.startDate)}${e.endDate ? ' – ' + formatMonthYear(e.endDate) : ''}`;
    const bullets = (e.bullets || []).filter(b => b.trim());
    return `
    <div class="exp-entry">
      <div class="exp-header">
        <span class="exp-company">${sanitize(e.company)}</span>
        <span class="exp-dates">${sanitize(dates)}</span>
      </div>
      <div class="exp-role">${sanitize(e.role)}${e.location ? ' · ' + sanitize(e.location) : ''}</div>
      ${bullets.length ? `<ul class="exp-bullets">${bullets.map(b => `<li>${sanitize(b)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }).join('');
  return `<div class="sec-title">Work Experience</div>${items}`;
}

function educationSection(cls, edu) {
  if (!edu?.length) return '';
  const items = edu.map(e => `
    <div class="edu-entry">
      <div class="edu-header">
        <span class="edu-school">${sanitize(e.institution)}</span>
        <span class="edu-years">${sanitize(e.startYear)}${e.endYear ? ' – ' + sanitize(e.endYear) : ''}</span>
      </div>
      <div class="edu-degree">${sanitize(e.degree)}${e.field ? ', ' + sanitize(e.field) : ''}${e.cgpa ? ' · GPA: ' + sanitize(e.cgpa) : ''}</div>
    </div>`).join('');
  return `<div class="sec-title">Education</div>${items}`;
}

function projectsSection(cls, projects) {
  if (!projects?.length) return '';
  const items = projects.map(p => `
    <div class="proj-entry">
      <div class="proj-name">${sanitize(p.name)}${p.github ? ` <span style="font-weight:400;font-size:.9em;color:#666;"> · ${sanitize(p.github)}</span>` : ''}${p.live ? ` <span style="font-weight:400;font-size:.9em;color:#666;"> · ${sanitize(p.live)}</span>` : ''}</div>
      ${p.tech ? `<div class="proj-tech">Tech: ${sanitize(p.tech)}</div>` : ''}
      ${p.description ? `<div class="proj-desc">${sanitize(p.description)}</div>` : ''}
    </div>`).join('');
  return `<div class="sec-title">Projects</div>${items}`;
}

function certificationsSection(cls, certs) {
  if (!certs?.length) return '';
  const items = certs.map(c => `
    <div class="cert-entry">
      <span class="cert-name">${sanitize(c.name)}</span>${c.org ? ` — <span class="cert-org">${sanitize(c.org)}</span>` : ''}${c.issueDate ? ` <span style="color:#9CA3AF;font-size:.9em;">(${sanitize(c.issueDate)})</span>` : ''}${c.credentialUrl ? ` <span style="color:#666;font-size:.9em;">${sanitize(c.credentialUrl)}</span>` : ''}
    </div>`).join('');
  return `<div class="sec-title">Certifications</div>${items}`;
}

function achievementsSection(cls, items) {
  if (!items?.length) return '';
  return `<div class="sec-title">Achievements</div>
  <ul class="achiev-list">${items.filter(Boolean).map(a => `<li>${sanitize(a)}</li>`).join('')}</ul>`;
}

function languagesSection(cls, langs) {
  if (!langs?.length) return '';
  return `<div class="sec-title">Languages</div>
  <p class="lang-list">${langs.map(l => sanitize(l)).join(' · ')}</p>`;
}

/* ── Template: Classic ATS ────────────────────────────────────── */
export function renderClassic(resume) {
  const p = resume.personal || {};
  return `
<div class="tpl-classic">
  <div class="res-name">${sanitize(p.fullName || 'Your Name')}</div>
  ${p.title ? `<div class="res-title">${sanitize(p.title)}</div>` : ''}
  <div class="res-contact">${contactLine(p)}</div>
  ${summarySection('classic', resume.summary)}
  ${skillsSection('classic', resume.skills)}
  ${experienceSection('classic', resume.experience)}
  ${educationSection('classic', resume.education)}
  ${projectsSection('classic', resume.projects)}
  ${certificationsSection('classic', resume.certifications)}
  ${achievementsSection('classic', resume.achievements)}
  ${languagesSection('classic', resume.languages)}
</div>`;
}

/* ── Template: Professional ATS ───────────────────────────────── */
export function renderProfessional(resume) {
  const p = resume.personal || {};
  return `
<div class="tpl-professional">
  <div class="res-name">${sanitize(p.fullName || 'Your Name')}</div>
  ${p.title ? `<div class="res-title">${sanitize(p.title)}</div>` : ''}
  <div class="res-contact">${contactLine(p)}</div>
  ${summarySection('professional', resume.summary)}
  ${skillsSection('professional', resume.skills)}
  ${experienceSection('professional', resume.experience)}
  ${educationSection('professional', resume.education)}
  ${projectsSection('professional', resume.projects)}
  ${certificationsSection('professional', resume.certifications)}
  ${achievementsSection('professional', resume.achievements)}
  ${languagesSection('professional', resume.languages)}
</div>`;
}

/* ── Template: Minimal ATS ────────────────────────────────────── */
export function renderMinimal(resume) {
  const p = resume.personal || {};
  return `
<div class="tpl-minimal">
  <div class="res-name">${sanitize(p.fullName || 'Your Name')}</div>
  ${p.title ? `<div class="res-title">${sanitize(p.title)}</div>` : ''}
  <div class="res-contact">${contactLine(p)}</div>
  ${summarySection('minimal', resume.summary)}
  ${skillsSection('minimal', resume.skills)}
  ${experienceSection('minimal', resume.experience)}
  ${educationSection('minimal', resume.education)}
  ${projectsSection('minimal', resume.projects)}
  ${certificationsSection('minimal', resume.certifications)}
  ${achievementsSection('minimal', resume.achievements)}
  ${languagesSection('minimal', resume.languages)}
</div>`;
}

/* ── Dispatcher ───────────────────────────────────────────────── */
export function renderResume(resume) {
  switch (resume.template) {
    case 'professional': return renderProfessional(resume);
    case 'minimal':      return renderMinimal(resume);
    default:             return renderClassic(resume);
  }
}
