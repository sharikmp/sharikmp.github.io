/**
 * StorageService.js
 *
 * Abstraction layer over IndexedDB with a synchronous LocalStorage fallback.
 * All public methods return Promises so callers never need to branch on engine.
 *
 * DB name : atsapply_db
 * Version : 1
 * Stores  : resumes  (keyPath: id)
 *           settings (keyPath: key)
 */

const DB_NAME    = 'atsapply_db';
const DB_VERSION = 1;
const STORE_RESUMES  = 'resumes';
const STORE_SETTINGS = 'settings';
const LS_RESUMES_KEY  = 'atsapply_resumes';
const LS_SETTINGS_KEY = 'atsapply_settings';

class StorageService {
  constructor() {
    this._db   = null;          // IDBDatabase instance (null until opened)
    this._mode = 'idb';         // 'idb' | 'ls'
    this._ready = this._init(); // Promise that resolves when storage is ready
  }

  /* ────────────────────────────────────────────────────────────
     Initialisation
  ──────────────────────────────────────────────────────────── */

  async _init() {
    try {
      this._db = await this._openIDB();
      this._mode = 'idb';
    } catch {
      // IndexedDB unavailable (private browsing, older browser) → fall back
      this._mode = 'ls';
      console.warn('[StorageService] IndexedDB unavailable; using LocalStorage fallback.');
    }
  }

  _openIDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_RESUMES)) {
          db.createObjectStore(STORE_RESUMES,  { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = e => reject(e.target.error);
    });
  }

  async ready() { return this._ready; }

  /* ────────────────────────────────────────────────────────────
     Generic IDB helpers
  ──────────────────────────────────────────────────────────── */

  _tx(storeName, mode = 'readonly') {
    return this._db.transaction(storeName, mode).objectStore(storeName);
  }

  _idbGet(storeName, key) {
    return new Promise((res, rej) => {
      const req = this._tx(storeName).get(key);
      req.onsuccess = e => res(e.target.result ?? null);
      req.onerror   = e => rej(e.target.error);
    });
  }

  _idbGetAll(storeName) {
    return new Promise((res, rej) => {
      const req = this._tx(storeName).getAll();
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
  }

  _idbPut(storeName, value) {
    return new Promise((res, rej) => {
      const req = this._tx(storeName, 'readwrite').put(value);
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
  }

  _idbDelete(storeName, key) {
    return new Promise((res, rej) => {
      const req = this._tx(storeName, 'readwrite').delete(key);
      req.onsuccess = () => res();
      req.onerror   = e => rej(e.target.error);
    });
  }

  /* ────────────────────────────────────────────────────────────
     LocalStorage helpers (fallback)
  ──────────────────────────────────────────────────────────── */

  _lsLoad(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  }

  _lsSave(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.error('[StorageService] LocalStorage write failed', e); }
  }

  /* ────────────────────────────────────────────────────────────
     Resume CRUD
  ──────────────────────────────────────────────────────────── */

  async getAllResumes() {
    await this._ready;
    if (this._mode === 'idb') {
      return this._idbGetAll(STORE_RESUMES);
    }
    return Object.values(this._lsLoad(LS_RESUMES_KEY) || {});
  }

  async getResume(id) {
    await this._ready;
    if (this._mode === 'idb') {
      return this._idbGet(STORE_RESUMES, id);
    }
    const all = this._lsLoad(LS_RESUMES_KEY) || {};
    return all[id] ?? null;
  }

  async saveResume(resume) {
    await this._ready;
    resume.updatedAt = Date.now();
    if (this._mode === 'idb') {
      await this._idbPut(STORE_RESUMES, resume);
    } else {
      const all = this._lsLoad(LS_RESUMES_KEY) || {};
      all[resume.id] = resume;
      this._lsSave(LS_RESUMES_KEY, all);
    }
    return resume;
  }

  async deleteResume(id) {
    await this._ready;
    if (this._mode === 'idb') {
      await this._idbDelete(STORE_RESUMES, id);
    } else {
      const all = this._lsLoad(LS_RESUMES_KEY) || {};
      delete all[id];
      this._lsSave(LS_RESUMES_KEY, all);
    }
  }

  /* ────────────────────────────────────────────────────────────
     Settings (key-value)
  ──────────────────────────────────────────────────────────── */

  async getSetting(key) {
    await this._ready;
    if (this._mode === 'idb') {
      const row = await this._idbGet(STORE_SETTINGS, key);
      return row ? row.value : null;
    }
    const all = this._lsLoad(LS_SETTINGS_KEY) || {};
    return all[key] ?? null;
  }

  async setSetting(key, value) {
    await this._ready;
    if (this._mode === 'idb') {
      await this._idbPut(STORE_SETTINGS, { key, value });
    } else {
      const all = this._lsLoad(LS_SETTINGS_KEY) || {};
      all[key] = value;
      this._lsSave(LS_SETTINGS_KEY, all);
    }
  }

  /** Report which storage engine is active – useful for debugging. */
  get engine() { return this._mode; }
}

export const storageService = new StorageService();
