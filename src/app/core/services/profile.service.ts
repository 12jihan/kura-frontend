import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  handle: string | null;
  content_type: string | null;
  brand_description: string | null;
  keywords: string[];
  onboarding_step: number;
  onboarding_complete: boolean;
  linkedin_connected: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly _profile = signal<UserProfile | null>(null);
  readonly profile = this._profile.asReadonly();

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly onboardingStep = computed(() => this._profile()?.onboarding_step ?? 0);
  readonly isOnboardingComplete = computed(() => this._profile()?.onboarding_complete === true);

  async getProfile(): Promise<UserProfile> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const profile = await firstValueFrom(
        this.http.get<UserProfile>('/api/profile')
      );
      this._profile.set(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const profile = await firstValueFrom(
        this.http.patch<UserProfile>('/api/profile', data)
      );
      this._profile.set(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async completeOnboardingStep(step: number, data: Record<string, unknown>): Promise<UserProfile | null> {
    this._profile.update(current => {
      if (!current) return null;
      return {
        ...current,
        ...data,
        onboarding_step: step
      } as UserProfile;
    });

    // Here we're gonna check if it's the final step
    if (step < 4) {
      return Promise.resolve(this._profile());
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const currentProfile = this._profile();

      const profile = await firstValueFrom(
        this.http.post<UserProfile>('/api/profile/onboard', {
          step,
          data: {
            handle: currentProfile?.handle,
            content_type: currentProfile?.content_type,
            brand_description: currentProfile?.brand_description,
            keywords: currentProfile?.keywords,
          }
        })
      );

      this._profile.set(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save onboarding step';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
