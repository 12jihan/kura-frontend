import { Component, inject, signal, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { LinkedInService } from '../../core/services/linkedin.service';
import { CardService } from '../../core/services/card.service';
import { ToastService } from '../../core/services/toast.service';
import { LinkedInConnectModalComponent } from '../../shared/components/linkedin-connect-modal/linkedin-connect-modal.component';
import { CardItemComponent } from '../../shared/components/card-item/card-item.component';
import { CardSkeletonComponent } from '../../shared/components/card-skeleton/card-skeleton.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [LinkedInConnectModalComponent, CardItemComponent, CardSkeletonComponent, ButtonComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly linkedInService = inject(LinkedInService);
  private readonly cardService = inject(CardService);
  private readonly toastService = inject(ToastService);

  readonly cards = this.cardService.cards;
  readonly isLoading = this.cardService.isLoading;
  readonly error = this.cardService.error;
  readonly isGenerating = signal(false);
  readonly showLinkedInModal = signal(false);

  ngOnInit(): void {
    this.checkLinkedInModal();
    this.loadCards();
  }

  private checkLinkedInModal(): void {
    const alreadyPrompted = localStorage.getItem('kura_linkedin_prompt_shown');
    const profile = this.profileService.profile();

    if (!alreadyPrompted && profile && !profile.linkedin_connected && profile.onboarding_complete) {
      this.showLinkedInModal.set(true);
    }
  }

  async loadCards(): Promise<void> {
    try {
      const cards = await this.cardService.getCards();
      if (cards.length === 0) {
        await this.cardService.generateCards();
      }
    } catch {
      this.toastService.error("Couldn't generate cards. Please try again.");
    }
  }

  async generateMoreCards(): Promise<void> {
    this.isGenerating.set(true);
    try {
      await this.cardService.generateCards();
      this.toastService.success('5 new cards generated!');
    } catch {
      this.toastService.error("Couldn't generate cards. Please try again.");
    } finally {
      this.isGenerating.set(false);
    }
  }

  retryLoad(): void {
    this.loadCards();
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
