import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = computed(() => this._toasts().slice(-3)); // Max 3 visible

  success(message: string): void {
    this.addToast('success', message, true);
  }

  error(message: string): void {
    this.addToast('error', message, false); // Errors don't auto-dismiss
  }

  info(message: string): void {
    this.addToast('info', message, true);
  }

  dismiss(id: string): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private addToast(
    type: Toast['type'],
    message: string,
    autoDismiss: boolean
  ): void {
    const id = crypto.randomUUID();
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);

    if (autoDismiss) {
      setTimeout(() => this.dismiss(id), 4000);
    }
  }
}
