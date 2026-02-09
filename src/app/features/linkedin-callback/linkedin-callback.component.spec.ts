import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { LinkedInCallbackComponent } from './linkedin-callback.component';
import { LinkedInService } from '../../core/services/linkedin.service';
import { ProfileService } from '../../core/services/profile.service';
import { ToastService } from '../../core/services/toast.service';

vi.mock('@angular/fire/auth');

describe('LinkedInCallbackComponent', () => {
  let component: LinkedInCallbackComponent;
  let fixture: ComponentFixture<LinkedInCallbackComponent>;
  let linkedInServiceMock: {
    handleCallback: ReturnType<typeof vi.fn>;
    isConnecting: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let profileServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    profile: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    onboardingStep: ReturnType<typeof signal<number>>;
    isOnboardingComplete: ReturnType<typeof signal<boolean>>;
  };
  let toastServiceMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;
  let queryParams: Record<string, string | null>;

  function createComponent() {
    fixture = TestBed.createComponent(LinkedInCallbackComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  }

  beforeEach(async () => {
    queryParams = {};

    linkedInServiceMock = {
      handleCallback: vi.fn(),
      isConnecting: signal(false),
      error: signal<string | null>(null),
    };

    profileServiceMock = {
      getProfile: vi.fn(),
      profile: signal(null),
      isLoading: signal(false),
      error: signal<string | null>(null),
      onboardingStep: signal(0),
      isOnboardingComplete: signal(false),
    };

    toastServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LinkedInCallbackComponent],
      providers: [
        provideRouter([]),
        { provide: LinkedInService, useValue: linkedInServiceMock },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => queryParams[key] ?? null,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should show loading spinner', () => {
    createComponent();
    const spinner = fixture.nativeElement.querySelector('.linkedin-callback__loader');
    expect(spinner).toBeTruthy();

    const text = fixture.nativeElement.querySelector('.linkedin-callback__text');
    expect(text.textContent).toContain('Connecting your LinkedIn account');
  });

  it('should call handleCallback and navigate to /cards on success', async () => {
    queryParams = { code: 'auth-code-123', state: 'state-abc' };
    linkedInServiceMock.handleCallback.mockResolvedValue(undefined);
    profileServiceMock.getProfile.mockResolvedValue(undefined);

    createComponent();
    await component.ngOnInit();

    expect(linkedInServiceMock.handleCallback).toHaveBeenCalledWith('auth-code-123', 'state-abc');
    expect(profileServiceMock.getProfile).toHaveBeenCalled();
    expect(toastServiceMock.success).toHaveBeenCalledWith('LinkedIn connected successfully!');
    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should show cancellation toast when code is missing', async () => {
    queryParams = {};

    createComponent();
    await component.ngOnInit();

    expect(linkedInServiceMock.handleCallback).not.toHaveBeenCalled();
    expect(toastServiceMock.error).toHaveBeenCalledWith('LinkedIn connection cancelled');
    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should show cancellation toast when error query param is present', async () => {
    queryParams = { error: 'access_denied' };

    createComponent();
    await component.ngOnInit();

    expect(linkedInServiceMock.handleCallback).not.toHaveBeenCalled();
    expect(toastServiceMock.error).toHaveBeenCalledWith('LinkedIn connection cancelled');
    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should show error toast on callback failure', async () => {
    queryParams = { code: 'bad-code', state: 'state' };
    linkedInServiceMock.handleCallback.mockRejectedValue(new Error('OAuth failed'));

    createComponent();
    await component.ngOnInit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to connect LinkedIn. Please try again from settings.');
    expect(navigateSpy).toHaveBeenCalledWith(['/cards']);
  });

  it('should use empty string for state when state param is missing', async () => {
    queryParams = { code: 'auth-code' };
    linkedInServiceMock.handleCallback.mockResolvedValue(undefined);
    profileServiceMock.getProfile.mockResolvedValue(undefined);

    createComponent();
    await component.ngOnInit();

    expect(linkedInServiceMock.handleCallback).toHaveBeenCalledWith('auth-code', '');
  });
});
