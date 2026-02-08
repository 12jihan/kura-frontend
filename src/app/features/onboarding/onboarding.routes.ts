import { Routes } from '@angular/router';

export const onboardingRoutes: Routes = [
  {
    path: 'step-1',
    loadComponent: () =>
      import('./steps/handle-step/handle-step.component').then(
        (m) => m.HandleStepComponent
      ),
  },
  {
    path: 'step-2',
    loadComponent: () =>
      import('./steps/content-step/content-step.component').then(
        (m) => m.ContentStepComponent
      ),
  },
  {
    path: 'step-3',
    loadComponent: () =>
      import('./steps/voice-step/voice-step.component').then(
        (m) => m.VoiceStepComponent
      ),
  },
  { path: '', redirectTo: 'step-1', pathMatch: 'full' },
];
