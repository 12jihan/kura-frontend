import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: {
    login: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof signal<string | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
  };
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      error: signal<string | null>(null),
      isLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering (AC#1)', () => {
    it('should render email input field', () => {
      const emailInput = fixture.nativeElement.querySelector(
        'app-form-input[formControlName="email"]'
      );
      expect(emailInput).toBeTruthy();
    });

    it('should render password input field', () => {
      const passwordInput = fixture.nativeElement.querySelector(
        'app-form-input[formControlName="password"]'
      );
      expect(passwordInput).toBeTruthy();
    });

    it('should render Log In button', () => {
      const button = fixture.nativeElement.querySelector('app-button');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Log In');
    });

    it('should render Forgot password link', () => {
      const forgotLink = fixture.nativeElement.querySelector(
        'a[routerLink="/password-reset"]'
      );
      expect(forgotLink).toBeTruthy();
      expect(forgotLink.textContent).toContain('Forgot password?');
    });

    it('should render register link for new users', () => {
      const registerLink = fixture.nativeElement.querySelector(
        'a[routerLink="/register"]'
      );
      expect(registerLink).toBeTruthy();
      expect(registerLink.textContent).toContain('Sign up');
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should show error for empty email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should show error for empty password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should have valid form when email and password are provided', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('Login Submission (AC#2, AC#3)', () => {
    it('should call AuthService.login on valid form submit', async () => {
      mockAuthService.login.mockResolvedValue(undefined);

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      await component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });

    it('should redirect to /cards on successful login', async () => {
      mockAuthService.login.mockResolvedValue(undefined);

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      await component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/cards']);
    });

    it('should display error message on login failure', async () => {
      const errorMessage = 'Invalid email or password';
      mockAuthService.error.set(errorMessage);
      mockAuthService.login.mockRejectedValue(new Error(errorMessage));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      await component.onSubmit();

      expect(component.submitError()).toBe(errorMessage);
    });

    it('should clear password field on error (AC#3)', async () => {
      mockAuthService.error.set('Invalid email or password');
      mockAuthService.login.mockRejectedValue(new Error('Invalid'));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      await component.onSubmit();

      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should not call AuthService.login on invalid form', () => {
      component.loginForm.setValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched on invalid submit', () => {
      component.loginForm.setValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(component.loginForm.get('email')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });
  });

  describe('Loading State (AC#6)', () => {
    it('should set isSubmitting to true during login', async () => {
      vi.useFakeTimers();
      let resolveLogin: () => void;
      mockAuthService.login.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveLogin = resolve;
          })
      );

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      const submitPromise = component.onSubmit();

      expect(component.isSubmitting()).toBe(true);

      resolveLogin!();
      await submitPromise;

      expect(component.isSubmitting()).toBe(false);
      vi.useRealTimers();
    });

    it('should disable form inputs during login', async () => {
      let resolveLogin: () => void;
      mockAuthService.login.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveLogin = resolve;
          })
      );

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      const submitPromise = component.onSubmit();

      // Form should be disabled during submission
      expect(component.loginForm.disabled).toBe(true);

      resolveLogin!();
      await submitPromise;
    });

    it('should re-enable form after login error', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Error'));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      await component.onSubmit();

      // Form should be re-enabled after error
      expect(component.loginForm.disabled).toBe(false);
    });

    it('should reset isSubmitting after login error', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Error'));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      await component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
    });
  });
});
