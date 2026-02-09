import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CardService, Card } from './card.service';
import { ProfileService, UserProfile } from './profile.service';

const mockCard: Card = {
  id: 'card-1',
  user_id: 'user-1',
  content: 'Test card content',
  original_content: 'Test card content',
  status: 'active',
  created_at: '2026-02-08T00:00:00Z',
  updated_at: '2026-02-08T00:00:00Z',
  platform: 'linkedin',
  is_edited: false,
};

const mockCard2: Card = {
  ...mockCard,
  id: 'card-2',
  content: 'Second card content',
  original_content: 'Second card content',
};

const mockProfile: UserProfile = {
  id: '1',
  firebase_uid: 'uid-123',
  handle: 'testhandle',
  content_type: 'thought-leadership',
  brand_description: 'Test brand',
  keywords: ['SaaS'],
  ai_instructions: 'Generated instructions here',
  onboarding_step: 4,
  onboarding_complete: true,
  linkedin_connected: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('CardService', () => {
  let service: CardService;
  let profileService: ProfileService;
  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CardService,
        ProfileService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(CardService);
    profileService = TestBed.inject(ProfileService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty cards array', () => {
      expect(service.cards()).toEqual([]);
    });

    it('should have isLoading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have null error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('generateInstructions', () => {
    it('should call POST /api/profile/ai-instructions and update ProfileService', async () => {
      httpMock.post.mockReturnValue(of(mockProfile));

      const result = await service.generateInstructions();

      expect(httpMock.post).toHaveBeenCalledWith('/api/profile/ai-instructions', {});
      expect(result).toEqual(mockProfile);
      expect(profileService.profile()).toEqual(mockProfile);
    });

    it('should set isLoading during request', async () => {
      httpMock.post.mockReturnValue(of(mockProfile));

      await service.generateInstructions();

      expect(service.isLoading()).toBe(false);
    });

    it('should set error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('Generation failed')));

      await service.generateInstructions().catch(() => {});

      expect(service.error()).toBe('Generation failed');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('getCards', () => {
    it('should call GET /api/cards and update cards signal', async () => {
      httpMock.get.mockReturnValue(of([mockCard, mockCard2]));

      const result = await service.getCards();

      expect(httpMock.get).toHaveBeenCalledWith('/api/cards');
      expect(result).toEqual([mockCard, mockCard2]);
      expect(service.cards()).toEqual([mockCard, mockCard2]);
    });

    it('should set error on failure', async () => {
      httpMock.get.mockReturnValue(throwError(() => new Error('Load failed')));

      await service.getCards().catch(() => {});

      expect(service.error()).toBe('Load failed');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('generateCards', () => {
    it('should call POST /api/cards/generate and append to cards signal', async () => {
      // Set up existing cards
      httpMock.get.mockReturnValue(of([mockCard]));
      await service.getCards();

      // Generate new cards
      httpMock.post.mockReturnValue(of([mockCard2]));
      const result = await service.generateCards();

      expect(httpMock.post).toHaveBeenCalledWith('/api/cards/generate', {});
      expect(result).toEqual([mockCard2]);
      expect(service.cards()).toEqual([mockCard, mockCard2]);
    });

    it('should append to empty cards array', async () => {
      httpMock.post.mockReturnValue(of([mockCard]));

      await service.generateCards();

      expect(service.cards()).toEqual([mockCard]);
    });

    it('should set error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('Generate failed')));

      await service.generateCards().catch(() => {});

      expect(service.error()).toBe('Generate failed');
    });
  });

  describe('regenerateCard', () => {
    it('should call POST /api/cards/:id/regenerate and replace card in signal', async () => {
      httpMock.get.mockReturnValue(of([mockCard, mockCard2]));
      await service.getCards();

      const regenerated = { ...mockCard, content: 'Regenerated content' };
      httpMock.post.mockReturnValue(of(regenerated));

      const result = await service.regenerateCard('card-1');

      expect(httpMock.post).toHaveBeenCalledWith('/api/cards/card-1/regenerate', {});
      expect(result.content).toBe('Regenerated content');
      expect(service.cards()[0].content).toBe('Regenerated content');
      expect(service.cards()[1]).toEqual(mockCard2);
    });

    it('should set error on failure', async () => {
      httpMock.post.mockReturnValue(throwError(() => new Error('Regenerate failed')));

      await service.regenerateCard('card-1').catch(() => {});

      expect(service.error()).toBe('Regenerate failed');
    });
  });

  describe('updateCard', () => {
    it('should call PATCH /api/cards/:id and replace card in signal', async () => {
      httpMock.get.mockReturnValue(of([mockCard]));
      await service.getCards();

      const updated = { ...mockCard, content: 'Edited content', is_edited: true };
      httpMock.patch.mockReturnValue(of(updated));

      const result = await service.updateCard('card-1', { content: 'Edited content' });

      expect(httpMock.patch).toHaveBeenCalledWith('/api/cards/card-1', { content: 'Edited content' });
      expect(result.content).toBe('Edited content');
      expect(service.cards()[0].content).toBe('Edited content');
    });

    it('should set error on failure', async () => {
      httpMock.patch.mockReturnValue(throwError(() => new Error('Update failed')));

      await service.updateCard('card-1', { content: 'x' }).catch(() => {});

      expect(service.error()).toBe('Update failed');
    });
  });

  describe('dismissCard', () => {
    it('should call DELETE /api/cards/:id and remove card from signal', async () => {
      httpMock.get.mockReturnValue(of([mockCard, mockCard2]));
      await service.getCards();

      httpMock.delete.mockReturnValue(of(undefined));

      await service.dismissCard('card-1');

      expect(httpMock.delete).toHaveBeenCalledWith('/api/cards/card-1');
      expect(service.cards()).toEqual([mockCard2]);
    });

    it('should result in empty array when dismissing last card', async () => {
      httpMock.get.mockReturnValue(of([mockCard]));
      await service.getCards();

      httpMock.delete.mockReturnValue(of(undefined));

      await service.dismissCard('card-1');

      expect(service.cards()).toEqual([]);
    });

    it('should set error on failure', async () => {
      httpMock.delete.mockReturnValue(throwError(() => new Error('Dismiss failed')));

      await service.dismissCard('card-1').catch(() => {});

      expect(service.error()).toBe('Dismiss failed');
    });
  });
});
