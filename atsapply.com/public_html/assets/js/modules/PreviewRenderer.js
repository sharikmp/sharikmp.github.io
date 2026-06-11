/**
 * PreviewRenderer.js
 *
 * Manages the live A4 preview pane inside the builder.
 * Uses requestAnimationFrame to batch DOM writes and avoid jank.
 * Supports zoom in/out and page break visualization.
 */

import { renderResume } from '../templates/resumeTemplates.js';
import { clamp } from '../utils/helpers.js';

const ZOOM_STEP = 0.1;
const ZOOM_MIN  = 0.4;
const ZOOM_MAX  = 1.4;
const ZOOM_DEFAULT = 0.75;

class PreviewRenderer {
  /**
   * @param {HTMLElement} canvasEl   – .resume-canvas div
   * @param {HTMLElement} zoomValEl  – zoom % display span
   */
  constructor(canvasEl, zoomValEl) {
    this._canvas  = canvasEl;
    this._zoomEl  = zoomValEl;
    this._zoom    = ZOOM_DEFAULT;
    this._pending = false;        // rAF guard
    this._resume  = null;

    this._applyZoom();
  }

  /* ── Public API ──────────────────────────────────────────────── */

  /** Replace resume data and schedule a re-render. */
  update(resume) {
    this._resume = resume;
    this._schedule();
  }

  zoomIn()    { this._setZoom(this._zoom + ZOOM_STEP); }
  zoomOut()   { this._setZoom(this._zoom - ZOOM_STEP); }
  zoomReset() { this._setZoom(ZOOM_DEFAULT); }

  get zoom() { return this._zoom; }

  /* ── Internals ───────────────────────────────────────────────── */

  _schedule() {
    if (this._pending) return;
    this._pending = true;
    requestAnimationFrame(() => {
      this._pending = false;
      this._render();
    });
  }

  _render() {
    if (!this._resume || !this._canvas) return;
    this._canvas.innerHTML = renderResume(this._resume);
  }

  _setZoom(z) {
    this._zoom = clamp(z, ZOOM_MIN, ZOOM_MAX);
    this._applyZoom();
  }

  _applyZoom() {
    if (this._canvas) {
      this._canvas.style.transform = `scale(${this._zoom})`;
    }
    if (this._zoomEl) {
      this._zoomEl.textContent = Math.round(this._zoom * 100) + '%';
    }
  }
}

export { PreviewRenderer };
