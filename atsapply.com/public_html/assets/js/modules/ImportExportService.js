/**
 * ImportExportService.js
 *
 * Handles JSON export and import for resume documents.
 * Wraps ResumeManager's import/export with UI hooks
 * (file-picker trigger, validation feedback).
 */

import { resumeManager } from '../core/ResumeManager.js';
import { downloadText, readFileAsText } from '../utils/helpers.js';

class ImportExportService {
  /**
   * Export a resume to JSON and trigger a browser download.
   * @param {object} resume
   */
  exportResume(resume) {
    const json     = resumeManager.exportJSON(resume);
    const filename = (resume.name || 'resume').replace(/\s+/g, '_') + '.json';
    downloadText(json, filename);
  }

  /**
   * Open a file-picker and import a resume from JSON.
   * @returns {Promise<object>} – the imported resume (not yet saved)
   */
  importResume() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type   = 'file';
      input.accept = '.json,application/json';

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return reject(new Error('No file selected.'));
        try {
          const text   = await readFileAsText(file);
          const resume = resumeManager.importJSON(text);
          resolve(resume);
        } catch (e) {
          reject(e);
        }
      };

      input.click();
    });
  }
}

export const importExportService = new ImportExportService();
