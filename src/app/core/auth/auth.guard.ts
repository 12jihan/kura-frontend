import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      // console.log("User in the authguard | auth service:", user);

      if (user) {
        // console.log("This will pass:", user?.uid);
        return true;
      }
      // console.log("navigating to the login page...");
      router.navigate(['/login']);
      return false;
    })
  );
};
