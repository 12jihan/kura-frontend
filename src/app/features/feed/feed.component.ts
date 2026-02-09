import { Component, inject, signal, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';
import { LinkedInConnectModalComponent } from '../../shared/components/linkedin-connect-modal/linkedin-connect-modal.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [LinkedInConnectModalComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly linkedInService = inject(LinkedInService);

  readonly showLinkedInModal = signal(false);

  ngOnInit(): void {
    const alreadyPrompted = localStorage.getItem('kura_linkedin_prompt_shown');
    const profile = this.profileService.profile();

    if (!alreadyPrompted && profile && !profile.linkedin_connected && profile.onboarding_complete) {
      this.showLinkedInModal.set(true);
    }
  }

  onLinkedInConnect(): void {
    localStorage.setItem('kura_linkedin_prompt_shown', 'true');
    this.linkedInService.initiateOAuth();
  }

  onLinkedInSkip(): void {
    localStorage.setItem('kura_linkedin_prompt_shown', 'true');
    this.showLinkedInModal.set(false);
  }
}
