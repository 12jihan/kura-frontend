import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, X, Info } from 'lucide-angular';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  readonly checkIcon = Check;
  readonly xIcon = X;
  readonly infoIcon = Info;

  getIcon(type: Toast['type']) {
    switch (type) {
      case 'success':
        return this.checkIcon;
      case 'error':
        return this.xIcon;
      case 'info':
        return this.infoIcon;
    }
  }

  getRole(type: Toast['type']): string {
    return type === 'error' ? 'alert' : 'status';
  }

  getAriaLive(type: Toast['type']): 'assertive' | 'polite' {
    return type === 'error' ? 'assertive' : 'polite';
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
