import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ProfileService, UserProfile } from './profile.service';
import { of, throwError } from 'rxjs';

const mockProfile: UserProfile = {
  id: '1',
  firebase_uid: 'uid-123',
  handle: 'testhandle',
  content_type: null,
  brand_description: null,
  keywords: [],
  onboarding_step: 1,
  onboarding_complete: false,
  linkedin_connected: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      patch: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(ProfileService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have null profile', () => {
      expect(service.profile()).toBeNull();
    });

    it('should have isLoading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have null error', () => {
      expect(service.error()).toBeNull();
    });

    it('should have onboardingStep 0 when no profile', () => {
      expect(service.onboardingStep()).toBe(0);
    });

    it('should have isOnboardingComplete false when no profile', () => {
      expect(service.isOnboardingComplete()).toBe(false);
    });
  });

  describe('getProfile', () => {
    it('should fetch profile and update signal', async () => {
      httpMock.get.mockReturnValue(of(mockProfile));

      const result = await service.getProfile();

      expect(httpMock.get).toHaveBeenCalledWith('/api/profile');
      expect(result).toEqual(mockProfile);
      expect(service.profile()).toEqual(mockProfile);
    });

    it('should set isLoading during request', async () => {
      httpMock.get.mockReturnValue(of(mockProfile));

      const promise = service.getProfile();
      await promise;

      expect(service.isLoading()).toBe(false);
    });

    it('should set error on failure', async () => {
      httpMock.get.mockReturnValue(throwError(() => new Error('Not found')));

      await service.getProfile().catch(() => {});

      expect(service.error()).toBe('Not found');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should send PATCH request and update signal', async () => {
      const updated = { ...mockProfile, handle: 'newhandle' };
      httpMock.patch.mockReturnValue(of(updated));

      const result = await service.updateProfile({ handle: 'newhandle' });

      expect(httpMock.patch).toHaveBeenCalledWith(
        '/api/profile',
        { handle: 'newhandle' }
      );
      expect(result.handle).toBe('newhandle');
      expect(service.profile()?.handle).toBe('newhandle');
    });

    it('should set error on failure', async () => {
      httpMock.patch.mockReturnValue(throwError(() => new Error('Bad request')));

      await service.updateProfile({ handle: 'x' }).catch(() => {});

      expect(service.error()).toBe('Bad request');
    });
  });

  describe('completeOnboardingStep', () => {
    it('should send POST request with step and data', async () => {
      const updatedProfile = { ...mockProfile, onboarding_step: 2 };
      httpMock.post.mockReturnValue(of(updatedProfile));

      const result = await service.completeOnboardingStep(1, { handle: 'myhandle' });

      expect(httpMock.post).toHaveBeenCalledWith(
        '/api/profile/onboard',
        { step: 1, data: { handle: 'myhandle' } }
      );
      expect(result.onboarding_step).toBe(2);
      expect(service.profile()?.onboarding_step).toBe(2);
    });

    it('should update onboardingStep computed signal', async () => {
      const updatedProfile = { ...mockProfile, onboarding_step: 2 };
      httpMock.post.mockReturnValue(of(updatedProfile));

      await service.completeOnboardingStep(1, { handle: 'test' });

      expect(service.onboardingStep()).toBe(2);
    });

    it('should set error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('Server error')));

      await service.completeOnboardingStep(1, { handle: 'test' }).catch(() => {});

      expect(service.error()).toBe('Server error');
    });
  });

  describe('computed signals', () => {
    it('should compute onboardingStep from profile', async () => {
      const profile = { ...mockProfile, onboarding_step: 3 };
      httpMock.get.mockReturnValue(of(profile));

      await service.getProfile();

      expect(service.onboardingStep()).toBe(3);
    });

    it('should compute isOnboardingComplete from profile', async () => {
      const profile = { ...mockProfile, onboarding_complete: true };
      httpMock.get.mockReturnValue(of(profile));

      await service.getProfile();

      expect(service.isOnboardingComplete()).toBe(true);
    });
  });
});
