import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { VoiceStepComponent } from './voice-step.component';
import { ProfileService } from '../../../../core/services/profile.service';
import { ToastService } from '../../../../core/services/toast.service';

vi.mock('@angular/fire/auth');

describe('VoiceStepComponent', () => {
  let component: VoiceStepComponent;
  let fixture: ComponentFixture<VoiceStepComponent>;
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
      imports: [VoiceStepComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(VoiceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with textarea, character counter, helper text, and Back/Next buttons', () => {
    const title = fixture.nativeElement.querySelector('.voice-step__title');
    expect(title.textContent).toContain('brand voice');

    const textarea = fixture.nativeElement.querySelector('#brand-description');
    expect(textarea).toBeTruthy();

    const counter = fixture.nativeElement.querySelector('.form-group__counter');
    expect(counter).toBeTruthy();
    expect(counter.textContent).toContain('0 / 500');

    const hint = fixture.nativeElement.querySelector('.form-group__hint');
    expect(hint).toBeTruthy();
    expect(hint.textContent).toContain('Describe how you want your content to sound');

    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    expect(buttons.length).toBe(2);
  });

  it('should accept textarea input and update character count', () => {
    component.voiceForm.get('brandDescription')!.setValue('Hello world');
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.form-group__counter');
    expect(counter.textContent).toContain('11 / 500');
  });

  it('should show minlength validation error when submitting with less than 10 characters', async () => {
    const control = component.voiceForm.get('brandDescription')!;
    control.setValue('Short');
    control.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.form-group__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('at least 10 characters');
  });

  it('should show required validation error when submitting empty textarea', async () => {
    await component.onSubmit();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.form-group__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('required');
  });

  it('should show over-limit indicator and disable Next when typing over 500 characters', () => {
    const longText = 'a'.repeat(501);
    const control = component.voiceForm.get('brandDescription')!;
    control.setValue(longText);
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.form-group__counter');
    expect(counter.classList.contains('form-group__counter--over')).toBe(true);
    expect(component.isOverLimit()).toBe(true);

    const nextButton = fixture.nativeElement.querySelectorAll('app-button')[1].querySelector('button');
    expect(nextButton.disabled).toBe(true);
  });

  it('should call ProfileService with correct brand_description on valid submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.voiceForm.get('brandDescription')!.setValue('Practical advice for solo founders, no fluff');
    await component.onSubmit();

    expect(profileServiceMock.completeOnboardingStep).toHaveBeenCalledWith(3, {
      brand_description: 'Practical advice for solo founders, no fluff',
    });
  });

  it('should navigate to step 4 on successful submission', async () => {
    profileServiceMock.completeOnboardingStep.mockResolvedValue(undefined);

    component.voiceForm.get('brandDescription')!.setValue('Practical advice for solo founders, no fluff');
    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-4']);
  });

  it('should navigate to step 2 when Back button is clicked', () => {
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding/step-2']);
  });

  it('should disable form during submission (loading state)', async () => {
    let resolvePromise!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    profileServiceMock.completeOnboardingStep.mockReturnValue(promise);

    component.voiceForm.get('brandDescription')!.setValue('Practical advice for solo founders, no fluff');
    const submitPromise = component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('#brand-description');
    expect(textarea.readOnly).toBe(true);

    const backButton = fixture.nativeElement.querySelectorAll('app-button')[0].querySelector('button');
    expect(backButton.disabled).toBe(true);

    resolvePromise();
    await submitPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  it('should show toast error on submission failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('API Error'));

    component.voiceForm.get('brandDescription')!.setValue('Practical advice for solo founders, no fluff');
    await component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to save brand description. Please try again.');
  });

  it('should not call ProfileService when form is invalid', async () => {
    await component.onSubmit();
    expect(profileServiceMock.completeOnboardingStep).not.toHaveBeenCalled();
  });

  it('should reset isSubmitting on failure', async () => {
    profileServiceMock.completeOnboardingStep.mockRejectedValue(new Error('fail'));

    component.voiceForm.get('brandDescription')!.setValue('Valid description text');
    await component.onSubmit();

    expect(component.isSubmitting()).toBe(false);
  });
});
