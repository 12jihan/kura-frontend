import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly emailErrorMessages: Record<string, string> = {
    required: 'Email is required',
    email: 'Please enter a valid email',
  };

  readonly passwordErrorMessages: Record<string, string> = {
    required: 'Password is required',
    minlength: 'Password must be at least 8 characters',
  };

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.register(email, password);
      // Redirect to onboarding (placeholder for now, will be implemented in Epic 2)
      await this.router.navigate(['/cards']);
    } catch {
      // Error is already set in AuthService
      this.submitError.set(this.authService.error());
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
