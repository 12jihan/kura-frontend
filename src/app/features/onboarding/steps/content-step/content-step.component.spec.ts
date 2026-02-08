import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ContentStepComponent } from './content-step.component';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';

vi.mock('@angular/fire/auth');

describe('ContentStepComponent', () => {
  let component: ContentStepComponent;
  let fixture: ComponentFixture<ContentStepComponent>;
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
      imports: [ContentStepComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ContentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with title, dropdown, and buttons', () => {
    const title = fixture.nativeElement.querySelector('.content-step__title');
    expect(title.textContent).toContain('content');

    const select = fixture.nativeElement.querySelector('#content-type');
    expect(select).toBeTruthy();

    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    expect(buttons.length).toBe(2);
  });

  it('should have all predefined content type options in dropdown', () => {
    const options = fixture.nativeElement.querySelectorAll('#content-type option');
    // 7 predefined + 1 placeholder
    expect(options.length).toBe(8);

    const optionTexts = Array.from(options).map((o: any) => o.textContent.trim());
    expect(optionTexts).toContain('Tech & Startups');
    expect(optionTexts).toContain('Marketing');
    expect(optionTexts).toContain('Finance');
    expect(optionTexts).toContain('Health & Wellness');
    expect(optionTexts).toContain('Creative Arts');
    expect(optionTexts).toContain('Education');
    expect(optionTexts).toContain('Other');
  });

  it('should require content type selection', () => {
    const control = component.contentTypeControl;
    expect(control!.hasError('required')).toBe(true);

    control!.setValue('marketing');
    expect(control!.valid).toBe(true);
  });

  it('should show custom category input when "Other" is selected', () => {
    // Initially no custom input
    let customInput = fixture.nativeElement.querySelector('#custom-category');
    expect(customInput).toBeFalsy();

    // Select "Other"
    component.contentForm.get('contentType')!.setValue('other');
    fixture.detectChanges();

    customInput = fixture.nativeElement.querySelector('#custom-category');
    expect(customInput).toBeTruthy();
  });

  it('should hide custom category input when a predefined type is selected', () => {
    // Select "Other" first
    component.contentForm.get('contentType')!.setValue('other');
    fixture.detectChanges();

    let customInput = fixture.nativeElement.querySelector('#custom-category');
    expect(customInput).toBeTruthy();

    // Switch to predefined
    component.contentForm.get('contentType')!.setValue('marketing');
    fixture.detectChanges();

    customInput = fixture.nativeElement.querySelector('#custom-category');
    expect(customInput).toBeFalsy();
  });

  it('should require custom category when "Other" is selected', () => {
    component.contentForm.get('contentType')!.setValue('other');
    fixture.detectChanges();

    const customControl = component.customCategoryControl;
    expect(customControl!.hasError('required')).toBe(true);
  });

  it('should show validation error for empty custom category when Other is selected', () => {
    component.contentForm.get('contentType')!.setValue('other');
    component.customCategoryControl!.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.form-input__error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe('Please describe your content focus');
  });

  it('should not require custom category when predefined type is selected', () => {
    component.contentForm.get('contentType')!.setValue('marketing');
    const customControl = component.customCategoryControl;
    expect(customControl!.valid).toBe(true);
  });

  it('should not call ProfileService when form is invalid', async () => {
    await component.onSubmit();
    expect(profileServiceMock.completeOnboardingStep).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when submitting invalid form', async () => {
    await component.onSubmit();
    expect(component.contentTypeControl!.touched).toBe(true);
  });

  it('should call ProfileService with predefined content type label on submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.contentForm.get('contentType')!.setValue('tech-startups');
    await component.onSubmit();

    expect(profileServiceMock.completeOnboardingStep).toHaveBeenCalledWith(2, {
      content_type: 'Tech & Startups',
    });
  });

  it('should call ProfileService with custom category on submission when Other is selected', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.contentForm.get('contentType')!.setValue('other');
    component.contentForm.get('customCategory')!.setValue('Personal Development');
    await component.onSubmit();

    expect(profileServiceMock.completeOnboardingStep).toHaveBeenCalledWith(2, {
      content_type: 'Personal Development',
    });
  });

  it('should navigate to step-3 on successful submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.contentForm.get('contentType')!.setValue('marketing');
    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-3']);
  });

  it('should navigate to step-1 when Back is clicked', () => {
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-1']);
  });

  it('should show toast error on submission failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('API Error'));

    component.contentForm.get('contentType')!.setValue('marketing');
    await component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to save content type. Please try again.');
  });

  it('should set isSubmitting during submission', async () => {
    let resolvePromise!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    profileServiceMock.completeOnboardingStep.mockReturnValue(promise);

    component.contentForm.get('contentType')!.setValue('marketing');
    const submitPromise = component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    resolvePromise();
    await submitPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should reset isSubmitting on failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('fail'));

    component.contentForm.get('contentType')!.setValue('marketing');
    await component.onSubmit();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should show content type error when submitted without selection', () => {
    component.contentTypeControl!.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.form-group__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('select a content type');
  });

  it('should clear custom category when switching from Other to predefined', () => {
    component.contentForm.get('contentType')!.setValue('other');
    component.contentForm.get('customCategory')!.setValue('My Custom Category');

    component.contentForm.get('contentType')!.setValue('marketing');
    expect(component.contentForm.get('customCategory')!.value).toBe('');
  });
});
