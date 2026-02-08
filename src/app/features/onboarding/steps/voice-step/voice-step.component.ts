import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-voice-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './voice-step.component.html',
  styleUrl: './voice-step.component.scss',
})
export class VoiceStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly maxLength = 500;
  readonly minLength = 10;

  readonly voiceForm = this.fb.group({
    brandDescription: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]],
  });

  readonly currentLength = computed(() => {
    return this._descriptionLength();
  });

  readonly isOverLimit = computed(() => {
    return this._descriptionLength() > this.maxLength;
  });

  private readonly _descriptionLength = signal(0);

  get showDescriptionError(): boolean {
    const control = this.voiceForm.get('brandDescription');
    return !!control && control.invalid && control.touched;
  }

  get descriptionErrorMessage(): string {
    const control = this.voiceForm.get('brandDescription');
    if (!control || !control.errors) return '';
    if (control.hasError('required')) return 'Brand voice description is required';
    if (control.hasError('minlength')) return 'Please provide at least 10 characters to help the AI understand your voice';
    if (control.hasError('maxlength')) return 'Description must be 500 characters or less';
    return '';
  }

  constructor() {
    this.voiceForm.get('brandDescription')!.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this._descriptionLength.set((value ?? '').length);
      });
  }

  goBack(): void {
    this.router.navigate(['/onboarding/step-2']);
  }

  async onSubmit(): Promise<void> {
    if (this.voiceForm.invalid) {
      this.voiceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { brandDescription } = this.voiceForm.value;

    try {
      await this.profileService.completeOnboardingStep(3, { brand_description: brandDescription });
      await this.router.navigate(['/onboarding/step-4']);
    } catch {
      this.toastService.error('Failed to save brand description. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
