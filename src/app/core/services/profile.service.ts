import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  handle: string | null;
  content_type: string | null;
  brand_description: string | null;
  keywords: string[];
  onboarding_step: number;
  onboarding_complete: boolean;
  ai_instructions: string | null;
  linkedin_connected: boolean;
  created_at: string;
  updated_at: string;
}

const INITIAL_PROFILE: UserProfile = {
  id: '',
  firebase_uid: '',
  email: '',
  handle: null,
  content_type: null,
  brand_description: null,
  keywords: [],
  onboarding_step: 0, // Important so step checks don't fail
  onboarding_complete: false,
  ai_instructions: null,
  linkedin_connected: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly _profile = signal<UserProfile | null>(null);
  readonly profile = this._profile.asReadonly();

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly onboardingStep = computed(() => this._profile()?.onboarding_step ?? 0);
  readonly isOnboardingComplete = computed(() => this._profile()?.onboarding_complete === true);

  setProfile(profile: UserProfile): void {
    this._profile.set(profile);
  }

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

  async buildProfile(data: Partial<UserProfile>): Promise<any> {
    this.isLoading.set(true);
    this.error.set(null);


    try {
      this._profile.update(current => {
        const base = current || { ...INITIAL_PROFILE };
        return {
          ...base,
          ...data
        }
      });
      console.log("Profile:", this.profile())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      this.error.set(message);
      throw err;
    }
    finally {
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
    const current_step: number = step;
    console.log(current_step)
    this._profile.update(current => {
      const base = current || { ...INITIAL_PROFILE };

      console.log("current", base);
      console.log("data", data);

      return {
        ...base,
        ...data,
        onboarding_step: step,
        onboarding_complete: true,
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
        this.http.post<UserProfile>('http://localhost:3000/api/profile/onboard', {
          step,
          data: {
            firebase_uid: currentProfile?.firebase_uid,
            email: currentProfile?.email,
            handle: currentProfile?.handle,
            content_type: currentProfile?.content_type,
            brand_description: currentProfile?.brand_description,
            keywords: currentProfile?.keywords,
            onboarding_step: currentProfile?.onboarding_step,
            onboarding_complete: currentProfile?.onboarding_complete,
            ai_instructions: currentProfile?.ai_instructions,
            linkedin_connected: currentProfile?.linkedin_connected,
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
