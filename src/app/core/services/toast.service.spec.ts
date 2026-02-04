import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should add a success toast', () => {
      service.success('Test success message');

      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Test success message');
    });

    it('should auto-dismiss success toast after 4 seconds', () => {
      service.success('Auto-dismiss test');
      expect(service.toasts().length).toBe(1);

      vi.advanceTimersByTime(4000);

      expect(service.toasts().length).toBe(0);
    });
  });

  describe('error', () => {
    it('should add an error toast', () => {
      service.error('Test error message');

      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].message).toBe('Test error message');
    });

    it('should NOT auto-dismiss error toast', () => {
      service.error('Error should persist');
      expect(service.toasts().length).toBe(1);

      vi.advanceTimersByTime(10000);

      expect(service.toasts().length).toBe(1);
    });
  });

  describe('info', () => {
    it('should add an info toast', () => {
      service.info('Test info message');

      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Test info message');
    });

    it('should auto-dismiss info toast after 4 seconds', () => {
      service.info('Auto-dismiss test');
      expect(service.toasts().length).toBe(1);

      vi.advanceTimersByTime(4000);

      expect(service.toasts().length).toBe(0);
    });
  });

  describe('dismiss', () => {
    it('should remove a specific toast by id', () => {
      service.success('Toast 1');
      service.error('Toast 2');

      const toasts = service.toasts();
      expect(toasts.length).toBe(2);

      service.dismiss(toasts[0].id);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Toast 2');
    });
  });

  describe('max toasts', () => {
    it('should only show last 3 toasts', () => {
      service.success('Toast 1');
      service.success('Toast 2');
      service.success('Toast 3');
      service.success('Toast 4');

      const visibleToasts = service.toasts();
      expect(visibleToasts.length).toBe(3);
      expect(visibleToasts[0].message).toBe('Toast 2');
      expect(visibleToasts[1].message).toBe('Toast 3');
      expect(visibleToasts[2].message).toBe('Toast 4');
    });
  });

  describe('unique ids', () => {
    it('should generate unique ids for each toast', () => {
      service.success('Toast 1');
      service.success('Toast 2');

      const toasts = service.toasts();
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });
  });
});
