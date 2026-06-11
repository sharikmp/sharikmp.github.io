/**
 * helpers.js — General-purpose utility belt.
 * Pure functions only; no DOM dependencies.
 */

/**
 * Debounce: delays fn execution until after `wait` ms of silence.
 * Used for autosave (1000 ms) and preview re-renders.
 */
export function debounce(fn, wait = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/** Throttle: ensures fn fires at most once per `limit` ms. */
export function throttle(fn, limit = 100) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn.apply(this, args); }
  };
}

/** Generate a short UUID-like id for resume / entry IDs. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Sanitise a string so it is safe to inject as textContent / attribute. */
export function sanitize(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Strip all HTML tags – produces plain-text from rich content. */
export function stripHtml(html = '') {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/** Format a date string or Date object → "Jan 2024". */
export function formatMonthYear(value) {
  if (!value) return '';
  const d = new Date(value + '-01');
  if (isNaN(d)) return value;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** "2024-01" → { year: 2024, month: 1 } */
export function parseYearMonth(value = '') {
  const [y, m] = value.split('-').map(Number);
  return { year: y || 0, month: m || 0 };
}

/** Deep-clone an object via JSON round-trip. */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Merge defaults into partial object (shallow). */
export function withDefaults(partial = {}, defaults = {}) {
  return Object.assign({}, defaults, partial);
}

/** Clamp number between min and max. */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Convert a full name to a safe filename: "John Doe" → "John_Doe_Resume" */
export function toFilename(name = '') {
  return name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '') + '_Resume';
}

/** Count words in a string. */
export function wordCount(str = '') {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/** Truncate string to maxLen, appending ellipsis. */
export function truncate(str = '', maxLen = 60) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '…';
}

/** Validate e-mail address format. */
export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Validate a URL (http/https). */
export function isValidUrl(url = '') {
  try { const u = new URL(url); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

/** Return ISO date string for "today": "2024-06". */
export function todayMonthYear() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Read a file as text (returns Promise<string>). */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsText(file);
  });
}

/** Download a string as a file in the browser. */
export function downloadText(content, filename, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download a Uint8Array / ArrayBuffer as a binary file. */
export function downloadBytes(bytes, filename, mimeType = 'application/pdf') {
  const blob = new Blob([bytes], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/** Relative time display: "2 minutes ago", "Just now", etc. */
export function relativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const s = Math.round(diff / 1000);
  if (s < 10)  return 'Just now';
  if (s < 60)  return `${s} seconds ago`;
  const m = Math.round(s / 60);
  if (m < 60)  return `${m} minute${m > 1 ? 's' : ''} ago`;
  const h = Math.round(m / 60);
  if (h < 24)  return `${h} hour${h > 1 ? 's' : ''} ago`;
  const dy = Math.round(h / 24);
  return `${dy} day${dy > 1 ? 's' : ''} ago`;
}
