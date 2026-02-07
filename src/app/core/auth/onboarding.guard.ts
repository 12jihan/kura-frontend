import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const onboardingGuard: CanActivateFn = async () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // If profile is not loaded yet, fetch it
  if (!profileService.profile()) {
    try {
      await profileService.getProfile();
    } catch {
      return router.createUrlTree(['/onboarding/step-1']);
    }
  }

  if (profileService.isOnboardingComplete()) {
    return true;
  }

  // Redirect to the appropriate onboarding step
  const step = profileService.onboardingStep() || 1;
  return router.createUrlTree([`/onboarding/step-${step}`]);
};
