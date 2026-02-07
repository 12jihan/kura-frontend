import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { onboardingGuard } from './onboarding.guard';
import { ProfileService } from '../services/profile.service';

describe('onboardingGuard', () => {
  let profileServiceMock: {
    profile: ReturnType<typeof signal>;
    isOnboardingComplete: ReturnType<typeof signal<boolean>>;
    onboardingStep: ReturnType<typeof signal<number>>;
    getProfile: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(() => {
    profileServiceMock = {
      profile: signal(null),
      isOnboardingComplete: signal(false),
      onboardingStep: signal(0),
      getProfile: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceMock },
      ],
    });

    router = TestBed.inject(Router);
  });

  const runGuard = () => {
    return TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));
  };

  it('should allow access when onboarding is complete', async () => {
    profileServiceMock.profile.set({ onboarding_complete: true });
    profileServiceMock.isOnboardingComplete.set(true);

    const result = await runGuard();

    expect(result).toBe(true);
  });

  it('should redirect to onboarding step when not complete', async () => {
    profileServiceMock.profile.set({ onboarding_complete: false, onboarding_step: 2 });
    profileServiceMock.isOnboardingComplete.set(false);
    profileServiceMock.onboardingStep.set(2);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding/step-2');
  });

  it('should redirect to step 1 when onboarding step is 0', async () => {
    profileServiceMock.profile.set({ onboarding_complete: false, onboarding_step: 0 });
    profileServiceMock.isOnboardingComplete.set(false);
    profileServiceMock.onboardingStep.set(0);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding/step-1');
  });

  it('should fetch profile if not loaded yet', async () => {
    profileServiceMock.getProfile.mockImplementation(async () => {
      profileServiceMock.profile.set({ onboarding_complete: true });
      profileServiceMock.isOnboardingComplete.set(true);
    });

    const result = await runGuard();

    expect(profileServiceMock.getProfile).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should redirect to step 1 if profile fetch fails', async () => {
    profileServiceMock.getProfile.mockRejectedValue(new Error('Network error'));

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/onboarding/step-1');
  });
});
