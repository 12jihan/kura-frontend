import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedComponent } from './feed.component';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';
import { CardService, Card } from '../../core/services/card.service';
import { ToastService } from '../../core/services/toast.service';

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

const mockCards: Card[] = [
  {
    id: 'card-1',
    user_id: 'user-1',
    content: 'First LinkedIn post content',
    original_content: 'First LinkedIn post content',
    status: 'active',
    created_at: '2026-02-08T10:00:00Z',
    updated_at: '2026-02-08T10:00:00Z',
    platform: 'linkedin',
    is_edited: false,
  },
  {
    id: 'card-2',
    user_id: 'user-1',
    content: 'Second LinkedIn post content',
    original_content: 'Second LinkedIn post content',
    status: 'active',
    created_at: '2026-02-08T10:05:00Z',
    updated_at: '2026-02-08T10:05:00Z',
    platform: 'linkedin',
    is_edited: false,
  },
];

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let profileSignal: WritableSignal<UserProfile | null>;
  let cardsSignal: WritableSignal<Card[]>;
  let isLoadingSignal: WritableSignal<boolean>;
  let errorSignal: WritableSignal<string | null>;
  let profileServiceMock: Record<string, unknown>;
  let linkedInServiceMock: {
    initiateOAuth: ReturnType<typeof vi.fn>;
    isConnecting: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let cardServiceMock: {
    cards: ReturnType<typeof computed>;
    isLoading: ReturnType<typeof computed>;
    error: ReturnType<typeof computed>;
    getCards: ReturnType<typeof vi.fn>;
    generateCards: ReturnType<typeof vi.fn>;
  };
  let toastServiceMock: {
    error: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    localStorage.clear();

    profileSignal = signal<UserProfile | null>(null);
    cardsSignal = signal<Card[]>([]);
    isLoadingSignal = signal(false);
    errorSignal = signal<string | null>(null);

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

    cardServiceMock = {
      cards: computed(() => cardsSignal()),
      isLoading: computed(() => isLoadingSignal()),
      error: computed(() => errorSignal()),
      getCards: vi.fn().mockResolvedValue([]),
      generateCards: vi.fn().mockResolvedValue([]),
    };

    toastServiceMock = {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LinkedInService, useValue: linkedInServiceMock },
        { provide: CardService, useValue: cardServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
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

  // --- Existing LinkedIn modal tests ---

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

  // --- On-demand generation tests ---

  it('should have isGenerating signal initialized to false', () => {
    createComponent();
    expect(component.isGenerating()).toBe(false);
  });

  it('should call cardService.generateCards on generateMoreCards', async () => {
    cardServiceMock.generateCards.mockResolvedValue([mockCards[0]]);
    createComponent();
    cardServiceMock.generateCards.mockClear();

    await component.generateMoreCards();
    expect(cardServiceMock.generateCards).toHaveBeenCalled();
  });

  it('should show success toast after successful generation', async () => {
    cardServiceMock.generateCards.mockResolvedValue([mockCards[0]]);
    createComponent();

    await component.generateMoreCards();
    expect(toastServiceMock.success).toHaveBeenCalledWith('5 new cards generated!');
  });

  it('should show error toast on generation failure', async () => {
    createComponent();
    cardServiceMock.generateCards.mockRejectedValue(new Error('fail'));
    toastServiceMock.error.mockClear();

    await component.generateMoreCards();
    expect(toastServiceMock.error).toHaveBeenCalledWith("Couldn't generate cards. Please try again.");
  });

  it('should set isGenerating to true during generation and false after', async () => {
    let resolveGenerate: (value: Card[]) => void;
    cardServiceMock.generateCards.mockImplementation(
      () => new Promise<Card[]>((resolve) => { resolveGenerate = resolve; })
    );
    createComponent();

    const promise = component.generateMoreCards();
    expect(component.isGenerating()).toBe(true);

    resolveGenerate!([mockCards[0]]);
    await promise;
    expect(component.isGenerating()).toBe(false);
  });

  it('should set isGenerating to false after generation error', async () => {
    cardServiceMock.generateCards.mockRejectedValue(new Error('fail'));
    createComponent();

    await component.generateMoreCards();
    expect(component.isGenerating()).toBe(false);
  });

  it('should render generate button when cards are loaded', () => {
    cardsSignal.set(mockCards);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const button = el.querySelector('.feed__generate app-button');
    expect(button).toBeTruthy();
  });

  it('should render generate button when cards array is empty (empty state)', () => {
    cardsSignal.set([]);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const button = el.querySelector('.feed__generate app-button');
    expect(button).toBeTruthy();
  });

  it('should render empty state message when cards array is empty', () => {
    cardsSignal.set([]);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const emptyMessage = el.querySelector('.feed__empty-message');
    expect(emptyMessage?.textContent).toContain('All caught up');
  });

  it('should NOT render empty state message when cards exist', () => {
    cardsSignal.set(mockCards);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const emptyMessage = el.querySelector('.feed__empty-message');
    expect(emptyMessage).toBeFalsy();
  });

  it('should show "Generating..." text when isGenerating is true', () => {
    cardsSignal.set(mockCards);
    createComponent();

    component.isGenerating.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.feed__generate app-button');
    expect(button?.textContent?.trim()).toContain('Generating...');
  });

  it('should disable generate button when isGenerating is true', () => {
    cardsSignal.set(mockCards);
    createComponent();

    component.isGenerating.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.feed__generate app-button button');
    expect(button?.disabled).toBe(true);
  });

  // --- Card loading tests ---

  it('should call getCards on init', async () => {
    createComponent();
    await fixture.whenStable();

    expect(cardServiceMock.getCards).toHaveBeenCalled();
  });

  it('should call generateCards when getCards returns empty array', async () => {
    cardServiceMock.getCards.mockResolvedValue([]);
    createComponent();
    await fixture.whenStable();

    expect(cardServiceMock.generateCards).toHaveBeenCalled();
  });

  it('should NOT call generateCards when getCards returns cards', async () => {
    cardServiceMock.getCards.mockResolvedValue(mockCards);
    createComponent();
    await fixture.whenStable();

    expect(cardServiceMock.generateCards).not.toHaveBeenCalled();
  });

  it('should display skeleton cards when isLoading is true', () => {
    isLoadingSignal.set(true);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const skeletons = el.querySelectorAll('app-card-skeleton');
    expect(skeletons.length).toBe(5);
  });

  it('should display cards after loading completes', () => {
    cardsSignal.set(mockCards);
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const cardItems = el.querySelectorAll('app-card-item');
    expect(cardItems.length).toBe(2);
  });

  it('should display error state when error signal is set', () => {
    errorSignal.set('Failed to load cards');
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const errorMsg = el.querySelector('.feed__error-message');
    expect(errorMsg?.textContent?.trim()).toBe("Couldn't load your cards");
  });

  it('should display retry button on error', () => {
    errorSignal.set('Failed to load cards');
    createComponent();

    const el: HTMLElement = fixture.nativeElement;
    const retryBtn = el.querySelector('.feed__error app-button');
    expect(retryBtn).toBeTruthy();
  });

  it('should call loadCards again when retry is clicked', async () => {
    cardServiceMock.getCards.mockResolvedValue([]);
    createComponent();
    await fixture.whenStable();

    cardServiceMock.getCards.mockClear();
    cardServiceMock.generateCards.mockClear();

    component.retryLoad();
    await fixture.whenStable();

    expect(cardServiceMock.getCards).toHaveBeenCalled();
  });

  it('should show toast on load failure', async () => {
    cardServiceMock.getCards.mockRejectedValue(new Error('Network error'));
    createComponent();
    await fixture.whenStable();

    expect(toastServiceMock.error).toHaveBeenCalledWith("Couldn't generate cards. Please try again.");
  });
});
