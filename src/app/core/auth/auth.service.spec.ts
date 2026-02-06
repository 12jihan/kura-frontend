import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

const mocks = vi.hoisted(() => ({
  sendPasswordResetEmail: vi.fn(),
  authState: vi.fn(),
  signOut: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class MockAuth {},
  authState: mocks.authState,
  sendPasswordResetEmail: mocks.sendPasswordResetEmail,
  signOut: mocks.signOut,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  AuthError: class MockAuthError extends Error {},
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockAuth = {} as Auth;

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.authState.mockReturnValue(of(null));
    mocks.sendPasswordResetEmail.mockResolvedValue(undefined);
    mocks.signOut.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: mockAuth }],
    });

    service = TestBed.inject(AuthService);
  });

  describe('sendPasswordResetEmail', () => {
    it('should call Firebase sendPasswordResetEmail with auth and email', async () => {
      await service.sendPasswordResetEmail('test@example.com');
      expect(mocks.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com'
      );
    });

    it('should set isLoading to true during the request', async () => {
      let loadingDuringCall = false;
      mocks.sendPasswordResetEmail.mockImplementation(async () => {
        loadingDuringCall = service.isLoading();
      });

      await service.sendPasswordResetEmail('test@example.com');
      expect(loadingDuringCall).toBe(true);
    });

    it('should set isLoading to false after successful completion', async () => {
      await service.sendPasswordResetEmail('test@example.com');
      expect(service.isLoading()).toBe(false);
    });

    it('should silently handle errors without setting error signal (AC#4)', async () => {
      mocks.sendPasswordResetEmail.mockRejectedValue(
        new Error('auth/user-not-found')
      );

      await service.sendPasswordResetEmail('nonexistent@example.com');

      expect(service.error()).toBeNull();
    });

    it('should set isLoading to false even when error occurs', async () => {
      mocks.sendPasswordResetEmail.mockRejectedValue(
        new Error('network error')
      );

      await service.sendPasswordResetEmail('test@example.com');

      expect(service.isLoading()).toBe(false);
    });

    it('should not throw to prevent email enumeration (AC#4)', async () => {
      mocks.sendPasswordResetEmail.mockRejectedValue(
        new Error('auth/user-not-found')
      );

      await expect(
        service.sendPasswordResetEmail('test@example.com')
      ).resolves.toBeUndefined();
    });
  });
});
