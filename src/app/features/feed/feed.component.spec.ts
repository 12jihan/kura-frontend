import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedComponent } from './feed.component';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';

vi.mock('@angular/fire/auth');

const mockProfile: UserProfile = {
  id: '1',
  firebase_uid: 'uid-123',
  handle: 'testhandle',
  content_type: 'thought-leadership',
  brand_description: 'Test brand',
  keywords: ['SaaS'],
  ai_instructions: null,
  onboarding_step: 4,
  onboarding_complete: true,
  linkedin_connected: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let profileSignal: WritableSignal<UserProfile | null>;
  let profileServiceMock: Record<string, unknown>;
  let linkedInServiceMock: {
    initiateOAuth: ReturnType<typeof vi.fn>;
    isConnecting: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };

  beforeEach(async () => {
    localStorage.clear();

    profileSignal = signal<UserProfile | null>(null);

    profileServiceMock = {
      profile: profileSignal,
      isLoading: signal(false),
      error: signal<string | null>(null),
      onboardingStep: signal(4),
      isOnboardingComplete: signal(true),
    };

    linkedInServiceMock = {
      initiateOAuth: vi.fn(),
      isConnecting: signal(false),
      error: signal<string | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LinkedInService, useValue: linkedInServiceMock },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  function createComponent() {
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should show modal when linkedin_connected is false and onboarding complete', () => {
    profileSignal.set({ ...mockProfile, linkedin_connected: false });
    createComponent();

    expect(component.showLinkedInModal()).toBe(true);
  });

  it('should NOT show modal when linkedin_connected is true', () => {
    profileSignal.set({ ...mockProfile, linkedin_connected: true });
    createComponent();

    expect(component.showLinkedInModal()).toBe(false);
  });

  it('should NOT show modal when localStorage flag is set', () => {
    localStorage.setItem('kura_linkedin_prompt_shown', 'true');
    profileSignal.set({ ...mockProfile, linkedin_connected: false });
    createComponent();

    expect(component.showLinkedInModal()).toBe(false);
  });

  it('should NOT show modal when profile is null', () => {
    createComponent();
    expect(component.showLinkedInModal()).toBe(false);
  });

  it('should NOT show modal when onboarding is not complete', () => {
    profileSignal.set({ ...mockProfile, onboarding_complete: false });
    createComponent();

    expect(component.showLinkedInModal()).toBe(false);
  });

  it('should call initiateOAuth and set localStorage on connect', () => {
    profileSignal.set({ ...mockProfile });
    createComponent();

    component.onLinkedInConnect();

    expect(linkedInServiceMock.initiateOAuth).toHaveBeenCalled();
    expect(localStorage.getItem('kura_linkedin_prompt_shown')).toBe('true');
  });

  it('should close modal and set localStorage on skip', () => {
    profileSignal.set({ ...mockProfile });
    createComponent();

    expect(component.showLinkedInModal()).toBe(true);

    component.onLinkedInSkip();

    expect(component.showLinkedInModal()).toBe(false);
    expect(localStorage.getItem('kura_linkedin_prompt_shown')).toBe('true');
  });
});
