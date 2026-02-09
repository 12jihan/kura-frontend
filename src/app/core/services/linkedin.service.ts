import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LinkedInService {
  private readonly http = inject(HttpClient);

  readonly isConnecting = signal(false);
  readonly error = signal<string | null>(null);

  initiateOAuth(): void {
    window.location.href = '/api/auth/linkedin';
  }

  async handleCallback(code: string, state: string): Promise<void> {
    this.isConnecting.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(
        this.http.post('/api/auth/linkedin/callback', { code, state })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect LinkedIn';
      this.error.set(message);
      throw err;
    } finally {
      this.isConnecting.set(false);
    }
  }

  async disconnect(): Promise<void> {
    this.isConnecting.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.http.delete('/api/auth/linkedin'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect LinkedIn';
      this.error.set(message);
      throw err;
    } finally {
      this.isConnecting.set(false);
    }
  }

  async getConnectionStatus(): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.http.get<{ connected: boolean }>('/api/auth/linkedin/status')
      );
      return result.connected;
    } catch {
      return false;
    }
  }
}
