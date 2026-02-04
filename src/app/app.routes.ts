import { Routes } from '@angular/router';
import { authGuard } from './core';
import { noAuthGuard } from './core/auth/no-auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
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
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
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
