import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  authState,
  User,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly profile = inject(ProfileService);

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly user$: Observable<User | null> = authState(this.auth);

  constructor() {
    this.user$.subscribe({
      next: (user) => {
        this._user.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  get isAuthenticated(): boolean {
    return this._user() !== null;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Logout failed');
      throw err; // Re-throw so calling code knows logout failed
    }
  }

  async register(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const fbData = await createUserWithEmailAndPassword(this.auth, email, password);
      this.profile.buildProfile({ firebase_uid: fbData.user.uid, email: fbData.user.email ?? email });
      console.log("profile in auth:", this.profile.profile());
      // User will be automatically set via authState subscription
    } catch (err) {
      const authError = err as AuthError;
      this.error.set(this.mapFirebaseError(authError.code));
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const fbData = await signInWithEmailAndPassword(this.auth, email, password);
      await this.profile.refreshProfile(fbData.user.uid);
      console.log(this.profile.profile());
    } catch (err) {
      const authError = err as AuthError;
      this.error.set(this.mapFirebaseError(authError.code));
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await sendPasswordResetEmail(this.auth, email);
      // Success - Firebase sends the email
    } catch (err) {
      // IMPORTANT: For security, we don't expose whether the email exists
      // Log the error internally but don't show to user (AC#4)
      console.error('Password reset error:', err);
      // Don't set error or throw - always appear successful to prevent email enumeration
    } finally {
      this.isLoading.set(false);
    }
  }

  private mapFirebaseError(code: string): string {
    switch (code) {
      // Registration errors
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Please enter a valid email';
      case 'auth/weak-password':
        return 'Password must be at least 8 characters';
      case 'auth/operation-not-allowed':
        return 'Registration is currently disabled';
      // Login errors
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      // Network errors
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}
