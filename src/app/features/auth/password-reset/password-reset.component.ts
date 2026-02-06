import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LucideAngularModule, CheckCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormInputComponent,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);

  readonly checkCircleIcon = CheckCircle2;

  readonly resetForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly emailErrorMessages: Record<string, string> = {
    required: 'Email is required',
    email: 'Please enter a valid email',
  };

  get emailControl(): FormControl {
    return this.resetForm.get('email') as FormControl;
  }

  async onSubmit(): Promise<void> {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.resetForm.disable();

    const { email } = this.resetForm.getRawValue();

    try {
      await this.authService.sendPasswordResetEmail(email);
      this.isSubmitted.set(true);
    } catch {
      // Re-enable form on unexpected error so user can retry
      this.resetForm.enable();
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
