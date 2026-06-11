import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const onboardingGuard: CanActivateFn = async () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // If profile is not loaded yet, fetch it
  console.log("checking to see if this passes or fails:", profileService.profile());
  if (!profileService.profile()) {
    try {
      console.log("profile was not loaded... fetching...")
      await profileService.getProfile();
    } catch {
      console.log("onboarding check failed...");
      return router.createUrlTree(['/onboarding/step-1']);
    }
  }

  console.log("profileService onboarding check:", profileService.isOnboardingComplete());

  if (profileService.isOnboardingComplete()) {
    return true;
  }

  // Redirect to the appropriate onboarding step
  const step = profileService.onboardingStep() || 1;
  return router.createUrlTree([`/onboarding/step-${step}`]);
};
