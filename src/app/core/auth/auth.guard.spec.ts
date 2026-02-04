import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authServiceMock: { user$: Observable<User | null> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      user$: of(null),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should redirect to login when user is not authenticated', async () => {
    authServiceMock.user$ = of(null);

    await TestBed.runInInjectionContext(async () => {
      const result = authGuard({} as any, {} as any);
      if (result && typeof result !== 'boolean' && 'subscribe' in result) {
        await new Promise<void>((resolve) => {
          result.subscribe((allowed) => {
            expect(allowed).toBe(false);
            expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
            resolve();
          });
        });
      }
    });
  });

  it('should allow access when user is authenticated', async () => {
    authServiceMock.user$ = of({ uid: 'test-uid' } as User);

    await TestBed.runInInjectionContext(async () => {
      const result = authGuard({} as any, {} as any);
      if (result && typeof result !== 'boolean' && 'subscribe' in result) {
        await new Promise<void>((resolve) => {
          result.subscribe((allowed) => {
            expect(allowed).toBe(true);
            expect(routerMock.navigate).not.toHaveBeenCalled();
            resolve();
          });
        });
      }
    });
  });
});
