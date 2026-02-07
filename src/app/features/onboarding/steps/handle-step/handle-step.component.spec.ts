import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HandleStepComponent } from './handle-step.component';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('HandleStepComponent', () => {
  let component: HandleStepComponent;
  let fixture: ComponentFixture<HandleStepComponent>;
  let profileServiceMock: {
    completeOnboardingStep: ReturnType<typeof vi.fn>;
    profile: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let toastServiceMock: {
    error: ReturnType<typeof vi.fn>;
  };
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    profileServiceMock = {
      completeOnboardingStep: vi.fn(),
      profile: signal(null),
      isLoading: signal(false),
      error: signal<string | null>(null),
    };

    toastServiceMock = {
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HandleStepComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(HandleStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render handle form with input and button', () => {
    const title = fixture.nativeElement.querySelector('.handle-step__title');
    expect(title.textContent).toContain('handle');

    const input = fixture.nativeElement.querySelector('#handle-input');
    expect(input).toBeTruthy();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent.trim()).toBe('Next');
  });

  it('should have handle control with required validator', () => {
    const handleControl = component.handleControl;
    expect(handleControl).toBeTruthy();

    handleControl!.setValue('');
    expect(handleControl!.hasError('required')).toBe(true);
  });

  it('should have handle control with minLength(2) validator', () => {
    const handleControl = component.handleControl;
    handleControl!.setValue('a');
    expect(handleControl!.hasError('minlength')).toBe(true);

    handleControl!.setValue('ab');
    expect(handleControl!.hasError('minlength')).toBe(false);
  });

  it('should have handle control with maxLength(30) validator', () => {
    const handleControl = component.handleControl;
    handleControl!.setValue('a'.repeat(31));
    expect(handleControl!.hasError('maxlength')).toBe(true);

    handleControl!.setValue('a'.repeat(30));
    expect(handleControl!.hasError('maxlength')).toBe(false);
  });

  it('should have handle control with pattern validator for alphanumeric and underscores', () => {
    const handleControl = component.handleControl;

    handleControl!.setValue('valid_handle123');
    expect(handleControl!.valid).toBe(true);

    handleControl!.setValue('invalid-handle');
    expect(handleControl!.hasError('pattern')).toBe(true);

    handleControl!.setValue('has spaces');
    expect(handleControl!.hasError('pattern')).toBe(true);

    handleControl!.setValue('special@chars!');
    expect(handleControl!.hasError('pattern')).toBe(true);
  });

  it('should show validation error for empty handle', () => {
    const handleControl = component.handleControl;
    handleControl!.setValue('');
    handleControl!.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.form-input__error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe('Handle is required');
  });

  it('should show validation error for invalid characters', () => {
    const handleControl = component.handleControl;
    handleControl!.setValue('invalid-handle');
    handleControl!.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.form-input__error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('letters, numbers, and underscores');
  });

  it('should not call ProfileService when form is invalid', async () => {
    await component.onSubmit();
    expect(profileServiceMock.completeOnboardingStep).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when submitting invalid form', async () => {
    await component.onSubmit();
    expect(component.handleControl!.touched).toBe(true);
  });

  it('should call ProfileService.completeOnboardingStep on valid submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.handleForm.setValue({ handle: 'myhandle' });
    await component.onSubmit();

    expect(profileServiceMock.completeOnboardingStep).toHaveBeenCalledWith(1, { handle: 'myhandle' });
  });

  it('should navigate to step-2 on successful submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.handleForm.setValue({ handle: 'myhandle' });
    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-2']);
  });

  it('should show toast error on submission failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('API Error'));

    component.handleForm.setValue({ handle: 'myhandle' });
    await component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to save handle. Please try again.');
  });

  it('should set isSubmitting during submission', async () => {
    let resolvePromise!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    profileServiceMock.completeOnboardingStep.mockReturnValue(promise);

    component.handleForm.setValue({ handle: 'myhandle' });
    const submitPromise = component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    resolvePromise();
    await submitPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should reset isSubmitting on failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('fail'));

    component.handleForm.setValue({ handle: 'myhandle' });
    await component.onSubmit();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should have placeholder text for handle input', () => {
    const input = fixture.nativeElement.querySelector('#handle-input');
    expect(input.placeholder).toContain('YourHandle');
  });
});
