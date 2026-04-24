import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  nextId = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = ++this.nextId;

    this.toasts.update((toasts) => [...toasts, { id, message, type }]);

    setTimeout(() => this.remove(id), duration);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  error(message: string) {
    this.show(message, 'error', 5000);
  }

  info(message: string) {
    this.show(message, 'info');
  }

  remove(id: number) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
