import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { LinkedInService } from './linkedin.service';
import { of, throwError } from 'rxjs';

describe('LinkedInService', () => {
  let service: LinkedInService;
  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(LinkedInService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have isConnecting false', () => {
      expect(service.isConnecting()).toBe(false);
    });

    it('should have null error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('initiateOAuth', () => {
    it('should redirect to backend OAuth endpoint', () => {
      const originalLocation = window.location.href;
      const hrefSetter = vi.fn();

      Object.defineProperty(window, 'location', {
        value: { href: originalLocation },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window.location, 'href', {
        set: hrefSetter,
        get: () => originalLocation,
        configurable: true,
      });

      service.initiateOAuth();

      expect(hrefSetter).toHaveBeenCalledWith('/api/auth/linkedin');

      Object.defineProperty(window, 'location', {
        value: { href: originalLocation },
        writable: true,
        configurable: true,
      });
    });
  });

  describe('handleCallback', () => {
    it('should send POST with code and state', async () => {
      httpMock.post.mockReturnValue(of({}));

      await service.handleCallback('auth-code-123', 'state-abc');

      expect(httpMock.post).toHaveBeenCalledWith(
        '/api/auth/linkedin/callback',
        { code: 'auth-code-123', state: 'state-abc' }
      );
    });

    it('should set isConnecting during request', async () => {
      httpMock.post.mockReturnValue(of({}));

      await service.handleCallback('code', 'state');

      expect(service.isConnecting()).toBe(false);
    });

    it('should set error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('OAuth failed')));

      await service.handleCallback('code', 'state').catch(() => {});

      expect(service.error()).toBe('OAuth failed');
      expect(service.isConnecting()).toBe(false);
    });

    it('should rethrow error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('OAuth failed')));

      await expect(service.handleCallback('code', 'state')).rejects.toThrow('OAuth failed');
    });
  });

  describe('disconnect', () => {
    it('should send DELETE request', async () => {
      httpMock.delete.mockReturnValue(of({}));

      await service.disconnect();

      expect(httpMock.delete).toHaveBeenCalledWith('/api/auth/linkedin');
    });

    it('should set error on failure', async () => {
      httpMock.delete.mockReturnValue(throwError(() => new Error('Disconnect failed')));

      await service.disconnect().catch(() => {});

      expect(service.error()).toBe('Disconnect failed');
      expect(service.isConnecting()).toBe(false);
    });
  });

  describe('getConnectionStatus', () => {
    it('should return true when connected', async () => {
      httpMock.get.mockReturnValue(of({ connected: true }));

      const result = await service.getConnectionStatus();

      expect(httpMock.get).toHaveBeenCalledWith('/api/auth/linkedin/status');
      expect(result).toBe(true);
    });

    it('should return false when not connected', async () => {
      httpMock.get.mockReturnValue(of({ connected: false }));

      const result = await service.getConnectionStatus();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      httpMock.get.mockReturnValue(throwError(() => new Error('Network error')));

      const result = await service.getConnectionStatus();

      expect(result).toBe(false);
    });
  });
});
