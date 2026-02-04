import { Routes } from '@angular/router';

export const schedulingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./scheduling.component').then((m) => m.SchedulingComponent),
  },
];
