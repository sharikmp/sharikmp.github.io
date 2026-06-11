/**
 * PDFGenerator.js
 *
 * Generates a selectable-text, machine-readable PDF from the
 * rendered resume HTML using pdf-lib (loaded from CDN).
 *
 * Strategy:
 *   1. Render the resume template into a hidden iframe at 100% scale.
 *   2. Use the browser print dialog (window.print) for the iframe —
 *      this produces a true vector/text PDF, never a screenshot.
 *   3. As a fallback (if browser blocks or user cancels), offer jsPDF
 *      text extraction.
 *
 * Note: pdf-lib does not have a built-in HTML→PDF converter.
 * The gold standard for selectable-text PDFs from HTML is the browser's
 * native print-to-PDF, which embeds real fonts and text objects.
 * We trigger that via a hidden iframe + window.print().
 */

import { renderResume } from '../templates/resumeTemplates.js';
import { toFilename }   from '../utils/helpers.js';

class PDFGenerator {
  /**
   * Trigger browser print-to-PDF for the resume.
   * @param {object} resume – full resume document
   */
  async generate(resume) {
    const filename  = toFilename(resume.personal?.fullName || 'Resume') + '.pdf';
    const htmlContent = this._buildPrintHTML(resume, filename);

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;';
    document.body.appendChild(iframe);

    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        try {
          // Set document title so browser uses it as the suggested filename
          iframe.contentDocument.title = filename.replace('.pdf', '');
          setTimeout(() => {
            iframe.contentWindow.print();
            // Give print dialog time to open, then clean up
            setTimeout(() => {
              document.body.removeChild(iframe);
              resolve(filename);
            }, 1500);
          }, 400);
        } catch (e) {
          document.body.removeChild(iframe);
          reject(e);
        }
      };
      iframe.srcdoc = htmlContent;
    });
  }

  /* ── Build self-contained print HTML ───────────────────────── */
  _buildPrintHTML(resume, filename) {
    const body = renderResume(resume);
    // Inline the template CSS so the iframe has no external deps
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${filename.replace('.pdf', '')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }

    /* ---- Classic ---- */
    .tpl-classic { font-family: Arial, sans-serif; font-size: 11pt; color: #1a1a1a; padding: 36px 48px; line-height: 1.45; }
    .tpl-classic .res-name { font-size: 22pt; font-weight: 700; margin-bottom: 2px; }
    .tpl-classic .res-title { font-size: 11.5pt; color: #374151; margin-bottom: 6px; }
    .tpl-classic .res-contact { font-size: 9.5pt; color: #4B5563; display: flex; flex-wrap: wrap; gap: 6px 18px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #1a1a1a; }
    .tpl-classic .sec-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; margin: 14px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #9CA3AF; color: #111827; }
    .tpl-classic .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
    .tpl-classic .exp-company { font-weight: 700; font-size: 10.5pt; }
    .tpl-classic .exp-dates { font-size: 9.5pt; color: #6B7280; }
    .tpl-classic .exp-role { font-size: 10pt; color: #374151; font-style: italic; }
    .tpl-classic .exp-bullets { margin: 3px 0 0 12px; padding-left: 14px; }
    .tpl-classic .exp-bullets li { font-size: 10pt; margin-bottom: 2px; }
    .tpl-classic .edu-entry { margin-bottom: 6px; }
    .tpl-classic .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .tpl-classic .edu-school { font-weight: 700; font-size: 10.5pt; }
    .tpl-classic .edu-years { font-size: 9.5pt; color: #6B7280; }
    .tpl-classic .edu-degree { font-size: 10pt; color: #374151; }
    .tpl-classic .skills-text { font-size: 10pt; line-height: 1.6; }
    .tpl-classic .proj-entry { margin-bottom: 5px; }
    .tpl-classic .proj-name { font-weight: 700; font-size: 10.5pt; }
    .tpl-classic .proj-tech { font-size: 9.5pt; color: #6B7280; font-style: italic; }
    .tpl-classic .proj-desc { font-size: 10pt; }
    .tpl-classic .cert-entry { margin-bottom: 4px; font-size: 10pt; }
    .tpl-classic .cert-name { font-weight: 700; }
    .tpl-classic .cert-org { color: #6B7280; }
    .tpl-classic .achiev-list { padding-left: 16px; font-size: 10pt; }
    .tpl-classic .achiev-list li { margin-bottom: 2px; }
    .tpl-classic .lang-list { font-size: 10pt; }

    /* ---- Professional ---- */
    .tpl-professional { font-family: Georgia, serif; font-size: 11pt; color: #111827; padding: 40px 52px; line-height: 1.5; }
    .tpl-professional .res-name { font-size: 24pt; font-weight: 700; color: #1E3A5F; margin-bottom: 2px; }
    .tpl-professional .res-title { font-size: 12pt; color: #4B5563; margin-bottom: 8px; }
    .tpl-professional .res-contact { font-size: 9.5pt; color: #6B7280; display: flex; flex-wrap: wrap; gap: 5px 16px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2.5px solid #1E3A5F; }
    .tpl-professional .sec-title { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin: 16px 0 5px; color: #1E3A5F; padding-bottom: 3px; border-bottom: 1px solid #CBD5E1; }
    .tpl-professional .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .tpl-professional .exp-company { font-weight: 700; font-size: 10.5pt; color: #1E3A5F; }
    .tpl-professional .exp-dates { font-size: 9.5pt; color: #9CA3AF; }
    .tpl-professional .exp-role { font-size: 10pt; color: #374151; }
    .tpl-professional .exp-bullets { margin: 3px 0 0 14px; padding-left: 14px; }
    .tpl-professional .exp-bullets li { font-size: 10pt; margin-bottom: 2px; }
    .tpl-professional .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .tpl-professional .edu-school { font-weight: 700; font-size: 10.5pt; color: #1E3A5F; }
    .tpl-professional .edu-years { font-size: 9.5pt; color: #9CA3AF; }
    .tpl-professional .edu-degree { font-size: 10pt; color: #374151; }
    .tpl-professional .skills-text { font-size: 10pt; }
    .tpl-professional .proj-entry { margin-bottom: 6px; }
    .tpl-professional .proj-name { font-weight: 700; color: #1E3A5F; font-size: 10.5pt; }
    .tpl-professional .proj-tech { font-size: 9.5pt; color: #9CA3AF; font-style: italic; }
    .tpl-professional .proj-desc { font-size: 10pt; }
    .tpl-professional .cert-entry { margin-bottom: 4px; font-size: 10pt; }
    .tpl-professional .achiev-list { padding-left: 16px; font-size: 10pt; }
    .tpl-professional .lang-list { font-size: 10pt; }

    /* ---- Minimal ---- */
    .tpl-minimal { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; color: #1a1a1a; padding: 30px 42px; line-height: 1.4; }
    .tpl-minimal .res-name { font-size: 18pt; font-weight: 700; margin-bottom: 1px; }
    .tpl-minimal .res-title { font-size: 10.5pt; color: #555; margin-bottom: 5px; }
    .tpl-minimal .res-contact { font-size: 9pt; color: #666; display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1.5px solid #ccc; }
    .tpl-minimal .sec-title { font-size: 9.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 11px 0 3px; color: #333; }
    .tpl-minimal .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .tpl-minimal .exp-company { font-weight: 700; font-size: 10pt; }
    .tpl-minimal .exp-dates { font-size: 9pt; color: #999; }
    .tpl-minimal .exp-role { font-size: 9.5pt; color: #555; }
    .tpl-minimal .exp-bullets { margin: 2px 0 0 12px; padding-left: 14px; }
    .tpl-minimal .exp-bullets li { font-size: 9.5pt; margin-bottom: 1.5px; }
    .tpl-minimal .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .tpl-minimal .edu-school { font-weight: 700; font-size: 10pt; }
    .tpl-minimal .edu-years { font-size: 9pt; color: #999; }
    .tpl-minimal .edu-degree { font-size: 9.5pt; color: #555; }
    .tpl-minimal .skills-text { font-size: 9.5pt; }
    .tpl-minimal .proj-entry { margin-bottom: 4px; }
    .tpl-minimal .proj-name { font-weight: 700; font-size: 10pt; }
    .tpl-minimal .proj-tech { font-size: 9pt; color: #999; font-style: italic; }
    .tpl-minimal .proj-desc { font-size: 9.5pt; }
    .tpl-minimal .cert-entry { margin-bottom: 3px; font-size: 9.5pt; }
    .tpl-minimal .achiev-list { padding-left: 14px; font-size: 9.5pt; }
    .tpl-minimal .lang-list { font-size: 9.5pt; }

    /* Shared */
    .exp-entry, .edu-entry, .proj-entry, .cert-entry { margin-bottom: 8px; }
    .sec-content { font-size: 10pt; margin: 0; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
  }
}

export const pdfGenerator = new PDFGenerator();
