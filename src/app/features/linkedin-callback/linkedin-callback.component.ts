import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkedInService } from '../../core/services/linkedin.service';
import { ProfileService } from '../../core/services/profile.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-linkedin-callback',
  standalone: true,
  templateUrl: './linkedin-callback.component.html',
  styleUrl: './linkedin-callback.component.scss',
})
export class LinkedInCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly linkedInService = inject(LinkedInService);
  private readonly profileService = inject(ProfileService);
  private readonly toastService = inject(ToastService);

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error || !code) {
      this.toastService.error('LinkedIn connection cancelled');
      await this.router.navigate(['/cards']);
      return;
    }

    try {
      await this.linkedInService.handleCallback(code, state ?? '');
      await this.profileService.getProfile();
      this.toastService.success('LinkedIn connected successfully!');
    } catch {
      this.toastService.error('Failed to connect LinkedIn. Please try again from settings.');
    }

    await this.router.navigate(['/cards']);
  }
}
