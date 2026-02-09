import { Routes } from '@angular/router';
import { authGuard } from './core';
import { noAuthGuard } from './core/auth/no-auth.guard';
import { onboardingGuard } from './core/auth/onboarding.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { onboardingRoutes } from './features/onboarding/onboarding.routes';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
        canActivate: [noAuthGuard],
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        canActivate: [noAuthGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        canActivate: [noAuthGuard],
      },
      {
        path: 'password-reset',
        loadComponent: () =>
          import('./features/auth/password-reset/password-reset.component').then(
            (m) => m.PasswordResetComponent
          ),
        canActivate: [noAuthGuard],
      },
    ],
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding-layout/onboarding-layout.component').then(
        (m) => m.OnboardingLayoutComponent
      ),
    children: onboardingRoutes,
  },
  {
    path: 'linkedin/callback',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/linkedin-callback/linkedin-callback.component').then(
        (m) => m.LinkedInCallbackComponent
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, onboardingGuard],
    children: [
      {
        path: 'cards',
        loadComponent: () =>
          import('./features/feed/feed.component').then((m) => m.FeedComponent),
      },
      {
        path: 'scheduled',
        loadComponent: () =>
          import('./features/scheduling/scheduling.component').then(
            (m) => m.SchedulingComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: '',
        redirectTo: 'cards',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'cards',
  },
];
