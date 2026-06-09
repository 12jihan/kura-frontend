import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserInfo } from 'firebase/auth';

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

export interface TestResponse {
  message: REQ_MSG,
  body: UserProfile;
}

export type REQ_MSG = "success" | "failure";


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
      const _profile = this.profile();
      if (!_profile) throw Error("Profile currently null");
      return _profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async refreshProfile(uid: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.http.get<any>('http://localhost:3000/api/user', {
        params: {
          uid: uid
        }
      }));

      if (res.message == "error") throw Error("Retrieval failed...");
      const newProfile = res.data;
      console.log("loginGetProfile", newProfile);

      // TODO: This is gonna stay off for now because truthfully this whole section is meant to be used for updating the profile locally, should anything change. So it doesn't really make sense to update through patching in the api.

      // this.updateProfile(newProfile);
      // await this.router.navigate(['/cards']);
    } catch (err) {
      this.error.set("err")
      console.log(" Profile Refresh Error", err);
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
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const user_prof = data;
      const user_id = 1;

      console.log("updateProfile() - user_prof:", user_prof);

      const profile = await firstValueFrom(
        this.http.get<UserProfile>('/api/user', {
          params: { id: user_id }
        })
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
    // const current_step: number = step;
    this._profile.update(current => {
      const base = current || { ...INITIAL_PROFILE };

      return {
        ...base,
        ...data,
        onboarding_step: step,
        onboarding_complete: true,
      } as UserProfile;
    });

    if (step < 4) {
      return Promise.resolve(this._profile());
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      console.log("Checking the updated")
      const currentProfile = this._profile();

      // this.http.get("/health").subscribe({
      //   next: (data) => console.log(data),
      //   error: (err) => console.error(err),
      //   complete: () => console.log('Fetch Complete'),
      // });

      const _resp: TestResponse = await firstValueFrom(
        this.http.post<TestResponse>('/api/profile/onboard', {
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


      const _msg: REQ_MSG = _resp.message;
      const _prof: UserProfile = _resp.body;

      console.log("req response:", _msg);
      console.log("profile received:", _prof);

      this._profile.set(_prof);

      return this._profile();
    } catch (err) {
      console.log("there was an error:", err);
      const message = err instanceof Error ? err.message : 'Failed to save onboarding step';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async get_user(fb_uid: string): Promise<UserProfile | null> {
    const _uid: string = fb_uid;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const profile = await firstValueFrom(
        this.http.get<UserProfile>('/api/user', {
          params: {
            uid: _uid
          }
        })
      );

      console.log("User Found:", profile);
      this._profile.set(profile);


      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get user';
      this.error.set(message);
      throw err;
    } finally {
      this.isLoading.set(false);
    };
  }
}
