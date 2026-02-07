import { Routes } from '@angular/router';

export const onboardingRoutes: Routes = [
  {
    path: 'step-1',
    loadComponent: () =>
      import('./steps/handle-step/handle-step.component').then(
        (m) => m.HandleStepComponent
      ),
  },
  { path: '', redirectTo: 'step-1', pathMatch: 'full' },
];
