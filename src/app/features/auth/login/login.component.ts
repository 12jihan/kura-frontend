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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly emailErrorMessages: Record<string, string> = {
    required: 'Email is required',
    email: 'Please enter a valid email',
  };

  readonly passwordErrorMessages: Record<string, string> = {
    required: 'Password is required',
  };

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.loginForm.disable(); // AC#6: Disable form inputs during submission

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email, password);
      // await this.router.navigate(['/cards']);
    } catch {
      this.submitError.set(this.authService.error());
      this.loginForm.enable(); // Re-enable form on error
      // Clear password field on error (AC#3)
      this.loginForm.get('password')?.setValue('');
      this.loginForm.get('password')?.markAsUntouched();
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
