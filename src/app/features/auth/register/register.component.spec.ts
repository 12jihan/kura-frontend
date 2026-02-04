import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: {
    register: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof signal<string | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
  };
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn(),
      error: signal<string | null>(null),
      isLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form with required fields', () => {
    const title = fixture.nativeElement.querySelector('.register__title');
    expect(title.textContent).toBe('Create your account');

    const emailInput = fixture.nativeElement.querySelector('#register-email');
    expect(emailInput).toBeTruthy();

    const passwordInput = fixture.nativeElement.querySelector('#register-password');
    expect(passwordInput).toBeTruthy();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('should render link to login page', () => {
    const loginLink = fixture.nativeElement.querySelector('.register__link');
    expect(loginLink).toBeTruthy();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  it('should have email control with required and email validators', () => {
    const emailControl = component.emailControl;
    expect(emailControl).toBeTruthy();

    emailControl!.setValue('');
    expect(emailControl!.hasError('required')).toBe(true);

    emailControl!.setValue('invalid');
    expect(emailControl!.hasError('email')).toBe(true);

    emailControl!.setValue('valid@email.com');
    expect(emailControl!.valid).toBe(true);
  });

  it('should have password control with required and minLength validators', () => {
    const passwordControl = component.passwordControl;
    expect(passwordControl).toBeTruthy();

    passwordControl!.setValue('');
    expect(passwordControl!.hasError('required')).toBe(true);

    passwordControl!.setValue('short');
    expect(passwordControl!.hasError('minlength')).toBe(true);

    passwordControl!.setValue('longenough');
    expect(passwordControl!.valid).toBe(true);
  });

  it('should show email validation error for invalid format', () => {
    const emailControl = component.emailControl;
    emailControl!.setValue('invalid-email');
    emailControl!.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.form-input__error');
    expect(errorMessage.textContent).toBe('Please enter a valid email');
  });

  it('should show password validation error for short password', () => {
    const passwordControl = component.passwordControl;
    passwordControl!.setValue('short');
    passwordControl!.markAsTouched();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.form-input__error');
    const passwordError = Array.from(errors).find(
      (el: any) => el.textContent.includes('8 characters')
    );
    expect(passwordError).toBeTruthy();
  });

  it('should not call AuthService.register when form is invalid', async () => {
    await component.onSubmit();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call AuthService.register with correct values on valid form submission', async () => {
    authServiceMock.register.mockResolvedValue(undefined);

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('should redirect to cards page on successful registration', async () => {
    authServiceMock.register.mockResolvedValue(undefined);

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should display error message on registration failure', async () => {
    authServiceMock.register.mockRejectedValue(new Error('Registration failed'));
    authServiceMock.error.set('An account with this email already exists');

    component.registerForm.setValue({
      email: 'existing@example.com',
      password: 'password123',
    });

    await component.onSubmit();
    fixture.detectChanges();

    const errorAlert = fixture.nativeElement.querySelector('.register__error');
    expect(errorAlert).toBeTruthy();
    expect(errorAlert.textContent).toContain('An account with this email already exists');
  });

  it('should set isSubmitting to true during submission', async () => {
    let resolvePromise!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    authServiceMock.register.mockReturnValue(promise);

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    const submitPromise = component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    resolvePromise();
    await submitPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should mark all fields as touched when submitting invalid form', async () => {
    await component.onSubmit();

    expect(component.emailControl!.touched).toBe(true);
    expect(component.passwordControl!.touched).toBe(true);
  });

  it('should clear submit error before new submission', async () => {
    component.submitError.set('Previous error');
    authServiceMock.register.mockResolvedValue(undefined);

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    // The submitError is cleared at the start of onSubmit
    const submitPromise = component.onSubmit();
    expect(component.submitError()).toBe(null);
    await submitPromise;
  });
});
