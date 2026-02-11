import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TagInputComponent } from '../../../../shared/components/tag-input/tag-input.component';

@Component({
  selector: 'app-keywords-step',
  standalone: true,
  imports: [ButtonComponent, TagInputComponent],
  templateUrl: './keywords-step.component.html',
  styleUrl: './keywords-step.component.scss',
})
export class KeywordsStepComponent {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly keywords = signal<string[]>([]);
  readonly showError = signal(false);

  onTagsChange(tags: string[]): void {
    this.keywords.set(tags);
    if (tags.length > 0) {
      this.showError.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.keywords().length === 0) {
      this.showError.set(true);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const retrievedProfile = await this.profileService.completeOnboardingStep(4, { keywords: this.keywords() });
      if (!retrievedProfile) throw Error("could not retrieved profile");
      this.profileService.updateProfile(retrievedProfile);
      console.log("successful profile", this.profileService.profile());
      this.toastService.success('Welcome to Kura!');
      await this.router.navigate(['/cards']);
    } catch {
      this.toastService.error('Failed to complete setup. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/onboarding/step-3']);
  }
}
