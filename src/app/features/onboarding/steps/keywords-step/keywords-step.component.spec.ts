import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { KeywordsStepComponent } from './keywords-step.component';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';

vi.mock('@angular/fire/auth');

describe('KeywordsStepComponent', () => {
  let component: KeywordsStepComponent;
  let fixture: ComponentFixture<KeywordsStepComponent>;
  let profileServiceMock: {
    completeOnboardingStep: ReturnType<typeof vi.fn>;
    profile: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let toastServiceMock: {
    success: ReturnType<typeof vi.fn>;
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
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [KeywordsStepComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(KeywordsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tag input, helper text, Back and Complete Setup buttons', () => {
    const tagInput = fixture.nativeElement.querySelector('app-tag-input');
    expect(tagInput).toBeTruthy();

    const hint = fixture.nativeElement.querySelector('.form-group__hint');
    expect(hint).toBeTruthy();
    expect(hint.textContent).toContain('Add keywords that define your niche');

    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    expect(buttons.length).toBe(2);
  });

  it('should show validation error when submitting with no keywords', async () => {
    await component.onSubmit();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.form-group__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Add at least one keyword');
  });

  it('should not call ProfileService when submitting with no keywords', async () => {
    await component.onSubmit();
    expect(profileServiceMock.completeOnboardingStep).not.toHaveBeenCalled();
  });

  it('should call ProfileService with correct data on valid submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.keywords.set(['indie hacking', 'SaaS']);
    await component.onSubmit();

    expect(profileServiceMock.completeOnboardingStep).toHaveBeenCalledWith(4, {
      keywords: ['indie hacking', 'SaaS'],
    });
  });

  it('should navigate to /cards on successful submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.keywords.set(['bootstrapping']);
    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should show welcome toast on successful submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.keywords.set(['bootstrapping']);
    await component.onSubmit();

    expect(toastServiceMock.success).toHaveBeenCalledWith('Welcome to Kura!');
  });

  it('should navigate to step 3 when Back button is clicked', () => {
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-3']);
  });

  it('should disable form during submission (loading state)', async () => {
    let resolvePromise!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    profileServiceMock.completeOnboardingStep.mockReturnValue(promise);

    component.keywords.set(['test keyword']);
    const submitPromise = component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelectorAll('app-button')[0].querySelector('button');
    expect(backButton.disabled).toBe(true);

    resolvePromise();
    await submitPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should show error toast on submission failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('API Error'));

    component.keywords.set(['keyword']);
    await component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to complete setup. Please try again.');
  });

  it('should reset isSubmitting on failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('fail'));

    component.keywords.set(['keyword']);
    await component.onSubmit();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should clear error when tags are added', () => {
    component.showError.set(true);
    component.onTagsChange(['new tag']);

    expect(component.showError()).toBe(false);
  });
});
