import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { noAuthGuard } from './no-auth.guard';
import { AuthService } from './auth.service';

describe('noAuthGuard', () => {
  let mockAuthService: { user$: Observable<User | null> };
  let router: Router;

  beforeEach(() => {
    mockAuthService = {
      user$: of(null),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: { navigate: vi.fn().mockResolvedValue(true) },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access when user is not authenticated', async () => {
    mockAuthService.user$ = of(null);

    await TestBed.runInInjectionContext(async () => {
      const result = noAuthGuard({} as any, {} as any);

      if (result instanceof Observable) {
        const value = await new Promise((resolve) => {
          result.subscribe((v) => resolve(v));
        });
        expect(value).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
      } else if (typeof result === 'boolean') {
        expect(result).toBe(true);
      }
    });
  });

  it('should redirect to /cards when user is authenticated (AC#4)', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as User;
    mockAuthService.user$ = of(mockUser);

    // Need to reconfigure TestBed with new mock
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: { navigate: vi.fn().mockResolvedValue(true) },
        },
      ],
    });
    router = TestBed.inject(Router);

    await TestBed.runInInjectionContext(async () => {
      const result = noAuthGuard({} as any, {} as any);

      if (result instanceof Observable) {
        const value = await new Promise((resolve) => {
          result.subscribe((v) => resolve(v));
        });
        expect(value).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/cards']);
      } else if (typeof result === 'boolean') {
        expect(result).toBe(false);
      }
    });
  });
});
