import { Component, input, output, effect, OnDestroy } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-linkedin-connect-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './linkedin-connect-modal.component.html',
  styleUrl: './linkedin-connect-modal.component.scss',
})
export class LinkedInConnectModalComponent implements OnDestroy {
  readonly isOpen = input(false);
  readonly connect = output<void>();
  readonly skip = output<void>();

  private escapeListener: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.addEscapeListener();
      } else {
        this.removeEscapeListener();
      }
    });
  }

  ngOnDestroy(): void {
    this.removeEscapeListener();
  }

  onConnect(): void {
    this.connect.emit();
  }

  onSkip(): void {
    this.skip.emit();
  }

  onBackdropClick(): void {
    this.skip.emit();
  }

  private addEscapeListener(): void {
    this.removeEscapeListener();
    this.escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.onSkip();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  private removeEscapeListener(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }
  }
}
