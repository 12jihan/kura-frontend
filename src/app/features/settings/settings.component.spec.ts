import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsComponent } from './settings.component';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';
import { ToastService } from '../../core/services/toast.service';

vi.mock('@angular/fire/auth');

const mockProfile: UserProfile = {
  id: '1',
  firebase_uid: 'uid-123',
  handle: 'testhandle',
  content_type: 'tech-startups',
  brand_description: 'A test brand description for testing',
  keywords: ['SaaS', 'startup'],
  ai_instructions: null,
  onboarding_step: 4,
  onboarding_complete: true,
  linkedin_connected: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let profileSignal: WritableSignal<UserProfile | null>;
  let profileServiceMock: Record<string, unknown>;
  let linkedInServiceMock: {
    initiateOAuth: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    isConnecting: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let toastServiceMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    profileSignal = signal<UserProfile | null>(mockProfile);

    profileServiceMock = {
      profile: profileSignal,
      isLoading: signal(false),
      error: signal<string | null>(null),
      onboardingStep: signal(4),
      isOnboardingComplete: signal(true),
      updateProfile: vi.fn().mockResolvedValue(mockProfile),
      getProfile: vi.fn().mockResolvedValue(mockProfile),
    };

    linkedInServiceMock = {
      initiateOAuth: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
      isConnecting: signal(false),
      error: signal<string | null>(null),
    };

    toastServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LinkedInService, useValue: linkedInServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createComponent() {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should populate form from profile on init', () => {
    createComponent();

    expect(component.settingsForm.get('handle')!.value).toBe('testhandle');
    expect(component.settingsForm.get('contentType')!.value).toBe('tech-startups');
    expect(component.settingsForm.get('brandDescription')!.value).toBe('A test brand description for testing');
    expect(component.keywords()).toEqual(['SaaS', 'startup']);
  });

  it('should detect custom content type and set "other"', () => {
    profileSignal.set({ ...mockProfile, content_type: 'Custom Niche' });
    createComponent();

    expect(component.settingsForm.get('contentType')!.value).toBe('other');
    expect(component.settingsForm.get('customContentType')!.value).toBe('Custom Niche');
    expect(component.isOtherSelected()).toBe(true);
  });

  it('should reject invalid handle', () => {
    createComponent();

    component.settingsForm.get('handle')!.setValue('');
    component.settingsForm.get('handle')!.markAsTouched();
    expect(component.settingsForm.get('handle')!.invalid).toBe(true);

    component.settingsForm.get('handle')!.setValue('a');
    expect(component.settingsForm.get('handle')!.hasError('minlength')).toBe(true);

    component.settingsForm.get('handle')!.setValue('valid_handle');
    expect(component.settingsForm.get('handle')!.valid).toBe(true);
  });

  it('should reject brand description under 10 characters', () => {
    createComponent();

    component.settingsForm.get('brandDescription')!.setValue('short');
    expect(component.settingsForm.get('brandDescription')!.hasError('minlength')).toBe(true);
  });

  it('should update description length on input', () => {
    createComponent();

    component.settingsForm.get('brandDescription')!.setValue('A new longer description for testing');
    expect(component.descriptionLength()).toBe(36);
  });

  it('should update keywords on tag change', () => {
    createComponent();

    component.onTagsChange(['new', 'keywords']);
    expect(component.keywords()).toEqual(['new', 'keywords']);
  });

  it('should call updateProfile on save with valid form', async () => {
    createComponent();

    component.settingsForm.get('handle')!.setValue('newhandle');
    component.settingsForm.markAsDirty();

    await component.onSave();

    expect(profileServiceMock['updateProfile']).toHaveBeenCalledWith({
      handle: 'newhandle',
      content_type: 'tech-startups',
      brand_description: 'A test brand description for testing',
      keywords: ['SaaS', 'startup'],
    });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Profile updated');
  });

  it('should send custom content type when "other" selected', async () => {
    createComponent();

    component.settingsForm.get('contentType')!.setValue('other');
    component.settingsForm.get('customContentType')!.setValue('My Custom Niche');
    component.settingsForm.markAsDirty();

    await component.onSave();

    expect(profileServiceMock['updateProfile']).toHaveBeenCalledWith(
      expect.objectContaining({ content_type: 'My Custom Niche' })
    );
  });

  it('should show error toast when save fails', async () => {
    (profileServiceMock['updateProfile'] as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));
    createComponent();

    component.settingsForm.markAsDirty();
    await component.onSave();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to update profile');
  });

  it('should not save when form is invalid', async () => {
    createComponent();

    component.settingsForm.get('handle')!.setValue('');
    await component.onSave();

    expect(profileServiceMock['updateProfile']).not.toHaveBeenCalled();
  });

  it('should show error when no keywords on save', async () => {
    createComponent();

    component.onTagsChange([]);
    component.settingsForm.markAsDirty();
    await component.onSave();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Please add at least one keyword');
    expect(profileServiceMock['updateProfile']).not.toHaveBeenCalled();
  });

  it('should show "Connect LinkedIn" when not connected', () => {
    profileSignal.set({ ...mockProfile, linkedin_connected: false });
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.settings__linkedin-badge');
    expect(badge?.textContent?.trim()).toBe('Not connected');
  });

  it('should show "Connected" badge when LinkedIn connected', () => {
    profileSignal.set({ ...mockProfile, linkedin_connected: true });
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.settings__linkedin-badge--connected');
    expect(badge?.textContent?.trim()).toBe('Connected');
  });

  it('should call initiateOAuth on connect', () => {
    createComponent();

    component.onConnectLinkedIn();
    expect(linkedInServiceMock.initiateOAuth).toHaveBeenCalled();
  });

  it('should call disconnect and refresh profile on disconnect', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    createComponent();

    await component.onDisconnectLinkedIn();

    expect(linkedInServiceMock.disconnect).toHaveBeenCalled();
    expect(profileServiceMock['getProfile']).toHaveBeenCalled();
    expect(toastServiceMock.success).toHaveBeenCalledWith('LinkedIn disconnected');
  });

  it('should not disconnect if user cancels confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    createComponent();

    await component.onDisconnectLinkedIn();

    expect(linkedInServiceMock.disconnect).not.toHaveBeenCalled();
  });

  it('should report unsaved changes when form is dirty', () => {
    createComponent();

    expect(component.hasUnsavedChanges()).toBe(false);

    component.settingsForm.get('handle')!.setValue('changed');
    component.settingsForm.markAsDirty();
    expect(component.hasUnsavedChanges()).toBe(true);
  });

  it('should report unsaved changes when keywords differ', () => {
    createComponent();

    expect(component.hasUnsavedChanges()).toBe(false);

    component.onTagsChange(['new', 'different', 'keywords']);
    expect(component.hasUnsavedChanges()).toBe(true);
  });
});
