import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { ToastService } from '../services/toast.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockToastService: { error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRouter = { navigate: vi.fn().mockResolvedValue(true) };
    mockToastService = { error: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.clearAllMocks();
  });

  it('should pass through successful requests', () => {
    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toEqual({ data: 'test' });
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush({ data: 'test' });
  });

  it('should redirect to login on 401 error (AC#5)', () => {
    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      },
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should show toast notification on 401 error (AC#5)', () => {
    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(mockToastService.error).toHaveBeenCalledWith(
          'Session expired. Please log in again.'
        );
      },
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should not redirect on non-401 errors', () => {
    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        expect(mockToastService.error).not.toHaveBeenCalled();
      },
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('should not redirect on 403 errors', () => {
    httpClient.get('/api/test').subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      },
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(null, { status: 403, statusText: 'Forbidden' });
  });
});
