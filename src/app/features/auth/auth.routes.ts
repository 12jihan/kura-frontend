import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/auth/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent
      ),
  },
];
