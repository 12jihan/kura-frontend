import { Component, inject, signal, computed, effect } from '@angular/core';
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
  selector: 'app-content-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './content-step.component.html',
  styleUrl: './content-step.component.scss',
})
export class ContentStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);

  readonly contentTypes = [
    { value: 'tech-startups', label: 'Tech & Startups' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'creative-arts', label: 'Creative Arts' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ];

  readonly contentForm = this.fb.group({
    contentType: ['', [Validators.required]],
    customCategory: [''],
  });

  readonly isOtherSelected = computed(() => {
    return this._contentTypeValue() === 'other';
  });

  private readonly _contentTypeValue = signal('');

  readonly customCategoryErrorMessages: Record<string, string> = {
    required: 'Please describe your content focus',
  };

  get contentTypeControl() {
    return this.contentForm.get('contentType');
  }

  get customCategoryControl() {
    return this.contentForm.get('customCategory');
  }

  get showContentTypeError(): boolean {
    const control = this.contentTypeControl;
    return !!control && control.invalid && control.touched;
  }

  constructor() {
    this.contentForm.get('contentType')!.valueChanges.subscribe((value) => {
      this._contentTypeValue.set(value ?? '');
      const customControl = this.contentForm.get('customCategory')!;
      if (value === 'other') {
        customControl.setValidators([Validators.required]);
      } else {
        customControl.clearValidators();
        customControl.setValue('');
      }
      customControl.updateValueAndValidity();
    });
  }

  goBack(): void {
    this.router.navigate(['/onboarding/step-1']);
  }

  async onSubmit(): Promise<void> {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { contentType, customCategory } = this.contentForm.value;
    const contentTypeValue = contentType === 'other'
      ? customCategory
      : this.contentTypes.find(t => t.value === contentType)?.label;

    try {
      await this.profileService.completeOnboardingStep(2, { content_type: contentTypeValue });
      await this.router.navigate(['/onboarding/step-3']);
    } catch {
      this.toastService.error('Failed to save content type. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
