/**
 * ToastService.js
 *
 * Lightweight toast notification system.
 * Attaches to #toast-container in the DOM.
 */

const ICONS = {
  success: 'fa-circle-check',
  error:   'fa-circle-xmark',
  warning: 'fa-triangle-exclamation',
  info:    'fa-circle-info',
};

class ToastService {
  constructor() {
    this._container = null;
  }

  _ensure() {
    if (!this._container) {
      this._container = document.getElementById('toast-container');
      if (!this._container) {
        this._container = document.createElement('div');
        this._container.id = 'toast-container';
        document.body.appendChild(this._container);
      }
    }
  }

  /**
   * Show a toast.
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration  ms before auto-dismiss (0 = sticky)
   */
  show(message, type = 'info', duration = 4000) {
    this._ensure();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <i class="toast-icon fa-solid ${ICONS[type] || ICONS.info}"></i>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;

    this._container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    const dismiss = () => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);

    return dismiss; // caller can dismiss early
  }

  success(msg, dur)  { return this.show(msg, 'success', dur); }
  error(msg, dur)    { return this.show(msg, 'error',   dur); }
  warning(msg, dur)  { return this.show(msg, 'warning', dur); }
  info(msg, dur)     { return this.show(msg, 'info',    dur); }
}

export const toastService = new ToastService();
