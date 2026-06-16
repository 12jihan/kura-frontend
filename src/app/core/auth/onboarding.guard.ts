import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';

export const onboardingGuard: CanActivateFn = async () => {
  const profileService = inject(ProfileService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. On hard refresh, the profile signal will be null.
  if (!profileService.profile()) {
    try {
      // 2. Wait for Firebase to figure out who the user is.
      const firebaseUser: User | null = await firstValueFrom(authService.user$)

      if (!firebaseUser) {
        return router.createUrlTree(['/login']);
      }

      // 3. ACTUALLY fetch the profile from PostgreSQL using the UID!
      await profileService.get_user(firebaseUser.uid);
    } catch (error) {
      console.error("Guard failed to fetch profile from DB:", error);
      return router.createUrlTree(['/onboarding/step-1']);
    }
  }

  // 4. Now the signal is populated. Check the DB value.
  if (profileService.isOnboardingComplete()) {
    return true;
  }

  // Redirect to the appropriate onboarding step if genuinely in complete;
  const step = profileService.onboardingStep() || 1;
  return router.createUrlTree([`/onboarding/step-${step}`]);
};
