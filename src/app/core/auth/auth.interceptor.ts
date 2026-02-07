import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = auth.currentUser;

  const request$ = user
    ? from(user.getIdToken()).pipe(
        switchMap((token) => {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next(authReq);
        })
      )
    : next(req);

  return request$.pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.error('Session expired. Please log in again.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
