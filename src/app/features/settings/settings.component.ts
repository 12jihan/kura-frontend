import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';
import { ToastService } from '../../core/services/toast.service';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { TagInputComponent } from '../../shared/components/tag-input/tag-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, FormInputComponent, TagInputComponent, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, HasUnsavedChanges {
  private readonly profileService = inject(ProfileService);
  private readonly linkedInService = inject(LinkedInService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly profile = this.profileService.profile;
  readonly isLoading = this.profileService.isLoading;
  readonly isConnecting = this.linkedInService.isConnecting;
  readonly linkedInError = this.linkedInService.error;

  readonly isSaving = signal(false);
  readonly keywords = signal<string[]>([]);

  private originalValues = {
    handle: '',
    contentType: '',
    customContentType: '',
    brandDescription: '',
    keywords: [] as string[],
  };

  readonly settingsForm = this.fb.group({
    handle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    contentType: ['', [Validators.required]],
    customContentType: [''],
    brandDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  readonly handleErrorMessages: Record<string, string> = {
    required: 'Handle is required',
    minlength: 'Handle must be at least 2 characters',
    maxlength: 'Handle must be at most 30 characters',
    pattern: 'Only letters, numbers, and underscores allowed',
  };

  readonly customCategoryErrorMessages: Record<string, string> = {
    required: 'Please describe your content focus',
  };

  readonly brandDescriptionErrorMessages: Record<string, string> = {
    required: 'Brand description is required',
    minlength: 'Please provide at least 10 characters',
    maxlength: 'Maximum 500 characters',
  };

  readonly contentTypes = [
    { value: 'tech-startups', label: 'Tech & Startups' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'creative-arts', label: 'Creative Arts' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ];

  readonly isOtherSelected = computed(() => {
    return this._contentTypeValue() === 'other';
  });

  private readonly _contentTypeValue = signal('');
  readonly descriptionLength = signal(0);
  readonly maxDescriptionLength = 500;

  get showContentTypeError(): boolean {
    const control = this.settingsForm.get('contentType');
    return !!control && control.invalid && control.touched;
  }

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.populateForm(profile);
    }

    this.settingsForm.get('contentType')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this._contentTypeValue.set(value ?? '');
        const customControl = this.settingsForm.get('customContentType')!;
        if (value === 'other') {
          customControl.setValidators([Validators.required]);
        } else {
          customControl.clearValidators();
          customControl.setValue('');
        }
        customControl.updateValueAndValidity();
      });

    this.settingsForm.get('brandDescription')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.descriptionLength.set((value ?? '').length);
      });
  }

  private populateForm(profile: UserProfile): void {
    const isCustom = !this.contentTypes.some(t => t.value === profile.content_type) && !!profile.content_type;
    const contentTypeValue = isCustom ? 'other' : (profile.content_type ?? '');
    const customValue = isCustom ? (profile.content_type ?? '') : '';

    this.settingsForm.patchValue({
      handle: profile.handle ?? '',
      contentType: contentTypeValue,
      customContentType: customValue,
      brandDescription: profile.brand_description ?? '',
    }, { emitEvent: false });

    this._contentTypeValue.set(contentTypeValue);
    this.descriptionLength.set((profile.brand_description ?? '').length);
    this.keywords.set([...profile.keywords]);

    const customControl = this.settingsForm.get('customContentType')!;
    if (isCustom) {
      customControl.setValidators([Validators.required]);
    } else {
      customControl.clearValidators();
    }
    customControl.updateValueAndValidity({ emitEvent: false });

    this.originalValues = {
      handle: profile.handle ?? '',
      contentType: contentTypeValue,
      customContentType: customValue,
      brandDescription: profile.brand_description ?? '',
      keywords: [...profile.keywords],
    };

    this.settingsForm.markAsPristine();
  }

  hasUnsavedChanges(): boolean {
    if (this.settingsForm.dirty) return true;
    return JSON.stringify(this.keywords()) !== JSON.stringify(this.originalValues.keywords);
  }

  onTagsChange(tags: string[]): void {
    this.keywords.set(tags);
  }

  async onSave(): Promise<void> {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    if (this.keywords().length === 0) {
      this.toastService.error('Please add at least one keyword');
      return;
    }

    const formValue = this.settingsForm.value;
    const contentType = formValue.contentType === 'other'
      ? formValue.customContentType
      : formValue.contentType;

    const data: Partial<UserProfile> = {
      handle: formValue.handle ?? '',
      content_type: contentType ?? '',
      brand_description: formValue.brandDescription ?? '',
      keywords: this.keywords(),
    };

    this.isSaving.set(true);
    try {
      const updated = await this.profileService.updateProfile(data);
      this.toastService.success('Profile updated');
      this.populateForm(updated);
    } catch {
      this.toastService.error('Failed to update profile');
    } finally {
      this.isSaving.set(false);
    }
  }

  onConnectLinkedIn(): void {
    this.linkedInService.initiateOAuth();
  }

  async onDisconnectLinkedIn(): Promise<void> {
    if (!confirm('Disconnect LinkedIn? You will need to reconnect to publish posts.')) {
      return;
    }

    try {
      await this.linkedInService.disconnect();
      await this.profileService.getProfile();
      this.toastService.success('LinkedIn disconnected');
    } catch {
      this.toastService.error('Failed to disconnect LinkedIn');
    }
  }
}
