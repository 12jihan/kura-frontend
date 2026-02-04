import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastService, Toast } from '../../../core/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockToastService: {
    toasts: ReturnType<typeof signal<Toast[]>>;
    dismiss: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockToastService = {
      toasts: signal<Toast[]>([]),
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no toasts when empty', () => {
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });

  it('should render toasts when present', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Success message' },
      { id: '2', type: 'error', message: 'Error message' },
    ]);
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(2);
  });

  it('should apply correct class for success toast', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Success' },
    ]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast--success')).toBe(true);
  });

  it('should apply correct class for error toast', () => {
    mockToastService.toasts.set([{ id: '1', type: 'error', message: 'Error' }]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast--error')).toBe(true);
  });

  it('should apply correct class for info toast', () => {
    mockToastService.toasts.set([{ id: '1', type: 'info', message: 'Info' }]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast--info')).toBe(true);
  });

  it('should use role="alert" for error toasts', () => {
    mockToastService.toasts.set([{ id: '1', type: 'error', message: 'Error' }]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('should use role="status" for success toasts', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Success' },
    ]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('role')).toBe('status');
  });

  it('should use aria-live="assertive" for error toasts', () => {
    mockToastService.toasts.set([{ id: '1', type: 'error', message: 'Error' }]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('aria-live')).toBe('assertive');
  });

  it('should use aria-live="polite" for success toasts', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Success' },
    ]);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });

  it('should call dismiss when dismiss button is clicked', () => {
    mockToastService.toasts.set([
      { id: 'test-id', type: 'success', message: 'Success' },
    ]);
    fixture.detectChanges();

    const dismissButton = fixture.nativeElement.querySelector('.toast__dismiss');
    dismissButton.click();

    expect(mockToastService.dismiss).toHaveBeenCalledWith('test-id');
  });

  it('should have accessible dismiss button', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Success' },
    ]);
    fixture.detectChanges();

    const dismissButton = fixture.nativeElement.querySelector('.toast__dismiss');
    expect(dismissButton.getAttribute('aria-label')).toBe(
      'Dismiss notification'
    );
  });

  it('should display the toast message', () => {
    mockToastService.toasts.set([
      { id: '1', type: 'success', message: 'Test message content' },
    ]);
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.toast__message');
    expect(message.textContent).toContain('Test message content');
  });
});
