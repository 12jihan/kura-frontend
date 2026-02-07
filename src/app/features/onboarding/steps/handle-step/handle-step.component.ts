import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-handle-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './handle-step.component.html',
  styleUrl: './handle-step.component.scss',
})
export class HandleStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);

  readonly handleForm = this.fb.group({
    handle: [this.profileService.profile()?.handle ?? '', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-Z0-9_]+$/),
    ]],
  });

  readonly handleErrorMessages: Record<string, string> = {
    required: 'Handle is required',
    minlength: 'Handle must be at least 2 characters',
    maxlength: 'Handle must be no more than 30 characters',
    pattern: 'Handle can only contain letters, numbers, and underscores',
  };

  get handleControl() {
    return this.handleForm.get('handle');
  }

  async onSubmit(): Promise<void> {
    if (this.handleForm.invalid) {
      this.handleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { handle } = this.handleForm.value;

    try {
      await this.profileService.completeOnboardingStep(1, { handle });
      await this.router.navigate(['/onboarding/step-2']);
    } catch {
      this.toastService.error('Failed to save handle. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
