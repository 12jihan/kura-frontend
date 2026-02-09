import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProfileService, UserProfile } from './profile.service';

export type CardStatus = 'active' | 'dismissed' | 'scheduled' | 'posted';

export interface Card {
  id: string;
  user_id: string;
  content: string;
  original_content: string;
  status: CardStatus;
  created_at: string;
  updated_at: string;
  platform: string;
  is_edited: boolean;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);

  private readonly _cards = signal<Card[]>([]);
  readonly cards = this._cards.asReadonly();
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async generateInstructions(): Promise<UserProfile> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const profile = await firstValueFrom(
        this.http.post<UserProfile>('/api/profile/ai-instructions', {})
      );
      this.profileService.setProfile(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate instructions';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getCards(): Promise<Card[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const cards = await firstValueFrom(
        this.http.get<Card[]>('/api/cards')
      );
      this._cards.set(cards);
      return cards;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load cards';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async generateCards(): Promise<Card[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const newCards = await firstValueFrom(
        this.http.post<Card[]>('/api/cards/generate', {})
      );
      this._cards.update(existing => [...existing, ...newCards]);
      return newCards;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate cards';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async regenerateCard(cardId: string): Promise<Card> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const card = await firstValueFrom(
        this.http.post<Card>(`/api/cards/${cardId}/regenerate`, {})
      );
      this._cards.update(cards =>
        cards.map(c => c.id === cardId ? card : c)
      );
      return card;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to regenerate card';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateCard(cardId: string, data: Partial<Card>): Promise<Card> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const card = await firstValueFrom(
        this.http.patch<Card>(`/api/cards/${cardId}`, data)
      );
      this._cards.update(cards =>
        cards.map(c => c.id === cardId ? card : c)
      );
      return card;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update card';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async dismissCard(cardId: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(
        this.http.delete(`/api/cards/${cardId}`)
      );
      this._cards.update(cards =>
        cards.filter(c => c.id !== cardId)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to dismiss card';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
