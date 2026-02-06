import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let mockAuthService: {
    sendPasswordResetEmail: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof signal<string | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
  };

  beforeEach(async () => {
    mockAuthService = {
      sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
      error: signal<string | null>(null),
      isLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering (AC#2)', () => {
    it('should render email input field', () => {
      const emailInput = fixture.nativeElement.querySelector(
        'app-form-input[formControlName="email"]'
      );
      expect(emailInput).toBeTruthy();
    });

    it('should render Send Reset Link button', () => {
      const button = fixture.nativeElement.querySelector('app-button');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Send Reset Link');
    });

    it('should render back to login link', () => {
      const backLink = fixture.nativeElement.querySelector(
        'a[routerLink="/login"]'
      );
      expect(backLink).toBeTruthy();
      expect(backLink.textContent).toContain('Back to login');
    });

    it('should display subtitle with instructions', () => {
      const subtitle = fixture.nativeElement.querySelector(
        '.password-reset__subtitle'
      );
      expect(subtitle.textContent).toContain('Enter your email address');
    });
  });

  describe('Email Validation (AC#5)', () => {
    it('should show error for invalid email format', () => {
      const emailControl = component.resetForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should show error for empty email', () => {
      const emailControl = component.resetForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should have valid form when valid email is provided', () => {
      component.resetForm.setValue({ email: 'test@example.com' });
      expect(component.resetForm.valid).toBe(true);
    });
  });

  describe('Reset Submission (AC#3, AC#4)', () => {
    it('should call AuthService.sendPasswordResetEmail on valid submit', async () => {
      component.resetForm.setValue({ email: 'test@example.com' });

      await component.onSubmit();

      expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should show success message after submission (AC#3)', async () => {
      component.resetForm.setValue({ email: 'test@example.com' });

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.isSubmitted()).toBe(true);
      const successMessage = fixture.nativeElement.querySelector(
        '.password-reset__success-message'
      );
      expect(successMessage).toBeTruthy();
      expect(successMessage.textContent).toContain('Reset link sent!');
    });

    it('should hide form after successful submission', async () => {
      component.resetForm.setValue({ email: 'test@example.com' });

      await component.onSubmit();
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector('.password-reset__form');
      expect(form).toBeFalsy();
    });

    it('should not call AuthService on invalid form', () => {
      component.resetForm.setValue({ email: '' });

      component.onSubmit();

      expect(mockAuthService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should mark fields as touched on invalid submit', () => {
      component.resetForm.setValue({ email: '' });

      component.onSubmit();

      expect(component.resetForm.get('email')?.touched).toBe(true);
    });
  });

  describe('Loading State (AC#6)', () => {
    it('should set isSubmitting to true during submission', async () => {
      let resolveSubmit!: () => void;
      mockAuthService.sendPasswordResetEmail.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      );

      component.resetForm.setValue({ email: 'test@example.com' });

      const submitPromise = component.onSubmit();

      expect(component.isSubmitting()).toBe(true);

      resolveSubmit();
      await submitPromise;

      expect(component.isSubmitting()).toBe(false);
    });

    it('should disable form during submission', async () => {
      let resolveSubmit!: () => void;
      mockAuthService.sendPasswordResetEmail.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      );

      component.resetForm.setValue({ email: 'test@example.com' });

      const submitPromise = component.onSubmit();

      expect(component.resetForm.disabled).toBe(true);

      resolveSubmit();
      await submitPromise;
    });
  });

  describe('Error Recovery', () => {
    it('should re-enable form if AuthService throws unexpected error', async () => {
      mockAuthService.sendPasswordResetEmail.mockRejectedValue(
        new Error('unexpected')
      );

      component.resetForm.setValue({ email: 'test@example.com' });
      await component.onSubmit();

      expect(component.resetForm.enabled).toBe(true);
      expect(component.isSubmitted()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Success State', () => {
    it('should display success icon after submission', async () => {
      component.resetForm.setValue({ email: 'test@example.com' });

      await component.onSubmit();
      fixture.detectChanges();

      const successIcon = fixture.nativeElement.querySelector(
        '.password-reset__success-icon'
      );
      expect(successIcon).toBeTruthy();
    });

    it('should still show back to login link in success state', async () => {
      component.resetForm.setValue({ email: 'test@example.com' });

      await component.onSubmit();
      fixture.detectChanges();

      const backLink = fixture.nativeElement.querySelector(
        'a[routerLink="/login"]'
      );
      expect(backLink).toBeTruthy();
    });
  });
});
